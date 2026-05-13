import {
  CcxtPublicCandle,
  CcxtPublicFundingRatePoint,
  CcxtPublicOpenInterestPoint,
  CcxtPublicOrderBookPoint,
} from './ccxtFuturesConnector.types';

export type CcxtFundingRateLike = {
  timestamp?: number;
  datetime?: string;
  fundingRate?: number | string | null;
  rate?: number | string | null;
  info?: Record<string, unknown>;
};

export type CcxtOpenInterestLike = {
  timestamp?: number;
  datetime?: string;
  openInterest?: number | string | null;
  amount?: number | string | null;
  value?: number | string | null;
  info?: Record<string, unknown>;
};

export type CcxtOrderBookLike = {
  timestamp?: number;
  datetime?: string;
  bids?: unknown[];
  asks?: unknown[];
  info?: Record<string, unknown>;
};

export function normalizeCcxtPublicCandle(row: unknown, interval: string): CcxtPublicCandle | null {
  if (!Array.isArray(row) || row.length < 6) return null;
  const openTime = readNumber(row[0]);
  const open = readNumber(row[1]);
  const high = readNumber(row[2]);
  const low = readNumber(row[3]);
  const close = readNumber(row[4]);
  const volume = readNumber(row[5]);
  const values = [openTime, open, high, low, close, volume] as const;
  if (values.some((value) => value == null)) return null;
  const [safeOpenTime, safeOpen, safeHigh, safeLow, safeClose, safeVolume] = values as [
    number, number, number, number, number, number,
  ];
  if (safeOpenTime < 0 || safeOpen <= 0 || safeHigh <= 0 || safeLow <= 0 || safeClose <= 0 || safeVolume < 0) {
    return null;
  }

  return {
    openTime: Math.trunc(safeOpenTime),
    closeTime: Math.trunc(safeOpenTime + resolveIntervalMs(interval) - 1),
    open: safeOpen,
    high: safeHigh,
    low: safeLow,
    close: safeClose,
    volume: safeVolume,
    raw: row,
  };
}

export function normalizeCcxtFundingRatePoint(row: CcxtFundingRateLike): CcxtPublicFundingRatePoint | null {
  const info = row.info ?? {};
  const timestamp = normalizeTimestamp(row);
  const fundingRate =
    readNumber(row.fundingRate) ??
    readNumber(row.rate) ??
    readNumber(info.fundingRate) ??
    readNumber(info.lastFundingRate);
  if (timestamp == null || fundingRate == null || !Number.isFinite(fundingRate)) return null;
  return { timestamp, fundingRate, raw: row };
}

export function normalizeCcxtOpenInterestPoint(row: CcxtOpenInterestLike): CcxtPublicOpenInterestPoint | null {
  const info = row.info ?? {};
  const timestamp = normalizeTimestamp(row);
  const openInterest =
    readNumber(row.openInterest) ??
    readNumber(row.amount) ??
    readNumber(row.value) ??
    readNumber(info.openInterest) ??
    readNumber(info.sumOpenInterest);
  if (timestamp == null || openInterest == null || !Number.isFinite(openInterest)) return null;
  return { timestamp, openInterest, raw: row };
}

export function normalizeCcxtOrderBookPoint(row: CcxtOrderBookLike): CcxtPublicOrderBookPoint | null {
  const parseLevel = (value: unknown) => {
    if (!Array.isArray(value) || value.length < 2) return null;
    const price = readNumber(value[0]);
    const amount = readNumber(value[1]);
    if (price == null || amount == null || price <= 0 || amount < 0) return null;
    return { price, amount };
  };
  const bids = (Array.isArray(row.bids) ? row.bids : [])
    .map(parseLevel)
    .filter((item): item is { price: number; amount: number } => item != null);
  const asks = (Array.isArray(row.asks) ? row.asks : [])
    .map(parseLevel)
    .filter((item): item is { price: number; amount: number } => item != null);
  if (bids.length === 0 || asks.length === 0) return null;
  const bidDepth = bids.reduce((sum, level) => sum + level.amount, 0);
  const askDepth = asks.reduce((sum, level) => sum + level.amount, 0);
  const bestBid = bids[0].price;
  const bestAsk = asks[0].price;
  const mid = (bestBid + bestAsk) / 2;
  if (mid <= 0 || bidDepth + askDepth <= 0 || askDepth <= 0) return null;
  return {
    timestamp: normalizeTimestamp(row) ?? Date.now(),
    imbalance: (bidDepth - askDepth) / (bidDepth + askDepth),
    spreadBps: ((bestAsk - bestBid) / mid) * 10_000,
    depthRatio: bidDepth / askDepth,
    raw: row,
  };
}

function normalizeTimestamp(input: { timestamp?: number; datetime?: string; info?: Record<string, unknown> }) {
  const info = input.info ?? {};
  const candidates = [
    input.timestamp,
    input.datetime ? Date.parse(input.datetime) : null,
    info.timestamp,
    info.time,
    info.fundingTime,
    info.T,
    info.E,
  ];
  for (const candidate of candidates) {
    const value = readNumber(candidate);
    if (value != null && value > 0) return Math.trunc(value);
  }
  return null;
}

function resolveIntervalMs(interval: string) {
  const normalized = interval.trim().toLowerCase();
  const match = /^(\d+)([mhdw])$/.exec(normalized);
  if (!match) return 60_000;
  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
  };
  return Math.max(1, amount) * multipliers[unit];
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
