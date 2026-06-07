import { BinanceMarketStreamWorker } from '../modules/market-stream/binanceStream.service';
import { ExchangePublicPollingMarketStreamWorker } from '../modules/market-stream/exchangePollingStream.service';
import { publishMarketStreamEvent } from '../modules/market-stream/marketStreamFanout';
import { prisma } from '../prisma/client';
import { bootstrapWorker } from './workerBootstrap';
import { createModuleLogger } from '../lib/logger';
import {
  resolveMarketStreamDynamicSubscriptions,
  type StreamSubscriptions,
} from './marketStreamSubscriptions.service';
import { resolveMarketStreamWorkerConfig } from './marketStreamWorkerConfig';

const logger = createModuleLogger('market-stream.bootstrap');

export const buildSubscriptionFingerprint = (subscriptions: StreamSubscriptions) =>
  `${subscriptions.symbols.join(',')}|${subscriptions.candleIntervals.join(',')}`;

type MarketStreamLifecycleWorker = { start: () => void; stop: () => void };

type MarketStreamLifecycleDeps = ReturnType<typeof resolveMarketStreamWorkerConfig> & {
  bootstrapWorker: typeof bootstrapWorker;
  logger: Pick<ReturnType<typeof createModuleLogger>, 'error' | 'info'>;
  resolveSubscriptions: typeof resolveMarketStreamDynamicSubscriptions;
  publishEvent: typeof publishMarketStreamEvent;
  disconnectPrisma: () => Promise<unknown>;
  createBinanceWorker: (input: ConstructorParameters<typeof BinanceMarketStreamWorker>[0]) => MarketStreamLifecycleWorker;
  createExchangePollingWorker: (
    input: ConstructorParameters<typeof ExchangePublicPollingMarketStreamWorker>[0]
  ) => MarketStreamLifecycleWorker;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
  streamUrl?: string;
};

export const logSubscriptionsRefreshFailure = (
  error: unknown,
  lifecycleLogger: Pick<ReturnType<typeof createModuleLogger>, 'error'> = logger
) => {
  lifecycleLogger.error('market_stream.subscriptions_refresh_failed', {
    error: error instanceof Error ? error.message : 'unknown_error',
  });
};

const createDefaultLifecycleDeps = (): MarketStreamLifecycleDeps => {
  const config = resolveMarketStreamWorkerConfig();
  return {
    ...config,
    bootstrapWorker,
    logger,
    resolveSubscriptions: resolveMarketStreamDynamicSubscriptions,
    publishEvent: publishMarketStreamEvent,
    disconnectPrisma: () => prisma.$disconnect(),
    createBinanceWorker: (input) => new BinanceMarketStreamWorker(input),
    createExchangePollingWorker: (input) => new ExchangePublicPollingMarketStreamWorker(input),
    setInterval,
    clearInterval,
    streamUrl: process.env.BINANCE_STREAM_URL,
  };
};

export const createMarketStreamWorkerLifecycle = (deps: MarketStreamLifecycleDeps) => {
  let worker: MarketStreamLifecycleWorker | null = null;
  let subscriptionFingerprint = '';
  let refreshTimer: NodeJS.Timeout | null = null;

  const startOrReloadWorker = async () => {
    const subscriptions = await deps.resolveSubscriptions({
      exchange: deps.exchange,
      marketType: deps.marketType,
      envSymbols: deps.envSymbols,
      envIntervals: deps.envIntervals,
    });
    const nextFingerprint = `${deps.exchange}|${deps.marketType}|${buildSubscriptionFingerprint(subscriptions)}`;
    if (subscriptionFingerprint === nextFingerprint && worker) {
      // Keep trying to reconnect when socket was closed but subscriptions did not change.
      worker.start();
      return;
    }

    worker?.stop();
    worker =
      deps.exchange === 'GATEIO'
        ? deps.createExchangePollingWorker({
            exchange: deps.exchange,
            marketType: deps.marketType,
            symbols: subscriptions.symbols,
            candleIntervals: subscriptions.candleIntervals,
            pollMs: deps.pollMs,
            onEvent: deps.publishEvent,
          })
        : deps.createBinanceWorker({
            streamUrl: deps.streamUrl,
            marketType: deps.marketType,
            symbols: subscriptions.symbols,
            candleIntervals: subscriptions.candleIntervals,
            onEvent: deps.publishEvent,
          });
    worker.start();
    subscriptionFingerprint = nextFingerprint;

    deps.logger.info('market_stream.subscriptions_updated', {
      exchange: deps.exchange,
      marketType: deps.marketType,
      symbolsCount: subscriptions.symbols.length,
      intervalsCount: subscriptions.candleIntervals.length,
      symbols: subscriptions.symbols,
      intervals: subscriptions.candleIntervals,
    });
  };

  const shutdown = async () => {
    if (refreshTimer) {
      deps.clearInterval(refreshTimer);
      refreshTimer = null;
    }
    worker?.stop();
    worker = null;
    await deps.disconnectPrisma().catch(() => undefined);
  };

  const start = () => {
    deps.bootstrapWorker({
      workerName: 'market-stream',
    });

    refreshTimer = deps.setInterval(() => {
      void startOrReloadWorker().catch((error) => logSubscriptionsRefreshFailure(error, deps.logger));
    }, deps.refreshMs);

    void startOrReloadWorker().catch((error) => logSubscriptionsRefreshFailure(error, deps.logger));
  };

  return {
    start,
    startOrReloadWorker,
    shutdown,
  };
};

const lifecycle = createMarketStreamWorkerLifecycle(createDefaultLifecycleDeps());

export const startOrReloadWorker = lifecycle.startOrReloadWorker;
export const shutdown = lifecycle.shutdown;
export const startMarketStreamWorker = lifecycle.start;

if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
  startMarketStreamWorker();

  process.on('SIGINT', () => {
    void shutdown().finally(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    void shutdown().finally(() => process.exit(0));
  });
}
