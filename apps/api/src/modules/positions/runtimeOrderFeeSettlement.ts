import { Prisma } from '@prisma/client';

/** Settles a runtime OPEN/DCA fee only after the exchange has confirmed the full order fee. */
export const settleRuntimeOrderFee = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  orderId: string;
}) => {
  const { tx } = input;
  const order = await tx.order.findFirst({
    where: { id: input.orderId, userId: input.userId },
    select: { fee: true, feeSource: true, feePending: true, botId: true, symbol: true },
  });
  if (!order?.botId || order.feeSource !== 'EXCHANGE_FILL' || order.feePending ||
    order.fee == null || !Number.isFinite(order.fee)) return;
  const trades = await tx.trade.findMany({
    where: { orderId: input.orderId, userId: input.userId, lifecycleAction: { in: ['OPEN', 'DCA'] } },
    select: { id: true, fee: true, feeSource: true, feePending: true },
  });
  if (trades.length === 0 || trades.some((trade) => trade.feeSource !== 'EXCHANGE_FILL' ||
    trade.feePending || trade.fee == null || Math.abs(trade.fee - order.fee!) > 1e-8)) return;
  if (trades.length !== 1) throw new Error('Ambiguous runtime entry fee settlement trades');
  const events = await tx.botRuntimeEvent.findMany({
    where: {
      userId: input.userId, botId: order.botId,
      eventType: { in: ['POSITION_OPENED', 'DCA_EXECUTED'] },
      payload: { path: ['orderId'], equals: input.orderId },
    },
    select: { id: true },
  });
  if (events.length === 0) return;
  if (events.length !== 1) throw new Error('Ambiguous runtime entry fee settlement events');
  await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "BotRuntimeEvent" WHERE "id" = ${events[0].id} FOR UPDATE`);
  const event = await tx.botRuntimeEvent.findUniqueOrThrow({ where: { id: events[0].id } });
  const payload = event.payload && typeof event.payload === 'object' && !Array.isArray(event.payload)
    ? event.payload as Record<string, unknown> : {};
  const previous = typeof payload.feeSettlement === 'number' && Number.isFinite(payload.feeSettlement)
    ? payload.feeSettlement : null;
  if (payload.financialFeePending !== true && previous == null) return;
  const delta = order.fee - (previous ?? 0);
  if (delta !== 0) {
    await tx.botRuntimeSymbolStat.upsert({
      where: { sessionId_symbol: { sessionId: event.sessionId, symbol: order.symbol } },
      create: {
        userId: event.userId, botId: event.botId, sessionId: event.sessionId,
        symbol: order.symbol, feesPaid: order.fee, lastTradeAt: event.eventAt,
      },
      update: { feesPaid: { increment: delta } },
    });
  }
  await tx.botRuntimeEvent.update({
    where: { id: event.id },
    data: { payload: {
      ...payload, financialFeePending: false, feeSettlement: order.fee,
    } as Prisma.InputJsonValue },
  });
};
