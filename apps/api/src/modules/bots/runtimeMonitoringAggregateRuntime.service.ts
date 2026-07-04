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

const toRuntimeAggregateTimestamp = (value: Date | string | null | undefined) => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') {
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
  }
  return 0;
};

const resolveAggregateSessionWindowEnd = <T extends { finishedAt?: Date | string | null; lastHeartbeatAt?: Date | string | null; startedAt: Date | string }>(
  session: T
) => session.finishedAt ?? session.lastHeartbeatAt ?? session.startedAt;

export const selectSessionsForRuntimeAggregation = <
  T extends {
    id: string;
    status: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    lastHeartbeatAt?: Date | string | null;
  },
>(
  sessions: T[],
  options?: {
    runningCap?: number;
    completedCap?: number;
  }
) => {
  if (sessions.length <= 1) return sessions;

  const running = sessions
    .filter((session) => session.status === 'RUNNING')
    .sort((left, right) => toRuntimeAggregateTimestamp(right.lastHeartbeatAt) - toRuntimeAggregateTimestamp(left.lastHeartbeatAt));
  const nonRunning = sessions
    .filter((session) => session.status !== 'RUNNING')
    .sort((left, right) =>
      toRuntimeAggregateTimestamp(resolveAggregateSessionWindowEnd(right)) - toRuntimeAggregateTimestamp(resolveAggregateSessionWindowEnd(left))
    );

  const runningCap = Number.isFinite(options?.runningCap) && (options?.runningCap ?? 0) > 0
    ? Math.floor(options?.runningCap ?? 0)
    : running.length;
  const completedCap = Number.isFinite(options?.completedCap) && (options?.completedCap ?? 0) > 0
    ? Math.floor(options?.completedCap ?? 0)
    : nonRunning.length;
  const selected = [...running.slice(0, runningCap), ...nonRunning.slice(0, completedCap)];
  if (selected.length === 0) {
    return sessions.slice(0, Math.min(sessions.length, 3));
  }

  const seen = new Set<string>();
  return selected.filter((session) => {
    if (seen.has(session.id)) return false;
    seen.add(session.id);
    return true;
  });
};

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
