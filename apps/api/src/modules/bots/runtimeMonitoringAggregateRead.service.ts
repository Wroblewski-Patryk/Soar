import { getOwnedBot } from './botOwnership.service';
import { GetBotRuntimeMonitoringAggregateQueryDto } from './bots.types';
import { listRuntimeSessionsWithSummary } from './runtimeSessionsRead.service';
import { listBotRuntimeSessionPositions } from './runtimeSessionPositionsRead.service';
import { listBotRuntimeSessionSymbolStats } from './runtimeSessionSymbolStatsRead.service';
import { listBotRuntimeSessionTrades } from './runtimeSessionTradesRead.service';
import { resolveRuntimeMarketTruthState } from './runtimeMarketTruthState.service';
import {
  buildRuntimeAggregateCacheKey,
  mapWithLimitedConcurrency,
  withRuntimeAggregateTimeout,
} from './runtimeMonitoringAggregateRuntime.service';
import {
  buildRuntimeAggregateCurrentOpenItems,
  buildRuntimeAggregateCurrentOpenOrders,
  buildRuntimeAggregateProjectedHistoryItems,
  buildRuntimeAggregateProjectedTradeItems,
  buildRuntimeAggregateTradesMeta,
  compareRuntimeAggregateTimestampDescThenIdAsc,
  readRuntimeAggregateFiniteNumber,
  resolveRuntimeAggregateCurrentDynamicStopColumns,
  selectLatestRunningProjectionRows,
  selectRuntimeAggregateCurrentRows,
  selectRuntimeAggregateLatestCapitalSummary,
  sumRuntimeAggregateProjectedSymbolsTracked,
  toRuntimeAggregateDate,
  toRuntimeAggregateTimestamp,
} from './runtimeMonitoringAggregateProjectors';
import {
  buildEmptyAggregatePayload,
  buildEmptyAggregatePositionsPayload,
  buildEmptyAggregateSymbolStatsPayload,
  buildEmptyAggregateTradesPayload,
  buildFallbackAggregatePositionsPayload,
  resolveAggregateSessionWindowEnd,
} from './runtimeMonitoringAggregateFallbacks.service';

export {
  mapWithLimitedConcurrency,
} from './runtimeMonitoringAggregateRuntime.service';

export {
  buildRuntimeAggregateCurrentOpenItems,
  buildRuntimeAggregateCurrentOpenOrders,
  buildRuntimeAggregateProjectedHistoryItems,
  buildRuntimeAggregateProjectedTradeItems,
  buildRuntimeAggregateTradesMeta,
  resolveRuntimeAggregateCurrentDynamicStopColumns,
  selectLatestRunningProjectionRows,
  selectRuntimeAggregateCurrentRows,
  selectRuntimeAggregateLatestCapitalSummary,
  sumRuntimeAggregateProjectedSymbolsTracked,
} from './runtimeMonitoringAggregateProjectors';

type RuntimeSessionListItem = Awaited<ReturnType<typeof listRuntimeSessionsWithSummary>>[number];
type RuntimeSymbolStatsResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionSymbolStats>>>;
type RuntimePositionsResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionPositions>>>;
type RuntimeTradesResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionTrades>>>;

type RuntimeAggregateCacheValue = Awaited<ReturnType<typeof getBotRuntimeMonitoringAggregateUncached>>;

const runtimeAggregateCacheTtlMs = Number.parseInt(
  process.env.RUNTIME_MONITORING_AGGREGATE_CACHE_TTL_MS ?? '5000',
  10,
);
const runtimeAggregateCacheEnabled =
  process.env.NODE_ENV !== 'test' && Number.isFinite(runtimeAggregateCacheTtlMs) && runtimeAggregateCacheTtlMs > 0;
