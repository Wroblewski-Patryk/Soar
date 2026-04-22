import { normalizeSymbols } from '../../lib/symbols';
import { findOwnedMarketUniverseById } from './backtests.repository';
import { getDefaultCandlesForTimeframe, getTimeframeIntervalMs } from './backtestTimeframe';
import { resolveMarketUniverseContractSymbolsFromCatalog } from '../markets/marketCatalogSymbolResolver.service';
import type { CreateBacktestRunDto } from './backtests.types';
import type { BacktestMarketType as MarketType } from './backtestDataGateway';
import { Exchange } from '@prisma/client';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export class BacktestRunValidationError extends Error {}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const inferBaseCurrencyFromSymbol = (symbol: string): string =>
  (symbol.match(/(USDT|USDC|BUSD|FDUSD|BTC|ETH|EUR|USD)$/)?.[1] ?? 'USDT').toUpperCase();

export const computeSourceWindowMs = (timeframe: string, maxCandles: number) => {
  const intervalMs = getTimeframeIntervalMs(timeframe);
  const requestedWindowMs = intervalMs * Math.max(1, maxCandles);
  const bufferedWindowMs = Math.ceil(requestedWindowMs * 1.15);
  return Math.max(TWO_WEEKS_MS, bufferedWindowMs);
};

const resolveBoundedRangeEndMs = (timeframe: string, endCandidateMs: number) => {
  const intervalMs = getTimeframeIntervalMs(timeframe);
  const boundaryMs = Math.floor(Date.now() / intervalMs) * intervalMs;
  return Math.min(endCandidateMs, boundaryMs);
};

export const resolveBacktestRangeWindow = (input: {
  timeframe: string;
  startAt?: Date;
  endAt?: Date;
  requestedMaxCandles?: number;
}) => {
  const intervalMs = getTimeframeIntervalMs(input.timeframe);

  if (input.startAt && input.endAt) {
    const boundedEndMs = resolveBoundedRangeEndMs(input.timeframe, input.endAt.getTime());
    const startMs = input.startAt.getTime();
    if (startMs >= boundedEndMs) {
      throw new BacktestRunValidationError('Invalid backtest range: startAt must be earlier than endAt boundary');
    }
    return {
      startAt: new Date(startMs),
      endAt: new Date(boundedEndMs),
      source: 'explicit' as const,
    };
  }

  const boundedEndMs = resolveBoundedRangeEndMs(input.timeframe, Date.now());
  const fallbackCandles = Math.max(
    1,
    Number.isFinite(input.requestedMaxCandles)
      ? Math.floor(input.requestedMaxCandles as number)
      : getDefaultCandlesForTimeframe(input.timeframe)
  );
  return {
    startAt: new Date(boundedEndMs - intervalMs * fallbackCandles),
    endAt: new Date(boundedEndMs),
    source: 'derived' as const,
  };
};

export const computeAdaptiveMaxCandles = (timeframe: string, symbolCount: number, requested?: number) => {
  const base = requested && Number.isFinite(requested) ? requested : getDefaultCandlesForTimeframe(timeframe);
  const safeBase = clamp(Math.floor(base), 100, 10_000);

  if (symbolCount <= 25) return safeBase;
  if (symbolCount <= 100) return clamp(Math.floor(safeBase * 0.65), 100, safeBase);
  if (symbolCount <= 250) return clamp(Math.floor(safeBase * 0.45), 80, safeBase);
  return clamp(Math.floor(safeBase * 0.3), 60, safeBase);
};

export const resolveRequestedMaxCandles = (seedConfig: unknown) =>
  typeof seedConfig === 'object' &&
  seedConfig &&
  'maxCandles' in seedConfig &&
  Number.isFinite(Number((seedConfig as { maxCandles?: unknown }).maxCandles))
    ? Number((seedConfig as { maxCandles?: unknown }).maxCandles)
    : undefined;

