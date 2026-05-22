import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { app } from '../index';
import { prisma } from '../prisma/client';

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

afterEach(() => {
  process.env.WORKER_MODE = originalWorkerMode;
  process.env.WORKER_MARKET_DATA_QUEUE = originalMarketQueue;
  process.env.WORKER_BACKTEST_QUEUE = originalBacktestQueue;
  process.env.WORKER_EXECUTION_QUEUE = originalExecutionQueue;
  process.env.WORKER_MARKET_DATA_OWNERSHIP = originalMarketDataOwnership;
  process.env.WORKER_BACKTEST_OWNERSHIP = originalBacktestOwnership;
  workerHeartbeatClientMock.readMany.mockReset();
});

const createAdminAgent = async () => {
  const email = `workers-admin-${Date.now()}-${Math.random()}@example.com`;
  const agent = request.agent(app);
  const registerRes = await agent.post('/auth/register').send({
    email,
    password: 'Admin12#$',
  });
  expect(registerRes.status).toBe(201);

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  const loginRes = await agent.post('/auth/login').send({
    email,
    password: 'Admin12#$',
  });
  expect(loginRes.status).toBe(200);
  return agent;
};

describe('workers health and readiness endpoints', () => {
  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/workers/health');
    expect(res.status).toBe(401);
  });

  it('returns workers health status', async () => {
    const adminAgent = await createAdminAgent();
    process.env.WORKER_MODE = 'inline';
    const res = await adminAgent.get('/workers/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('workers');
    expect(res.body.mode).toBe('inline');
  });

  it('returns ready in non-split mode', async () => {
    const adminAgent = await createAdminAgent();
    process.env.WORKER_MODE = 'inline';
    const res = await adminAgent.get('/workers/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.mode).toBe('inline');
  });

  it('returns ready in split mode when backtest and market-data ownership stays inline', async () => {
    const adminAgent = await createAdminAgent();
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

    const res = await adminAgent.get('/workers/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.mode).toBe('split');
    expect(res.body.requiredQueues).toEqual(['WORKER_EXECUTION_QUEUE']);
  });

  it('returns not_ready in split mode when required queues are missing', async () => {
    const adminAgent = await createAdminAgent();
    process.env.WORKER_MODE = 'split';
    process.env.WORKER_MARKET_DATA_OWNERSHIP = 'worker';
    process.env.WORKER_BACKTEST_OWNERSHIP = 'worker';
    process.env.WORKER_MARKET_DATA_QUEUE = '';
    process.env.WORKER_BACKTEST_QUEUE = '';
    process.env.WORKER_EXECUTION_QUEUE = '';

    const res = await adminAgent.get('/workers/ready');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
    expect(res.body.missing).toContain('WORKER_MARKET_DATA_QUEUE');
    expect(res.body.missing).toContain('WORKER_BACKTEST_QUEUE');
    expect(res.body.missing).toContain('WORKER_EXECUTION_QUEUE');
  });

  it('returns ready in split mode when queue envs are provided', async () => {
    const adminAgent = await createAdminAgent();
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

    const res = await adminAgent.get('/workers/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.mode).toBe('split');
    expect(res.body.heartbeats).toHaveLength(4);
  });

  it('returns not_ready in split mode when a required worker heartbeat is stale', async () => {
    const adminAgent = await createAdminAgent();
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

    const res = await adminAgent.get('/workers/ready');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
    expect(res.body.staleWorkers).toEqual(['market-data']);
  });
});
