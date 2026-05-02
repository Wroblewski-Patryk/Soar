import { createClient } from 'redis';

type RuntimeDependencyIssue = {
  key: string;
  reason: string;
};

type RuntimeDependencyReadiness = {
  ready: boolean;
  issues: RuntimeDependencyIssue[];
};

type RedisPingResult = {
  ok: boolean;
  reason?: string;
};

const asPositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const isRedisRequired = () =>
  process.env.REDIS_REQUIRED === 'true' ||
  (process.env.NODE_ENV === 'production' && process.env.REDIS_REQUIRED !== 'false');

let pingRedisOverride: (() => Promise<RedisPingResult>) | null = null;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timer: NodeJS.Timeout | null = null;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const pingRedis = async (): Promise<RedisPingResult> => {
  if (pingRedisOverride) return pingRedisOverride();

  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) {
    return { ok: false, reason: 'REDIS_URL is missing' };
  }

  const timeoutMs = asPositiveInteger(process.env.READINESS_REDIS_TIMEOUT_MS, 1500);
  const client = createClient({
    url: redisUrl,
    socket: {
      connectTimeout: timeoutMs,
      reconnectStrategy: false,
    },
  });

  client.on('error', () => undefined);

  try {
    await withTimeout(client.connect(), timeoutMs);
    const response = await withTimeout(client.ping(), timeoutMs);
    return response === 'PONG'
      ? { ok: true }
      : { ok: false, reason: `unexpected PING response: ${response}` };
  } catch (error) {
    const reason = error instanceof Error && error.message ? error.message : 'connection failed';
    return { ok: false, reason };
  } finally {
    if (client.isOpen) {
      await client.disconnect().catch(() => undefined);
    }
  }
};

export const evaluateRuntimeDependencyReadiness = async (): Promise<RuntimeDependencyReadiness> => {
  const issues: RuntimeDependencyIssue[] = [];

  if (isRedisRequired()) {
    const redis = await pingRedis();
    if (!redis.ok) {
      issues.push({
        key: 'REDIS_URL',
        reason: `redis unavailable${redis.reason ? `: ${redis.reason}` : ''}`,
      });
    }
  }

  return {
    ready: issues.length === 0,
    issues,
  };
};

export const __runtimeDependencyReadinessInternals = {
  setPingRedisForTests: (override: (() => Promise<RedisPingResult>) | null) => {
    pingRedisOverride = override;
  },
};
