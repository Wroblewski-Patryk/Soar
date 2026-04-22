import { Prisma } from '@prisma/client';
import { runtimePositionAutomationService } from '../engine/runtimePositionAutomation.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { resolveRuntimeReferenceBalance } from '../engine/runtimeCapitalContext.service';
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
import { resolveExternalPositionOwnerBySymbol } from './runtimeExternalPositionOwner.service';
import {
  getRuntimePositionBotContext,
  listRuntimeManagedPositions,
  listRuntimeOpenOrders,
  listRuntimePositionLastPrices,
  listRuntimePositionStrategies,
  listRuntimePositionTradeRows,
} from './runtimeSessionPositionsRead.repository';

type RuntimeTakeoverStatus = 'OWNED_AND_MANAGED' | 'UNOWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY';

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

export const listBotRuntimeSessionPositions = async (
  userId: string,
  botId: string,
  sessionId: string,
  query: ListBotRuntimePositionsQueryDto
) => {
  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;
  const showDynamicStopColumns = await resolveBotAdvancedCloseMode(userId, botId);

  const normalizedSymbol = normalizeSymbol(query.symbol) || undefined;
  const windowEnd = resolveSessionWindowEnd(session);
  const botContext = await getRuntimePositionBotContext(userId, botId);
  if (!botContext) return null;

  const botScopedPositionWhere: Prisma.PositionWhereInput =
    botContext.mode === 'LIVE' && botContext.walletId
      ? {
          botId,
          OR: [{ walletId: botContext.walletId }, { walletId: null }],
        }
      : { botId };
  const botScopedOrderWhere: Prisma.OrderWhereInput =
    botContext.mode === 'LIVE' && botContext.walletId
      ? { botId, walletId: botContext.walletId }
      : { botId };
  const botScopedTradeWhere: Prisma.TradeWhereInput =
    botContext.mode === 'LIVE' && botContext.walletId
      ? { botId, walletId: botContext.walletId }
      : { botId };
  const externalOwnerBySymbol = await resolveExternalPositionOwnerBySymbol(userId, botContext.mode);
  const ownedExternalSymbols = [...externalOwnerBySymbol.entries()]
    .filter(
      ([, owner]) =>
        owner.status === 'OWNED' &&
        owner.botId === botId &&
        (!botContext.walletId || owner.walletId === botContext.walletId)
    )
    .map(([symbol]) => symbol);
  const externalOwnedWhere: Prisma.PositionWhereInput[] =
    ownedExternalSymbols.length > 0
      ? [
          {
            botId: null,
            origin: 'EXCHANGE_SYNC',
            symbol: { in: ownedExternalSymbols },
            ...(botContext.mode === 'LIVE' && botContext.walletId
              ? {
                  OR: [{ walletId: botContext.walletId }, { walletId: null }],
                }
              : {}),
          },
        ]
      : [];
  const botExchange = botContext.exchange ?? 'BINANCE';
  const botMarketType = botContext.marketType ?? 'FUTURES';
  const resolveRuntimeCapitalSummary = async (usedMargin: number) => {
    try {
      const referenceBalanceRaw = await resolveRuntimeReferenceBalance({
        userId,
        botId,
        walletId: botContext.walletId,
        mode: botContext.mode,
        exchange: botExchange,
        marketType: botMarketType,
        paperStartBalance: botContext.paperStartBalance,
        nowMs: Date.now(),
      });
      if (!Number.isFinite(referenceBalanceRaw)) {
        return { referenceBalance: null, freeCash: null };
      }
      const referenceBalance = Math.max(0, referenceBalanceRaw);
      const freeCash = Math.max(0, referenceBalance - Math.max(0, usedMargin));
      return { referenceBalance, freeCash };
    } catch {
      return { referenceBalance: null, freeCash: null };
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
        userId,
        ...botScopedOrderWhere,
        managementMode: 'BOT_MANAGED',
        status: {
          in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'],
        },
        ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
      },
      limit: query.limit,
    });

    return {
      sessionId,
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: openOrders.length,
      showDynamicStopColumns,
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
      openOrders,
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
        userId,
        ...botScopedOrderWhere,
        managementMode: 'BOT_MANAGED',
        status: {
          in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'],
        },
        ...(normalizedSymbol ? { symbol: normalizedSymbol } : {}),
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

  const lastPriceBySymbol = new Map(lastSymbolPrices.map((row) => [row.symbol, row.lastPrice]));
  for (const symbol of symbols) {
    const ticker = getRuntimeTicker(symbol, {
      exchange: botExchange,
      marketType: botMarketType,
    });
    if (ticker && Number.isFinite(ticker.lastPrice)) {
      lastPriceBySymbol.set(symbol, ticker.lastPrice);
    }
  }
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
    const dcaPlannedLevels =
      (position.strategyId ? dcaPlanByStrategyId.get(position.strategyId) : null) ??
      dcaPlanBySymbol.get(position.symbol) ??
      [];
    const trailingStopLevels =
      (position.strategyId ? trailingStopLevelsByStrategyId.get(position.strategyId) : null) ??
      trailingStopLevelsBySymbol.get(position.symbol) ??
      [];
    const trailingTakeProfitLevels =
      (position.strategyId
        ? trailingTakeProfitLevelsByStrategyId.get(position.strategyId)
        : null) ??
      trailingTakeProfitLevelsBySymbol.get(position.symbol) ??
      [];
    const dcaExecutedLevels = resolveDcaExecutedLevels(dcaCount, dcaPlannedLevels);

    const marketPrice = lastPriceBySymbol.get(position.symbol);
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
      positionId: position.id,
      positionStatus: position.status,
      positionSide: position.side,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      leverage: position.leverage,
      unrealizedPnl: position.unrealizedPnl ?? null,
      marketPrice,
      stateEntryPrice,
      runtimeState,
      trailingStopLevels,
      trailingTakeProfitLevels,
      nowTs,
    });

    const holdUntil = position.closedAt ?? windowEnd;
    const holdMs = Math.max(0, holdUntil.getTime() - position.openedAt.getTime());

    return {
      id: position.id,
      origin: position.origin,
      managementMode: position.managementMode,
      syncState: position.syncState,
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
  const usedMargin = openItems.reduce((sum, position) => {
    const leverage = Math.max(1, position.leverage || 1);
    return sum + position.entryNotional / leverage;
  }, 0);
  const capitalSummary = await resolveRuntimeCapitalSummary(usedMargin);

  return {
    sessionId,
    total: mappedPositions.length,
    openCount: openItems.length,
    closedCount: historyItems.length,
    openOrdersCount: openOrders.length,
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
    openOrders,
    openItems,
    historyItems,
  };
};
