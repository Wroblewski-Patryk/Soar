import { Exchange } from '@prisma/client';

import { normalizeSymbols } from '../../lib/symbols';
import { fetchBinancePublicRestJson } from '../exchange/binancePublicRest.service';
import {
  fetchExchangePublicRecentCandles,
  fetchExchangePublicTickerSnapshot,
} from '../exchange/exchangePublicMarketData.service';

const normalizeKlineInterval = (value?: string | null) => {
  if (!value) return '1m';
  const normalized = value.trim().toLowerCase();
  const aliases: Record<string, string> = {
    '1 min': '1m',
    '3 min': '3m',
    '5 min': '5m',
    '10 min': '10m',
    '15 min': '15m',
    '30 min': '30m',
    '60 min': '1h',
  };
  return aliases[normalized] ?? normalized;
};

const klineFallbackCache = new Map<
  string,
  {
    fetchedAt: number;
    candles: Array<{
      openTime: number;
      closeTime: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>;
  }
>();
const fundingHistoryFallbackCache = new Map<
  string,
  { fetchedAt: number; points: Array<{ timestamp: number; fundingRate: number }> }
>();
const fundingSnapshotFallbackCache = new Map<
  string,
  { fetchedAt: number; point: { timestamp: number; fundingRate: number } | null }
>();
const openInterestHistoryFallbackCache = new Map<
  string,
  { fetchedAt: number; points: Array<{ timestamp: number; openInterest: number }> }
>();
const openInterestSnapshotFallbackCache = new Map<
  string,
  { fetchedAt: number; point: { timestamp: number; openInterest: number } | null }
>();
const orderBookSnapshotFallbackCache = new Map<
  string,
  {
    fetchedAt: number;
    point:
      | {
          timestamp: number;
          imbalance: number;
          spreadBps: number;
          depthRatio: number;
        }
      | null;
  }
>();
const KLINE_FALLBACK_TTL_MS = 10_000;
const TICKER_PRICE_FALLBACK_TTL_MS = 5_000;
const DERIVATIVES_HISTORY_TTL_MS = 60_000;
const DERIVATIVES_SNAPSHOT_TTL_MS = 15_000;
const tickerPriceFallbackCache = new Map<string, { fetchedAt: number; prices: Map<string, number> }>();

export const fetchFallbackKlines = async (params: {
  exchange?: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
  interval: string;
  limit?: number;
}) => {
  if (process.env.NODE_ENV === 'test') return [];
  const exchange = params.exchange ?? 'BINANCE';
  const normalizedInterval = normalizeKlineInterval(params.interval);
  const limit = Math.min(1000, Math.max(20, params.limit ?? 300));
  const cacheKey = `${exchange}|${params.marketType}|${params.symbol.toUpperCase()}|${normalizedInterval}|${limit}`;
  const now = Date.now();
  const cached = klineFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < KLINE_FALLBACK_TTL_MS) {
    return cached.candles;
  }

  const searchParams = new URLSearchParams({
    symbol: params.symbol.toUpperCase(),
    interval: normalizedInterval,
    limit: String(limit),
  });

  try {
    const payload =
      exchange === 'BINANCE'
        ? await fetchBinancePublicRestJson({
            marketType: params.marketType,
            path: params.marketType === 'SPOT' ? '/api/v3/klines' : '/fapi/v1/klines',
            searchParams,
          })
        : await fetchExchangePublicRecentCandles({
            exchange,
            marketType: params.marketType,
            symbol: params.symbol.toUpperCase(),
            interval: normalizedInterval,
            limit,
          });
    const rows = Array.isArray(payload) ? payload : [];
    const currentTime = Date.now();
    const candles = rows
      .map((row) => {
        if (row && typeof row === 'object' && !Array.isArray(row)) {
          const candle = row as {
            openTime?: unknown;
            closeTime?: unknown;
            open?: unknown;
            high?: unknown;
            low?: unknown;
            close?: unknown;
            volume?: unknown;
          };
          const openTime = Number(candle.openTime);
          const closeTime = Number(candle.closeTime);
          const open = Number(candle.open);
          const high = Number(candle.high);
          const low = Number(candle.low);
          const close = Number(candle.close);
          const volume = Number(candle.volume);
          if (
            !Number.isFinite(openTime) ||
            !Number.isFinite(closeTime) ||
            !Number.isFinite(open) ||
            !Number.isFinite(high) ||
            !Number.isFinite(low) ||
            !Number.isFinite(close) ||
            !Number.isFinite(volume)
          ) {
            return null;
          }
          if (closeTime > currentTime) return null;
          return { openTime, closeTime, open, high, low, close, volume };
        }
        if (!Array.isArray(row)) return null;
        const openTime = Number(row[0]);
        const open = Number(row[1]);
        const high = Number(row[2]);
        const low = Number(row[3]);
        const close = Number(row[4]);
        const volume = Number(row[5]);
        const closeTime = Number(row[6]);
        if (
          !Number.isFinite(openTime) ||
          !Number.isFinite(closeTime) ||
          !Number.isFinite(open) ||
          !Number.isFinite(high) ||
          !Number.isFinite(low) ||
          !Number.isFinite(close) ||
          !Number.isFinite(volume)
        ) {
          return null;
        }
        if (closeTime > currentTime) return null;
        return {
          openTime,
          closeTime,
          open,
          high,
          low,
          close,
          volume,
        };
      })
      .filter(
        (
          value,
        ): value is {
          openTime: number;
          closeTime: number;
          open: number;
          high: number;
          low: number;
          close: number;
          volume: number;
        } => value != null,
      );
    if (candles.length > 0) {
      klineFallbackCache.set(cacheKey, { fetchedAt: now, candles });
    }
    return candles;
  } catch {
    return [];
  }
};

