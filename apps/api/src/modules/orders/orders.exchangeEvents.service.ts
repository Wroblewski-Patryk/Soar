import { OrderStatus, Prisma } from '@prisma/client';

import { prisma } from '../../prisma/client';
import {
  NormalizedBinanceAccountUpdateEvent,
  NormalizedBinanceOrderTradeUpdateEvent,
  NormalizedBinanceUserDataStreamEvent,
} from '../exchange/binanceUserDataStream.types';
import {
  resolveExchangeConfirmedCloseAttribution,
  resolveExternalSyncMissingCloseAttribution,
} from '../positions/positionCloseAttribution';
import { applyOrderFillLifecycle } from './orders.lifecycle.service';

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
  userId: string;
  botId: string | null;
  walletId: string | null;
  positionId: string;
  positionSide: 'LONG' | 'SHORT';
  entryPrice: number;
  closePrice: number;
  closeQuantity: number;
  exitFee: number;
}) => {
  const entryLegSide = input.positionSide === 'LONG' ? 'BUY' : 'SELL';
  const entryFeeAggregate = await prisma.trade.aggregate({
    where: {
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
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

const ensureOrderFillRecord = async (input: {
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
  const existing = await prisma.orderFill.findFirst({
    where: {
      orderId: input.orderId,
      exchangeTradeId: input.exchangeTradeId,
    },
    select: { id: true },
  });
  if (existing) return;

  await prisma.orderFill.create({
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

const ensureTradeRecord = async (input: {
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
  lifecycleAction: 'OPEN' | 'CLOSE';
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  origin: 'BOT' | 'USER' | 'EXCHANGE_SYNC' | 'BACKTEST';
  realizedPnl?: number;
  closeReason?: 'TP' | 'TTP' | 'SL' | 'TSL' | 'LIQUIDATION' | 'ACCOUNT_FLOOR' | 'MANUAL' | 'SIGNAL_EXIT' | 'POSITION_LIFETIME' | 'EXTERNAL_SYNC_MISSING' | 'SYSTEM_REPAIR' | null;
  closeInitiator?: 'BOT_APP' | 'USER_APP' | 'USER_EXCHANGE' | 'EXCHANGE' | 'SYSTEM_REPAIR' | null;
}) => {
  if (input.exchangeTradeId) {
    const existing = await prisma.trade.findFirst({
      where: {
        orderId: input.orderId,
        exchangeTradeId: input.exchangeTradeId,
      },
      select: { id: true },
    });
    if (existing) return;
  }

  await prisma.trade.create({
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
    },
  });
};

export const applyLiveExchangeOrderTradeUpdateEvent = async (input: {
  userId: string;
  event: NormalizedBinanceOrderTradeUpdateEvent;
}) => {
  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: input.userId,
      exchangeOrderId: input.event.exchangeOrderId,
      symbol: normalizeSymbol(input.event.symbol),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: {
      position: true,
    },
  });
  if (!existingOrder) {
    return { status: 'ignored' as const, reason: 'order_not_found' as const };
  }

  const nextStatus = mapExchangeOrderStatus(input.event.orderStatus);
  const cumulativeFilledQuantity =
    isPositiveFiniteNumber(input.event.cumulativeFilledQuantity)
      ? input.event.cumulativeFilledQuantity
      : existingOrder.filledQuantity;
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
  const fee = typeof input.event.fee === 'number' && Number.isFinite(input.event.fee)
    ? input.event.fee
    : existingOrder.fee;

  let updatedOrder = await prisma.order.update({
    where: { id: existingOrder.id },
    data: {
      status: nextStatus,
      filledQuantity: cumulativeFilledQuantity,
      averageFillPrice,
      filledAt: nextStatus === 'FILLED' ? eventAt : existingOrder.filledAt,
      exchangeTradeId: input.event.exchangeTradeId ?? existingOrder.exchangeTradeId,
      fee,
      feeSource:
        typeof input.event.fee === 'number' && Number.isFinite(input.event.fee)
          ? 'EXCHANGE_FILL'
          : existingOrder.feeSource,
      feePending: nextStatus === 'FILLED' ? false : existingOrder.feePending,
      feeCurrency: input.event.feeCurrency ?? existingOrder.feeCurrency,
    },
    include: {
      position: true,
    },
  });

  if (
    input.event.exchangeTradeId &&
    isPositiveFiniteNumber(lastFillQuantity) &&
    isPositiveFiniteNumber(lastFillPrice)
  ) {
    await ensureOrderFillRecord({
      userId: input.userId,
      botId: updatedOrder.botId,
      strategyId: updatedOrder.strategyId,
      orderId: updatedOrder.id,
      positionId: updatedOrder.positionId,
      symbol: updatedOrder.symbol,
      side: updatedOrder.side,
      exchangeTradeId: input.event.exchangeTradeId,
      price: lastFillPrice,
      quantity: lastFillQuantity,
      feeCost: typeof input.event.fee === 'number' ? input.event.fee : null,
      feeCurrency: input.event.feeCurrency,
      executedAt: eventAt,
      raw: input.event.raw as Prisma.InputJsonValue,
    });
  }

  if (
    nextStatus === 'FILLED' &&
    isPositiveFiniteNumber(averageFillPrice) &&
    isPositiveFiniteNumber(cumulativeFilledQuantity)
  ) {
    if (updatedOrder.positionId && updatedOrder.position) {
      if (
        updatedOrder.position.status === 'OPEN' &&
        isClosingOrderForPosition({
          orderSide: updatedOrder.side,
          positionSide: updatedOrder.position.side,
        })
      ) {
        const closeAttribution = resolveExchangeConfirmedCloseAttribution({
          orderCloseReason: updatedOrder.closeReason,
          orderCloseInitiator: updatedOrder.closeInitiator,
          executionType: input.event.executionType,
        });
        const exitFee = typeof fee === 'number' && Number.isFinite(fee) ? fee : 0;
        const realizedPnl = await computeCloseRealizedPnl({
          userId: input.userId,
          botId: updatedOrder.botId,
          walletId: updatedOrder.walletId,
          positionId: updatedOrder.position.id,
          positionSide: updatedOrder.position.side,
          entryPrice: updatedOrder.position.entryPrice,
          closePrice: averageFillPrice,
          closeQuantity: cumulativeFilledQuantity,
          exitFee,
        });
        await prisma.position.update({
          where: { id: updatedOrder.position.id },
          data: {
            status: 'CLOSED',
            closedAt: eventAt,
            realizedPnl,
            unrealizedPnl: 0,
            closeReason: closeAttribution.closeReason,
            closeInitiator: closeAttribution.closeInitiator,
          },
        });
        await ensureTradeRecord({
          userId: input.userId,
          botId: updatedOrder.botId,
          walletId: updatedOrder.walletId,
          strategyId: updatedOrder.strategyId,
          orderId: updatedOrder.id,
          positionId: updatedOrder.position.id,
          symbol: updatedOrder.symbol,
          side: updatedOrder.side,
          price: averageFillPrice,
          quantity: cumulativeFilledQuantity,
          fee: typeof fee === 'number' ? fee : null,
          feeSource: updatedOrder.feeSource,
          feePending: false,
          feeCurrency: updatedOrder.feeCurrency,
          effectiveFeeRate: updatedOrder.effectiveFeeRate,
          exchangeTradeId: input.event.exchangeTradeId ?? null,
          lifecycleAction: 'CLOSE',
          managementMode: updatedOrder.managementMode,
          origin: updatedOrder.origin,
          realizedPnl,
          closeReason: closeAttribution.closeReason,
          closeInitiator: closeAttribution.closeInitiator,
        });
      } else {
        await ensureTradeRecord({
          userId: input.userId,
          botId: updatedOrder.botId,
          walletId: updatedOrder.walletId,
          strategyId: updatedOrder.strategyId,
          orderId: updatedOrder.id,
          positionId: updatedOrder.position.id,
          symbol: updatedOrder.symbol,
          side: updatedOrder.side,
          price: averageFillPrice,
          quantity: cumulativeFilledQuantity,
          fee: typeof fee === 'number' ? fee : null,
          feeSource: updatedOrder.feeSource,
          feePending: false,
          feeCurrency: updatedOrder.feeCurrency,
          effectiveFeeRate: updatedOrder.effectiveFeeRate,
          exchangeTradeId: input.event.exchangeTradeId ?? null,
          lifecycleAction: 'OPEN',
          managementMode: updatedOrder.managementMode,
          origin: updatedOrder.origin,
          realizedPnl: 0,
        });
      }
      updatedOrder = await prisma.order.findUniqueOrThrow({
        where: { id: updatedOrder.id },
        include: { position: true },
      });
    } else {
      const lifecycleResult = await applyOrderFillLifecycle({
        userId: input.userId,
        orderId: updatedOrder.id,
        fillPrice: averageFillPrice,
        fillQuantity: cumulativeFilledQuantity,
        filledAt: eventAt,
      });
      updatedOrder = await prisma.order.findUniqueOrThrow({
        where: { id: updatedOrder.id },
        include: { position: true },
      });
      if (lifecycleResult?.positionId) {
        await prisma.orderFill.updateMany({
          where: {
            orderId: updatedOrder.id,
            positionId: null,
          },
          data: {
            positionId: lifecycleResult.positionId,
          },
        });
        await ensureTradeRecord({
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
          feePending: false,
          feeCurrency: updatedOrder.feeCurrency,
          effectiveFeeRate: updatedOrder.effectiveFeeRate,
          exchangeTradeId: input.event.exchangeTradeId ?? null,
          lifecycleAction: 'OPEN',
          managementMode: updatedOrder.managementMode,
          origin: updatedOrder.origin,
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
  };
};

export const applyLiveExchangeAccountUpdateEvent = async (input: {
  userId: string;
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
    if (quantity === 0) {
      const closeAttribution = resolveExternalSyncMissingCloseAttribution();
      const result = await prisma.position.updateMany({
        where: {
          userId: input.userId,
          symbol: normalizedSymbol,
          side,
          status: 'OPEN',
        },
        data: {
          status: 'CLOSED',
          closedAt: eventAt,
          unrealizedPnl: 0,
          closeReason: closeAttribution.closeReason,
          closeInitiator: closeAttribution.closeInitiator,
        },
      });
      updatedPositions += result.count;
      continue;
    }
    const result = await prisma.position.updateMany({
      where: {
        userId: input.userId,
        symbol: normalizedSymbol,
        side,
        status: 'OPEN',
      },
      data: {
        ...(typeof quantity === 'number' ? { quantity } : {}),
        ...(typeof position.entryPrice === 'number' ? { entryPrice: position.entryPrice } : {}),
        ...(typeof position.unrealizedPnl === 'number'
          ? { unrealizedPnl: position.unrealizedPnl }
          : {}),
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
      event: input.event,
    });
  }
  return {
    status: 'ignored' as const,
    reason: 'unsupported_event' as const,
  };
};
