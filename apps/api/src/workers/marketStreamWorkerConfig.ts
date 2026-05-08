import type { Exchange } from '@prisma/client';
import type { ExchangeMarketType } from '../modules/exchange/exchangeCapabilities';

export type MarketStreamWorkerConfig = {
  exchange: Extract<Exchange, 'BINANCE' | 'GATEIO'>;
  marketType: ExchangeMarketType;
  envSymbols: string[];
  envIntervals: string[];
  refreshMs: number;
  pollMs: number;
};

export const parseMarketStreamCsv = (value: string | undefined, fallback: string[]) => {
  const items = value
    ?.split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return items && items.length > 0 ? items : fallback;
};

export const parseMarketStreamRefreshMs = (value: string | undefined, fallbackMs: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs;
  return parsed;
};

export const resolveMarketStreamWorkerConfig = (
  env: NodeJS.ProcessEnv = process.env
): MarketStreamWorkerConfig => ({
  marketType: env.MARKET_STREAM_MARKET_TYPE === 'SPOT' ? 'SPOT' : 'FUTURES',
  exchange: env.MARKET_STREAM_EXCHANGE === 'GATEIO' ? 'GATEIO' : 'BINANCE',
  envSymbols: parseMarketStreamCsv(env.MARKET_STREAM_SYMBOLS, ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']),
  envIntervals: parseMarketStreamCsv(env.MARKET_STREAM_INTERVALS, ['1m', '5m']).map((interval) =>
    interval.trim().toLowerCase()
  ),
  refreshMs: parseMarketStreamRefreshMs(env.MARKET_STREAM_SUBSCRIPTIONS_REFRESH_MS, 30_000),
  pollMs: parseMarketStreamRefreshMs(env.MARKET_STREAM_POLL_MS, 30_000),
});
