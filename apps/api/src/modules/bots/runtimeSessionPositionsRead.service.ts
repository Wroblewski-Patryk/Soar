import { Prisma } from '@prisma/client';
import { runtimePositionAutomationService } from '../engine/runtimePositionAutomation.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { resolveRuntimeCapitalSnapshot } from '../engine/runtimeCapitalContext.service';
import { getRuntimeTicker } from '../engine/runtimeTickerStore';
import { PositionManagementState } from '../engine/positionManagement.types';
import { normalizeSymbol } from '../../lib/symbols';
import { ListBotRuntimePositionsQueryDto } from './bots.types';
import {
  cleanupStaleRuntimePositionSerializationState,
  resolveDcaExecutedLevels,
  resolveRuntimePositionDynamicStops,
  TrailingStopDisplayLevel,
  TrailingTakeProfitDisplayLevel,
} from './runtimePositionSerialization.service';
import {
  resolveDcaPlannedLevelsFromStrategyConfig,
  resolveTrailingStopLevelsFromStrategyConfig,
  resolveTrailingTakeProfitLevelsFromStrategyConfig,
} from './runtimeStrategyConfigParser.service';
import {
  resolveBotAdvancedCloseMode,
  resolveBotDcaPlanBySymbol,
  resolveBotTrailingStopLevelsBySymbol,
  resolveBotTrailingTakeProfitLevelsBySymbol,
} from './runtimeStrategyDisplayBySymbol.service';
import { fetchFallbackTickerPrices } from './runtimeMarketDataFallback.service';
import { getOwnedBotRuntimeSession, resolveSessionWindowEnd } from './botOwnership.service';
import {
  listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex,
} from './runtimeExternalPositionOwner.service';
import { buildImportedExternalPositionMarketPrefix, buildLegacyImportedExternalPositionSymbolPrefix } from '../positions/livePositionReconciliation.helpers';
import {
  countRuntimeManagedPositions,
  getRuntimePositionBotContext,
  listRuntimeManagedPositions,
  listRuntimeOpenOrders,
  listRuntimePositionLastPrices,
  listRuntimePositionStrategies,
  listRuntimePositionTradeRows,
  sumRuntimeManagedPositionMarginUsed,
  sumRuntimeManagedPositionQuantity,
  sumRuntimeManagedPositionRealizedPnl,
  sumRuntimeManagedPositionTradeFees,
  sumRuntimeManagedPositionUnrealizedPnl,
} from './runtimeSessionPositionsRead.repository';
import {
  resolveCanonicalRuntimeVenueContext,
  resolveInheritedRuntimeExecutionContext,
} from '../engine/runtimeBotExecutionContext';
import { resolveModeledMarginUsed, resolvePositionPnlFraction } from '../engine/positionPnlSemantics';
import { resolvePreferredRuntimeOrExchangeSyncedPriceWithSource } from './runtimeExchangeSyncedPositionPrice';
import { hasMaterialCanonicalBasisDrift } from '../engine/runtimePositionAutomationStateRebase';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from './runtimeSymbolCatalogResolver.service';
import { normalizeSymbols } from './runtimeSymbolUniverse.service';
import { resolveRuntimePositionDcaCount } from './runtimeSessionPositionDcaCount';
import { buildRuntimeSessionClosedPositionWindow } from './runtimeSessionPositionWindow';
import { buildBotlessWalletTradeFallbackWhere } from './runtimeSessionTradeFallbackScope';
import { canUseStrategyProtectionFallbackForDisplay } from './runtimeStrategyProtectionFallbackDisplay';
import {
  hasRemainingDcaLevelsForDisplaySide,
  resolveRuntimePositionActionableForDisplay,
  resolveRuntimeStrategyAutomationContext,
} from './runtimeDcaProtectionDisplay.service';

type RuntimeTakeoverStatus = 'OWNED_AND_MANAGED' | 'UNOWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY';

type RuntimeOpenOrderRow = Awaited<ReturnType<typeof listRuntimeOpenOrders>>[number];
type RuntimeManagedPositionRow = Awaited<ReturnType<typeof listRuntimeManagedPositions>>[number];
type RuntimePositionTradeRow = Awaited<ReturnType<typeof listRuntimePositionTradeRows>>[number];

const RUNTIME_OPEN_ORDER_DEDUPE_CANDIDATE_LIMIT = 500;

const resolveRuntimeTakeoverStatus = (input: {
  origin: string;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  syncState: string;
  botId: string | null;
}): RuntimeTakeoverStatus | null => {
  if (input.origin !== 'EXCHANGE_SYNC') return null;
  if (input.managementMode === 'MANUAL_MANAGED') return 'MANUAL_ONLY';
  if (input.botId) return 'OWNED_AND_MANAGED';
  return input.syncState === 'DRIFT' ? 'AMBIGUOUS' : 'UNOWNED';
};

const runtimeVisibleOpenPositionSyncWhere: Prisma.PositionWhereInput = {
  OR: [
    { syncState: 'IN_SYNC' },
    {
      origin: 'EXCHANGE_SYNC',
      syncState: 'DRIFT',
      continuityState: 'RECOVERED_UNACTIONABLE',
    },
  ],
};

