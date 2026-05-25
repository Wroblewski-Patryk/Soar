import { buildSignalConditionSummary } from './runtimeSignalConditionSummary.service';
import { SignalConditionLine } from './runtimeSignalConditionLines.service';
import { buildStrategySignalAnalysis } from '../engine/strategySignalAnalysis';
import { RuntimeCandle } from '../engine/runtimeSignalMarketDataGateway';
import { StrategySignalDerivativesSeries } from '../engine/strategySignalEvaluator';
import {
  resolveRuntimeMarketTruthState,
  RuntimeMarketTruthState,
  RuntimeSignalContextSource,
} from './runtimeMarketTruthState.service';

type RuntimeSymbolStatRow = {
  id: string;
  symbol: string;
  totalSignals: number;
  longEntries: number;
  shortEntries: number;
  exits: number;
  dcaCount: number;
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  realizedPnl: number;
  grossProfit: number;
  grossLoss: number;
  feesPaid: number;
  openPositionCount: number;
  openPositionQty: number;
  lastPrice: number | null;
  lastSignalAt: Date | null;
  lastTradeAt: Date | null;
  snapshotAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type RuntimeSymbolSignal = {
  signalDirection: 'LONG' | 'SHORT' | 'EXIT' | null;
  eventAt: Date | null;
  message: string | null;
  mergeReason: string | null;
  strategyId: string | null;
  scoreLong: number | null;
  scoreShort: number | null;
  analysisByStrategy: Record<
    string,
    { conditionLines: SignalConditionLine[] | null; indicatorSummary: string | null }
  >;
};

type RuntimeStrategyProjection = {
  name: string;
  interval: string;
  config: Record<string, unknown> | null;
  updatedAt?: Date | null;
};

type RuntimeSymbolAggregateSummary = {
  totalSignals: number | null;
  longEntries: number | null;
  shortEntries: number | null;
  exits: number | null;
  dcaCount: number | null;
  closedTrades: number | null;
  winningTrades: number | null;
  losingTrades: number | null;
  realizedPnl: number | null;
  grossProfit: number | null;
  grossLoss: number | null;
  feesPaid: number | null;
};

const hasConcreteConditionValue = (
  lines: Array<{ value: string }> | null | undefined,
) =>
  Array.isArray(lines) &&
  lines.some((line) => {
    const value = line.value.trim().toLowerCase();
    return value.length > 0 && value !== 'n/a';
  });

const isReplaceableNoVoteReason = (reason: string | null | undefined) =>
  reason === 'No votes' || reason === 'Weak consensus' || reason === 'Tie';

const resolveSignalConditionActive = (
  lines: Array<{ scope: string; matched?: boolean | null }> | null | undefined,
  scope: 'LONG' | 'SHORT'
) => lines?.some((line) => line.scope === scope && line.matched === true) === true;

export const composeRuntimeSymbolStatsReadModel = (params: {
  userId: string;
  botId: string;
  sessionId: string;
  sessionStartedAt: Date;
  sessionCreatedAt: Date;
  sessionUpdatedAt: Date;
  symbols: string[];
  statBySymbol: Map<string, RuntimeSymbolStatRow>;
  aggregateSummary: RuntimeSymbolAggregateSummary;
  openPositionCountBySymbol: Map<string, number>;
  openPositionQtyBySymbol: Map<string, number>;
  unrealizedPnlBySymbol: Map<string, number>;
  aggregateLiveSummary?: {
    openPositionCount: number;
    openPositionQty: number;
    unrealizedPnl: number;
  };
  lastPriceBySymbol: Map<string, number | null>;
  latestTradeAtBySymbol: Map<string, Date | null>;
  latestSignalBySymbol: Map<string, RuntimeSymbolSignal>;
  configuredStrategyBySymbol: Map<string, string>;
  strategiesById: Map<string, RuntimeStrategyProjection>;
  marketSnapshotsBySeries: Map<
    string,
    { candles: RuntimeCandle[]; derivatives?: StrategySignalDerivativesSeries }
  >;
  preferConfiguredStrategyContext?: boolean;
}) => {
  const items = params.symbols.map((symbol) => {
    const stat = params.statBySymbol.get(symbol) ?? null;
    const openCount = params.openPositionCountBySymbol.get(symbol);
    const openQty = params.openPositionQtyBySymbol.get(symbol);
    const unrealizedPnl = params.unrealizedPnlBySymbol.get(symbol) ?? 0;
    const latestSignal = params.latestSignalBySymbol.get(symbol);
    const lastPrice = params.lastPriceBySymbol.get(symbol) ?? null;
    const fallbackStrategyId = params.configuredStrategyBySymbol.get(symbol) ?? null;
    const signalStrategyId = latestSignal?.strategyId ?? null;
    const configuredStrategy =
      fallbackStrategyId != null ? params.strategiesById.get(fallbackStrategyId) ?? null : null;
    const signalStrategy =
      signalStrategyId != null ? params.strategiesById.get(signalStrategyId) ?? null : null;
    const latestSignalAtMs = latestSignal?.eventAt?.getTime() ?? null;
    const sessionStartedAtMs = params.sessionStartedAt.getTime();
    const configuredStrategyUpdatedAtMs = configuredStrategy?.updatedAt?.getTime() ?? 0;
    const signalStrategyUpdatedAtMs = signalStrategy?.updatedAt?.getTime() ?? 0;
    const signalUsesSupersededStrategy =
      signalStrategyId != null &&
      fallbackStrategyId != null &&
      signalStrategyId !== fallbackStrategyId &&
      (params.preferConfiguredStrategyContext === true ||
        (latestSignalAtMs != null && latestSignalAtMs < sessionStartedAtMs) ||
        configuredStrategyUpdatedAtMs > signalStrategyUpdatedAtMs);
    const signalUsesEditedStrategyConfig =
      signalStrategyId != null &&
      fallbackStrategyId != null &&
      signalStrategyId === fallbackStrategyId &&
      latestSignalAtMs != null &&
      configuredStrategyUpdatedAtMs > 0 &&
      latestSignalAtMs < configuredStrategyUpdatedAtMs;
    const signalPredatesCurrentContext =
      signalUsesSupersededStrategy || signalUsesEditedStrategyConfig;
    const effectiveLatestSignal = signalPredatesCurrentContext ? undefined : latestSignal;
    const effectiveSignalStrategyId = signalPredatesCurrentContext ? null : signalStrategyId;
    const signalContextSource: RuntimeSignalContextSource =
      effectiveLatestSignal?.signalDirection != null
        ? 'latest_signal'
        : effectiveLatestSignal != null
          ? 'latest_decision'
          : fallbackStrategyId != null
          ? 'configured_fallback'
          : 'unresolved';
    const effectiveSignalStrategy =
      effectiveSignalStrategyId != null ? params.strategiesById.get(effectiveSignalStrategyId) ?? null : null;
    const effectiveContextStrategyId = effectiveSignalStrategyId ?? fallbackStrategyId;
    const effectiveContextStrategy =
      effectiveSignalStrategyId != null ? effectiveSignalStrategy : configuredStrategy;
    const signalSeriesKey =
      effectiveContextStrategy?.interval != null
        ? `${symbol}|${effectiveContextStrategy.interval.trim().toLowerCase()}`
        : null;
    const marketSnapshot = signalSeriesKey
      ? params.marketSnapshotsBySeries.get(signalSeriesKey) ?? null
      : null;
    const effectiveSignalDirection = effectiveLatestSignal?.signalDirection ?? null;
    const signalConditionSummary = buildSignalConditionSummary(
      effectiveContextStrategy?.config ?? null,
      effectiveSignalDirection
    );
    const signalAnalysis =
      effectiveContextStrategyId != null
        ? effectiveLatestSignal?.analysisByStrategy?.[effectiveContextStrategyId] ?? null
        : null;
    const snapshotAnalysis = buildStrategySignalAnalysis({
      strategyConfig: effectiveContextStrategy?.config ?? null,
      candles: marketSnapshot?.candles ?? [],
      decisionIndex: marketSnapshot?.candles.length ? marketSnapshot.candles.length - 1 : null,
      derivatives: marketSnapshot?.derivatives,
    });
    const conditionLineSource =
      signalAnalysis?.conditionLines && hasConcreteConditionValue(signalAnalysis.conditionLines)
        ? signalAnalysis
        : hasConcreteConditionValue(snapshotAnalysis.conditionLines)
          ? snapshotAnalysis
          : signalAnalysis ?? snapshotAnalysis;
    const snapshotReplacesNoVoteDecision =
      conditionLineSource === snapshotAnalysis &&
      hasConcreteConditionValue(snapshotAnalysis.conditionLines) &&
      effectiveLatestSignal?.signalDirection == null &&
      isReplaceableNoVoteReason(effectiveLatestSignal?.mergeReason);
    const displaySignalContextSource: RuntimeSignalContextSource =
      snapshotReplacesNoVoteDecision ? 'configured_fallback' : signalContextSource;
    const indicatorSummary =
      conditionLineSource === signalAnalysis
        ? signalAnalysis?.indicatorSummary ?? snapshotAnalysis.indicatorSummary
        : snapshotAnalysis.indicatorSummary ?? signalAnalysis?.indicatorSummary ?? null;
    const runtimeMarketState: RuntimeMarketTruthState = resolveRuntimeMarketTruthState({
      openPositionCount: openCount ?? stat?.openPositionCount ?? 0,
      signalContextSource: displaySignalContextSource,
      signalDirection: effectiveSignalDirection,
    });
    const signalScoreSummary =
      latestSignal?.scoreLong != null || latestSignal?.scoreShort != null
        ? {
            longScore: latestSignal?.scoreLong ?? 0,
            shortScore: latestSignal?.scoreShort ?? 0,
          }
        : null;

    return {
      id: stat?.id ?? `virtual-${params.sessionId}-${symbol}`,
      userId: params.userId,
      botId: params.botId,
      sessionId: params.sessionId,
      symbol,
      totalSignals: stat?.totalSignals ?? 0,
      longEntries: stat?.longEntries ?? 0,
      shortEntries: stat?.shortEntries ?? 0,
      exits: stat?.exits ?? 0,
      dcaCount: stat?.dcaCount ?? 0,
      closedTrades: stat?.closedTrades ?? 0,
      winningTrades: stat?.winningTrades ?? 0,
      losingTrades: stat?.losingTrades ?? 0,
      realizedPnl: stat?.realizedPnl ?? 0,
      grossProfit: stat?.grossProfit ?? 0,
      grossLoss: stat?.grossLoss ?? 0,
      feesPaid: stat?.feesPaid ?? 0,
      openPositionCount: openCount ?? stat?.openPositionCount ?? 0,
      openPositionQty: openQty ?? stat?.openPositionQty ?? 0,
      unrealizedPnl,
      lastPrice,
      lastSignalAt: stat?.lastSignalAt ?? null,
      lastTradeAt: stat?.lastTradeAt ?? params.latestTradeAtBySymbol.get(symbol) ?? null,
      lastSignalDirection: effectiveSignalDirection,
      lastSignalDecisionAt: snapshotReplacesNoVoteDecision
        ? stat?.lastSignalAt ?? null
        : effectiveLatestSignal?.eventAt ?? stat?.lastSignalAt ?? null,
      lastSignalMessage: snapshotReplacesNoVoteDecision ? null : effectiveLatestSignal?.message ?? null,
      lastSignalReason: snapshotReplacesNoVoteDecision ? null : effectiveLatestSignal?.mergeReason ?? null,
      lastSignalStrategyId: effectiveSignalStrategyId,
      lastSignalStrategyName: effectiveSignalStrategy?.name ?? null,
      lastSignalContextSource: displaySignalContextSource,
      runtimeMarketState,
      configuredStrategyId: fallbackStrategyId,
      configuredStrategyName: configuredStrategy?.name ?? null,
      lastSignalConditionSummary: signalConditionSummary,
      lastSignalIndicatorSummary: indicatorSummary,
      lastSignalConditionLines: conditionLineSource.conditionLines,
      lastSignalConditionActive: {
        long: resolveSignalConditionActive(conditionLineSource.conditionLines, 'LONG'),
        short: resolveSignalConditionActive(conditionLineSource.conditionLines, 'SHORT'),
      },
      lastSignalScoreSummary: signalScoreSummary,
      snapshotAt: stat?.snapshotAt ?? params.sessionStartedAt,
      createdAt: stat?.createdAt ?? params.sessionCreatedAt,
      updatedAt: stat?.updatedAt ?? params.sessionUpdatedAt,
    };
  });

  const summaryUnrealizedPnl =
    params.aggregateLiveSummary?.unrealizedPnl ??
    items.reduce((acc, item) => acc + (Number.isFinite(item.unrealizedPnl) ? item.unrealizedPnl : 0), 0);
  const summaryOpenPositionCount =
    params.aggregateLiveSummary?.openPositionCount ??
    items.reduce((acc, item) => acc + item.openPositionCount, 0);
  const summaryOpenPositionQty =
    params.aggregateLiveSummary?.openPositionQty ??
    items.reduce((acc, item) => acc + item.openPositionQty, 0);
  const summaryRealizedPnl = params.aggregateSummary.realizedPnl ?? 0;

  return {
    items,
    summary: {
      totalSignals: params.aggregateSummary.totalSignals ?? 0,
      longEntries: params.aggregateSummary.longEntries ?? 0,
      shortEntries: params.aggregateSummary.shortEntries ?? 0,
      exits: params.aggregateSummary.exits ?? 0,
      dcaCount: params.aggregateSummary.dcaCount ?? 0,
      closedTrades: params.aggregateSummary.closedTrades ?? 0,
      winningTrades: params.aggregateSummary.winningTrades ?? 0,
      losingTrades: params.aggregateSummary.losingTrades ?? 0,
      realizedPnl: summaryRealizedPnl,
      unrealizedPnl: summaryUnrealizedPnl,
      totalPnl: summaryRealizedPnl + summaryUnrealizedPnl,
      grossProfit: params.aggregateSummary.grossProfit ?? 0,
      grossLoss: params.aggregateSummary.grossLoss ?? 0,
      feesPaid: params.aggregateSummary.feesPaid ?? 0,
      openPositionCount: summaryOpenPositionCount,
      openPositionQty: summaryOpenPositionQty,
    },
  };
};
