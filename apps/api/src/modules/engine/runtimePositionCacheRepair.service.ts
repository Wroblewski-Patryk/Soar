import { createClient } from 'redis';
import { prisma } from '../../prisma/client';
import { tryRebasePositionManagementProtection } from './positionManagement.service';
import { hasMaterialCanonicalBasisDrift } from './runtimePositionAutomationStateRebase';
import { parseTrustedRuntimePositionState } from './runtimePositionState.store';

type Redis = Pick<ReturnType<typeof createClient>, 'get' | 'eval'>;
export type CacheRepairResult =
  | { kind: 'CLEAN' | 'REPAIRED' | 'OUT_OF_SCOPE' }
  | { kind: 'PENDING'; reason: string };

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cacheKey = (positionId: string) => `runtime:position-state:${positionId}`;
const CAS_CACHE = `local current = redis.call('GET', KEYS[1])
if ARGV[4] == '1' then
  if current then return 0 end
elseif current ~= ARGV[1] then return 0 end
if ARGV[2] == 'delete' then return redis.call('DEL', KEYS[1]) end
redis.call('SET', KEYS[1], ARGV[2], 'PX', ARGV[3]); return 1`;

const liveBotScope = {
  origin: 'BOT' as const,
  managementMode: 'BOT_MANAGED' as const,
  botId: { not: null },
  bot: { is: { mode: 'LIVE' as const } },
};

export const findRuntimeCacheRepairPage = async (input: {
  cursor?: string | null; limit: number; userId?: string;
}) => {
  const rows = await prisma.position.findMany({
    where: { ...liveBotScope, ...(input.userId ? { userId: input.userId } : {}),
      status: { in: ['OPEN', 'CLOSED'] },
      ...(input.cursor ? { id: { gt: input.cursor } } : {}) },
    select: { id: true }, orderBy: { id: 'asc' }, take: Math.min(100, Math.max(1, input.limit)),
  });
  return { ids: rows.map((row) => row.id),
    nextCursor: rows.length === input.limit ? rows.at(-1)!.id : null };
};

