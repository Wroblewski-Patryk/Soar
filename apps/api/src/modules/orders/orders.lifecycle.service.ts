import { OrderStatus, PositionSide } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { orderErrors } from './orders.errors';
import { resolveOpenPositionScopeWhere } from './orders.positionScope';
import { computePositionAddUpdate } from './positionFillMath';

type ApplyOrderFillLifecycleInput = {
  userId: string;
  orderId: string;
  fillPrice: number | null;
  fillQuantity: number | null;
  filledAt?: Date;
  leverage?: number | null;
};

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const resolveOrderPositionLeverage = async (params: {
  userId: string;
  strategyId: string | null;
  fallbackLeverage?: number | null;
}) => {
  if (typeof params.fallbackLeverage === 'number' && Number.isFinite(params.fallbackLeverage)) {
    return Math.max(1, Math.floor(params.fallbackLeverage));
  }
  if (!params.strategyId) return 1;

  const strategy = await prisma.strategy.findFirst({
    where: {
      id: params.strategyId,
      userId: params.userId,
    },
    select: {
      leverage: true,
    },
  });
  if (!strategy || !Number.isFinite(strategy.leverage)) return 1;
  return Math.max(1, Math.floor(strategy.leverage));
};

const resolvePositionSideFromOrderSide = (side: 'BUY' | 'SELL'): PositionSide =>
  side === 'BUY' ? 'LONG' : 'SHORT';

export const applyOrderFillLifecycle = async (params: ApplyOrderFillLifecycleInput) => {
  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findFirst({
      where: {
        id: params.orderId,
        userId: params.userId,
      },
    });
    if (!existingOrder) return null;

    const targetQuantityRaw =
      typeof params.fillQuantity === 'number' && Number.isFinite(params.fillQuantity)
        ? params.fillQuantity
        : existingOrder.quantity;
    const targetQuantity = Math.max(
      0,
      Math.min(existingOrder.quantity, Math.max(existingOrder.filledQuantity, targetQuantityRaw))
    );
    const fillStatus: OrderStatus = targetQuantity >= existingOrder.quantity ? 'FILLED' : 'PARTIALLY_FILLED';
    const filledAt = params.filledAt ?? new Date();
    const fillPrice =
      isPositiveFiniteNumber(params.fillPrice)
        ? params.fillPrice
        : isPositiveFiniteNumber(existingOrder.averageFillPrice)
          ? existingOrder.averageFillPrice
          : isPositiveFiniteNumber(existingOrder.price)
            ? existingOrder.price
            : null;

    const updatedOrder = await tx.order.update({
      where: { id: existingOrder.id },
      data: {
        status: fillStatus,
        filledQuantity: targetQuantity,
        filledAt,
        averageFillPrice: fillPrice,
        feePending: false,
      },
    });

    if (fillStatus !== 'FILLED' || !isPositiveFiniteNumber(fillPrice)) {
      return {
        order: updatedOrder,
        positionId: updatedOrder.positionId ?? null,
      };
    }

    if (updatedOrder.positionId) {
      return {
        order: updatedOrder,
        positionId: updatedOrder.positionId,
      };
    }

    const targetPositionSide = resolvePositionSideFromOrderSide(updatedOrder.side);
    const existingOpenPosition = await tx.position.findFirst({
      where: resolveOpenPositionScopeWhere({
        userId: updatedOrder.userId,
        symbol: updatedOrder.symbol,
        walletId: updatedOrder.walletId ?? null,
        botId: updatedOrder.botId ?? null,
      }),
      orderBy: {
        openedAt: 'desc',
      },
      select: {
        id: true,
        side: true,
        entryPrice: true,
        quantity: true,
      },
    });

    if (existingOpenPosition) {
      if (existingOpenPosition.side !== targetPositionSide) {
        throw orderErrors.openPositionSideConflict();
      }

      const { nextQuantity, nextEntryPrice } = computePositionAddUpdate({
        currentQuantity: existingOpenPosition.quantity,
        currentEntryPrice: existingOpenPosition.entryPrice,
        addedQuantity: targetQuantity,
        fillPrice,
      });

      await tx.position.update({
        where: { id: existingOpenPosition.id },
        data: {
          quantity: nextQuantity,
          entryPrice: nextEntryPrice,
        },
      });

      const orderWithExistingPosition = await tx.order.update({
        where: { id: updatedOrder.id },
        data: {
          positionId: existingOpenPosition.id,
        },
      });

      return {
        order: orderWithExistingPosition,
        positionId: existingOpenPosition.id,
      };
    }

    const leverage = await resolveOrderPositionLeverage({
      userId: params.userId,
      strategyId: updatedOrder.strategyId,
      fallbackLeverage: params.leverage,
    });

    const createdPosition = await tx.position.create({
      data: {
        userId: updatedOrder.userId,
        botId: updatedOrder.botId,
        walletId: updatedOrder.walletId,
        strategyId: updatedOrder.strategyId,
        symbol: updatedOrder.symbol,
        side: resolvePositionSideFromOrderSide(updatedOrder.side),
        status: 'OPEN',
        entryPrice: fillPrice,
        quantity: Math.max(0, targetQuantity),
        leverage,
        origin: updatedOrder.origin,
        managementMode: updatedOrder.managementMode,
        syncState: 'IN_SYNC',
        openedAt: filledAt,
      },
      select: {
        id: true,
      },
    });

    const orderWithPosition = await tx.order.update({
      where: { id: updatedOrder.id },
      data: {
        positionId: createdPosition.id,
      },
    });

    return {
      order: orderWithPosition,
      positionId: createdPosition.id,
    };
  });
};
