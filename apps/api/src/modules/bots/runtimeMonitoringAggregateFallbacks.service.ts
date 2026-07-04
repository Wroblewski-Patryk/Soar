import { prisma } from '../../prisma/client';
import type { listRuntimeSessionsWithSummary } from './runtimeSessionsRead.service';
import type { listBotRuntimeSessionPositions } from './runtimeSessionPositionsRead.service';
import type { listBotRuntimeSessionSymbolStats } from './runtimeSessionSymbolStatsRead.service';
import type { listBotRuntimeSessionTrades } from './runtimeSessionTradesRead.service';
import { buildRuntimeAggregateTradesMeta } from './runtimeMonitoringAggregateProjectors';

type RuntimeSessionListItem = Awaited<ReturnType<typeof listRuntimeSessionsWithSummary>>[number];
type RuntimeSymbolStatsResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionSymbolStats>>>;
type RuntimePositionsResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionPositions>>>;
type RuntimeTradesResponse = NonNullable<Awaited<ReturnType<typeof listBotRuntimeSessionTrades>>>;

export const resolveAggregateSessionWindowEnd = (session: RuntimeSessionListItem) =>
  session.finishedAt ?? session.lastHeartbeatAt ?? session.startedAt;

export const buildEmptyAggregatePayload = (params: {
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

export const buildEmptyAggregateSymbolStatsPayload = (params: {
  session: RuntimeSessionListItem;
}): RuntimeSymbolStatsResponse => ({
  sessionId: params.session.id,
  items: [],
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
});

export const buildEmptyAggregatePositionsPayload = (params: {
  session: RuntimeSessionListItem;
}): RuntimePositionsResponse => {
  const finishedAt = resolveAggregateSessionWindowEnd(params.session);
  return {
    sessionId: params.session.id,
    total: 0,
    openCount: 0,
    closedCount: 0,
    openOrdersCount: 0,
    showDynamicStopColumns: false,
    window: {
      startedAt: params.session.startedAt,
      finishedAt,
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
    openOrders: [],
    openItems: [],
    historyItems: [],
  };
};

export const buildFallbackAggregatePositionsPayload = async (params: {
  botId: string;
  userId: string;
  session: RuntimeSessionListItem;
  symbol: string | undefined;
  limit: number;
}): Promise<RuntimePositionsResponse> => {
  const finishedAt = resolveAggregateSessionWindowEnd(params.session);
  const symbol = params.symbol?.trim().toUpperCase();
  const symbolWhere = symbol ? { symbol } : {};
  const baseWhere = {
    userId: params.userId,
    botId: params.botId,
    managementMode: 'BOT_MANAGED' as const,
    ...symbolWhere,
  };
  const openWhere = {
    ...baseWhere,
    status: 'OPEN' as const,
    closedAt: null,
  };
  const closedWhere = {
    ...baseWhere,
    status: 'CLOSED' as const,
    closedAt: {
      gte: params.session.startedAt,
      lte: finishedAt,
    },
  };

  const [openPositions, closedPositions, openCount, closedCount, openOrders, openQty, unrealizedPnl, realizedPnl] =
    await Promise.all([
      prisma.position.findMany({
        where: openWhere,
        orderBy: [{ openedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
        take: params.limit,
        select: {
          id: true,
          origin: true,
          managementMode: true,
          syncState: true,
          continuityState: true,
          symbol: true,
          side: true,
          status: true,
          openedAt: true,
          closedAt: true,
          entryPrice: true,
          quantity: true,
          leverage: true,
          marginUsed: true,
          closeReason: true,
          closeInitiator: true,
          stopLoss: true,
          takeProfit: true,
          realizedPnl: true,
          unrealizedPnl: true,
        },
      }),
      prisma.position.findMany({
        where: closedWhere,
        orderBy: [{ closedAt: 'desc' }, { id: 'asc' }],
        take: params.limit,
        select: {
          id: true,
          closedAt: true,
          realizedPnl: true,
        },
      }),
      prisma.position.count({ where: openWhere }),
      prisma.position.count({ where: closedWhere }),
      prisma.order.findMany({
        where: {
          userId: params.userId,
          botId: params.botId,
          managementMode: 'BOT_MANAGED',
          status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'] },
          ...(symbol ? { symbol } : {}),
        },
        orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }, { id: 'asc' }],
        take: params.limit,
        select: {
          id: true,
          origin: true,
          exchangeOrderId: true,
          symbol: true,
          side: true,
          type: true,
          status: true,
          quantity: true,
          filledQuantity: true,
          price: true,
          stopPrice: true,
          submittedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.position.aggregate({
        where: openWhere,
        _sum: { quantity: true },
      }),
      prisma.position.aggregate({
        where: openWhere,
        _sum: { unrealizedPnl: true },
      }),
      prisma.position.aggregate({
        where: closedWhere,
        _sum: { realizedPnl: true },
      }),
    ]);

  const positionIds = [...openPositions.map((position) => position.id), ...closedPositions.map((position) => position.id)];
  const feesPaid =
    positionIds.length > 0
      ? (
          await prisma.trade.aggregate({
            where: {
              userId: params.userId,
              botId: params.botId,
              positionId: { in: positionIds },
            },
            _sum: { fee: true },
          })
        )._sum.fee ?? 0
      : 0;

  return {
    sessionId: params.session.id,
    total: openCount + closedCount,
    openCount,
    closedCount,
    openOrdersCount: openOrders.length,
    showDynamicStopColumns: false,
    window: {
      startedAt: params.session.startedAt,
      finishedAt,
    },
    summary: {
      realizedPnl: realizedPnl._sum.realizedPnl ?? 0,
      unrealizedPnl: unrealizedPnl._sum.unrealizedPnl ?? 0,
      feesPaid,
      openPositionQty: openQty._sum.quantity ?? 0,
      referenceBalance: null,
      freeCash: null,
      accountBalance: null,
      baseCurrency: null,
      capitalSource: null,
      allocationMode: null,
      allocationValue: null,
      paperResetAt: null,
    },
    openOrders: openOrders as RuntimePositionsResponse['openOrders'],
    openItems: openPositions.map((position) => ({
      id: position.id,
      origin: position.origin,
      managementMode: position.managementMode,
      syncState: position.syncState,
      continuityState: position.continuityState,
      takeoverStatus: 'NONE',
      symbol: position.symbol,
      side: position.side,
      status: position.status,
      quantity: position.quantity,
      leverage: position.leverage,
      marginUsed: position.marginUsed,
      closeReason: position.closeReason,
      closeInitiator: position.closeInitiator,
      strategyAutomationContextResolved: false,
      actionable: false,
      entryPrice: position.entryPrice,
      openedAt: position.openedAt,
      closedAt: position.closedAt,
      entryNotional: position.entryPrice * position.quantity,
      exitPrice: null,
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit,
      holdMs: Math.max(0, finishedAt.getTime() - position.openedAt.getTime()),
      dcaCount: 0,
      dcaPlannedLevels: [],
      dcaExecutedLevels: [],
      trailingStopLevels: [],
      trailingTakeProfitLevels: [],
      feesPaid: 0,
      realizedPnl: position.realizedPnl ?? 0,
      unrealizedPnl: position.unrealizedPnl,
      unrealizedPnlPercent: null,
      markPrice: null,
      markPriceSource: 'unavailable',
      dynamicTtpStopLoss: null,
      dynamicTtpStopLossSource: null,
      dynamicTslStopLoss: null,
      firstTradeAt: null,
      lastTradeAt: null,
      tradesCount: 0,
    })) as unknown as RuntimePositionsResponse['openItems'],
    historyItems: closedPositions as RuntimePositionsResponse['historyItems'],
  };
};

export const buildEmptyAggregateTradesPayload = (params: {
  session: RuntimeSessionListItem;
  perSessionLimit: number;
}): RuntimeTradesResponse => {
  const finishedAt = resolveAggregateSessionWindowEnd(params.session);
  return {
    sessionId: params.session.id,
    total: 0,
    feesPaid: 0,
    meta: buildRuntimeAggregateTradesMeta({
      totalTrades: 0,
      returnedItemsCount: 0,
      pageSize: params.perSessionLimit,
    }),
    window: {
      startedAt: params.session.startedAt,
      finishedAt,
    },
    items: [],
  };
};