const runtimeAggregateCache = new Map<string, { expiresAt: number; value: RuntimeAggregateCacheValue }>();
const runtimeAggregateInflight = new Map<string, Promise<RuntimeAggregateCacheValue>>();
const runtimeAggregateMaxSessions = Number.parseInt(
  process.env.RUNTIME_MONITORING_AGGREGATE_MAX_SESSIONS ?? '12',
  10,
);
const runtimeAggregateMaxPerSession = Number.parseInt(
  process.env.RUNTIME_MONITORING_AGGREGATE_MAX_PER_SESSION ?? '120',
  10,
);
const runtimeAggregateSubqueryTimeoutMs = Number.parseInt(
  process.env.RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS ?? '15000',
  10,
);
const runtimeAggregateStaleTtlMs = Number.parseInt(process.env.RUNTIME_MONITORING_AGGREGATE_STALE_TTL_MS ?? '45000', 10);
const runtimeAggregateRunningSessionsCap = Number.parseInt(
  process.env.RUNTIME_MONITORING_AGGREGATE_RUNNING_SESSIONS_CAP ?? '0',
  10,
);
const runtimeAggregateCompletedSessionsCap = Number.parseInt(
  process.env.RUNTIME_MONITORING_AGGREGATE_COMPLETED_SESSIONS_CAP ?? '0',
  10,
);
const runtimeAggregateSessionConcurrency = Number.parseInt(process.env.RUNTIME_MONITORING_AGGREGATE_SESSION_CONCURRENCY ?? '2', 10);

const selectSessionsForAggregation = (sessions: RuntimeSessionListItem[]) => {
  if (sessions.length <= 1) return sessions;

  const running = sessions
    .filter((session) => session.status === 'RUNNING')
    .sort((left, right) => toRuntimeAggregateTimestamp(right.lastHeartbeatAt) - toRuntimeAggregateTimestamp(left.lastHeartbeatAt));
  const nonRunning = sessions
    .filter((session) => session.status !== 'RUNNING')
    .sort((left, right) =>
      toRuntimeAggregateTimestamp(resolveAggregateSessionWindowEnd(right)) - toRuntimeAggregateTimestamp(resolveAggregateSessionWindowEnd(left))
    );

  const runningCap = Number.isFinite(runtimeAggregateRunningSessionsCap) && runtimeAggregateRunningSessionsCap > 0
    ? runtimeAggregateRunningSessionsCap
    : running.length;
  const completedCap = Number.isFinite(runtimeAggregateCompletedSessionsCap) && runtimeAggregateCompletedSessionsCap > 0
    ? runtimeAggregateCompletedSessionsCap
    : nonRunning.length;
  const selected = [...running.slice(0, runningCap), ...nonRunning.slice(0, completedCap)];
  if (selected.length === 0) {
    return sessions.slice(0, Math.min(sessions.length, 3));
  }

  const seen = new Set<string>();
  return selected.filter((session) => {
    if (seen.has(session.id)) return false;
    seen.add(session.id);
    return true;
  });
};

