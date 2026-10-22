import { Exchange, Prisma, PrismaClient } from '@prisma/client';

import { prisma } from '../../prisma/client';
import {
  NormalizedBinanceOrderTradeUpdateEvent,
  NormalizedBinanceUserDataStreamEvent,
} from '../exchange/binanceUserDataStream.types';
import {
  resolveExchangeConfirmedCloseAttribution,
} from '../positions/positionCloseAttribution';
import { applyOrderFillLifecycleInTransaction } from './orders.lifecycle.service';
import {
  finalizeExchangeCloseFillInTransaction,
  finalizeExchangeDcaFillInTransaction,
} from './orders.exchangeEventFinalization.service';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';
import { applyLiveExchangeAccountUpdateEvent } from
  './orders.exchangeEvents.accountUpdate.service';
export { applyLiveExchangeAccountUpdateEvent } from
  './orders.exchangeEvents.accountUpdate.service';
import { runtimeExecutionDedupeService } from '../engine/runtimeExecutionDedupe.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { initializeNewLiveBotPositionState } from '../engine/runtimePositionOpeningState.service';
import { tryRebasePositionManagementProtection } from '../engine/positionManagement.service';
import { protectionMatchesEvidence, readRuntimeProtectionEvidence } from '../engine/runtimePositionProtectionEvidence.service';
import { settleRuntimeOrderFee } from '../positions/runtimeOrderFeeSettlement';
import { settleImportedRuntimeCloseFinancials } from '../positions/importedPositionRuntimeFinancialSettlement';
import { computeCloseRealizedPnl, refreshClosedPositionPnlAfterEntryFee } from './orders.closedPositionFinancialRefresh';
import { writeRuntimeTelemetryFromExchangeFill } from './orders.runtimeTelemetryFromFill';
import {
  isExchangeCloseFillComplete,
  mapExchangeOrderStatus,
  resolveExchangeFeePendingDecision,
  resolveExchangeFeeRefreshDecision,
  resolveExchangeOrderFillProgress,
} from './orders.exchangeEvents.helpers';

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase().replace(/[/:]/g, '');

const isClosingOrderForPosition = (input: {
  orderSide: 'BUY' | 'SELL';
  positionSide: 'LONG' | 'SHORT';
}) =>
  (input.positionSide === 'LONG' && input.orderSide === 'SELL') ||
  (input.positionSide === 'SHORT' && input.orderSide === 'BUY');

