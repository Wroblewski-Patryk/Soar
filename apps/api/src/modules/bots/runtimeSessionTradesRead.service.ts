import { Prisma } from '@prisma/client';
import { normalizeSymbol } from '../../lib/symbols';
import { getOwnedBotRuntimeSession, resolveSessionWindowEnd } from './botOwnership.service';
import { ListBotRuntimeTradesQueryDto } from './bots.types';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from './runtimeSymbolCatalogResolver.service';
import { normalizeSymbols } from './runtimeSymbolUniverse.service';
import {
  listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex,
} from './runtimeExternalPositionOwner.service';
import {
  buildCloseReasonLookup,
  normalizeCloseReason,
  RuntimeTradeActionReason,
} from './runtimeTradeActionReason.service';
import { buildLifecycleActionByTradeId, toPositionMetaById } from './runtimeTradeLifecycle.service';
import {
  getRuntimeTradeBotContext,
  listRuntimeTradeAnchorPositionRows,
  listRuntimeTradeCarryOverPositionIds,
  listRuntimeTradeCloseEventRows,
  listRuntimeTradePositionMetaRows,
  listRuntimeTradePositionTradeRows,
  listRuntimeTradeRows,
} from './runtimeSessionTradesRead.repository';

type RuntimeTradeAnchorPositionRow = Awaited<ReturnType<typeof listRuntimeTradeAnchorPositionRows>>[number];

const toOpenAnchorTradeSide = (side: 'LONG' | 'SHORT') => (side === 'LONG' ? 'BUY' : 'SELL');

const shouldIncludeOpenAnchor = (input: {
  position: RuntimeTradeAnchorPositionRow;
  rangeStart: Date;
  rangeEnd: Date;
  shouldIncludeCarryOverPositions: boolean;
  normalizedSide?: 'BUY' | 'SELL';
  normalizedAction?: 'OPEN' | 'DCA' | 'CLOSE' | 'UNKNOWN';
}) => {
  if (input.position.status !== 'OPEN') return false;
  if (input.position.origin !== 'EXCHANGE_SYNC') return false;
  if (input.normalizedAction && input.normalizedAction !== 'OPEN') return false;

  const side = toOpenAnchorTradeSide(input.position.side);
  if (input.normalizedSide && side !== input.normalizedSide) return false;

  const openedAtMs = input.position.openedAt.getTime();
  const inExplicitWindow =
    openedAtMs >= input.rangeStart.getTime() && openedAtMs <= input.rangeEnd.getTime();
  if (inExplicitWindow) return true;

  return input.shouldIncludeCarryOverPositions && openedAtMs <= input.rangeEnd.getTime();
};

const isPersistedImportedOpenAnchorTrade = (trade: {
  origin: string;
  lifecycleAction: 'OPEN' | 'DCA' | 'CLOSE' | 'UNKNOWN' | null;
  exchangeTradeId: string | null;
}) => trade.origin === 'EXCHANGE_SYNC' && trade.lifecycleAction === 'OPEN' && trade.exchangeTradeId == null;