const getBotRuntimeMonitoringAggregateUncached = async (
  userId: string,
  botId: string,
  query: GetBotRuntimeMonitoringAggregateQueryDto
) => {
  const sessionsLimit = Math.max(
    1,
    Math.min(query.sessionsLimit, Number.isFinite(runtimeAggregateMaxSessions) ? runtimeAggregateMaxSessions : 12)
  );
  const perSessionLimit = Math.max(
    1,
    Math.min(
      query.perSessionLimit,
      Number.isFinite(runtimeAggregateMaxPerSession) ? runtimeAggregateMaxPerSession : 120
    )
  );
  const bot = await getOwnedBot(userId, botId);
  if (!bot) return null;

  const sessions = await listRuntimeSessionsWithSummary({
    userId,
    botId,
    status: query.status,
    limit: sessionsLimit,
  });
  if (sessions.length === 0) {
    return buildEmptyAggregatePayload({
      botId,
      mode: bot.mode,
      status: query.status,
      perSessionLimit,
    });
  }
  const scopedSessions = selectSessionsForAggregation(sessions);

  const payloadRows = await mapWithLimitedConcurrency(
    scopedSessions,
    runtimeAggregateSessionConcurrency,
    async (session) => {
      const [symbolStats, positions, trades] = await Promise.all([
        withRuntimeAggregateTimeout(
          listBotRuntimeSessionSymbolStats(userId, botId, session.id, {
            symbol: query.symbol,
            limit: perSessionLimit,
            preferConfiguredStrategyContext: true,
          }),
          runtimeAggregateSubqueryTimeoutMs
        )
          .then((value) => value ?? buildEmptyAggregateSymbolStatsPayload({ session }))
          .catch(() => buildEmptyAggregateSymbolStatsPayload({ session })),
        withRuntimeAggregateTimeout(
          listBotRuntimeSessionPositions(userId, botId, session.id, {
            symbol: query.symbol,
            limit: perSessionLimit,
          }),
          runtimeAggregateSubqueryTimeoutMs
        )
          .then((value) => value ?? buildEmptyAggregatePositionsPayload({ session }))
          .catch(() =>
            buildFallbackAggregatePositionsPayload({
              botId,
              userId,
              session,
              symbol: query.symbol,
              limit: perSessionLimit,
            }).catch(() => buildEmptyAggregatePositionsPayload({ session }))
          ),
        withRuntimeAggregateTimeout(
          listBotRuntimeSessionTrades(userId, botId, session.id, {
            symbol: query.symbol,
            limit: perSessionLimit,
          }),
          runtimeAggregateSubqueryTimeoutMs
        )
          .then((value) => value ?? buildEmptyAggregateTradesPayload({ session, perSessionLimit }))
          .catch(() => buildEmptyAggregateTradesPayload({ session, perSessionLimit })),
      ]);

      return {
        session,
        symbolStats,
        positions,
        trades,
      };
    }
  );

  const completePayloadRows = payloadRows.filter(
    (
      row
    ): row is {
      session: RuntimeSessionListItem;
      symbolStats: RuntimeSymbolStatsResponse;
      positions: RuntimePositionsResponse;
      trades: RuntimeTradesResponse;
    } => row.symbolStats != null && row.positions != null && row.trades != null
  );

  if (completePayloadRows.length === 0) {
    return buildEmptyAggregatePayload({
      botId,
      mode: bot.mode,
      status: query.status,
      perSessionLimit,
    });
  }

  const activeSessions = completePayloadRows.map((row) => row.session);
  const mode = activeSessions.some((session) => session.mode === 'LIVE') ? 'LIVE' : 'PAPER';
  const status = activeSessions.some((session) => session.status === 'RUNNING')
    ? 'RUNNING'
    : activeSessions.some((session) => session.status === 'FAILED')
      ? 'FAILED'
      : activeSessions.some((session) => session.status === 'CANCELED')
        ? 'CANCELED'
        : 'COMPLETED';
  const hasRunningSession = status === 'RUNNING';
  const startedAt =
    activeSessions
      .map((session) => session.startedAt)
      .sort((left, right) => left.getTime() - right.getTime())[0] ?? new Date();
  const finishedAt = hasRunningSession
    ? null
    : activeSessions
        .map(resolveAggregateSessionWindowEnd)
        .sort((left, right) => right.getTime() - left.getTime())[0] ?? null;
  const lastHeartbeatAt =
    activeSessions
      .map((session) => session.lastHeartbeatAt)
      .filter((value): value is Date => value instanceof Date)
      .sort((left, right) => right.getTime() - left.getTime())[0] ?? null;
  const sessionMetadataRows = selectLatestRunningProjectionRows(completePayloadRows);
  const durationMs = Math.max(
    0,
    sessionMetadataRows.reduce((acc, row) => acc + Math.max(0, row.session.durationMs), 0)
  );
  const eventsCount = sessionMetadataRows.reduce((acc, row) => acc + row.session.eventsCount, 0);
  const symbolsTracked = sumRuntimeAggregateProjectedSymbolsTracked(sessionMetadataRows);
  const symbolProjectionRows = selectLatestRunningProjectionRows(completePayloadRows);

  const symbolMap = new Map<string, RuntimeSymbolStatsResponse['items'][number]>();
  for (const row of symbolProjectionRows) {
    for (const item of row.symbolStats.items) {
      const existing = symbolMap.get(item.symbol);
      if (!existing) {
        symbolMap.set(item.symbol, {
          ...item,
          id: `aggregate-${item.symbol}`,
          sessionId: 'AGGREGATE',
          runtimeMarketState:
            item.runtimeMarketState ??
            resolveRuntimeMarketTruthState({
              openPositionCount: item.openPositionCount,
              signalContextSource: item.lastSignalContextSource ?? 'unresolved',
              signalDirection: item.lastSignalDirection ?? null,
            }),
        });
        continue;
      }

      const currentSignalTs = Math.max(
        toRuntimeAggregateTimestamp(item.lastSignalDecisionAt),
        toRuntimeAggregateTimestamp(item.lastSignalAt)
      );
      const existingSignalTs = Math.max(
        toRuntimeAggregateTimestamp(existing.lastSignalDecisionAt),
        toRuntimeAggregateTimestamp(existing.lastSignalAt)
      );
      const currentTradeTs = toRuntimeAggregateTimestamp(item.lastTradeAt);
      const existingTradeTs = toRuntimeAggregateTimestamp(existing.lastTradeAt);
      const currentSnapshotTs = toRuntimeAggregateTimestamp(item.snapshotAt);
      const existingSnapshotTs = toRuntimeAggregateTimestamp(existing.snapshotAt);
      const currentConfiguredFallbackReplacesSupersededSignal =
        item.lastSignalContextSource === 'configured_fallback' &&
        item.configuredStrategyId != null &&
        existing.lastSignalStrategyId != null &&
        existing.lastSignalStrategyId !== item.configuredStrategyId;
      const existingConfiguredFallbackReplacesSupersededSignal =
        existing.lastSignalContextSource === 'configured_fallback' &&
        existing.configuredStrategyId != null &&
        item.lastSignalStrategyId != null &&
        item.lastSignalStrategyId !== existing.configuredStrategyId;
      const shouldUseCurrentSignalContext =
        currentConfiguredFallbackReplacesSupersededSignal ||
        (!existingConfiguredFallbackReplacesSupersededSignal && currentSignalTs >= existingSignalTs);

      symbolMap.set(item.symbol, {
        ...existing,
        totalSignals: existing.totalSignals + item.totalSignals,
        longEntries: existing.longEntries + item.longEntries,
        shortEntries: existing.shortEntries + item.shortEntries,
        exits: existing.exits + item.exits,
        dcaCount: existing.dcaCount + item.dcaCount,
        closedTrades: existing.closedTrades + item.closedTrades,
        winningTrades: existing.winningTrades + item.winningTrades,
        losingTrades: existing.losingTrades + item.losingTrades,
        realizedPnl: existing.realizedPnl + item.realizedPnl,
        grossProfit: existing.grossProfit + item.grossProfit,
        grossLoss: existing.grossLoss + item.grossLoss,
        feesPaid: existing.feesPaid + item.feesPaid,
        openPositionCount:
          currentSnapshotTs >= existingSnapshotTs ? item.openPositionCount : existing.openPositionCount,
        openPositionQty:
          currentSnapshotTs >= existingSnapshotTs ? item.openPositionQty : existing.openPositionQty,
        unrealizedPnl:
          currentSnapshotTs >= existingSnapshotTs ? item.unrealizedPnl : existing.unrealizedPnl,
        lastPrice: shouldUseCurrentSignalContext ? item.lastPrice : existing.lastPrice,
        lastSignalAt: shouldUseCurrentSignalContext ? item.lastSignalAt : existing.lastSignalAt,
        lastSignalDirection:
          shouldUseCurrentSignalContext
            ? item.lastSignalDirection
            : existing.lastSignalDirection,
        lastSignalDecisionAt:
          shouldUseCurrentSignalContext
            ? item.lastSignalDecisionAt
            : existing.lastSignalDecisionAt,
        lastSignalMessage:
          shouldUseCurrentSignalContext
            ? item.lastSignalMessage
            : existing.lastSignalMessage,
        lastSignalReason:
          shouldUseCurrentSignalContext
            ? item.lastSignalReason
            : existing.lastSignalReason,
        lastSignalStrategyId:
          shouldUseCurrentSignalContext
            ? item.lastSignalStrategyId
            : existing.lastSignalStrategyId,
        lastSignalStrategyName:
          shouldUseCurrentSignalContext
            ? item.lastSignalStrategyName
            : existing.lastSignalStrategyName,
        lastSignalContextSource:
          shouldUseCurrentSignalContext
            ? item.lastSignalContextSource
            : existing.lastSignalContextSource,
        runtimeMarketState:
          shouldUseCurrentSignalContext
            ? item.runtimeMarketState
            : existing.runtimeMarketState,
        configuredStrategyId:
          shouldUseCurrentSignalContext
            ? item.configuredStrategyId
            : existing.configuredStrategyId,
        configuredStrategyName:
          shouldUseCurrentSignalContext
            ? item.configuredStrategyName
            : existing.configuredStrategyName,
        lastSignalConditionSummary:
          shouldUseCurrentSignalContext
            ? item.lastSignalConditionSummary
            : existing.lastSignalConditionSummary,
        lastSignalIndicatorSummary:
          shouldUseCurrentSignalContext
            ? item.lastSignalIndicatorSummary
            : existing.lastSignalIndicatorSummary,
        lastSignalConditionLines:
          shouldUseCurrentSignalContext
            ? item.lastSignalConditionLines
            : existing.lastSignalConditionLines,
        lastSignalConditionActive: shouldUseCurrentSignalContext ? item.lastSignalConditionActive : existing.lastSignalConditionActive,
        lastSignalScoreSummary:
          shouldUseCurrentSignalContext
            ? item.lastSignalScoreSummary
            : existing.lastSignalScoreSummary,
        lastTradeAt: currentTradeTs >= existingTradeTs ? item.lastTradeAt : existing.lastTradeAt,
        snapshotAt: currentSnapshotTs >= existingSnapshotTs ? item.snapshotAt : existing.snapshotAt,
      });
      const merged = symbolMap.get(item.symbol);
      if (merged) {
        merged.runtimeMarketState = resolveRuntimeMarketTruthState({
          openPositionCount: merged.openPositionCount,
          signalContextSource: merged.lastSignalContextSource ?? 'unresolved',
          signalDirection: merged.lastSignalDirection ?? null,
        });
      }
    }
  }

  const symbolItems = [...symbolMap.values()].sort((left, right) => left.symbol.localeCompare(right.symbol));
  const symbolCurrentSummary = symbolItems.reduce(
    (acc, item) => ({
      openPositionCount: acc.openPositionCount + item.openPositionCount,
      openPositionQty: acc.openPositionQty + item.openPositionQty,
      unrealizedPnl: acc.unrealizedPnl + (item.unrealizedPnl ?? 0),
    }),
    {
      openPositionCount: 0,
      openPositionQty: 0,
      unrealizedPnl: 0,
    }
  );
  const historicalSymbolSummary = symbolProjectionRows.reduce(
    (acc, row) => ({
      totalSignals: acc.totalSignals + row.symbolStats.summary.totalSignals,
      longEntries: acc.longEntries + row.symbolStats.summary.longEntries,
      shortEntries: acc.shortEntries + row.symbolStats.summary.shortEntries,
      exits: acc.exits + row.symbolStats.summary.exits,
      dcaCount: acc.dcaCount + row.symbolStats.summary.dcaCount,
      closedTrades: acc.closedTrades + row.symbolStats.summary.closedTrades,
      winningTrades: acc.winningTrades + row.symbolStats.summary.winningTrades,
      losingTrades: acc.losingTrades + row.symbolStats.summary.losingTrades,
      realizedPnl: acc.realizedPnl + row.symbolStats.summary.realizedPnl,
      grossProfit: acc.grossProfit + row.symbolStats.summary.grossProfit,
      grossLoss: acc.grossLoss + row.symbolStats.summary.grossLoss,
      feesPaid: acc.feesPaid + row.symbolStats.summary.feesPaid,
    }),
    {
      totalSignals: 0,
      longEntries: 0,
      shortEntries: 0,
      exits: 0,
      dcaCount: 0,
      closedTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      realizedPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      feesPaid: 0,
    }
  );
  const symbolSummary = {
    ...historicalSymbolSummary,
    unrealizedPnl: symbolCurrentSummary.unrealizedPnl,
    totalPnl: historicalSymbolSummary.realizedPnl + symbolCurrentSummary.unrealizedPnl,
    openPositionCount: symbolCurrentSummary.openPositionCount,
    openPositionQty: symbolCurrentSummary.openPositionQty,
  };

  const sortBySessionFreshness = <
    T extends {
      session: RuntimeSessionListItem;
    },
  >(
    rows: T[]
  ) =>
    [...rows].sort((left, right) =>
    compareRuntimeAggregateTimestampDescThenIdAsc(
      Math.max(
        toRuntimeAggregateTimestamp(left.session.lastHeartbeatAt),
        toRuntimeAggregateTimestamp(left.session.finishedAt),
        toRuntimeAggregateTimestamp(left.session.startedAt)
      ),
      Math.max(
        toRuntimeAggregateTimestamp(right.session.lastHeartbeatAt),
        toRuntimeAggregateTimestamp(right.session.finishedAt),
        toRuntimeAggregateTimestamp(right.session.startedAt)
      ),
      left.session.id,
      right.session.id
    )
  );
  const sortedCurrentRowsBySessionFreshness = sortBySessionFreshness(
    selectRuntimeAggregateCurrentRows(completePayloadRows)
  );
  const latestCapitalSummary = selectRuntimeAggregateLatestCapitalSummary(
    sortedCurrentRowsBySessionFreshness
  );
  const latestPositionResponse = sortedCurrentRowsBySessionFreshness[0]?.positions ?? null;
  const historicalPositionRows = selectLatestRunningProjectionRows(completePayloadRows);
  const openItems = buildRuntimeAggregateCurrentOpenItems(latestPositionResponse);
  const historyItems = buildRuntimeAggregateProjectedHistoryItems(historicalPositionRows);
  const openOrders = buildRuntimeAggregateCurrentOpenOrders(latestPositionResponse);
  const showDynamicStopColumns =
    resolveRuntimeAggregateCurrentDynamicStopColumns(latestPositionResponse);
  const latestOpenPositionCount = latestPositionResponse?.openCount ?? 0;
  const latestOpenPositionQty = latestPositionResponse?.summary.openPositionQty ?? 0;
  const latestUnrealizedPnl = latestPositionResponse?.summary.unrealizedPnl ?? 0;
  const usedMargin = openItems.reduce((sum, position) => {
    const leverage = Math.max(1, position.leverage || 1);
    return sum + position.entryNotional / leverage;
  }, 0);
  const latestReferenceBalance = readRuntimeAggregateFiniteNumber(latestCapitalSummary?.referenceBalance);
  const latestFreeCash = readRuntimeAggregateFiniteNumber(latestCapitalSummary?.freeCash);
  const referenceBalance = latestReferenceBalance != null ? Math.max(0, latestReferenceBalance) : null;
  const freeCash =
    latestFreeCash != null
      ? Math.max(0, latestFreeCash)
      : referenceBalance != null
        ? Math.max(0, referenceBalance - Math.max(0, usedMargin))
        : null;
  const positionsSummary = {
    realizedPnl: historicalPositionRows.reduce((acc, row) => acc + row.positions.summary.realizedPnl, 0),
    unrealizedPnl: latestUnrealizedPnl,
    feesPaid: historicalPositionRows.reduce((acc, row) => acc + row.positions.summary.feesPaid, 0),
    openPositionQty: latestOpenPositionQty,
    referenceBalance,
    freeCash,
    accountBalance: readRuntimeAggregateFiniteNumber(latestCapitalSummary?.accountBalance),
    baseCurrency:
      typeof latestCapitalSummary?.baseCurrency === 'string' && latestCapitalSummary.baseCurrency.length > 0
        ? latestCapitalSummary.baseCurrency
        : null,
    capitalSource:
      typeof latestCapitalSummary?.capitalSource === 'string' && latestCapitalSummary.capitalSource.length > 0
        ? latestCapitalSummary.capitalSource
        : null,
    allocationMode:
      latestCapitalSummary?.allocationMode === 'PERCENT' || latestCapitalSummary?.allocationMode === 'FIXED'
        ? latestCapitalSummary.allocationMode
        : null,
    allocationValue: readRuntimeAggregateFiniteNumber(latestCapitalSummary?.allocationValue),
    paperResetAt: toRuntimeAggregateDate(latestCapitalSummary?.paperResetAt),
  };

  const totalOpenPositions = latestOpenPositionCount;
  const totalClosedPositions = historicalPositionRows.reduce((acc, row) => acc + row.positions.closedCount, 0);
  const totalPositions = totalOpenPositions + totalClosedPositions;
  const totalOpenOrders = latestPositionResponse?.openOrdersCount ?? 0;
  const tradeTotalRows = selectLatestRunningProjectionRows(completePayloadRows);
  const tradeItems = buildRuntimeAggregateProjectedTradeItems(tradeTotalRows);
  const totalTrades = tradeTotalRows.reduce((acc, row) => acc + row.trades.total, 0);
  const totalTradeFeesPaid = tradeTotalRows.reduce((acc, row) => acc + row.trades.feesPaid, 0);
  const windowFinishedAt = finishedAt ?? new Date();
  const tradeMeta = buildRuntimeAggregateTradesMeta({
    totalTrades,
    returnedItemsCount: tradeItems.length,
    pageSize: perSessionLimit,
  });

  return {
    sessionDetail: {
      id: 'AGGREGATE',
      botId,
      mode,
      status,
      startedAt,
      finishedAt,
      lastHeartbeatAt,
      stopReason: null,
      errorMessage: null,
      metadata: {
        aggregate: true,
        sessionsCount: activeSessions.length,
      },
      createdAt: startedAt,
      updatedAt: lastHeartbeatAt ?? finishedAt ?? startedAt,
      durationMs,
      eventsCount,
      symbolsTracked,
      summary: {
        totalSignals: symbolSummary.totalSignals,
        longEntries: symbolSummary.longEntries,
        shortEntries: symbolSummary.shortEntries,
        exits: symbolSummary.exits,
        dcaCount: symbolSummary.dcaCount,
        closedTrades: symbolSummary.closedTrades,
        winningTrades: symbolSummary.winningTrades,
        losingTrades: symbolSummary.losingTrades,
        realizedPnl: positionsSummary.realizedPnl,
        grossProfit: symbolSummary.grossProfit,
        grossLoss: symbolSummary.grossLoss,
        feesPaid: totalTradeFeesPaid,
        openPositionCount: totalOpenPositions,
        openPositionQty: positionsSummary.openPositionQty,
      },
    },
    symbolStats: {
      sessionId: 'AGGREGATE',
      items: symbolItems,
      summary: symbolSummary,
    },
    positions: {
      sessionId: 'AGGREGATE',
      total: totalPositions,
      openCount: totalOpenPositions,
      closedCount: totalClosedPositions,
      openOrdersCount: totalOpenOrders,
      showDynamicStopColumns,
      window: {
        startedAt,
        finishedAt: windowFinishedAt,
      },
      summary: positionsSummary,
      openOrders,
      openItems,
      historyItems,
    },
    trades: {
      sessionId: 'AGGREGATE',
      total: totalTrades,
      feesPaid: totalTradeFeesPaid,
      meta: tradeMeta,
      window: {
        startedAt,
        finishedAt: windowFinishedAt,
      },
      items: tradeItems,
    },
  };
};

