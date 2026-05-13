import { getOwnedBot } from './botOwnership.service';
import { GetBotRuntimeMonitoringAggregateQueryDto } from './bots.types';
import { listRuntimeSessionsWithSummary } from './runtimeSessionsRead.service';
import { listBotRuntimeSessionPositions } from './runtimeSessionPositionsRead.service';
import { listBotRuntimeSessionSymbolStats } from './runtimeSessionSymbolStatsRead.service';
import { listBotRuntimeSessionTrades } from './runtimeSessionTradesRead.service';
import { resolveRuntimeMarketTruthState } from './runtimeMarketTruthState.service';

type RuntimeSessionListItem = Awaited<ReturnType<typeof listRuntimeSessionsWithSummary>>[number];
type RuntimeSymbolStatsResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionSymbolStats>>>;
type RuntimePositionsResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionPositions>>>;
type RuntimeTradesResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionTrades>>>;

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (value == null) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const toTimestamp = (value: Date | string | null | undefined): number => toDate(value)?.getTime() ?? 0;

const readFiniteNumber = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
};

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>();
  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return [...map.values()];
};

const compareTimestampDescThenIdAsc = (
  leftTs: number,
  rightTs: number,
  leftId: string,
  rightId: string
) => {
  const byTimestamp = rightTs - leftTs;
  if (byTimestamp !== 0) return byTimestamp;
  return leftId.localeCompare(rightId);
};

export const selectLatestRunningProjectionRows = <
  T extends {
    session: RuntimeSessionListItem;
  },
>(
  rows: T[]
) => {
  const runningRows = rows.filter((row) => row.session.status === 'RUNNING');
  if (runningRows.length === 0) return rows;
  const nonRunningRows = rows.filter((row) => row.session.status !== 'RUNNING');
  const latestRunningRow = [...runningRows].sort((left, right) =>
    compareTimestampDescThenIdAsc(
      Math.max(
        toTimestamp(left.session.lastHeartbeatAt),
        toTimestamp(left.session.finishedAt),
        toTimestamp(left.session.startedAt)
      ),
      Math.max(
        toTimestamp(right.session.lastHeartbeatAt),
        toTimestamp(right.session.finishedAt),
        toTimestamp(right.session.startedAt)
      ),
      left.session.id,
      right.session.id
    )
  )[0];
  return latestRunningRow ? [...nonRunningRows, latestRunningRow] : nonRunningRows;
};

export const selectRuntimeAggregateCurrentRows = <
  T extends {
    session: RuntimeSessionListItem;
  },
>(
  rows: T[]
) => {
  const runningRows = rows.filter((row) => row.session.status === 'RUNNING');
  return runningRows.length > 0 ? runningRows : rows;
};

export const sumRuntimeAggregateProjectedSymbolsTracked = <
  T extends {
    session: Pick<RuntimeSessionListItem, 'symbolsTracked'>;
  },
>(
  rows: T[]
) => rows.reduce((acc, row) => acc + row.session.symbolsTracked, 0);

export const buildRuntimeAggregateProjectedTradeItems = <
  T extends {
    trades: {
      items: Array<{
        id: string;
        executedAt: Date | string | null;
      }>;
    };
  },
>(
  rows: T[]
) =>
  uniqueById(rows.flatMap((row) => row.trades.items)).sort((left, right) =>
    compareTimestampDescThenIdAsc(
      toTimestamp(left.executedAt),
      toTimestamp(right.executedAt),
      left.id,
      right.id
    )
  );

export const buildRuntimeAggregateCurrentOpenItems = <
  T extends {
    openItems: Array<{
      id: string;
      openedAt: Date | string | null;
      entryNotional: number;
      leverage: number;
    }>;
  },
>(
  response: T | null
) =>
  uniqueById(response?.openItems ?? []).sort((left, right) =>
    compareTimestampDescThenIdAsc(
      toTimestamp(left.openedAt),
      toTimestamp(right.openedAt),
      left.id,
      right.id
    )
  );