export const repairRuntimePositionCacheOnce = async (input: {
  positionId: string; redis: Redis;
}): Promise<CacheRepairResult> => {
  const position = await prisma.position.findFirst({
    where: { id: input.positionId, ...liveBotScope },
    select: { id: true, userId: true, botId: true, walletId: true, origin: true, symbol: true,
      side: true, status: true, syncState: true, continuityState: true,
      quantity: true, entryPrice: true, leverage: true, updatedAt: true },
  });
  if (!position || (position.status !== 'OPEN' && position.status !== 'CLOSED')) {
    return { kind: 'OUT_OF_SCOPE' };
  }
  const key = cacheKey(position.id);
  const raw = await input.redis.get(key);
  if (position.status === 'CLOSED') {
    if (raw == null) return { kind: 'CLEAN' };
    const latest = await prisma.position.findUnique({
      where: { id: position.id }, select: { status: true, updatedAt: true },
    });
    if (latest?.status !== 'CLOSED' || latest.updatedAt.getTime() !== position.updatedAt.getTime()) {
      return { kind: 'PENDING', reason: 'POSITION_CHANGED' };
    }
    const changed = await input.redis.eval(CAS_CACHE, { keys: [key],
      arguments: [raw, 'delete', String(CACHE_TTL_MS), '0'] });
    return Number(changed) === 1 ? { kind: 'REPAIRED' }
      : { kind: 'PENDING', reason: 'CACHE_CHANGED' };
  }
  if (position.syncState !== 'IN_SYNC' ||
      (position.continuityState !== 'CONFIRMED' && position.continuityState !== 'RECOVERING') ||
      !Number.isFinite(position.quantity) || position.quantity <= 0 ||
      !Number.isFinite(position.entryPrice) || position.entryPrice <= 0 ||
      !Number.isFinite(position.leverage) || position.leverage < 1) {
    return { kind: 'PENDING', reason: 'CANONICAL_POSITION_UNCONFIRMED' };
  }
  if (raw == null) return { kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' };
  let previous = null;
  try { previous = parseTrustedRuntimePositionState(JSON.parse(raw)); }
  catch { /* Keep damaged protection pending for operator repair. */ }
  if (!previous) return { kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' };
  const protection = tryRebasePositionManagementProtection(previous,
    position.entryPrice, position.side, position.leverage);
  if (!protection) return { kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' };
  if (!hasMaterialCanonicalBasisDrift({ position, state: previous })) {
    return { kind: 'CLEAN' };
  }
  const trades = await prisma.trade.findMany({
    where: { userId: position.userId, positionId: position.id,
      lifecycleAction: 'DCA' },
    select: { orderId: true, price: true, quantity: true, executedAt: true,
      botId: true, walletId: true, symbol: true, side: true,
      origin: true, managementMode: true, executionMode: true },
    orderBy: [{ executedAt: 'asc' }, { id: 'asc' }],
  });
  const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
  if (trades.some((trade) => trade.botId !== position.botId ||
      trade.walletId !== position.walletId || trade.symbol !== position.symbol ||
      trade.side !== entrySide || trade.origin !== 'BOT' ||
      trade.managementMode !== 'BOT_MANAGED' || trade.executionMode !== 'LIVE' ||
      !Number.isFinite(trade.quantity) || trade.quantity <= 0 ||
      !Number.isFinite(trade.price) || trade.price <= 0)) {
    return { kind: 'PENDING', reason: 'DCA_TRADE_SCOPE_UNCONFIRMED' };
  }
  const orderIds = trades.map((trade) => trade.orderId).filter((id): id is string => id != null);
  if (orderIds.length !== trades.length || new Set(orderIds).size !== trades.length) {
    return { kind: 'PENDING', reason: 'DCA_TRADE_AMBIGUOUS' };
  }
  let indices: number[] = [];
  if (orderIds.length > 0) {
    const [orders, dedupes] = await Promise.all([
      prisma.order.findMany({ where: { id: { in: orderIds } },
        select: { id: true, userId: true, botId: true, walletId: true,
          positionId: true, symbol: true, side: true, origin: true,
          syncState: true, status: true, filledQuantity: true } }),
      prisma.runtimeExecutionDedupe.findMany({ where: { userId: position.userId,
        positionId: position.id, orderId: { in: orderIds },
        commandType: 'DCA', status: 'SUCCEEDED' },
        select: { orderId: true, botId: true, symbol: true, commandFingerprint: true } }),
    ]);
    if (orders.length !== trades.length || dedupes.length !== trades.length ||
        new Set(dedupes.map((row) => row.orderId)).size !== trades.length ||
        orders.some((order) => order.userId !== position.userId ||
          order.botId !== position.botId || order.walletId !== position.walletId ||
          order.positionId !== position.id || order.symbol !== position.symbol ||
          order.side !== entrySide || order.origin !== 'BOT' ||
          order.syncState !== 'IN_SYNC' || order.status !== 'FILLED' ||
          !trades.some((trade) => trade.orderId === order.id &&
            Math.abs(trade.quantity - order.filledQuantity) <=
              16 * Number.EPSILON * Math.max(trade.quantity, order.filledQuantity))) ||
        dedupes.some((row) => row.botId !== position.botId ||
          row.symbol !== position.symbol || !orderIds.includes(row.orderId!))) {
      return { kind: 'PENDING', reason: 'DCA_LIFECYCLE_UNCONFIRMED' };
    }
    indices = dedupes.map((row) => {
      const value = row.commandFingerprint;
      if (!value || typeof value !== 'object' || Array.isArray(value)) return Number.NaN;
      const fingerprint = value as Record<string, unknown>;
      return fingerprint.positionId === position.id && typeof fingerprint.dcaLevelIndex === 'number'
        ? fingerprint.dcaLevelIndex : Number.NaN;
    }).sort((left, right) => left - right);
    if (indices.some((index) => !Number.isInteger(index) || index < 0) ||
        new Set(indices).size !== trades.length) {
      return { kind: 'PENDING', reason: 'DCA_LEVEL_UNCONFIRMED' };
    }
  }
  const next = {
    quantity: position.quantity, averageEntryPrice: position.entryPrice,
    currentAdds: trades.length,
    executedDcaLevelIndices: indices.length ? indices : undefined,
    trailingAnchorPrice: protection.trailingAnchorPrice,
    trailingLossLimitPercent: protection.trailingLossLimitPercent,
    trailingLossActiveLevelIndex: protection.trailingLossActiveLevelIndex,
    trailingTakeProfitHighPercent: protection.trailingTakeProfitHighPercent,
    trailingTakeProfitStepPercent: protection.trailingTakeProfitStepPercent,
    trailingTakeProfitActiveLevelIndex: protection.trailingTakeProfitActiveLevelIndex,
    lastDcaPrice: trades.at(-1)?.price,
  };
  const latest = await prisma.position.findUnique({ where: { id: position.id },
    select: { status: true, updatedAt: true, quantity: true, entryPrice: true } });
  if (!latest || latest.status !== 'OPEN' ||
      latest.updatedAt.getTime() !== position.updatedAt.getTime() ||
      latest.quantity !== position.quantity || latest.entryPrice !== position.entryPrice) {
    return { kind: 'PENDING', reason: 'POSITION_CHANGED' };
  }
  const changed = await input.redis.eval(CAS_CACHE, { keys: [key],
    arguments: [raw, JSON.stringify(next), String(CACHE_TTL_MS), '0'] });
  return Number(changed) === 1 ? { kind: 'REPAIRED' }
    : { kind: 'PENDING', reason: 'CACHE_CHANGED' };
};
