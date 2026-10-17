import { createClient } from 'redis';

type BacktestRunWorker = (runId: string) => Promise<void>;

type RedisClient = ReturnType<typeof createClient>;

type BacktestRunQueueBackend = 'inline' | 'redis';

const enqueueIfAbsentScript = `
if redis.call('SADD', KEYS[1], ARGV[1]) == 0 then
  return 0
end
redis.call('LPUSH', KEYS[2], ARGV[1])
return 1
`;

const reconcileRunScript = `
redis.call('SADD', KEYS[3], ARGV[1])
if redis.call('LPOS', KEYS[1], ARGV[1]) then
  return 0
end
redis.call('LREM', KEYS[2], 0, ARGV[1])
redis.call('LPUSH', KEYS[1], ARGV[1])
return 1
`;

const acknowledgeRunScript = `
redis.call('LREM', KEYS[2], 1, ARGV[1])
if not redis.call('LPOS', KEYS[1], ARGV[1]) and not redis.call('LPOS', KEYS[2], ARGV[1]) then
  redis.call('SREM', KEYS[3], ARGV[1])
end
return 1
`;

type BacktestRunQueueOptions = {
  backend?: BacktestRunQueueBackend;
  queueName?: string;
  redisUrl?: string;
  pollIntervalMs?: number;
  recoveryIntervalMs?: number;
  createRedisClient?: () => RedisClient;
  recoverPendingRunIds?: () => Promise<string[]>;
  discardProcessingRunIds?: (ids: string[]) => Promise<string[]>;
};

export class BacktestRunQueue {
  private readonly pending: string[] = [];
  private readonly pendingSet = new Set<string>();
  private readonly backend: BacktestRunQueueBackend;
  private readonly queueKey: string;
  private readonly processingKey: string;
  private readonly dedupeKey: string;
  private readonly pollIntervalMs: number;
  private readonly recoveryIntervalMs: number;
  private readonly createRedisClient: () => RedisClient;
  private readonly recoverPendingRunIds?: () => Promise<string[]>;
  private readonly discardProcessingRunIds?: (ids: string[]) => Promise<string[]>;
  private redisClient: RedisClient | null = null;
  private draining = false;
  private workerStarted = false;
  private workerTimer: NodeJS.Timeout | null = null;
  private lastRecoveryAt = 0;

  constructor(private readonly worker: BacktestRunWorker, options: BacktestRunQueueOptions = {}) {
    const queueName = options.queueName?.trim() || 'backtest';
    const redisUrl = options.redisUrl?.trim() || process.env.REDIS_URL || 'redis://localhost:6379';
    this.backend = options.backend ?? 'inline';
    this.queueKey = `soar:queue:${queueName}:pending`;
    this.processingKey = `soar:queue:${queueName}:processing`;
    this.dedupeKey = `soar:queue:${queueName}:dedupe`;
    this.pollIntervalMs = options.pollIntervalMs ?? 1_000;
    this.recoveryIntervalMs = options.recoveryIntervalMs ?? 30_000;
    this.createRedisClient = options.createRedisClient ?? (() => createClient({ url: redisUrl }));
    this.recoverPendingRunIds = options.recoverPendingRunIds;
    this.discardProcessingRunIds = options.discardProcessingRunIds;
  }

  async enqueue(runId: string) {
    const normalizedId = runId.trim();
    if (!normalizedId) return;
    if (this.backend === 'redis') {
      await this.enqueueRedis(normalizedId);
      return;
    }
    if (this.pendingSet.has(normalizedId)) return;
    this.pending.push(normalizedId);
    this.pendingSet.add(normalizedId);
    void this.drain();
  }

  startWorker() {
    if (this.backend !== 'redis' || this.workerStarted) return;
    this.workerStarted = true;
    void this.initializeRedisWorker();
  }

  async stopWorker() {
    this.workerStarted = false;
    if (this.workerTimer) {
      clearTimeout(this.workerTimer);
      this.workerTimer = null;
    }
    if (this.redisClient) {
      await this.redisClient.quit().catch(() => undefined);
      this.redisClient = null;
    }
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

  private async enqueueRedis(runId: string) {
    const client = await this.getRedisClient();
    await client.eval(enqueueIfAbsentScript, {
      keys: [this.dedupeKey, this.queueKey],
      arguments: [runId],
    });
  }

  private async recoverDatabaseRuns() {
    const client = await this.getRedisClient();
    for (const runId of await this.recoverPendingRunIds?.() ?? []) {
      if (!this.workerStarted) return;
      await client.eval(reconcileRunScript, {
        keys: [this.queueKey, this.processingKey, this.dedupeKey],
        arguments: [runId],
      });
    }
    if (this.discardProcessingRunIds) {
      const processingIds = await client.lRange(this.processingKey, 0, 499);
      for (const runId of await this.discardProcessingRunIds(processingIds)) {
        await client.eval(acknowledgeRunScript, {
          keys: [this.queueKey, this.processingKey, this.dedupeKey],
          arguments: [runId],
        });
      }
    }
    this.lastRecoveryAt = Date.now();
  }

  private async initializeRedisWorker() {
    try {
      await this.recoverDatabaseRuns();
      if (this.workerStarted) this.pollRedis();
    } catch (error) {
      console.error('BacktestRunQueue recovery failed:', error);
      if (this.workerStarted) {
        this.workerTimer = setTimeout(() => void this.initializeRedisWorker(), this.pollIntervalMs);
      }
    }
  }

  private pollRedis() {
    if (!this.workerStarted) return;
    const delay = async () => {
      try {
        if (Date.now() - this.lastRecoveryAt >= this.recoveryIntervalMs) {
          await this.recoverDatabaseRuns();
        }
        await this.processOneRedisJob();
      } catch (error) {
        console.error('BacktestRunQueue redis worker failed:', error);
      } finally {
        if (this.workerStarted) {
          this.workerTimer = setTimeout(delay, this.pollIntervalMs);
        }
      }
    };
    void delay();
  }

  async processOneRedisJob() {
    if (this.backend !== 'redis') return false;
    const client = await this.getRedisClient();
    const runId = await client.rPopLPush(this.queueKey, this.processingKey);
    if (!runId) return false;
    try {
      await this.worker(runId);
    } catch (error) {
      // The database-led recovery scan will retry after this execution lease expires.
      console.error('BacktestRunQueue worker failed:', error);
      throw error;
    }
    await client.eval(acknowledgeRunScript, {
      keys: [this.queueKey, this.processingKey, this.dedupeKey],
      arguments: [runId],
    });
    return true;
  }

  private async drain() {
    if (this.draining) return;
    this.draining = true;
    try {
      while (this.pending.length > 0) {
        const runId = this.pending.shift();
        if (!runId) continue;
        try {
          await this.worker(runId);
        } catch (error) {
          // Keep queue alive even when a single run fails.
          console.error('BacktestRunQueue worker failed:', error);
        } finally {
          this.pendingSet.delete(runId);
        }
      }
    } finally {
      this.draining = false;
      if (this.pending.length > 0) {
        void this.drain();
      }
    }
  }
}
