import { describe, expect, it } from 'vitest';
import { WorkerHeartbeatClient } from './workerHeartbeat';

describe('WorkerHeartbeatClient', () => {
  it('records heartbeat timestamps in Redis with a bounded ttl', async () => {
    const previousSourceCommit = process.env.SOURCE_COMMIT;
    process.env.SOURCE_COMMIT = 'abcdef0123456789abcdef0123456789abcdef01';
    try {
      const writes: Array<{ key: string; value: string; ttl: number }> = [];
      let isOpen = false;
      const redisClient = {
        get isOpen() {
          return isOpen;
        },
        connect: async () => {
          isOpen = true;
        },
        set: async (key: string, value: string, options: { EX: number }) => {
          writes.push({ key, value, ttl: options.EX });
          return 'OK';
        },
        quit: async () => undefined,
      };
      const client = new WorkerHeartbeatClient({
        maxAgeMs: 60_000,
        createRedisClient: () => redisClient as any,
      });

      await client.record('backtest', new Date('2026-05-22T10:00:00.000Z'));

      expect(writes).toEqual([
        {
          key: 'soar:workers:heartbeat:backtest',
          value: JSON.stringify({
            at: '2026-05-22T10:00:00.000Z',
            releaseSha: 'abcdef0123456789abcdef0123456789abcdef01',
          }),
          ttl: 180,
        },
      ]);
    } finally {
      if (previousSourceCommit === undefined) delete process.env.SOURCE_COMMIT;
      else process.env.SOURCE_COMMIT = previousSourceCommit;
    }
  });

  it('classifies cross-container heartbeats as fresh, stale, or missing', async () => {
    const values = new Map<string, string>([
      ['soar:workers:heartbeat:backtest', '2026-05-22T10:00:00.000Z'],
      ['soar:workers:heartbeat:execution', '2026-05-22T09:58:00.000Z'],
    ]);
    const redisClient = {
      isOpen: true,
      connect: async () => undefined,
      get: async (key: string) => values.get(key) ?? null,
      quit: async () => undefined,
    };
    const client = new WorkerHeartbeatClient({
      maxAgeMs: 60_000,
      now: () => new Date('2026-05-22T10:00:30.000Z'),
      createRedisClient: () => redisClient as any,
    });

    await expect(client.readMany(['backtest', 'execution', 'market-data'])).resolves.toEqual([
      {
        worker: 'backtest',
        lastHeartbeatAt: '2026-05-22T10:00:00.000Z',
        ageMs: 30_000,
        status: 'fresh',
        releaseSha: null,
      },
      {
        worker: 'execution',
        lastHeartbeatAt: '2026-05-22T09:58:00.000Z',
        ageMs: 150_000,
        status: 'stale',
        releaseSha: null,
      },
      {
        worker: 'market-data',
        lastHeartbeatAt: null,
        ageMs: null,
        status: 'missing',
        releaseSha: null,
      },
    ]);
  });

  it('reads release identity from structured cross-container heartbeats', async () => {
    const values = new Map<string, string>([[
      'soar:workers:heartbeat:backtest',
      JSON.stringify({
        at: '2026-05-22T10:00:00.000Z',
        releaseSha: 'abcdef0123456789abcdef0123456789abcdef01',
      }),
    ]]);
    const redisClient = {
      isOpen: true,
      connect: async () => undefined,
      get: async (key: string) => values.get(key) ?? null,
      quit: async () => undefined,
    };
    const client = new WorkerHeartbeatClient({
      now: () => new Date('2026-05-22T10:00:01.000Z'),
      createRedisClient: () => redisClient as any,
    });
    await expect(client.read('backtest')).resolves.toMatchObject({
      status: 'fresh',
      releaseSha: 'abcdef0123456789abcdef0123456789abcdef01',
    });
  });
});
