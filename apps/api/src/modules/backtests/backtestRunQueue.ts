import { createClient } from 'redis';

type BacktestRunWorker = (runId: string) => Promise<void>;

type RedisClient = ReturnType<typeof createClient>;

type BacktestRunQueueBackend = 'inline' | 'redis';

type BacktestRunQueueOptions = {
  backend?: BacktestRunQueueBackend;
  queueName?: string;
  redisUrl?: string;
  pollIntervalMs?: number;
  createRedisClient?: () => RedisClient;
};

export class BacktestRunQueue {
  private readonly pending: string[] = [];
  private readonly pendingSet = new Set<string>();
  private readonly backend: BacktestRunQueueBackend;
  private readonly queueKey: string;
  private readonly processingKey: string;
  private readonly dedupeKey: string;
  private readonly pollIntervalMs: number;
  private readonly createRedisClient: () => RedisClient;
  private redisClient: RedisClient | null = null;
  private draining = false;
  private workerStarted = false;
  private workerTimer: NodeJS.Timeout | null = null;

  constructor(private readonly worker: BacktestRunWorker, options: BacktestRunQueueOptions = {}) {
    const queueName = options.queueName?.trim() || 'backtest';
    const redisUrl = options.redisUrl?.trim() || process.env.REDIS_URL || 'redis://localhost:6379';
    this.backend = options.backend ?? 'inline';
    this.queueKey = `soar:queue:${queueName}:pending`;
    this.processingKey = `soar:queue:${queueName}:processing`;
    this.dedupeKey = `soar:queue:${queueName}:dedupe`;
    this.pollIntervalMs = options.pollIntervalMs ?? 1_000;
    this.createRedisClient = options.createRedisClient ?? (() => createClient({ url: redisUrl }));
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
    void this.recoverProcessingQueue().finally(() => this.pollRedis());
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
    const added = await client.sAdd(this.dedupeKey, runId);
    if (added === 0) return;
    try {
      await client.lPush(this.queueKey, runId);
    } catch (error) {
      await client.sRem(this.dedupeKey, runId).catch(() => undefined);
      throw error;
    }
  }

  private async recoverProcessingQueue() {
    const client = await this.getRedisClient();
    while (true) {
      const runId = await client.rPop(this.processingKey);
      if (!runId) return;
      await client.lPush(this.queueKey, runId);
    }
  }

  private pollRedis() {
    if (!this.workerStarted) return;
    const delay = async () => {
      try {
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
      // Keep queue alive even when a single run fails. The job owns terminal run state.
      console.error('BacktestRunQueue worker failed:', error);
    } finally {
      await client.lRem(this.processingKey, 1, runId);
      await client.sRem(this.dedupeKey, runId);
    }
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