const refreshCloseRealizedPnlForOrder = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  orderId: string;
  exitFee: number;
}) => {
  const closeOrder = await input.tx.order.findFirst({
    where: { id: input.orderId, userId: input.userId },
    select: { feePending: true },
  });
  if (!closeOrder) return;
  if (!Number.isFinite(input.exitFee)) return;

  const closeTrades = await input.tx.trade.findMany({
    where: {
      userId: input.userId,
      orderId: input.orderId,
      lifecycleAction: 'CLOSE',
      positionId: { not: null },
    },
    select: {
      id: true, positionId: true, symbol: true,
      price: true, quantity: true,
      fee: true, feeSource: true, feePending: true,
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
        id: closeTrade.positionId, userId: input.userId,
      },
      select: {
        id: true, side: true, entryPrice: true, origin: true, contractSize: true,
      },
    });
    if (!position) continue;

    const hasCanonicalImportedCloseFee = position.origin === 'EXCHANGE_SYNC' &&
      closeTrade.feeSource === 'EXCHANGE_FILL' && !closeTrade.feePending && closeTrade.fee != null && Number.isFinite(closeTrade.fee);
    const realizedPnl = await computeCloseRealizedPnl({
      tx: input.tx,
      userId: input.userId,
      positionId: position.id,
      positionSide: position.side,
      entryPrice: position.entryPrice,
      closePrice: closeTrade.price,
      closeQuantity: closeTrade.quantity,
      contractSize: position.contractSize,
      exitFee: hasCanonicalImportedCloseFee ? closeTrade.fee! : input.exitFee,
      exitFeePending: hasCanonicalImportedCloseFee ? false : closeOrder.feePending,
      imported: position.origin === 'EXCHANGE_SYNC',
    });

    await input.tx.trade.update({
      where: { id: closeTrade.id },
      data: { realizedPnl,
        feePending: (!hasCanonicalImportedCloseFee && closeOrder.feePending) || realizedPnl == null },
    });
    await input.tx.position.update({
      where: { id: position.id },
      data: { realizedPnl },
    });
    if (realizedPnl != null && !closeOrder.feePending && closeTrade.fee != null && !closeTrade.feePending &&
      closeTrades.filter((trade) => trade.positionId === position.id).length === 1) {
      await settleImportedRuntimeCloseFinancials({
        tx: input.tx, userId: input.userId, positionId: position.id,
        symbol: closeTrade.symbol, realizedPnl, exitFees: closeTrade.fee,
      });
    }
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
  contractSize: number;
  feeCost: number | null;
  feeCurrency: string | null;
  executedAt: Date;
  venueExecutedAt: Date | null;
  raw: Prisma.InputJsonValue;
  costEvidence?: Prisma.InputJsonValue;
}) => {
  const existing = await input.tx.orderFill.findFirst({
    where: {
      orderId: input.orderId, exchangeTradeId: input.exchangeTradeId,
    },
    select: { id: true },
  });
  if (existing) return;

  await input.tx.orderFill.create({
    data: {
      userId: input.userId, botId: input.botId,
      strategyId: input.strategyId, orderId: input.orderId,
      tradeId: null,
      positionId: input.positionId,
      symbol: input.symbol,
      side: input.side,
      exchangeTradeId: input.exchangeTradeId,
      price: input.price,
      quantity: input.quantity,
      notional: input.price * input.quantity * input.contractSize,
      costEvidence: input.costEvidence ?? Prisma.JsonNull,
      feeCost: input.feeCost,
      feeCurrency: input.feeCurrency,
      feeRate: null,
      executedAt: input.executedAt,
      venueExecutedAt: input.venueExecutedAt,
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

export const syncRuntimeDcaStateFromExchangeFill = async (input: {
  orderId: string;
  positionId: string;
  nextQuantity: number;
  nextEntryPrice: number;
  fillPrice: number;
  positionSide: 'LONG' | 'SHORT';
  leverage: number;
}) => {
  const dedupe = await runtimeExecutionDedupeService.markSucceededByOrderId({
    orderId: input.orderId,
    commandType: 'DCA',
    positionId: input.positionId,
  });
  const previousState =
    (await runtimePositionStateStore.getTrustedPositionRuntimeState(input.positionId)) ?? null;
  if (!previousState) return false;
  const evidence = await readRuntimeProtectionEvidence(input.positionId).catch(() => null);
  if (!protectionMatchesEvidence(previousState, evidence)) return false;
  const protection = tryRebasePositionManagementProtection(previousState, input.nextEntryPrice,
    input.positionSide, input.leverage);
  if (!protection) return false;
  const rawLevelIndex = dedupe?.commandFingerprint?.dcaLevelIndex;
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
  return runtimePositionStateStore.setPositionRuntimeState(input.positionId, {
    quantity: input.nextQuantity,
    averageEntryPrice: input.nextEntryPrice,
    currentAdds: Math.max(
      previousState?.currentAdds ?? 0,
      executedDcaLevelIndices.length,
    ),
    executedDcaLevelIndices:
      executedDcaLevelIndices.length > 0 ? executedDcaLevelIndices : undefined,
    trailingAnchorPrice: protection.trailingAnchorPrice,
    trailingLossLimitPercent: protection.trailingLossLimitPercent,
    trailingLossActiveLevelIndex: protection.trailingLossActiveLevelIndex,
    trailingTakeProfitHighPercent: protection.trailingTakeProfitHighPercent,
    trailingTakeProfitStepPercent: protection.trailingTakeProfitStepPercent,
    trailingTakeProfitActiveLevelIndex: protection.trailingTakeProfitActiveLevelIndex,
    lastDcaPrice: input.fillPrice,
  });
};

export const invalidateRuntimePositionStateAfterExchangeClose = (positionId: string) =>
  runtimePositionStateStore.deletePositionRuntimeState(positionId);

type LiveExchangeOrderTradeUpdateInput = {
  userId: string;
  event: NormalizedBinanceOrderTradeUpdateEvent;
  sourceApiKeyId?: string | null;
  sourceExchange?: Exchange;
  snapshotRecovery?: boolean;
  fillTimeFromVenue?: boolean;
  client?: PrismaClient;
  afterOrderUpdate?: () => Promise<void>;
  afterCoreCommit?: () => Promise<void>;
};

export const applyLiveExchangeOrderTradeUpdateInTransaction = async (
  tx: Prisma.TransactionClient,
  input: LiveExchangeOrderTradeUpdateInput
) => {
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
            exchange: input.sourceExchange ?? 'BINANCE',
            marketType: input.event.marketType,
          },
        },
        {
          bot: {
            mode: 'LIVE',
            exchange: input.sourceExchange ?? 'BINANCE',
            marketType: input.event.marketType,
          },
        },
      ],
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      position: true,
      bot: { select: { apiKeyId: true } },
      wallet: { select: { apiKeyId: true } },
    },
  });
  if (!existingOrder) return { status: 'ignored' as const, reason: 'order_not_found' as const };
  if (input.sourceApiKeyId &&
      (existingOrder.bot?.apiKeyId ?? existingOrder.wallet?.apiKeyId) !== input.sourceApiKeyId) {
    return { status: 'ignored' as const, reason: 'account_mismatch' as const };
  }

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
  const gateFutures = input.sourceExchange === 'GATEIO' && input.event.marketType === 'FUTURES';
  if (gateFutures && !isPositiveFiniteNumber(existingOrder.contractSize)) {
    throw new Error('GATE_FUTURES_CONTRACT_UNIT_UNAVAILABLE');
  }
  if (gateFutures && existingOrder.position &&
      existingOrder.position.contractSize !== existingOrder.contractSize) {
    throw new Error('GATE_FUTURES_CONTRACT_UNIT_MISMATCH');
  }
  // The fill ledger may record a partial nonunit fill, but terminal lifecycle,
  // estimated fees and realized PnL still use contract counts as base quantity.
  if (input.event.marketType === 'FUTURES' &&
      isPositiveFiniteNumber(existingOrder.contractSize) && existingOrder.contractSize !== 1 &&
      (fillProgress.persistedStatus === 'FILLED' || existingOrder.status === 'FILLED')) {
    throw new Error('EXCHANGE_FUTURES_NONUNIT_FINANCIALS_UNSUPPORTED');
  }
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
  const eventTimeFromVenue = input.fillTimeFromVenue ??
    (input.event.transactionTime != null &&
      Number.isSafeInteger(input.event.transactionTime) &&
      input.event.transactionTime > 0);
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
    (existingOrder.exchangeTradeId === input.event.exchangeTradeId || input.snapshotRecovery === true) &&
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
      contractSize: input.event.marketType === 'SPOT' ? 1 : existingOrder.contractSize ?? 1,
      feeCost: recordableEventFee,
      feeCurrency: input.event.feeCurrency,
      executedAt: eventAt,
      venueExecutedAt: eventTimeFromVenue ? eventAt : null,
      raw: input.event.raw as Prisma.InputJsonValue,
      costEvidence: input.event.fillCostEvidence as Prisma.InputJsonValue | undefined,
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
  let openedPositionId: string | null = null;
  let dcaSync: {
    orderId: string; positionId: string; nextQuantity: number;
    nextEntryPrice: number; fillPrice: number; positionSide: 'LONG' | 'SHORT';
    leverage: number;
  } | null = existingLifecycleTrade?.lifecycleAction === 'DCA' && updatedOrder.position
    ? {
        orderId: updatedOrder.id, positionId: updatedOrder.position.id,
        nextQuantity: updatedOrder.position.quantity,
        nextEntryPrice: updatedOrder.position.entryPrice,
        fillPrice: existingLifecycleTrade.price,
        positionSide: updatedOrder.position.side,
        leverage: updatedOrder.position.leverage,
      }
    : null;
  if (
    !existingLifecycleTrade &&
    (fillProgress.shouldApplyFilledLifecycle ||
      (existingOrder.status === 'FILLED' && nextStatus === 'FILLED' &&
        input.event.exchangeTradeId != null &&
        (existingOrder.exchangeTradeId === input.event.exchangeTradeId || input.snapshotRecovery === true))) &&
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
          fillTimeFromVenue: eventTimeFromVenue,
          requiresAccountConfirmation: input.event.marketType === 'FUTURES' &&
            (input.sourceExchange ?? 'BINANCE') === 'BINANCE',
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
            fillTimeFromVenue: eventTimeFromVenue,
            requiresAccountConfirmation: input.event.marketType === 'FUTURES' &&
              (input.sourceExchange ?? 'BINANCE') === 'BINANCE',
          });
          dcaSync = {
            orderId: updatedOrder.id, positionId: updatedOrder.position.id,
            nextQuantity, nextEntryPrice, fillPrice: averageFillPrice,
            positionSide: updatedOrder.position.side,
            leverage: updatedOrder.position.leverage,
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
        mode: 'LIVE',
        fillPrice: averageFillPrice,
        fillQuantity: cumulativeFilledQuantity,
        filledAt: eventAt,
      });
      if (lifecycleResult && 'createdPosition' in lifecycleResult &&
          lifecycleResult.createdPosition && updatedOrder.origin === 'BOT') {
        openedPositionId = lifecycleResult.positionId;
      }
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

  await settleRuntimeOrderFee({ tx, userId: input.userId, orderId: updatedOrder.id });
  await refreshClosedPositionPnlAfterEntryFee({ tx, userId: input.userId, orderId: updatedOrder.id });
  await writeRuntimeTelemetryFromExchangeFill({ tx, userId: input.userId,
    orderId: updatedOrder.id, eventAt });
  const finalPosition = updatedOrder.status === 'FILLED' && updatedOrder.positionId
    ? await tx.position.findUnique({ where: { id: updatedOrder.positionId },
        select: { status: true } })
    : null;
  return {
    status: 'applied' as const,
    orderId: updatedOrder.id,
    positionId: updatedOrder.positionId ?? null,
    orderStatus: updatedOrder.status,
    dcaSync,
    openedPositionId,
    closedPositionId: finalPosition?.status === 'CLOSED' ? updatedOrder.positionId : null,
  };
};

