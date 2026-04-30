import { FeeSource, PositionSide, PositionStatus, TradeLifecycleAction } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { resolveExternalSyncMissingCloseAttribution } from './positionCloseAttribution';
import { ExchangeTradeHistoryItem } from './positions.exchangeSnapshot.types';
import { normalizeSymbol } from './livePositionReconciliation.helpers';

const EPSILON = 1e-8;
const DEFAULT_TRADE_HISTORY_LOOKBACK_DAYS = 30;
const DEFAULT_TRADE_HISTORY_LIMIT = 500;

type HydratableTrade = {
  exchangeTradeId: string;
  exchangeOrderId: string | null;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  feeCost: number;
  feeCurrency: string | null;
  feeRate: number | null;
  executedAt: Date;
};

type DerivedLifecycleTrade = HydratableTrade & {
  lifecycleAction: 'OPEN' | 'DCA' | 'CLOSE';
  realizedPnl: number;
};

type ExistingImportedTradeRow = {
  id: string;
  exchangeTradeId: string | null;
  lifecycleAction: TradeLifecycleAction;
};

const nearlyEqual = (left: number, right: number) => Math.abs(left - right) <= EPSILON;

const isSyntheticImportedOpenAnchorTrade = (trade: ExistingImportedTradeRow) =>
  trade.exchangeTradeId == null && trade.lifecycleAction === 'OPEN';

const normalizeTradeSide = (side: string | null): 'BUY' | 'SELL' | null => {
  const normalized = side?.trim().toUpperCase();
  if (normalized === 'BUY') return 'BUY';
  if (normalized === 'SELL') return 'SELL';
  return null;
};

const signedQuantityForTrade = (trade: Pick<HydratableTrade, 'side' | 'quantity'>) =>
  trade.side === 'BUY' ? trade.quantity : -trade.quantity;

