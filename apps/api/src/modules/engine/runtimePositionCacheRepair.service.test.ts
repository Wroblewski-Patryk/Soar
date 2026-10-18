import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { findRuntimeCacheRepairPage, repairRuntimePositionCacheOnce } from
  './runtimePositionCacheRepair.service';

afterEach(() => vi.restoreAllMocks());

const fixture = (status: 'OPEN' | 'CLOSED' = 'OPEN') => {
  const updatedAt = new Date('2026-10-18T12:00:00.000Z');
  const position = { id: 'position-1', userId: 'user-1', botId: 'bot-1',
    walletId: 'wallet-1', symbol: 'BTCUSDT', side: 'LONG', origin: 'BOT',
    status, syncState: 'IN_SYNC', continuityState: 'CONFIRMED',
    quantity: 2, entryPrice: 95, leverage: 1, updatedAt,
    runtimeTtpEverArmed: false, runtimeTslEverArmed: false };
  vi.spyOn(prisma.position, 'findFirst').mockResolvedValue(position as any);
  vi.spyOn(prisma.position, 'findUnique').mockResolvedValue(position as any);
  vi.spyOn(prisma.trade, 'findMany').mockResolvedValue([{
    orderId: 'order-1', price: 90, quantity: 1, executedAt: updatedAt,
    botId: 'bot-1', walletId: 'wallet-1', symbol: 'BTCUSDT', side: 'BUY',
    origin: 'BOT', managementMode: 'BOT_MANAGED', executionMode: 'LIVE',
  }] as any);
  vi.spyOn(prisma.order, 'findMany').mockResolvedValue([{
    id: 'order-1', userId: 'user-1', botId: 'bot-1', walletId: 'wallet-1',
    positionId: 'position-1', symbol: 'BTCUSDT', side: 'BUY', origin: 'BOT',
    syncState: 'IN_SYNC', status: 'FILLED', filledQuantity: 1,
  }] as any);
  vi.spyOn(prisma.runtimeExecutionDedupe, 'findMany').mockResolvedValue([{
    orderId: 'order-1', botId: 'bot-1', symbol: 'BTCUSDT',
    commandFingerprint: { positionId: 'position-1', dcaLevelIndex: 0 },
  }] as any);
  const writes = [vi.spyOn(prisma.order, 'create'), vi.spyOn(prisma.trade, 'create'),
    vi.spyOn(prisma.position, 'update')];
  let cache: string | null = JSON.stringify({ quantity: 1, averageEntryPrice: 100,
    currentAdds: 0, trailingAnchorPrice: 100 });
  let beforeCas: (() => void) | null = null;
  const redis: any = {
    get: vi.fn(async () => cache),
    eval: vi.fn(async (_script: string, input: { arguments: string[] }) => {
      beforeCas?.();
      const [expected, next, , expectMissing] = input.arguments;
      if (expectMissing === '1' ? cache != null : cache !== expected) return 0;
      cache = next === 'delete' ? null : next;
      return 1;
    }),
  };
  return { position, redis, writes,
    readCache: () => cache, setCache: (value: string | null) => { cache = value; },
    race: (callback: () => void) => { beforeCas = callback; } };
};

