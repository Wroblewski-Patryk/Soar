import { prisma } from '../../prisma/client';
import { lockExchangeOrderIdentity } from '../orders/orders.exchangeIdentityLock';
import type { RuntimeTradeGateway } from './executionOrchestrator.service';
import { writeRuntimeTradeTelemetry } from './runtimeTradeTelemetry.transaction';

type TradeInput = Parameters<RuntimeTradeGateway['createTrade']>[0];

export const persistRuntimeTrade = async (input: TradeInput) => {
  const data = {
    userId: input.userId, botId: input.botId,
    walletId: input.walletId, strategyId: input.strategyId,
    orderId: input.orderId, positionId: input.positionId,
    symbol: input.symbol, side: input.side,
    lifecycleAction: input.lifecycleAction ?? 'UNKNOWN',
    price: input.price, quantity: input.quantity,
    fee: input.fee, feeSource: input.feeSource ?? 'ESTIMATED',
    feePending: input.feePending ?? false,
    feeCurrency: input.feeCurrency ?? null, effectiveFeeRate: input.effectiveFeeRate ?? null,
    exchangeTradeId: input.exchangeTradeId ?? null,
    realizedPnl: input.realizedPnl,
    closeReason: input.closeReason ?? null, closeInitiator: input.closeInitiator ?? null,
    origin: input.origin ?? 'BOT',
    managementMode: input.managementMode ?? 'BOT_MANAGED', executionMode: input.executionMode,
  };
  if (input.executionMode === 'LIVE' && input.lifecycleAction === 'OPEN' &&
      input.botId && input.runtimeSessionId) {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirstOrThrow({
        where: { id: input.orderId, userId: input.userId },
        select: { exchangeOrderId: true, status: true, positionId: true,
          botId: true, origin: true },
      });
      if (order.status !== 'FILLED' || order.positionId !== input.positionId ||
          order.botId !== input.botId || order.origin !== 'BOT') {
        throw new Error('Runtime OPEN Order and Position are not canonical');
      }
      if (!order.exchangeOrderId) throw new Error('Runtime OPEN has no exchange order identity');
      await lockExchangeOrderIdentity(tx, input.userId, order.exchangeOrderId);
      const session = await tx.botRuntimeSession.findFirst({
        where: { id: input.runtimeSessionId, userId: input.userId,
          botId: input.botId, mode: 'LIVE' }, select: { id: true },
      });
      if (!session) throw new Error('Runtime OPEN session does not match bot and user');
      const existing = await tx.trade.findMany({
        where: { userId: input.userId, orderId: input.orderId, lifecycleAction: 'OPEN' },
        select: { id: true, positionId: true, botId: true },
      });
      if (existing.length > 1) throw new Error('Ambiguous runtime OPEN trades for order');
      if (existing.length === 1 && (existing[0].positionId !== input.positionId ||
          existing[0].botId !== input.botId)) {
        throw new Error('Runtime OPEN Trade does not match canonical Order');
      }
      if (existing.length === 0) await tx.trade.create({ data });
      await writeRuntimeTradeTelemetry({
        tx, userId: input.userId, botId: input.botId!, sessionId: input.runtimeSessionId!,
        orderId: input.orderId, positionId: input.positionId, symbol: input.symbol,
        strategyId: input.strategyId, direction: input.side === 'BUY' ? 'LONG' : 'SHORT',
        eventType: 'POSITION_OPENED', eventAt: input.eventAt ?? new Date(),
        price: input.price, positionQty: input.quantity,
        afterEventWrite: input.afterTelemetryEventWrite,
      });
      if (input.dedupeKey) {
        const updated = await tx.runtimeExecutionDedupe.updateMany({
          where: { dedupeKey: input.dedupeKey, userId: input.userId,
            botId: input.botId, commandType: 'OPEN' },
          data: { status: 'SUCCEEDED', orderId: input.orderId,
            positionId: input.positionId, errorClass: null, lastSeenAt: new Date() },
        });
        if (updated.count !== 1) throw new Error('Runtime OPEN dedupe does not match bot and user');
      }
    }, { timeout: 30_000 });
    return { telemetryRecorded: true } as const;
  }
  await prisma.trade.create({ data });
};
