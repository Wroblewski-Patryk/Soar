import { Order, Position, PositionSide, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { normalizeSymbol } from '../../lib/symbols';
import { closeOrder as closeOrderLifecycle, openOrder as openOrderLifecycle } from '../orders/orders.service';
import { decideExecutionAction } from './sharedExecutionCore';
import { runtimeTelemetryService } from './runtimeTelemetry.service';
import { invalidatePreTradeOpenPositionCountCache } from './preTrade.service';
import {
  buildCloseExecutionDedupeKey,
  buildOpenExecutionDedupeKey,
  runtimeExecutionDedupeService,
} from './runtimeExecutionDedupe.service';
import {
  PositionCloseAttribution,
  resolveRuntimeCloseAttribution,
} from '../positions/positionCloseAttribution';
import {
  getExternalPositionOwnership,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import {
  buildImportedExternalPositionMarketPrefix,
  buildLegacyImportedExternalPositionSymbolPrefix,
} from '../positions/livePositionReconciliation.helpers';
import {
  computeTradeFee,
  isCloseQuantityComplete,
  resolveOrderExecutionPrice,
  resolveOrderExecutionQuantity,
  resolveRuntimeTakerFeeRate,
} from './executionOrchestrator.helpers';

export type RuntimeSignalDirection = 'LONG' | 'SHORT' | 'EXIT';
export type RuntimeExecutionMode = 'PAPER' | 'LIVE';

export type RuntimeSignalInput = {
  userId: string;
  botId?: string;
  walletId?: string;
  botMarketGroupId?: string;
  runtimeSessionId?: string;
  strategyId?: string;
  strategyLeverage?: number;
  strategyInterval?: string;
  symbol: string;
  direction: RuntimeSignalDirection;
  quantity: number;
  markPrice: number;
  mode: RuntimeExecutionMode;
  candleOpenTime?: number;
  candleCloseTime?: number;
  reason?: string;
};

type OrchestrationResult =
  | { status: 'opened'; orderId: string; positionId: string }
  | { status: 'submitted'; orderId: string }
  | { status: 'closed'; orderId: string; positionId: string }
  | {
      status: 'ignored';
      reason:
        | 'no_open_position'
        | 'no_flip_with_open_position'
        | 'already_open_same_side'
        | 'manual_managed_symbol'
        | 'dedupe_inflight'
        | 'dedupe_reused';
    };

export interface OrderFlowGateway {
  openOrder(userId: string, input: {
    botId?: string;
    walletId?: string;
    strategyId?: string;
    positionId?: string;
    origin?: 'BOT';
    reduceOnly?: boolean;
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET';
    quantity: number;
    price?: number;
    mode: RuntimeExecutionMode;
    riskAck: boolean;
  }): Promise<Order>;
  closeOrder(userId: string, orderId: string, input: { riskAck: boolean }): Promise<Order | null>;
  linkOrderToPosition(orderId: string, positionId: string): Promise<void>;
  annotateCloseAttribution?(
    orderId: string,
    attribution: PositionCloseAttribution
  ): Promise<void>;
}

export interface PositionFlowGateway {
  getOpenPositionBySymbol(input: {
    userId: string;
    symbol: string;
    mode: RuntimeExecutionMode;
    botId?: string;
    walletId?: string;
  }): Promise<Position | null>;
  createPosition(input: Prisma.PositionUncheckedCreateInput): Promise<Position>;
  closePosition(
    positionId: string,
    userId: string,
    payload?: {
      closedAt?: Date;
      realizedPnl?: number;
      closeReason?: PositionCloseAttribution['closeReason'];
      closeInitiator?: PositionCloseAttribution['closeInitiator'];
    }
  ): Promise<void>;
}

export const buildOpenPositionLookupWhere = (input: {
  userId: string;
  symbol: string;
  mode: RuntimeExecutionMode;
  botId?: string;
  walletId?: string;
}): Prisma.PositionWhereInput => {
  const normalizedSymbol = normalizeSymbol(input.symbol);
  const baseWhere: Prisma.PositionWhereInput = {
    userId: input.userId,
    symbol: normalizedSymbol,
    status: 'OPEN',
    syncState: 'IN_SYNC',
  };

  if (input.mode === 'LIVE') {
    if (input.walletId) {
      return {
        ...baseWhere,
        walletId: input.walletId,
      };
    }
    if (input.botId) {
      return {
        ...baseWhere,
        botId: input.botId,
      };
    }
    return baseWhere;
  }

  if (input.botId) {
    return {
      ...baseWhere,
      botId: input.botId,
    };
  }
  if (input.walletId) {
    return {
      ...baseWhere,
      walletId: input.walletId,
    };
  }
  return baseWhere;
};

export const resolveRuntimeOpenPositionBySymbol = async (input: {
  userId: string;
  symbol: string;
  mode: RuntimeExecutionMode;
  botId?: string;
  walletId?: string;
}) => {
  const directPosition = await prisma.position.findFirst({
    where: buildOpenPositionLookupWhere(input),
    orderBy: { openedAt: 'desc' },
  });
  if (directPosition) return directPosition;
  if (input.mode !== 'LIVE' || !input.botId || !input.walletId) return null;

  const botScope = await prisma.bot.findFirst({
    where: {
      id: input.botId,
      userId: input.userId,
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
  if (botScope.walletId !== input.walletId) return null;

  const effectiveApiKeyId = botScope.wallet.apiKeyId ?? botScope.apiKeyId;
  if (!effectiveApiKeyId) return null;

  const ownershipIndex = await resolveExternalPositionOwnershipIndex(input.userId, 'LIVE');
  const ownership = getExternalPositionOwnership(ownershipIndex, {
    apiKeyId: effectiveApiKeyId,
    marketType: botScope.wallet.marketType,
    symbol: input.symbol,
  });
  if (
    ownership.status !== 'OWNED' ||
    ownership.botId !== input.botId ||
    ownership.walletId !== input.walletId
  ) {
    return null;
  }

  return prisma.position.findFirst({
    where: {
      userId: input.userId,
      botId: null,
      symbol: normalizeSymbol(input.symbol),
      status: 'OPEN',
      syncState: 'IN_SYNC',
      origin: 'EXCHANGE_SYNC',
      managementMode: 'BOT_MANAGED',
      AND: [
        {
          OR: [
            { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: effectiveApiKeyId, marketType: botScope.wallet.marketType }) } },
            { externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: effectiveApiKeyId, symbol: input.symbol }) } },
          ],
        },
        { OR: [{ walletId: input.walletId }, { walletId: null }] },
      ],
    },
    orderBy: { openedAt: 'desc' },
  });
};