export const getBotRuntimeMonitoringAggregate = async (
  userId: string,
  botId: string,
  query: GetBotRuntimeMonitoringAggregateQueryDto
) => {
  if (!runtimeAggregateCacheEnabled) {
    return getBotRuntimeMonitoringAggregateUncached(userId, botId, query);
  }

  const key = buildRuntimeAggregateCacheKey(userId, botId, query);
  const now = Date.now();
  const cached = runtimeAggregateCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const canServeStale =
    cached &&
    Number.isFinite(runtimeAggregateStaleTtlMs) &&
    runtimeAggregateStaleTtlMs > 0 &&
    now <= cached.expiresAt + runtimeAggregateStaleTtlMs;

  const inflight = runtimeAggregateInflight.get(key);
  if (inflight) {
    return canServeStale ? cached.value : inflight;
  }

  const task = getBotRuntimeMonitoringAggregateUncached(userId, botId, query)
    .then((value) => {
      runtimeAggregateCache.set(key, {
        expiresAt: Date.now() + runtimeAggregateCacheTtlMs,
        value,
      });
      return value;
    })
    .catch((error) => {
      if (canServeStale && cached) {
        return cached.value;
      }
      throw error;
    })
    .finally(() => {
      runtimeAggregateInflight.delete(key);
    });

  runtimeAggregateInflight.set(key, task);
  return canServeStale ? cached.value : task;
};
