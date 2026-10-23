import { createHash } from 'node:crypto';
import { fetchBinancePublicRestJson } from '../exchange/binancePublicRest.service';
import type { BacktestKlineCandle } from './backtestDataGateway';

// Binance USD-M aggTrades is public, but only covers the last 48 hours. It
// compresses contiguous same-price/same-side market trades within 100 ms.
const MAX_AGE_MS = 48 * 60 * 60 * 1000;
const MAX_PAGES = 20;
const MAX_ARCHIVE_PAGES = 80;
const PAGE_SIZE = 1000;
const MAX_CANDLES = 120;
const MAX_WINDOW_MS = 2 * 60 * 60 * 1000;
const BOUNDARY_MS = 1000;

type AggregateTrade = {
  a: number; p: string; q: string; f: number; l: number; T: number; m: boolean;
};

export type VerifiedIntrabarProvenance = ({
  source: 'BINANCE_USDM_AGGTRADES' | 'BINANCE_USDM_AGGTRADES_ARCHIVE';
  endpoint: '/fapi/v1/aggTrades' | 'data.binance.vision';
  firstAggregateId: number;
  lastAggregateId: number;
} | {
  source: 'BINANCE_USDM_TRADES_ARCHIVE';
  endpoint: 'data.binance.vision';
  firstAggregateId?: undefined;
  lastAggregateId?: undefined;
}) & {
  symbol: string;
  firstTradeId: number;
  lastTradeId: number;
  sha256: string;
  archiveProof?: 'CHECKSUM_VERIFIED' | 'PERSISTED_CHECKSUM_REVERIFIED' | 'LEGACY_SNAPSHOT';
};

export type VerifiedIntrabarCandle = BacktestKlineCandle & {
  intrabarTicks: Array<{ eventTime: number; price: number; sequenceId: number }>;
  intrabarProvenance: VerifiedIntrabarProvenance;
};

type Query = { symbol: string; startTime?: number; endTime?: number; fromId?: number; limit: number };
type FetchPage = (query: Query) => Promise<unknown>;

const publicFetchPage: FetchPage = (query) => {
  const searchParams = new URLSearchParams({ symbol: query.symbol, limit: String(query.limit) });
  if (query.startTime !== undefined) searchParams.set('startTime', String(query.startTime));
  if (query.endTime !== undefined) searchParams.set('endTime', String(query.endTime));
  if (query.fromId !== undefined) searchParams.set('fromId', String(query.fromId));
  return fetchBinancePublicRestJson({ marketType: 'FUTURES', path: '/fapi/v1/aggTrades',
    searchParams, init: { signal: AbortSignal.timeout(10_000) } });
};

const fail = (reason: string): never => { throw new Error(`BACKTEST_INTRABAR_SOURCE_${reason}`); };
export const digestVerifiedBinanceFuturesIntrabar = (
  candles: BacktestKlineCandle[], symbol: string,
): string => {
  if (candles.length === 0 || candles.some((candle) => {
    const provenance = candle.intrabarProvenance;
    return !Array.isArray(candle.intrabarTicks) || candle.intrabarTicks.length < 2 ||
      !provenance || !(
        provenance.source === 'BINANCE_USDM_AGGTRADES' &&
          provenance.endpoint === '/fapi/v1/aggTrades' ||
        provenance.source === 'BINANCE_USDM_AGGTRADES_ARCHIVE' &&
          provenance.endpoint === 'data.binance.vision'
      ) || provenance.symbol !== symbol ||
      !/^[0-9a-f]{64}$/.test(provenance.sha256);
  })) fail('UNVERIFIED');
  // Match the digest persisted by existing strict runs: open time plus the
  // per-candle canonical aggregate-trade hash, in candle order.
  return createHash('sha256').update(candles.map((candle) =>
    `${candle.openTime}:${candle.intrabarProvenance!.sha256}`).join('|')).digest('hex');
};
const finitePositive = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : NaN;
};
const safeId = (value: unknown) => typeof value === 'number' &&
  Number.isSafeInteger(value) && value >= 0;
const closeEnough = (actual: number, expected: number) =>
  Math.abs(actual - expected) <= Math.max(1e-8, Math.abs(expected) * 1e-7);

const parsePage = (value: unknown): AggregateTrade[] => {
  if (!Array.isArray(value) || value.length > PAGE_SIZE) return fail('BAD_PAGE');
  return value.map((row: unknown) => {
    if (!row || typeof row !== 'object') fail('BAD_ROW');
    const trade = row as Partial<AggregateTrade>;
    if (!safeId(trade.a) || !safeId(trade.f) || !safeId(trade.l) ||
        (trade.f as number) > (trade.l as number) || !safeId(trade.T) ||
        !Number.isFinite(finitePositive(trade.p)) ||
        !Number.isFinite(finitePositive(trade.q)) || typeof trade.m !== 'boolean') {
      fail('BAD_ROW');
    }
    return trade as AggregateTrade;
  });
};