export const applyLiveExchangeOrderTradeUpdateEvent = async (input: LiveExchangeOrderTradeUpdateInput) => {
  const processed = await (input.client ?? prisma).$transaction(
    (tx) => applyLiveExchangeOrderTradeUpdateInTransaction(tx, input),
    { timeout: 30_000, maxWait: 10_000 }
  );

  await input.afterCoreCommit?.();
  if (processed.status === 'applied' && processed.orderStatus === 'FILLED') {
    if ('dcaSync' in processed && processed.dcaSync) {
      if (!await syncRuntimeDcaStateFromExchangeFill(processed.dcaSync)) {
        throw new Error('RUNTIME_STATE_SYNC_PENDING');
      }
    } else {
      if ('openedPositionId' in processed && processed.openedPositionId &&
          !await initializeNewLiveBotPositionState({ userId: input.userId,
            positionId: processed.openedPositionId })) {
        throw new Error('RUNTIME_STATE_SYNC_PENDING');
      }
      if ('closedPositionId' in processed && processed.closedPositionId) {
        await invalidateRuntimePositionStateAfterExchangeClose(processed.closedPositionId);
      }
      await runtimeExecutionDedupeService.markSucceededByOrderId({
        orderId: processed.orderId, positionId: processed.positionId,
      });
    }
  }
  if ('dcaSync' in processed) {
    const { dcaSync: _dcaSync, openedPositionId: _openedPositionId,
      closedPositionId: _closedPositionId, ...result } = processed;
    return result;
  }
  return processed;
};

export const applyLiveExchangeUserDataStreamEvent = async (input: {
  userId: string;
  sourceApiKeyId?: string | null;
  event: NormalizedBinanceUserDataStreamEvent;
}) => {
  if (input.event.eventType === 'ORDER_TRADE_UPDATE') {
    return applyLiveExchangeOrderTradeUpdateEvent({
      userId: input.userId,
      sourceApiKeyId: input.sourceApiKeyId,
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