export const fetchFallbackFundingRateHistory = async (params: {
  exchange?: Exchange;
  symbol: string;
  limit?: number;
  endTimeMs?: number;
}) => {
  if (process.env.NODE_ENV === 'test') return [];
  if ((params.exchange ?? 'BINANCE') !== 'BINANCE') return [];
  const limit = Math.min(1000, Math.max(20, params.limit ?? 200));
  const cacheKey = `${params.symbol.toUpperCase()}|${limit}|${Math.floor(params.endTimeMs ?? 0)}`;
  const now = Date.now();
  const cached = fundingHistoryFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < DERIVATIVES_HISTORY_TTL_MS) {
    return cached.points;
  }

  const searchParams = new URLSearchParams({
    symbol: params.symbol.toUpperCase(),
    limit: String(limit),
  });
  if (Number.isFinite(params.endTimeMs)) {
    searchParams.set('endTime', String(Math.floor(params.endTimeMs as number)));
  }

  try {
    const payload = await fetchBinancePublicRestJson({
      marketType: 'FUTURES',
      path: '/fapi/v1/fundingRate',
      searchParams,
    });
    if (!Array.isArray(payload)) return [];
    const points = payload
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const row = item as { fundingTime?: unknown; fundingRate?: unknown };
        const timestamp = Number(row.fundingTime);
        const fundingRate = Number(row.fundingRate);
        if (!Number.isFinite(timestamp) || !Number.isFinite(fundingRate)) return null;
        return { timestamp, fundingRate };
      })
      .filter((item): item is { timestamp: number; fundingRate: number } => item != null)
      .sort((left, right) => left.timestamp - right.timestamp);
    fundingHistoryFallbackCache.set(cacheKey, { fetchedAt: now, points });
    return points;
  } catch {
    return [];
  }
};

export const fetchFallbackFundingRateSnapshot = async (symbol: string, exchange: Exchange = 'BINANCE') => {
  if (process.env.NODE_ENV === 'test') return null;
  if (exchange !== 'BINANCE') return null;
  const cacheKey = symbol.toUpperCase();
  const now = Date.now();
  const cached = fundingSnapshotFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < DERIVATIVES_SNAPSHOT_TTL_MS) {
    return cached.point;
  }

  try {
    const payload = await fetchBinancePublicRestJson({
      marketType: 'FUTURES',
      path: '/fapi/v1/premiumIndex',
      searchParams: new URLSearchParams({ symbol: symbol.toUpperCase() }),
    });
    if (!payload || typeof payload !== 'object') return null;
    const row = payload as { time?: unknown; lastFundingRate?: unknown };
    const timestamp = Number(row.time);
    const fundingRate = Number(row.lastFundingRate);
    const point =
      Number.isFinite(timestamp) && Number.isFinite(fundingRate)
        ? { timestamp, fundingRate }
        : null;
    fundingSnapshotFallbackCache.set(cacheKey, { fetchedAt: now, point });
    return point;
  } catch {
    return null;
  }
};