const resolveSingleBotStrategyContext = (botContext: Awaited<ReturnType<typeof getRuntimePositionBotContext>>) => {
  if (!botContext) return null;
  const enabledCanonicalStrategyIds = [
    ...new Set(
      (botContext.botMarketGroups ?? []).flatMap((group) =>
        group.strategyLinks.map((link) => link.strategyId)
      )
    ),
  ];
  if (enabledCanonicalStrategyIds.length === 1) return enabledCanonicalStrategyIds[0];
  if (enabledCanonicalStrategyIds.length > 1) return null;
  return null;
};

const selectPreferredRuntimeOpenOrder = (
  current: RuntimeOpenOrderRow,
  candidate: RuntimeOpenOrderRow
): RuntimeOpenOrderRow => {
  if (current.origin === candidate.origin) {
    return current.updatedAt >= candidate.updatedAt ? current : candidate;
  }
  if (candidate.origin === 'EXCHANGE_SYNC') return candidate;
  if (current.origin === 'EXCHANGE_SYNC') return current;
  return current.updatedAt >= candidate.updatedAt ? current : candidate;
};

const dedupeRuntimeOpenOrders = (orders: RuntimeOpenOrderRow[]) => {
  const byIdentity = new Map<string, RuntimeOpenOrderRow>();

  for (const order of orders) {
    const exchangeOrderId = order.exchangeOrderId?.trim();
    const identity = exchangeOrderId ? `exchange:${exchangeOrderId}` : `local:${order.id}`;
    const existing = byIdentity.get(identity);
    if (!existing) {
      byIdentity.set(identity, order);
      continue;
    }
    byIdentity.set(identity, selectPreferredRuntimeOpenOrder(existing, order));
  }

  return [...byIdentity.values()].sort((left, right) => {
    const leftTime = left.createdAt.getTime();
    const rightTime = right.createdAt.getTime();
    if (leftTime !== rightTime) return rightTime - leftTime;
    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });
};

const selectRuntimeOpenOrders = (orders: RuntimeOpenOrderRow[], limit: number) => {
  const items = dedupeRuntimeOpenOrders(orders); return { count: items.length, items: items.slice(0, limit) };
};

const sortRuntimePositionTrades = (trades: RuntimePositionTradeRow[]) =>
  [...trades].sort((left, right) => left.executedAt.getTime() - right.executedAt.getTime());

const nullableIdentityMatches = (left: string | null, right: string | null) =>
  !left || !right || left === right;

const strategyIdentityMatches = (positionStrategyId: string | null, tradeStrategyId: string | null) =>
  !positionStrategyId || !tradeStrategyId || positionStrategyId === tradeStrategyId;

const isSupplementalDcaTradeForOpenPosition = (
  position: RuntimeManagedPositionRow,
  trade: RuntimePositionTradeRow,
  entrySide: 'BUY' | 'SELL',
  continuityStart: Date,
  windowEnd: Date
) => {
  if (position.status !== 'OPEN') return false;
  if (trade.positionId === position.id) return false;
  if (trade.lifecycleAction !== 'DCA') return false;
  if (trade.symbol !== position.symbol) return false;
  if (trade.side !== entrySide) return false;
  if (trade.executedAt < continuityStart || trade.executedAt > windowEnd) return false;
  if (!nullableIdentityMatches(position.botId, trade.botId)) return false;
  if (!nullableIdentityMatches(position.walletId, trade.walletId)) return false;
  if (!strategyIdentityMatches(position.strategyId, trade.strategyId)) return false;
  return true;
};

const tradeBelongsToRuntimePositionIdentity = (
  position: RuntimeManagedPositionRow,
  trade: RuntimePositionTradeRow
) => {
  if (trade.symbol !== position.symbol) return false;
  if (!nullableIdentityMatches(position.botId, trade.botId)) return false;
  if (!nullableIdentityMatches(position.walletId, trade.walletId)) return false;
  if (!strategyIdentityMatches(position.strategyId, trade.strategyId)) return false;
  return true;
};

const tradeBelongsToRuntimePositionContinuityBoundary = (
  position: RuntimeManagedPositionRow,
  trade: RuntimePositionTradeRow,
) => {
  if (trade.symbol !== position.symbol) return false;
  if (!nullableIdentityMatches(position.botId, trade.botId)) return false;
  if (!nullableIdentityMatches(position.walletId, trade.walletId)) return false;
  if (!position.strategyId) return true;
  return trade.strategyId === position.strategyId || trade.strategyId == null;
};

const resolveRuntimePositionContinuityStart = (
  position: RuntimeManagedPositionRow,
  lifecycleTrades: RuntimePositionTradeRow[],
  entrySide: 'BUY' | 'SELL',
  sessionStartedAt: Date,
  windowEnd: Date
) => {
  if (position.status !== 'OPEN') return position.openedAt;

  const sameLifecycleBoundaryTrades = sortRuntimePositionTrades(
    lifecycleTrades.filter((trade) => tradeBelongsToRuntimePositionContinuityBoundary(position, trade))
  );
  const sameIdentityTrades = sortRuntimePositionTrades(
    lifecycleTrades.filter((trade) => tradeBelongsToRuntimePositionIdentity(position, trade))
  );
  const latestExitBeforeCurrentOpen = sameLifecycleBoundaryTrades
    .filter((trade) => trade.side !== entrySide && trade.executedAt <= position.openedAt)
    .at(-1);
  const cutoff = latestExitBeforeCurrentOpen?.executedAt ?? sessionStartedAt;
  const firstOpenAfterCutoff = sameLifecycleBoundaryTrades.find(
    (trade) =>
      trade.lifecycleAction === 'OPEN' &&
      trade.side === entrySide &&
      trade.executedAt >= cutoff &&
      trade.executedAt <= windowEnd
  );

  return firstOpenAfterCutoff?.executedAt ?? cutoff;
};

