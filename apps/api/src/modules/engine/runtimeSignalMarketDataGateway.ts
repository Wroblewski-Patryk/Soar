
import { Exchange } from '@prisma/client';
import { StreamCandleEvent } from '../market-stream/binanceStream.types';
import {
  alignTimedNumericPointsToCandles,
  normalizeTimedNumericPoints,
} from './sharedDerivativesSeries';
import {
  FundingRatePoint,
  OpenInterestPoint,
  OrderBookPoint,
} from './runtimeSignalSeriesTypes';
import { normalizeInterval } from './runtimeSignalLoopDefaults';
import { normalizeSymbol } from '../../lib/symbols';
import { fetchBinancePublicRestJson } from '../exchange/binancePublicRest.service';
import { fetchExchangePublicRecentCandles } from '../exchange/exchangePublicMarketData.service';

export type RuntimeCandle = {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type RuntimeOrderBookSeries = {
  orderBookImbalance: Array<number | null>;
  orderBookSpreadBps: Array<number | null>;
  orderBookDepthRatio: Array<number | null>;
};

export type RuntimeSignalWarmupLockInput = {
  seriesKey: string;
  ttlMs: number;
};

export type RuntimeSignalWarmupLockHandle = {
  acquired: boolean;
  release: () => Promise<void>;
};

type RuntimeSignalMarketDataGatewayDeps = {
  nowMs: () => number;
  warmupEnabled?: boolean | (() => boolean | undefined);
  fetchRecentCandles?: typeof fetchExchangePublicRecentCandles;
  acquireWarmupLock?: (
    input: RuntimeSignalWarmupLockInput
  ) => Promise<RuntimeSignalWarmupLockHandle>;
};

const maxCandlesPerSeries = Number.parseInt(process.env.RUNTIME_SIGNAL_CANDLE_BUFFER ?? '500', 10);
const runtimeSignalWarmupEnabled = process.env.RUNTIME_SIGNAL_WARMUP_ENABLED !== 'false';
const runtimeSignalWarmupCandles = Math.max(
  20,
  Number.parseInt(process.env.RUNTIME_SIGNAL_WARMUP_CANDLES ?? '150', 10),
);
const runtimeSignalWarmupRetryMs = Math.max(
  60_000,
  Number.parseInt(process.env.RUNTIME_SIGNAL_WARMUP_RETRY_MS ?? '300000', 10),
);
const runtimeSignalWarmupLockTtlMs = Math.max(
  5_000,
  Number.parseInt(process.env.RUNTIME_SIGNAL_WARMUP_LOCK_TTL_MS ?? '45000', 10),
);
const runtimeSignalDecisionRecoveryEnabled =
  process.env.RUNTIME_SIGNAL_DECISION_RECOVERY_ENABLED !== 'false';
const runtimeSignalDecisionRecoveryCandles = Math.max(
  20,
  Number.parseInt(
    process.env.RUNTIME_SIGNAL_DECISION_RECOVERY_CANDLES ??
      process.env.RUNTIME_SIGNAL_WARMUP_CANDLES ??
      '150',
    10,
  ),
);
const runtimeSignalDecisionRecoveryRetryMs = Math.max(
  10_000,
  Number.parseInt(
    process.env.RUNTIME_SIGNAL_DECISION_RECOVERY_RETRY_MS ??
      process.env.RUNTIME_SIGNAL_WARMUP_RETRY_MS ??
      '60000',
    10,
  ),
);
const runtimeFundingRefreshMs = Math.max(
  30_000,
  Number.parseInt(process.env.RUNTIME_FUNDING_REFRESH_MS ?? '180000', 10),
);
const runtimeFundingHistoryLimit = Math.max(
  20,
  Number.parseInt(process.env.RUNTIME_FUNDING_HISTORY_LIMIT ?? '200', 10),
);
const runtimeOpenInterestRefreshMs = Math.max(
  30_000,
  Number.parseInt(process.env.RUNTIME_OPEN_INTEREST_REFRESH_MS ?? '180000', 10),
);
const runtimeOpenInterestHistoryLimit = Math.max(
  20,
  Number.parseInt(process.env.RUNTIME_OPEN_INTEREST_HISTORY_LIMIT ?? '200', 10),
);
const runtimeOrderBookRefreshMs = Math.max(
  10_000,
  Number.parseInt(process.env.RUNTIME_ORDER_BOOK_REFRESH_MS ?? '60000', 10),
);
const runtimeCandleSeriesStore = new Map<string, RuntimeCandle[]>();

const buildRuntimeSignalSeriesKey = (
  exchange: Exchange,
  marketType: 'FUTURES' | 'SPOT',
  symbol: string,
  interval: string,
) => `${exchange}|${marketType}|${normalizeSymbol(symbol)}|${normalizeInterval(interval)}`;

const getRuntimeSignalSeries = (
  exchange: Exchange,
  marketType: 'FUTURES' | 'SPOT',
  symbol: string,
  interval?: string | null,
) => {
  const normalizedInterval = normalizeInterval(interval);
  const key = buildRuntimeSignalSeriesKey(exchange, marketType, symbol, normalizedInterval);
  const exact = runtimeCandleSeriesStore.get(key);
  if (exact && exact.length > 0) return exact;

  const prefix = `${exchange}|${marketType}|${normalizeSymbol(symbol)}|`;
  const fallbackKey = [...runtimeCandleSeriesStore.keys()].find((entry) => entry.startsWith(prefix));
  if (!fallbackKey) return null;
  const fallbackSeries = runtimeCandleSeriesStore.get(fallbackKey);
  return fallbackSeries && fallbackSeries.length > 0 ? fallbackSeries : null;
};

export const getRecentRuntimeCloses = (input: {
  exchange?: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
  interval?: string | null;
  limit?: number;
}) => {
  const series = getRuntimeSignalSeries(
    input.exchange ?? 'BINANCE',
    input.marketType,
    input.symbol,
    input.interval,
  );
  if (!series || series.length === 0) return [];
  const closes = series
    .map((candle) => candle.close)
    .filter((value): value is number => Number.isFinite(value));
  if (closes.length === 0) return [];
  const limit = Number.isFinite(input.limit)
    ? Math.max(1, Math.floor(input.limit as number))
    : closes.length;
  return closes.slice(-limit);
};

export const clearRuntimeSignalMarketDataStore = () => {
  runtimeCandleSeriesStore.clear();
};

export const mergeRuntimeSignalCandles = (
  runtimeCandles: RuntimeCandle[],
  fallbackCandles: RuntimeCandle[],
  limit = maxCandlesPerSeries,
) => {
  const deduped = new Map<number, RuntimeCandle>();
  for (const candle of fallbackCandles) deduped.set(candle.openTime, candle);
  for (const candle of runtimeCandles) deduped.set(candle.openTime, candle);
  const merged = [...deduped.values()]
    .filter(
      (item): item is RuntimeCandle =>
        Number.isFinite(item.openTime) &&
        Number.isFinite(item.closeTime) &&
        Number.isFinite(item.open) &&
        Number.isFinite(item.high) &&
        Number.isFinite(item.low) &&
        Number.isFinite(item.close) &&
        Number.isFinite(item.volume),
    )
    .sort((left, right) => left.openTime - right.openTime);
  return merged.slice(-Math.max(1, Math.floor(limit)));
};

export class RuntimeSignalMarketDataGateway {
  private readonly candleSeries = runtimeCandleSeriesStore;
  private readonly warmupLastAttemptAt = new Map<string, number>();
  private readonly decisionRecoveryLastAttemptAt = new Map<string, number>();
  private readonly fundingRatePoints = new Map<string, FundingRatePoint[]>();
  private readonly fundingLastFetchAt = new Map<string, number>();
  private readonly openInterestPoints = new Map<string, OpenInterestPoint[]>();
  private readonly openInterestLastFetchAt = new Map<string, number>();
  private readonly orderBookPoints = new Map<string, OrderBookPoint[]>();
  private readonly orderBookLastFetchAt = new Map<string, number>();

  constructor(private readonly deps: RuntimeSignalMarketDataGatewayDeps) {}

  getCandleSeriesStore() {
    return this.candleSeries;
  }

  getFundingRatePointsStore() {
    return this.fundingRatePoints;
  }

  getOpenInterestPointsStore() {
    return this.openInterestPoints;
  }

  getOrderBookPointsStore() {
    return this.orderBookPoints;
  }

  async ingestCandleEvent(event: StreamCandleEvent) {
    const key = this.getSeriesKey(event.exchange, event.marketType, event.symbol, event.interval);
    const series = [...(this.candleSeries.get(key) ?? [])];
    const nextCandle: RuntimeCandle = {
      openTime: event.openTime,
      closeTime: event.closeTime,
      open: event.open,
      high: event.high,
      low: event.low,
      close: event.close,
      volume: event.volume,
    };
    const previousIndex = series.findIndex((candle) => candle.openTime === event.openTime);
    if (previousIndex >= 0) {
      series[previousIndex] = nextCandle;
    } else {
      series.push(nextCandle);
    }
    series.sort((a, b) => a.openTime - b.openTime);
    if (series.length > maxCandlesPerSeries) {
      series.splice(0, series.length - maxCandlesPerSeries);
    }
    this.candleSeries.set(key, series);

    await this.ensureSeriesWarmup(
      event.exchange,
      event.marketType,
      event.symbol,
      event.interval,
      event.closeTime,
    );
    await this.ensureFundingRateSeriesForCandle(event);
    await this.ensureOpenInterestSeriesForCandle(event);
    await this.ensureOrderBookSeriesForCandle(event);
  }

  getSeries(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    interval?: string | null,
  ) {
    return getRuntimeSignalSeries(exchange, marketType, symbol, interval);
  }

  getRecentCloses(input: {
    exchange?: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    interval?: string | null;
    limit?: number;
  }) {
    const series = this.getSeries(
      input.exchange ?? 'BINANCE',
      input.marketType,
      input.symbol,
      input.interval,
    );
    if (!series || series.length === 0) return [];
    const closes = series
      .map((candle) => candle.close)
      .filter((value): value is number => Number.isFinite(value));
    if (closes.length === 0) return [];
    const limit = Number.isFinite(input.limit)
      ? Math.max(1, Math.floor(input.limit as number))
      : closes.length;
    return closes.slice(-limit);
  }

  async ensureIndicatorReadySeries(input: {
    exchange?: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    interval?: string | null;
    endTimeMs?: number;
    minCandles?: number;
  }) {
    const exchange = input.exchange ?? 'BINANCE';
    const normalizedInterval = normalizeInterval(input.interval);
    const key = this.getSeriesKey(exchange, input.marketType, input.symbol, normalizedInterval);
    const currentSeries = this.candleSeries.get(key) ?? [];
    const minCandles = Math.max(
      20,
      Math.floor(input.minCandles ?? runtimeSignalDecisionRecoveryCandles),
    );
    if (currentSeries.length >= minCandles) return currentSeries;
    if (!runtimeSignalDecisionRecoveryEnabled) return currentSeries;

    const now = this.deps.nowMs();
    const lastAttemptAt = this.decisionRecoveryLastAttemptAt.get(key);
    if (
      typeof lastAttemptAt === 'number' &&
      now - lastAttemptAt < runtimeSignalDecisionRecoveryRetryMs
    ) {
      return currentSeries;
    }
    this.decisionRecoveryLastAttemptAt.set(key, now);

    const fetched = await this.fetchWarmupCandles(
      exchange,
      input.marketType,
      input.symbol,
      normalizedInterval,
      minCandles,
      input.endTimeMs,
    );
    if (fetched.length === 0) return currentSeries;

    const merged = mergeRuntimeSignalCandles(currentSeries, fetched, maxCandlesPerSeries);
    this.candleSeries.set(key, merged);
    return merged;
  }

  resolveFundingRateSeriesForCandles(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    candles: RuntimeCandle[],
  ): Array<number | null> | null {
    if (marketType !== 'FUTURES') return null;
    const key = this.getFundingKey(exchange, marketType, symbol);
    const points = this.fundingRatePoints.get(key) ?? [];
    if (points.length === 0) return null;
    return alignTimedNumericPointsToCandles(
      candles,
      points.map((point) => ({
        timestamp: point.timestamp,
        value: point.fundingRate,
      })),
    );
  }

  resolveOpenInterestSeriesForCandles(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    candles: RuntimeCandle[],
  ): Array<number | null> | null {
    if (marketType !== 'FUTURES') return null;
    const key = this.getFundingKey(exchange, marketType, symbol);
    const points = this.openInterestPoints.get(key) ?? [];
    if (points.length === 0) return null;
    return alignTimedNumericPointsToCandles(
      candles,
      points.map((point) => ({
        timestamp: point.timestamp,
        value: point.openInterest,
      })),
    );
  }

  resolveOrderBookSeriesForCandles(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    candles: RuntimeCandle[],
  ): RuntimeOrderBookSeries | null {
    if (marketType !== 'FUTURES') return null;
    const key = this.getFundingKey(exchange, marketType, symbol);
    const points = this.orderBookPoints.get(key) ?? [];
    if (points.length === 0) return null;
    return {
      orderBookImbalance: alignTimedNumericPointsToCandles(
        candles,
        points.map((point) => ({
          timestamp: point.timestamp,
          value: point.imbalance,
        })),
      ),
      orderBookSpreadBps: alignTimedNumericPointsToCandles(
        candles,
        points.map((point) => ({
          timestamp: point.timestamp,
          value: point.spreadBps,
        })),
      ),
      orderBookDepthRatio: alignTimedNumericPointsToCandles(
        candles,
        points.map((point) => ({
          timestamp: point.timestamp,
          value: point.depthRatio,
        })),
      ),
    };
  }

  private async fetchWarmupCandles(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    interval: string,
    limit: number,
    endTimeMs?: number,
  ): Promise<RuntimeCandle[]> {
    if (process.env.NODE_ENV === 'test') return [];
    try {
      const fetchRecentCandles = this.deps.fetchRecentCandles ?? fetchExchangePublicRecentCandles;
      const payload = await fetchRecentCandles({
        exchange,
        marketType,
        symbol: normalizeSymbol(symbol),
        interval: normalizeInterval(interval),
        limit: Math.min(1000, Math.max(20, limit)),
        since: undefined,
      });
      if (!Array.isArray(payload)) return [];
      const now = Date.now();
      const closeTimeCutoff = Number.isFinite(endTimeMs) ? Math.floor(endTimeMs as number) : now;
      return payload
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as Partial<RuntimeCandle>;
          const openTime = Number(row.openTime);
          const open = Number(row.open);
          const high = Number(row.high);
          const low = Number(row.low);
          const close = Number(row.close);
          const volume = Number(row.volume);
          const closeTime = Number(row.closeTime);
          if (!Number.isFinite(openTime) || !Number.isFinite(closeTime)) return null;
          if (
            !Number.isFinite(open) ||
            !Number.isFinite(high) ||
            !Number.isFinite(low) ||
            !Number.isFinite(close) ||
            !Number.isFinite(volume)
          ) {
            return null;
          }
          if (Number.isFinite(closeTime) && closeTime > closeTimeCutoff) return null;
          return {
            openTime,
            closeTime,
            open,
            high,
            low,
            close,
            volume,
          } satisfies RuntimeCandle;
        })
        .filter((item): item is RuntimeCandle => Boolean(item))
        .sort((left, right) => left.openTime - right.openTime);
    } catch {
      return [];
    }
  }

  private async acquireRuntimeWarmupLock(seriesKey: string): Promise<RuntimeSignalWarmupLockHandle> {
    if (!this.deps.acquireWarmupLock) {
      return {
        acquired: true,
        release: async () => undefined,
      };
    }
    try {
      return await this.deps.acquireWarmupLock({
        seriesKey,
        ttlMs: runtimeSignalWarmupLockTtlMs,
      });
    } catch {
      return {
        acquired: true,
        release: async () => undefined,
      };
    }
  }

  private async ensureSeriesWarmup(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    interval: string,
    endTimeMs?: number,
  ) {
    const warmupEnabledOverride =
      typeof this.deps.warmupEnabled === 'function'
        ? this.deps.warmupEnabled()
        : this.deps.warmupEnabled;
    const warmupEnabled =
      typeof warmupEnabledOverride === 'boolean'
        ? warmupEnabledOverride
        : runtimeSignalWarmupEnabled;
    if (!warmupEnabled) return;
    const normalizedInterval = normalizeInterval(interval);
    const key = this.getSeriesKey(exchange, marketType, symbol, normalizedInterval);
    const currentSeries = this.candleSeries.get(key) ?? [];
    if (currentSeries.length >= runtimeSignalWarmupCandles) return;

    const now = this.deps.nowMs();
    const lastAttemptAt = this.warmupLastAttemptAt.get(key) ?? 0;
    if (now - lastAttemptAt < runtimeSignalWarmupRetryMs) return;
    const warmupLock = await this.acquireRuntimeWarmupLock(key);
    if (!warmupLock.acquired) return;
    this.warmupLastAttemptAt.set(key, now);
    try {
      const fetched = await this.fetchWarmupCandles(
        exchange,
        marketType,
        symbol,
        normalizedInterval,
        runtimeSignalWarmupCandles,
        endTimeMs,
      );
      if (fetched.length === 0) return;

      const merged = mergeRuntimeSignalCandles(currentSeries, fetched, maxCandlesPerSeries);
      this.candleSeries.set(key, merged);
    } finally {
      await warmupLock.release().catch(() => undefined);
    }
  }

  private getFundingKey(exchange: Exchange, marketType: 'FUTURES' | 'SPOT', symbol: string) {
    return `${exchange}|${marketType}|${normalizeSymbol(symbol)}`;
  }

  private mergeFundingRatePoints(key: string, incoming: FundingRatePoint[]) {
    if (incoming.length === 0) return;
    const existing = this.fundingRatePoints.get(key) ?? [];
    const normalized = normalizeTimedNumericPoints(
      [...existing, ...incoming].map((point) => ({
        timestamp: point.timestamp,
        value: point.fundingRate,
      })),
    ).map((point) => ({
      timestamp: point.timestamp,
      fundingRate: point.value,
    }));

    if (normalized.length > maxCandlesPerSeries) {
      normalized.splice(0, normalized.length - maxCandlesPerSeries);
    }
    this.fundingRatePoints.set(key, normalized);
  }

  private async fetchFundingRateHistory(
    exchange: Exchange,
    symbol: string,
    endTimeMs?: number,
  ): Promise<FundingRatePoint[]> {
    if (process.env.NODE_ENV === 'test') return [];
    if (exchange !== 'BINANCE') return [];
    const params = new URLSearchParams({
      symbol: normalizeSymbol(symbol),
      limit: String(Math.min(1000, Math.max(20, runtimeFundingHistoryLimit))),
    });
    if (Number.isFinite(endTimeMs)) {
      params.set('endTime', String(Math.floor(endTimeMs as number)));
    }

    try {
      const payload = await fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/fapi/v1/fundingRate',
        searchParams: params,
      });
      if (!Array.isArray(payload)) return [];
      return payload
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as { fundingTime?: unknown; fundingRate?: unknown };
          const timestamp = Number(row.fundingTime);
          const fundingRate = Number(row.fundingRate);
          if (!Number.isFinite(timestamp) || !Number.isFinite(fundingRate)) return null;
          return { timestamp, fundingRate } satisfies FundingRatePoint;
        })
        .filter((item): item is FundingRatePoint => Boolean(item))
        .sort((left, right) => left.timestamp - right.timestamp);
    } catch {
      return [];
    }
  }

  private async fetchFundingRateSnapshot(symbol: string): Promise<FundingRatePoint | null> {
    if (process.env.NODE_ENV === 'test') return null;
    const params = new URLSearchParams({ symbol: normalizeSymbol(symbol) });

    try {
      const payload = await fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/fapi/v1/premiumIndex',
        searchParams: params,
      });
      if (!payload || typeof payload !== 'object') return null;
      const row = payload as { time?: unknown; lastFundingRate?: unknown };
      const timestamp = Number(row.time);
      const fundingRate = Number(row.lastFundingRate);
      if (!Number.isFinite(timestamp) || !Number.isFinite(fundingRate)) return null;
      return { timestamp, fundingRate } satisfies FundingRatePoint;
    } catch {
      return null;
    }
  }

  private async ensureFundingRateSeriesForCandle(event: StreamCandleEvent) {
    if (event.marketType !== 'FUTURES') return;
    const key = this.getFundingKey(event.exchange, event.marketType, event.symbol);
    const now = this.deps.nowMs();
    const existing = this.fundingRatePoints.get(key) ?? [];
    const lastFetchAt = this.fundingLastFetchAt.get(key) ?? 0;
    const shouldRefresh = existing.length === 0 || now - lastFetchAt >= runtimeFundingRefreshMs;
    if (!shouldRefresh) return;

    const incoming: FundingRatePoint[] = [];
    if (existing.length === 0) {
      incoming.push(
        ...(await this.fetchFundingRateHistory(event.exchange, event.symbol, event.closeTime)),
      );
    }
    const snapshot =
      event.exchange === 'BINANCE' ? await this.fetchFundingRateSnapshot(event.symbol) : null;
    if (snapshot) incoming.push(snapshot);
    this.mergeFundingRatePoints(key, incoming);
    this.fundingLastFetchAt.set(key, now);
  }

  private mergeOpenInterestPoints(key: string, incoming: OpenInterestPoint[]) {
    if (incoming.length === 0) return;
    const existing = this.openInterestPoints.get(key) ?? [];
    const normalized = normalizeTimedNumericPoints(
      [...existing, ...incoming].map((point) => ({
        timestamp: point.timestamp,
        value: point.openInterest,
      })),
    ).map((point) => ({
      timestamp: point.timestamp,
      openInterest: point.value,
    }));

    if (normalized.length > maxCandlesPerSeries) {
      normalized.splice(0, normalized.length - maxCandlesPerSeries);
    }
    this.openInterestPoints.set(key, normalized);
  }

  private openInterestPeriodForInterval(interval: string) {
    const normalized = normalizeInterval(interval);
    const supported = new Set(['5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d']);
    if (supported.has(normalized)) return normalized;
    return '5m';
  }

  private async fetchOpenInterestHistory(
    exchange: Exchange,
    symbol: string,
    interval: string,
    endTimeMs?: number,
  ): Promise<OpenInterestPoint[]> {
    if (process.env.NODE_ENV === 'test') return [];
    if (exchange !== 'BINANCE') return [];
    const params = new URLSearchParams({
      symbol: normalizeSymbol(symbol),
      period: this.openInterestPeriodForInterval(interval),
      limit: String(Math.min(500, Math.max(20, runtimeOpenInterestHistoryLimit))),
    });
    if (Number.isFinite(endTimeMs)) {
      params.set('endTime', String(Math.floor(endTimeMs as number)));
    }

    try {
      const payload = await fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/futures/data/openInterestHist',
        searchParams: params,
      });
      if (!Array.isArray(payload)) return [];
      return payload
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const row = item as { timestamp?: unknown; sumOpenInterest?: unknown };
          const timestamp = Number(row.timestamp);
          const openInterest = Number(row.sumOpenInterest);
          if (!Number.isFinite(timestamp) || !Number.isFinite(openInterest)) return null;
          return { timestamp, openInterest } satisfies OpenInterestPoint;
        })
        .filter((item): item is OpenInterestPoint => Boolean(item))
        .sort((left, right) => left.timestamp - right.timestamp);
    } catch {
      return [];
    }
  }

  private async fetchOpenInterestSnapshot(symbol: string): Promise<OpenInterestPoint | null> {
    if (process.env.NODE_ENV === 'test') return null;
    const params = new URLSearchParams({ symbol: normalizeSymbol(symbol) });

    try {
      const payload = await fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/fapi/v1/openInterest',
        searchParams: params,
      });
      if (!payload || typeof payload !== 'object') return null;
      const row = payload as { time?: unknown; openInterest?: unknown };
      const timestamp = Number(row.time);
      const openInterest = Number(row.openInterest);
      if (!Number.isFinite(timestamp) || !Number.isFinite(openInterest)) return null;
      return { timestamp, openInterest } satisfies OpenInterestPoint;
    } catch {
      return null;
    }
  }

  private async ensureOpenInterestSeriesForCandle(event: StreamCandleEvent) {
    if (event.marketType !== 'FUTURES') return;
    const key = this.getFundingKey(event.exchange, event.marketType, event.symbol);
    const now = this.deps.nowMs();
    const existing = this.openInterestPoints.get(key) ?? [];
    const lastFetchAt = this.openInterestLastFetchAt.get(key) ?? 0;
    const shouldRefresh =
      existing.length === 0 || now - lastFetchAt >= runtimeOpenInterestRefreshMs;
    if (!shouldRefresh) return;

    const incoming: OpenInterestPoint[] = [];
    if (existing.length === 0) {
      incoming.push(
        ...(await this.fetchOpenInterestHistory(
          event.exchange,
          event.symbol,
          event.interval,
          event.closeTime,
        )),
      );
    }
    const snapshot =
      event.exchange === 'BINANCE' ? await this.fetchOpenInterestSnapshot(event.symbol) : null;
    if (snapshot) incoming.push(snapshot);
    this.mergeOpenInterestPoints(key, incoming);
    this.openInterestLastFetchAt.set(key, now);
  }

  private mergeOrderBookPoints(key: string, incoming: OrderBookPoint[]) {
    if (incoming.length === 0) return;
    const merged = new Map<number, OrderBookPoint>();
    for (const point of this.orderBookPoints.get(key) ?? []) {
      merged.set(point.timestamp, point);
    }
    for (const point of incoming) {
      if (
        !Number.isFinite(point.timestamp) ||
        !Number.isFinite(point.imbalance) ||
        !Number.isFinite(point.spreadBps) ||
        !Number.isFinite(point.depthRatio)
      ) {
        continue;
      }
      merged.set(point.timestamp, point);
    }

    const normalized = [...merged.values()].sort((left, right) => left.timestamp - right.timestamp);
    if (normalized.length > maxCandlesPerSeries) {
      normalized.splice(0, normalized.length - maxCandlesPerSeries);
    }
    this.orderBookPoints.set(key, normalized);
  }

  private async fetchOrderBookSnapshot(symbol: string): Promise<OrderBookPoint | null> {
    if (process.env.NODE_ENV === 'test') return null;
    const params = new URLSearchParams({
      symbol: normalizeSymbol(symbol),
      limit: '100',
    });

    try {
      const payload = await fetchBinancePublicRestJson({
        marketType: 'FUTURES',
        path: '/fapi/v1/depth',
        searchParams: params,
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

      const parseBookRow = (item: unknown) => {
        if (!Array.isArray(item) || item.length < 2) return null;
        const price = Number(item[0]);
        const amount = Number(item[1]);
        if (!Number.isFinite(price) || !Number.isFinite(amount) || price <= 0 || amount < 0) {
          return null;
        }
        return { price, amount };
      };

      const parsedBids = bids
        .map(parseBookRow)
        .filter((item): item is { price: number; amount: number } => Boolean(item));
      const parsedAsks = asks
        .map(parseBookRow)
        .filter((item): item is { price: number; amount: number } => Boolean(item));
      if (parsedBids.length === 0 || parsedAsks.length === 0) return null;

      const bidDepth = parsedBids.reduce((sum, item) => sum + item.amount, 0);
      const askDepth = parsedAsks.reduce((sum, item) => sum + item.amount, 0);
      const bestBid = parsedBids[0].price;
      const bestAsk = parsedAsks[0].price;
      const mid = (bestBid + bestAsk) / 2;
      const spreadBps = mid > 0 ? ((bestAsk - bestBid) / mid) * 10_000 : Number.NaN;
      const imbalance =
        bidDepth + askDepth > 0 ? (bidDepth - askDepth) / (bidDepth + askDepth) : Number.NaN;
      const depthRatio = askDepth > 0 ? bidDepth / askDepth : Number.NaN;
      const timestampRaw = Number(row.E ?? row.T ?? Date.now());
      const timestamp = Number.isFinite(timestampRaw) ? timestampRaw : Date.now();
      if (
        !Number.isFinite(spreadBps) ||
        !Number.isFinite(imbalance) ||
        !Number.isFinite(depthRatio)
      ) {
        return null;
      }

      return {
        timestamp,
        imbalance,
        spreadBps,
        depthRatio,
      } satisfies OrderBookPoint;
    } catch {
      return null;
    }
  }

  private async ensureOrderBookSeriesForCandle(event: StreamCandleEvent) {
    if (event.marketType !== 'FUTURES') return;
    const key = this.getFundingKey(event.exchange, event.marketType, event.symbol);
    const now = this.deps.nowMs();
    const lastFetchAt = this.orderBookLastFetchAt.get(key) ?? 0;
    if (now - lastFetchAt < runtimeOrderBookRefreshMs) return;

    const snapshot =
      event.exchange === 'BINANCE' ? await this.fetchOrderBookSnapshot(event.symbol) : null;
    if (snapshot) {
      this.mergeOrderBookPoints(key, [snapshot]);
    }
    this.orderBookLastFetchAt.set(key, now);
  }

  private getSeriesKey(
    exchange: Exchange,
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    interval: string,
  ) {
    return buildRuntimeSignalSeriesKey(exchange, marketType, symbol, interval);
  }
}
