import type { listRuntimeOpenOrders } from './runtimeSessionPositionsRead.repository';

type RuntimeOpenOrderRow = Awaited<ReturnType<typeof listRuntimeOpenOrders>>[number];

export const RUNTIME_OPEN_ORDER_DEDUPE_CANDIDATE_LIMIT = 500;

export const resolveRuntimeTakeoverStatus = (input: {
  origin: string;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  syncState: string;
  botId: string | null;
}) => {
  if (input.origin !== 'EXCHANGE_SYNC') return null;
  if (input.managementMode === 'MANUAL_MANAGED') return 'MANUAL_ONLY';
  if (input.botId) return 'OWNED_AND_MANAGED';
  return input.syncState === 'DRIFT' ? 'AMBIGUOUS' : 'UNOWNED';
};

const selectPreferredRuntimeOpenOrder = (
  current: RuntimeOpenOrderRow,
  candidate: RuntimeOpenOrderRow
): RuntimeOpenOrderRow => {
  if (current.origin === candidate.origin) {
    return current.updatedAt >= candidate.updatedAt ? current : candidate;
  }
  if (candidate.origin === 'EXCHANGE_SYNC') return candidate;
  if (current.origin === 'EXCHANGE_SYNC') return current;
  return current.updatedAt >= candidate.updatedAt ? current : candidate;
};

const dedupeRuntimeOpenOrders = (orders: RuntimeOpenOrderRow[]) => {
  const byIdentity = new Map<string, RuntimeOpenOrderRow>();

  for (const order of orders) {
    const exchangeOrderId = order.exchangeOrderId?.trim();
    const identity = exchangeOrderId ? `exchange:${exchangeOrderId}` : `local:${order.id}`;
    const existing = byIdentity.get(identity);
    if (!existing) {
      byIdentity.set(identity, order);
      continue;
    }
    byIdentity.set(identity, selectPreferredRuntimeOpenOrder(existing, order));
  }

  return [...byIdentity.values()].sort((left, right) => {
    const leftTime = left.createdAt.getTime();
    const rightTime = right.createdAt.getTime();
    if (leftTime !== rightTime) return rightTime - leftTime;
    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });
};

export const selectRuntimeOpenOrders = (orders: RuntimeOpenOrderRow[], limit: number) => {
  const items = dedupeRuntimeOpenOrders(orders);
  return { count: items.length, items: items.slice(0, limit) };
};
