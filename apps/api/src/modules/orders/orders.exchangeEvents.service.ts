import { OrderStatus, Prisma, PrismaClient } from '@prisma/client';

import { prisma } from '../../prisma/client';
import {
  NormalizedBinanceAccountUpdateEvent,
  NormalizedBinanceOrderTradeUpdateEvent,
  NormalizedBinanceUserDataStreamEvent,
} from '../exchange/binanceUserDataStream.types';
import {
  resolveExchangeConfirmedCloseAttribution,
} from '../positions/positionCloseAttribution';
import { applyOrderFillLifecycleInTransaction } from './orders.lifecycle.service';
import { finalizeExchangeCloseFillInTransaction, finalizeExchangeDcaFillInTransaction } from './orders.exchangeEventFinalization.service';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';
import { runtimeExecutionDedupeService } from '../engine/runtimeExecutionDedupe.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import {
  isExchangeCloseFillComplete,
  resolveExchangeFeePendingDecision,
  resolveExchangeFeeRefreshDecision,
  resolveExchangeOrderFillProgress,
} from './orders.exchangeEvents.helpers';

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase().replace(/[/:]/g, '');

const mapExchangeOrderStatus = (status: string): OrderStatus => {
  const normalized = status.trim().toUpperCase();
  if (normalized.includes('PARTIALLY')) return 'PARTIALLY_FILLED';
  if (normalized.includes('FILLED')) return 'FILLED';
  if (normalized.includes('CANCELED') || normalized.includes('CANCELLED')) return 'CANCELED';
  if (normalized.includes('REJECT')) return 'REJECTED';
  if (normalized.includes('EXPIRE')) return 'EXPIRED';
  if (normalized.includes('NEW') || normalized.includes('OPEN')) return 'OPEN';
  return 'OPEN';
};

const isClosingOrderForPosition = (input: {
  orderSide: 'BUY' | 'SELL';
  positionSide: 'LONG' | 'SHORT';
}) =>
  (input.positionSide === 'LONG' && input.orderSide === 'SELL') ||
  (input.positionSide === 'SHORT' && input.orderSide === 'BUY');

const computeCloseRealizedPnl = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  positionId: string;
  positionSide: 'LONG' | 'SHORT';
  entryPrice: number;
  closePrice: number;
  closeQuantity: number;
  exitFee: number;
}) => {
  const entryLegSide = input.positionSide === 'LONG' ? 'BUY' : 'SELL';
  const entryFeeAggregate = await input.tx.trade.aggregate({
    where: {
      userId: input.userId,
      positionId: input.positionId,
      side: entryLegSide,
    },
    _sum: {
      fee: true,
    },
  });
  const entryFees = entryFeeAggregate._sum.fee ?? 0;
  const grossPnl =
    input.positionSide === 'LONG'
      ? (input.closePrice - input.entryPrice) * input.closeQuantity
      : (input.entryPrice - input.closePrice) * input.closeQuantity;
  return grossPnl - entryFees - input.exitFee;
};

const refreshCloseRealizedPnlForOrder = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  orderId: string;
  exitFee: number;
}) => {
  if (!Number.isFinite(input.exitFee)) return;

  const closeTrades = await input.tx.trade.findMany({
    where: {
      userId: input.userId,
      orderId: input.orderId,
      lifecycleAction: 'CLOSE',
      positionId: { not: null },
    },
    select: {
      id: true,
      positionId: true,
      price: true,
      quantity: true,
    },
  });

  for (const closeTrade of closeTrades) {
    if (
      !closeTrade.positionId ||
      !Number.isFinite(closeTrade.price) ||
      !Number.isFinite(closeTrade.quantity)
    ) {
      continue;
    }

    const position = await input.tx.position.findFirst({
      where: {
        id: closeTrade.positionId,
        userId: input.userId,
      },
      select: {
        id: true,
        side: true,
        entryPrice: true,
      },
    });
    if (!position) continue;

    const realizedPnl = await computeCloseRealizedPnl({
      tx: input.tx,
      userId: input.userId,
      positionId: position.id,
      positionSide: position.side,
      entryPrice: position.entryPrice,
      closePrice: closeTrade.price,
      closeQuantity: closeTrade.quantity,
      exitFee: input.exitFee,
    });

    await input.tx.trade.update({
      where: { id: closeTrade.id },
      data: { realizedPnl },
    });
    await input.tx.position.update({
      where: { id: position.id },
      data: { realizedPnl },
    });
  }
};

