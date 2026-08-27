import { describe, expect, it } from 'vitest';
import { WorkerHeartbeatClient } from './workerHeartbeat';

describe('WorkerHeartbeatClient', () => {
  it('records heartbeat timestamps in Redis with a bounded ttl', async () => {
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
        value: '2026-05-22T10:00:00.000Z',
        ttl: 180,
      },
    ]);
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
      },
      {
        worker: 'execution',
        lastHeartbeatAt: '2026-05-22T09:58:00.000Z',
        ageMs: 150_000,
        status: 'stale',
      },
      {
        worker: 'market-data',
        lastHeartbeatAt: null,
        ageMs: null,
        status: 'missing',
      },
    ]);
  });
});