const normalizeOpenInterestPeriod = (value?: string | null) => {
  const normalized = normalizeKlineInterval(value);
  const supported = new Set(['5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d']);
  return supported.has(normalized) ? normalized : '5m';
};

export const fetchFallbackOpenInterestHistory = async (params: {
  exchange?: Exchange;
  symbol: string;
  interval: string;
  limit?: number;
  endTimeMs?: number;
}) => {
  if (process.env.NODE_ENV === 'test') return [];
  if ((params.exchange ?? 'BINANCE') !== 'BINANCE') return [];
  const limit = Math.min(500, Math.max(20, params.limit ?? 200));
  const period = normalizeOpenInterestPeriod(params.interval);
  const cacheKey = `${params.symbol.toUpperCase()}|${period}|${limit}|${Math.floor(params.endTimeMs ?? 0)}`;
  const now = Date.now();
  const cached = openInterestHistoryFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < DERIVATIVES_HISTORY_TTL_MS) {
    return cached.points;
  }

  const searchParams = new URLSearchParams({
    symbol: params.symbol.toUpperCase(),
    period,
    limit: String(limit),
  });
  if (Number.isFinite(params.endTimeMs)) {
    searchParams.set('endTime', String(Math.floor(params.endTimeMs as number)));
  }

  try {
    const payload = await fetchBinancePublicRestJson({
      marketType: 'FUTURES',
      path: '/futures/data/openInterestHist',
      searchParams,
    });
    if (!Array.isArray(payload)) return [];
    const points = payload
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const row = item as { timestamp?: unknown; sumOpenInterest?: unknown };
        const timestamp = Number(row.timestamp);
        const openInterest = Number(row.sumOpenInterest);
        if (!Number.isFinite(timestamp) || !Number.isFinite(openInterest)) return null;
        return { timestamp, openInterest };
      })
      .filter((item): item is { timestamp: number; openInterest: number } => item != null)
      .sort((left, right) => left.timestamp - right.timestamp);
    openInterestHistoryFallbackCache.set(cacheKey, { fetchedAt: now, points });
    return points;
  } catch {
    return [];
  }
};

export const fetchFallbackOpenInterestSnapshot = async (symbol: string, exchange: Exchange = 'BINANCE') => {
  if (process.env.NODE_ENV === 'test') return null;
  if (exchange !== 'BINANCE') return null;
  const cacheKey = symbol.toUpperCase();
  const now = Date.now();
  const cached = openInterestSnapshotFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < DERIVATIVES_SNAPSHOT_TTL_MS) {
    return cached.point;
  }

  try {
    const payload = await fetchBinancePublicRestJson({
      marketType: 'FUTURES',
      path: '/fapi/v1/openInterest',
      searchParams: new URLSearchParams({ symbol: symbol.toUpperCase() }),
    });
    if (!payload || typeof payload !== 'object') return null;
    const row = payload as { time?: unknown; openInterest?: unknown };
    const timestamp = Number(row.time);
    const openInterest = Number(row.openInterest);
    const point =
      Number.isFinite(timestamp) && Number.isFinite(openInterest)
        ? { timestamp, openInterest }
        : null;
    openInterestSnapshotFallbackCache.set(cacheKey, { fetchedAt: now, point });
    return point;
  } catch {
    return null;
  }
};

