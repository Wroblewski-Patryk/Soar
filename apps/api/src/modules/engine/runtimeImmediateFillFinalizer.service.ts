import { Order, PositionCloseInitiator, PositionCloseReason, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { lockExchangeOrderIdentity } from '../orders/orders.exchangeIdentityLock';
import { computePositionAddUpdate } from '../orders/positionFillMath';
import { isCloseQuantityComplete } from './executionOrchestrator.helpers';
import { buildRuntimeClientOrderId } from './runtimeExecutionClientOrderId';
import { resolveKnownEntryFeesInTransaction } from '../orders/orders.exchangeEventFinalization.service';

export const recordUnknownRuntimeOrderOutcome = async (input: {
  userId: string;
  botId?: string | null;
  positionId: string;
  symbol: string;
  dedupeKey: string;
  orderId: string | null;
  commandType: 'DCA' | 'CLOSE';
}) => {
  try {
    await prisma.log.create({ data: {
      userId: input.userId, botId: input.botId ?? undefined,
      action: `runtime.${input.commandType.toLowerCase()}.unknown`, level: 'WARN',
      source: 'engine.runtimeImmediateFillFinalizer',
      message: `Runtime ${input.commandType} outcome unknown for ${input.symbol}`,
      category: 'TRADING_DECISION', entityType: 'position', entityId: input.positionId,
      metadata: { dedupeKey: input.dedupeKey, orderId: input.orderId,
        clientOrderId: buildRuntimeClientOrderId(input.dedupeKey) },
    } });
  } catch { /* The durable dedupe error remains the audit fallback. */ }
};

const requireFilledOrder = async (
  tx: Prisma.TransactionClient,
  input: { userId: string; orderId: string; positionId: string }
) => {
  await lockExchangeOrderIdentity(tx, input.userId, input.orderId);
  const order = await tx.order.findFirst({
    where: { id: input.orderId, userId: input.userId, positionId: input.positionId },
  });
  if (!order || order.status !== 'FILLED' || order.syncState !== 'IN_SYNC') {
    throw new Error('Runtime fill finalization requires a filled synced order');
  }
  return order;
};

const markDedupeSucceeded = async (
  tx: Prisma.TransactionClient,
  input: { dedupeKey: string; orderId: string; positionId: string }
) => {
  await tx.runtimeExecutionDedupe.update({
    where: { dedupeKey: input.dedupeKey },
    data: {
      status: 'SUCCEEDED', orderId: input.orderId, positionId: input.positionId,
      errorClass: null, lastSeenAt: new Date(),
    },
  });
};

export const finalizeRuntimeDcaFill = async (input: {
  userId: string;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  positionId: string;
  order: Order;
  dedupeKey: string;
  fillPrice: number;
  fillQuantity: number;
  feePaid: number | null;
  mode: 'PAPER' | 'LIVE';
  afterPositionWrite?: () => Promise<void>;
}) => prisma.$transaction(async (tx) => {
  const order = await requireFilledOrder(tx, {
    userId: input.userId, orderId: input.order.id, positionId: input.positionId,
  });
  const position = await tx.position.findUniqueOrThrow({ where: { id: input.positionId } });
  const existingTrade = await tx.trade.findFirst({
    where: { userId: input.userId, orderId: order.id, lifecycleAction: 'DCA' },
  });
  if (existingTrade) {
    await markDedupeSucceeded(tx, { dedupeKey: input.dedupeKey, orderId: order.id, positionId: position.id });
    return { applied: false, feePaid: 0, nextQuantity: position.quantity, nextEntryPrice: position.entryPrice };
  }
  if (position.userId !== input.userId || position.status !== 'OPEN' || position.syncState !== 'IN_SYNC') {
    throw new Error('Runtime DCA position is not open and synced');
  }
  const { nextQuantity, nextEntryPrice } = computePositionAddUpdate({
    currentQuantity: position.quantity,
    currentEntryPrice: position.entryPrice,
    addedQuantity: input.fillQuantity,
    fillPrice: input.fillPrice,
  });
  await tx.position.update({
    where: { id: position.id }, data: { quantity: nextQuantity, entryPrice: nextEntryPrice },
  });
  await input.afterPositionWrite?.();
  await tx.trade.create({
    data: {
      userId: input.userId, botId: input.botId ?? undefined,
      walletId: input.walletId ?? undefined, strategyId: input.strategyId ?? undefined,
      orderId: order.id, positionId: position.id, symbol: order.symbol, side: order.side,
      lifecycleAction: 'DCA', price: input.fillPrice, quantity: input.fillQuantity,
      fee: input.feePaid, feeSource: order.feeSource, feePending: order.feePending,
      feeCurrency: order.feeCurrency, effectiveFeeRate: order.effectiveFeeRate,
      exchangeTradeId: order.exchangeTradeId, realizedPnl: 0, origin: 'BOT',
      managementMode: 'BOT_MANAGED', executionMode: input.mode,
    },
  });
  await tx.log.create({
    data: {
      userId: input.userId, botId: input.botId ?? undefined,
      strategyId: input.strategyId ?? undefined,
      action: 'runtime.dca', level: 'INFO', source: 'engine.runtimePositionAutomation',
      message: `Runtime DCA executed for ${order.symbol}`, category: 'runtime',
      entityType: 'position', entityId: position.id, actor: 'runtime',
      metadata: {
        symbol: order.symbol, mode: input.mode, orderId: order.id,
        addedQuantity: input.fillQuantity, fillPrice: input.fillPrice,
        fee: input.feePaid, nextQuantity, nextEntryPrice,
      } as Prisma.InputJsonValue,
    },
  });
  await markDedupeSucceeded(tx, { dedupeKey: input.dedupeKey, orderId: order.id, positionId: position.id });
  return { applied: true, feePaid: input.feePaid ?? 0, nextQuantity, nextEntryPrice };
});

export const finalizeLiveCloseFill = async (input: {
  userId: string;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  positionId: string;
  order: Order;
  dedupeKey: string;
  fillPrice: number;
  fillQuantity: number;
  exitFee: number;
  closedAt: Date;
  closeReason: PositionCloseReason;
  closeInitiator: PositionCloseInitiator;
  afterPositionWrite?: () => Promise<void>;
}) => prisma.$transaction(async (tx) => {
  const order = await requireFilledOrder(tx, {
    userId: input.userId, orderId: input.order.id, positionId: input.positionId,
  });
  const position = await tx.position.findUniqueOrThrow({ where: { id: input.positionId } });
  const existingTrade = await tx.trade.findFirst({
    where: { userId: input.userId, orderId: order.id, lifecycleAction: 'CLOSE' },
  });
  if (existingTrade) {
    if (position.status !== 'CLOSED') throw new Error('Close trade exists while position is open');
    await markDedupeSucceeded(tx, { dedupeKey: input.dedupeKey, orderId: order.id, positionId: position.id });
    return { applied: false, realizedPnl: existingTrade.realizedPnl };
  }
  if (position.userId !== input.userId || position.status !== 'OPEN' || position.syncState !== 'IN_SYNC' ||
      !isCloseQuantityComplete(input.fillQuantity, position.quantity)) {
    throw new Error('Runtime CLOSE position is not safely closable');
  }
  const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
  const entryFees = await resolveKnownEntryFeesInTransaction(tx, {
    userId: input.userId, positionId: position.id, entrySide,
    imported: position.origin === 'EXCHANGE_SYNC',
  });
  const grossPnl = position.side === 'LONG'
    ? (input.fillPrice - position.entryPrice) * input.fillQuantity
    : (position.entryPrice - input.fillPrice) * input.fillQuantity;
  const realizedPnl = entryFees != null && !order.feePending &&
    Number.isFinite(input.exitFee) && order.fee != null
    ? grossPnl - entryFees - input.exitFee : null;
  await tx.position.update({
    where: { id: position.id },
    data: {
      status: 'CLOSED', closedAt: input.closedAt, realizedPnl, unrealizedPnl: 0,
      closeReason: input.closeReason, closeInitiator: input.closeInitiator,
    },
  });
  await input.afterPositionWrite?.();
  await tx.trade.create({
    data: {
      userId: input.userId, botId: input.botId ?? undefined,
      walletId: input.walletId ?? undefined, strategyId: input.strategyId ?? undefined,
      orderId: order.id, positionId: position.id, symbol: order.symbol, side: order.side,
      lifecycleAction: 'CLOSE', price: input.fillPrice, quantity: input.fillQuantity,
      fee: order.fee, feeSource: order.feeSource,
      feePending: order.feePending || entryFees == null,
      feeCurrency: order.feeCurrency, effectiveFeeRate: order.effectiveFeeRate,
      exchangeTradeId: order.exchangeTradeId, realizedPnl,
      closeReason: input.closeReason, closeInitiator: input.closeInitiator,
      origin: 'BOT', managementMode: position.managementMode, executionMode: 'LIVE',
    },
  });
  await markDedupeSucceeded(tx, { dedupeKey: input.dedupeKey, orderId: order.id, positionId: position.id });
  return { applied: true, realizedPnl };
});
