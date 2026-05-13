import { Exchange } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { fetchBinancePublicRestJson } from '../exchange/binancePublicRest.service';
import {
  fetchExchangePublicFundingRateHistory,
  fetchExchangePublicOpenInterestHistory,
  fetchExchangePublicRecentCandles,
} from '../exchange/exchangePublicMarketData.service';
import { getTimeframeIntervalMs, normalizeTimeframe } from './backtestTimeframe';

export type BacktestMarketType = 'SPOT' | 'FUTURES';

export type BacktestKlineCandle = {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type BacktestFundingRatePoint = {
  timestamp: number;
  fundingRate: number;
};

export type BacktestOpenInterestPoint = {
  timestamp: number;
  openInterest: number;
};

export type BacktestOrderBookPoint = {
  timestamp: number;
  imbalance: number;
  spreadBps: number;
  depthRatio: number;
};

export type BacktestSupplementalSeries = {
  fundingRates: BacktestFundingRatePoint[];
  openInterest: BacktestOpenInterestPoint[];
  orderBook: BacktestOrderBookPoint[];
};

type DbCandleCacheRow = {
  openTime: bigint;
  closeTime: bigint;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type DbCandleDelegate = {
  findMany: (args: unknown) => Promise<DbCandleCacheRow[]>;
  createMany: (args: unknown) => Promise<unknown>;
};

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const CANDLE_CACHE_TTL_MS = 20 * 60 * 1000;
const useDbCandleCache = (process.env.BACKTEST_USE_DB_CANDLE_CACHE ?? 'true').toLowerCase() !== 'false';

const candleCache = new Map<
  string,
  {
    cachedAt: number;
    candles: BacktestKlineCandle[];
  }
>();

const supplementalCache = new Map<
  string,
  {
    cachedAt: number;
    data: BacktestSupplementalSeries;
  }
>();

let dbCandleDelegateOverride: DbCandleDelegate | null = null;

const getDbCandleDelegate = () =>
  dbCandleDelegateOverride ??
  (prisma as unknown as {
    marketCandleCache?: DbCandleDelegate;
  }).marketCandleCache;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const computeSourceWindowMs = (timeframe: string, maxCandles: number) => {
  const intervalMs = getTimeframeIntervalMs(timeframe);
  const requestedWindowMs = intervalMs * Math.max(1, maxCandles);
  const bufferedWindowMs = Math.ceil(requestedWindowMs * 1.15);
  return Math.max(TWO_WEEKS_MS, bufferedWindowMs);
};

const safeFloat = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toKlineFromDb = (row: DbCandleCacheRow): BacktestKlineCandle => ({
  openTime: Number(row.openTime),
  closeTime: Number(row.closeTime),
  open: row.open,
  high: row.high,
  low: row.low,
  close: row.close,
  volume: row.volume,
});

export const hasContinuousCandleIntervals = (
  candles: BacktestKlineCandle[],
  timeframe: string,
) => {
  if (candles.length <= 1) return true;

  const intervalMs = getTimeframeIntervalMs(timeframe);
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) return false;

  for (let index = 1; index < candles.length; index += 1) {
    const previousOpen = candles[index - 1]?.openTime;
    const currentOpen = candles[index]?.openTime;
    if (!Number.isFinite(previousOpen) || !Number.isFinite(currentOpen)) {
      return false;
    }
    if (currentOpen <= previousOpen) return false;
    if (currentOpen - previousOpen !== intervalMs) return false;
  }

  return true;
};

export const setDbCandleDelegateForTests = (delegate: DbCandleDelegate | null) => {
  dbCandleDelegateOverride = delegate;
};

export const resetBacktestDataGatewayCacheForTests = () => {
  candleCache.clear();
  supplementalCache.clear();
  dbCandleDelegateOverride = null;
};

const cacheKeyForCandles = (
  exchange: Exchange,
  symbol: string,
  timeframe: string,
  marketType: BacktestMarketType,
  maxCandles: number,
  endTimeMs?: number,
  startTimeMs?: number,
) =>
  `${exchange}:${marketType}:${symbol}:${normalizeTimeframe(timeframe)}:${maxCandles}:${
    Number.isFinite(endTimeMs) ? Math.floor(endTimeMs as number) : 'latest'
  }:${Number.isFinite(startTimeMs) ? Math.floor(startTimeMs as number) : 'auto'}`;

const cacheKeyForSupplemental = (
  exchange: Exchange,
  symbol: string,
  timeframe: string,
  marketType: BacktestMarketType,
  maxCandles: number,
  endTimeMs?: number,
  startTimeMs?: number,
) =>
  `supp:${exchange}:${marketType}:${symbol}:${normalizeTimeframe(timeframe)}:${maxCandles}:${
    Number.isFinite(endTimeMs) ? Math.floor(endTimeMs as number) : 'latest'
  }:${Number.isFinite(startTimeMs) ? Math.floor(startTimeMs as number) : 'auto'}`;

const pruneGatewayCache = () => {
  const now = Date.now();
  for (const [key, value] of candleCache.entries()) {
    if (now - value.cachedAt > CANDLE_CACHE_TTL_MS) candleCache.delete(key);
  }
  for (const [key, value] of supplementalCache.entries()) {
    if (now - value.cachedAt > CANDLE_CACHE_TTL_MS) supplementalCache.delete(key);
  }
};

const openInterestPeriodForTimeframe = (timeframe: string) => {
  const normalized = normalizeTimeframe(timeframe);
  const supported = new Set(['5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d']);
  if (supported.has(normalized)) return normalized;
  return '5m';
};

const fetchKlineChunk = async (input: {
  exchange: Exchange;
  symbol: string;
  normalizedTimeframe: string;
  chunkLimit: number;
  startTime: number;
  endTime: number;
  marketType: BacktestMarketType;
}): Promise<BacktestKlineCandle[]> => {
  const candles = await fetchExchangePublicRecentCandles({
    exchange: input.exchange,
    marketType: input.marketType,
    symbol: input.symbol,
    interval: input.normalizedTimeframe,
    limit: input.chunkLimit,
    since: input.startTime,
  });
  return candles
    .filter((candle) => candle.openTime >= input.startTime && candle.openTime <= input.endTime)
    .map((candle) => ({
      openTime: candle.openTime,
      closeTime: candle.closeTime,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    }));
};

export const fetchKlines = async (
  exchange: Exchange,
  symbol: string,
  timeframe: string,
  marketType: BacktestMarketType,
  maxCandles: number,
  endTimeMs?: number,
  startTimeMs?: number,
): Promise<BacktestKlineCandle[]> => {
  pruneGatewayCache();
  const key = cacheKeyForCandles(exchange, symbol, timeframe, marketType, maxCandles, endTimeMs, startTimeMs);
  const cached = candleCache.get(key);
  if (cached && Date.now() - cached.cachedAt <= CANDLE_CACHE_TTL_MS) {
    return cached.candles;
  }

  const normalizedTimeframe = normalizeTimeframe(timeframe);
  const endTime = Number.isFinite(endTimeMs) ? Math.floor(endTimeMs as number) : Date.now();
  const sourceWindowMs = computeSourceWindowMs(timeframe, maxCandles);
  const startTimeByRange = Number.isFinite(startTimeMs)
    ? Math.floor(startTimeMs as number)
    : endTime - sourceWindowMs;
  if (startTimeByRange >= endTime) {
    candleCache.set(key, { cachedAt: Date.now(), candles: [] });
    return [];
  }
  const dbDelegate = useDbCandleCache ? getDbCandleDelegate() : undefined;
  if (dbDelegate) {
    try {
      const dbCandlesRaw = await dbDelegate.findMany({
        where: {
          marketType,
          source: exchange,
          symbol,
          timeframe: normalizedTimeframe,
          openTime: {
            gte: BigInt(startTimeByRange),
            lte: BigInt(endTime),
          },
        },
        orderBy: { openTime: 'desc' },
        take: maxCandles,
      });
      if (dbCandlesRaw.length >= maxCandles) {
        const dbCandles = dbCandlesRaw
          .map(toKlineFromDb)
          .sort((a, b) => a.openTime - b.openTime)
          .slice(-maxCandles);
        if (hasContinuousCandleIntervals(dbCandles, normalizedTimeframe)) {
          candleCache.set(key, { cachedAt: Date.now(), candles: dbCandles });
          return dbCandles;
        }
      }
    } catch {
      // Database candle cache is an optimization only; network fetch remains source of truth.
    }
  }

  const intervalMs = getTimeframeIntervalMs(timeframe);
  const candles: BacktestKlineCandle[] = [];
  let nextStartTime = startTimeByRange;
  let remaining = clamp(maxCandles, 1, 10_000);
  let guard = 0;
  const maxIterations = Math.ceil(remaining / 1000) + 2;

  while (remaining > 0 && guard < maxIterations) {
    guard += 1;
    const chunkLimit = Math.min(1000, remaining);
    const parsed = await fetchKlineChunk({
      exchange,
      symbol,
      normalizedTimeframe,
      chunkLimit,
      startTime: nextStartTime,
      endTime,
      marketType,
    });

    if (parsed.length === 0) break;

    candles.push(...parsed);
    remaining -= parsed.length;
    const last = parsed[parsed.length - 1];
    nextStartTime = last.openTime + intervalMs;
    if (nextStartTime >= endTime) break;
  }

  const result = candles.sort((a, b) => a.openTime - b.openTime).slice(-maxCandles);

  if (dbDelegate && result.length > 0) {
    try {
      await dbDelegate.createMany({
        data: result.map((item) => ({
          marketType,
          symbol,
          timeframe: normalizedTimeframe,
          openTime: BigInt(item.openTime),
          closeTime: BigInt(item.closeTime),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
          source: exchange,
        })),
        skipDuplicates: true,
      });
    } catch {
      // Ignore cache write errors; candle fetch already succeeded.
    }
  }

  candleCache.set(key, { cachedAt: Date.now(), candles: result });
  return result;
};

export const fetchSupplementalSeries = async (
  exchange: Exchange,
  symbol: string,
  timeframe: string,
  marketType: BacktestMarketType,
  maxCandles: number,
  endTimeMs?: number,
  startTimeMs?: number,
): Promise<BacktestSupplementalSeries> => {
  if (marketType !== 'FUTURES') {
    return { fundingRates: [], openInterest: [], orderBook: [] };
  }

  pruneGatewayCache();
  const key = cacheKeyForSupplemental(exchange, symbol, timeframe, marketType, maxCandles, endTimeMs, startTimeMs);
  const cached = supplementalCache.get(key);
  if (cached && Date.now() - cached.cachedAt <= CANDLE_CACHE_TTL_MS) {
    return cached.data;
  }

  const endTime = Number.isFinite(endTimeMs) ? Math.floor(endTimeMs as number) : Date.now();
  const sourceWindowMs = computeSourceWindowMs(timeframe, maxCandles);
  const startTime = Number.isFinite(startTimeMs)
    ? Math.floor(startTimeMs as number)
    : endTime - sourceWindowMs;
  if (startTime >= endTime) {
    const empty = { fundingRates: [], openInterest: [], orderBook: [] };
    supplementalCache.set(key, { cachedAt: Date.now(), data: empty });
    return empty;
  }
  const limit = clamp(maxCandles, 50, 1000);

  if (exchange !== 'BINANCE') {
    try {
      const [fundingRates, openInterest] = await Promise.all([
        fetchExchangePublicFundingRateHistory({
          exchange,
          marketType,
          symbol,
          since: startTime,
          endTime,
          limit,
        }),
        fetchExchangePublicOpenInterestHistory({
          exchange,
          marketType,
          symbol,
          interval: openInterestPeriodForTimeframe(timeframe),
          since: startTime,
          endTime,
          limit,
        }),
      ]);
      const result: BacktestSupplementalSeries = {
        fundingRates: fundingRates.map((point) => ({
          timestamp: point.timestamp,
          fundingRate: point.fundingRate,
        })),
        openInterest: openInterest.map((point) => ({
          timestamp: point.timestamp,
          openInterest: point.openInterest,
        })),
        orderBook: [],
      };
      supplementalCache.set(key, { cachedAt: Date.now(), data: result });
      return result;
    } catch {
      const empty = { fundingRates: [], openInterest: [], orderBook: [] };
      supplementalCache.set(key, { cachedAt: Date.now(), data: empty });
      return empty;
    }
  }

  const fundingQuery = new URLSearchParams({
    symbol,
    startTime: String(startTime),
    endTime: String(endTime),
    limit: String(limit),
  });
  const oiQuery = new URLSearchParams({
    symbol,
    period: openInterestPeriodForTimeframe(timeframe),
    startTime: String(startTime),
    endTime: String(endTime),
    limit: String(limit),
  });

  let fundingResponse: unknown = null;
  let openInterestResponse: unknown = null;
  try {
    [fundingResponse, openInterestResponse] = await Promise.all([
      fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/fapi/v1/fundingRate',
        searchParams: fundingQuery,
      }),
      fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/futures/data/openInterestHist',
        searchParams: oiQuery,
      }),
    ]);
  } catch {
    const empty = { fundingRates: [], openInterest: [], orderBook: [] };
    supplementalCache.set(key, { cachedAt: Date.now(), data: empty });
    return empty;
  }

  const fundingRates: BacktestFundingRatePoint[] = Array.isArray(fundingResponse)
    ? fundingResponse
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as { fundingTime?: unknown; fundingRate?: unknown };
          const timestamp = safeFloat(row.fundingTime);
          const fundingRate = safeFloat(row.fundingRate);
          if (timestamp <= 0 || !Number.isFinite(fundingRate)) return null;
          return { timestamp, fundingRate } satisfies BacktestFundingRatePoint;
        })
        .filter((item): item is BacktestFundingRatePoint => Boolean(item))
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  const openInterest: BacktestOpenInterestPoint[] = Array.isArray(openInterestResponse)
    ? openInterestResponse
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as { timestamp?: unknown; sumOpenInterest?: unknown };
          const timestamp = safeFloat(row.timestamp);
          const oi = safeFloat(row.sumOpenInterest);
          if (timestamp <= 0 || !Number.isFinite(oi)) return null;
          return { timestamp, openInterest: oi } satisfies BacktestOpenInterestPoint;
        })
        .filter((item): item is BacktestOpenInterestPoint => Boolean(item))
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  const result: BacktestSupplementalSeries = {
    fundingRates,
    openInterest,
    orderBook: [],
  };
  supplementalCache.set(key, { cachedAt: Date.now(), data: result });
  return result;
};