export const buildRuntimeAggregateCurrentOpenOrders = <
  T extends {
    openOrders: Array<{
      id: string;
      submittedAt?: Date | string | null;
      createdAt: Date | string | null;
    }>;
  },
>(
  response: T | null
) =>
  uniqueById(response?.openOrders ?? []).sort((left, right) =>
    compareTimestampDescThenIdAsc(
      toTimestamp(left.submittedAt ?? left.createdAt),
      toTimestamp(right.submittedAt ?? right.createdAt),
      left.id,
      right.id
    )
  );

export const buildRuntimeAggregateProjectedHistoryItems = <
  T extends {
    positions: {
      historyItems: Array<{
        id: string;
        closedAt: Date | string | null;
      }>;
    };
  },
>(
  rows: T[]
) =>
  uniqueById(rows.flatMap((row) => row.positions.historyItems)).sort((left, right) =>
    compareTimestampDescThenIdAsc(
      toTimestamp(left.closedAt),
      toTimestamp(right.closedAt),
      left.id,
      right.id
    )
  );

export const resolveRuntimeAggregateCurrentDynamicStopColumns = <
  T extends {
    showDynamicStopColumns?: boolean;
  },
>(
  response: T | null
) => response?.showDynamicStopColumns === true;

export const selectRuntimeAggregateLatestCapitalSummary = <
  T extends {
    positions: {
      summary: {
        referenceBalance?: unknown;
        freeCash?: unknown;
        accountBalance?: unknown;
        baseCurrency?: unknown;
        capitalSource?: unknown;
        allocationMode?: unknown;
        allocationValue?: unknown;
        paperResetAt?: Date | string | null;
      };
    };
  },
>(
  rows: T[]
) =>
  rows
    .map((row) => row.positions.summary)
    .find((summary) => {
      const referenceBalance = readFiniteNumber(summary.referenceBalance);
      const freeCash = readFiniteNumber(summary.freeCash);
      const accountBalance = readFiniteNumber(summary.accountBalance);
      return referenceBalance != null || freeCash != null || accountBalance != null;
    });

export const buildRuntimeAggregateTradesMeta = (params: {
  totalTrades: number;
  returnedItemsCount: number;
  pageSize: number;
}) => {
  const pageSize = Math.max(1, params.pageSize);
  const total = Math.max(0, params.totalTrades);
  const returnedItemsCount = Math.max(0, params.returnedItemsCount);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  return {
    page: 1,
    pageSize,
    total,
    totalPages,
    hasPrev: false,
    hasNext: total > returnedItemsCount,
  };
};

const resolveAggregateSessionWindowEnd = (session: RuntimeSessionListItem) =>
  session.finishedAt ?? session.lastHeartbeatAt ?? session.startedAt;

const buildEmptyAggregatePayload = (params: {
  botId: string;
  mode: 'PAPER' | 'LIVE';
  status: RuntimeSessionListItem['status'] | undefined;
  perSessionLimit: number;
}) => {
  const now = new Date();
  const status = params.status ?? 'COMPLETED';
  const finishedAt = status === 'RUNNING' ? null : now;
  const tradeMeta = buildRuntimeAggregateTradesMeta({
    totalTrades: 0,
    returnedItemsCount: 0,
    pageSize: params.perSessionLimit,
  });
  return {
    sessionDetail: {
      id: 'AGGREGATE',
      botId: params.botId,
      mode: params.mode,
      status,
      startedAt: now,
      finishedAt,
      lastHeartbeatAt: null,
      stopReason: null,
      errorMessage: null,
      metadata: {
        aggregate: true,
        sessionsCount: 0,
      },
      createdAt: now,
      updatedAt: now,
      durationMs: 0,
      eventsCount: 0,
      symbolsTracked: 0,
      summary: {
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
        openPositionCount: 0,
        openPositionQty: 0,
      },
    },
    symbolStats: {
      sessionId: 'AGGREGATE',
      items: [] as RuntimeSymbolStatsResponse['items'],
      summary: {
        totalSignals: 0,
        longEntries: 0,
        shortEntries: 0,
        exits: 0,
        dcaCount: 0,
        closedTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        realizedPnl: 0,
        unrealizedPnl: 0,
        totalPnl: 0,
        grossProfit: 0,
        grossLoss: 0,
        feesPaid: 0,
        openPositionCount: 0,
        openPositionQty: 0,
      },
    },
    positions: {
      sessionId: 'AGGREGATE',
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      window: {
        startedAt: now,
        finishedAt: now,
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 0,
        feesPaid: 0,
        openPositionQty: 0,
        referenceBalance: null,
        freeCash: null,
        accountBalance: null,
        baseCurrency: null,
        capitalSource: null,
        allocationMode: null,
        allocationValue: null,
        paperResetAt: null,
      },
      openOrders: [] as RuntimePositionsResponse['openOrders'],
      openItems: [] as RuntimePositionsResponse['openItems'],
      historyItems: [] as RuntimePositionsResponse['historyItems'],
    },
    trades: {
      sessionId: 'AGGREGATE',
      total: 0,
      feesPaid: 0,
      meta: tradeMeta,
      window: {
        startedAt: now,
        finishedAt: now,
      },
      items: [] as RuntimeTradesResponse['items'],
    },
  };
};

