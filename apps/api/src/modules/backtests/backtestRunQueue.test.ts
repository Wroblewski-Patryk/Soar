import { describe, expect, it } from 'vitest';
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
      sAdd: async (_key: string, value: string) => {
        operations.push(`sadd:${value}`);
        const sizeBefore = queuedIds.size;
        queuedIds.add(value);
        return queuedIds.size === sizeBefore ? 0 : 1;
      },
      lPush: async (_key: string, value: string) => {
        operations.push(`lpush:${value}`);
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

    await queue.enqueue('run-1');
    await queue.enqueue('run-1');

    expect(processed).toEqual([]);
    expect(operations).toEqual(['connect', 'sadd:run-1', 'lpush:run-1', 'sadd:run-1']);
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
});
