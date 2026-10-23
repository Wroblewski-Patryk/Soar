import { BotRuntimeSessionStatus } from '@prisma/client';
import { prisma } from '../../prisma/client';

const resolveSessionWindowEnd = (session: {
  finishedAt: Date | null;
  lastHeartbeatAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}) =>
  session.finishedAt ??
  session.lastHeartbeatAt ??
  session.updatedAt ??
  session.createdAt;

export const listRuntimeSessionsWithSummary = async (params: {
  userId: string;
  botId: string;
  status?: BotRuntimeSessionStatus;
  limit: number;
}) => {
  const sessions = await prisma.botRuntimeSession.findMany({
    where: {
      userId: params.userId,
      botId: params.botId,
      ...(params.status ? { status: params.status } : {}),
    },
    orderBy: [{ lastHeartbeatAt: 'desc' }, { startedAt: 'desc' }, { createdAt: 'desc' }],
    take: params.limit,
  });

  if (sessions.length === 0) return [];
  const sessionIds = sessions.map((session) => session.id);

  const earliestStart = new Date(Math.min(...sessions.map((session) => session.startedAt.getTime())));
  const latestEnd = new Date(Math.max(...sessions.map((session) => resolveSessionWindowEnd(session).getTime())));
  const [eventCounts, symbolCounts, symbolSums, pendingPnlEvents, unresolvedPositions] = await Promise.all([
    prisma.botRuntimeEvent.groupBy({
      by: ['sessionId'],
      where: { sessionId: { in: sessionIds } },
      _count: { _all: true },
    }),
    prisma.botRuntimeSymbolStat.groupBy({
      by: ['sessionId'],
      where: { sessionId: { in: sessionIds } },
      _count: { _all: true },
    }),
    prisma.botRuntimeSymbolStat.groupBy({
      by: ['sessionId'],
      where: { sessionId: { in: sessionIds } },
      _sum: {
        totalSignals: true,
        dcaCount: true,
        closedTrades: true,
        realizedPnl: true,
      },
    }),
    prisma.botRuntimeEvent.findMany({
      where: { sessionId: { in: sessionIds }, payload: { path: ['financialPnlPending'], equals: true } },
      select: { sessionId: true },
    }),
    prisma.position.findMany({
      where: { userId: params.userId, botId: params.botId, status: 'CLOSED',
        OR: [{ realizedPnl: null },
          { trades: { some: { OR: [{ fee: null }, { feePending: true }] } } }],
        closedAt: { gte: earliestStart, lte: latestEnd } },
      select: { closedAt: true },
    }),
  ]);
  const pendingPnlSessionIds = new Set(pendingPnlEvents.map((event) => event.sessionId));

  const eventCountMap = new Map(eventCounts.map((entry) => [entry.sessionId, entry._count._all]));
  const symbolCountMap = new Map(symbolCounts.map((entry) => [entry.sessionId, entry._count._all]));
  const symbolSumMap = new Map(
    symbolSums.map((entry) => [
      entry.sessionId,
      {
        totalSignals: entry._sum.totalSignals ?? 0,
        dcaCount: entry._sum.dcaCount ?? 0,
        closedTrades: entry._sum.closedTrades ?? 0,
        realizedPnl: entry._sum.realizedPnl ?? 0,
      },
    ])
  );

  return sessions.map((session) => {
    const summary = symbolSumMap.get(session.id) ?? {
      totalSignals: 0,
      dcaCount: 0,
      closedTrades: 0,
      realizedPnl: 0,
    };
    const windowEnd = resolveSessionWindowEnd(session);
    const durationMs = Math.max(0, windowEnd.getTime() - session.startedAt.getTime());

    return {
      id: session.id,
      botId: session.botId,
      mode: session.mode,
      status: session.status,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      lastHeartbeatAt: session.lastHeartbeatAt,
      stopReason: session.stopReason,
      errorMessage: session.errorMessage,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      durationMs,
      eventsCount: eventCountMap.get(session.id) ?? 0,
      symbolsTracked: symbolCountMap.get(session.id) ?? 0,
      summary: {
        ...summary,
        realizedPnl: pendingPnlSessionIds.has(session.id) || unresolvedPositions.some((position) =>
          position.closedAt != null && position.closedAt >= session.startedAt && position.closedAt <= windowEnd)
          ? null : summary.realizedPnl,
      },
    };
  });
};