export const resolveImportedTradeHistorySince = (reference: Date) =>
  new Date(reference.getTime() - DEFAULT_TRADE_HISTORY_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

export const resolveImportedTradeHistoryLimit = () => DEFAULT_TRADE_HISTORY_LIMIT;

export const deriveImportedLifecycleTrades = (input: {
  positionSide: PositionSide;
  positionQuantity: number;
  trades: ExchangeTradeHistoryItem[];
}) => {
  const targetSignedQuantity =
    input.positionSide === 'LONG' ? input.positionQuantity : -input.positionQuantity;
  if (!Number.isFinite(targetSignedQuantity) || Math.abs(targetSignedQuantity) < EPSILON) {
    if (targetSignedQuantity !== 0) {
      return null;
    }
  }
  const expectedSignedDirection = input.positionSide === 'LONG' ? 1 : -1;
  if (!Number.isFinite(expectedSignedDirection)) {
    return null;
  }

  const normalizedTrades: HydratableTrade[] = input.trades
    .map((trade) => {
      const side = normalizeTradeSide(trade.side);
      const executedAt =
        typeof trade.executedAt === 'string' && trade.executedAt.length > 0
          ? new Date(trade.executedAt)
          : null;
      if (
        !trade.exchangeTradeId ||
        !side ||
        !Number.isFinite(trade.price) ||
        trade.price <= 0 ||
        !Number.isFinite(trade.quantity) ||
        trade.quantity <= 0 ||
        !executedAt ||
        Number.isNaN(executedAt.getTime())
      ) {
        return null;
      }

      return {
        exchangeTradeId: trade.exchangeTradeId,
        exchangeOrderId: trade.exchangeOrderId,
        symbol: normalizeSymbol(trade.symbol),
        side,
        price: trade.price,
        quantity: trade.quantity,
        feeCost: Number.isFinite(trade.feeCost) ? trade.feeCost : 0,
        feeCurrency: trade.feeCurrency,
        feeRate: trade.feeRate,
        executedAt,
      };
    })
    .filter((trade): trade is HydratableTrade => trade != null)
    .sort((left, right) => left.executedAt.getTime() - right.executedAt.getTime());

  if (normalizedTrades.length === 0) return null;

  let cumulative = 0;
  const cumulativeByIndex: number[] = [];
  for (const trade of normalizedTrades) {
    cumulative += signedQuantityForTrade(trade);
    cumulativeByIndex.push(cumulative);
  }

  const finalSignedQuantity = cumulativeByIndex.at(-1) ?? 0;
  if (!nearlyEqual(finalSignedQuantity, targetSignedQuantity)) {
    return null;
  }
  if (
    Math.abs(targetSignedQuantity) > EPSILON &&
    Math.sign(finalSignedQuantity) !== Math.sign(targetSignedQuantity)
  ) {
    return null;
  }

  let startIndex = 0;
  const previousSearchIndex =
    Math.abs(targetSignedQuantity) <= EPSILON
      ? cumulativeByIndex.length - 2
      : cumulativeByIndex.length - 2;
  for (let index = previousSearchIndex; index >= 0; index -= 1) {
    if (nearlyEqual(cumulativeByIndex[index] ?? 0, 0)) {
      startIndex = index + 1;
      break;
    }
  }

  const lifecycleTrades = normalizedTrades.slice(startIndex);
  if (lifecycleTrades.length === 0) return null;

  let currentSignedQuantity = 0;
  let averageEntryPrice = 0;
  const derivedTrades: DerivedLifecycleTrade[] = [];

  for (const trade of lifecycleTrades) {
    const signedDelta = signedQuantityForTrade(trade);
    const nextSignedQuantity = currentSignedQuantity + signedDelta;
    const currentAbs = Math.abs(currentSignedQuantity);
    const nextAbs = Math.abs(nextSignedQuantity);

    if (currentAbs <= EPSILON) {
      if (Math.sign(nextSignedQuantity) !== expectedSignedDirection) {
        return null;
      }
      averageEntryPrice = trade.price;
      derivedTrades.push({
        ...trade,
        lifecycleAction: 'OPEN',
        realizedPnl: 0,
      });
      currentSignedQuantity = nextSignedQuantity;
      continue;
    }

    if (Math.sign(nextSignedQuantity) !== 0 && Math.sign(nextSignedQuantity) !== Math.sign(currentSignedQuantity)) {
      return null;
    }

    if (nextAbs > currentAbs) {
      const addedQuantity = nextAbs - currentAbs;
      averageEntryPrice =
        (averageEntryPrice * currentAbs + trade.price * addedQuantity) / nextAbs;
      derivedTrades.push({
        ...trade,
        lifecycleAction: 'DCA',
        realizedPnl: 0,
      });
      currentSignedQuantity = nextSignedQuantity;
      continue;
    }

    if (nextAbs < currentAbs) {
      const reducedQuantity = currentAbs - nextAbs;
      const realizedPnl =
        currentSignedQuantity > 0
          ? (trade.price - averageEntryPrice) * reducedQuantity - trade.feeCost
          : (averageEntryPrice - trade.price) * reducedQuantity - trade.feeCost;
      derivedTrades.push({
        ...trade,
        lifecycleAction: 'CLOSE',
        realizedPnl,
      });
      currentSignedQuantity = nextSignedQuantity;
      if (nextAbs <= EPSILON) {
        averageEntryPrice = 0;
      }
      continue;
    }

    return null;
  }

  if (!nearlyEqual(currentSignedQuantity, targetSignedQuantity)) {
    return null;
  }

  return derivedTrades;
};

const persistImportedLifecycleTrades = async (input: {
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  derivedTrades: DerivedLifecycleTrade[];
}) => {
  const existingTradeIds = new Set(
    (
      await prisma.trade.findMany({
        where: {
          positionId: input.positionId,
          origin: 'EXCHANGE_SYNC',
          exchangeTradeId: { not: null },
        },
        select: {
          exchangeTradeId: true,
        },
      })
    )
      .map((trade) => trade.exchangeTradeId)
      .filter((exchangeTradeId): exchangeTradeId is string => typeof exchangeTradeId === 'string')
  );
  const closeAttribution = resolveExternalSyncMissingCloseAttribution();
  let createdCount = 0;

  for (const trade of input.derivedTrades) {
    if (existingTradeIds.has(trade.exchangeTradeId)) continue;
    await prisma.trade.create({
      data: {
        userId: input.userId,
        botId: input.botId,
        walletId: input.walletId,
        strategyId: input.strategyId,
        orderId: null,
        positionId: input.positionId,
        symbol: input.symbol,
        side: trade.side,
        lifecycleAction: trade.lifecycleAction,
        closeReason:
          trade.lifecycleAction === 'CLOSE' ? closeAttribution.closeReason : null,
        closeInitiator:
          trade.lifecycleAction === 'CLOSE' ? closeAttribution.closeInitiator : null,
        price: trade.price,
        quantity: trade.quantity,
        fee: trade.feeCost,
        feeSource: FeeSource.EXCHANGE_FILL,
        feePending: false,
        feeCurrency: trade.feeCurrency,
        effectiveFeeRate: trade.feeRate,
        exchangeTradeId: trade.exchangeTradeId,
        realizedPnl: trade.realizedPnl,
        origin: 'EXCHANGE_SYNC',
        managementMode: input.managementMode,
        executedAt: trade.executedAt,
      },
    });
    createdCount += 1;
  }

  const firstOpenTradeAt =
    input.derivedTrades.find((trade) => trade.lifecycleAction === 'OPEN')?.executedAt ??
    input.derivedTrades[0]?.executedAt ??
    null;
  const lastCloseTradeAt =
    [...input.derivedTrades]
      .reverse()
      .find((trade) => trade.lifecycleAction === 'CLOSE')?.executedAt ?? null;
  const realizedPnl = input.derivedTrades
    .filter((trade) => trade.lifecycleAction === 'CLOSE')
    .reduce((sum, trade) => sum + trade.realizedPnl, 0);

  return {
    createdCount,
    firstOpenTradeAt,
    lastCloseTradeAt,
    realizedPnl,
  };
};

const listExistingImportedTradeRows = async (positionId: string) =>
  prisma.trade.findMany({
    where: {
      positionId,
      origin: 'EXCHANGE_SYNC',
    },
    select: {
      id: true,
      exchangeTradeId: true,
      lifecycleAction: true,
    },
  });

const deleteImportedTradeRows = async (tradeIds: string[]) => {
  if (tradeIds.length === 0) return;
  await prisma.trade.deleteMany({
    where: {
      id: { in: tradeIds },
    },
  });
};

const persistImportedOpenAnchorTrade = async (input: {
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  positionSide: PositionSide;
  positionQuantity: number;
  positionEntryPrice: number;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  executedAt: Date;
}) => {
  await prisma.trade.create({
    data: {
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
      strategyId: input.strategyId,
      orderId: null,
      positionId: input.positionId,
      symbol: input.symbol,
      side: input.positionSide === 'LONG' ? 'BUY' : 'SELL',
      lifecycleAction: 'OPEN',
      closeReason: null,
      closeInitiator: null,
      price: input.positionEntryPrice,
      quantity: input.positionQuantity,
      fee: 0,
      feeSource: FeeSource.ESTIMATED,
      feePending: false,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeTradeId: null,
      realizedPnl: 0,
      origin: 'EXCHANGE_SYNC',
      managementMode: input.managementMode,
      executedAt: input.executedAt,
    },
  });
};

export const hydrateImportedPositionHistory = async (input: {
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  positionSide: PositionSide;
  positionQuantity: number;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  trades: ExchangeTradeHistoryItem[];
}) => {
  const position = await prisma.position.findUnique({
    where: { id: input.positionId },
    select: {
      openedAt: true,
      status: true,
      entryPrice: true,
    },
  });
  if (!position || position.status !== PositionStatus.OPEN) {
    return { hydrated: false, openedAt: null as Date | null };
  }

  const existingTradeRows = await listExistingImportedTradeRows(input.positionId);
  const existingSyntheticOpenAnchors =
    existingTradeRows.length > 0 &&
    existingTradeRows.every(isSyntheticImportedOpenAnchorTrade);

  const derivedTrades = deriveImportedLifecycleTrades({
    positionSide: input.positionSide,
    positionQuantity: input.positionQuantity,
    trades: input.trades.filter((trade) => normalizeSymbol(trade.symbol) === normalizeSymbol(input.symbol)),
  });

  if (derivedTrades && derivedTrades.length > 0) {
    if (existingTradeRows.length > 0 && !existingSyntheticOpenAnchors) {
      return { hydrated: false, openedAt: null as Date | null };
    }
    if (existingSyntheticOpenAnchors) {
      await deleteImportedTradeRows(existingTradeRows.map((trade) => trade.id));
    }

    const { firstOpenTradeAt } = await persistImportedLifecycleTrades({
      userId: input.userId,
      positionId: input.positionId,
      botId: input.botId,
      walletId: input.walletId,
      strategyId: input.strategyId,
      symbol: input.symbol,
      managementMode: input.managementMode,
      derivedTrades,
    });

    if (firstOpenTradeAt && firstOpenTradeAt.getTime() !== position.openedAt.getTime()) {
      await prisma.position.update({
        where: { id: input.positionId },
        data: {
          openedAt: firstOpenTradeAt,
        },
      });
    }

    return {
      hydrated: true,
      openedAt: firstOpenTradeAt,
    };
  }

  if (existingTradeRows.length > 0) {
    return { hydrated: false, openedAt: null as Date | null };
  }

  await persistImportedOpenAnchorTrade({
    userId: input.userId,
    positionId: input.positionId,
    botId: input.botId,
    walletId: input.walletId,
    strategyId: input.strategyId,
    symbol: input.symbol,
    positionSide: input.positionSide,
    positionQuantity: input.positionQuantity,
    positionEntryPrice: position.entryPrice,
    managementMode: input.managementMode,
    executedAt: position.openedAt,
  });

  return {
    hydrated: true,
    openedAt: position.openedAt,
  };
};

export const backfillClosedImportedPositionHistory = async (input: {
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  positionSide: PositionSide;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  trades: ExchangeTradeHistoryItem[];
}) => {
  const derivedTrades = deriveImportedLifecycleTrades({
    positionSide: input.positionSide,
    positionQuantity: 0,
    trades: input.trades.filter((trade) => normalizeSymbol(trade.symbol) === normalizeSymbol(input.symbol)),
  });
  if (!derivedTrades || derivedTrades.every((trade) => trade.lifecycleAction !== 'CLOSE')) {
    return {
      hydrated: false,
      openedAt: null as Date | null,
      closedAt: null as Date | null,
    };
  }

  const position = await prisma.position.findUnique({
    where: { id: input.positionId },
    select: {
      openedAt: true,
      closedAt: true,
      status: true,
    },
  });
  if (!position) {
    return {
      hydrated: false,
      openedAt: null as Date | null,
      closedAt: null as Date | null,
    };
  }

  const existingTradeRows = await listExistingImportedTradeRows(input.positionId);
  const existingSyntheticOpenAnchors =
    existingTradeRows.length > 0 &&
    existingTradeRows.every(isSyntheticImportedOpenAnchorTrade);
  if (existingSyntheticOpenAnchors) {
    await deleteImportedTradeRows(existingTradeRows.map((trade) => trade.id));
  }

  const { createdCount, firstOpenTradeAt, lastCloseTradeAt, realizedPnl } =
    await persistImportedLifecycleTrades({
      userId: input.userId,
      positionId: input.positionId,
      botId: input.botId,
      walletId: input.walletId,
      strategyId: input.strategyId,
      symbol: input.symbol,
      managementMode: input.managementMode,
      derivedTrades,
    });

  const nextOpenedAt =
    firstOpenTradeAt && firstOpenTradeAt.getTime() !== position.openedAt.getTime()
      ? firstOpenTradeAt
      : null;
  const nextClosedAt =
    lastCloseTradeAt &&
    (!position.closedAt || lastCloseTradeAt.getTime() !== position.closedAt.getTime())
      ? lastCloseTradeAt
      : null;
  if (nextOpenedAt || nextClosedAt || position.status !== PositionStatus.CLOSED) {
    await prisma.position.update({
      where: { id: input.positionId },
      data: {
        ...(nextOpenedAt ? { openedAt: nextOpenedAt } : {}),
        ...(nextClosedAt ? { closedAt: nextClosedAt } : {}),
        ...(Number.isFinite(realizedPnl) ? { realizedPnl } : {}),
      },
    });
  }

  return {
    hydrated: createdCount > 0 || nextOpenedAt != null || nextClosedAt != null,
    openedAt: firstOpenTradeAt,
    closedAt: lastCloseTradeAt,
  };
};
