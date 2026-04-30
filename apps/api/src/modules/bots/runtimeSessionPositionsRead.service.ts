import { Prisma } from '@prisma/client';
import { runtimePositionAutomationService } from '../engine/runtimePositionAutomation.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { resolveRuntimeCapitalSnapshot } from '../engine/runtimeCapitalContext.service';
import { getRuntimeTicker } from '../engine/runtimeTickerStore';
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
import {
  getRuntimePositionBotContext,
  listRuntimeManagedPositions,
  listRuntimeOpenOrders,
  listRuntimePositionLastPrices,
  listRuntimePositionStrategies,
  listRuntimePositionTradeRows,
} from './runtimeSessionPositionsRead.repository';
import { resolveInheritedRuntimeExecutionContext } from '../engine/runtimeBotExecutionContext';
import { resolveModeledMarginUsed, resolvePositionPnlFraction } from '../engine/positionPnlSemantics';
import { resolvePreferredRuntimeOrExchangeSyncedPrice } from './runtimeExchangeSyncedPositionPrice';

type RuntimeTakeoverStatus = 'OWNED_AND_MANAGED' | 'UNOWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY';

type RuntimeOpenOrderRow = Awaited<ReturnType<typeof listRuntimeOpenOrders>>[number];

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

const resolveRuntimePositionActionable = (input: {
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP';
  botId: string | null;
  strategyId: string | null;
}) =>
  input.continuityState === 'CONFIRMED' &&
  typeof input.botId === 'string' &&
  input.botId.length > 0 &&
  typeof input.strategyId === 'string' &&
  input.strategyId.length > 0;