export const resolveEffectiveMaxCandlesFromSeed = (input: {
  seed: Record<string, unknown>;
  timeframe: string;
  symbolCount: number;
}) => {
  const effectiveFromSeed = Number((input.seed as { effectiveMaxCandles?: unknown }).effectiveMaxCandles);
  if (Number.isFinite(effectiveFromSeed)) {
    return clamp(Math.floor(effectiveFromSeed), 100, 10_000);
  }

  const legacyMaxCandles = Number((input.seed as { maxCandles?: unknown }).maxCandles);
  if (Number.isFinite(legacyMaxCandles)) {
    return clamp(Math.floor(legacyMaxCandles), 100, 10_000);
  }

  const requestedFromSeed = Number((input.seed as { requestedMaxCandles?: unknown }).requestedMaxCandles);
  return computeAdaptiveMaxCandles(
    input.timeframe,
    input.symbolCount,
    Number.isFinite(requestedFromSeed) ? requestedFromSeed : undefined
  );
};

export const resolveTimelineEndTimeMs = (input: {
  runStatus: string;
  finishedAt: Date | null;
  liveProgressCurrentCandleTime?: string | null;
  configuredRangeEndTime?: string | null;
}) => {
  const configuredRangeEndRaw =
    typeof input.configuredRangeEndTime === 'string'
      ? Date.parse(input.configuredRangeEndTime)
      : Number.NaN;
  if (Number.isFinite(configuredRangeEndRaw)) return configuredRangeEndRaw;

  const terminalStatuses = new Set(['COMPLETED', 'FAILED', 'CANCELED']);
  if (terminalStatuses.has(input.runStatus) && input.finishedAt) {
    return input.finishedAt.getTime();
  }

  const liveProgressTimeRaw =
    typeof input.liveProgressCurrentCandleTime === 'string'
      ? Date.parse(input.liveProgressCurrentCandleTime)
      : Number.NaN;
  if (Number.isFinite(liveProgressTimeRaw)) return liveProgressTimeRaw;

  return input.finishedAt?.getTime();
};

type ReplayContext = 'isolated' | 'portfolio';

export const resolveReplaySymbolsForTimeline = (input: {
  runSymbols: string[];
  requestedSymbol: string;
  replayContext: ReplayContext;
}) => {
  if (input.replayContext === 'portfolio') {
    return input.runSymbols.length > 0 ? input.runSymbols : [input.requestedSymbol];
  }
  return [input.requestedSymbol];
};

export type ResolvedRunContext = {
  symbols: string[];
  exchange: Exchange;
  marketType: MarketType;
  baseCurrency: string;
  marketUniverseId: string | null;
};

export const resolveSymbolsForRun = async (
  userId: string,
  data: CreateBacktestRunDto
): Promise<ResolvedRunContext | null> => {
  if (!data.marketUniverseId) {
    const symbols = normalizeSymbols([data.symbol ?? 'BTCUSDT']);
    return {
      symbols,
      exchange: 'BINANCE',
      marketType: 'FUTURES' as MarketType,
      baseCurrency: inferBaseCurrencyFromSymbol(symbols[0] ?? 'BTCUSDT'),
      marketUniverseId: null,
    };
  }

  const universe = await findOwnedMarketUniverseById(userId, data.marketUniverseId);
  if (!universe) return null;

  const resolved = await resolveMarketUniverseContractSymbolsFromCatalog(
    {
      exchange: universe.exchange,
      marketType: universe.marketType as 'FUTURES' | 'SPOT',
      baseCurrency: universe.baseCurrency,
      filterRules: universe.filterRules,
      whitelist: universe.whitelist,
      blacklist: universe.blacklist,
    },
    new Map<string, string[]>()
  );

  return {
    symbols: resolved,
    exchange: universe.exchange,
    marketType: universe.marketType as MarketType,
    baseCurrency: universe.baseCurrency,
    marketUniverseId: universe.id,
  };
};