describe('database-backed BOT runtime cache repair', () => {
  it('pages OPEN LIVE BOT positions without walking CLOSED history', async () => {
    const find = vi.spyOn(prisma.position, 'findMany').mockResolvedValue([
      { id: 'a' }, { id: 'b' }, { id: 'c' },
    ] as any);
    await expect(findRuntimeCacheRepairPage({ cursor: 'before', limit: 2,
      userId: 'user-1' })).resolves.toEqual({ ids: ['a', 'b'], nextCursor: 'b' });
    expect(find).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ status: 'OPEN', userId: 'user-1',
        id: { gt: 'before' }, origin: 'BOT', managementMode: 'BOT_MANAGED' }),
      take: 3,
    }));
    find.mockResolvedValueOnce([{ id: 'c' }] as any);
    await expect(findRuntimeCacheRepairPage({ cursor: 'b', limit: 2,
      userId: 'user-1' })).resolves.toEqual({ ids: ['c'], nextCursor: null });
  });

  it('repairs a stale DCA basis and level once without lifecycle writes', async () => {
    const f = fixture();
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'REPAIRED' });
    expect(JSON.parse(f.readCache()!)).toMatchObject({ quantity: 2,
      averageEntryPrice: 95, currentAdds: 1,
      executedDcaLevelIndices: [0], lastDcaPrice: 90,
      trailingAnchorPrice: 100 });
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'CLEAN' });
    expect(f.redis.eval).toHaveBeenCalledTimes(1);
    f.writes.forEach((write) => expect(write).not.toHaveBeenCalled());
  });

  it('deletes a stale CLOSED cache without creating a second CLOSE', async () => {
    const f = fixture('CLOSED');
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'REPAIRED' });
    expect(f.readCache()).toBeNull();
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'CLEAN' });
    f.writes.forEach((write) => expect(write).not.toHaveBeenCalled());
  });

  it('keeps an updated stream cache when it wins the compare-and-set race', async () => {
    const f = fixture();
    const fresh = JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 100 });
    f.race(() => f.setCache(fresh));
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'CACHE_CHANGED' });
    expect(f.readCache()).toBe(fresh);
    f.writes.forEach((write) => expect(write).not.toHaveBeenCalled());
  });

  it('leaves an ambiguous DCA cache pending when a successful dedupe is missing', async () => {
    const f = fixture();
    vi.mocked(prisma.runtimeExecutionDedupe.findMany).mockResolvedValue([]);
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'DCA_LIFECYCLE_UNCONFIRMED' });
    expect(f.redis.eval).not.toHaveBeenCalled();
    f.writes.forEach((write) => expect(write).not.toHaveBeenCalled());
  });

  it('keeps a lost cache pending after DCA instead of inventing unarmed protection', async () => {
    const f = fixture();
    f.setCache(null);
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' });
    expect(f.readCache()).toBeNull();
    expect(f.redis.eval).not.toHaveBeenCalled();
    f.writes.forEach((write) => expect(write).not.toHaveBeenCalled());
  });

  it('does not call a matching quantity and average clean when its active TTP is incomplete', async () => {
    const f = fixture();
    const incomplete = JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120,
      trailingTakeProfitHighPercent: (120 / 95) - 1,
      trailingTakeProfitActiveLevelIndex: 0 });
    f.setCache(incomplete);
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' });
    expect(f.readCache()).toBe(incomplete);
    expect(f.redis.eval).not.toHaveBeenCalled();
    f.writes.forEach((write) => expect(write).not.toHaveBeenCalled());
  });

  it('keeps a fully erased TTP pending against durable armed evidence', async () => {
    const f = fixture();
    f.position.runtimeTtpEverArmed = true;
    const armed = { quantity: 2, averageEntryPrice: 95, currentAdds: 1,
      trailingAnchorPrice: 120,
      trailingTakeProfitHighPercent: 120 / 95 - 1,
      trailingTakeProfitStepPercent: 0.3 / 95,
      trailingTakeProfitActiveLevelIndex: 0 };
    f.setCache(JSON.stringify(armed));
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'CLEAN' });
    const erased = JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120 });
    f.setCache(erased);
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' });
    expect(f.readCache()).toBe(erased);
    expect(f.redis.eval).not.toHaveBeenCalled();
  });

  it('accepts TTP after TSL while keeping stale TSL and erased cache pending', async () => {
    const f = fixture();
    f.position.runtimeTslEverArmed = true;
    f.position.runtimeTtpEverArmed = true;
    const ttp = JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120,
      trailingTakeProfitHighPercent: 120 / 95 - 1,
      trailingTakeProfitStepPercent: 0.3 / 95,
      trailingTakeProfitActiveLevelIndex: 0 });
    f.setCache(ttp);
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'CLEAN' });
    f.setCache(JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120,
      trailingLossLimitPercent: -0.16, trailingLossActiveLevelIndex: 0 }));
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' });
    f.setCache(JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120 }));
    await expect(repairRuntimePositionCacheOnce({ positionId: f.position.id,
      redis: f.redis })).resolves.toEqual({ kind: 'PENDING', reason: 'PROTECTION_UNCONFIRMED' });
    expect(f.redis.eval).not.toHaveBeenCalled();
  });
});
