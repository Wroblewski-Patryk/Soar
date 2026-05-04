import { OrderStatus, PositionSide, Prisma } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { orderErrors } from './orders.errors';
import { resolveOpenPositionScopeWhere } from './orders.positionScope';
import { computePositionAddUpdate } from './positionFillMath';
import {
  getExternalPositionOwnership,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import {
  buildImportedExternalPositionMarketPrefix,
  buildLegacyImportedExternalPositionSymbolPrefix,
} from '../positions/livePositionReconciliation.helpers';
import { resolveSystemRepairCloseAttribution } from '../positions/positionCloseAttribution';

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

type ReusableOpenPosition = {
  id: string;
  side: PositionSide;
  entryPrice: number;
  quantity: number;
};

type PositionScopeOrder = {
  userId: string;
  symbol: string;
  walletId: string | null;
  botId: string | null;
};

const resolveStaleOpenPositionBlockerWhere = (
  order: PositionScopeOrder
): Prisma.PositionWhereInput => {
  const baseWhere = {
    userId: order.userId,
    symbol: order.symbol.toUpperCase(),
    status: 'OPEN',
    syncState: 'ORPHAN_LOCAL',
  } satisfies Prisma.PositionWhereInput;

  if (order.walletId) {
    return {
      ...baseWhere,
      walletId: order.walletId,
    };
  }

  if (order.botId) {
    return {
      ...baseWhere,
      walletId: null,
      botId: order.botId,
    };
  }

  return {
    ...baseWhere,
    walletId: null,
    botId: null,
  };
};

const releaseStaleOpenPositionBlockers = async (
  tx: Prisma.TransactionClient,
  params: {
    order: PositionScopeOrder;
    closedAt: Date;
  }
) => {
  const closeAttribution = resolveSystemRepairCloseAttribution();

  await tx.position.updateMany({
    where: resolveStaleOpenPositionBlockerWhere(params.order),
    data: {
      status: 'CLOSED',
      closedAt: params.closedAt,
      continuityState: 'REPAIR_ONLY_CLEANUP',
      unrealizedPnl: 0,
      closeReason: closeAttribution.closeReason,
      closeInitiator: closeAttribution.closeInitiator,
    },
  });
};

const findOwnedLiveImportedOpenPositionForFill = async (
  tx: Prisma.TransactionClient,
  params: {
    userId: string;
    order: {
      botId: string | null;
      walletId: string | null;
      symbol: string;
    };
  }
): Promise<ReusableOpenPosition | null> => {
  if (!params.order.botId || !params.order.walletId) return null;

  const botScope = await tx.bot.findFirst({
    where: {
      id: params.order.botId,
      userId: params.userId,
    },
    select: {
      mode: true,
      walletId: true,
      apiKeyId: true,
      wallet: {
        select: {
          mode: true,
          apiKeyId: true,
          marketType: true,
        },
      },
    },
  });
  if (!botScope || botScope.mode !== 'LIVE' || botScope.wallet?.mode !== 'LIVE') return null;
  if (botScope.walletId !== params.order.walletId) return null;

  const effectiveApiKeyId = botScope.wallet.apiKeyId ?? botScope.apiKeyId;
  if (!effectiveApiKeyId) return null;

  const ownershipIndex = await resolveExternalPositionOwnershipIndex(params.userId, 'LIVE');
  const ownership = getExternalPositionOwnership(ownershipIndex, {
    apiKeyId: effectiveApiKeyId,
    marketType: botScope.wallet.marketType,
    symbol: params.order.symbol,
  });
  if (
    ownership.status !== 'OWNED' ||
    ownership.botId !== params.order.botId ||
    ownership.walletId !== params.order.walletId
  ) {
    return null;
  }

  return tx.position.findFirst({
    where: {
      userId: params.userId,
      botId: null,
      symbol: params.order.symbol.toUpperCase(),
      status: 'OPEN',
      syncState: 'IN_SYNC',
      origin: 'EXCHANGE_SYNC',
      managementMode: 'BOT_MANAGED',
      AND: [
        {
          OR: [
            { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: effectiveApiKeyId, marketType: botScope.wallet.marketType }) } },
            { externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: effectiveApiKeyId, symbol: params.order.symbol }) } },
          ],
        },
        { OR: [{ walletId: params.order.walletId }, { walletId: null }] },
      ],
    },
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
};

const applyFillToReusableOpenPosition = async (
  tx: Prisma.TransactionClient,
  params: {
    orderId: string;
    position: ReusableOpenPosition;
    targetPositionSide: PositionSide;
    targetQuantity: number;
    fillPrice: number;
  }
) => {
  if (params.position.side !== params.targetPositionSide) {
    throw orderErrors.openPositionSideConflict();
  }

  const { nextQuantity, nextEntryPrice } = computePositionAddUpdate({
    currentQuantity: params.position.quantity,
    currentEntryPrice: params.position.entryPrice,
    addedQuantity: params.targetQuantity,
    fillPrice: params.fillPrice,
  });

  await tx.position.update({
    where: { id: params.position.id },
    data: {
      quantity: nextQuantity,
      entryPrice: nextEntryPrice,
    },
  });

  const orderWithExistingPosition = await tx.order.update({
    where: { id: params.orderId },
    data: {
      positionId: params.position.id,
    },
  });

  return {
    order: orderWithExistingPosition,
    positionId: params.position.id,
  };
};

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
      return applyFillToReusableOpenPosition(tx, {
        orderId: updatedOrder.id,
        position: existingOpenPosition,
        targetPositionSide,
        targetQuantity,
        fillPrice,
      });
    }

    const ownedImportedPosition = await findOwnedLiveImportedOpenPositionForFill(tx, {
      userId: params.userId,
      order: {
        botId: updatedOrder.botId,
        walletId: updatedOrder.walletId,
        symbol: updatedOrder.symbol,
      },
    });
    if (ownedImportedPosition) {
      return applyFillToReusableOpenPosition(tx, {
        orderId: updatedOrder.id,
        position: ownedImportedPosition,
        targetPositionSide,
        targetQuantity,
        fillPrice,
      });
    }

    const leverage = await resolveOrderPositionLeverage({
      userId: params.userId,
      strategyId: updatedOrder.strategyId,
      fallbackLeverage: params.leverage,
    });

    await releaseStaleOpenPositionBlockers(tx, {
      order: {
        userId: updatedOrder.userId,
        symbol: updatedOrder.symbol,
        walletId: updatedOrder.walletId,
        botId: updatedOrder.botId,
      },
      closedAt: filledAt,
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
