import { createClient } from 'redis';

const STREAM_NAMESPACE = 'soar:live-binance-stream:v1';
const RECOVERY_NAMESPACE = 'soar:live-fill-recovery:v1';
const MAX_STATUS_AGE_MS = 45_000;
const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
const parse = (raw: string | null): Record<string, unknown> | null => {
  if (!raw) return null;
  try { return record(JSON.parse(raw)); } catch { return null; }
};
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value)
  ? value : null;
const timestamp = (value: unknown) => typeof value === 'number' &&
  Number.isSafeInteger(value) && value >= 0 ? value : null;
const ageAt = (value: number | null, now: number) =>
  value != null && Number.isSafeInteger(now) && now >= value ? now - value : null;
const discoveryCoverageAt = (value: unknown, now: number) => {
  const source = record(value);
  if (!source) return null;
  const scanStartedAt = timestamp(source.scanStartedAt);
  const lastFullScanAt = timestamp(source.lastFullScanAt);
  const complete = source.complete === true;
  return {
    complete,
    scanStartedAt,
    lastFullScanAt,
    scanAgeMs: complete ? null : ageAt(scanStartedAt, now),
    lastFullScanAgeMs: ageAt(lastFullScanAt, now),
    visitedCount: number(source.visitedCount),
  };
};

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
    const discovery = record(recovery?.cacheRepairDiscovery);
    const openCoverage = discoveryCoverageAt(discovery?.openPositions, now);
    const cacheCoverage = discoveryCoverageAt(discovery?.cacheKeys, now);
    const maxCoverageAgeMs = number(discovery?.maxCoverageAgeMs);
    const discoveryHealthy = discovery?.complete === true &&
      openCoverage?.complete === true && cacheCoverage?.complete === true &&
      maxCoverageAgeMs != null && maxCoverageAgeMs >= 0 &&
      openCoverage.scanStartedAt != null && cacheCoverage.scanStartedAt != null &&
      openCoverage.lastFullScanAt != null && cacheCoverage.lastFullScanAt != null &&
      openCoverage.scanStartedAt <= openCoverage.lastFullScanAt &&
      cacheCoverage.scanStartedAt <= cacheCoverage.lastFullScanAt &&
      openCoverage.lastFullScanAgeMs != null && cacheCoverage.lastFullScanAgeMs != null &&
      openCoverage.lastFullScanAgeMs <= maxCoverageAgeMs &&
      cacheCoverage.lastFullScanAgeMs <= maxCoverageAgeMs;
    const recoveryHealthy = recoveryRecent && recovery?.status === 'healthy' && discoveryHealthy;
    return {
      status: streamStatus === 'healthy' && recoveryHealthy ? 'healthy' : 'degraded',
      stream: {
        status: streamStatus, eligibleAccounts: accountIds?.length ?? null,
        connectedAccounts: connected, scannedAt, latestEventAt,
        oldestPongAt, reconnectTotal: Number(streamStats.reconnects ?? 0),
        errorTotal: Number(streamStats.errors ?? 0),
      },
      recovery: {
        status: recoveryRecent ? recoveryHealthy ? 'healthy' : 'degraded'
          : 'unavailable',
        pendingCount: recoveryRecent ? number(recovery?.pendingCount) : null,
        oldestPendingAgeMs: recoveryRecent ? number(recovery?.oldestPendingAgeMs) : null,
        cacheRepairPendingCount: recoveryRecent ? number(recovery?.cacheRepairPendingCount) : null,
        oldestCacheRepairAgeMs: recoveryRecent ? number(recovery?.oldestCacheRepairAgeMs) : null,
        cacheRepairDiscovery: {
          complete: recoveryRecent && discovery?.complete === true &&
            openCoverage?.complete === true && cacheCoverage?.complete === true,
          maxCoverageAgeMs: recoveryRecent ? maxCoverageAgeMs : null,
          openPositions: recoveryRecent ? openCoverage : null,
          cacheKeys: recoveryRecent ? cacheCoverage : null,
        },
        unknownTotal: recoveryRecent ? number(recovery?.unknownTotal) : null,
        errorTotal: recoveryRecent ? number(recovery?.errorTotal) : null,
        updatedAt: recoveryUpdatedAt,
      },
    } as const;
  } finally {
    if (redis.isOpen) await redis.quit().catch(() => redis.disconnect());
  }
};