export const fetchFallbackOrderBookSnapshot = async (symbol: string, exchange: Exchange = 'BINANCE') => {
  if (process.env.NODE_ENV === 'test') return null;
  if (exchange !== 'BINANCE') return null;
  const cacheKey = symbol.toUpperCase();
  const now = Date.now();
  const cached = orderBookSnapshotFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < DERIVATIVES_SNAPSHOT_TTL_MS) {
    return cached.point;
  }

  try {
    const payload = await fetchBinancePublicRestJson({
      marketType: 'FUTURES',
      path: '/fapi/v1/depth',
      searchParams: new URLSearchParams({ symbol: symbol.toUpperCase(), limit: '100' }),
    });
    if (!payload || typeof payload !== 'object') return null;
    const row = payload as {
      bids?: unknown;
      asks?: unknown;
      E?: unknown;
      T?: unknown;
    };
    const bids = Array.isArray(row.bids) ? row.bids : [];
    const asks = Array.isArray(row.asks) ? row.asks : [];
    if (bids.length === 0 || asks.length === 0) return null;
    const parseLevel = (value: unknown) => {
      if (!Array.isArray(value) || value.length < 2) return null;
      const price = Number(value[0]);
      const amount = Number(value[1]);
      if (!Number.isFinite(price) || !Number.isFinite(amount) || price <= 0 || amount < 0) {
        return null;
      }
      return { price, amount };
    };
    const parsedBids = bids
      .map(parseLevel)
      .filter((entry): entry is { price: number; amount: number } => entry != null);
    const parsedAsks = asks
      .map(parseLevel)
      .filter((entry): entry is { price: number; amount: number } => entry != null);
    if (parsedBids.length === 0 || parsedAsks.length === 0) return null;

    const bidDepth = parsedBids.reduce((sum, level) => sum + level.amount, 0);
    const askDepth = parsedAsks.reduce((sum, level) => sum + level.amount, 0);
    const bestBid = parsedBids[0].price;
    const bestAsk = parsedAsks[0].price;
    const mid = (bestBid + bestAsk) / 2;
    const point =
      mid > 0 && bidDepth + askDepth > 0 && askDepth > 0
        ? {
            timestamp: Number.isFinite(Number(row.E ?? row.T))
              ? Number(row.E ?? row.T)
              : Date.now(),
            imbalance: (bidDepth - askDepth) / (bidDepth + askDepth),
            spreadBps: ((bestAsk - bestBid) / mid) * 10_000,
            depthRatio: bidDepth / askDepth,
          }
        : null;
    orderBookSnapshotFallbackCache.set(cacheKey, { fetchedAt: now, point });
    return point;
  } catch {
    return null;
  }
};

export const fetchFallbackTickerPrices = async (params: {
  exchange?: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbols: string[];
}) => {
  if (process.env.NODE_ENV === 'test') return new Map<string, number>();
  const exchange = params.exchange ?? 'BINANCE';
  const normalizedSymbols = normalizeSymbols(params.symbols);
  if (normalizedSymbols.length === 0) return new Map<string, number>();

  const cacheKey = `${exchange}|${params.marketType}`;
  const now = Date.now();
  const cached = tickerPriceFallbackCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < TICKER_PRICE_FALLBACK_TTL_MS) {
    const fromCache = normalizedSymbols
      .map((symbol) => [symbol, cached.prices.get(symbol)] as const)
      .filter((entry): entry is [string, number] => Number.isFinite(entry[1]));
    return new Map(fromCache);
  }

  try {
    if (exchange !== 'BINANCE') {
      const entries = await Promise.all(
        normalizedSymbols.map(async (symbol) => {
          try {
            const snapshot = await fetchExchangePublicTickerSnapshot({
              exchange,
              marketType: params.marketType,
              symbol,
            });
            const price = snapshot.markPrice ?? snapshot.lastPrice;
            return Number.isFinite(price) && price > 0 ? ([symbol, price] as const) : null;
          } catch {
            return null;
          }
        })
      );
      return new Map(entries.filter((entry): entry is readonly [string, number] => entry != null));
    }

    const payload = await fetchBinancePublicRestJson({
      marketType: params.marketType,
      path: params.marketType === 'SPOT' ? '/api/v3/ticker/price' : '/fapi/v1/ticker/price',
    });
    const allPrices = new Map<string, number>();
    const rows = Array.isArray(payload) ? payload : [payload];
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const parsedRow = row as { symbol?: unknown; price?: unknown };
      if (typeof parsedRow.symbol !== 'string') continue;
      const symbol = parsedRow.symbol.trim().toUpperCase();
      if (!symbol) continue;
      const priceRaw =
        typeof parsedRow.price === 'number'
          ? parsedRow.price
          : typeof parsedRow.price === 'string'
            ? Number.parseFloat(parsedRow.price)
            : Number.NaN;
      if (!Number.isFinite(priceRaw) || priceRaw <= 0) continue;
      allPrices.set(symbol, priceRaw);
    }

    if (allPrices.size > 0) {
      tickerPriceFallbackCache.set(cacheKey, {
        fetchedAt: now,
        prices: allPrices,
      });
    }

    const selected = normalizedSymbols
      .map((symbol) => [symbol, allPrices.get(symbol)] as const)
      .filter((entry): entry is [string, number] => Number.isFinite(entry[1]));
    return new Map(selected);
  } catch {
    return new Map<string, number>();
  }
};