const resolveRuntimeStrategyAutomationContext = (strategyId: string | null) =>
  typeof strategyId === 'string' && strategyId.length > 0;

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
    venueContext: botContext.symbolGroup?.marketUniverse,
  });
  if (!inheritedExecutionContext) return null;

  const botScopedPositionWhere: Prisma.PositionWhereInput =
    inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
      ? {
          botId,
          OR: [{ walletId: botContext.walletId }, { walletId: null }],
        }
      : { botId };
  const botScopedOrderWhere: Prisma.OrderWhereInput =
    inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
      ? { botId, walletId: botContext.walletId }
      : { botId };
  const botScopedTradeWhere: Prisma.TradeWhereInput =
    inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
      ? { botId, walletId: botContext.walletId }
      : { botId };
  const ownershipIndex = await resolveExternalPositionOwnershipIndex(
    userId,
    inheritedExecutionContext.mode
  );
  const botApiKeyId = botContext.wallet?.apiKeyId ?? botContext.apiKeyId ?? null;
  const ownedExternalSymbols = listOwnedExternalSymbolsForBot(ownershipIndex, {
    apiKeyId: botApiKeyId,
    botId,
    walletId: botContext.walletId,
  });
  const externalOwnedWhere: Prisma.PositionWhereInput[] =
    ownedExternalSymbols.length > 0 && botApiKeyId
      ? [
          {
            botId: null,
            origin: 'EXCHANGE_SYNC',
            externalId: { startsWith: `${botApiKeyId}:` },
            symbol: { in: ownedExternalSymbols },
            ...(inheritedExecutionContext.mode === 'LIVE' && botContext.walletId
              ? {
                  OR: [{ walletId: botContext.walletId }, { walletId: null }],
                }
              : {}),
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
                  OR: [{ walletId: botContext.walletId }, { walletId: null }],
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

  const positions = await listRuntimeManagedPositions({
    where: {
      userId,
      managementMode: 'BOT_MANAGED',
      ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
      openedAt: {
        lte: windowEnd,
      },
      AND: [
        { OR: [botScopedPositionWhere, ...externalOwnedWhere] },
        { OR: [{ closedAt: null }, { closedAt: { gte: session.startedAt } }] },
      ],
    },
    limit: query.limit,
  });

  if (positions.length === 0) {
    const openOrders = await listRuntimeOpenOrders({
      where: {
        managementMode: 'BOT_MANAGED',
        status: {
          in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'],
        },
        ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
        AND: [
          {
            OR: [botScopedOrderWhere, ...externalOwnedOrderWhere],
          },
        ],
      },
      limit: query.limit,
    });
    const visibleOpenOrders = dedupeRuntimeOpenOrders(openOrders);

    return {
      sessionId,
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: visibleOpenOrders.length,
      showDynamicStopColumns: showDynamicStopColumnsFromStrategyMode,
      window: {
        startedAt: session.startedAt,
        finishedAt: windowEnd,
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 0,
        feesPaid: 0,
        ...(await resolveRuntimeCapitalSummary(0)),
      },
      openOrders: visibleOpenOrders,
      openItems: [],
      historyItems: [],
    };
  }

  const positionIds = positions.map((position) => position.id);
  const symbols = [...new Set(positions.map((position) => position.symbol))];
  const strategyIds = [
    ...new Set(
      positions
        .map((position) => position.strategyId)
        .filter((strategyId): strategyId is string => typeof strategyId === 'string' && strategyId.length > 0)
    ),
  ];
  const [dcaPlanBySymbol, trailingStopLevelsBySymbol, trailingTakeProfitLevelsBySymbol, persistedRuntimeStatesByPositionId] = await Promise.all([
    resolveBotDcaPlanBySymbol(userId, botId, symbols),
    resolveBotTrailingStopLevelsBySymbol(userId, botId, symbols),
    resolveBotTrailingTakeProfitLevelsBySymbol(userId, botId, symbols),
    runtimePositionStateStore.getPositionRuntimeStates(positionIds),
  ]);

  const [trades, lastSymbolPrices, openOrders, strategyConfigs] = await Promise.all([
    listRuntimePositionTradeRows({
      userId,
      ...botScopedTradeWhere,
      positionId: { in: positionIds },
    }),
    listRuntimePositionLastPrices({
      sessionId,
      symbol: { in: symbols },
    }),
    listRuntimeOpenOrders({
      where: {
        managementMode: 'BOT_MANAGED',
        status: {
          in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'],
        },
        ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
        AND: [
          {
            OR: [botScopedOrderWhere, ...externalOwnedOrderWhere],
          },
        ],
      },
      limit: query.limit,
    }),
    strategyIds.length > 0
      ? listRuntimePositionStrategies({
          id: { in: strategyIds },
          userId,
        })
      : Promise.resolve([]),
  ]);
  const visibleOpenOrders = dedupeRuntimeOpenOrders(openOrders);

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
  for (const trade of trades) {
    if (!trade.positionId) continue;
    const bucket = tradesByPosition.get(trade.positionId) ?? [];
    bucket.push(trade);
    tradesByPosition.set(trade.positionId, bucket);
  }

  const runtimeStatPriceBySymbol = new Map<
    string,
    {
      price: number | null;
      observedAtMs: number | null;
    }
  >(
    lastSymbolPrices.map((row) => [
      row.symbol,
      {
        price: row.lastPrice,
        observedAtMs: row.snapshotAt.getTime(),
      },
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
  const missingPriceSymbols = symbols.filter((symbol) => {
    const current = lastPriceBySymbol.get(symbol);
    return !Number.isFinite(current) || (current as number) <= 0;
  });
  if (missingPriceSymbols.length > 0) {
    if (botExchange === 'BINANCE') {
      const fallbackPrices = await fetchFallbackTickerPrices({
        marketType: botMarketType === 'SPOT' ? 'SPOT' : 'FUTURES',
        symbols: missingPriceSymbols,
      });
      for (const [symbol, price] of fallbackPrices) {
        if (Number.isFinite(price) && price > 0) {
          lastPriceBySymbol.set(symbol, price);
        }
      }
    }
  }

  const nowTs = Date.now();
  cleanupStaleRuntimePositionSerializationState(nowTs);

  const mappedPositions = positions.map((position) => {
    const positionTrades = tradesByPosition.get(position.id) ?? [];
    const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
    const entryLegs = positionTrades.filter((trade) => trade.side === entrySide);
    const exitLegs = positionTrades.filter((trade) => trade.side !== entrySide);

    const feesPaid = positionTrades.reduce((acc, trade) => acc + (trade.fee ?? 0), 0);
    const tradeRealizedPnl = positionTrades.reduce((acc, trade) => acc + (trade.realizedPnl ?? 0), 0);
    const entryTrade = entryLegs[0] ?? positionTrades[0] ?? null;
    const exitTrade = exitLegs.at(-1) ?? (position.status === 'CLOSED' ? positionTrades.at(-1) ?? null : null);
    const dcaCount = Math.max(0, entryLegs.length - 1);
    const strategyAutomationContextResolved = resolveRuntimeStrategyAutomationContext(position.strategyId);
    const dcaPlannedLevels =
      strategyAutomationContextResolved
        ? ((position.strategyId ? dcaPlanByStrategyId.get(position.strategyId) : null) ?? [])
        : [];
    const trailingStopLevels =
      strategyAutomationContextResolved
        ? ((position.strategyId ? trailingStopLevelsByStrategyId.get(position.strategyId) : null) ?? [])
        : [];
    const trailingTakeProfitLevels =
      strategyAutomationContextResolved
        ? ((position.strategyId
            ? trailingTakeProfitLevelsByStrategyId.get(position.strategyId)
            : null) ?? [])
        : [];
    const dcaExecutedLevels = resolveDcaExecutedLevels(dcaCount, dcaPlannedLevels);

    const marketPrice = resolvePreferredRuntimeOrExchangeSyncedPrice({
      origin: position.origin,
      status: position.status,
      side: position.side,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      unrealizedPnl: position.unrealizedPnl ?? null,
      lastExchangeSyncAt: position.lastExchangeSyncAt,
      runtimePriceCandidates: [
        runtimeStatPriceBySymbol.get(position.symbol) ?? {
          price: null,
          observedAtMs: null,
        },
      ],
    });
    const runtimeState =
      runtimePositionAutomationService.getPositionStateSnapshot(position.id) ??
      persistedRuntimeStatesByPositionId.get(position.id) ??
      null;
    const stateEntryPrice =
      runtimeState && Number.isFinite(runtimeState.averageEntryPrice) && runtimeState.averageEntryPrice > 0
        ? runtimeState.averageEntryPrice
        : position.entryPrice;
    const {
      dynamicTtpStopLoss,
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
      allowStrategyProtectionFallback: strategyAutomationContextResolved,
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
      actionable: resolveRuntimePositionActionable({
        continuityState: position.continuityState,
        botId: position.botId,
        strategyId: position.strategyId,
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
      dynamicTtpStopLoss,
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
    openItems.some(
      (position) =>
        position.dynamicTtpStopLoss != null || position.dynamicTslStopLoss != null
    );
  const usedMargin = openItems.reduce((sum, position) => {
    return sum + Math.max(0, position.marginUsed ?? 0);
  }, 0);
  const capitalSummary = await resolveRuntimeCapitalSummary(usedMargin);

  return {
    sessionId,
    total: mappedPositions.length,
    openCount: openItems.length,
    closedCount: historyItems.length,
    openOrdersCount: visibleOpenOrders.length,
    showDynamicStopColumns,
    window: {
      startedAt: session.startedAt,
      finishedAt: windowEnd,
    },
    summary: {
      realizedPnl: mappedPositions.reduce((acc, position) => acc + (position.realizedPnl ?? 0), 0),
      unrealizedPnl: openItems.reduce((acc, position) => acc + (position.unrealizedPnl ?? 0), 0),
      feesPaid: mappedPositions.reduce((acc, position) => acc + position.feesPaid, 0),
      ...capitalSummary,
    },
    openOrders: visibleOpenOrders,
    openItems,
    historyItems,
  };
};