export const getRuntimeSessionSummaryMetrics = async (sessionId: string) => {
  const session = await prisma.botRuntimeSession.findUniqueOrThrow({ where: { id: sessionId } });
  const windowEnd = resolveSessionWindowEnd(session);
  const [eventCount, symbolsTracked, symbolStatsAggregate, pendingPnlEvent, pendingFeeEvent, unresolvedPosition, unresolvedFee] = await Promise.all([
    prisma.botRuntimeEvent.count({
      where: { sessionId },
    }),
    prisma.botRuntimeSymbolStat.count({
      where: { sessionId },
    }),
    prisma.botRuntimeSymbolStat.aggregate({
      where: { sessionId },
      _sum: {
        totalSignals: true,
        longEntries: true,
        shortEntries: true,
        exits: true,
        dcaCount: true,
        closedTrades: true,
        winningTrades: true,
        losingTrades: true,
        realizedPnl: true,
        grossProfit: true,
        grossLoss: true,
        feesPaid: true,
        openPositionCount: true,
        openPositionQty: true,
      },
    }),
    prisma.botRuntimeEvent.findFirst({
      where: { sessionId, payload: { path: ['financialPnlPending'], equals: true } },
      select: { id: true },
    }),
    prisma.botRuntimeEvent.findFirst({
      where: { sessionId, payload: { path: ['financialFeePending'], equals: true } },
      select: { id: true },
    }),
    prisma.position.findFirst({
      where: { userId: session.userId, botId: session.botId, status: 'CLOSED',
        OR: [{ realizedPnl: null },
          { trades: { some: { OR: [{ fee: null }, { feePending: true }] } } }],
        closedAt: { gte: session.startedAt, lte: windowEnd } },
      select: { id: true },
    }),
    prisma.trade.findFirst({
      where: { userId: session.userId, botId: session.botId,
        executedAt: { gte: session.startedAt, lte: windowEnd },
        OR: [{ fee: null }, { feePending: true }] },
      select: { id: true },
    }),
  ]);

  return {
    eventsCount: eventCount,
    symbolsTracked,
    summary: {
      totalSignals: symbolStatsAggregate._sum.totalSignals ?? 0,
      longEntries: symbolStatsAggregate._sum.longEntries ?? 0,
      shortEntries: symbolStatsAggregate._sum.shortEntries ?? 0,
      exits: symbolStatsAggregate._sum.exits ?? 0,
      dcaCount: symbolStatsAggregate._sum.dcaCount ?? 0,
      closedTrades: symbolStatsAggregate._sum.closedTrades ?? 0,
      winningTrades: pendingPnlEvent || unresolvedPosition ? null : symbolStatsAggregate._sum.winningTrades ?? 0,
      losingTrades: pendingPnlEvent || unresolvedPosition ? null : symbolStatsAggregate._sum.losingTrades ?? 0,
      realizedPnl: pendingPnlEvent || unresolvedPosition ? null : symbolStatsAggregate._sum.realizedPnl ?? 0,
      grossProfit: pendingPnlEvent || unresolvedPosition ? null : symbolStatsAggregate._sum.grossProfit ?? 0,
      grossLoss: pendingPnlEvent || unresolvedPosition ? null : symbolStatsAggregate._sum.grossLoss ?? 0,
      feesPaid: pendingFeeEvent || unresolvedFee ? null : symbolStatsAggregate._sum.feesPaid ?? 0,
      openPositionCount: symbolStatsAggregate._sum.openPositionCount ?? 0,
      openPositionQty: symbolStatsAggregate._sum.openPositionQty ?? 0,
    },
  };
};
