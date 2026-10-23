import { FeeSource, PositionSide, PositionStatus, Prisma, TradeLifecycleAction } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { resolveExternalSyncMissingCloseAttribution } from './positionCloseAttribution';
import { ExchangeTradeHistoryItem } from './positions.exchangeSnapshot.types';
import { normalizeSymbol } from './livePositionReconciliation.helpers';
import { settleImportedRuntimeCloseFinancials } from './importedPositionRuntimeFinancialSettlement';

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

const hasUnsafeImportedContractUnit = (position: {
  contractSize: number | null;
  wallet: { exchange: string; marketType: string } | null;
  bot: { exchange: string; marketType: string } | null;
}) => {
  // This hydrator still derives notional and PnL from price times quantity.
  const gateFutures = [position.wallet, position.bot].some((owner) =>
    owner?.exchange === 'GATEIO' && owner.marketType === 'FUTURES');
  return (position.contractSize != null && position.contractSize !== 1) ||
    (gateFutures && position.contractSize !== 1);
};

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
  if (input.trades.some((trade) =>
    typeof trade.feeCost !== 'number' || !Number.isFinite(trade.feeCost)
  )) return null;
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
        feeCost: trade.feeCost!,
        feeCurrency: trade.feeCurrency,
        feeRate: trade.feeRate,
        executedAt,
      };
    })
    .filter((trade): trade is HydratableTrade => trade != null)
    .sort((left, right) => left.executedAt.getTime() - right.executedAt.getTime());

  if (normalizedTrades.length === 0) return null;

  let cumulative = 0;
  let unallocatedEntryFees = 0;
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
      unallocatedEntryFees += trade.feeCost;
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
      unallocatedEntryFees += trade.feeCost;
      continue;
    }

    if (nextAbs < currentAbs) {
      const reducedQuantity = currentAbs - nextAbs;
      const allocatedEntryFee = unallocatedEntryFees * (reducedQuantity / currentAbs);
      const realizedPnl =
        currentSignedQuantity > 0
          ? (trade.price - averageEntryPrice) * reducedQuantity - allocatedEntryFee - trade.feeCost
          : (averageEntryPrice - trade.price) * reducedQuantity - allocatedEntryFee - trade.feeCost;
      derivedTrades.push({
        ...trade,
        lifecycleAction: 'CLOSE',
        realizedPnl,
      });
      currentSignedQuantity = nextSignedQuantity;
      unallocatedEntryFees -= allocatedEntryFee;
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
  client?: Prisma.TransactionClient;
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  derivedTrades: DerivedLifecycleTrade[];
}) => {
  const client = input.client ?? prisma;
  const existingTrades = await client.trade.findMany({
    where: { positionId: input.positionId },
    select: {
      id: true, exchangeTradeId: true, lifecycleAction: true,
      side: true, price: true, quantity: true,
      order: { select: { exchangeOrderId: true } },
    },
  });
  const existingTradesByExchangeId = new Map(existingTrades
    .filter((trade): trade is typeof trade & { exchangeTradeId: string } =>
      typeof trade.exchangeTradeId === 'string')
    .map((trade) => [trade.exchangeTradeId, trade.id] as const));
  const claimedTradeIds = new Set<string>();
  const closeFillsByOrder = new Map<string, DerivedLifecycleTrade[]>();
  for (const trade of input.derivedTrades) {
    if (trade.lifecycleAction !== 'CLOSE' || !trade.exchangeOrderId) continue;
    const fills = closeFillsByOrder.get(trade.exchangeOrderId) ?? [];
    fills.push(trade);
    closeFillsByOrder.set(trade.exchangeOrderId, fills);
  }
  const aggregateCloseByOrder = new Map<string, typeof existingTrades[number]>();
  for (const [exchangeOrderId, fills] of closeFillsByOrder) {
    if (fills.length < 2) continue;
    const quantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const candidates = existingTrades.filter((existing) =>
      existing.lifecycleAction === 'CLOSE' && existing.side === fills[0].side &&
      existing.order?.exchangeOrderId === exchangeOrderId &&
      nearlyEqual(existing.quantity, quantity));
    if (candidates.length === 1) aggregateCloseByOrder.set(exchangeOrderId, candidates[0]);
  }
  const updatedAggregateCloseIds = new Set<string>();
  const closeAttribution = resolveExternalSyncMissingCloseAttribution();
  let createdCount = 0;

  for (const trade of input.derivedTrades) {
    const aggregateClose = trade.lifecycleAction === 'CLOSE' && trade.exchangeOrderId
      ? aggregateCloseByOrder.get(trade.exchangeOrderId) : null;
    if (aggregateClose) {
      if (!updatedAggregateCloseIds.has(aggregateClose.id)) {
        const fills = closeFillsByOrder.get(trade.exchangeOrderId!)!;
        const feeTotal = fills.reduce((sum, fill) => sum + fill.feeCost, 0);
        const notionalTotal = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
        const sameFeeCurrency = fills.every((fill) => fill.feeCurrency === fills[0].feeCurrency);
        await client.trade.update({ where: { id: aggregateClose.id }, data: {
          fee: feeTotal,
          feeSource: FeeSource.EXCHANGE_FILL, feePending: false,
          feeCurrency: sameFeeCurrency ? fills[0].feeCurrency : null,
          effectiveFeeRate: sameFeeCurrency && notionalTotal > 0 ? feeTotal / notionalTotal : null,
          realizedPnl: fills.reduce((sum, fill) => sum + fill.realizedPnl, 0),
        } });
        updatedAggregateCloseIds.add(aggregateClose.id);
      }
      continue;
    }
    const exactTradeId = existingTradesByExchangeId.get(trade.exchangeTradeId);
    const fallbackMatches = exactTradeId ? [] : existingTrades.filter((existing) =>
      !claimedTradeIds.has(existing.id) &&
      (existing.exchangeTradeId == null || existing.exchangeTradeId.startsWith('soar-fill-')) &&
      existing.order?.exchangeOrderId === trade.exchangeOrderId && trade.exchangeOrderId != null &&
      existing.lifecycleAction === trade.lifecycleAction && existing.side === trade.side &&
      nearlyEqual(existing.price, trade.price) && nearlyEqual(existing.quantity, trade.quantity));
    const existingTradeId = exactTradeId ??
      (fallbackMatches.length === 1 ? fallbackMatches[0].id : null);
    if (existingTradeId) {
      await client.trade.update({ where: { id: existingTradeId }, data: {
        ...(exactTradeId ? {} : { exchangeTradeId: trade.exchangeTradeId }),
        fee: trade.feeCost, feeSource: FeeSource.EXCHANGE_FILL, feePending: false,
        feeCurrency: trade.feeCurrency, effectiveFeeRate: trade.feeRate,
        realizedPnl: trade.realizedPnl,
      } });
      claimedTradeIds.add(existingTradeId);
      existingTradesByExchangeId.set(trade.exchangeTradeId, existingTradeId);
      continue;
    }
    const created = await client.trade.create({
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
        executionMode: 'LIVE',
        executedAt: trade.executedAt,
      },
    });
    existingTradesByExchangeId.set(trade.exchangeTradeId, created.id);
    createdCount += 1;
  }

  const canonicalFillsByOrder = new Map<string, DerivedLifecycleTrade[]>();
  for (const trade of input.derivedTrades) {
    if (!trade.exchangeOrderId) continue;
    const fills = canonicalFillsByOrder.get(trade.exchangeOrderId) ?? [];
    fills.push(trade);
    canonicalFillsByOrder.set(trade.exchangeOrderId, fills);
  }
  for (const [exchangeOrderId, canonicalFills] of canonicalFillsByOrder) {
    const order = await client.order.findFirst({
      where: { userId: input.userId, positionId: input.positionId, exchangeOrderId },
      select: { id: true, filledQuantity: true },
    });
    if (!order) continue;
    const orderFills = await client.orderFill.findMany({
      where: { orderId: order.id },
      select: { id: true, exchangeTradeId: true, side: true, price: true, quantity: true },
    });
    if (orderFills.length !== canonicalFills.length ||
        !nearlyEqual(order.filledQuantity, canonicalFills.reduce((sum, fill) => sum + fill.quantity, 0))) {
      continue;
    }
    const matchedFills = new Map<string, typeof orderFills[number]>();
    const usedFillIds = new Set<string>();
    for (const fill of canonicalFills) {
      const exact = orderFills.find((recorded) => recorded.exchangeTradeId === fill.exchangeTradeId);
      const candidates = exact ? [exact] : orderFills.filter((recorded) =>
        !usedFillIds.has(recorded.id) && recorded.exchangeTradeId.startsWith('soar-fill-') &&
        recorded.side === fill.side && nearlyEqual(recorded.price, fill.price) &&
        nearlyEqual(recorded.quantity, fill.quantity));
      if (candidates.length !== 1 || usedFillIds.has(candidates[0].id) ||
          candidates[0].side !== fill.side || !nearlyEqual(candidates[0].price, fill.price) ||
          !nearlyEqual(candidates[0].quantity, fill.quantity)) break;
      matchedFills.set(fill.exchangeTradeId, candidates[0]);
      usedFillIds.add(candidates[0].id);
    }
    if (matchedFills.size !== canonicalFills.length) continue;
    for (const fill of canonicalFills) {
      const recorded = matchedFills.get(fill.exchangeTradeId)!;
      await client.orderFill.update({
        where: { id: recorded.id },
        data: {
          exchangeTradeId: fill.exchangeTradeId,
          feeCost: fill.feeCost, feeCurrency: fill.feeCurrency, feeRate: fill.feeRate,
        },
      });
    }
    await client.order.update({
      where: { id: order.id }, data: {
        fee: canonicalFills.reduce((sum, fill) => sum + fill.feeCost, 0),
        feeSource: FeeSource.EXCHANGE_FILL, feePending: false,
      },
    });
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

const listExistingImportedTradeRows = async (
  positionId: string, client: Prisma.TransactionClient | typeof prisma = prisma
) => client.trade.findMany({
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

const deleteImportedTradeRows = async (
  tradeIds: string[], client: Prisma.TransactionClient | typeof prisma = prisma
) => {
  if (tradeIds.length === 0) return;
  await client.trade.deleteMany({
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
      fee: null,
      feeSource: FeeSource.ESTIMATED,
      feePending: true,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeTradeId: null,
      realizedPnl: 0,
      origin: 'EXCHANGE_SYNC',
      managementMode: input.managementMode,
      executionMode: 'LIVE',
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
      contractSize: true,
      wallet: { select: { exchange: true, marketType: true } },
      bot: { select: { exchange: true, marketType: true } },
    },
  });
  if (!position || position.status !== PositionStatus.OPEN ||
      hasUnsafeImportedContractUnit(position)) {
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

  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "Position" WHERE "id" = ${input.positionId} FOR UPDATE`);
    const position = await tx.position.findUnique({
      where: { id: input.positionId },
      select: {
        openedAt: true,
        closedAt: true,
        status: true,
        realizedPnl: true,
        contractSize: true,
        wallet: { select: { exchange: true, marketType: true } },
        bot: { select: { exchange: true, marketType: true } },
      },
    });
    if (!position || hasUnsafeImportedContractUnit(position)) {
      return {
        hydrated: false,
        openedAt: null as Date | null,
        closedAt: null as Date | null,
      };
    }

    const closeFillsByOrder = new Map<string, DerivedLifecycleTrade[]>();
    for (const trade of derivedTrades) {
      if (trade.lifecycleAction !== 'CLOSE' || !trade.exchangeOrderId) continue;
      const fills = closeFillsByOrder.get(trade.exchangeOrderId) ?? [];
      fills.push(trade);
      closeFillsByOrder.set(trade.exchangeOrderId, fills);
    }
    for (const [exchangeOrderId, fills] of closeFillsByOrder) {
      if (fills.length < 2) continue;
      const linkedCloses = await tx.trade.findMany({
        where: { positionId: input.positionId, lifecycleAction: 'CLOSE',
          order: { exchangeOrderId } },
        select: { side: true, quantity: true, exchangeTradeId: true },
      });
      if (linkedCloses.length === 0) continue;
      const aggregateMatches = linkedCloses.length === 1 &&
        linkedCloses[0].side === fills[0].side &&
        nearlyEqual(linkedCloses[0].quantity, fills.reduce((sum, fill) => sum + fill.quantity, 0));
      const matchedFillIds = new Set<string>();
      const individualMatches = linkedCloses.length === fills.length &&
        linkedCloses.every((close) => {
          const fill = fills.find((candidate) =>
            !matchedFillIds.has(candidate.exchangeTradeId) &&
            candidate.exchangeTradeId === close.exchangeTradeId && close.side === candidate.side &&
            nearlyEqual(close.quantity, candidate.quantity));
          if (!fill) return false;
          matchedFillIds.add(fill.exchangeTradeId);
          return true;
        });
      if (!aggregateMatches && !individualMatches) {
        return { hydrated: false, openedAt: null, closedAt: null };
      }
    }

    const existingTradeRows = await listExistingImportedTradeRows(input.positionId, tx);
    await deleteImportedTradeRows(
      existingTradeRows.filter(isSyntheticImportedOpenAnchorTrade).map((trade) => trade.id), tx
    );

    const { createdCount, firstOpenTradeAt, lastCloseTradeAt, realizedPnl } =
      await persistImportedLifecycleTrades({
        client: tx,
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
    if (nextOpenedAt || nextClosedAt || position.status !== PositionStatus.CLOSED ||
        position.realizedPnl !== realizedPnl) {
      await tx.position.update({
        where: { id: input.positionId },
        data: {
          ...(nextOpenedAt ? { openedAt: nextOpenedAt } : {}),
          ...(nextClosedAt ? { closedAt: nextClosedAt } : {}),
          ...(Number.isFinite(realizedPnl) ? { realizedPnl } : {}),
        },
      });
    }

    await settleImportedRuntimeCloseFinancials({
      tx, userId: input.userId, positionId: input.positionId,
      symbol: normalizeSymbol(input.symbol), realizedPnl,
      exitFees: derivedTrades.filter((trade) => trade.lifecycleAction === 'CLOSE')
        .reduce((sum, trade) => sum + trade.feeCost, 0),
    });

    return {
      hydrated: createdCount > 0 || nextOpenedAt != null || nextClosedAt != null,
      openedAt: firstOpenTradeAt,
      closedAt: lastCloseTradeAt,
    };
  }, { timeout: 30_000 });
};