const ensureOrderFillRecord = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  botId: string | null;
  strategyId: string | null;
  orderId: string;
  positionId: string | null;
  symbol: string;
  side: 'BUY' | 'SELL';
  exchangeTradeId: string;
  price: number;
  quantity: number;
  feeCost: number | null;
  feeCurrency: string | null;
  executedAt: Date;
  raw: Prisma.InputJsonValue;
}) => {
  const existing = await input.tx.orderFill.findFirst({
    where: {
      orderId: input.orderId,
      exchangeTradeId: input.exchangeTradeId,
    },
    select: { id: true },
  });
  if (existing) return;

  await input.tx.orderFill.create({
    data: {
      userId: input.userId,
      botId: input.botId,
      strategyId: input.strategyId,
      orderId: input.orderId,
      tradeId: null,
      positionId: input.positionId,
      symbol: input.symbol,
      side: input.side,
      exchangeTradeId: input.exchangeTradeId,
      price: input.price,
      quantity: input.quantity,
      notional: input.price * input.quantity,
      feeCost: input.feeCost,
      feeCurrency: input.feeCurrency,
      feeRate: null,
      executedAt: input.executedAt,
      raw: input.raw,
    },
  });
};

const resolveRecordableExchangeFillDetails = (input: {
  orderQuantity: number;
  existingFilledQuantity: number;
  currentFilledQuantity: number;
  lastFillQuantity: number | null;
  fee: number | null;
}): { quantity: number | null; fee: number | null } => {
  if (!isPositiveFiniteNumber(input.lastFillQuantity)) {
    return {
      quantity: null,
      fee:
        typeof input.fee === 'number' && Number.isFinite(input.fee)
          ? input.fee
          : null,
    };
  }

  const orderQuantity = isPositiveFiniteNumber(input.orderQuantity) ? input.orderQuantity : null;
  const previousFilledQuantity =
    typeof input.existingFilledQuantity === 'number' &&
    Number.isFinite(input.existingFilledQuantity)
      ? Math.max(0, input.existingFilledQuantity)
      : 0;
  const boundedPreviousFilledQuantity =
    orderQuantity == null
      ? previousFilledQuantity
      : Math.min(orderQuantity, previousFilledQuantity);
  const currentFilledQuantity =
    typeof input.currentFilledQuantity === 'number' &&
    Number.isFinite(input.currentFilledQuantity)
      ? Math.max(0, input.currentFilledQuantity)
      : boundedPreviousFilledQuantity;
  const fillProgressDelta = Math.max(
    0,
    currentFilledQuantity - boundedPreviousFilledQuantity
  );
  const quantity =
    fillProgressDelta > 0 ? Math.min(input.lastFillQuantity, fillProgressDelta) : null;

  if (typeof input.fee !== 'number' || !Number.isFinite(input.fee)) {
    return { quantity, fee: null };
  }

  if (!isPositiveFiniteNumber(quantity) || quantity >= input.lastFillQuantity) {
    return { quantity, fee: input.fee };
  }

  return {
    quantity,
    fee: input.fee * (quantity / input.lastFillQuantity),
  };
};

const ensureTradeRecord = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  orderId: string;
  positionId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  fee: number | null;
  feeSource: 'ESTIMATED' | 'EXCHANGE_FILL';
  feePending: boolean;
  feeCurrency: string | null;
  effectiveFeeRate: number | null;
  exchangeTradeId: string | null;
  lifecycleAction: 'OPEN' | 'DCA' | 'CLOSE';
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  origin: 'BOT' | 'USER' | 'EXCHANGE_SYNC' | 'BACKTEST';
  executionMode: 'PAPER' | 'LIVE';
  realizedPnl?: number;
  closeReason?: 'TP' | 'TTP' | 'SL' | 'TSL' | 'LIQUIDATION' | 'ACCOUNT_FLOOR' | 'MANUAL' | 'SIGNAL_EXIT' | 'POSITION_LIFETIME' | 'EXTERNAL_SYNC_MISSING' | 'SYSTEM_REPAIR' | null;
  closeInitiator?: 'BOT_APP' | 'USER_APP' | 'USER_EXCHANGE' | 'EXCHANGE' | 'SYSTEM_REPAIR' | null;
}) => {
  const existing = await input.tx.trade.findFirst({
    where: { orderId: input.orderId, lifecycleAction: input.lifecycleAction },
    select: { id: true },
  });
  if (existing) return;

  await input.tx.trade.create({
    data: {
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
      strategyId: input.strategyId,
      orderId: input.orderId,
      positionId: input.positionId,
      symbol: input.symbol,
      side: input.side,
      lifecycleAction: input.lifecycleAction,
      price: input.price,
      quantity: input.quantity,
      fee: input.fee,
      feeSource: input.feeSource,
      feePending: input.feePending,
      feeCurrency: input.feeCurrency,
      effectiveFeeRate: input.effectiveFeeRate,
      exchangeTradeId: input.exchangeTradeId,
      realizedPnl: input.realizedPnl,
      closeReason: input.closeReason ?? null,
      closeInitiator: input.closeInitiator ?? null,
      origin: input.origin,
      managementMode: input.managementMode,
      executionMode: input.executionMode,
    },
  });
};

