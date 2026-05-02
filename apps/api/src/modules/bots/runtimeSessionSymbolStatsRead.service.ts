import { alignTimedNumericPointsToCandles } from '../engine/sharedDerivativesSeries';
import { StrategySignalDerivativesSeries } from '../engine/strategySignalEvaluator';
import { runtimeSignalLoop } from '../engine/runtimeSignalLoop.service';
import { getRuntimeTicker } from '../engine/runtimeTickerStore';
import {
  RuntimeCandle,
  mergeRuntimeSignalCandles,
} from '../engine/runtimeSignalMarketDataGateway';
import { normalizeSymbol } from '../../lib/symbols';
import { ListBotRuntimeSymbolStatsQueryDto } from './bots.types';
import {
  parseSignalConditionLines,
  SignalConditionLine,
} from './runtimeSignalConditionLines.service';
import { normalizeSymbols } from './runtimeSymbolUniverse.service';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from './runtimeSymbolCatalogResolver.service';
import {
  asRecord,
  humanizeMergeReason,
  humanizeRuntimeBlockReason,
  toFiniteNumber,
} from './runtimeSignalStatsFormatting.service';
import {
  fetchFallbackFundingRateHistory,
  fetchFallbackFundingRateSnapshot,
  fetchFallbackKlines,
  fetchFallbackOpenInterestHistory,
  fetchFallbackOpenInterestSnapshot,
  fetchFallbackOrderBookSnapshot,
} from './runtimeMarketDataFallback.service';
import { getOwnedBotRuntimeSession, resolveSessionWindowEnd } from './botOwnership.service';
import {
  buildConfiguredStrategyBySymbol,
  buildLatestTradeAtBySymbol,
  buildOpenPositionSymbolMetrics,
} from './runtimeSymbolStatsEnrichment.service';
import { composeRuntimeSymbolStatsReadModel } from './runtimeSymbolStatsReadModel.service';
import {
  getRuntimeSymbolLiveRows,
  getRuntimeSymbolStatsBaseData,
  listMarketCandles,
  listStrategiesByIds,
} from './botsRuntimeRead.repository';
import { resolvePreferredRuntimeOrExchangeSyncedPrice } from './runtimeExchangeSyncedPositionPrice';

const runtimeSignalReadSnapshotMinCandlesRaw = Number.parseInt(
  process.env.RUNTIME_SIGNAL_READ_SNAPSHOT_MIN_CANDLES ?? '150',
  10,
);
const runtimeSignalReadSnapshotMinCandles = Number.isFinite(runtimeSignalReadSnapshotMinCandlesRaw)
  ? Math.max(20, runtimeSignalReadSnapshotMinCandlesRaw)
  : 150;

export const mergeRuntimeCandlesForIndicatorRecovery = mergeRuntimeSignalCandles;

