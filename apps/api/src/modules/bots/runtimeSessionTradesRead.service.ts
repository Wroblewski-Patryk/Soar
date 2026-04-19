import { Prisma } from '@prisma/client';
import { normalizeSymbol } from '../../lib/symbols';
import { getOwnedBotRuntimeSession, resolveSessionWindowEnd } from './botOwnership.service';
import { ListBotRuntimeTradesQueryDto } from './bots.types';
import { buildCloseReasonLookup, RuntimeTradeActionReason } from './runtimeTradeActionReason.service';
import { buildLifecycleActionByTradeId, toPositionMetaById } from './runtimeTradeLifecycle.service';
import {
  getRuntimeTradeBotContext,
  listRuntimeTradeCarryOverPositionIds,
  listRuntimeTradeCloseEventRows,
  listRuntimeTradePositionMetaRows,
  listRuntimeTradePositionTradeRows,
  listRuntimeTradeRows,
} from './runtimeSessionTradesRead.repository';

export const listBotRuntimeSessionTrades = async (
  userId: string,
  botId: string,
  sessionId: string,
  query: ListBotRuntimeTradesQueryDto
) => {
  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;
  const botContext = await getRuntimeTradeBotContext(userId, botId);
  if (!botContext) return null;

  const botScopedTradeWhere: Prisma.TradeWhereInput =
    botContext.mode === 'LIVE' && botContext.walletId
      ? { botId, walletId: botContext.walletId }
      : { botId };

  const normalizedSymbol = normalizeSymbol(query.symbol) || undefined;
  const normalizedSide = query.side;
  const normalizedAction = query.action;
  const isLegacyLimitOnly =
    query.limit != null &&
    query.page == null &&
    query.pageSize == null &&
    query.sortBy == null &&
    query.sortDir == null &&
    query.side == null &&
    query.action == null &&
    query.from == null &&
    query.to == null;
  const page = isLegacyLimitOnly ? 1 : Math.max(1, query.page ?? 1);
  const pageSize = Math.min(
    200,
    Math.max(1, isLegacyLimitOnly ? query.limit : (query.pageSize ?? query.limit ?? 50))
  );
  const sortBy = query.sortBy ?? 'executedAt';
  const sortDir = query.sortDir ?? 'desc';
  const windowEnd = resolveSessionWindowEnd(session);
  const rangeStart = query.from
    ? new Date(Math.max(query.from.getTime(), session.startedAt.getTime()))
    : session.startedAt;
  const rangeEnd = query.to
    ? new Date(Math.min(query.to.getTime(), windowEnd.getTime()))
    : windowEnd;
  if (rangeStart.getTime() > rangeEnd.getTime()) {
    return {
      sessionId,
      total: 0,
      meta: {
        page,
        pageSize,
        total: 0,
        totalPages: 0,
        hasPrev: page > 1,
        hasNext: false,
      },
      window: {
        startedAt: session.startedAt,
        finishedAt: windowEnd,
      },
      items: [],
    };
  }
  const windowClause: Prisma.TradeWhereInput = {
    executedAt: {
      gte: rangeStart,
      lte: rangeEnd,
    },
  };

  const shouldIncludeCarryOverPositions = !query.from && !query.to;
  const carryOverPositionIds = shouldIncludeCarryOverPositions
    ? await listRuntimeTradeCarryOverPositionIds({
        userId,
        ...(botScopedTradeWhere as Prisma.PositionWhereInput),
        managementMode: 'BOT_MANAGED',
        ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
        openedAt: {
          lte: windowEnd,
        },
        OR: [{ closedAt: null }, { closedAt: { gte: session.startedAt } }],
      })
    : [];

  const where: Prisma.TradeWhereInput = {
    userId,
    ...botScopedTradeWhere,
    ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
    ...(normalizedSide ? { side: normalizedSide } : {}),
    OR:
      carryOverPositionIds.length > 0
        ? [
            windowClause,
            {
              AND: [
                { positionId: { in: carryOverPositionIds } },
                {
                  executedAt: {
                    lte: rangeEnd,
                  },
                },
              ],
            },
          ]
        : [windowClause],
  };

  const rows = await listRuntimeTradeRows(where);
  const closeEventRows = await listRuntimeTradeCloseEventRows({
    userId,
    botId,
    sessionId,
    eventType: 'POSITION_CLOSED',
    eventAt: {
      gte: rangeStart,
      lte: rangeEnd,
    },
    ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
  });

  const { closeReasonByOrderId, closeReasonByPositionId } = buildCloseReasonLookup(closeEventRows);

  const positionIds = [
    ...new Set(rows.map((trade) => trade.positionId).filter((value): value is string => Boolean(value))),
  ];

  let positionMetaById = new Map<string, { side: 'LONG' | 'SHORT'; leverage: number; entryPrice: number }>();
  const lifecycleActionByTradeId = new Map<string, 'OPEN' | 'DCA' | 'CLOSE' | 'UNKNOWN'>();

  if (positionIds.length > 0) {
    const [positionMetaRows, allPositionTrades] = await Promise.all([
      listRuntimeTradePositionMetaRows({
        id: { in: positionIds },
        userId,
      }),
      listRuntimeTradePositionTradeRows({
        userId,
        ...botScopedTradeWhere,
        positionId: {
          in: positionIds,
        },
      }),
    ]);

    positionMetaById = toPositionMetaById(positionMetaRows);
    const lifecycleMap = buildLifecycleActionByTradeId({
      positionMetaById,
      positionTrades: allPositionTrades,
    });
    for (const [tradeId, lifecycleAction] of lifecycleMap.entries()) {
      lifecycleActionByTradeId.set(tradeId, lifecycleAction);
    }
  }

  const enrichedRows = rows
    .map((trade) => {
      const notional = trade.price * trade.quantity;
      const positionMeta = positionMetaById.get(trade.positionId ?? '');
      const leverage = positionMeta?.leverage ?? 1;
      const effectiveLeverage = Number.isFinite(leverage) && leverage > 0 ? leverage : 1;
      const inferredLifecycleAction =
        trade.lifecycleAction && trade.lifecycleAction !== 'UNKNOWN'
          ? trade.lifecycleAction
          : lifecycleActionByTradeId.get(trade.id) ?? 'UNKNOWN';
      const actionReason: RuntimeTradeActionReason =
        inferredLifecycleAction === 'OPEN'
          ? 'SIGNAL_ENTRY'
          : inferredLifecycleAction === 'DCA'
            ? 'DCA_LEVEL'
            : inferredLifecycleAction === 'CLOSE'
              ? closeReasonByOrderId.get(trade.orderId ?? '')?.reason ??
                closeReasonByPositionId.get(trade.positionId ?? '')?.reason ??
                (trade.managementMode === 'MANUAL_MANAGED' ? 'MANUAL' : 'UNKNOWN')
              : 'UNKNOWN';
      const marginNotional =
        inferredLifecycleAction === 'CLOSE' && positionMeta
          ? positionMeta.entryPrice * trade.quantity
          : notional;

      return {
        id: trade.id,
        symbol: trade.symbol,
        side: trade.side,
        price: trade.price,
        quantity: trade.quantity,
        fee: trade.fee ?? 0,
        feeSource: trade.feeSource,
        feePending: trade.feePending,
        feeCurrency: trade.feeCurrency ?? null,
        realizedPnl: trade.realizedPnl ?? 0,
        executedAt: trade.executedAt,
        createdAt: trade.createdAt,
        orderId: trade.orderId,
        positionId: trade.positionId,
        strategyId: trade.strategyId,
        origin: trade.origin,
        managementMode: trade.managementMode,
        lifecycleAction: inferredLifecycleAction,
        actionReason,
        notional,
        margin: marginNotional / effectiveLeverage,
      };
    })
    .filter((trade) => (normalizedAction ? trade.lifecycleAction === normalizedAction : true));

  const primaryCompare = (
    left: (typeof enrichedRows)[number],
    right: (typeof enrichedRows)[number]
  ) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const compareNumbers = (a: number, b: number) => (a === b ? 0 : a > b ? 1 : -1) * dir;
    const compareStrings = (a: string, b: string) => a.localeCompare(b) * dir;
    switch (sortBy) {
      case 'symbol':
        return compareStrings(left.symbol, right.symbol);
      case 'side':
        return compareStrings(left.side, right.side);
      case 'lifecycleAction':
        return compareStrings(left.lifecycleAction, right.lifecycleAction);
      case 'margin':
        return compareNumbers(left.margin, right.margin);
      case 'fee':
        return compareNumbers(left.fee, right.fee);
      case 'realizedPnl':
        return compareNumbers(left.realizedPnl, right.realizedPnl);
      case 'executedAt':
      default:
        return compareNumbers(left.executedAt.getTime(), right.executedAt.getTime());
    }
  };

  const sortedRows = [...enrichedRows].sort((left, right) => {
    const first = primaryCompare(left, right);
    if (first !== 0) return first;
    const byExecuted = right.executedAt.getTime() - left.executedAt.getTime();
    if (byExecuted !== 0) return byExecuted;
    const byCreated = right.createdAt.getTime() - left.createdAt.getTime();
    if (byCreated !== 0) return byCreated;
    return right.id.localeCompare(left.id);
  });

  const total = sortedRows.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const pagedRows = sortedRows.slice(offset, offset + pageSize);

  return {
    sessionId,
    total,
    meta: {
      page: safePage,
      pageSize,
      total,
      totalPages,
      hasPrev: safePage > 1 && totalPages > 0,
      hasNext: safePage < totalPages,
    },
    window: {
      startedAt: session.startedAt,
      finishedAt: windowEnd,
    },
    items: pagedRows.map((trade) => {
      const { createdAt: _createdAt, ...rest } = trade;
      return rest;
    }),
  };
};
