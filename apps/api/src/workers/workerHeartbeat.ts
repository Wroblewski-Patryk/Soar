import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;

export type WorkerHeartbeatName = 'market-data' | 'backtest' | 'execution' | 'market-stream';

export type WorkerHeartbeatStatus = {
  worker: WorkerHeartbeatName;
  lastHeartbeatAt: string | null;
  ageMs: number | null;
  status: 'fresh' | 'missing' | 'stale';
};

type WorkerHeartbeatClientOptions = {
  redisUrl?: string;
  now?: () => Date;
  maxAgeMs?: number;
  createRedisClient?: () => RedisClient;
};

const DEFAULT_REDIS_URL = 'redis://localhost:6379';
const DEFAULT_MAX_AGE_MS = 60_000;

const heartbeatKey = (worker: WorkerHeartbeatName) => `soar:workers:heartbeat:${worker}`;

export class WorkerHeartbeatClient {
  private readonly now: () => Date;
  private readonly maxAgeMs: number;
  private readonly createRedisClient: () => RedisClient;
  private redisClient: RedisClient | null = null;

  constructor(options: WorkerHeartbeatClientOptions = {}) {
    const redisUrl = options.redisUrl?.trim() || process.env.REDIS_URL || DEFAULT_REDIS_URL;
    this.now = options.now ?? (() => new Date());
    this.maxAgeMs = options.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
    this.createRedisClient = options.createRedisClient ?? (() => createClient({ url: redisUrl }));
  }

  async record(worker: WorkerHeartbeatName, at = this.now()) {
    const client = await this.getRedisClient();
    await client.set(heartbeatKey(worker), at.toISOString(), {
      EX: Math.max(1, Math.ceil(this.maxAgeMs / 1_000) * 3),
    });
  }

  async read(worker: WorkerHeartbeatName): Promise<WorkerHeartbeatStatus> {
    const client = await this.getRedisClient();
    const raw = await client.get(heartbeatKey(worker));
    if (!raw) {
      return { worker, lastHeartbeatAt: null, ageMs: null, status: 'missing' };
    }
    const parsedMs = Date.parse(raw);
    if (Number.isNaN(parsedMs)) {
      return { worker, lastHeartbeatAt: raw, ageMs: null, status: 'stale' };
    }
    const ageMs = Math.max(0, this.now().getTime() - parsedMs);
    return {
      worker,
      lastHeartbeatAt: raw,
      ageMs,
      status: ageMs <= this.maxAgeMs ? 'fresh' : 'stale',
    };
  }

  async readMany(workers: WorkerHeartbeatName[]) {
    return Promise.all(workers.map((worker) => this.read(worker)));
  }

  async close() {
    if (!this.redisClient) return;
    await this.redisClient.quit().catch(() => undefined);
    this.redisClient = null;
  }

  private async getRedisClient() {
    if (!this.redisClient) {
      this.redisClient = this.createRedisClient();
    }
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    return this.redisClient;
  }
}

export const workerHeartbeatClient = new WorkerHeartbeatClient();
