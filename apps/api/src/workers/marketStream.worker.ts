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

const { exchange, marketType, envSymbols, envIntervals, refreshMs, pollMs } =
  resolveMarketStreamWorkerConfig();

const buildSubscriptionFingerprint = (subscriptions: StreamSubscriptions) =>
  `${subscriptions.symbols.join(',')}|${subscriptions.candleIntervals.join(',')}`;

bootstrapWorker({
  workerName: 'market-stream',
});

let worker: { start: () => void; stop: () => void } | null = null;
let subscriptionFingerprint = '';
let refreshTimer: NodeJS.Timeout | null = null;

const logSubscriptionsRefreshFailure = (error: unknown) => {
  logger.error('market_stream.subscriptions_refresh_failed', {
    error: error instanceof Error ? error.message : 'unknown_error',
  });
};

const startOrReloadWorker = async () => {
  const subscriptions = await resolveMarketStreamDynamicSubscriptions({
    exchange,
    marketType,
    envSymbols,
    envIntervals,
  });
  const nextFingerprint = `${exchange}|${marketType}|${buildSubscriptionFingerprint(subscriptions)}`;
  if (subscriptionFingerprint === nextFingerprint && worker) {
    // Keep trying to reconnect when socket was closed but subscriptions did not change.
    worker.start();
    return;
  }

  worker?.stop();
  worker =
    exchange === 'GATEIO'
      ? new ExchangePublicPollingMarketStreamWorker({
          exchange,
          marketType,
          symbols: subscriptions.symbols,
          candleIntervals: subscriptions.candleIntervals,
          pollMs,
          onEvent: publishMarketStreamEvent,
        })
      : new BinanceMarketStreamWorker({
          streamUrl: process.env.BINANCE_STREAM_URL,
          marketType,
          symbols: subscriptions.symbols,
          candleIntervals: subscriptions.candleIntervals,
          onEvent: publishMarketStreamEvent,
        });
  worker.start();
  subscriptionFingerprint = nextFingerprint;

  logger.info('market_stream.subscriptions_updated', {
    exchange,
    marketType,
    symbolsCount: subscriptions.symbols.length,
    intervalsCount: subscriptions.candleIntervals.length,
    symbols: subscriptions.symbols,
    intervals: subscriptions.candleIntervals,
  });
};

const shutdown = async () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  worker?.stop();
  worker = null;
  await prisma.$disconnect().catch(() => undefined);
};

refreshTimer = setInterval(() => {
  void startOrReloadWorker().catch(logSubscriptionsRefreshFailure);
}, refreshMs);

void startOrReloadWorker().catch(logSubscriptionsRefreshFailure);

process.on('SIGINT', () => {
  void shutdown().finally(() => process.exit(0));
});
process.on('SIGTERM', () => {
  void shutdown().finally(() => process.exit(0));
});