export interface RuntimeExecutionEventGateway {
  writeEvent(input: {
    userId: string;
    botId?: string;
    strategyId?: string;
    symbol: string;
    direction: RuntimeSignalDirection;
    mode: RuntimeExecutionMode;
    runtimeSessionId?: string;
    status: 'ignored' | 'submitted' | 'opened' | 'closed';
    reason?: string;
    orderId?: string;
    positionId?: string;
    positionQty?: number;
    lastPrice?: number;
    eventAt?: Date;
  }): Promise<void>;
}

export interface RuntimeTradeGateway {
  sumEntryFees(input: {
    userId: string;
    positionId: string;
    entrySide: 'BUY' | 'SELL';
  }): Promise<number>;
  createTrade(input: {
    userId: string;
    botId?: string;
    walletId?: string;
    strategyId?: string;
    orderId: string;
    positionId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    fee?: number;
    feeSource?: 'ESTIMATED' | 'EXCHANGE_FILL';
    feePending?: boolean;
    feeCurrency?: string | null;
    effectiveFeeRate?: number | null;
    exchangeTradeId?: string | null;
    realizedPnl?: number;
    closeReason?: PositionCloseAttribution['closeReason'] | null;
    closeInitiator?: PositionCloseAttribution['closeInitiator'] | null;
    lifecycleAction?: 'OPEN' | 'DCA' | 'CLOSE' | 'UNKNOWN';
    origin?: 'BOT';
    managementMode?: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  }): Promise<void>;
}

