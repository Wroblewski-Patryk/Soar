import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../index';
import { prisma } from '../prisma/client';

const workerHeartbeatClientMock = vi.hoisted(() => ({
  readMany: vi.fn(),
}));
const liveExecutionMock = vi.hoisted(() => ({ readLiveExecutionOperationalStatus: vi.fn() }));

vi.mock('../workers/workerHeartbeat', () => ({
  workerHeartbeatClient: workerHeartbeatClientMock,
}));
vi.mock('../observability/liveExecutionOperationalStatus', () => liveExecutionMock);

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
  liveExecutionMock.readLiveExecutionOperationalStatus.mockReset();
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
  beforeEach(() => {
    liveExecutionMock.readLiveExecutionOperationalStatus.mockResolvedValue({
      status: 'healthy', stream: { status: 'healthy', eligibleAccounts: 0,
        connectedAccounts: 0 }, recovery: { status: 'healthy' },
    });
  });
  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/workers/health');
    expect(res.status).toBe(401);
    expect((await request(app).get('/workers/live-execution')).status).toBe(401);
  });

  it('exposes aggregate LIVE execution state only to operators', async () => {
    const adminAgent = await createAdminAgent();
    liveExecutionMock.readLiveExecutionOperationalStatus.mockResolvedValue({
      status: 'degraded', stream: { status: 'degraded', eligibleAccounts: 1,
        connectedAccounts: 0, reconnectTotal: 2, errorTotal: 1 },
      recovery: { status: 'healthy', pendingCount: 3, oldestPendingAgeMs: 1200,
        unknownTotal: 4, errorTotal: 0 },
    });
    const res = await adminAgent.get('/workers/live-execution');
    expect(res.status).toBe(503);
    expect(res.body.stream).toMatchObject({ connectedAccounts: 0, reconnectTotal: 2 });
    expect(res.body.recovery).toMatchObject({ pendingCount: 3, unknownTotal: 4 });
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

  it('rejects split-worker READY when the LIVE stream is disconnected', async () => {
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
    liveExecutionMock.readLiveExecutionOperationalStatus.mockResolvedValue({
      status: 'degraded', stream: { status: 'degraded', eligibleAccounts: 1,
        connectedAccounts: 0 }, recovery: { status: 'healthy' },
    });
    const res = await adminAgent.get('/workers/ready');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not_ready');
    expect(res.body.liveExecution.stream.connectedAccounts).toBe(0);
  });
});
