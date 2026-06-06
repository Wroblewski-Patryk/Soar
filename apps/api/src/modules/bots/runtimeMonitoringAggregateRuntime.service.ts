export const buildRuntimeAggregateCacheKey = (
  userId: string,
  botId: string,
  query: {
    status?: string;
    symbol?: string;
    sessionsLimit: number;
    perSessionLimit: number;
  }
) =>
  [
    userId,
    botId,
    query.status ?? 'ALL',
    query.symbol ?? '',
    String(query.sessionsLimit),
    String(query.perSessionLimit),
  ].join('|');

export const withRuntimeAggregateTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('runtime_aggregate_subquery_timeout'));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const mapWithLimitedConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>
) => {
  const limit = Number.isFinite(concurrency) && concurrency > 0 ? Math.floor(concurrency) : 1;
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  });
  await Promise.all(workers);
  return results;
};
