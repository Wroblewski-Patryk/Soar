import { describe, expect, it, vi } from 'vitest';

import {
  buildSubscriptionFingerprint,
  createMarketStreamWorkerLifecycle,
  logSubscriptionsRefreshFailure,
} from './marketStream.worker';

const createLifecycleDeps = (overrides: Partial<Parameters<typeof createMarketStreamWorkerLifecycle>[0]> = {}) => ({
  exchange: 'BINANCE' as const,
  marketType: 'FUTURES' as const,
  envSymbols: ['BTCUSDT'],
  envIntervals: ['1m'],
  refreshMs: 30_000,
  pollMs: 30_000,
  bootstrapWorker: vi.fn(),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
  resolveSubscriptions: vi.fn(async () => ({
    symbols: ['BTCUSDT'],
    candleIntervals: ['1m'],
  })),
  publishEvent: vi.fn(async () => undefined),
  disconnectPrisma: vi.fn(async () => undefined),
  createBinanceWorker: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createExchangePollingWorker: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
  })),
  setInterval: vi.fn(() => 99 as any),
  clearInterval: vi.fn(),
  streamUrl: 'wss://example.invalid/ws',
  ...overrides,
});

describe('marketStream.worker lifecycle', () => {
  it('builds a deterministic subscription fingerprint', () => {
    expect(
      buildSubscriptionFingerprint({
        symbols: ['BTCUSDT', 'ETHUSDT'],
        candleIntervals: ['1m', '5m'],
      })
    ).toBe('BTCUSDT,ETHUSDT|1m,5m');
  });

  it('starts the configured Binance worker and restarts it when subscriptions are unchanged', async () => {
    const firstWorker = { start: vi.fn(), stop: vi.fn() };
    const deps = createLifecycleDeps({
      createBinanceWorker: vi.fn(() => firstWorker),
    });
    const lifecycle = createMarketStreamWorkerLifecycle(deps);

    await lifecycle.startOrReloadWorker();
    await lifecycle.startOrReloadWorker();

    expect(deps.resolveSubscriptions).toHaveBeenCalledTimes(2);
    expect(deps.createBinanceWorker).toHaveBeenCalledTimes(1);
    expect(firstWorker.start).toHaveBeenCalledTimes(2);
    expect(firstWorker.stop).not.toHaveBeenCalled();
  });

  it('replaces the worker when the subscription fingerprint changes', async () => {
    const firstWorker = { start: vi.fn(), stop: vi.fn() };
    const secondWorker = { start: vi.fn(), stop: vi.fn() };
    const resolveSubscriptions = vi
      .fn()
      .mockResolvedValueOnce({ symbols: ['BTCUSDT'], candleIntervals: ['1m'] })
      .mockResolvedValueOnce({ symbols: ['BTCUSDT', 'ETHUSDT'], candleIntervals: ['1m'] });
    const deps = createLifecycleDeps({
      resolveSubscriptions,
      createBinanceWorker: vi.fn().mockReturnValueOnce(firstWorker).mockReturnValueOnce(secondWorker),
    });
    const lifecycle = createMarketStreamWorkerLifecycle(deps);

    await lifecycle.startOrReloadWorker();
    await lifecycle.startOrReloadWorker();

    expect(deps.createBinanceWorker).toHaveBeenCalledTimes(2);
    expect(firstWorker.stop).toHaveBeenCalledTimes(1);
    expect(secondWorker.start).toHaveBeenCalledTimes(1);
    expect(deps.logger.info).toHaveBeenLastCalledWith('market_stream.subscriptions_updated', {
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbolsCount: 2,
      intervalsCount: 1,
      symbols: ['BTCUSDT', 'ETHUSDT'],
      intervals: ['1m'],
    });
  });

  it('uses the exchange polling worker for Gate.io subscriptions', async () => {
    const pollingWorker = { start: vi.fn(), stop: vi.fn() };
    const deps = createLifecycleDeps({
      exchange: 'GATEIO',
      createExchangePollingWorker: vi.fn(() => pollingWorker),
    });
    const lifecycle = createMarketStreamWorkerLifecycle(deps);

    await lifecycle.startOrReloadWorker();

    expect(deps.createExchangePollingWorker).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbols: ['BTCUSDT'],
      candleIntervals: ['1m'],
      pollMs: 30_000,
      onEvent: deps.publishEvent,
    });
    expect(pollingWorker.start).toHaveBeenCalledTimes(1);
  });

  it('logs subscription refresh failures with redacted-safe error shape', () => {
    const logger = { error: vi.fn() };

    logSubscriptionsRefreshFailure(new Error('database down'), logger);
    logSubscriptionsRefreshFailure('bad', logger);

    expect(logger.error).toHaveBeenNthCalledWith(1, 'market_stream.subscriptions_refresh_failed', {
      error: 'database down',
    });
    expect(logger.error).toHaveBeenNthCalledWith(2, 'market_stream.subscriptions_refresh_failed', {
      error: 'unknown_error',
    });
  });

  it('clears refresh interval, stops the worker, and disconnects Prisma during shutdown', async () => {
    const worker = { start: vi.fn(), stop: vi.fn() };
    const deps = createLifecycleDeps({
      createBinanceWorker: vi.fn(() => worker),
    });
    const lifecycle = createMarketStreamWorkerLifecycle(deps);

    lifecycle.start();
    await lifecycle.startOrReloadWorker();
    await lifecycle.shutdown();

    expect(deps.bootstrapWorker).toHaveBeenCalledWith({ workerName: 'market-stream' });
    expect(deps.clearInterval).toHaveBeenCalledWith(99);
    expect(worker.stop).toHaveBeenCalledTimes(1);
    expect(deps.disconnectPrisma).toHaveBeenCalledTimes(1);
  });
});
