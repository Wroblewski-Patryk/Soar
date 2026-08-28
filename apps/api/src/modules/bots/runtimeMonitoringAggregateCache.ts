export const withRuntimeMonitoringTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error('runtime_aggregate_subquery_timeout')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const pruneRuntimeMonitoringCache = <T>(
  cache: Map<string, { expiresAt: number; value: T }>,
  now: number,
  staleTtlMs: number,
  configuredMaxEntries: number
) => {
  const staleWindowMs = Number.isFinite(staleTtlMs) && staleTtlMs > 0 ? staleTtlMs : 0;
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt + staleWindowMs) cache.delete(key);
  }
  const maxEntries =
    Number.isFinite(configuredMaxEntries) && configuredMaxEntries > 0
      ? Math.floor(configuredMaxEntries)
      : 100;
  while (cache.size > maxEntries) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    cache.delete(oldestKey);
  }
};
