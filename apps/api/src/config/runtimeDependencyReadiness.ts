import { createClient } from 'redis';
import { prisma } from '../prisma/client';

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

type DatabasePingResult = {
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

const isDatabaseRequired = () => process.env.DATABASE_REQUIRED !== 'false';

let pingRedisOverride: (() => Promise<RedisPingResult>) | null = null;
let pingDatabaseOverride: (() => Promise<DatabasePingResult>) | null = null;

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

const pingDatabase = async (): Promise<DatabasePingResult> => {
  if (pingDatabaseOverride) return pingDatabaseOverride();

  const timeoutMs = asPositiveInteger(process.env.READINESS_DATABASE_TIMEOUT_MS, 1500);
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, timeoutMs);
    return { ok: true };
  } catch (error) {
    const reason = error instanceof Error && error.message ? error.message : 'query failed';
    return { ok: false, reason };
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

  if (isDatabaseRequired()) {
    const database = await pingDatabase();
    if (!database.ok) {
      issues.push({
        key: 'DATABASE_URL',
        reason: `database unavailable${database.reason ? `: ${database.reason}` : ''}`,
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
  setPingDatabaseForTests: (override: (() => Promise<DatabasePingResult>) | null) => {
    pingDatabaseOverride = override;
  },
};
