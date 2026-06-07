import { describe, expect, it, vi } from 'vitest';

import { createWorkerBootstrap, logWorkerEvent } from './workerBootstrap';

const createLoggers = () => ({
  'market-data': { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  backtest: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  execution: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  'market-stream': { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
});

describe('workerBootstrap', () => {
  it('logs worker start metadata and records the initial heartbeat', async () => {
    const heartbeatClient = { record: vi.fn(async () => undefined) };
    const loggers = createLoggers();
    const clearInterval = vi.fn();
    const bootstrapWorker = createWorkerBootstrap({
      heartbeatClient,
      loggers,
      now: () => new Date('2026-06-06T22:15:00.000Z'),
      setInterval: vi.fn(() => 42 as any),
      clearInterval,
    });

    const handle = bootstrapWorker({
      workerName: 'execution',
      heartbeatIntervalMs: 5_000,
      queueName: 'execution',
      queueTuning: {
        concurrency: 2,
        attempts: 3,
        backoffMs: 1000,
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });

    await handle.recordHeartbeat();
    handle.stop();

    expect(loggers.execution.info).toHaveBeenCalledWith('worker_started', {
      heartbeatIntervalMs: 5_000,
      queueName: 'execution',
      queueTuning: {
        concurrency: 2,
        attempts: 3,
        backoffMs: 1000,
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });
    expect(heartbeatClient.record).toHaveBeenCalledWith(
      'execution',
      new Date('2026-06-06T22:15:00.000Z')
    );
    expect(loggers.execution.info).toHaveBeenCalledWith('worker_heartbeat', undefined);
    expect(process.env.WORKER_LAST_HEARTBEAT_AT).toBe('2026-06-06T22:15:00.000Z');
    expect(clearInterval).toHaveBeenCalledWith(42);
  });

  it('logs bootstrap heartbeat failures without throwing', async () => {
    const error = new Error('redis unavailable');
    const loggers = createLoggers();
    const bootstrapWorker = createWorkerBootstrap({
      heartbeatClient: { record: vi.fn(async () => Promise.reject(error)) },
      loggers,
      now: () => new Date('2026-06-06T22:16:00.000Z'),
      setInterval: vi.fn(() => 7 as any),
      clearInterval: vi.fn(),
    });

    bootstrapWorker({ workerName: 'market-stream' });
    await Promise.resolve();
    await Promise.resolve();

    await vi.waitFor(() => {
      expect(loggers['market-stream'].error).toHaveBeenCalledWith('worker_heartbeat_record_failed', {
        error: 'redis unavailable',
      });
    });
  });

  it('routes logWorkerEvent through the worker-specific logger', () => {
    const loggers = createLoggers();

    logWorkerEvent('backtest', 'worker_started', { queueName: 'backtest' }, { loggers });

    expect(loggers.backtest.info).toHaveBeenCalledWith('worker_started', { queueName: 'backtest' });
  });
});
