import { getOwnedBot } from './botOwnership.service';
import { GetBotRuntimeMonitoringAggregateQueryDto } from './bots.types';
import { listRuntimeSessionsWithSummary } from './runtimeSessionsRead.service';
import { listBotRuntimeSessionPositions } from './runtimeSessionPositionsRead.service';
import { listBotRuntimeSessionSymbolStats } from './runtimeSessionSymbolStatsRead.service';
import { listBotRuntimeSessionTrades } from './runtimeSessionTradesRead.service';

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

const buildEmptyAggregatePayload = (params: {
  botId: string;
  status: RuntimeSessionListItem['status'] | undefined;
}) => {
  const now = new Date();
  return {
    sessionDetail: {
      id: 'AGGREGATE',
      botId: params.botId,
      mode: 'PAPER' as const,
      status: params.status ?? 'COMPLETED',
      startedAt: now,
      finishedAt: now,
      lastHeartbeatAt: now,
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
      },
      openOrders: [] as RuntimePositionsResponse['openOrders'],
      openItems: [] as RuntimePositionsResponse['openItems'],
      historyItems: [] as RuntimePositionsResponse['historyItems'],
    },
    trades: {
      sessionId: 'AGGREGATE',
      total: 0,
      meta: {
        page: 1,
        pageSize: 1,
        total: 0,
        totalPages: 0,
        hasPrev: false,
        hasNext: false,
      },
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
    return buildEmptyAggregatePayload({ botId, status: query.status });
  }

  const payloadRows = await Promise.all(
    sessions.map(async (session) => {
      const [symbolStats, positions, trades] = await Promise.all([
        listBotRuntimeSessionSymbolStats(userId, botId, session.id, {
          symbol: query.symbol,
          limit: query.perSessionLimit,
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
    return buildEmptyAggregatePayload({ botId, status: query.status });
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
  const startedAt =
    activeSessions
      .map((session) => session.startedAt)
      .sort((left, right) => left.getTime() - right.getTime())[0] ?? new Date();
  const finishedAt =
    activeSessions
      .map((session) => session.finishedAt)
      .filter((value): value is Date => value instanceof Date)
      .sort((left, right) => right.getTime() - left.getTime())[0] ?? null;
  const lastHeartbeatAt =
    activeSessions
      .map((session) => session.lastHeartbeatAt)
      .filter((value): value is Date => value instanceof Date)
      .sort((left, right) => right.getTime() - left.getTime())[0] ?? null;
  const durationMs = Math.max(
    0,
    activeSessions.reduce((acc, session) => acc + Math.max(0, session.durationMs), 0)
  );
  const eventsCount = activeSessions.reduce((acc, session) => acc + session.eventsCount, 0);

  const symbolMap = new Map<string, RuntimeSymbolStatsResponse['items'][number]>();
  for (const response of completePayloadRows.map((row) => row.symbolStats)) {
    for (const item of response.items) {
      const existing = symbolMap.get(item.symbol);
      if (!existing) {
        symbolMap.set(item.symbol, {
          ...item,
          id: `aggregate-${item.symbol}`,
          sessionId: 'AGGREGATE',
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
      const shouldUseCurrentSignalContext = currentSignalTs >= existingSignalTs;

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
        openPositionCount: existing.openPositionCount + item.openPositionCount,
        openPositionQty: existing.openPositionQty + item.openPositionQty,
        unrealizedPnl: (existing.unrealizedPnl ?? 0) + (item.unrealizedPnl ?? 0),
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
        snapshotAt:
          toTimestamp(item.snapshotAt) >= toTimestamp(existing.snapshotAt)
            ? item.snapshotAt
            : existing.snapshotAt,
      });
    }
  }

  const symbolItems = [...symbolMap.values()].sort((left, right) => left.symbol.localeCompare(right.symbol));
  const symbolSummary = symbolItems.reduce(
    (acc, item) => ({
      totalSignals: acc.totalSignals + item.totalSignals,
      longEntries: acc.longEntries + item.longEntries,
      shortEntries: acc.shortEntries + item.shortEntries,
      exits: acc.exits + item.exits,
      dcaCount: acc.dcaCount + item.dcaCount,
      closedTrades: acc.closedTrades + item.closedTrades,
      winningTrades: acc.winningTrades + item.winningTrades,
      losingTrades: acc.losingTrades + item.losingTrades,
      realizedPnl: acc.realizedPnl + item.realizedPnl,
      unrealizedPnl: acc.unrealizedPnl + (item.unrealizedPnl ?? 0),
      totalPnl: acc.totalPnl + item.realizedPnl + (item.unrealizedPnl ?? 0),
      grossProfit: acc.grossProfit + item.grossProfit,
      grossLoss: acc.grossLoss + item.grossLoss,
      feesPaid: acc.feesPaid + item.feesPaid,
      openPositionCount: acc.openPositionCount + item.openPositionCount,
      openPositionQty: acc.openPositionQty + item.openPositionQty,
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
      unrealizedPnl: 0,
      totalPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      feesPaid: 0,
      openPositionCount: 0,
      openPositionQty: 0,
    }
  );

  const positionResponses = completePayloadRows.map((row) => row.positions);
  const openItems = uniqueById(positionResponses.flatMap((response) => response.openItems)).sort(
    (left, right) =>
      compareTimestampDescThenIdAsc(
        toTimestamp(left.openedAt),
        toTimestamp(right.openedAt),
        left.id,
        right.id
      )
  );
  const historyItems = uniqueById(positionResponses.flatMap((response) => response.historyItems)).sort(
    (left, right) =>
      compareTimestampDescThenIdAsc(
        toTimestamp(left.closedAt),
        toTimestamp(right.closedAt),
        left.id,
        right.id
      )
  );
  const openOrders = uniqueById(positionResponses.flatMap((response) => response.openOrders)).sort(
    (left, right) =>
      compareTimestampDescThenIdAsc(
        toTimestamp(left.submittedAt ?? left.createdAt),
        toTimestamp(right.submittedAt ?? right.createdAt),
        left.id,
        right.id
      )
  );
  const positionsSummary = {
    realizedPnl: historyItems.reduce((acc, item) => acc + item.realizedPnl, 0),
    unrealizedPnl: openItems.reduce((acc, item) => acc + (item.unrealizedPnl ?? 0), 0),
    feesPaid: [...openItems, ...historyItems].reduce((acc, item) => acc + item.feesPaid, 0),
  };

  const tradeItems = uniqueById(completePayloadRows.flatMap((row) => row.trades.items)).sort(
    (left, right) =>
      compareTimestampDescThenIdAsc(
        toTimestamp(left.executedAt),
        toTimestamp(right.executedAt),
        left.id,
        right.id
      )
  );
  const windowFinishedAt = finishedAt ?? new Date();
  const pageSize = tradeItems.length || 1;

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
      symbolsTracked: symbolItems.length,
      summary: {
        totalSignals: symbolSummary.totalSignals,
        longEntries: symbolSummary.longEntries,
        shortEntries: symbolSummary.shortEntries,
        exits: symbolSummary.exits,
        dcaCount: symbolSummary.dcaCount,
        closedTrades: symbolSummary.closedTrades,
        winningTrades: symbolSummary.winningTrades,
        losingTrades: symbolSummary.losingTrades,
        realizedPnl: tradeItems.reduce((acc, item) => acc + item.realizedPnl, 0),
        grossProfit: symbolSummary.grossProfit,
        grossLoss: symbolSummary.grossLoss,
        feesPaid: tradeItems.reduce((acc, item) => acc + item.fee, 0),
        openPositionCount: openItems.length,
        openPositionQty: openItems.reduce((acc, item) => acc + item.quantity, 0),
      },
    },
    symbolStats: {
      sessionId: 'AGGREGATE',
      items: symbolItems,
      summary: symbolSummary,
    },
    positions: {
      sessionId: 'AGGREGATE',
      total: openItems.length + historyItems.length,
      openCount: openItems.length,
      closedCount: historyItems.length,
      openOrdersCount: openOrders.length,
      showDynamicStopColumns: positionResponses.some((response) => response.showDynamicStopColumns === true),
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
      total: tradeItems.length,
      meta: {
        page: 1,
        pageSize,
        total: tradeItems.length,
        totalPages: tradeItems.length === 0 ? 0 : 1,
        hasPrev: false,
        hasNext: false,
      },
      window: {
        startedAt,
        finishedAt: windowFinishedAt,
      },
      items: tradeItems,
    },
  };
};