export const getBotRuntimeMonitoringAggregate = async (
  userId: string,
  botId: string,
  query: GetBotRuntimeMonitoringAggregateQueryDto
) => {
  const bot = await getOwnedBot(userId, botId);
  if (!bot) return null;

  const sessions = await listRuntimeSessionsWithSummary({
    userId,
    botId,
    status: query.status,
    limit: query.sessionsLimit,
  });
  if (sessions.length === 0) {
    return buildEmptyAggregatePayload({
      botId,
      mode: bot.mode,
      status: query.status,
      perSessionLimit: query.perSessionLimit,
    });
  }

  const payloadRows = await Promise.all(
    sessions.map(async (session) => {
      const [symbolStats, positions, trades] = await Promise.all([
        listBotRuntimeSessionSymbolStats(userId, botId, session.id, {
          symbol: query.symbol,
          limit: query.perSessionLimit,
          preferConfiguredStrategyContext: true,
        }),
        listBotRuntimeSessionPositions(userId, botId, session.id, {
          symbol: query.symbol,
          limit: query.perSessionLimit,
        }),
        listBotRuntimeSessionTrades(userId, botId, session.id, {
          symbol: query.symbol,
          limit: query.perSessionLimit,
        }),
      ]);

      return {
        session,
        symbolStats,
        positions,
        trades,
      };
    })
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
      perSessionLimit: query.perSessionLimit,
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
        toTimestamp(item.lastSignalDecisionAt),
        toTimestamp(item.lastSignalAt)
      );
      const existingSignalTs = Math.max(
        toTimestamp(existing.lastSignalDecisionAt),
        toTimestamp(existing.lastSignalAt)
      );
      const currentTradeTs = toTimestamp(item.lastTradeAt);
      const existingTradeTs = toTimestamp(existing.lastTradeAt);
      const currentSnapshotTs = toTimestamp(item.snapshotAt);
      const existingSnapshotTs = toTimestamp(existing.snapshotAt);
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
    compareTimestampDescThenIdAsc(
      Math.max(
        toTimestamp(left.session.lastHeartbeatAt),
        toTimestamp(left.session.finishedAt),
        toTimestamp(left.session.startedAt)
      ),
      Math.max(
        toTimestamp(right.session.lastHeartbeatAt),
        toTimestamp(right.session.finishedAt),
        toTimestamp(right.session.startedAt)
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
  const latestReferenceBalance = readFiniteNumber(latestCapitalSummary?.referenceBalance);
  const latestFreeCash = readFiniteNumber(latestCapitalSummary?.freeCash);
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
    accountBalance: readFiniteNumber(latestCapitalSummary?.accountBalance),
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
    allocationValue: readFiniteNumber(latestCapitalSummary?.allocationValue),
    paperResetAt: toDate(latestCapitalSummary?.paperResetAt),
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
    pageSize: query.perSessionLimit,
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
