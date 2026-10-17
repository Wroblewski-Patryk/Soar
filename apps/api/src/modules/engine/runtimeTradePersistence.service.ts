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
      await lockExchangeOrderIdentity(tx, input.userId, input.orderId);
      const existing = await tx.trade.findFirst({
        where: { userId: input.userId, orderId: input.orderId, lifecycleAction: 'OPEN' },
        select: { id: true },
      });
      if (!existing) await tx.trade.create({ data });
      await writeRuntimeTradeTelemetry({
        tx, userId: input.userId, botId: input.botId!, sessionId: input.runtimeSessionId!,
        orderId: input.orderId, positionId: input.positionId, symbol: input.symbol,
        strategyId: input.strategyId, direction: input.side === 'BUY' ? 'LONG' : 'SHORT',
        eventType: 'POSITION_OPENED', eventAt: input.eventAt ?? new Date(),
        price: input.price, positionQty: input.quantity,
        afterEventWrite: input.afterTelemetryEventWrite,
      });
      if (input.dedupeKey) await tx.runtimeExecutionDedupe.update({
        where: { dedupeKey: input.dedupeKey },
        data: { status: 'SUCCEEDED', orderId: input.orderId,
          positionId: input.positionId, errorClass: null, lastSeenAt: new Date() },
      });
    });
    return { telemetryRecorded: true } as const;
  }
  await prisma.trade.create({ data });
};