const resolveFallbackDerivatives = async (params: {
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
  interval: string;
  candles: RuntimeCandle[];
}): Promise<StrategySignalDerivativesSeries | undefined> => {
  if (params.marketType !== 'FUTURES' || params.candles.length === 0) return undefined;
  const lastCandle = params.candles[params.candles.length - 1];
  const [fundingHistory, fundingSnapshot, openInterestHistory, openInterestSnapshot, orderBookSnapshot] =
    await Promise.all([
      fetchFallbackFundingRateHistory({
        symbol: params.symbol,
        limit: 200,
        endTimeMs: lastCandle.closeTime,
      }),
      fetchFallbackFundingRateSnapshot(params.symbol),
      fetchFallbackOpenInterestHistory({
        symbol: params.symbol,
        interval: params.interval,
        limit: 200,
        endTimeMs: lastCandle.closeTime,
      }),
      fetchFallbackOpenInterestSnapshot(params.symbol),
      fetchFallbackOrderBookSnapshot(params.symbol),
    ]);

  const fundingPoints = fundingHistory.map((item) => ({
    timestamp: item.timestamp,
    value: item.fundingRate,
  }));
  if (fundingSnapshot) {
    fundingPoints.push({
      timestamp: fundingSnapshot.timestamp,
      value: fundingSnapshot.fundingRate,
    });
  }

  const openInterestPoints = openInterestHistory.map((item) => ({
    timestamp: item.timestamp,
    value: item.openInterest,
  }));
  if (openInterestSnapshot) {
    openInterestPoints.push({
      timestamp: openInterestSnapshot.timestamp,
      value: openInterestSnapshot.openInterest,
    });
  }

  return {
    ...(fundingPoints.length > 0
      ? { fundingRate: alignTimedNumericPointsToCandles(params.candles, fundingPoints) }
      : {}),
    ...(openInterestPoints.length > 0
      ? { openInterest: alignTimedNumericPointsToCandles(params.candles, openInterestPoints) }
      : {}),
    ...(orderBookSnapshot
      ? {
          orderBookImbalance: alignTimedNumericPointsToCandles(params.candles, [
            { timestamp: orderBookSnapshot.timestamp, value: orderBookSnapshot.imbalance },
          ]),
          orderBookSpreadBps: alignTimedNumericPointsToCandles(params.candles, [
            { timestamp: orderBookSnapshot.timestamp, value: orderBookSnapshot.spreadBps },
          ]),
          orderBookDepthRatio: alignTimedNumericPointsToCandles(params.candles, [
            { timestamp: orderBookSnapshot.timestamp, value: orderBookSnapshot.depthRatio },
          ]),
        }
      : {}),
  };
};

const loadMarketSnapshot = async (params: {
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
  interval: string;
}): Promise<{ candles: RuntimeCandle[]; derivatives?: StrategySignalDerivativesSeries } | null> => {
  const inMemoryCandles = runtimeSignalLoop.getSeries({
    marketType: params.marketType,
    symbol: params.symbol,
    interval: params.interval,
  });
  const candles =
    inMemoryCandles && inMemoryCandles.length > 0
      ? inMemoryCandles
      : (() => undefined)();

  const runtimeCandles =
    candles ??
    (await listMarketCandles({
      marketType: params.marketType,
      symbol: params.symbol,
      interval: params.interval,
      limit: 300,
    }))
      .map((item) => ({
        openTime: Number(item.openTime),
        closeTime: Number(item.closeTime),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }))
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
      .reverse();

  const fallbackCandles =
    runtimeCandles.length >= runtimeSignalReadSnapshotMinCandles
      ? []
      : await fetchFallbackKlines({
          marketType: params.marketType,
          symbol: params.symbol,
          interval: params.interval,
          limit: 300,
        });
  const resolvedCandles = mergeRuntimeCandlesForIndicatorRecovery(
    runtimeCandles,
    fallbackCandles,
    300,
  );

  if (resolvedCandles.length === 0) return null;

  const fundingRate = runtimeSignalLoop.resolveFundingRateSeriesForCandles({
    marketType: params.marketType,
    symbol: params.symbol,
    candles: resolvedCandles,
  });
  const openInterest = runtimeSignalLoop.resolveOpenInterestSeriesForCandles({
    marketType: params.marketType,
    symbol: params.symbol,
    candles: resolvedCandles,
  });
  const orderBook = runtimeSignalLoop.resolveOrderBookSeriesForCandles({
    marketType: params.marketType,
    symbol: params.symbol,
    candles: resolvedCandles,
  });
  const runtimeDerivatives =
    fundingRate || openInterest || orderBook
      ? {
          ...(fundingRate ? { fundingRate } : {}),
          ...(openInterest ? { openInterest } : {}),
          ...(orderBook
            ? {
                orderBookImbalance: orderBook.orderBookImbalance,
                orderBookSpreadBps: orderBook.orderBookSpreadBps,
                orderBookDepthRatio: orderBook.orderBookDepthRatio,
              }
            : {}),
        }
      : undefined;
  const fallbackDerivatives =
    runtimeDerivatives &&
    (
      runtimeDerivatives.fundingRate?.some((value) => typeof value === 'number') ||
      runtimeDerivatives.openInterest?.some((value) => typeof value === 'number') ||
      runtimeDerivatives.orderBookImbalance?.some((value) => typeof value === 'number') ||
      runtimeDerivatives.orderBookSpreadBps?.some((value) => typeof value === 'number') ||
      runtimeDerivatives.orderBookDepthRatio?.some((value) => typeof value === 'number')
    )
      ? undefined
      : await resolveFallbackDerivatives({
          marketType: params.marketType,
          symbol: params.symbol,
          interval: params.interval,
          candles: resolvedCandles,
        });

  return {
    candles: resolvedCandles,
    ...((runtimeDerivatives ?? fallbackDerivatives)
      ? {
          derivatives: {
            ...(runtimeDerivatives ?? {}),
            ...(fallbackDerivatives ?? {}),
          },
        }
      : {}),
  };
};

