import { Exchange, Prisma } from '@prisma/client';
import { normalizeSymbol, normalizeSymbols } from '../../lib/symbols';
import {
  parseStrategySignalRules,
  type StrategySignalDerivativesSeries,
} from '../engine/strategySignalEvaluator';
import { resolveStrategyIndicatorSeries } from '../engine/strategyIndicatorKernel';
import { alignTimedNumericPointsToCandles } from '../engine/sharedDerivativesSeries';
import { CandlePatternName } from '../engine/sharedCandlePatternSeries';
import {
  normalizeWalletRiskPercent,
} from '../engine/positionSizing';
import {
  type ReplayEventType,
} from './backtestReplayCore';
import {
  CreateBacktestRunDto,
  GetBacktestTimelineQuery,
  ListBacktestRunsQuery,
  ListBacktestTradesQuery,
} from './backtests.types';
import {
  IndicatorSpec,
  parseStrategyIndicators,
  resolveIndicatorWarmupCandles,
} from './backtestIndicatorSpecs';
import {
  getDefaultCandlesForTimeframe,
  getTimeframeIntervalMs,
} from './backtestTimeframe';
import {
  type BacktestFundingRatePoint as FundingRatePoint,
  fetchKlines,
  type BacktestKlineCandle as KlineCandle,
  type BacktestMarketType as MarketType,
  type BacktestOpenInterestPoint as OpenInterestPoint,
  type BacktestOrderBookPoint as OrderBookPoint,
  type BacktestSupplementalSeries as SupplementalSeries,
  fetchSupplementalSeries,
} from './backtestDataGateway';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { createBacktestRunJob } from './backtestRunJob';
import { BacktestRunQueue } from './backtestRunQueue';
import {
  countLosingBacktestTrades,
  countWinningBacktestTrades,
  createBacktestRun,
  createBacktestTrades,
  deleteOwnedBacktestRunCascade,
  findBacktestRunById,
  findOwnedBacktestReport,
  findOwnedBacktestRun,
  findOwnedBacktestRunId,
  findOwnedBacktestRunTimelineSeed,
  findOwnedStrategyForBacktest,
  findOwnedStrategySignalConfig,
  listOwnedBacktestRuns,
  listOwnedBacktestTrades,
  upsertBacktestReportForRun,
} from './backtests.repository';
import {
  computeAdaptiveMaxCandles,
  computeSourceWindowMs,
  resolveBacktestRangeWindow,
  resolveEffectiveMaxCandlesFromSeed,
  resolveReplaySymbolsForTimeline,
  resolveRequestedMaxCandles,
  resolveSymbolsForRun,
  resolveTimelineEndTimeMs,
  type ResolvedRunContext,
  BacktestRunValidationError,
} from './backtestRange.service';
import {
  buildRunLifecyclePayload,
  isTerminalBacktestStatus,
  safeUpsertBacktestReportForRun,
  safeUpdateRun,
} from './backtestReportLifecycle.service';

export { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
export {
  BacktestRunValidationError,
  resolveEffectiveMaxCandlesFromSeed,
  resolveReplaySymbolsForTimeline,
  resolveTimelineEndTimeMs,
} from './backtestRange.service';

type MarginMode = 'CROSSED' | 'ISOLATED';
type ReplayContext = 'isolated' | 'portfolio';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;


const maxDrawdownFromPnlSeries = (pnls: number[]) => {
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;

  for (const pnl of pnls) {
    equity += pnl;
    if (equity > peak) peak = equity;
    const drawdown = peak > 0 ? (peak - equity) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  return maxDrawdown;
};

const resolveKernelIndicatorMapping = (spec: IndicatorSpec) => {
  if (spec.source === 'EMA') {
    return { indicatorName: 'EMA', indicatorParams: { period: spec.params.period ?? spec.period } };
  }
  if (spec.source === 'SMA') {
    return { indicatorName: 'SMA', indicatorParams: { period: spec.params.period ?? spec.period } };
  }
  if (spec.source === 'RSI') {
    return { indicatorName: 'RSI', indicatorParams: { period: spec.params.period ?? spec.period } };
  }
  if (spec.source === 'ROC') {
    return { indicatorName: 'ROC', indicatorParams: { period: spec.params.period ?? spec.period } };
  }
  if (spec.source === 'ATR') {
    return { indicatorName: 'ATR', indicatorParams: { period: spec.params.period ?? spec.period } };
  }
  if (spec.source === 'CCI') {
    return { indicatorName: 'CCI', indicatorParams: { period: spec.params.period ?? spec.period } };
  }
  if (spec.source === 'DONCHIAN') {
    if (spec.channel === 'UPPER') {
      return { indicatorName: 'DONCHIAN_UPPER', indicatorParams: { period: spec.params.period ?? 20 } };
    }
    if (spec.channel === 'LOWER') {
      return { indicatorName: 'DONCHIAN_LOWER', indicatorParams: { period: spec.params.period ?? 20 } };
    }
    return { indicatorName: 'DONCHIAN_MIDDLE', indicatorParams: { period: spec.params.period ?? 20 } };
  }
  if (spec.source === 'PATTERN') {
    if (!spec.patternName) return null;
    return { indicatorName: spec.patternName, indicatorParams: spec.params };
  }
  if (spec.source === 'FUNDING') {
    if (spec.channel === 'ZSCORE') {
      return {
        indicatorName: 'FUNDING_RATE_ZSCORE',
        indicatorParams: {
          zScorePeriod: spec.params.zScorePeriod ?? spec.params.period ?? spec.period,
        },
      };
    }
    return { indicatorName: 'FUNDING_RATE', indicatorParams: {} };
  }
  if (spec.source === 'OPEN_INTEREST') {
    if (spec.channel === 'ZSCORE') {
      return {
        indicatorName: 'OPEN_INTEREST_ZSCORE',
        indicatorParams: {
          zScorePeriod: spec.params.zScorePeriod ?? spec.params.period ?? spec.period,
        },
      };
    }
    if (spec.channel === 'MA') {
      return {
        indicatorName: 'OPEN_INTEREST_MA',
        indicatorParams: { period: spec.params.period ?? spec.period },
      };
    }
    if (spec.channel === 'DELTA') {
      return { indicatorName: 'OPEN_INTEREST_DELTA', indicatorParams: {} };
    }
    return { indicatorName: 'OPEN_INTEREST', indicatorParams: {} };
  }
  if (spec.source === 'ORDER_BOOK') {
    if (spec.channel === 'SPREAD_BPS') return { indicatorName: 'ORDER_BOOK_SPREAD_BPS', indicatorParams: {} };
    if (spec.channel === 'DEPTH_RATIO') return { indicatorName: 'ORDER_BOOK_DEPTH_RATIO', indicatorParams: {} };
    return { indicatorName: 'ORDER_BOOK_IMBALANCE', indicatorParams: {} };
  }
  if (spec.source === 'ADX') {
    if (spec.channel === 'DI_PLUS') return { indicatorName: 'DI_PLUS', indicatorParams: spec.params };
    if (spec.channel === 'DI_MINUS') return { indicatorName: 'DI_MINUS', indicatorParams: spec.params };
    return { indicatorName: 'ADX', indicatorParams: spec.params };
  }
  if (spec.source === 'STOCHASTIC') {
    if (spec.channel === 'D') return { indicatorName: 'STOCHASTIC_D', indicatorParams: spec.params };
    return { indicatorName: 'STOCHASTIC', indicatorParams: spec.params };
  }
  if (spec.source === 'MACD') {
    if (spec.channel === 'SIGNAL') return { indicatorName: 'MACD_SIGNAL', indicatorParams: spec.params };
    if (spec.channel === 'HISTOGRAM') return { indicatorName: 'MACD_HIST', indicatorParams: spec.params };
    return { indicatorName: 'MACD', indicatorParams: spec.params };
  }
  if (spec.source === 'STOCHRSI') {
    if (spec.channel === 'D') return { indicatorName: 'STOCHRSI_D', indicatorParams: spec.params };
    return { indicatorName: 'STOCHRSI', indicatorParams: spec.params };
  }
  if (spec.source === 'BOLLINGER') {
    if (spec.channel === 'UPPER') return { indicatorName: 'BOLLINGER_UPPER', indicatorParams: spec.params };
    if (spec.channel === 'MIDDLE') return { indicatorName: 'BOLLINGER_MIDDLE', indicatorParams: spec.params };
    if (spec.channel === 'LOWER') return { indicatorName: 'BOLLINGER_LOWER', indicatorParams: spec.params };
    if (spec.channel === 'BANDWIDTH') return { indicatorName: 'BOLLINGER_BANDWIDTH', indicatorParams: spec.params };
    return { indicatorName: 'BOLLINGER_PERCENT_B', indicatorParams: spec.params };
  }
  return { indicatorName: 'MOMENTUM', indicatorParams: { period: spec.params.period ?? spec.period } };
};

const buildIndicatorSeries = (
  candles: KlineCandle[],
  specs: IndicatorSpec[],
  supplemental?: SupplementalSeries,
) => {
  const opens = candles.map((candle) => candle.open);
  const closes = candles.map((candle) => candle.close);
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const fundingRawSeries = supplemental
    ? alignTimedNumericPointsToCandles(
        candles,
        supplemental.fundingRates.map((point) => ({
          timestamp: point.timestamp,
          value: point.fundingRate,
        })),
      )
    : Array.from({ length: closes.length }, () => null);
  const openInterestRawSeries = supplemental
    ? alignTimedNumericPointsToCandles(
        candles,
        supplemental.openInterest.map((point) => ({
          timestamp: point.timestamp,
          value: point.openInterest,
        })),
      )
    : Array.from({ length: closes.length }, () => null);
  const orderBookImbalanceSeries = supplemental
    ? alignTimedNumericPointsToCandles(
        candles,
        supplemental.orderBook.map((point) => ({
          timestamp: point.timestamp,
          value: point.imbalance,
        })),
      )
    : Array.from({ length: closes.length }, () => null);
  const orderBookSpreadSeries = supplemental
    ? alignTimedNumericPointsToCandles(
        candles,
        supplemental.orderBook.map((point) => ({
          timestamp: point.timestamp,
          value: point.spreadBps,
        })),
      )
    : Array.from({ length: closes.length }, () => null);
  const orderBookDepthRatioSeries = supplemental
    ? alignTimedNumericPointsToCandles(
        candles,
        supplemental.orderBook.map((point) => ({
          timestamp: point.timestamp,
          value: point.depthRatio,
        })),
      )
    : Array.from({ length: closes.length }, () => null);
  const derivatives: StrategySignalDerivativesSeries = {
    fundingRate: fundingRawSeries,
    openInterest: openInterestRawSeries,
    orderBookImbalance: orderBookImbalanceSeries,
    orderBookSpreadBps: orderBookSpreadSeries,
    orderBookDepthRatio: orderBookDepthRatioSeries,
  };
  const indicatorCache = new Map<string, Array<number | null>>();

  return specs.map((spec) => {
    const kernelMapping = resolveKernelIndicatorMapping(spec);
    const fallbackValues =
      spec.source === 'PATTERN'
        ? Array.from({ length: closes.length }, () => 0)
        : Array.from({ length: closes.length }, () => null);
    const values = kernelMapping
      ? resolveStrategyIndicatorSeries({
          indicatorName: kernelMapping.indicatorName,
          indicatorParams: kernelMapping.indicatorParams,
          opens,
          closes,
          highs,
          lows,
          cache: indicatorCache,
          derivatives,
        }) ?? fallbackValues
      : fallbackValues;
    return {
      key: spec.key,
      name: spec.name,
      period: spec.period,
      panel: spec.panel,
      values,
    };
  });
};

export const parseStrategyIndicatorsForTests = (strategyConfig: unknown) =>
  parseStrategyIndicators(strategyConfig);

export const buildIndicatorSeriesForTests = (
  candles: Array<{
    openTime: number;
    closeTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>,
  specs: Array<{
    key: string;
    name: string;
    period: number;
    panel: 'price' | 'oscillator';
    source:
      | 'EMA'
      | 'SMA'
      | 'RSI'
      | 'MOMENTUM'
      | 'MACD'
      | 'ROC'
      | 'STOCHRSI'
      | 'STOCHASTIC'
      | 'BOLLINGER'
      | 'ATR'
      | 'CCI'
      | 'DONCHIAN'
      | 'ADX'
      | 'PATTERN'
      | 'FUNDING'
      | 'OPEN_INTEREST'
      | 'ORDER_BOOK';
    params: Record<string, number>;
    patternName?: CandlePatternName;
    channel?:
      | 'LINE'
      | 'SIGNAL'
      | 'HISTOGRAM'
      | 'K'
      | 'D'
      | 'UPPER'
      | 'MIDDLE'
      | 'LOWER'
      | 'BANDWIDTH'
      | 'PERCENT_B'
      | 'ADX'
      | 'DI_PLUS'
      | 'DI_MINUS'
      | 'RAW'
      | 'ZSCORE'
      | 'DELTA'
      | 'MA'
      | 'IMBALANCE'
      | 'SPREAD_BPS'
      | 'DEPTH_RATIO';
  }>,
  supplemental?: {
    fundingRates: Array<{ timestamp: number; fundingRate: number }>;
    openInterest: Array<{ timestamp: number; openInterest: number }>;
    orderBook?: Array<{ timestamp: number; imbalance: number; spreadBps: number; depthRatio: number }>;
  },
) =>
  buildIndicatorSeries(
    candles as KlineCandle[],
    specs as IndicatorSpec[],
    (supplemental
      ? {
          fundingRates: supplemental.fundingRates,
          openInterest: supplemental.openInterest,
          orderBook: supplemental.orderBook ?? [],
        }
      : undefined) as SupplementalSeries | undefined,
  );

const runBacktestAsync = createBacktestRunJob({
  findBacktestRunById,
  safeUpdateRun,
  uniqueSorted: normalizeSymbols,
  computeAdaptiveMaxCandles,
  resolveIndicatorWarmupCandles,
  normalizeWalletRiskPercent,
  parseStrategySignalRules,
  findOwnedStrategySignalConfig,
  fetchKlines,
  fetchSupplementalSeries,
  simulateInterleavedPortfolio,
  createBacktestTrades,
  countWinningBacktestTrades,
  countLosingBacktestTrades,
  upsertBacktestReportForRun: safeUpsertBacktestReportForRun,
  computeSourceWindowMs,
  maxDrawdownFromPnlSeries,
});
const backtestRunQueue = new BacktestRunQueue(runBacktestAsync);

export const listRuns = async (userId: string, query: ListBacktestRunsQuery) => {
  return listOwnedBacktestRuns(userId, query);
};

export const getRun = async (userId: string, id: string) => {
  return findOwnedBacktestRun(userId, id);
};

export const deleteRun = async (userId: string, id: string) => {
  const existing = await findOwnedBacktestRunId(userId, id);
  if (!existing) return false;

  await safeUpdateRun(existing.id, {
    status: 'CANCELED',
    finishedAt: new Date(),
  });
  await deleteOwnedBacktestRunCascade(userId, existing.id);

  return true;
};

export const createRun = async (userId: string, data: CreateBacktestRunDto) => {
  let strategyDefaults: { leverage: number; marginMode: MarginMode } | null = null;
  if (data.strategyId) {
    const strategy = await findOwnedStrategyForBacktest(userId, data.strategyId);
    if (!strategy) return null;

    const config = (strategy.config ?? {}) as { additional?: { marginMode?: unknown } };
    strategyDefaults = {
      leverage: strategy.leverage,
      marginMode: config.additional?.marginMode === 'ISOLATED' ? 'ISOLATED' : 'CROSSED',
    };
  }

  const resolved = await resolveSymbolsForRun(userId, data);
  if (!resolved || resolved.symbols.length === 0) return null;

  const requestedMaxCandles = resolveRequestedMaxCandles(data.seedConfig);
  const rangeWindow = resolveBacktestRangeWindow({
    timeframe: data.timeframe,
    startAt: data.startAt,
    endAt: data.endAt,
    requestedMaxCandles,
  });
  const effectiveMaxCandles = computeAdaptiveMaxCandles(
    data.timeframe,
    resolved.symbols.length,
    requestedMaxCandles,
  );

  const created = await createBacktestRun({
    userId,
    name: data.name,
    symbol: resolved.symbols[0],
    timeframe: data.timeframe,
    strategyId: data.strategyId,
    seedConfig: {
      ...(typeof data.seedConfig === 'object' && data.seedConfig ? data.seedConfig : {}),
      initialBalance:
        typeof data.seedConfig === 'object' &&
        data.seedConfig &&
        typeof (data.seedConfig as { initialBalance?: unknown }).initialBalance === 'number'
          ? (data.seedConfig as { initialBalance: number }).initialBalance
          : 10_000,
      symbols: resolved.symbols,
      exchange: resolved.exchange,
      marketType: resolved.marketType,
      baseCurrency: resolved.baseCurrency,
      marketUniverseId: resolved.marketUniverseId,
      leverage: resolved.marketType === 'SPOT' ? 1 : (strategyDefaults?.leverage ?? 1),
      marginMode: resolved.marketType === 'SPOT' ? 'NONE' : (strategyDefaults?.marginMode ?? 'CROSSED'),
      startAt: rangeWindow.startAt.toISOString(),
      endAt: rangeWindow.endAt.toISOString(),
      rangeSource: rangeWindow.source,
      requestedMaxCandles: requestedMaxCandles ?? null,
      effectiveMaxCandles,
      // Backward compatibility for older readers expecting this field.
      maxCandles: effectiveMaxCandles,
      executionMode: 'interleaved_multi_market_portfolio_clock',
    },
    notes: data.notes,
    status: 'PENDING',
  });
  const pendingLifecycle = buildRunLifecyclePayload({
    status: 'PENDING',
    reportReady: false,
    generatedAt: null,
  });
  await upsertBacktestReportForRun({
    backtestRunId: created.id,
    create: {
      userId,
      backtestRunId: created.id,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: null,
      netPnl: null,
      grossProfit: null,
      grossLoss: null,
      maxDrawdown: null,
      sharpe: null,
      metrics: {
        runLifecycle: pendingLifecycle,
      },
    },
    update: {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: null,
      netPnl: null,
      grossProfit: null,
      grossLoss: null,
      maxDrawdown: null,
      sharpe: null,
      metrics: {
        runLifecycle: pendingLifecycle,
      },
    },
  });

  backtestRunQueue.enqueue(created.id);

  return created;
};

export const listRunTrades = async (
  userId: string,
  runId: string,
  query: ListBacktestTradesQuery,
) => {
  const run = await findOwnedBacktestRunId(userId, runId);
  if (!run) return null;

  return listOwnedBacktestTrades(userId, runId, query);
};

export const getRunReport = async (userId: string, runId: string) => {
  const run = await findOwnedBacktestRun(userId, runId);
  if (!run) return undefined;

  const report = await findOwnedBacktestReport(userId, runId);
  if (!report) {
    const degraded = isTerminalBacktestStatus(run.status);
    return {
      id: `synthetic-${run.id}`,
      userId: run.userId,
      backtestRunId: run.id,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: null,
      netPnl: null,
      grossProfit: null,
      grossLoss: null,
      maxDrawdown: null,
      sharpe: null,
      metrics: {
        runLifecycle: buildRunLifecyclePayload({
          status: run.status,
          reportReady: false,
          degraded,
          reason: degraded ? 'report_missing_after_terminal_run' : 'report_pending',
        }),
      },
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
    };
  }

  const reportMetrics = asRecord(report.metrics) ?? {};
  const reportLifecycle = asRecord(reportMetrics.runLifecycle);
  const explicitReportReady =
    typeof reportLifecycle?.reportReady === 'boolean' ? reportLifecycle.reportReady : null;
  const reportReady = explicitReportReady ?? isTerminalBacktestStatus(run.status);
  const degraded = !reportReady && isTerminalBacktestStatus(run.status);

  return {
    ...report,
    metrics: {
      ...reportMetrics,
      runLifecycle: buildRunLifecyclePayload({
        status: run.status,
        reportReady,
        generatedAt: reportReady ? report.updatedAt.toISOString() : null,
        degraded,
        reason: degraded ? 'report_missing_after_terminal_run' : undefined,
      }),
    },
  };
};

export const getRunTimeline = async (
  userId: string,
  runId: string,
  query: GetBacktestTimelineQuery,
) => {
  const run = await findOwnedBacktestRunTimelineSeed(userId, runId);
  if (!run) return null;

  const seed = ((run.seedConfig ?? {}) as Record<string, unknown>) ?? {};
  const runSymbols = Array.isArray(seed.symbols)
    ? normalizeSymbols(seed.symbols as string[])
    : [];
  const exchange = (Object.values(Exchange) as string[]).includes(String(seed.exchange))
    ? (seed.exchange as Exchange)
    : Exchange.BINANCE;
  const marketType = (seed.marketType === 'SPOT' ? 'SPOT' : 'FUTURES') as MarketType;
  const maxCandles = resolveEffectiveMaxCandlesFromSeed({
    seed,
    timeframe: run.timeframe,
    symbolCount: runSymbols.length > 0 ? runSymbols.length : 1,
  });

  const symbol = normalizeSymbol(query.symbol);
  if (runSymbols.length > 0 && !runSymbols.includes(symbol)) {
    return null;
  }
  const strategy = run.strategyId
    ? await findOwnedStrategySignalConfig(userId, run.strategyId)
    : null;
  const strategyConfig = (strategy?.config as Record<string, unknown> | undefined) ?? null;
  const indicatorSpecs = parseStrategyIndicators(strategyConfig);
  const indicatorWarmupCandles = indicatorSpecs.reduce((maxPeriod, spec) => Math.max(maxPeriod, spec.period), 0);

  const replaySymbols = resolveReplaySymbolsForTimeline({
    runSymbols,
    requestedSymbol: symbol,
    replayContext: query.replayContext,
  });
  const liveProgress = (seed.liveProgress ?? {}) as {
    currentCandleTime?: string | null;
  };
  const configuredRangeStartRaw =
    typeof seed.startAt === 'string' ? Date.parse(seed.startAt) : Number.NaN;
  const configuredRangeEndRaw =
    typeof seed.endAt === 'string' ? Date.parse(seed.endAt) : Number.NaN;
  const timelineEndTimeMs = resolveTimelineEndTimeMs({
    runStatus: run.status,
    finishedAt: run.finishedAt,
    liveProgressCurrentCandleTime: liveProgress.currentCandleTime,
    configuredRangeEndTime: typeof seed.endAt === 'string' ? seed.endAt : null,
  });
  const timelineStartTimeMs =
    Number.isFinite(configuredRangeStartRaw) &&
    Number.isFinite(configuredRangeEndRaw) &&
    configuredRangeStartRaw < configuredRangeEndRaw
      ? configuredRangeStartRaw
      : undefined;
  const candlesBySymbol = new Map<string, KlineCandle[]>();
  const supplementalBySymbol = new Map<string, SupplementalSeries>();
  for (const replaySymbol of replaySymbols) {
    candlesBySymbol.set(
      replaySymbol,
      await fetchKlines(
        exchange,
        replaySymbol,
        run.timeframe,
        marketType,
        maxCandles + indicatorWarmupCandles,
        timelineEndTimeMs,
        timelineStartTimeMs,
      ),
    );
    supplementalBySymbol.set(
      replaySymbol,
      await fetchSupplementalSeries(
        exchange,
        replaySymbol,
        run.timeframe,
        marketType,
        maxCandles + indicatorWarmupCandles,
        timelineEndTimeMs,
        timelineStartTimeMs,
      ),
    );
  }
  const visibleStartBySymbol = new Map<string, number>();
  for (const replaySymbol of replaySymbols) {
    const symbolCandles = candlesBySymbol.get(replaySymbol) ?? [];
    visibleStartBySymbol.set(replaySymbol, Math.max(0, symbolCandles.length - maxCandles));
  }
  const fullCandles = candlesBySymbol.get(symbol) ?? [];
  const visibleStart = visibleStartBySymbol.get(symbol) ?? 0;
  const candles = fullCandles.slice(visibleStart);
  const supplemental = supplementalBySymbol.get(symbol) ?? { fundingRates: [], openInterest: [], orderBook: [] };
  const total = candles.length;
  const requestedCursor = clamp(query.cursor, 0, total);
  const start =
    requestedCursor >= total && total > 0
      ? Math.max(0, total - query.chunkSize)
      : requestedCursor;
  const end = clamp(start + query.chunkSize, 0, total);
  const chunk = candles.slice(start, end);

  const strategyWalletRisk = normalizeWalletRiskPercent(strategy?.walletRisk ?? 1, 1);
  const indicatorSeries = query.includeIndicators
    ? buildIndicatorSeries(fullCandles, indicatorSpecs, supplemental).map((series) => ({
      key: series.key,
      name: series.name,
      period: series.period,
      panel: series.panel,
      points: series.values
        .slice(visibleStart + start, visibleStart + end)
        .map((value, index) => ({
          candleIndex: start + index,
          value,
        })),
    }))
    : [];

  const leverageCandidate = Number((seed as { leverage?: unknown }).leverage);
  const leverage = Number.isFinite(leverageCandidate) ? leverageCandidate : 1;
  const marginMode = seed.marginMode === 'ISOLATED' ? 'ISOLATED' : (seed.marginMode === 'CROSSED' ? 'CROSSED' : 'NONE');
  const replay = simulateInterleavedPortfolio({
    symbols: replaySymbols,
    candlesBySymbol,
    supplementalBySymbol,
    analysisStartIndexBySymbol: new Map(
      replaySymbols.map((replaySymbol) => {
        const symbolVisibleStart = visibleStartBySymbol.get(replaySymbol) ?? 0;
        return [replaySymbol, Math.max(1, symbolVisibleStart)];
      }),
    ),
    marketType,
    leverage: marketType === 'SPOT' ? 1 : leverage,
    marginMode,
    strategyConfig,
    fillModelConfig: {
      feeRate:
        typeof (seed as { feeRate?: unknown }).feeRate === 'number'
          ? Number((seed as { feeRate?: unknown }).feeRate)
          : undefined,
      slippageRate:
        typeof (seed as { slippageRate?: unknown }).slippageRate === 'number'
          ? Number((seed as { slippageRate?: unknown }).slippageRate)
          : undefined,
      fundingRate:
        typeof (seed as { fundingRate?: unknown }).fundingRate === 'number'
          ? Number((seed as { fundingRate?: unknown }).fundingRate)
          : undefined,
    },
    walletRiskPercent: strategyWalletRisk,
    initialBalance:
      typeof (seed as { initialBalance?: unknown }).initialBalance === 'number'
        ? Number((seed as { initialBalance?: number }).initialBalance)
        : 10_000,
  });
  const symbolReplay = replay.perSymbol[symbol] ?? {
    trades: [],
    liquidations: 0,
    events: [],
    eventCounts: {
      ENTRY: 0,
      EXIT: 0,
      DCA: 0,
      TP: 0,
      TTP: 0,
      SL: 0,
      TRAILING: 0,
      LIQUIDATION: 0,
    } as Record<ReplayEventType, number>,
    decisionTrace: [],
  };

  const chunkGlobalStart = visibleStart + start;
  const chunkGlobalEnd = visibleStart + end;
  const events = (query.includeEvents
    ? symbolReplay.events.filter(
      (event) => event.candleIndex >= chunkGlobalStart && event.candleIndex < chunkGlobalEnd,
    )
    : []
  ).map((event) => {
      const eventId = `${runId}_${symbol}_${event.tradeSequence}_${event.type}_${event.candleIndex}`;
      const isCloseLike = event.type !== 'ENTRY' && event.type !== 'DCA';
      return {
        id: eventId,
        tradeId: `${runId}_${symbol}_${event.tradeSequence}`,
        type: event.type,
        side: event.side,
        timestamp: event.timestamp.toISOString(),
        price: event.price,
        pnl: event.pnl,
        candleIndex: event.candleIndex - visibleStart,
        reason: isCloseLike ? event.type : null,
      };
    });

  const liveProgressPlayback = (seed.liveProgress ?? {}) as {
    currentSymbol?: string | null;
    currentCandleIndex?: number;
    totalCandlesForSymbol?: number;
  };
  const shouldExposePlaybackCursor = run.status === 'PENDING' || run.status === 'RUNNING';
  const playbackCursorRelative =
    typeof liveProgressPlayback.currentCandleIndex === 'number'
      ? liveProgressPlayback.currentCandleIndex - visibleStart
      : null;

  return {
    runId,
    symbol,
    timeframe: run.timeframe,
    marketType,
    exchange,
    status: run.status,
    replayContext: query.replayContext,
    cursor: start,
    previousCursor: start > 0 ? Math.max(0, start - query.chunkSize) : null,
    nextCursor: end < total ? end : null,
    totalCandles: total,
    candles: query.includeCandles
      ? chunk.map((candle, index) => ({
        candleIndex: start + index,
        openTime: new Date(candle.openTime).toISOString(),
        closeTime: new Date(candle.closeTime).toISOString(),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      }))
      : [],
    events,
    indicatorSeries: query.includeIndicators ? indicatorSeries : [],
    parityDiagnostics: {
      strategyRulesActive: Boolean(
        parseStrategySignalRules(strategyConfig),
      ),
      eventCounts: symbolReplay.eventCounts,
      mismatchCount: symbolReplay.decisionTrace.filter((entry) => entry.mismatchReason !== null).length,
      mismatchSamples: symbolReplay.decisionTrace
        .filter(
          (entry) =>
            entry.mismatchReason !== null &&
            entry.candleIndex >= chunkGlobalStart &&
            entry.candleIndex < chunkGlobalEnd,
        )
        .slice(0, 50)
        .map((entry) => ({
          timestamp: entry.timestamp.toISOString(),
          side: entry.side,
          trigger: entry.trigger,
          mismatchReason: entry.mismatchReason,
        })),
      fundingPoints: supplemental.fundingRates.length,
      openInterestPoints: supplemental.openInterest.length,
      orderBookPoints: supplemental.orderBook.length,
    },
    positionStats: {
      closedOnFinalCandleCount: symbolReplay.trades.filter((trade) => trade.exitReason === 'FINAL_CANDLE').length,
      liquidationsCount: symbolReplay.trades.filter((trade) => trade.exitReason === 'LIQUIDATION' || trade.liquidated).length,
      tradeCount: symbolReplay.trades.length,
    },
    marketInputs: {
      fundingRates: supplemental.fundingRates
        .map((point) => {
          const candleIndex = candles.findIndex((candle) => candle.openTime >= point.timestamp);
          if (candleIndex < start || candleIndex >= end || candleIndex < 0) return null;
          return {
            candleIndex,
            timestamp: new Date(point.timestamp).toISOString(),
            value: point.fundingRate,
          };
        })
        .filter((point): point is { candleIndex: number; timestamp: string; value: number } => Boolean(point)),
      openInterest: supplemental.openInterest
        .map((point) => {
          const candleIndex = candles.findIndex((candle) => candle.openTime >= point.timestamp);
          if (candleIndex < start || candleIndex >= end || candleIndex < 0) return null;
          return {
            candleIndex,
            timestamp: new Date(point.timestamp).toISOString(),
            value: point.openInterest,
          };
        })
        .filter((point): point is { candleIndex: number; timestamp: string; value: number } => Boolean(point)),
      orderBook: supplemental.orderBook
        .map((point) => {
          const candleIndex = candles.findIndex((candle) => candle.openTime >= point.timestamp);
          if (candleIndex < start || candleIndex >= end || candleIndex < 0) return null;
          return {
            candleIndex,
            timestamp: new Date(point.timestamp).toISOString(),
            imbalance: point.imbalance,
            spreadBps: point.spreadBps,
            depthRatio: point.depthRatio,
          };
        })
        .filter((point): point is {
          candleIndex: number;
          timestamp: string;
          imbalance: number;
          spreadBps: number;
          depthRatio: number;
        } => Boolean(point)),
    },
        supportedEventTypes: ['ENTRY', 'EXIT', 'DCA', 'TP', 'TTP', 'SL', 'TRAILING', 'LIQUIDATION'],
    unsupportedEventTypes: [],
    playbackCursor:
      shouldExposePlaybackCursor &&
      liveProgressPlayback.currentSymbol === symbol &&
      typeof playbackCursorRelative === 'number' &&
      playbackCursorRelative >= 0
        ? playbackCursorRelative
        : null,
  };
};