const resolveRuntimePositionTrades = (
  position: RuntimeManagedPositionRow,
  tradesByPosition: Map<string, RuntimePositionTradeRow[]>,
  lifecycleTradesBySymbol: Map<string, RuntimePositionTradeRow[]>,
  sessionStartedAt: Date,
  windowEnd: Date
) => {
  const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
  const directTrades = tradesByPosition.get(position.id) ?? [];
  const lifecycleTrades = lifecycleTradesBySymbol.get(position.symbol) ?? [];
  const continuityStart = resolveRuntimePositionContinuityStart(
    position,
    lifecycleTrades,
    entrySide,
    sessionStartedAt,
    windowEnd
  );
  const supplementalDcaTrades = lifecycleTrades.filter((trade) =>
    isSupplementalDcaTradeForOpenPosition(position, trade, entrySide, continuityStart, windowEnd)
  );
  const byTradeId = new Map<string, RuntimePositionTradeRow>();
  for (const trade of directTrades) {
    byTradeId.set(trade.id, trade);
  }
  for (const trade of supplementalDcaTrades) {
    const hasStrategyMatchedSibling =
      trade.strategyId == null &&
      trade.positionId != null &&
      lifecycleTrades.some(
        (candidate) =>
          candidate.id !== trade.id &&
          candidate.positionId === trade.positionId &&
          candidate.lifecycleAction === 'DCA' &&
          candidate.side === trade.side &&
          candidate.strategyId != null &&
          strategyIdentityMatches(position.strategyId, candidate.strategyId)
      );
    if (!hasStrategyMatchedSibling) {
      byTradeId.set(trade.id, trade);
    }
  }
  return sortRuntimePositionTrades([...byTradeId.values()]);
};

const selectRuntimeDisplayState = (input: {
  position: {
    origin: 'BOT' | 'EXCHANGE_SYNC' | 'USER' | 'SYSTEM_REPAIR' | 'BACKTEST';
    quantity: number;
    entryPrice: number;
  };
  runtimeSnapshot: PositionManagementState | null;
  persistedState: PositionManagementState | null;
}) => {
  const isCanonical = (state: PositionManagementState | null) => {
    if (input.position.origin !== 'EXCHANGE_SYNC') return true;
    return !hasMaterialCanonicalBasisDrift({
      position: {
        origin: input.position.origin,
        quantity: input.position.quantity,
        entryPrice: input.position.entryPrice,
      },
      state: state
        ? {
            quantity: state.quantity,
            averageEntryPrice: state.averageEntryPrice,
          }
        : null,
    });
  };

  if (input.runtimeSnapshot && isCanonical(input.runtimeSnapshot)) return input.runtimeSnapshot;
  if (input.persistedState && isCanonical(input.persistedState)) return input.persistedState;
  return null;
};