const resolveLiveAccountUpdateScope = async (input: {
  userId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  marketType: 'FUTURES' | 'SPOT';
  sourceApiKeyId: string | null;
}) => {
  if (!input.sourceApiKeyId) {
    console.warn(
      `[LiveExchangeAccountUpdate] user=${input.userId} symbol=${input.symbol} side=${input.side} marketType=${input.marketType} skipped: missing_source_api_key`
    );
    return [];
  }

  const candidates = await prisma.position.findMany({
    where: {
      userId: input.userId,
      symbol: input.symbol,
      side: input.side,
      status: 'OPEN',
      syncState: 'IN_SYNC',
      OR: [
        {
          wallet: {
            mode: 'LIVE',
            exchange: 'BINANCE',
            marketType: input.marketType,
            apiKeyId: input.sourceApiKeyId,
          },
        },
        {
          bot: {
            mode: 'LIVE',
            exchange: 'BINANCE',
            marketType: input.marketType,
            OR: [
              { apiKeyId: input.sourceApiKeyId },
              { wallet: { apiKeyId: input.sourceApiKeyId } },
            ],
          },
        },
      ],
    },
    select: {
      id: true,
    },
    orderBy: [{ openedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
  });

  if (candidates.length <= 1) {
    return candidates.map((candidate) => candidate.id);
  }

  console.warn(
    `[LiveExchangeAccountUpdate] user=${input.userId} symbol=${input.symbol} side=${input.side} marketType=${input.marketType} skipped: ambiguous_live_scope candidates=${candidates.length}`
  );
  return [];
};

const syncRuntimeDcaStateFromExchangeFill = async (input: {
  orderId: string;
  positionId: string;
  nextQuantity: number;
  nextEntryPrice: number;
  fillPrice: number;
}) => {
  const dedupe = await runtimeExecutionDedupeService.markSucceededByOrderId({
    orderId: input.orderId,
    commandType: 'DCA',
    positionId: input.positionId,
  });
  if (!dedupe) return;

  const previousState =
    (await runtimePositionStateStore.getPositionRuntimeState(input.positionId)) ?? null;
  const rawLevelIndex = dedupe.commandFingerprint?.dcaLevelIndex;
  const levelIndex = Number(rawLevelIndex);
  const normalizedLevelIndex = Number.isFinite(levelIndex)
    ? Math.max(0, Math.floor(levelIndex))
    : null;
  const previousExecutedDcaLevelIndices =
    previousState?.executedDcaLevelIndices?.filter((index) => Number.isFinite(index)) ?? [];
  const executedDcaLevelIndices =
    normalizedLevelIndex == null
      ? previousExecutedDcaLevelIndices
      : [
          ...new Set(
            previousExecutedDcaLevelIndices.length > 0
              ? [...previousExecutedDcaLevelIndices, normalizedLevelIndex]
              : Array.from({ length: normalizedLevelIndex + 1 }, (_, index) => index)
          ),
        ].sort((left, right) => left - right);
  await runtimePositionStateStore.setPositionRuntimeState(input.positionId, {
    quantity: input.nextQuantity,
    averageEntryPrice: input.nextEntryPrice,
    currentAdds: Math.max(
      previousState?.currentAdds ?? 0,
      executedDcaLevelIndices.length,
    ),
    executedDcaLevelIndices:
      executedDcaLevelIndices.length > 0 ? executedDcaLevelIndices : undefined,
    trailingAnchorPrice: previousState?.trailingAnchorPrice ?? input.nextEntryPrice,
    trailingLossLimitPercent: previousState?.trailingLossLimitPercent,
    trailingTakeProfitHighPercent: previousState?.trailingTakeProfitHighPercent,
    trailingTakeProfitStepPercent: previousState?.trailingTakeProfitStepPercent,
    lastDcaPrice: input.fillPrice,
  });
};

export const applyLiveExchangeOrderTradeUpdateEvent = async (input: {
  userId: string;
  event: NormalizedBinanceOrderTradeUpdateEvent;
  client?: PrismaClient;
  afterOrderUpdate?: () => Promise<void>;
  afterCoreCommit?: () => Promise<void>;
}) => {
  const processed = await (input.client ?? prisma).$transaction(async (tx) => {
  await lockExchangeOrderIdentity(tx, input.userId, input.event.exchangeOrderId);
  const existingOrder = await tx.order.findFirst({
    where: {
      userId: input.userId,
      exchangeOrderId: input.event.exchangeOrderId,
      symbol: normalizeSymbol(input.event.symbol),
      syncState: 'IN_SYNC',
      OR: [
        {
          wallet: {
            mode: 'LIVE',
            exchange: 'BINANCE',
            marketType: input.event.marketType,
          },
        },
        {
          bot: {
            mode: 'LIVE',
            exchange: 'BINANCE',
            marketType: input.event.marketType,
          },
        },
      ],
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      position: true,
    },
  });
  if (!existingOrder) return { status: 'ignored' as const, reason: 'order_not_found' as const };

  const nextStatus = mapExchangeOrderStatus(input.event.orderStatus);
  const fillProgress = resolveExchangeOrderFillProgress({
    existingStatus: existingOrder.status,
    existingFilledQuantity: existingOrder.filledQuantity,
    incomingStatus: nextStatus,
    incomingCumulativeFilledQuantity: isPositiveFiniteNumber(input.event.cumulativeFilledQuantity)
      ? input.event.cumulativeFilledQuantity
      : null,
    requestedQuantity: existingOrder.quantity,
  });
  const cumulativeFilledQuantity = fillProgress.filledQuantity;
  const averageFillPrice =
    isPositiveFiniteNumber(input.event.averagePrice)
      ? input.event.averagePrice
      : existingOrder.averageFillPrice;
  const lastFillQuantity = isPositiveFiniteNumber(input.event.lastFilledQuantity)
    ? input.event.lastFilledQuantity
    : null;
  const lastFillPrice = isPositiveFiniteNumber(input.event.lastFilledPrice)
    ? input.event.lastFilledPrice
    : averageFillPrice;
  const eventAt = new Date(input.event.transactionTime ?? input.event.eventTime);
  const eventFee =
    typeof input.event.fee === 'number' && Number.isFinite(input.event.fee)
      ? input.event.fee
      : null;
  const recordableFillDetails = resolveRecordableExchangeFillDetails({
    orderQuantity: existingOrder.quantity,
    existingFilledQuantity: existingOrder.filledQuantity,
    currentFilledQuantity: cumulativeFilledQuantity,
    lastFillQuantity,
    fee: eventFee,
  });
  const existingRecordableEventFill = input.event.exchangeTradeId
    ? await tx.orderFill.findFirst({
        where: {
          orderId: existingOrder.id,
          exchangeTradeId: input.event.exchangeTradeId,
        },
        select: { id: true, feeCost: true },
      })
    : null;
  let recordableLastFillQuantity = recordableFillDetails.quantity;
  let recordableEventFee = recordableFillDetails.fee;
  if (
    !existingRecordableEventFill && !isPositiveFiniteNumber(recordableLastFillQuantity) &&
    existingOrder.status === 'FILLED' &&
    existingOrder.exchangeTradeId === input.event.exchangeTradeId &&
    isPositiveFiniteNumber(lastFillQuantity)
  ) {
    const priorFills = await tx.orderFill.aggregate({
      where: { orderId: existingOrder.id }, _sum: { quantity: true },
    });
    const remaining = Math.max(0, cumulativeFilledQuantity - (priorFills._sum.quantity ?? 0));
    const recoveredQuantity = Math.min(lastFillQuantity, remaining);
    if (isPositiveFiniteNumber(recoveredQuantity)) {
      recordableLastFillQuantity = recoveredQuantity;
      recordableEventFee = eventFee == null
        ? null : eventFee * (recoveredQuantity / lastFillQuantity);
    }
  }
  const unresolvedSyntheticFillCandidates =
    !existingRecordableEventFill && !isPositiveFiniteNumber(recordableLastFillQuantity) &&
    existingOrder.status === 'FILLED' && input.event.exchangeTradeId &&
    isPositiveFiniteNumber(lastFillQuantity) && isPositiveFiniteNumber(lastFillPrice) &&
    eventFee != null
      ? await tx.orderFill.findMany({
          where: {
            orderId: existingOrder.id,
            exchangeTradeId: { startsWith: 'soar-fill-' },
          },
          select: { id: true, feeCost: true, price: true, quantity: true },
        })
      : [];
  const matchingSyntheticFills = unresolvedSyntheticFillCandidates.filter((fill) =>
    Math.abs(fill.price - (lastFillPrice ?? 0)) <= 1e-9 * Math.max(1, fill.price) &&
    Math.abs(fill.quantity - (lastFillQuantity ?? 0)) <= 1e-9 * Math.max(1, fill.quantity)
  );
  const feeBackfillFill = existingRecordableEventFill ??
    (matchingSyntheticFills.length === 1 && matchingSyntheticFills[0].feeCost == null
      ? matchingSyntheticFills[0] : null);
  const hasRecordableEventFee =
    typeof recordableEventFee === 'number' && Number.isFinite(recordableEventFee);
  const existingRecordableEventFillHasFee =
    typeof feeBackfillFill?.feeCost === 'number' &&
    Number.isFinite(feeBackfillFill.feeCost);
  const unresolvedExistingFillFee = await tx.orderFill.findFirst({
    where: {
      orderId: existingOrder.id,
      feeCost: null,
      ...(feeBackfillFill ? { id: { not: feeBackfillFill.id } } : {}),
    },
    select: { id: true },
  });
  const existingFillFeeAggregate = hasRecordableEventFee
    ? await tx.orderFill.aggregate({
        where: { orderId: existingOrder.id },
        _sum: { feeCost: true },
      })
    : null;
  const aggregateRecordableEventFee = hasRecordableEventFee
    ? (existingFillFeeAggregate?._sum.feeCost ?? 0) +
      (existingRecordableEventFillHasFee ? 0 : (recordableEventFee ?? 0))
    : null;
  const feeRefreshDecision = resolveExchangeFeeRefreshDecision({
    shouldRefreshTerminalFillDetails: fillProgress.shouldRefreshTerminalFillDetails,
    hasRecordableEventFee,
    hasExistingRecordableEventFill: feeBackfillFill != null,
    existingRecordableEventFillHasFee,
  });
  const hasSettledExchangeFee =
    existingOrder.status === 'FILLED' &&
    existingOrder.feeSource === 'EXCHANGE_FILL' &&
    typeof existingOrder.fee === 'number' &&
    Number.isFinite(existingOrder.fee) &&
    unresolvedExistingFillFee == null;
  const hasAcceptedRecordableEventFee =
    hasRecordableEventFee &&
    feeRefreshDecision.shouldRefreshFeeDetails &&
    unresolvedExistingFillFee == null;
  const feePendingDecision = resolveExchangeFeePendingDecision({
    persistedStatus: fillProgress.persistedStatus,
    hasAcceptedRecordableEventFee,
    hasSettledExchangeFee,
    existingFeePending: existingOrder.feePending,
  });
  const fee = aggregateRecordableEventFee ?? existingOrder.fee;

  let updatedOrder = await tx.order.update({
    where: { id: existingOrder.id },
    data: {
      status: fillProgress.persistedStatus,
      filledQuantity: cumulativeFilledQuantity,
      averageFillPrice: fillProgress.shouldRefreshTerminalFillDetails
        ? averageFillPrice
        : existingOrder.averageFillPrice,
      filledAt:
        fillProgress.persistedStatus === 'FILLED' && fillProgress.shouldRefreshTerminalFillDetails
          ? eventAt
          : existingOrder.filledAt,
      exchangeTradeId: fillProgress.shouldRefreshTerminalFillDetails
        ? input.event.exchangeTradeId ?? existingOrder.exchangeTradeId
        : existingOrder.exchangeTradeId,
      fee: feeRefreshDecision.shouldRefreshFeeDetails ? fee : existingOrder.fee,
      feeSource:
        feeRefreshDecision.shouldRefreshFeeDetails && hasRecordableEventFee
          ? 'EXCHANGE_FILL'
          : existingOrder.feeSource,
      feePending: feePendingDecision.feePending,
      feeCurrency: feeRefreshDecision.shouldRefreshFeeDetails
        ? input.event.feeCurrency ?? existingOrder.feeCurrency
        : existingOrder.feeCurrency,
    },
    include: {
      position: true,
    },
  });

  await input.afterOrderUpdate?.();

  if (
    input.event.exchangeTradeId &&
    isPositiveFiniteNumber(recordableLastFillQuantity) &&
    isPositiveFiniteNumber(lastFillPrice)
  ) {
    await ensureOrderFillRecord({
      tx,
      userId: input.userId,
      botId: updatedOrder.botId,
      strategyId: updatedOrder.strategyId,
      orderId: updatedOrder.id,
      positionId: updatedOrder.positionId,
      symbol: updatedOrder.symbol,
      side: updatedOrder.side,
      exchangeTradeId: input.event.exchangeTradeId,
      price: lastFillPrice,
      quantity: recordableLastFillQuantity,
      feeCost: recordableEventFee,
      feeCurrency: input.event.feeCurrency,
      executedAt: eventAt,
      raw: input.event.raw as Prisma.InputJsonValue,
    });
  }

  if (
    feeBackfillFill &&
    feeRefreshDecision.shouldBackfillExistingFillFee
  ) {
    await tx.orderFill.update({
      where: { id: feeBackfillFill.id },
      data: {
        feeCost: recordableEventFee,
        feeCurrency: input.event.feeCurrency ?? updatedOrder.feeCurrency,
      },
    });
    await tx.trade.updateMany({
      where: {
        orderId: updatedOrder.id,
        OR: [
          { fee: null },
          { feeSource: 'ESTIMATED' },
          { feePending: true },
        ],
      },
      data: {
        fee: typeof fee === 'number' && Number.isFinite(fee) ? fee : recordableEventFee,
        feeSource: 'EXCHANGE_FILL',
        feePending: feePendingDecision.feePending,
        feeCurrency: input.event.feeCurrency ?? updatedOrder.feeCurrency,
      },
    });
    if (typeof fee === 'number' && Number.isFinite(fee)) {
      await refreshCloseRealizedPnlForOrder({
        tx,
        userId: input.userId,
        orderId: updatedOrder.id,
        exitFee: fee,
      });
    }
  }

  if (feePendingDecision.shouldKeepFeePending) {
    await tx.trade.updateMany({
      where: {
        orderId: updatedOrder.id,
        feeSource: 'ESTIMATED',
        feePending: false,
      },
      data: { feePending: true },
    });
  }

  const existingLifecycleTrade = await tx.trade.findFirst({
    where: { orderId: updatedOrder.id, lifecycleAction: { in: ['OPEN', 'DCA', 'CLOSE'] } },
    select: { lifecycleAction: true, price: true },
  });
  let dcaSync: {
    orderId: string; positionId: string; nextQuantity: number;
    nextEntryPrice: number; fillPrice: number;
  } | null = existingLifecycleTrade?.lifecycleAction === 'DCA' && updatedOrder.position
    ? {
        orderId: updatedOrder.id, positionId: updatedOrder.position.id,
        nextQuantity: updatedOrder.position.quantity,
        nextEntryPrice: updatedOrder.position.entryPrice,
        fillPrice: existingLifecycleTrade.price,
      }
    : null;
  if (
    !existingLifecycleTrade &&
    (fillProgress.shouldApplyFilledLifecycle ||
      (existingOrder.status === 'FILLED' && nextStatus === 'FILLED' &&
        input.event.exchangeTradeId != null &&
        existingOrder.exchangeTradeId === input.event.exchangeTradeId)) &&
    isPositiveFiniteNumber(averageFillPrice) &&
    isPositiveFiniteNumber(cumulativeFilledQuantity)
  ) {
    if (
      updatedOrder.positionId &&
      updatedOrder.position &&
      updatedOrder.position.status === 'OPEN' &&
      updatedOrder.position.syncState === 'IN_SYNC'
    ) {
      if (
        isClosingOrderForPosition({
          orderSide: updatedOrder.side,
          positionSide: updatedOrder.position.side,
        })
      ) {
        if (
          !isExchangeCloseFillComplete({
            filledQuantity: cumulativeFilledQuantity,
            positionQuantity: updatedOrder.position.quantity,
          })
        ) {
          return {
            status: 'applied' as const,
            orderId: updatedOrder.id,
            positionId: updatedOrder.positionId ?? null,
            orderStatus: updatedOrder.status,
          };
        }
        const closeAttribution = resolveExchangeConfirmedCloseAttribution({
          orderCloseReason: updatedOrder.closeReason,
          orderCloseInitiator: updatedOrder.closeInitiator,
          executionType: input.event.executionType,
        });
        await finalizeExchangeCloseFillInTransaction(tx, {
          userId: input.userId, orderId: updatedOrder.id, positionId: updatedOrder.position.id,
          fillPrice: averageFillPrice, fillQuantity: cumulativeFilledQuantity,
          exchangeTradeId: input.event.exchangeTradeId ?? null, eventAt,
          closeReason: closeAttribution.closeReason,
          closeInitiator: closeAttribution.closeInitiator,
        });
      } else {
        const isRecoveredOpen = existingOrder.status === 'FILLED' &&
          updatedOrder.position.openedAt.getTime() === updatedOrder.filledAt?.getTime() &&
          Math.abs(updatedOrder.position.quantity - cumulativeFilledQuantity) <= 1e-9 &&
          await tx.trade.count({ where: { positionId: updatedOrder.position.id } }) === 0;
        if (isRecoveredOpen) {
          await ensureTradeRecord({
            tx, userId: input.userId, botId: updatedOrder.botId,
            walletId: updatedOrder.walletId, strategyId: updatedOrder.strategyId,
            orderId: updatedOrder.id, positionId: updatedOrder.position.id,
            symbol: updatedOrder.symbol, side: updatedOrder.side,
            price: averageFillPrice, quantity: cumulativeFilledQuantity,
            fee: typeof fee === 'number' ? fee : null,
            feeSource: updatedOrder.feeSource, feePending: updatedOrder.feePending,
            feeCurrency: updatedOrder.feeCurrency,
            effectiveFeeRate: updatedOrder.effectiveFeeRate,
            exchangeTradeId: input.event.exchangeTradeId ?? null,
            lifecycleAction: 'OPEN', managementMode: updatedOrder.managementMode,
            origin: updatedOrder.origin, executionMode: 'LIVE', realizedPnl: 0,
          });
        } else {
          const { nextQuantity, nextEntryPrice } = await finalizeExchangeDcaFillInTransaction(tx, {
            userId: input.userId, orderId: updatedOrder.id, positionId: updatedOrder.position.id,
            fillPrice: averageFillPrice, fillQuantity: cumulativeFilledQuantity,
            exchangeTradeId: input.event.exchangeTradeId ?? null, eventAt,
          });
          dcaSync = {
            orderId: updatedOrder.id, positionId: updatedOrder.position.id,
            nextQuantity, nextEntryPrice, fillPrice: averageFillPrice,
          };
        }
      }
      updatedOrder = await tx.order.findUniqueOrThrow({
        where: { id: updatedOrder.id },
        include: { position: true },
      });
    } else if (
      updatedOrder.positionId && updatedOrder.position?.status === 'CLOSED' &&
      existingOrder.status === 'FILLED' &&
      typeof updatedOrder.position.realizedPnl === 'number' &&
      Number.isFinite(updatedOrder.position.realizedPnl) &&
      updatedOrder.position.closedAt?.getTime() === updatedOrder.filledAt?.getTime() &&
      isClosingOrderForPosition({
        orderSide: updatedOrder.side, positionSide: updatedOrder.position.side,
      })
    ) {
      await ensureTradeRecord({
        tx, userId: input.userId, botId: updatedOrder.botId,
        walletId: updatedOrder.walletId, strategyId: updatedOrder.strategyId,
        orderId: updatedOrder.id, positionId: updatedOrder.position.id,
        symbol: updatedOrder.symbol, side: updatedOrder.side,
        price: averageFillPrice, quantity: cumulativeFilledQuantity,
        fee: typeof fee === 'number' ? fee : null,
        feeSource: updatedOrder.feeSource, feePending: updatedOrder.feePending,
        feeCurrency: updatedOrder.feeCurrency,
        effectiveFeeRate: updatedOrder.effectiveFeeRate,
        exchangeTradeId: input.event.exchangeTradeId ?? null,
        lifecycleAction: 'CLOSE', managementMode: updatedOrder.managementMode,
        origin: updatedOrder.origin, executionMode: 'LIVE',
        realizedPnl: updatedOrder.position.realizedPnl ?? undefined,
        closeReason: updatedOrder.position.closeReason,
        closeInitiator: updatedOrder.position.closeInitiator,
      });
    } else if (!updatedOrder.positionId) {
      const lifecycleResult = await applyOrderFillLifecycleInTransaction(tx, {
        userId: input.userId,
        orderId: updatedOrder.id,
        fillPrice: averageFillPrice,
        fillQuantity: cumulativeFilledQuantity,
        filledAt: eventAt,
      });
      if (feePendingDecision.shouldKeepFeePending) {
        await tx.order.update({
          where: { id: updatedOrder.id },
          data: { feePending: true },
        });
      }
      updatedOrder = await tx.order.findUniqueOrThrow({
        where: { id: updatedOrder.id },
        include: { position: true },
      });
      if (lifecycleResult?.positionId) {
        await tx.orderFill.updateMany({
          where: {
            orderId: updatedOrder.id,
            positionId: null,
          },
          data: {
            positionId: lifecycleResult.positionId,
          },
        });
        await ensureTradeRecord({
          tx,
          userId: input.userId,
          botId: updatedOrder.botId,
          walletId: updatedOrder.walletId,
          strategyId: updatedOrder.strategyId,
          orderId: updatedOrder.id,
          positionId: lifecycleResult.positionId,
          symbol: updatedOrder.symbol,
          side: updatedOrder.side,
          price: averageFillPrice,
          quantity: cumulativeFilledQuantity,
          fee: typeof fee === 'number' ? fee : null,
          feeSource: updatedOrder.feeSource,
          feePending: updatedOrder.feePending,
          feeCurrency: updatedOrder.feeCurrency,
          effectiveFeeRate: updatedOrder.effectiveFeeRate,
          exchangeTradeId: input.event.exchangeTradeId ?? null,
          lifecycleAction: 'OPEN',
          managementMode: updatedOrder.managementMode,
          origin: updatedOrder.origin,
          executionMode: 'LIVE',
          realizedPnl: 0,
        });
      }
    }
  }

  return {
    status: 'applied' as const,
    orderId: updatedOrder.id,
    positionId: updatedOrder.positionId ?? null,
    orderStatus: updatedOrder.status,
    dcaSync,
  };
  }, { timeout: 30_000, maxWait: 10_000 });

  await input.afterCoreCommit?.();
  if (processed.status === 'applied' && processed.orderStatus === 'FILLED') {
    if ('dcaSync' in processed && processed.dcaSync) {
      await syncRuntimeDcaStateFromExchangeFill(processed.dcaSync);
    } else {
      await runtimeExecutionDedupeService.markSucceededByOrderId({
        orderId: processed.orderId, positionId: processed.positionId,
      });
    }
  }
  if ('dcaSync' in processed) {
    const { dcaSync: _dcaSync, ...result } = processed;
    return result;
  }
  return processed;
};

export const applyLiveExchangeAccountUpdateEvent = async (input: {
  userId: string;
  sourceApiKeyId?: string | null;
  event: NormalizedBinanceAccountUpdateEvent;
}) => {
  let updatedPositions = 0;
  const eventAt = new Date(input.event.transactionTime ?? input.event.eventTime);
  for (const position of input.event.positions) {
    const normalizedSymbol = normalizeSymbol(position.symbol);
    if (!normalizedSymbol) continue;
    const side =
      position.positionSide === 'LONG' || position.positionSide === 'SHORT'
        ? position.positionSide
        : position.amount != null && position.amount < 0
          ? 'SHORT'
          : 'LONG';
    const quantity =
      typeof position.amount === 'number' && Number.isFinite(position.amount)
        ? Math.abs(position.amount)
        : null;
    const scopedPositionIds = await resolveLiveAccountUpdateScope({
      userId: input.userId,
      symbol: normalizedSymbol,
      side,
      marketType: input.event.marketType,
      sourceApiKeyId: input.sourceApiKeyId ?? null,
    });
    if (scopedPositionIds.length === 0) continue;
    if (quantity === 0) {
      const result = await prisma.position.updateMany({
        where: {
          id: { in: scopedPositionIds },
        },
        data: {
          syncState: 'DRIFT',
          continuityState: 'RECOVERING',
          unrealizedPnl: 0,
          missingSince: eventAt,
          lastExchangeSeenAt: eventAt,
          lastExchangeSyncAt: eventAt,
          missingSyncCount: { increment: 1 },
        },
      });
      updatedPositions += result.count;
      continue;
    }
    const result = await prisma.position.updateMany({
      where: {
        id: { in: scopedPositionIds },
      },
      data: {
        ...(typeof quantity === 'number' ? { quantity } : {}),
        ...(typeof position.entryPrice === 'number' ? { entryPrice: position.entryPrice } : {}),
        ...(typeof position.unrealizedPnl === 'number'
          ? { unrealizedPnl: position.unrealizedPnl }
          : {}),
        lastExchangeSeenAt: eventAt,
        lastExchangeSyncAt: eventAt,
        missingSince: null,
        missingSyncCount: 0,
        continuityState: 'CONFIRMED',
      },
    });
    updatedPositions += result.count;
  }

  return {
    status: 'applied' as const,
    updatedPositions,
  };
};

export const applyLiveExchangeUserDataStreamEvent = async (input: {
  userId: string;
  sourceApiKeyId?: string | null;
  event: NormalizedBinanceUserDataStreamEvent;
}) => {
  if (input.event.eventType === 'ORDER_TRADE_UPDATE') {
    return applyLiveExchangeOrderTradeUpdateEvent({
      userId: input.userId,
      event: input.event,
    });
  }
  if (input.event.eventType === 'ACCOUNT_UPDATE') {
    return applyLiveExchangeAccountUpdateEvent({
      userId: input.userId,
      sourceApiKeyId: input.sourceApiKeyId,
      event: input.event,
    });
  }
  return {
    status: 'ignored' as const,
    reason: 'unsupported_event' as const,
  };
};
