import { describe, expect, it, vi } from 'vitest';
import { BacktestRunQueue } from './backtestRunQueue';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('BacktestRunQueue', () => {
  it('deduplicates queued run ids', async () => {
    const processed: string[] = [];
    let releaseFirst: null | ((value?: void | PromiseLike<void>) => void) = null;
    const queue = new BacktestRunQueue(async (runId) => {
      processed.push(runId);
      if (runId === 'run-1') {
        await new Promise<void>((resolve) => {
          releaseFirst = resolve;
        });
      }
    });

    await queue.enqueue('run-1');
    await queue.enqueue('run-1');
    await queue.enqueue('run-2');
    await wait(20);
    expect(processed).toEqual(['run-1']);

    if (releaseFirst) {
      (releaseFirst as any)();
    }
    await wait(20);

    expect(processed).toEqual(['run-1', 'run-2']);
  });

  it('keeps execution order while worker is async', async () => {
    const processed: string[] = [];
    let releaseFirst: null | ((value?: void | PromiseLike<void>) => void) = null;

    const queue = new BacktestRunQueue(async (runId) => {
      processed.push(runId);
      if (runId === 'run-1') {
        await new Promise<void>((resolve) => {
          releaseFirst = resolve;
        });
      }
    });

    await queue.enqueue('run-1');
    await queue.enqueue('run-2');
    await wait(20);
    expect(processed).toEqual(['run-1']);

    if (releaseFirst) {
      (releaseFirst as any)();
    }
    await wait(20);
    expect(processed).toEqual(['run-1', 'run-2']);
  });

  it('uses Redis list ownership without processing work in the API process', async () => {
    const operations: string[] = [];
    let isOpen = false;
    const queuedIds = new Set<string>();
    const redisClient = {
      get isOpen() {
        return isOpen;
      },
      connect: async () => {
        isOpen = true;
        operations.push('connect');
      },
      eval: async (script: string, options: { keys: string[]; arguments: string[] }) => {
        expect(script).toContain("redis.call('SADD', KEYS[1], ARGV[1])");
        expect(script).toContain("redis.call('LPUSH', KEYS[2], ARGV[1])");
        expect(options.keys).toEqual([
          'soar:queue:backtest:dedupe',
          'soar:queue:backtest:pending',
        ]);
        const value = options.arguments[0];
        operations.push(`atomic-enqueue:${value}`);
        const sizeBefore = queuedIds.size;
        queuedIds.add(value);
        return queuedIds.size === sizeBefore ? 0 : 1;
      },
      quit: async () => undefined,
    };
    const processed: string[] = [];
    const queue = new BacktestRunQueue(
      async (runId) => {
        processed.push(runId);
      },
      {
        backend: 'redis',
        createRedisClient: () => redisClient as any,
      }
    );

    await queue.enqueue('run-1');
    await queue.enqueue('run-1');

    expect(processed).toEqual([]);
    expect(operations).toEqual(['connect', 'atomic-enqueue:run-1', 'atomic-enqueue:run-1']);
  });

  it('claims and acknowledges Redis jobs in the worker process', async () => {
    const operations: string[] = [];
    const redisClient = {
      isOpen: true,
      connect: async () => undefined,
      rPopLPush: async () => 'run-1',
      lRem: async (_key: string, _count: number, value: string) => {
        operations.push(`lrem:${value}`);
        return 1;
      },
      sRem: async (_key: string, value: string) => {
        operations.push(`srem:${value}`);
        return 1;
      },
      quit: async () => undefined,
    };
    const processed: string[] = [];
    const queue = new BacktestRunQueue(
      async (runId) => {
        processed.push(runId);
      },
      {
        backend: 'redis',
        createRedisClient: () => redisClient as any,
      }
    );

    await expect(queue.processOneRedisJob()).resolves.toBe(true);

    expect(processed).toEqual(['run-1']);
    expect(operations).toEqual(['lrem:run-1', 'srem:run-1']);
  });

  it('requeues pending database runs after worker startup without duplicating queued ids', async () => {
    const queued = new Set(['already-queued']);
    const operations: string[] = [];
    const redisClient = {
      isOpen: true,
      connect: async () => undefined,
      rPop: async () => null,
      eval: async (_script: string, options: { arguments: string[] }) => {
        const id = options.arguments[0];
        if (queued.has(id)) return 0;
        queued.add(id);
        operations.push(`enqueue:${id}`);
        return 1;
      },
      rPopLPush: async () => null,
      quit: async () => undefined,
    };
    const queue = new BacktestRunQueue(async () => undefined, {
      backend: 'redis',
      pollIntervalMs: 100,
      createRedisClient: () => redisClient as any,
      recoverPendingRunIds: async () => ['already-queued', 'orphaned-pending'],
    });

    queue.startWorker();
    await wait(20);
    await queue.stopWorker();

    expect(operations).toEqual(['enqueue:orphaned-pending']);
  });

  it('atomically moves interrupted processing work back to pending on startup', async () => {
    const lists: Record<string, string[]> = {
      'soar:queue:backtest:processing': ['interrupted-run'],
      'soar:queue:backtest:pending': [],
    };
    const moves: string[] = [];
    const processed: string[] = [];
    const redisClient = {
      isOpen: true,
      connect: async () => undefined,
      rPopLPush: async (source: string, destination: string) => {
        const id = lists[source].pop();
        if (!id) return null;
        lists[destination].unshift(id);
        moves.push(`${source}->${destination}:${id}`);
        return id;
      },
      lRem: async (key: string, _count: number, id: string) => {
        lists[key] = lists[key].filter((value) => value !== id);
        return 1;
      },
      sRem: async () => 1,
      quit: async () => undefined,
    };
    const queue = new BacktestRunQueue(async (id) => {
      processed.push(id);
    }, {
      backend: 'redis',
      pollIntervalMs: 100,
      createRedisClient: () => redisClient as any,
    });

    queue.startWorker();
    await wait(20);
    await queue.stopWorker();

    expect(moves).toEqual([
      'soar:queue:backtest:processing->soar:queue:backtest:pending:interrupted-run',
      'soar:queue:backtest:pending->soar:queue:backtest:processing:interrupted-run',
    ]);
    expect(processed).toEqual(['interrupted-run']);
    expect(lists['soar:queue:backtest:processing']).toEqual([]);
  });

  it('retries startup recovery after a transient database error', async () => {
    let attempts = 0;
    const queued: string[] = [];
    const redisClient = {
      isOpen: true,
      connect: async () => undefined,
      rPop: async () => null,
      eval: async (_script: string, options: { arguments: string[] }) => {
        queued.push(options.arguments[0]);
        return 1;
      },
      rPopLPush: async () => null,
      quit: async () => undefined,
    };
    const queue = new BacktestRunQueue(async () => undefined, {
      backend: 'redis',
      pollIntervalMs: 5,
      createRedisClient: () => redisClient as any,
      recoverPendingRunIds: async () => {
        attempts += 1;
        if (attempts === 1) throw new Error('database unavailable');
        return ['recovered-after-retry'];
      },
    });
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      queue.startWorker();
      await wait(30);
      await queue.stopWorker();
      expect(attempts).toBeGreaterThanOrEqual(2);
      expect(queued).toEqual(['recovered-after-retry']);
      expect(log).toHaveBeenCalledWith('BacktestRunQueue recovery failed:', expect.any(Error));
    } finally {
      log.mockRestore();
    }
  });
});