export const listBotRuntimeSessionPositions = async (
  userId: string,
  botId: string,
  sessionId: string,
  query: ListBotRuntimePositionsQueryDto
) => {
  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;
  const showDynamicStopColumnsFromStrategyMode = await resolveBotAdvancedCloseMode(userId, botId);
  const normalizedSymbol = normalizeSymbol(query.symbol) || undefined;
  const windowEnd = resolveSessionWindowEnd(session);
  const botContext = await getRuntimePositionBotContext(userId, botId);
  if (!botContext) return null;
  const inheritedExecutionContext = resolveInheritedRuntimeExecutionContext({
    walletId: botContext.walletId,
    wallet: botContext.wallet,
    venueContext: resolveCanonicalRuntimeVenueContext(botContext),
  });
  if (!inheritedExecutionContext) return null;
  const configuredSymbolGroup =
    botContext.botMarketGroups[0]?.symbolGroup ?? botContext.symbolGroup ?? null;
  const configuredSymbols = normalizeSymbols(
    configuredSymbolGroup
      ? await resolveEffectiveSymbolGroupSymbolsWithCatalog(configuredSymbolGroup, new Map<string, string[]>())
      : []
  );
  const scopedSymbols =
    normalizedSymbol && configuredSymbols.includes(normalizedSymbol)
      ? [normalizedSymbol]
      : normalizedSymbol
        ? []
        : configuredSymbols;

  const botScopedPositionWhere: Prisma.PositionWhereInput =
    inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
      ? {
          botId,
          OR: [{ walletId: botContext.walletId }, { walletId: null }],
        }
      : { botId };
  const botScopedOrderWhere: Prisma.OrderWhereInput =
    inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
      ? {
          botId,
          OR: [{ walletId: botContext.walletId }, { walletId: null }],
        }
      : { botId };
  const botScopedTradeWhere: Prisma.TradeWhereInput =
    inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
      ? { botId, walletId: botContext.walletId }
      : { botId };
  const ownershipIndex = await resolveExternalPositionOwnershipIndex(userId, inheritedExecutionContext.mode);
  const botApiKeyId = botContext.wallet?.apiKeyId ?? botContext.apiKeyId ?? null, ownedExternalSymbols = listOwnedExternalSymbolsForBot(ownershipIndex, {
    apiKeyId: botApiKeyId, marketType: inheritedExecutionContext.marketType,
    botId,
    walletId: botContext.walletId,
  });
  const externalOwnedWhere: Prisma.PositionWhereInput[] =
    ownedExternalSymbols.length > 0 && botApiKeyId
      ? [
          {
            botId: null,
            origin: 'EXCHANGE_SYNC',
            symbol: { in: ownedExternalSymbols },
            AND: [
              {
                OR: [
                  { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: botApiKeyId, marketType: inheritedExecutionContext.marketType }) } },
                  ...ownedExternalSymbols.map((symbol) => ({ externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: botApiKeyId, symbol }) } })),
                ],
              },
              ...(inheritedExecutionContext.mode === 'LIVE' && botContext.walletId ? [{ OR: [{ walletId: botContext.walletId }, { walletId: null }] }] : []),
            ],
          },
        ]
      : [];
  const externalOwnedOrderWhere: Prisma.OrderWhereInput[] =
    ownedExternalSymbols.length > 0 && botApiKeyId
      ? [
          {
            botId: null,
            origin: 'EXCHANGE_SYNC',
            symbol: { in: ownedExternalSymbols },
            ...(inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
              ? {
                  walletId: botContext.walletId,
                }
              : {}),
          },
        ]
      : [];
  const botExchange = inheritedExecutionContext.exchange;
  const botMarketType = inheritedExecutionContext.marketType;
  const resolveRuntimeCapitalSummary = async (usedMargin: number) => {
    try {
      const snapshot = await resolveRuntimeCapitalSnapshot({
        userId,
        botId,
        walletId: botContext.walletId,
        mode: inheritedExecutionContext.mode,
        exchange: botExchange,
        marketType: botMarketType,
        paperStartBalance: inheritedExecutionContext.paperStartBalance,
        nowMs: Date.now(),
      });
      if (!Number.isFinite(snapshot.referenceBalance)) {
        return {
          referenceBalance: null,
          freeCash: null,
          accountBalance: snapshot.accountBalance,
          baseCurrency: snapshot.baseCurrency,
          capitalSource: snapshot.capitalSource,
          allocationMode: snapshot.allocationMode,
          allocationValue: snapshot.allocationValue,
          paperResetAt: snapshot.paperResetAt,
        };
      }
      const referenceBalance = Math.max(0, snapshot.referenceBalance);
      const freeCash = Math.max(0, referenceBalance - Math.max(0, usedMargin));
      return {
        referenceBalance,
        freeCash,
        accountBalance: snapshot.accountBalance,
        baseCurrency: snapshot.baseCurrency,
        capitalSource: snapshot.capitalSource,
        allocationMode: snapshot.allocationMode,
        allocationValue: snapshot.allocationValue,
        paperResetAt: snapshot.paperResetAt,
      };
    } catch {
      return {
        referenceBalance: null,
        freeCash: null,
        accountBalance: null,
        baseCurrency: null,
        capitalSource: null,
        allocationMode: null,
        allocationValue: null,
        paperResetAt: null,
      };
    }
  };

  const runtimePositionBaseWhere: Prisma.PositionWhereInput = {
    userId,
    managementMode: 'BOT_MANAGED',
    symbol: { in: scopedSymbols },
    openedAt: {
      lte: windowEnd,
    },
    AND: [{ OR: [botScopedPositionWhere, ...externalOwnedWhere] }],
  };
  const openPositionWhere: Prisma.PositionWhereInput = {
    ...runtimePositionBaseWhere,
    status: 'OPEN',
    closedAt: null,
    ...runtimeVisibleOpenPositionSyncWhere,
  };
  const closedPositionWindow = buildRuntimeSessionClosedPositionWindow({
    startedAt: session.startedAt,
    windowEnd,
  });
  const runtimeClosedPositionSyncWhere: Prisma.PositionWhereInput = {
    OR: [{ syncState: 'IN_SYNC' }, { syncState: 'ORPHAN_LOCAL', continuityState: 'EXTERNAL_CLOSE_CONFIRMED' }],
  };
  const closedPositionWhere: Prisma.PositionWhereInput = {
    ...runtimePositionBaseWhere,
    status: 'CLOSED',
    closedAt: closedPositionWindow,
    ...runtimeClosedPositionSyncWhere,
  };
  const feePositionWhere: Prisma.PositionWhereInput = {
    ...runtimePositionBaseWhere,
    OR: [
      { status: 'OPEN', closedAt: null, ...runtimeVisibleOpenPositionSyncWhere },
      { status: 'CLOSED', closedAt: closedPositionWindow, ...runtimeClosedPositionSyncWhere },
    ],
  };
  const [
    openPositions, closedPositions, openPositionCount, closedPositionCount,
    openPositionMarginUsed, openPositionQuantity, openPositionUnrealizedPnl,
    closedPositionRealizedPnl,
    positionTradeFees,
  ] = await Promise.all([
    listRuntimeManagedPositions({
      where: openPositionWhere,
      limit: query.limit,
    }),
    listRuntimeManagedPositions({
      where: closedPositionWhere,
      limit: query.limit,
    }),
    countRuntimeManagedPositions(openPositionWhere),
    countRuntimeManagedPositions(closedPositionWhere),
    sumRuntimeManagedPositionMarginUsed(openPositionWhere),
    sumRuntimeManagedPositionQuantity(openPositionWhere),
    sumRuntimeManagedPositionUnrealizedPnl(openPositionWhere),
    sumRuntimeManagedPositionRealizedPnl(closedPositionWhere),
    sumRuntimeManagedPositionTradeFees(feePositionWhere),
  ]);
  const totalOpenPositionMarginUsed = openPositionMarginUsed._sum.marginUsed ?? 0;
  const totalOpenPositionQty = openPositionQuantity._sum.quantity ?? 0;
  const totalUnrealizedPnl = openPositionUnrealizedPnl._sum.unrealizedPnl ?? 0;
  const totalRealizedPnl = closedPositionRealizedPnl._sum.realizedPnl ?? 0;
  const totalPositionFeesPaid = positionTradeFees._sum.fee ?? 0;
  const positions = [...openPositions, ...closedPositions];
  if (positions.length === 0) {
    const openOrders = await listRuntimeOpenOrders({
      where: {
        managementMode: 'BOT_MANAGED',
        status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'] },
        syncState: 'IN_SYNC',
        symbol: { in: scopedSymbols },
        AND: [
          {
            OR: [botScopedOrderWhere, ...externalOwnedOrderWhere],
          },
        ],
      },
      limit: RUNTIME_OPEN_ORDER_DEDUPE_CANDIDATE_LIMIT,
    });
    const visibleOpenOrders = selectRuntimeOpenOrders(openOrders, query.limit);

    return {
      sessionId,
      total: openPositionCount + closedPositionCount,
      openCount: openPositionCount,
      closedCount: closedPositionCount,
      openOrdersCount: visibleOpenOrders.count,
      showDynamicStopColumns: showDynamicStopColumnsFromStrategyMode,
      window: {
        startedAt: session.startedAt,
        finishedAt: windowEnd,
      },
      summary: {
        realizedPnl: totalRealizedPnl,
        unrealizedPnl: totalUnrealizedPnl,
        feesPaid: totalPositionFeesPaid,
        openPositionQty: totalOpenPositionQty,
        ...(await resolveRuntimeCapitalSummary(0)),
      },
      openOrders: visibleOpenOrders.items,
      openItems: [],
      historyItems: [],
    };
  }

  const positionIds = positions.map((position) => position.id);
  const symbols = [...new Set(positions.map((position) => position.symbol))];
  const lifecycleTradeWindowStart =
    botContext.createdAt < session.startedAt ? botContext.createdAt : session.startedAt;
  const singleBotStrategyContextId = resolveSingleBotStrategyContext(botContext);
  const legacyWalletScopedContinuityWhere: Prisma.PositionWhereInput[] = botContext.walletId
    ? [{ botId: null, walletId: botContext.walletId, origin: 'EXCHANGE_SYNC' }]
    : [];
  const strategyIds = [
    ...new Set(
      [
        ...positions
          .map((position) => position.strategyId)
          .filter((strategyId): strategyId is string => typeof strategyId === 'string' && strategyId.length > 0),
        ...(singleBotStrategyContextId ? [singleBotStrategyContextId] : []),
      ]
    ),
  ];
  const [dcaPlanBySymbol, trailingStopLevelsBySymbol, trailingTakeProfitLevelsBySymbol, persistedRuntimeStatesByPositionId] = await Promise.all([
    resolveBotDcaPlanBySymbol(userId, botId, symbols),
    resolveBotTrailingStopLevelsBySymbol(userId, botId, symbols),
    resolveBotTrailingTakeProfitLevelsBySymbol(userId, botId, symbols),
    runtimePositionStateStore.getPositionRuntimeStates(positionIds),
  ]);
  const continuityPositions = await listRuntimeManagedPositions({
    where: {
      userId,
      managementMode: 'BOT_MANAGED',
      symbol: { in: symbols },
      openedAt: {
        gte: lifecycleTradeWindowStart,
        lte: windowEnd,
      },
      AND: [
        {
          OR: [botScopedPositionWhere, ...externalOwnedWhere, ...legacyWalletScopedContinuityWhere],
        },
      ],
      OR: [
        { status: 'OPEN', closedAt: null, syncState: 'IN_SYNC' },
        { status: 'CLOSED', ...runtimeClosedPositionSyncWhere },
      ],
    },
    limit: Math.max(query.limit, 500),
  });
  const continuityPositionIds = [
    ...new Set([...positionIds, ...continuityPositions.map((position) => position.id)]),
  ];

  const [trades, lastSymbolPrices, openOrders, strategyConfigs] = await Promise.all([
    listRuntimePositionTradeRows({
      userId,
      OR: [
        {
          positionId: { in: continuityPositionIds },
        },
        {
          ...botScopedTradeWhere,
          managementMode: 'BOT_MANAGED',
          symbol: { in: symbols },
          executedAt: {
            gte: lifecycleTradeWindowStart,
            lte: windowEnd,
          },
        },
        ...(inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
          ? [
              {
                botId,
                walletId: null,
                managementMode: 'BOT_MANAGED' as const,
                symbol: { in: symbols },
                executedAt: {
                  gte: lifecycleTradeWindowStart,
                  lte: windowEnd,
                },
              },
            ]
          : []),
        ...buildBotlessWalletTradeFallbackWhere({
          mode: inheritedExecutionContext.mode,
          walletId: botContext.walletId,
          symbols,
          windowStart: lifecycleTradeWindowStart,
          windowEnd,
        }),
      ],
    }),
    listRuntimePositionLastPrices({
      sessionId,
      symbol: { in: symbols },
    }),
    listRuntimeOpenOrders({
      where: {
        managementMode: 'BOT_MANAGED',
        status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'] },
        syncState: 'IN_SYNC',
        symbol: { in: scopedSymbols },
        AND: [
          {
            OR: [botScopedOrderWhere, ...externalOwnedOrderWhere],
          },
        ],
      },
      limit: RUNTIME_OPEN_ORDER_DEDUPE_CANDIDATE_LIMIT,
    }),
    strategyIds.length > 0
      ? listRuntimePositionStrategies({
          id: { in: strategyIds },
          userId,
        })
      : Promise.resolve([]),
  ]);
  const visibleOpenOrders = selectRuntimeOpenOrders(openOrders, query.limit);

  const dcaPlanByStrategyId = new Map<string, number[]>();
  const trailingStopLevelsByStrategyId = new Map<string, TrailingStopDisplayLevel[]>();
  const trailingTakeProfitLevelsByStrategyId = new Map<string, TrailingTakeProfitDisplayLevel[]>();
  for (const strategy of strategyConfigs) {
    dcaPlanByStrategyId.set(strategy.id, resolveDcaPlannedLevelsFromStrategyConfig(strategy.config));
    trailingStopLevelsByStrategyId.set(
      strategy.id,
      resolveTrailingStopLevelsFromStrategyConfig(strategy.config)
    );
    trailingTakeProfitLevelsByStrategyId.set(
      strategy.id,
      resolveTrailingTakeProfitLevelsFromStrategyConfig(strategy.config)
    );
  }

  const tradesByPosition = new Map<string, typeof trades>();
  const lifecycleTradesBySymbol = new Map<string, typeof trades>();
  for (const trade of trades) {
    if (trade.positionId) {
      const bucket = tradesByPosition.get(trade.positionId) ?? [];
      bucket.push(trade);
      tradesByPosition.set(trade.positionId, bucket);
    }
    if (trade.lifecycleAction === 'OPEN' || trade.lifecycleAction === 'DCA' || trade.lifecycleAction === 'CLOSE') {
      const bucket = lifecycleTradesBySymbol.get(trade.symbol) ?? [];
      bucket.push(trade);
      lifecycleTradesBySymbol.set(trade.symbol, bucket);
    }
  }

  const runtimeStatPriceBySymbol = new Map<string, { price: number | null; observedAtMs: number | null; source: string }>(
    lastSymbolPrices.map((row) => [
      row.symbol,
      { price: row.lastPrice, observedAtMs: row.snapshotAt.getTime(), source: 'runtime_symbol_stat' },
    ])
  );
  for (const symbol of symbols) {
    const ticker = getRuntimeTicker(symbol, {
      exchange: botExchange,
      marketType: botMarketType,
    });
    if (ticker && Number.isFinite(ticker.lastPrice)) {
      const current = runtimeStatPriceBySymbol.get(symbol);
      const candidate = {
        price: ticker.lastPrice,
        observedAtMs:
          typeof ticker.eventTime === 'number' && Number.isFinite(ticker.eventTime)
            ? ticker.eventTime
            : null,
        source: 'runtime_ticker',
      };
      if (
        !current ||
        (candidate.observedAtMs ?? Number.NEGATIVE_INFINITY) >=
          (current.observedAtMs ?? Number.NEGATIVE_INFINITY)
      ) {
        runtimeStatPriceBySymbol.set(symbol, candidate);
      }
    }
  }
  const lastPriceBySymbol = new Map(
    [...runtimeStatPriceBySymbol.entries()].map(([symbol, candidate]) => [symbol, candidate.price])
  );
  const fallbackRuntimePriceBySymbol = new Map<string, { price: number | null; observedAtMs: number | null; source: string }>();
  const missingPriceSymbols = symbols.filter((symbol) => {
    const current = lastPriceBySymbol.get(symbol);
    return !Number.isFinite(current) || (current as number) <= 0;
  });
  if (missingPriceSymbols.length > 0) {
    const fallbackPrices = await fetchFallbackTickerPrices({
      exchange: botExchange,
      marketType: botMarketType === 'SPOT' ? 'SPOT' : 'FUTURES',
      symbols: missingPriceSymbols,
    });
    for (const [symbol, price] of fallbackPrices) {
      if (Number.isFinite(price) && price > 0) {
        lastPriceBySymbol.set(symbol, price);
        fallbackRuntimePriceBySymbol.set(symbol, {
          price,
          observedAtMs: null,
          source: 'fallback_ticker',
        });
      }
    }
  }

  const nowTs = Date.now();
  cleanupStaleRuntimePositionSerializationState(nowTs);

  const mappedPositions = positions.map((position) => {
    const positionTrades = resolveRuntimePositionTrades(
      position,
      tradesByPosition,
      lifecycleTradesBySymbol,
      lifecycleTradeWindowStart,
      windowEnd
    );
    const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
    const entryLegs = positionTrades.filter((trade) => trade.side === entrySide);
    const exitLegs = positionTrades.filter((trade) => trade.side !== entrySide);

    const feesPaid = positionTrades.reduce((acc, trade) => acc + (trade.fee ?? 0), 0);
    const tradeRealizedPnl = positionTrades.reduce((acc, trade) => acc + (trade.realizedPnl ?? 0), 0);
    const entryTrade = entryLegs[0] ?? positionTrades[0] ?? null;
    const exitTrade = exitLegs.at(-1) ?? (position.status === 'CLOSED' ? positionTrades.at(-1) ?? null : null);
    const effectiveStrategyId = position.strategyId ?? singleBotStrategyContextId;
    const executableStrategyContextResolved = resolveRuntimeStrategyAutomationContext(effectiveStrategyId);
    const symbolLevelStrategyContextResolved =
      dcaPlanBySymbol.has(position.symbol) ||
      trailingStopLevelsBySymbol.has(position.symbol) ||
      trailingTakeProfitLevelsBySymbol.has(position.symbol);
    const strategyAutomationContextResolved =
      executableStrategyContextResolved || symbolLevelStrategyContextResolved;
    const dcaPlannedLevels =
      strategyAutomationContextResolved
        ? ((effectiveStrategyId ? dcaPlanByStrategyId.get(effectiveStrategyId) : null) ??
          dcaPlanBySymbol.get(position.symbol) ??
          [])
        : [];
    const trailingStopLevels =
      strategyAutomationContextResolved
        ? ((effectiveStrategyId ? trailingStopLevelsByStrategyId.get(effectiveStrategyId) : null) ??
          trailingStopLevelsBySymbol.get(position.symbol) ??
          [])
        : [];
    const trailingTakeProfitLevels =
      strategyAutomationContextResolved
        ? ((effectiveStrategyId
            ? trailingTakeProfitLevelsByStrategyId.get(effectiveStrategyId)
            : null) ??
          trailingTakeProfitLevelsBySymbol.get(position.symbol) ??
          [])
        : [];
    const marketPriceResult = resolvePreferredRuntimeOrExchangeSyncedPriceWithSource({
      origin: position.origin,
      status: position.status,
      side: position.side,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      unrealizedPnl: position.unrealizedPnl ?? null,
      lastExchangeSyncAt: position.lastExchangeSyncAt,
      runtimePriceCandidates: [
        runtimeStatPriceBySymbol.get(position.symbol) ?? { price: null, observedAtMs: null, source: null },
        fallbackRuntimePriceBySymbol.get(position.symbol) ?? { price: null, observedAtMs: null, source: null },
      ],
    });
    const marketPrice = marketPriceResult.price;
    const runtimeSnapshot = runtimePositionAutomationService.getPositionStateSnapshot(position.id);
    const persistedRuntimeState = persistedRuntimeStatesByPositionId.get(position.id) ?? null;
    const runtimeState = selectRuntimeDisplayState({ position, runtimeSnapshot, persistedState: persistedRuntimeState });
    const explicitDcaTradeCount = positionTrades.filter(
      (trade) => trade.lifecycleAction === 'DCA'
    ).length;
    const dcaCount = resolveRuntimePositionDcaCount({
      entryLegs,
      explicitDcaTradeCount,
      runtimeStateCurrentAdds: runtimeState?.currentAdds ?? null,
    });
    const dcaExecutedLevels = resolveDcaExecutedLevels(dcaCount, dcaPlannedLevels);
    const allowTrailingTakeProfitProtection = !hasRemainingDcaLevelsForDisplaySide(
      dcaPlannedLevels,
      dcaCount,
      'profit'
    );
    const allowTrailingStopProtection = !hasRemainingDcaLevelsForDisplaySide(
      dcaPlannedLevels,
      dcaCount,
      'loss'
    );
    const stateEntryPrice = runtimeState && Number.isFinite(runtimeState.averageEntryPrice) && runtimeState.averageEntryPrice > 0
      ? runtimeState.averageEntryPrice
      : position.entryPrice;
    const hasCanonicalPriceBasis =
      typeof marketPrice === 'number' && Number.isFinite(marketPrice) && marketPrice > 0 &&
      Number.isFinite(position.entryPrice) && position.entryPrice > 0 &&
      Number.isFinite(position.quantity) && position.quantity > 0;
    const {
      dynamicTtpStopLoss,
      dynamicTtpStopLossSource,
      dynamicTslStopLoss,
      liveUnrealizedPnl,
    } = resolveRuntimePositionDynamicStops({
      positionSide: position.side,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      leverage: position.leverage,
      marginUsed: position.marginUsed ?? null,
      unrealizedPnl: position.unrealizedPnl ?? null,
      marketPrice,
      stateEntryPrice,
      runtimeState,
      trailingTakeProfitLevels,
      trailingStopLevels,
      allowStrategyProtectionFallback: canUseStrategyProtectionFallbackForDisplay({
        position,
        strategyAutomationContextResolved,
        runtimeState,
        hasRuntimeStateBasis: runtimeSnapshot != null || persistedRuntimeState != null,
        hasCanonicalPriceBasis,
      }),
      allowTrailingTakeProfitProtection,
      allowTrailingStopProtection,
    });

    const holdUntil = position.closedAt ?? windowEnd;
    const holdMs = Math.max(0, holdUntil.getTime() - position.openedAt.getTime());
    const effectiveMarginUsed =
      position.marginUsed ??
      resolveModeledMarginUsed({
        entryPrice: position.entryPrice,
        quantity: position.quantity,
        leverage: position.leverage,
      });
    const unrealizedPnlPercentFraction =
      marketPrice != null
        ? resolvePositionPnlFraction({
            side: position.side,
            entryPrice: position.entryPrice,
            currentPrice: marketPrice,
            quantity: position.quantity,
            leverage: position.leverage,
            marginUsed: effectiveMarginUsed,
            unrealizedPnl: liveUnrealizedPnl,
          })
        : typeof position.unrealizedPnl === 'number' && Number.isFinite(position.unrealizedPnl)
          ? resolvePositionPnlFraction({
              side: position.side,
              entryPrice: position.entryPrice,
              currentPrice: position.entryPrice,
              quantity: position.quantity,
              leverage: position.leverage,
              marginUsed: effectiveMarginUsed,
              unrealizedPnl: position.unrealizedPnl,
            })
          : null;

    return {
      id: position.id,
      origin: position.origin,
      managementMode: position.managementMode,
      syncState: position.syncState,
      continuityState: position.continuityState,
      takeoverStatus: resolveRuntimeTakeoverStatus({
        origin: position.origin,
        managementMode: position.managementMode,
        syncState: position.syncState,
        botId: position.botId,
      }),
      symbol: position.symbol,
      side: position.side,
      status: position.status,
      quantity: position.quantity,
      leverage: position.leverage,
      marginUsed: effectiveMarginUsed,
      closeReason: position.closeReason ?? null,
      closeInitiator: position.closeInitiator ?? null,
      strategyAutomationContextResolved,
      actionable: resolveRuntimePositionActionableForDisplay({
        continuityState: position.continuityState,
        botId: position.botId,
        strategyId: executableStrategyContextResolved ? effectiveStrategyId : null,
      }),
      entryPrice: position.entryPrice,
      entryNotional: position.entryPrice * position.quantity,
      exitPrice: exitTrade?.price ?? null,
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit,
      openedAt: position.openedAt,
      closedAt: position.closedAt,
      holdMs,
      dcaCount,
      dcaPlannedLevels,
      dcaExecutedLevels,
      trailingStopLevels,
      trailingTakeProfitLevels,
      feesPaid,
      realizedPnl: position.realizedPnl ?? tradeRealizedPnl ?? 0,
      unrealizedPnl: liveUnrealizedPnl ?? position.unrealizedPnl ?? null,
      unrealizedPnlPercent:
        unrealizedPnlPercentFraction != null ? unrealizedPnlPercentFraction * 100 : null,
      markPrice: typeof marketPrice === 'number' && Number.isFinite(marketPrice) ? marketPrice : null,
      markPriceSource: typeof marketPrice === 'number' && Number.isFinite(marketPrice) ? marketPriceResult.source : 'unavailable',
      dynamicTtpStopLoss,
      dynamicTtpStopLossSource,
      dynamicTslStopLoss,
      firstTradeAt: entryTrade?.executedAt ?? null,
      lastTradeAt: positionTrades.at(-1)?.executedAt ?? null,
      tradesCount: positionTrades.length,
    };
  });

  const openItems = mappedPositions
    .filter((position) => position.status === 'OPEN')
    .sort((left, right) => right.openedAt.getTime() - left.openedAt.getTime());
  const historyItems = mappedPositions
    .filter((position) => position.status === 'CLOSED')
    .sort((left, right) => (right.closedAt?.getTime() ?? 0) - (left.closedAt?.getTime() ?? 0));
  const showDynamicStopColumns =
    showDynamicStopColumnsFromStrategyMode ||
    openItems.some((position) => {
      return position.dynamicTtpStopLoss != null || position.dynamicTslStopLoss != null ||
        position.trailingTakeProfitLevels.length > 0 || position.trailingStopLevels.length > 0;
    });
  const visibleOpenItemsMargin = openItems.reduce((sum, position) => {
    return sum + Math.max(0, position.marginUsed ?? 0);
  }, 0);
  const usedMargin =
    totalOpenPositionMarginUsed > 0 ? totalOpenPositionMarginUsed : visibleOpenItemsMargin;
  const capitalSummary = await resolveRuntimeCapitalSummary(usedMargin);

  return {
    sessionId,
    total: openPositionCount + closedPositionCount,
    openCount: openPositionCount,
    closedCount: closedPositionCount,
    openOrdersCount: visibleOpenOrders.count,
    showDynamicStopColumns,
    window: {
      startedAt: session.startedAt,
      finishedAt: windowEnd,
    },
    summary: {
      realizedPnl: totalRealizedPnl,
      unrealizedPnl: totalUnrealizedPnl,
      feesPaid: totalPositionFeesPaid,
      openPositionQty: totalOpenPositionQty,
      ...capitalSummary,
    },
    openOrders: visibleOpenOrders.items,
    openItems,
    historyItems,
  };
};
