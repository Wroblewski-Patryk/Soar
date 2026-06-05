import request from 'supertest';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../index';
import { prisma } from '../prisma/client';
import { signAuthToken } from '../modules/auth/auth.jwt';

const originalNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'test';
const originalJwtSecret = process.env.JWT_SECRET;

const workerHeartbeatClientMock = vi.hoisted(() => ({
  readMany: vi.fn(),
}));

vi.mock('../workers/workerHeartbeat', () => ({
  workerHeartbeatClient: workerHeartbeatClientMock,
}));

const originalWorkerMode = process.env.WORKER_MODE;
const originalMarketQueue = process.env.WORKER_MARKET_DATA_QUEUE;
const originalBacktestQueue = process.env.WORKER_BACKTEST_QUEUE;
const originalExecutionQueue = process.env.WORKER_EXECUTION_QUEUE;
const originalMarketDataOwnership = process.env.WORKER_MARKET_DATA_OWNERSHIP;
const originalBacktestOwnership = process.env.WORKER_BACKTEST_OWNERSHIP;
type MockAuthUser = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  sessionVersion: number;
};
const authUsers = new Map<string, MockAuthUser>();

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'jwt-primary-generated-material-32-plus';
  authUsers.clear();
  vi.spyOn(prisma.user, 'findUnique').mockImplementation((async (args: any) => {
    const id = args?.where?.id;
    if (typeof id !== 'string') return null;
    return authUsers.get(id) ?? null;
  }) as unknown as typeof prisma.user.findUnique);
});

afterEach(() => {
  process.env.WORKER_MODE = originalWorkerMode;
  process.env.WORKER_MARKET_DATA_QUEUE = originalMarketQueue;
  process.env.WORKER_BACKTEST_QUEUE = originalBacktestQueue;
  process.env.WORKER_EXECUTION_QUEUE = originalExecutionQueue;
  process.env.WORKER_MARKET_DATA_OWNERSHIP = originalMarketDataOwnership;
  process.env.WORKER_BACKTEST_OWNERSHIP = originalBacktestOwnership;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
  vi.restoreAllMocks();
  workerHeartbeatClientMock.readMany.mockReset();
});

afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

const createAuthHeader = (role: 'USER' | 'ADMIN') => {
  const id = `workers-${role.toLowerCase()}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `${id}@example.com`;
  authUsers.set(id, {
    id,
    email,
    role,
    sessionVersion: 1,
  });
  const token = signAuthToken(
    {
      userId: id,
      email,
      role,
      sessionVersion: 1,
    },
    '1h'
  );
  return `Bearer ${token}`;
};

describe('workers health and readiness endpoints', () => {
  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/workers/health');
    expect(res.status).toBe(401);
  });

  it('returns workers health status', async () => {
    const authHeader = createAuthHeader('ADMIN');
    process.env.WORKER_MODE = 'inline';
    const res = await request(app).get('/workers/health').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('workers');
    expect(res.body.mode).toBe('inline');
  });

  it('rejects authenticated non-admin principal for workers readiness', async () => {
    const authHeader = createAuthHeader('USER');
    const res = await request(app).get('/workers/ready').set('Authorization', authHeader);
    expect(res.status).toBe(403);
  });

  it('returns ready in non-split mode', async () => {
    const authHeader = createAuthHeader('ADMIN');
    process.env.WORKER_MODE = 'inline';
    const res = await request(app).get('/workers/ready').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.mode).toBe('inline');
  });

  it('returns ready in split mode when backtest and market-data ownership stays inline', async () => {
    const authHeader = createAuthHeader('ADMIN');
    process.env.WORKER_MODE = 'split';
    process.env.WORKER_MARKET_DATA_OWNERSHIP = 'inline';
    process.env.WORKER_BACKTEST_OWNERSHIP = 'inline';
    process.env.WORKER_MARKET_DATA_QUEUE = '';
    process.env.WORKER_BACKTEST_QUEUE = '';
    process.env.WORKER_EXECUTION_QUEUE = 'execution';
    workerHeartbeatClientMock.readMany.mockResolvedValue([
      { worker: 'execution', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
      { worker: 'market-stream', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
    ]);

    const res = await request(app).get('/workers/ready').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.mode).toBe('split');
    expect(res.body.requiredQueues).toEqual(['WORKER_EXECUTION_QUEUE']);
  });

  it('returns not_ready in split mode when required queues are missing', async () => {
    const authHeader = createAuthHeader('ADMIN');
    process.env.WORKER_MODE = 'split';
    process.env.WORKER_MARKET_DATA_OWNERSHIP = 'worker';
    process.env.WORKER_BACKTEST_OWNERSHIP = 'worker';
    process.env.WORKER_MARKET_DATA_QUEUE = '';
    process.env.WORKER_BACKTEST_QUEUE = '';
    process.env.WORKER_EXECUTION_QUEUE = '';

    const res = await request(app).get('/workers/ready').set('Authorization', authHeader);
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
    expect(res.body.missing).toContain('WORKER_MARKET_DATA_QUEUE');
    expect(res.body.missing).toContain('WORKER_BACKTEST_QUEUE');
    expect(res.body.missing).toContain('WORKER_EXECUTION_QUEUE');
  });

  it('returns ready in split mode when queue envs are provided', async () => {
    const authHeader = createAuthHeader('ADMIN');
    process.env.WORKER_MODE = 'split';
    process.env.WORKER_MARKET_DATA_OWNERSHIP = 'worker';
    process.env.WORKER_BACKTEST_OWNERSHIP = 'worker';
    process.env.WORKER_MARKET_DATA_QUEUE = 'market-data';
    process.env.WORKER_BACKTEST_QUEUE = 'backtests';
    process.env.WORKER_EXECUTION_QUEUE = 'execution';
    workerHeartbeatClientMock.readMany.mockResolvedValue([
      { worker: 'backtest', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
      { worker: 'execution', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
      { worker: 'market-data', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
      { worker: 'market-stream', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
    ]);

    const res = await request(app).get('/workers/ready').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.mode).toBe('split');
    expect(res.body.heartbeats).toHaveLength(4);
  });

  it('returns not_ready in split mode when a required worker heartbeat is stale', async () => {
    const authHeader = createAuthHeader('ADMIN');
    process.env.WORKER_MODE = 'split';
    process.env.WORKER_MARKET_DATA_OWNERSHIP = 'worker';
    process.env.WORKER_BACKTEST_OWNERSHIP = 'worker';
    process.env.WORKER_MARKET_DATA_QUEUE = 'market-data';
    process.env.WORKER_BACKTEST_QUEUE = 'backtests';
    process.env.WORKER_EXECUTION_QUEUE = 'execution';
    workerHeartbeatClientMock.readMany.mockResolvedValue([
      { worker: 'backtest', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
      { worker: 'execution', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
      { worker: 'market-data', status: 'stale', lastHeartbeatAt: '2000-01-01T00:00:00.000Z', ageMs: 1_000_000 },
      { worker: 'market-stream', status: 'fresh', lastHeartbeatAt: new Date().toISOString(), ageMs: 1 },
    ]);

    const res = await request(app).get('/workers/ready').set('Authorization', authHeader);
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
    expect(res.body.staleWorkers).toEqual(['market-data']);
  });
});
