import { PositionCloseInitiator, PositionCloseReason, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';
import { confirmedAccountSnapshotMatches, lockLivePosition,
  matchesAccountSnapshot } from './orders.exchangeAccountUpdateScope';
import { computePositionAddUpdate } from './positionFillMath';
import { isExchangeCloseFillComplete } from './orders.exchangeEvents.helpers';

export const resolveKnownEntryFeesInTransaction = async (
  tx: Prisma.TransactionClient,
  input: { userId: string; positionId: string; entrySide: 'BUY' | 'SELL'; imported: boolean }
): Promise<number | null> => {
  const entries = await tx.trade.findMany({
    where: { userId: input.userId, positionId: input.positionId, side: input.entrySide },
    select: { fee: true, feePending: true },
  });
  if (input.imported && entries.length === 0) return null;
  let total = 0;
  for (const entry of entries) {
    if (entry.feePending || entry.fee == null || !Number.isFinite(entry.fee)) return null;
    total += entry.fee;
  }
  return total;
};

type ExchangeFillFinalizationInput = {
  userId: string;
  orderId: string;
  positionId: string;
  fillPrice: number;
  fillQuantity: number;
  exchangeTradeId: string | null;
  eventAt: Date;
  client?: PrismaClient;
};

export const finalizeExchangeDcaFillInTransaction = async (
  tx: Prisma.TransactionClient, input: ExchangeFillFinalizationInput
) => {
    await lockExchangeOrderIdentity(tx, input.userId, input.orderId);
    const order = await tx.order.findFirstOrThrow({
      where: { id: input.orderId, userId: input.userId, positionId: input.positionId },
    });
    await lockLivePosition(tx, input.userId, input.positionId);
    const position = await tx.position.findUniqueOrThrow({ where: { id: input.positionId } });
    const existingTrade = await tx.trade.findFirst({
      where: { orderId: order.id, lifecycleAction: 'DCA' }, select: { id: true },
    });
    if (existingTrade) return { nextQuantity: position.quantity, nextEntryPrice: position.entryPrice };
    if (position.userId !== input.userId || position.status !== 'OPEN' || position.syncState !== 'IN_SYNC') {
      throw new Error('Exchange DCA fill position is not open and synced');
    }
    const { nextQuantity, nextEntryPrice } = computePositionAddUpdate({
      currentQuantity: position.quantity, currentEntryPrice: position.entryPrice,
      addedQuantity: input.fillQuantity, fillPrice: input.fillPrice,
    });
    const hasAccountSnapshot = position.origin !== 'EXCHANGE_SYNC' &&
      position.lastAccountSeenAt != null;
    const agreesWithAccount = hasAccountSnapshot && confirmedAccountSnapshotMatches({
      quantity: nextQuantity, entryPrice: nextEntryPrice,
      lastAccountSeenAt: position.lastAccountSeenAt,
      lastAccountQuantity: position.lastAccountQuantity,
      lastAccountEntryPrice: position.lastAccountEntryPrice,
    });
    const continuityState = hasAccountSnapshot
      ? agreesWithAccount ? 'CONFIRMED' : 'RECOVERING'
      : position.origin === 'EXCHANGE_SYNC' ? 'CONFIRMED' : position.continuityState;
    const recovering = continuityState === 'RECOVERING';
    await tx.position.update({
      where: { id: position.id }, data: {
        quantity: nextQuantity, entryPrice: nextEntryPrice,
        lastExchangeSeenAt: position.lastExchangeSeenAt &&
          position.lastExchangeSeenAt > input.eventAt
          ? position.lastExchangeSeenAt : input.eventAt,
        lastExchangeSyncAt: input.eventAt,
        missingSince: recovering ? position.missingSince ?? input.eventAt : null,
        missingSyncCount: recovering ? Math.max(1, position.missingSyncCount) : 0,
        continuityState,
      },
    });
    await tx.trade.create({ data: {
      userId: input.userId, botId: order.botId, walletId: order.walletId,
      strategyId: order.strategyId, orderId: order.id, positionId: position.id,
      symbol: order.symbol, side: order.side, lifecycleAction: 'DCA',
      price: input.fillPrice, quantity: input.fillQuantity, fee: order.fee,
      feeSource: order.feeSource, feePending: order.feePending,
      feeCurrency: order.feeCurrency, effectiveFeeRate: order.effectiveFeeRate,
      exchangeTradeId: input.exchangeTradeId, realizedPnl: 0,
      managementMode: order.managementMode, origin: order.origin, executionMode: 'LIVE',
    } });
    return { nextQuantity, nextEntryPrice };
};

export const finalizeExchangeDcaFill = (input: ExchangeFillFinalizationInput) =>
  (input.client ?? prisma).$transaction((tx) => finalizeExchangeDcaFillInTransaction(tx, input));

type ExchangeCloseFillFinalizationInput = ExchangeFillFinalizationInput & {
  closeReason: PositionCloseReason;
  closeInitiator: PositionCloseInitiator;
};

export const finalizeExchangeCloseFillInTransaction = async (
  tx: Prisma.TransactionClient, input: ExchangeCloseFillFinalizationInput
) => {
  await lockExchangeOrderIdentity(tx, input.userId, input.orderId);
  const order = await tx.order.findFirstOrThrow({
    where: { id: input.orderId, userId: input.userId, positionId: input.positionId },
  });
  await lockLivePosition(tx, input.userId, input.positionId);
  const position = await tx.position.findUniqueOrThrow({ where: { id: input.positionId } });
  const existingTrade = await tx.trade.findFirst({
    where: { orderId: order.id, lifecycleAction: 'CLOSE' }, select: { id: true },
  });
  if (existingTrade) return;
  if (position.userId !== input.userId || position.status !== 'OPEN' || position.syncState !== 'IN_SYNC' ||
      !isExchangeCloseFillComplete({ filledQuantity: input.fillQuantity, positionQuantity: position.quantity })) {
    throw new Error('Exchange CLOSE fill position is not safely closable');
  }
  const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
  const entryFees = await resolveKnownEntryFeesInTransaction(tx, {
    userId: input.userId, positionId: position.id, entrySide,
    imported: position.origin === 'EXCHANGE_SYNC',
  });
  const grossPnl = position.side === 'LONG'
    ? (input.fillPrice - position.entryPrice) * input.fillQuantity
    : (position.entryPrice - input.fillPrice) * input.fillQuantity;
  const realizedPnl = entryFees != null && order.fee != null && !order.feePending
    ? grossPnl - entryFees - order.fee : null;
  const accountDisagreesWithClose = position.origin !== 'EXCHANGE_SYNC' &&
    position.lastAccountSeenAt != null &&
    (position.lastAccountQuantity == null ||
      !matchesAccountSnapshot(0, position.lastAccountQuantity));
  await tx.position.update({
    where: { id: position.id }, data: {
      status: 'CLOSED', closedAt: input.eventAt, syncState: 'ORPHAN_LOCAL',
      continuityState: accountDisagreesWithClose ? 'RECOVERING' : 'EXTERNAL_CLOSE_CONFIRMED',
      missingSince: accountDisagreesWithClose ? position.missingSince ?? input.eventAt : null,
      missingSyncCount: accountDisagreesWithClose
        ? Math.max(1, position.missingSyncCount) : 0,
      realizedPnl, unrealizedPnl: 0,
      closeReason: input.closeReason, closeInitiator: input.closeInitiator,
    },
  });
  await tx.trade.create({ data: {
    userId: input.userId, botId: order.botId, walletId: order.walletId,
    strategyId: order.strategyId, orderId: order.id, positionId: position.id,
    symbol: order.symbol, side: order.side, lifecycleAction: 'CLOSE',
    price: input.fillPrice, quantity: input.fillQuantity, fee: order.fee,
    feeSource: order.feeSource, feePending: order.feePending || entryFees == null,
    feeCurrency: order.feeCurrency, effectiveFeeRate: order.effectiveFeeRate,
    exchangeTradeId: input.exchangeTradeId, realizedPnl,
    closeReason: input.closeReason, closeInitiator: input.closeInitiator,
    managementMode: order.managementMode, origin: order.origin, executionMode: 'LIVE',
  } });
};

export const finalizeExchangeCloseFill = (input: ExchangeCloseFillFinalizationInput) =>
  (input.client ?? prisma).$transaction((tx) => finalizeExchangeCloseFillInTransaction(tx, input));