const emptyRuntimeTradesResponse = (params: {
  sessionId: string;
  page: number;
  pageSize: number;
  windowStart: Date;
  windowEnd: Date;
}) => ({
  sessionId: params.sessionId,
  total: 0,
  meta: {
    page: params.page,
    pageSize: params.pageSize,
    total: 0,
    totalPages: 0,
    hasPrev: params.page > 1,
    hasNext: false,
  },
  window: {
    startedAt: params.windowStart,
    finishedAt: params.windowEnd,
  },
  items: [],
});

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

  const botScopedPositionWhere: Prisma.PositionWhereInput =
    botContext.mode === 'LIVE' && botContext.walletId
      ? {
          botId,
          OR: [{ walletId: botContext.walletId }, { walletId: null }],
        }
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
  const configuredSymbolGroup =
    botContext.botMarketGroups[0]?.symbolGroup ?? botContext.symbolGroup ?? null;
  const configuredSymbols = normalizeSymbols(
    configuredSymbolGroup
      ? await resolveEffectiveSymbolGroupSymbolsWithCatalog(configuredSymbolGroup, new Map<string, string[]>())
      : []
  );
  if (normalizedSymbol && !configuredSymbols.includes(normalizedSymbol)) {
    return emptyRuntimeTradesResponse({
      sessionId,
      page,
      pageSize,
      windowStart: rangeStart,
      windowEnd: rangeEnd,
    });
  }
  const scopedSymbols = normalizedSymbol ? [normalizedSymbol] : configuredSymbols;
  if (scopedSymbols.length === 0) {
    return emptyRuntimeTradesResponse({
      sessionId,
      page,
      pageSize,
      windowStart: rangeStart,
      windowEnd: rangeEnd,
    });
  }
  const ownershipIndex = await resolveExternalPositionOwnershipIndex(userId, botContext.mode);
  const botApiKeyId = botContext.wallet?.apiKeyId ?? botContext.apiKeyId ?? null;
  const ownedExternalSymbols = listOwnedExternalSymbolsForBot(ownershipIndex, {
    apiKeyId: botApiKeyId,
    botId,
    walletId: botContext.walletId,
  });
  const externalOwnedPositionWhere: Prisma.PositionWhereInput[] =
    ownedExternalSymbols.length > 0 && botApiKeyId
      ? [
          {
            botId: null,
            origin: 'EXCHANGE_SYNC',
            externalId: { startsWith: `${botApiKeyId}:` },
            symbol: { in: ownedExternalSymbols },
            ...(botContext.mode === 'LIVE' && botContext.walletId
              ? {
                  OR: [{ walletId: botContext.walletId }, { walletId: null }],
                }
              : {}),
          },
        ]
      : [];
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
  const scopedPositionIds = await listRuntimeTradeCarryOverPositionIds({
    userId,
    managementMode: 'BOT_MANAGED',
    symbol: { in: scopedSymbols },
    openedAt: {
      lte: windowEnd,
    },
    AND: [
      { OR: [botScopedPositionWhere, ...externalOwnedPositionWhere] },
      { OR: [{ closedAt: null }, { closedAt: { gte: session.startedAt } }] },
    ],
  });
  const shouldIncludeCarryOverPositions = !query.from && !query.to;

  const where: Prisma.TradeWhereInput = {
    userId,
    symbol: { in: scopedSymbols },
    ...(normalizedSide ? { side: normalizedSide } : {}),
    OR: [
      ...(scopedPositionIds.length > 0
        ? [
            {
              positionId: { in: scopedPositionIds },
              ...(shouldIncludeCarryOverPositions
                ? {
                    OR: [
                      windowClause,
                      {
                        executedAt: {
                          lte: rangeEnd,
                        },
                      },
                    ],
                  }
                : windowClause),
            },
          ]
        : []),
      {
        botId,
        positionId: null,
        ...windowClause,
      },
    ],
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
    ...new Set(
      [...scopedPositionIds, ...rows.map((trade) => trade.positionId).filter((value): value is string => Boolean(value))]
    ),
  ];

  let positionMetaById = new Map<string, { side: 'LONG' | 'SHORT'; leverage: number; entryPrice: number }>();
  const lifecycleActionByTradeId = new Map<string, 'OPEN' | 'DCA' | 'CLOSE' | 'UNKNOWN'>();
  let anchorPositions: RuntimeTradeAnchorPositionRow[] = [];
  let tradesByPositionId = new Map<string, typeof rows>();

  if (positionIds.length > 0) {
    const [positionMetaRows, allPositionTrades, anchorPositionRows] = await Promise.all([
      listRuntimeTradePositionMetaRows({
        id: { in: positionIds },
        userId,
      }),
      listRuntimeTradePositionTradeRows({
        userId,
        positionId: {
          in: positionIds,
        },
      }),
      listRuntimeTradeAnchorPositionRows({
        id: { in: positionIds },
        userId,
      }),
    ]);

    positionMetaById = toPositionMetaById(positionMetaRows);
    anchorPositions = anchorPositionRows;
    const lifecycleMap = buildLifecycleActionByTradeId({
      positionMetaById,
      positionTrades: allPositionTrades,
    });
    for (const [tradeId, lifecycleAction] of lifecycleMap.entries()) {
      lifecycleActionByTradeId.set(tradeId, lifecycleAction);
    }
    tradesByPositionId = rows.reduce((map, trade) => {
      const positionId = trade.positionId;
      if (!positionId) return map;
      const current = map.get(positionId);
      if (current) {
        current.push(trade);
      } else {
        map.set(positionId, [trade]);
      }
      return map;
    }, new Map<string, typeof rows>());
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
          ? isPersistedImportedOpenAnchorTrade(trade)
            ? 'POSITION_LIFETIME'
            : 'SIGNAL_ENTRY'
          : inferredLifecycleAction === 'DCA'
            ? 'DCA_LEVEL'
            : inferredLifecycleAction === 'CLOSE'
              ? normalizeCloseReason(trade.closeReason) ??
                closeReasonByOrderId.get(trade.orderId ?? '')?.reason ??
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
        closeReason: trade.closeReason ?? null,
        closeInitiator: trade.closeInitiator ?? null,
        lifecycleAction: inferredLifecycleAction,
        actionReason,
        notional,
        margin: marginNotional / effectiveLeverage,
      };
    })
    .filter((trade) => (normalizedAction ? trade.lifecycleAction === normalizedAction : true));

  const anchorRows = anchorPositions
    .filter((position) => {
      const existingPositionTrades = tradesByPositionId.get(position.id) ?? [];
      if (existingPositionTrades.length > 0) return false;
      return shouldIncludeOpenAnchor({
        position,
        rangeStart,
        rangeEnd,
        shouldIncludeCarryOverPositions,
        normalizedSide,
        normalizedAction,
      });
    })
    .map((position) => {
      const leverage =
        Number.isFinite(position.leverage) && position.leverage > 0 ? position.leverage : 1;
      const notional = position.entryPrice * position.quantity;
      const margin =
        typeof position.marginUsed === 'number' && Number.isFinite(position.marginUsed)
          ? position.marginUsed
          : notional / leverage;
      return {
        id: `position-open:${position.id}`,
        symbol: position.symbol,
        side: toOpenAnchorTradeSide(position.side),
        price: position.entryPrice,
        quantity: position.quantity,
        fee: 0,
        feeSource: 'ESTIMATED' as const,
        feePending: false,
        feeCurrency: null,
        realizedPnl: 0,
        executedAt: position.openedAt,
        createdAt: position.openedAt,
        orderId: '',
        positionId: position.id,
        strategyId: position.strategyId ?? '',
        origin: position.origin,
        managementMode: position.managementMode,
        closeReason: null,
        closeInitiator: null,
        lifecycleAction: 'OPEN' as const,
        actionReason: 'POSITION_LIFETIME' as const,
        notional,
        margin,
      };
    });

  const historyRows = [...enrichedRows, ...anchorRows];

  const primaryCompare = (
    left: (typeof historyRows)[number],
    right: (typeof historyRows)[number]
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

  const sortedRows = [...historyRows].sort((left, right) => {
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
