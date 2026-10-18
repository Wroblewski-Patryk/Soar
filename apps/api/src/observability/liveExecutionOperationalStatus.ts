import { createClient } from 'redis';

const STREAM_NAMESPACE = 'soar:live-binance-stream:v1';
const RECOVERY_NAMESPACE = 'soar:live-fill-recovery:v1';
const MAX_STATUS_AGE_MS = 45_000;
const parse = (raw: string | null): Record<string, unknown> | null => {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown> : null;
  } catch { return null; }
};
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value)
  ? value : null;

export type LiveExecutionOperationalStatus = Awaited<ReturnType<typeof readLiveExecutionOperationalStatus>>;

export const readLiveExecutionOperationalStatus = async (options: {
  redisUrl?: string; now?: number; streamNamespace?: string; recoveryNamespace?: string;
} = {}) => {
  const now = options.now ?? Date.now();
  const streamNamespace = options.streamNamespace ?? STREAM_NAMESPACE;
  const recoveryNamespace = options.recoveryNamespace ?? RECOVERY_NAMESPACE;
  const redis = createClient({ url: options.redisUrl ?? process.env.REDIS_URL ??
    'redis://localhost:6379', socket: { connectTimeout: 5_000,
      reconnectStrategy: false } });
  redis.on('error', () => undefined);
  try {
    await redis.connect();
    const [desiredRaw, recoveryRaw, streamStats] = await Promise.all([
      redis.get(`${streamNamespace}:desired`),
      redis.get(`${recoveryNamespace}:status`),
      redis.hGetAll(`${streamNamespace}:stats`),
    ]);
    const desired = parse(desiredRaw);
    const accountIds = Array.isArray(desired?.accounts) &&
      desired.accounts.length <= 100 && desired.accounts.every((id) =>
        typeof id === 'string' && /^[a-zA-Z0-9_-]+:(SPOT|FUTURES)$/.test(id))
      ? desired.accounts as string[] : null;
    const scannedAt = number(desired?.scannedAt);
    const desiredFresh = desired?.status === 'ok' && accountIds != null &&
      scannedAt != null && now - scannedAt >= 0 && now - scannedAt <= MAX_STATUS_AGE_MS;
    const accountRaw = desiredFresh && accountIds!.length ?
      await redis.mGet(accountIds!.map((id) => `${streamNamespace}:account:${id}`)) : [];
    let connected = 0;
    let latestEventAt: number | null = null;
    let oldestPongAt: number | null = null;
    for (const raw of accountRaw) {
      const state = parse(raw);
      const updatedAt = number(state?.updatedAt);
      const pongAt = number(state?.lastPongAt);
      if (state?.status === 'connected' && updatedAt != null && pongAt != null &&
          now - updatedAt >= 0 && now - updatedAt <= MAX_STATUS_AGE_MS &&
          now - pongAt >= 0 && now - pongAt <= MAX_STATUS_AGE_MS) connected += 1;
      const eventAt = number(state?.lastEventAt);
      if (eventAt != null) latestEventAt = Math.max(latestEventAt ?? 0, eventAt);
      if (pongAt != null) oldestPongAt = Math.min(oldestPongAt ?? pongAt, pongAt);
    }
    const streamStatus = !desiredFresh ? 'unavailable' :
      connected === accountIds!.length ? 'healthy' : 'degraded';
    const recovery = parse(recoveryRaw);
    const recoveryUpdatedAt = number(recovery?.updatedAt);
    const recoveryRecent = recoveryUpdatedAt != null && now - recoveryUpdatedAt >= 0 &&
      now - recoveryUpdatedAt <= 90_000;
    const recoveryHealthy = recoveryRecent && recovery?.status === 'healthy';
    return {
      status: streamStatus === 'healthy' && recoveryHealthy ? 'healthy' : 'degraded',
      stream: {
        status: streamStatus, eligibleAccounts: accountIds?.length ?? null,
        connectedAccounts: connected, scannedAt, latestEventAt,
        oldestPongAt, reconnectTotal: Number(streamStats.reconnects ?? 0),
        errorTotal: Number(streamStats.errors ?? 0),
      },
      recovery: {
        status: recoveryRecent ? recovery?.status === 'healthy' ? 'healthy' : 'degraded'
          : 'unavailable',
        pendingCount: recoveryRecent ? number(recovery?.pendingCount) : null,
        oldestPendingAgeMs: recoveryRecent ? number(recovery?.oldestPendingAgeMs) : null,
        cacheRepairPendingCount: recoveryRecent ? number(recovery?.cacheRepairPendingCount) : null,
        oldestCacheRepairAgeMs: recoveryRecent ? number(recovery?.oldestCacheRepairAgeMs) : null,
        unknownTotal: recoveryRecent ? number(recovery?.unknownTotal) : null,
        errorTotal: recoveryRecent ? number(recovery?.errorTotal) : null,
        updatedAt: recoveryUpdatedAt,
      },
    } as const;
  } finally {
    if (redis.isOpen) await redis.quit().catch(() => redis.disconnect());
  }
};