export interface RuntimeExecutionDedupeGateway {
  acquire(input: {
    dedupeKey: string;
    commandType: 'OPEN' | 'DCA' | 'CLOSE' | 'CANCEL';
    userId: string;
    botId?: string | null;
    symbol?: string | null;
    commandFingerprint: Record<string, unknown>;
    now?: Date;
  }): Promise<
    | {
        outcome: 'execute';
        dedupeKey: string;
      }
    | {
        outcome: 'reused';
        dedupeKey: string;
        reuseStatus: 'submitted' | 'completed';
        orderId?: string | null;
        positionId?: string | null;
      }
    | {
        outcome: 'inflight';
        dedupeKey: string;
      }
  >;
  markSucceeded(input: {
    dedupeKey: string;
    orderId?: string | null;
    positionId?: string | null;
    now?: Date;
  }): Promise<void>;
  markSubmitted(input: {
    dedupeKey: string;
    orderId: string;
    positionId?: string | null;
    now?: Date;
  }): Promise<void>;
  markFailed(input: {
    dedupeKey: string;
    errorClass: string;
    now?: Date;
  }): Promise<void>;
}

const defaultOrderGateway: OrderFlowGateway = {
  openOrder: (userId, input) =>
    openOrderLifecycle(userId, {
      ...input,
      riskAck: input.riskAck,
    }),
  closeOrder: (userId, orderId, input) => closeOrderLifecycle(userId, orderId, input),
  linkOrderToPosition: async (orderId, positionId) => {
    await prisma.order.update({
      where: { id: orderId },
      data: { positionId },
    });
  },
  annotateCloseAttribution: async (orderId, attribution) => {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        closeReason: attribution.closeReason,
        closeInitiator: attribution.closeInitiator,
      },
    });
  },
};

const defaultPositionGateway: PositionFlowGateway = {
  getOpenPositionBySymbol: (input) => resolveRuntimeOpenPositionBySymbol(input),
  createPosition: (input) => prisma.position.create({ data: input }),
  closePosition: async (positionId, userId, payload) => {
    const closedAt = payload?.closedAt ?? new Date();
    await prisma.position.updateMany({
      where: { id: positionId, userId, status: 'OPEN', syncState: 'IN_SYNC' },
      data: {
        status: 'CLOSED',
        closedAt,
        ...(payload?.closeReason ? { closeReason: payload.closeReason } : {}),
        ...(payload?.closeInitiator ? { closeInitiator: payload.closeInitiator } : {}),
        ...(typeof payload?.realizedPnl === 'number' && Number.isFinite(payload.realizedPnl)
          ? { realizedPnl: payload.realizedPnl }
          : {}),
        unrealizedPnl: 0,
      },
    });
  },
};

