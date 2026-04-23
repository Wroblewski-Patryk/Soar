import { BinanceMarketStreamWorker } from '../modules/market-stream/binanceStream.service';
import { publishMarketStreamEvent } from '../modules/market-stream/marketStreamFanout';
import { prisma } from '../prisma/client';
import { bootstrapWorker } from './workerBootstrap';
import { createModuleLogger } from '../lib/logger';
import {
  resolveMarketStreamDynamicSubscriptions,
  type StreamSubscriptions,
} from './marketStreamSubscriptions.service';

const logger = createModuleLogger('market-stream.bootstrap');

const parseCsv = (value: string | undefined, fallback: string[]) => {
  const items = value
    ?.split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return items && items.length > 0 ? items : fallback;
};

const parseRefreshMs = (value: string | undefined, fallbackMs: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs;
  return parsed;
};

const marketType = process.env.MARKET_STREAM_MARKET_TYPE === 'SPOT' ? 'SPOT' : 'FUTURES';
const envSymbols = parseCsv(process.env.MARKET_STREAM_SYMBOLS, ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']);
const envIntervals = parseCsv(process.env.MARKET_STREAM_INTERVALS, ['1m', '5m']).map((interval) =>
  interval.trim().toLowerCase()
);
const refreshMs = parseRefreshMs(process.env.MARKET_STREAM_SUBSCRIPTIONS_REFRESH_MS, 30_000);

const buildSubscriptionFingerprint = (subscriptions: StreamSubscriptions) =>
  `${subscriptions.symbols.join(',')}|${subscriptions.candleIntervals.join(',')}`;

bootstrapWorker({
  workerName: 'market-stream',
});

let worker: BinanceMarketStreamWorker | null = null;
let subscriptionFingerprint = '';
let refreshTimer: NodeJS.Timeout | null = null;

const logSubscriptionsRefreshFailure = (error: unknown) => {
  logger.error('market_stream.subscriptions_refresh_failed', {
    error: error instanceof Error ? error.message : 'unknown_error',
  });
};

const startOrReloadWorker = async () => {
  const subscriptions = await resolveMarketStreamDynamicSubscriptions({
    marketType,
    envSymbols,
    envIntervals,
  });
  const nextFingerprint = buildSubscriptionFingerprint(subscriptions);
  if (subscriptionFingerprint === nextFingerprint && worker) {
    // Keep trying to reconnect when socket was closed but subscriptions did not change.
    worker.start();
    return;
  }

  worker?.stop();
  worker = new BinanceMarketStreamWorker({
    streamUrl: process.env.BINANCE_STREAM_URL,
    marketType,
    symbols: subscriptions.symbols,
    candleIntervals: subscriptions.candleIntervals,
    onEvent: publishMarketStreamEvent,
  });
  worker.start();
  subscriptionFingerprint = nextFingerprint;

  logger.info('market_stream.subscriptions_updated', {
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
