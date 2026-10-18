import { Exchange, Order, Prisma, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';

export type LiveFillCandidate = {
  intentId: string | null;
  orderId: string;
  userId: string;
  exchange: Exchange | null;
  marketType: TradeMarket | null;
  symbol: string;
  clientOrderId: string | null;
  exchangeOrderId: string | null;
  createdAt: Date;
  botId: string | null;
  walletId: string | null;
  side: 'BUY' | 'SELL' | null;
  quantity: number | null;
  localStatus: Order['status'] | null;
  localFilledQuantity: number | null;
  feePending: boolean;
};

const readPayload = (value: Prisma.JsonValue | null) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, Prisma.JsonValue>
    : null;
const readId = (value: Prisma.JsonValue | undefined): string | null =>
  typeof value === 'string' && value.trim() ? value : null;
const readSide = (value: Prisma.JsonValue | undefined): 'BUY' | 'SELL' | null =>
  value === 'BUY' || value === 'SELL' ? value : null;
const readQuantity = (value: Prisma.JsonValue | undefined): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;

const needsFillRead = (
  order: Pick<Order, 'status' | 'filledQuantity' | 'feePending' | 'feeSource'>,
  fillCount: number,
  tradeCount: number,
  fillQuantity: number | null
) =>
  order.status === 'PENDING' || order.status === 'OPEN' || order.status === 'PARTIALLY_FILLED' ||
  (order.status === 'FILLED' && (!Number.isFinite(order.filledQuantity) || order.filledQuantity <= 0)) ||
  (order.filledQuantity > 0 && (
    order.feePending || order.feeSource !== 'EXCHANGE_FILL' || fillCount === 0 ||
    tradeCount === 0 || fillQuantity == null || !Number.isFinite(fillQuantity) ||
    // A fixed absolute epsilon can hide a whole fill on a small-quantity
    // symbol. Scale floating-point roundoff by this order's actual quantity.
    Math.abs(fillQuantity - order.filledQuantity) >
      16 * Number.EPSILON * Math.max(Math.abs(fillQuantity), order.filledQuantity) * Math.max(1, fillCount)
  ));

// Both cursors are durable database IDs. A caller can resume after a restart
// without retaining an in-memory queue; this function performs no venue I/O.
export const findLiveFillCandidatePage = async (input: {
  limit?: number;
  intentCursor?: string;
  orderCursor?: string;
  includeIntents?: boolean;
  includeOrders?: boolean;
} = {}): Promise<{
  candidates: LiveFillCandidate[];
  nextIntentCursor: string | null;
  nextOrderCursor: string | null;
}> => {
  const limit = Math.min(Math.max(input.limit ?? 100, 1), 200);
  const [intents, orders] = await Promise.all([
    input.includeIntents === false ? Promise.resolve([]) : prisma.liveOrderIntent.findMany({
      ...(input.intentCursor ? { cursor: { id: input.intentCursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], take: limit,
    }),
    input.includeOrders === false ? Promise.resolve([]) : prisma.order.findMany({
      where: {
        origin: { in: ['BOT', 'USER'] },
        AND: [
          { OR: [
            { wallet: { is: { mode: 'LIVE' } } },
            { bot: { is: { mode: 'LIVE' } } },
            { trades: { some: { executionMode: 'LIVE' } } },
          ] },
          { OR: [
            { status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED', 'FILLED'] } },
            { filledQuantity: { gt: 0 }, feePending: true },
            { filledQuantity: { gt: 0 }, feeSource: { not: 'EXCHANGE_FILL' } },
            { filledQuantity: { gt: 0 }, fills: { none: {} } },
            { filledQuantity: { gt: 0 }, trades: { none: {} } },
          ] },
        ],
      },
      include: { _count: { select: { fills: true, trades: true } } },
      ...(input.orderCursor ? { cursor: { id: input.orderCursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], take: limit,
    }),
  ]);
  const associatedOrders = await prisma.order.findMany({
    where: { id: { in: intents.map((intent) => intent.id) } },
    include: { _count: { select: { fills: true, trades: true } } },
  });
  const orderIntents = await prisma.liveOrderIntent.findMany({
    where: { id: { in: orders.map((order) => order.id) } },
  });
  const fillTotals = await prisma.orderFill.groupBy({
    by: ['orderId'],
    where: { orderId: { in: [...new Set([
      ...associatedOrders.map((order) => order.id), ...orders.map((order) => order.id),
    ])] } },
    _sum: { quantity: true },
  });
  const fillQuantityByOrder = new Map(fillTotals.map((row) => [row.orderId, row._sum.quantity]));
  const associatedById = new Map(associatedOrders.map((order) => [order.id, order]));
  const intentById = new Map(intents.map((intent) => [intent.id, intent]));
  const orderIntentById = new Map(orderIntents.map((intent) => [intent.id, intent]));
  const candidates: LiveFillCandidate[] = [];
  for (const intent of intents) {
    const order = associatedById.get(intent.id);
    if (order && !needsFillRead(order, order._count.fills, order._count.trades,
      fillQuantityByOrder.get(order.id) ?? null)) continue;
    const payload = readPayload(intent.payload);
    candidates.push({
      intentId: intent.id, orderId: intent.id, userId: intent.userId,
      exchange: intent.exchange, marketType: intent.marketType, symbol: intent.symbol,
      clientOrderId: intent.clientOrderId, exchangeOrderId: order?.exchangeOrderId ?? null,
      createdAt: intent.createdAt, botId: readId(payload?.botId) ?? order?.botId ?? null,
      walletId: readId(payload?.walletId) ?? order?.walletId ?? null,
      side: readSide(payload?.side) ?? order?.side ?? null,
      quantity: readQuantity(payload?.quantity) ?? order?.quantity ?? null,
      localStatus: order?.status ?? null, localFilledQuantity: order?.filledQuantity ?? null,
      feePending: order?.feePending ?? false,
    });
  }
  for (const order of orders) {
    if (intentById.has(order.id)) continue;
    if (!needsFillRead(order, order._count.fills, order._count.trades,
      fillQuantityByOrder.get(order.id) ?? null)) continue;
    const intent = orderIntentById.get(order.id);
    const payload = readPayload(intent?.payload ?? null);
    // Legacy local orders lack a durable venue/account link. They are visible
    // to the finalizer but the lookup service returns UNKNOWN for them.
    candidates.push({
      intentId: intent?.id ?? null, orderId: order.id, userId: order.userId,
      exchange: intent?.exchange ?? null, marketType: intent?.marketType ?? null,
      symbol: intent?.symbol ?? order.symbol,
      clientOrderId: intent?.clientOrderId ?? null, exchangeOrderId: order.exchangeOrderId,
      createdAt: intent?.createdAt ?? order.submittedAt ?? order.createdAt,
      botId: readId(payload?.botId) ?? order.botId,
      walletId: readId(payload?.walletId) ?? order.walletId,
      side: readSide(payload?.side) ?? order.side,
      quantity: readQuantity(payload?.quantity) ?? order.quantity,
      localStatus: order.status, localFilledQuantity: order.filledQuantity,
      feePending: order.feePending,
    });
  }
  return {
    candidates,
    nextIntentCursor: intents.length === limit ? intents.at(-1)!.id : null,
    nextOrderCursor: orders.length === limit ? orders.at(-1)!.id : null,
  };
};
