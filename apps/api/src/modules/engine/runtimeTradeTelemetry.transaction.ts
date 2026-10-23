import { Prisma, SignalDirection } from '@prisma/client';

import { settleImportedRuntimeCloseFinancials } from '../positions/importedPositionRuntimeFinancialSettlement';
import { settleRuntimeOrderFee } from '../positions/runtimeOrderFeeSettlement';

type TradeEvent = 'POSITION_OPENED' | 'DCA_EXECUTED' | 'POSITION_CLOSED';

/** The caller holds the order lock and writes the Trade in this transaction. */
export const writeRuntimeTradeTelemetry = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  botId: string;
  sessionId: string;
  orderId: string;
  positionId: string;
  symbol: string;
  strategyId?: string | null;
  direction?: SignalDirection;
  eventType: TradeEvent;
  eventAt: Date;
  price: number;
  positionQty: number;
  realizedPnl?: number | null;
  exitFee?: number | null;
  reason?: string | null;
  afterEventWrite?: () => Promise<void>;
}) => {
  const { tx } = input;
  const existing = await tx.botRuntimeEvent.findMany({
    where: { userId: input.userId, botId: input.botId,
      eventType: input.eventType, payload: { path: ['orderId'], equals: input.orderId } },
    select: { id: true, payload: true },
  });
  if (existing.length > 1) throw new Error('Ambiguous runtime execution telemetry');
  if (existing.length === 1) {
    const payload = existing[0].payload;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
      (payload as Record<string, unknown>).telemetryCommitted !== true) {
      throw new Error('Runtime execution telemetry needs audited legacy repair');
    }
    return;
  }
  const payload = {
    symbol: input.symbol,
    direction: input.direction ?? null,
    mode: 'LIVE',
    status: input.eventType === 'POSITION_OPENED' ? 'opened'
      : input.eventType === 'POSITION_CLOSED' ? 'closed' : 'dca',
    reason: input.reason ?? null,
    orderId: input.orderId, positionId: input.positionId,
    positionQty: input.positionQty, lastPrice: input.price,
    financialPnlPending: input.eventType === 'POSITION_CLOSED',
    financialFeePending: input.eventType !== 'POSITION_CLOSED',
    telemetryCommitted: true,
  };
  await tx.botRuntimeEvent.create({ data: {
    userId: input.userId, botId: input.botId, sessionId: input.sessionId,
    eventType: input.eventType, level: 'INFO', symbol: input.symbol,
    strategyId: input.strategyId ?? null, signalDirection: input.direction,
    message: input.eventType === 'DCA_EXECUTED' ? 'Runtime DCA executed'
      : `Runtime execution ${payload.status} for ${input.symbol} (${input.direction ?? 'n/a'})`,
    payload: payload as Prisma.InputJsonValue, eventAt: input.eventAt,
  } });
  await input.afterEventWrite?.();
  const countIncrements = input.eventType === 'DCA_EXECUTED' ? { dcaCount: 1 }
    : input.eventType === 'POSITION_CLOSED' ? { closedTrades: 1 } : {};
  const openPositionCount = input.eventType === 'POSITION_CLOSED' ? 0 : 1;
  const openPositionQty = input.eventType === 'POSITION_CLOSED' ? 0 : input.positionQty;
  await tx.botRuntimeSymbolStat.upsert({
    where: { sessionId_symbol: { sessionId: input.sessionId, symbol: input.symbol } },
    create: { userId: input.userId, botId: input.botId, sessionId: input.sessionId,
      symbol: input.symbol, ...countIncrements, openPositionCount, openPositionQty,
      lastPrice: input.price, lastTradeAt: input.eventAt },
    update: { ...Object.fromEntries(Object.entries(countIncrements).map(([key, value]) =>
      [key, { increment: value }])), openPositionCount, openPositionQty,
      lastPrice: input.price, lastTradeAt: input.eventAt },
  });
  if (input.eventType === 'POSITION_CLOSED') {
    if (input.realizedPnl != null && input.exitFee != null) {
      await settleImportedRuntimeCloseFinancials({
        tx, userId: input.userId, positionId: input.positionId,
        symbol: input.symbol, realizedPnl: input.realizedPnl, exitFees: input.exitFee,
      });
    }
  } else {
    await settleRuntimeOrderFee({ tx, userId: input.userId, orderId: input.orderId });
  }
};