const defaultRuntimeEventGateway: RuntimeExecutionEventGateway = {
  writeEvent: async (input) => {
    const eventAt = input.eventAt ?? new Date();
    const metadata = {
      symbol: input.symbol,
      direction: input.direction,
      mode: input.mode,
      status: input.status,
      reason: input.reason ?? null,
      orderId: input.orderId ?? null,
      positionId: input.positionId ?? null,
      positionQty: input.positionQty ?? null,
      lastPrice: input.lastPrice ?? null,
    } as Prisma.InputJsonValue;

    await prisma.log.create({
      data: {
        userId: input.userId,
        botId: input.botId,
        strategyId: input.strategyId,
        action: 'runtime.execution',
        level: 'INFO',
        source: 'engine.executionOrchestrator',
        message: `Runtime execution ${input.status} for ${input.symbol} (${input.direction})`,
        category: 'runtime',
        entityType: 'position',
        entityId: input.positionId,
        actor: 'runtime',
        metadata,
      },
    });

    if (!input.botId) return;

    const eventType =
      input.status === 'opened'
        ? 'POSITION_OPENED'
        : input.status === 'closed'
          ? 'POSITION_CLOSED'
          : 'SIGNAL_DECISION';

    await runtimeTelemetryService.recordRuntimeEvent({
      userId: input.userId,
      botId: input.botId,
      mode: input.mode,
      sessionId: input.runtimeSessionId,
      eventType,
      level: input.status === 'ignored' ? 'DEBUG' : 'INFO',
      symbol: input.symbol,
      strategyId: input.strategyId,
      signalDirection: input.direction,
      message:
        input.status === 'ignored'
          ? `Decision ignored (${input.reason ?? 'n/a'}) for ${input.symbol}`
          : `Runtime execution ${input.status} for ${input.symbol} (${input.direction})`,
      payload: metadata as unknown as Record<string, unknown>,
      eventAt,
    });

    const increments =
      input.status === 'closed'
        ? {
            closedTrades: 1,
          }
        : undefined;

    const isTradeEvent = input.status === 'opened' || input.status === 'closed';
    const openPositionCount = input.status === 'opened' ? 1 : input.status === 'closed' ? 0 : undefined;
    const openPositionQty =
      input.status === 'opened'
        ? Math.max(0, input.positionQty ?? 0)
        : input.status === 'closed'
          ? 0
          : undefined;

    await runtimeTelemetryService.upsertRuntimeSymbolStat({
      userId: input.userId,
      botId: input.botId,
      mode: input.mode,
      sessionId: input.runtimeSessionId,
      symbol: input.symbol,
      increments,
      lastPrice: input.lastPrice,
      lastTradeAt: isTradeEvent ? eventAt : undefined,
      openPositionCount,
      openPositionQty,
    });
  },
};

const defaultRuntimeTradeGateway: RuntimeTradeGateway = {
  sumEntryFees: async (input) => {
    const aggregate = await prisma.trade.aggregate({
      where: {
        userId: input.userId,
        positionId: input.positionId,
        side: input.entrySide,
      },
      _sum: {
        fee: true,
      },
    });
    return aggregate._sum.fee ?? 0;
  },
  createTrade: async (input) => {
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
        lifecycleAction: input.lifecycleAction ?? 'UNKNOWN',
        price: input.price,
        quantity: input.quantity,
        fee: input.fee,
        feeSource: input.feeSource ?? 'ESTIMATED',
        feePending: input.feePending ?? false,
        feeCurrency: input.feeCurrency ?? null,
        effectiveFeeRate: input.effectiveFeeRate ?? null,
        exchangeTradeId: input.exchangeTradeId ?? null,
        realizedPnl: input.realizedPnl,
        closeReason: input.closeReason ?? null,
        closeInitiator: input.closeInitiator ?? null,
        origin: input.origin ?? 'BOT',
        managementMode: input.managementMode ?? 'BOT_MANAGED',
      },
    });
  },
};

const defaultRuntimeExecutionDedupeGateway: RuntimeExecutionDedupeGateway = {
  acquire: (input) => runtimeExecutionDedupeService.acquire(input),
  markSubmitted: (input) => runtimeExecutionDedupeService.markSubmitted(input),
  markSucceeded: (input) => runtimeExecutionDedupeService.markSucceeded(input),
  markFailed: (input) => runtimeExecutionDedupeService.markFailed(input),
};

const resolveErrorClass = (error: unknown) => {
  if (error instanceof Error && error.name) return error.name;
  return 'runtime_execution_error';
};