export const listBotRuntimeSessionSymbolStats = async (
  userId: string,
  botId: string,
  sessionId: string,
  query: ListBotRuntimeSymbolStatsQueryDto & { preferConfiguredStrategyContext?: boolean }
) => {
  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;

  const normalizedSymbol = normalizeSymbol(query.symbol) || undefined;
  const windowEnd = resolveSessionWindowEnd(session);

  const { items, summary, botContext } = await getRuntimeSymbolStatsBaseData({
    userId,
    botId,
    sessionId,
    normalizedSymbol,
    limit: query.limit,
  });
  const inheritedVenueContext = botContext?.symbolGroup?.marketUniverse ?? null;
  const botExchange = inheritedVenueContext?.exchange ?? 'BINANCE';
  const botMarketType = inheritedVenueContext?.marketType ?? 'FUTURES';

  const catalogSymbolsCache = new Map<string, string[]>();
  const configuredSymbols = normalizeSymbols(
    botContext?.symbolGroup
      ? await resolveEffectiveSymbolGroupSymbolsWithCatalog(botContext.symbolGroup, catalogSymbolsCache)
      : []
  ).slice(0, query.limit);
  const symbols = normalizedSymbol ? [normalizedSymbol] : configuredSymbols;
  const [openPositions, latestTradeBySymbolRows, latestSignalEvents] = symbols.length
    ? await getRuntimeSymbolLiveRows({
        userId,
        botId,
        sessionId,
        symbols,
        windowStart: session.startedAt,
        windowEnd,
      })
    : [[], [], []];

  const lastPriceBySymbol = new Map<string, number | null>(
    items.map((item) => [item.symbol, item.lastPrice])
  );
  const lastPriceObservedAtBySymbol = new Map<string, number | null>(
    items.map((item) => [item.symbol, item.snapshotAt?.getTime() ?? null])
  );
  for (const symbol of symbols) {
    const ticker = getRuntimeTicker(symbol, {
      exchange: botExchange,
      marketType: botMarketType,
    });
    if (ticker && Number.isFinite(ticker.lastPrice)) {
      const tickerObservedAtMs =
        typeof ticker.eventTime === 'number' && Number.isFinite(ticker.eventTime)
          ? ticker.eventTime
          : null;
      const currentObservedAtMs = lastPriceObservedAtBySymbol.get(symbol) ?? null;
      if (
        currentObservedAtMs == null ||
        (tickerObservedAtMs != null && tickerObservedAtMs >= currentObservedAtMs)
      ) {
        lastPriceBySymbol.set(symbol, ticker.lastPrice);
        lastPriceObservedAtBySymbol.set(symbol, tickerObservedAtMs);
      }
    }
  }
  for (const position of openPositions) {
    const preferredLastPrice = resolvePreferredRuntimeOrExchangeSyncedPrice({
      origin: position.origin,
      status: position.status,
      side: position.side,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      unrealizedPnl: position.unrealizedPnl,
      lastExchangeSyncAt: position.lastExchangeSyncAt,
      runtimePriceCandidates: [
        {
          price: lastPriceBySymbol.get(position.symbol) ?? null,
          observedAtMs: lastPriceObservedAtBySymbol.get(position.symbol) ?? null,
        },
      ],
    });
    if (preferredLastPrice != null) {
      const currentObservedAtMs = lastPriceObservedAtBySymbol.get(position.symbol) ?? null;
      const exchangeObservedAtMs = position.lastExchangeSyncAt?.getTime() ?? null;
      lastPriceBySymbol.set(position.symbol, preferredLastPrice);
      lastPriceObservedAtBySymbol.set(
        position.symbol,
        currentObservedAtMs == null
          ? exchangeObservedAtMs
          : exchangeObservedAtMs == null
            ? currentObservedAtMs
            : Math.max(currentObservedAtMs, exchangeObservedAtMs)
      );
    }
  }
  const latestTradeAtBySymbol = buildLatestTradeAtBySymbol(latestTradeBySymbolRows);
  const latestSignalBySymbol = new Map<
    string,
    {
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
    }
  >();
  const strategiesById = new Map<
    string,
    { name: string; interval: string; config: Record<string, unknown> | null; updatedAt?: Date | null }
  >();
  if (botContext?.strategy) {
    const strategy = botContext.strategy;
    strategiesById.set(strategy.id, {
      name: strategy.name,
      interval: strategy.interval,
      config: asRecord(strategy.config) ?? null,
      updatedAt: strategy.updatedAt ?? null,
    });
  }
  const latestSignalStrategyIds = new Set<string>();
  for (const event of latestSignalEvents) {
    if (!event.symbol || latestSignalBySymbol.has(event.symbol)) continue;
    const payload = asRecord(event.payload);
    const merge = asRecord(payload?.merge);
    const scores = asRecord(merge?.scores);
    const winner = asRecord(merge?.winner);
    const analysis = asRecord(payload?.analysis);
    const byStrategy = asRecord(analysis?.byStrategy);
    const parsedAnalysisByStrategy: Record<
      string,
      { conditionLines: SignalConditionLine[] | null; indicatorSummary: string | null }
    > = {};
    if (byStrategy) {
      for (const [strategyKey, rawStats] of Object.entries(byStrategy)) {
        if (typeof strategyKey !== 'string' || strategyKey.trim().length === 0) continue;
        const strategyStats = asRecord(rawStats);
        if (!strategyStats) continue;
        parsedAnalysisByStrategy[strategyKey.trim()] = {
          conditionLines: parseSignalConditionLines(strategyStats.conditionLines),
          indicatorSummary:
            typeof strategyStats.indicatorSummary === 'string' &&
            strategyStats.indicatorSummary.trim().length > 0
              ? strategyStats.indicatorSummary.trim()
              : null,
        };
      }
    }
    const mergeReasonRaw =
      typeof merge?.reason === 'string' && merge.reason.trim().length > 0
        ? merge.reason.trim()
        : null;
    const blockReasonRaw =
      typeof payload?.reason === 'string' && payload.reason.trim().length > 0
        ? payload.reason.trim()
        : typeof payload?.constraintReason === 'string' && payload.constraintReason.trim().length > 0
          ? payload.constraintReason.trim()
          : null;
    const winnerStrategyId =
      typeof winner?.strategyId === 'string' && winner.strategyId.trim().length > 0
        ? winner.strategyId.trim()
        : null;
    const strategyId =
      (typeof event.strategyId === 'string' && event.strategyId.trim().length > 0
        ? event.strategyId.trim()
        : null) ?? winnerStrategyId;
    if (strategyId) latestSignalStrategyIds.add(strategyId);
    latestSignalBySymbol.set(event.symbol, {
      signalDirection:
        event.eventType === 'PRETRADE_BLOCKED'
          ? null
          : event.signalDirection === 'LONG' ||
              event.signalDirection === 'SHORT' ||
              event.signalDirection === 'EXIT'
            ? event.signalDirection
            : null,
      eventAt: event.eventAt ?? null,
      message: event.message ?? null,
      mergeReason:
        humanizeRuntimeBlockReason(blockReasonRaw) ?? humanizeMergeReason(mergeReasonRaw),
      strategyId,
      scoreLong: toFiniteNumber(scores?.longScore),
      scoreShort: toFiniteNumber(scores?.shortScore),
      analysisByStrategy: parsedAnalysisByStrategy,
    });
  }
  const missingStrategyIds = [...latestSignalStrategyIds].filter(
    (strategyId) => !strategiesById.has(strategyId),
  );
  if (missingStrategyIds.length > 0) {
    const signalStrategies = await listStrategiesByIds({
      userId,
      strategyIds: missingStrategyIds,
    });
    for (const strategy of signalStrategies) {
      strategiesById.set(strategy.id, {
        name: strategy.name,
        interval: strategy.interval,
        config: asRecord(strategy.config) ?? null,
        updatedAt: strategy.updatedAt ?? null,
      });
    }
  }

  const configuredStrategyBySymbol = buildConfiguredStrategyBySymbol({
    configuredStrategyAssignments:
      botContext?.strategyId != null
        ? [
            {
              strategyId: botContext.strategyId,
              symbols: configuredSymbols,
            },
          ]
        : [],
    symbols,
    strategiesById,
  });

  const strategySeriesKeys = new Map<string, { symbol: string; interval: string }>();
  for (const symbol of symbols) {
    const latestSignal = latestSignalBySymbol.get(symbol);
    const configuredStrategyId = configuredStrategyBySymbol.get(symbol) ?? null;
    const strategyId =
      query.preferConfiguredStrategyContext === true
        ? configuredStrategyId ?? latestSignal?.strategyId ?? null
        : latestSignal?.strategyId ?? configuredStrategyId;
    if (!strategyId) continue;
    const strategy = strategiesById.get(strategyId);
    if (!strategy?.interval) continue;
    const interval = strategy.interval.trim().toLowerCase();
    if (!interval) continue;
    const key = `${symbol}|${interval}`;
    strategySeriesKeys.set(key, { symbol, interval });
  }

  const marketSnapshotsBySeries = new Map<
    string,
    { candles: RuntimeCandle[]; derivatives?: StrategySignalDerivativesSeries }
  >();
  if (strategySeriesKeys.size > 0) {
    const snapshots = await Promise.all(
      [...strategySeriesKeys.entries()].map(async ([key, value]) => ({
        key,
        snapshot: await loadMarketSnapshot({
          marketType: botMarketType,
          symbol: value.symbol,
          interval: value.interval,
        }),
      })),
    );
    for (const item of snapshots) {
      if (item.snapshot) {
        marketSnapshotsBySeries.set(item.key, item.snapshot);
      }
    }
  }

  const { openPositionCountBySymbol, openPositionQtyBySymbol, unrealizedPnlBySymbol } =
    buildOpenPositionSymbolMetrics({
      openPositions,
      lastPriceBySymbol,
      lastPriceObservedAtBySymbol,
    });
  const statBySymbol = new Map(items.map((item) => [item.symbol, item]));
  const readModel = composeRuntimeSymbolStatsReadModel({
    userId,
    botId,
    sessionId,
    sessionStartedAt: session.startedAt,
    sessionCreatedAt: session.createdAt,
    sessionUpdatedAt: session.updatedAt,
    symbols,
    statBySymbol,
    aggregateSummary: {
      totalSignals: summary._sum.totalSignals,
      longEntries: summary._sum.longEntries,
      shortEntries: summary._sum.shortEntries,
      exits: summary._sum.exits,
      dcaCount: summary._sum.dcaCount,
      closedTrades: summary._sum.closedTrades,
      winningTrades: summary._sum.winningTrades,
      losingTrades: summary._sum.losingTrades,
      realizedPnl: summary._sum.realizedPnl,
      grossProfit: summary._sum.grossProfit,
      grossLoss: summary._sum.grossLoss,
      feesPaid: summary._sum.feesPaid,
    },
    openPositionCountBySymbol,
    openPositionQtyBySymbol,
    unrealizedPnlBySymbol,
    lastPriceBySymbol,
    latestTradeAtBySymbol,
    latestSignalBySymbol,
    configuredStrategyBySymbol,
    strategiesById,
    marketSnapshotsBySeries,
    preferConfiguredStrategyContext: query.preferConfiguredStrategyContext,
  });

  return {
    sessionId,
    items: readModel.items,
    summary: readModel.summary,
  };
};
