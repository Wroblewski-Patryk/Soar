import { Prisma } from '@prisma/client';

import { writeRuntimeTradeTelemetry } from '../engine/runtimeTradeTelemetry.transaction';

/** Materializes runtime telemetry in the same transaction when the exchange event wins the fill race. */
export const writeRuntimeTelemetryFromExchangeFill = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  orderId: string;
  eventAt: Date;
}) => {
  const { tx } = input;
  const intent = await tx.liveOrderIntent.findUnique({
    where: { id: input.orderId }, select: { clientOrderId: true },
  });
  if (!intent?.clientOrderId.startsWith('soar_')) return;
  const order = await tx.order.findFirst({
    where: { id: input.orderId, userId: input.userId, status: 'FILLED', origin: 'BOT',
      botId: { not: null }, positionId: { not: null } },
    include: { position: { select: { status: true, quantity: true, closeReason: true } } },
  });
  if (!order?.botId || !order.positionId || !order.position) return;
  const trades = await tx.trade.findMany({
    where: { userId: input.userId, orderId: order.id,
      lifecycleAction: { in: ['OPEN', 'DCA', 'CLOSE'] } },
    select: { lifecycleAction: true, price: true, quantity: true,
      realizedPnl: true, fee: true, executedAt: true },
  });
  if (trades.length !== 1) return;
  const trade = trades[0];
  if (trade.lifecycleAction === 'CLOSE' && order.position.status !== 'CLOSED') return;
  const eventType = trade.lifecycleAction === 'OPEN' ? 'POSITION_OPENED'
    : trade.lifecycleAction === 'DCA' ? 'DCA_EXECUTED' : 'POSITION_CLOSED';
  const existing = await tx.botRuntimeEvent.findFirst({
    where: { userId: input.userId, botId: order.botId, eventType,
      payload: { path: ['orderId'], equals: order.id } }, select: { id: true },
  });
  if (existing) return;
  const sessionTime = order.submittedAt ?? order.createdAt;
  const session = await tx.botRuntimeSession.findFirst({
    where: { userId: input.userId, botId: order.botId, mode: 'LIVE',
      startedAt: { lte: sessionTime },
      OR: [{ finishedAt: null }, { finishedAt: { gte: sessionTime } }] },
    orderBy: { startedAt: 'desc' }, select: { id: true },
  });
  const sessionId = session?.id ?? (await tx.botRuntimeSession.create({
    data: { userId: input.userId, botId: order.botId, mode: 'LIVE',
      status: 'COMPLETED', startedAt: sessionTime, finishedAt: input.eventAt,
      metadata: { source: 'runtime_exchange_fill_recovery', orderId: order.id } },
    select: { id: true },
  })).id;
  await writeRuntimeTradeTelemetry({
    tx, userId: input.userId, botId: order.botId, sessionId,
    orderId: order.id, positionId: order.positionId,
    symbol: order.symbol, strategyId: order.strategyId,
    direction: trade.lifecycleAction === 'CLOSE' ? 'EXIT'
      : order.side === 'BUY' ? 'LONG' : 'SHORT',
    eventType, eventAt: trade.executedAt ?? input.eventAt,
    price: trade.price,
    positionQty: trade.lifecycleAction === 'CLOSE' ? 0 : order.position.quantity,
    realizedPnl: trade.realizedPnl,
    exitFee: trade.lifecycleAction === 'CLOSE' ? trade.fee : null,
    reason: order.position.closeReason,
  });
};