export const orchestrateRuntimeSignal = async (
  input: RuntimeSignalInput,
  orderGateway: OrderFlowGateway = defaultOrderGateway,
  positionGateway: PositionFlowGateway = defaultPositionGateway,
  runtimeEventGateway: RuntimeExecutionEventGateway = defaultRuntimeEventGateway,
  runtimeTradeGateway: RuntimeTradeGateway = defaultRuntimeTradeGateway,
  dedupeGateway: RuntimeExecutionDedupeGateway = defaultRuntimeExecutionDedupeGateway
): Promise<OrchestrationResult> => {
  const feeRate = resolveRuntimeTakerFeeRate(input.mode);
  const openPosition = await positionGateway.getOpenPositionBySymbol({
    userId: input.userId,
    symbol: input.symbol,
    mode: input.mode,
    botId: input.botId,
    walletId: input.walletId,
  });
  const decision = decideExecutionAction(
    input.direction,
    openPosition
      ? {
          side: openPosition.side as 'LONG' | 'SHORT',
          quantity: openPosition.quantity,
          managementMode: openPosition.managementMode as 'BOT_MANAGED' | 'MANUAL_MANAGED',
        }
      : null
  );

  if (decision.kind === 'ignore') {
    await runtimeEventGateway.writeEvent({
      userId: input.userId,
      botId: input.botId,
      strategyId: input.strategyId,
      symbol: input.symbol,
      direction: input.direction,
      mode: input.mode,
      runtimeSessionId: input.runtimeSessionId,
      status: 'ignored',
      reason: decision.reason,
    });
    return { status: 'ignored', reason: decision.reason };
  }

  if (decision.kind === 'close') {
    if (!openPosition) {
      await runtimeEventGateway.writeEvent({
        userId: input.userId,
        botId: input.botId,
        strategyId: input.strategyId,
        symbol: input.symbol,
        direction: input.direction,
        mode: input.mode,
        runtimeSessionId: input.runtimeSessionId,
        status: 'ignored',
        reason: 'no_open_position',
      });
      return { status: 'ignored', reason: 'no_open_position' };
    }
    const closeDedupeKey = buildCloseExecutionDedupeKey({
      userId: input.userId,
      botId: input.botId,
      symbol: input.symbol,
      positionId: openPosition.id,
      closeReason: input.reason,
    });
    const closeDedupe = await dedupeGateway.acquire({
      dedupeKey: closeDedupeKey,
      commandType: 'CLOSE',
      userId: input.userId,
      botId: input.botId,
      symbol: input.symbol,
      commandFingerprint: {
        positionId: openPosition.id,
        symbol: normalizeSymbol(input.symbol),
        closeReason: input.reason ?? 'EXIT',
        direction: input.direction,
      },
    });
    if (closeDedupe.outcome === 'inflight') {
      await runtimeEventGateway.writeEvent({
        userId: input.userId,
        botId: input.botId,
        strategyId: input.strategyId,
        symbol: input.symbol,
        direction: input.direction,
        mode: input.mode,
        runtimeSessionId: input.runtimeSessionId,
        status: 'ignored',
        reason: 'dedupe_inflight',
      });
      return { status: 'ignored', reason: 'dedupe_inflight' };
    }
    if (closeDedupe.outcome === 'reused') {
      if (closeDedupe.orderId && closeDedupe.positionId) {
        return {
          status: 'closed',
          orderId: closeDedupe.orderId,
          positionId: closeDedupe.positionId,
        };
      }
      if (closeDedupe.orderId && closeDedupe.reuseStatus === 'submitted') {
        return {
          status: 'submitted',
          orderId: closeDedupe.orderId,
        };
      }
      return { status: 'ignored', reason: 'dedupe_reused' };
    }

    try {
    const closeAttribution = resolveRuntimeCloseAttribution(input.reason);
    const closeEventAt = new Date();
    const closeOrder = await orderGateway.openOrder(input.userId, {
      botId: input.botId,
      walletId: openPosition.walletId ?? input.walletId,
      strategyId: input.strategyId,
      positionId: openPosition.id,
      origin: 'BOT',
      reduceOnly: input.mode === 'LIVE' ? true : undefined,
      symbol: input.symbol,
      side: decision.orderSide,
      type: 'MARKET',
      quantity: openPosition.quantity,
      price: input.markPrice,
      mode: input.mode,
      riskAck: true,
    });
    await orderGateway.annotateCloseAttribution?.(closeOrder.id, closeAttribution);
    if (closeOrder.status === 'OPEN' || closeOrder.status === 'PARTIALLY_FILLED') {
      await runtimeEventGateway.writeEvent({
        userId: input.userId,
        botId: input.botId,
        strategyId: input.strategyId,
        symbol: input.symbol,
        direction: input.direction,
        mode: input.mode,
        runtimeSessionId: input.runtimeSessionId,
        status: 'submitted',
        orderId: closeOrder.id,
        positionId: openPosition.id,
        positionQty: openPosition.quantity,
        lastPrice: input.markPrice,
        reason: 'waiting_fill',
        eventAt: closeEventAt,
      });
      await dedupeGateway.markSubmitted({
        dedupeKey: closeDedupeKey,
        orderId: closeOrder.id,
        positionId: openPosition.id,
      });
      return {
        status: 'submitted',
        orderId: closeOrder.id,
      };
    }
    const closeExecutionPrice = resolveOrderExecutionPrice(closeOrder, input.markPrice);
    const closeExecutionQuantity = resolveOrderExecutionQuantity(closeOrder, openPosition.quantity);
    if (!isCloseQuantityComplete(closeExecutionQuantity, openPosition.quantity)) {
      await runtimeEventGateway.writeEvent({
        userId: input.userId,
        botId: input.botId,
        strategyId: input.strategyId,
        symbol: input.symbol,
        direction: input.direction,
        mode: input.mode,
        runtimeSessionId: input.runtimeSessionId,
        status: 'submitted',
        orderId: closeOrder.id,
        positionId: openPosition.id,
        positionQty: closeExecutionQuantity,
        lastPrice: closeExecutionPrice,
        reason: 'waiting_fill',
        eventAt: closeEventAt,
      });
      await dedupeGateway.markSubmitted({
        dedupeKey: closeDedupeKey,
        orderId: closeOrder.id,
        positionId: openPosition.id,
      });
      return {
        status: 'submitted',
        orderId: closeOrder.id,
      };
    }
    const estimatedExitFee = computeTradeFee(closeExecutionPrice, closeExecutionQuantity, feeRate);
    const exitFee = input.mode === 'LIVE' ? (closeOrder.fee ?? estimatedExitFee) : estimatedExitFee;
    const entryLegSide = openPosition.side === 'LONG' ? 'BUY' : 'SELL';
    const entryFees = await runtimeTradeGateway.sumEntryFees({
      userId: input.userId,
      positionId: openPosition.id,
      entrySide: entryLegSide,
    });
    const grossPnl =
      openPosition.side === 'LONG'
        ? (closeExecutionPrice - openPosition.entryPrice) * closeExecutionQuantity
        : (openPosition.entryPrice - closeExecutionPrice) * closeExecutionQuantity;
    const realizedPnl = grossPnl - entryFees - exitFee;

    await positionGateway.closePosition(openPosition.id, input.userId, {
      closedAt: closeEventAt,
      realizedPnl,
      closeReason: closeAttribution.closeReason,
      closeInitiator: closeAttribution.closeInitiator,
    });
    await runtimeTradeGateway.createTrade({
      userId: input.userId,
      botId: input.botId,
      walletId: openPosition.walletId ?? input.walletId,
      strategyId: input.strategyId,
      orderId: closeOrder.id,
      positionId: openPosition.id,
      symbol: input.symbol,
      side: decision.orderSide,
      price: closeExecutionPrice,
      quantity: closeExecutionQuantity,
      fee: exitFee,
      feeSource: closeOrder.feeSource,
      feePending: closeOrder.feePending,
      feeCurrency: closeOrder.feeCurrency,
      effectiveFeeRate: closeOrder.effectiveFeeRate,
      exchangeTradeId: closeOrder.exchangeTradeId,
      realizedPnl,
      closeReason: closeAttribution.closeReason,
      closeInitiator: closeAttribution.closeInitiator,
      lifecycleAction: 'CLOSE',
      managementMode: openPosition.managementMode as 'BOT_MANAGED' | 'MANUAL_MANAGED',
    });
    if (input.botId) {
      await runtimeTelemetryService.upsertRuntimeSymbolStat({
        userId: input.userId,
        botId: input.botId,
        mode: input.mode,
        sessionId: input.runtimeSessionId,
        symbol: input.symbol,
        increments: {
          realizedPnl,
          feesPaid: exitFee,
          ...(realizedPnl >= 0
            ? { grossProfit: realizedPnl, winningTrades: 1 }
            : { grossLoss: Math.abs(realizedPnl), losingTrades: 1 }),
        },
        lastTradeAt: closeEventAt,
      });
    }

    await runtimeEventGateway.writeEvent({
      userId: input.userId,
      botId: input.botId,
      strategyId: input.strategyId,
      symbol: input.symbol,
      direction: input.direction,
      mode: input.mode,
      runtimeSessionId: input.runtimeSessionId,
      status: 'closed',
      orderId: closeOrder.id,
      positionId: openPosition.id,
      positionQty: closeExecutionQuantity,
      lastPrice: input.markPrice,
      reason: input.reason,
      eventAt: closeEventAt,
    });
    await dedupeGateway.markSucceeded({
      dedupeKey: closeDedupeKey,
      orderId: closeOrder.id,
      positionId: openPosition.id,
    });
    invalidatePreTradeOpenPositionCountCache({
      userId: input.userId,
      botId: input.botId,
    });

    return {
      status: 'closed',
      orderId: closeOrder.id,
      positionId: openPosition.id,
    };
    } catch (error) {
      await dedupeGateway.markFailed({
        dedupeKey: closeDedupeKey,
        errorClass: resolveErrorClass(error),
      });
      throw error;
    }
  }

  const hasOpenDedupeContext =
    Boolean(input.botId) &&
    Boolean(input.botMarketGroupId) &&
    Boolean(input.strategyInterval) &&
    Number.isFinite(input.candleOpenTime as number) &&
    Number.isFinite(input.candleCloseTime as number);
  const openDedupeKey = hasOpenDedupeContext
    ? buildOpenExecutionDedupeKey({
        userId: input.userId,
        botId: input.botId!,
        botMarketGroupId: input.botMarketGroupId!,
        symbol: input.symbol,
        interval: input.strategyInterval!,
        candleOpenTime: Number(input.candleOpenTime),
        candleCloseTime: Number(input.candleCloseTime),
        direction: input.direction as 'LONG' | 'SHORT',
      })
    : null;
  if (openDedupeKey) {
    const openDedupe = await dedupeGateway.acquire({
      dedupeKey: openDedupeKey,
      commandType: 'OPEN',
      userId: input.userId,
      botId: input.botId,
      symbol: input.symbol,
      commandFingerprint: {
        botMarketGroupId: input.botMarketGroupId,
        interval: input.strategyInterval,
        candleOpenTime: input.candleOpenTime,
        candleCloseTime: input.candleCloseTime,
        direction: input.direction,
      },
    });
    if (openDedupe.outcome === 'inflight') {
      await runtimeEventGateway.writeEvent({
        userId: input.userId,
        botId: input.botId,
        strategyId: input.strategyId,
        symbol: input.symbol,
        direction: input.direction,
        mode: input.mode,
        runtimeSessionId: input.runtimeSessionId,
        status: 'ignored',
        reason: 'dedupe_inflight',
      });
      return { status: 'ignored', reason: 'dedupe_inflight' };
    }
    if (openDedupe.outcome === 'reused') {
      if (openDedupe.orderId && openDedupe.positionId) {
        return {
          status: 'opened',
          orderId: openDedupe.orderId,
          positionId: openDedupe.positionId,
        };
      }
      if (openDedupe.orderId && openDedupe.reuseStatus === 'submitted') {
        return {
          status: 'submitted',
          orderId: openDedupe.orderId,
        };
      }
      return { status: 'ignored', reason: 'dedupe_reused' };
    }
  }

  try {
  const openOrder = await orderGateway.openOrder(input.userId, {
    botId: input.botId,
    walletId: input.walletId,
    strategyId: input.strategyId,
    origin: 'BOT',
    symbol: input.symbol,
    side: decision.orderSide,
    type: 'MARKET',
    quantity: input.quantity,
    price: input.markPrice,
    mode: input.mode,
    riskAck: true,
  });

  const openEventAt = new Date();
  const hasOpenedPosition = Boolean(openOrder.positionId);
  if (!hasOpenedPosition) {
    await runtimeEventGateway.writeEvent({
      userId: input.userId,
      botId: input.botId,
      strategyId: input.strategyId,
      symbol: input.symbol,
      direction: input.direction,
      mode: input.mode,
      runtimeSessionId: input.runtimeSessionId,
      status: 'submitted',
      orderId: openOrder.id,
      reason: 'waiting_fill',
      lastPrice: input.markPrice,
      eventAt: openEventAt,
    });
    if (openDedupeKey) {
      await dedupeGateway.markSubmitted({
        dedupeKey: openDedupeKey,
        orderId: openOrder.id,
      });
    }
    return {
      status: 'submitted',
      orderId: openOrder.id,
    };
  }

  const openExecutionPrice = resolveOrderExecutionPrice(openOrder, input.markPrice);
  const openExecutionQuantity = resolveOrderExecutionQuantity(openOrder, input.quantity);
  const estimatedOpenFee = computeTradeFee(openExecutionPrice, openExecutionQuantity, feeRate);
  const openFee = input.mode === 'LIVE' ? (openOrder.fee ?? estimatedOpenFee) : estimatedOpenFee;
  await runtimeTradeGateway.createTrade({
    userId: input.userId,
    botId: input.botId,
    walletId: openOrder.walletId ?? input.walletId,
    strategyId: openOrder.strategyId ?? input.strategyId,
    orderId: openOrder.id,
    positionId: openOrder.positionId!,
    symbol: input.symbol,
    side: decision.orderSide,
    price: openExecutionPrice,
    quantity: openExecutionQuantity,
    fee: openFee,
    feeSource: openOrder.feeSource,
    feePending: openOrder.feePending,
    feeCurrency: openOrder.feeCurrency,
    effectiveFeeRate: openOrder.effectiveFeeRate,
    exchangeTradeId: openOrder.exchangeTradeId,
    realizedPnl: 0,
    lifecycleAction: 'OPEN',
    managementMode: 'BOT_MANAGED',
  });
  if (input.botId) {
    await runtimeTelemetryService.upsertRuntimeSymbolStat({
      userId: input.userId,
      botId: input.botId,
      mode: input.mode,
      sessionId: input.runtimeSessionId,
      symbol: input.symbol,
      increments: {
        feesPaid: openFee,
      },
      lastTradeAt: openEventAt,
    });
  }
  await runtimeEventGateway.writeEvent({
    userId: input.userId,
    botId: input.botId,
    strategyId: input.strategyId,
    symbol: input.symbol,
    direction: input.direction,
    mode: input.mode,
    runtimeSessionId: input.runtimeSessionId,
      status: 'opened',
      orderId: openOrder.id,
      positionId: openOrder.positionId!,
      positionQty: openExecutionQuantity,
      lastPrice: input.markPrice,
      eventAt: openEventAt,
    });
  if (openDedupeKey) {
    await dedupeGateway.markSucceeded({
      dedupeKey: openDedupeKey,
      orderId: openOrder.id,
      positionId: openOrder.positionId!,
    });
  }
  invalidatePreTradeOpenPositionCountCache({
    userId: input.userId,
    botId: input.botId,
  });

  return {
    status: 'opened',
    orderId: openOrder.id,
    positionId: openOrder.positionId!,
  };
  } catch (error) {
    if (openDedupeKey) {
      await dedupeGateway.markFailed({
        dedupeKey: openDedupeKey,
        errorClass: resolveErrorClass(error),
      });
    }
    throw error;
  }
};