export const fetchVerifiedBinanceFuturesIntrabar = async (input: {
  symbol: string;
  candles: BacktestKlineCandle[];
  nowMs?: number;
  fetchPage?: FetchPage;
  verifiedArchive?: boolean;
}): Promise<VerifiedIntrabarCandle[]> => {
  const { symbol, candles } = input;
  if (!/^[A-Z0-9]{4,24}$/.test(symbol) || candles.length === 0 ||
      candles.length > MAX_CANDLES) fail('INVALID_WINDOW');
  const start = candles[0].openTime;
  const end = candles[candles.length - 1].closeTime;
  const now = input.nowMs ?? Date.now();
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
      start >= end || end - start + 1 > MAX_WINDOW_MS ||
      (!input.verifiedArchive && start - BOUNDARY_MS < now - MAX_AGE_MS) ||
      end + BOUNDARY_MS >= now) {
    fail('WINDOW_UNAVAILABLE');
  }
  for (const [index, candle] of candles.entries()) {
    if (!Number.isFinite(candle.volume) || candle.volume <= 0 ||
        ![candle.open, candle.high, candle.low, candle.close].every((price) =>
          Number.isFinite(price) && price > 0) ||
        candle.low > Math.min(candle.open, candle.close) ||
        candle.high < Math.max(candle.open, candle.close) ||
        (index > 0 && candles[index - 1].closeTime + 1 !== candle.openTime)) {
      fail('INVALID_CANDLES');
    }
  }

  if (input.verifiedArchive && !input.fetchPage) fail('UNVERIFIED');
  const fetchPage = input.fetchPage ?? publicFetchPage;
  const rows: AggregateTrade[] = [];
  const maxPages = input.verifiedArchive ? MAX_ARCHIVE_PAGES : MAX_PAGES;
  for (let page = 0; page < maxPages; page += 1) {
    const first = page === 0;
    const query: Query = first
      ? { symbol, startTime: start - BOUNDARY_MS,
          endTime: Math.min(end + BOUNDARY_MS, start + 59 * 60_000), limit: PAGE_SIZE }
      : { symbol, fromId: rows[rows.length - 1].a + 1, limit: PAGE_SIZE };
    let value: unknown;
    try { value = await fetchPage(query); } catch { fail('FETCH_FAILED'); }
    const parsed = parsePage(value);
    if (parsed.length === 0) fail('INCOMPLETE');
    for (const row of parsed) {
      const previous = rows[rows.length - 1];
      // Binance may skip raw trade IDs in aggTrades while aggregate IDs stay
      // contiguous. Kline OHLC and volume below verify the candle coverage.
      if (previous && (row.a !== previous.a + 1 || row.f <= previous.l ||
          row.T < previous.T)) fail('SEQUENCE_GAP');
      if (first && (row.T < query.startTime! || row.T > query.endTime!)) fail('BAD_PAGE');
      if (!first && row.a < query.fromId!) fail('BAD_PAGE');
      rows.push(row);
      if (rows.length > maxPages * PAGE_SIZE) fail('LIMIT');
    }
    const completeShortPage = parsed.length < PAGE_SIZE &&
      (!first || query.endTime! >= end + BOUNDARY_MS);
    if (completeShortPage || rows[rows.length - 1].T > end) break;
    if (page === maxPages - 1) fail('LIMIT');
  }

  return candles.map((candle) => {
    const inCandle = rows.filter((row) => row.T >= candle.openTime && row.T <= candle.closeTime);
    if (inCandle.length < 2) fail('INCOMPLETE');
    let high = -Infinity;
    let low = Infinity;
    let volume = 0;
    for (const row of inCandle) {
      const price = finitePositive(row.p);
      high = Math.max(high, price);
      low = Math.min(low, price);
      volume += finitePositive(row.q);
    }
    if (!closeEnough(finitePositive(inCandle[0].p), candle.open) ||
        !closeEnough(finitePositive(inCandle[inCandle.length - 1].p), candle.close) ||
        !closeEnough(high, candle.high) ||
        !closeEnough(low, candle.low) ||
        !closeEnough(volume, candle.volume)) fail('OHLC_MISMATCH');
    const canonical = inCandle.map((row) =>
      [row.a, row.p, row.q, row.f, row.l, row.T, row.m ? 1 : 0].join(',')).join('\n');
    return { ...candle,
      intrabarTicks: inCandle.map((row) => ({
        eventTime: row.T, price: finitePositive(row.p), sequenceId: row.a,
      })),
      intrabarProvenance: {
        source: input.verifiedArchive
          ? 'BINANCE_USDM_AGGTRADES_ARCHIVE' as const : 'BINANCE_USDM_AGGTRADES' as const,
        endpoint: input.verifiedArchive
          ? 'data.binance.vision' as const : '/fapi/v1/aggTrades' as const, symbol,
        firstAggregateId: inCandle[0].a,
        lastAggregateId: inCandle[inCandle.length - 1].a,
        firstTradeId: inCandle[0].f,
        lastTradeId: inCandle[inCandle.length - 1].l,
        sha256: createHash('sha256').update(canonical).digest('hex'),
      },
    };
  });
};
