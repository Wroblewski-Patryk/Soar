import { Exchange, OrderStatus, PositionSide, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  CancelOrderDto,
  CloseOrderDto,
  ListOrdersQuery,
  ManualOrderContextQuery,
  OpenOrderDto,
} from './orders.types';
import { CcxtFuturesOrderFill } from '../exchange/ccxtFuturesConnector.types';
import { createPublicExchangeConnector } from '../exchange/exchangeConnectorFactory.service';
import { orderErrors } from './orders.errors';
import {
  getManualOrderContext as getManualOrderContextService,
  resolveManualOrderStrategyContext,
  type ManualOrderContextDeps,
} from './orders.manualContext.service';
import { applyOrderFillLifecycle } from './orders.lifecycle.service';
import { resolveOpenPositionScopeWhere } from './orders.positionScope';
import {
  resolveCanonicalRuntimeVenueContext,
  resolveInheritedRuntimeExecutionContext,
} from '../engine/runtimeBotExecutionContext';
import {
  resolveLiveExecutionApiKey,
  submitLiveOrderThroughBoundary,
} from '../exchange/exchangeAdapterBoundary.service';
import {
  resolveUserAppManualCloseAttribution,
} from '../positions/positionCloseAttribution';
import {
  getExternalPositionOwnership,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import {
  buildImportedExternalPositionMarketPrefix,
  buildLegacyImportedExternalPositionSymbolPrefix,
} from '../positions/livePositionReconciliation.helpers';
export { resolveLiveExecutionApiKey } from '../exchange/exchangeAdapterBoundary.service';

type OpenOrderInput = OpenOrderDto & {
  positionId?: string | null;
  origin?: 'USER' | 'BOT';
};

const ACTIVE_LIST_ORDER_STATUSES = new Set<OrderStatus>([
  'PENDING',
  'OPEN',
  'PARTIALLY_FILLED',
]);

export const listOrders = async (userId: string, query: ListOrdersQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.OrderWhereInput = {
    userId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.status && ACTIVE_LIST_ORDER_STATUSES.has(query.status)
      ? { syncState: 'IN_SYNC' }
      : {}),
    ...(query.symbol ? { symbol: query.symbol } : {}),
  };

  return prisma.order.findMany({
    where,
    skip,
    take: query.limit,
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrder = async (userId: string, id: string) => {
  return prisma.order.findFirst({
    where: { id, userId },
  });
};

type LiveBotContext = {
  id: string;
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  positionMode: 'ONE_WAY' | 'HEDGE';
  apiKeyId: string | null;
  walletId: string | null;
};

type CanonicalOrderBotContext = {
  id: string;
  mode: 'PAPER' | 'LIVE';
  positionMode: 'ONE_WAY' | 'HEDGE';
  apiKeyId: string | null;
  walletApiKeyId: string | null;
  walletId: string | null;
  strategyId: string | null;
  liveOptIn: boolean;
  isActive: boolean;
  consentTextVersion: string | null;
  inheritedExecutionContext: {
    mode: 'PAPER' | 'LIVE';
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    walletId: string | null;
  } | null;
  manualStrategyScopeResolved: boolean;
};

type LiveExecutionResult = {
  exchangeOrderId: string | null;
  status: 'OPEN' | 'FILLED';
  fee?: number | null;
  feeSource?: 'ESTIMATED' | 'EXCHANGE_FILL';
  feePending?: boolean;
  feeCurrency?: string | null;
  effectiveFeeRate?: number | null;
  exchangeTradeId?: string | null;
  fills?: CcxtFuturesOrderFill[];
};

type OpenOrderDeps = {
  executeLiveOrder: (params: {
    userId: string;
    bot: LiveBotContext;
    payload: OpenOrderInput;
  }) => Promise<LiveExecutionResult>;
};

const resolveSupportedLiveOrderType = (
  type: OpenOrderDto['type']
): Extract<OpenOrderDto['type'], 'MARKET' | 'LIMIT'> => {
  if (type === 'MARKET' || type === 'LIMIT') return type;
  throw orderErrors.liveOrderTypeUnsupported();
};

const resolveCanonicalBotContext = async (userId: string, payload: OpenOrderInput) => {
  if (!payload.botId) {
    return {
      payload,
      botContext: null as CanonicalOrderBotContext | null,
    };
  }

  const bot = await prisma.bot.findFirst({
    where: { id: payload.botId, userId },
    select: {
      id: true,
      mode: true,
      positionMode: true,
      apiKeyId: true,
      walletId: true,
      strategyId: true,
      liveOptIn: true,
      isActive: true,
      consentTextVersion: true,
      wallet: {
        select: {
          mode: true,
          exchange: true,
          marketType: true,
          baseCurrency: true,
          paperInitialBalance: true,
          apiKeyId: true,
        },
      },
      symbolGroup: {
        select: {
          marketUniverse: {
            select: {
              exchange: true,
              marketType: true,
              baseCurrency: true,
            },
          },
        },
      },
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: 'ACTIVE',
        },
        select: {
          symbolGroup: {
            select: {
              marketUniverse: {
                select: {
                  exchange: true,
                  marketType: true,
                  baseCurrency: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!bot) {
    throw orderErrors.botContextNotFound();
  }

  const inheritedExecutionContext = resolveInheritedRuntimeExecutionContext({
    walletId: bot.walletId,
    wallet: bot.wallet,
    venueContext: resolveCanonicalRuntimeVenueContext(bot),
  });
  const manualStrategyContext = await resolveManualOrderStrategyContext({
    userId,
    botId: bot.id,
    symbol: payload.symbol,
  });

  const botContext: CanonicalOrderBotContext = {
    id: bot.id,
    mode: bot.mode,
    positionMode: bot.positionMode,
    apiKeyId: bot.apiKeyId,
    walletApiKeyId: bot.wallet?.apiKeyId ?? null,
    walletId: bot.walletId,
    strategyId: bot.strategyId ?? null,
    liveOptIn: bot.liveOptIn,
    isActive: bot.isActive,
    consentTextVersion: bot.consentTextVersion,
    inheritedExecutionContext: inheritedExecutionContext
      ? {
          mode: inheritedExecutionContext.mode,
          exchange: inheritedExecutionContext.exchange,
          marketType: inheritedExecutionContext.marketType,
          walletId: inheritedExecutionContext.walletId,
        }
      : null,
    manualStrategyScopeResolved: manualStrategyContext != null,
  };

  return {
    payload: {
      ...payload,
      botId: botContext.id,
      mode: botContext.mode,
      walletId: botContext.walletId ?? undefined,
      strategyId: manualStrategyContext?.strategyId ?? undefined,
    } as OpenOrderInput,
    botContext,
  };
};

const ensureLiveOrderAllowed = (
  payload: OpenOrderInput,
  botContext: CanonicalOrderBotContext | null
): LiveBotContext | null => {
  if (payload.mode !== 'LIVE') return null;
  if (!payload.riskAck) {
    throw orderErrors.liveRiskAckRequired();
  }
  if (!payload.botId || !botContext) {
    throw orderErrors.liveBotRequired();
  }
  if (botContext.mode !== 'LIVE') throw orderErrors.liveBotModeRequired();
  if (!botContext.liveOptIn || !botContext.consentTextVersion) throw orderErrors.liveBotOptInRequired();
  if (!botContext.isActive) throw orderErrors.liveBotActiveRequired();
  if (!botContext.inheritedExecutionContext || botContext.inheritedExecutionContext.mode !== 'LIVE') {
    throw orderErrors.liveBotContextMismatch();
  }
  if (!botContext.manualStrategyScopeResolved) {
    throw orderErrors.liveManualScopeUnresolved();
  }

  return {
    id: botContext.id,
    exchange: botContext.inheritedExecutionContext.exchange,
    marketType: botContext.inheritedExecutionContext.marketType,
    positionMode: botContext.positionMode,
    apiKeyId: botContext.apiKeyId,
    walletId: botContext.inheritedExecutionContext.walletId,
  };
};

const resolveLiveTargetLeverage = async (params: {
  userId: string;
  marketType: 'FUTURES' | 'SPOT';
  payload: OpenOrderInput;
}): Promise<number | null> => {
  if (params.marketType !== 'FUTURES') return null;
  if (!params.payload.strategyId) return null;

  const strategy = await prisma.strategy.findFirst({
    where: {
      id: params.payload.strategyId,
      userId: params.userId,
    },
    select: {
      leverage: true,
    },
  });

  if (!strategy || !Number.isFinite(strategy.leverage)) return null;
  return Math.max(1, Math.floor(strategy.leverage));
};

export const defaultManualOrderContextDeps: ManualOrderContextDeps = {
  createPublicConnector: ({ exchange, marketType }) =>
    createPublicExchangeConnector({
      exchange,
      marketType,
    }),
};

export const getManualOrderContext = async (
  userId: string,
  query: ManualOrderContextQuery,
  deps: ManualOrderContextDeps = defaultManualOrderContextDeps
) => {
  if (process.env.NODE_ENV === 'test' && deps === defaultManualOrderContextDeps) {
    return getManualOrderContextService(userId, query, {
      createPublicConnector: () => ({
        getSymbolTradingRules: async () => ({
          minAmount: null,
          minNotional: null,
          amountPrecision: null,
        }),
        fetchMarkPrice: async () => Number.NaN,
        disconnect: async () => undefined,
      }),
    });
  }

  return getManualOrderContextService(userId, query, deps);
};

const executeLiveOrderOnExchange: OpenOrderDeps['executeLiveOrder'] = async (params) => {
  const targetLeverage = await resolveLiveTargetLeverage({
    userId: params.userId,
    marketType: params.bot.marketType,
    payload: params.payload,
  });

  return submitLiveOrderThroughBoundary({
    userId: params.userId,
    bot: params.bot,
    order: {
      symbol: params.payload.symbol,
      side: params.payload.side,
      type: resolveSupportedLiveOrderType(params.payload.type),
      quantity: params.payload.quantity,
      price: params.payload.price,
      strategyId: params.payload.strategyId,
      reduceOnly: params.payload.reduceOnly,
    },
    targetLeverage,
  });
};

const defaultOpenOrderDeps: OpenOrderDeps = {
  executeLiveOrder: executeLiveOrderOnExchange,
};

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const resolvePaperImmediateFillPrice = async (params: {
  userId: string;
  payload: OpenOrderInput;
}) => {
  if (params.payload.mode !== 'PAPER' || params.payload.type !== 'MARKET') {
    return isPositiveFiniteNumber(params.payload.price) ? params.payload.price : null;
  }

  if (isPositiveFiniteNumber(params.payload.price)) {
    return params.payload.price;
  }

  if (!params.payload.botId) return null;

  const manualContext = await getManualOrderContextService(
    params.userId,
    {
      botId: params.payload.botId,
      symbol: params.payload.symbol,
      side: params.payload.side,
      quantity: params.payload.quantity,
    },
    defaultManualOrderContextDeps
  );

  return isPositiveFiniteNumber(manualContext?.priceReference.markPrice)
    ? manualContext.priceReference.markPrice
    : null;
};

const resolveRequestedPositionSide = (side: OpenOrderInput['side']): PositionSide =>
  side === 'BUY' ? 'LONG' : 'SHORT';

const findOwnedLiveImportedOpenPositionForOrderConflict = async (params: {
  userId: string;
  payload: OpenOrderInput;
  botContext: CanonicalOrderBotContext | null;
}) => {
  if (params.payload.mode !== 'LIVE') return null;
  if (!params.payload.botId || !params.payload.walletId || !params.botContext) return null;
  if (params.botContext.id !== params.payload.botId) return null;

  const effectiveApiKeyId = params.botContext.walletApiKeyId ?? params.botContext.apiKeyId;
  if (!effectiveApiKeyId) return null;

  const ownershipIndex = await resolveExternalPositionOwnershipIndex(params.userId, 'LIVE');
  const ownership = getExternalPositionOwnership(ownershipIndex, {
    apiKeyId: effectiveApiKeyId,
    marketType: params.botContext.inheritedExecutionContext?.marketType ?? 'FUTURES',
    symbol: params.payload.symbol,
  });
  if (
    ownership.status !== 'OWNED' ||
    ownership.botId !== params.payload.botId ||
    ownership.walletId !== params.payload.walletId
  ) {
    return null;
  }

  return prisma.position.findFirst({
    where: {
      userId: params.userId,
      botId: null,
      symbol: params.payload.symbol.toUpperCase(),
      status: 'OPEN',
      syncState: 'IN_SYNC',
      origin: 'EXCHANGE_SYNC',
      managementMode: 'BOT_MANAGED',
      AND: [
        {
          OR: [
            { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: effectiveApiKeyId, marketType: params.botContext.inheritedExecutionContext?.marketType ?? 'FUTURES' }) } },
            { externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: effectiveApiKeyId, symbol: params.payload.symbol }) } },
          ],
        },
        { OR: [{ walletId: params.payload.walletId }, { walletId: null }] },
      ],
    },
    select: {
      id: true,
      side: true,
    },
    orderBy: {
      openedAt: 'desc',
    },
  });
};

const assertNoImplicitReverseOpenConflict = async (params: {
  userId: string;
  payload: OpenOrderInput;
  botContext: CanonicalOrderBotContext | null;
}) => {
  if (params.payload.positionId) return;
  const requestedSide = resolveRequestedPositionSide(params.payload.side);

  const existingOpenPosition = await prisma.position.findFirst({
    where: resolveOpenPositionScopeWhere({
      userId: params.userId,
      symbol: params.payload.symbol,
      mode: params.payload.mode,
      walletId: params.payload.walletId ?? null,
      botId: params.payload.botId ?? null,
    }),
    select: {
      id: true,
      side: true,
    },
    orderBy: {
      openedAt: 'desc',
    },
  });

  if (existingOpenPosition && existingOpenPosition.side !== requestedSide) {
    throw orderErrors.openPositionSideConflict();
  }

  const ownedImportedPosition = await findOwnedLiveImportedOpenPositionForOrderConflict(params);
  if (ownedImportedPosition && ownedImportedPosition.side !== requestedSide) {
    throw orderErrors.openPositionSideConflict();
  }
};

const writeOrderAudit = async (params: {
  userId: string;
  orderId: string;
  action: 'order.opened' | 'order.canceled' | 'order.closed';
  level: 'INFO' | 'WARN';
  metadata?: Record<string, unknown>;
}) => {
  try {
    await prisma.log.create({
      data: {
        userId: params.userId,
        action: params.action,
        level: params.level,
        source: 'orders.service',
        message: `Order lifecycle event: ${params.action}`,
        category: 'TRADING_DECISION',
        entityType: 'ORDER',
        entityId: params.orderId,
        metadata: (params.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch {
    // Audit failures should not block order lifecycle.
  }
};

export const openOrder = async (
  userId: string,
  payload: OpenOrderInput,
  deps: OpenOrderDeps = defaultOpenOrderDeps
) => {
  const { payload: canonicalPayload, botContext } = await resolveCanonicalBotContext(userId, payload);
  await assertNoImplicitReverseOpenConflict({
    userId,
    payload: canonicalPayload,
    botContext,
  });
  const liveBot = ensureLiveOrderAllowed(canonicalPayload, botContext);

  const now = new Date();
  let exchangeOrderId: string | null = null;
  let exchangeTradeId: string | null = null;
  let status: 'OPEN' | 'FILLED' = canonicalPayload.type === 'MARKET' ? 'FILLED' : 'OPEN';
  let fee: number | null = null;
  let feeSource: 'ESTIMATED' | 'EXCHANGE_FILL' = 'ESTIMATED';
  let feePending = canonicalPayload.mode === 'LIVE';
  let feeCurrency: string | null = null;
  let effectiveFeeRate: number | null = null;
  let fills: CcxtFuturesOrderFill[] = [];

  if (canonicalPayload.mode === 'LIVE' && process.env.NODE_ENV !== 'test') {
    if (!liveBot) {
      throw orderErrors.liveBotNotFound();
    }
    const liveResult = await deps.executeLiveOrder({
      userId,
      bot: liveBot,
      payload: canonicalPayload,
    });
    exchangeOrderId = liveResult.exchangeOrderId;
    status = liveResult.status;
    exchangeTradeId = liveResult.exchangeTradeId ?? null;
    fee = typeof liveResult.fee === 'number' ? liveResult.fee : null;
    feeSource = liveResult.feeSource ?? 'ESTIMATED';
    feePending = liveResult.feePending ?? false;
    feeCurrency = liveResult.feeCurrency ?? null;
    effectiveFeeRate =
      typeof liveResult.effectiveFeeRate === 'number' ? liveResult.effectiveFeeRate : null;
    fills = Array.isArray(liveResult.fills) ? liveResult.fills : [];
  }

  const filledQuantityFromExchange =
    fills.length > 0
      ? fills.reduce((sum, fill) => {
          const quantity = Number(fill.quantity);
          return Number.isFinite(quantity) ? sum + Math.max(0, quantity) : sum;
        }, 0)
      : null;
  const resolvedPaperFillPrice =
    canonicalPayload.mode === 'PAPER' && status === 'FILLED'
      ? await resolvePaperImmediateFillPrice({
          userId,
          payload: canonicalPayload,
        })
      : null;
  const fillPriceFromExchange =
    fills.find((fill) => Number.isFinite(fill.price) && fill.price > 0)?.price ??
    resolvedPaperFillPrice ??
    (isPositiveFiniteNumber(canonicalPayload.price) ? canonicalPayload.price : null);
  if (
    canonicalPayload.mode === 'PAPER' &&
    canonicalPayload.type === 'MARKET' &&
    !isPositiveFiniteNumber(fillPriceFromExchange)
  ) {
    throw orderErrors.paperMarketPriceUnavailable();
  }
  const shouldApplyImmediateFillLifecycle = status === 'FILLED' && isPositiveFiniteNumber(fillPriceFromExchange);
  const persistedStatus: 'OPEN' | 'FILLED' = shouldApplyImmediateFillLifecycle ? 'FILLED' : 'OPEN';

  const order = await prisma.order.create({
    data: {
      userId,
      botId: canonicalPayload.botId,
      walletId: canonicalPayload.walletId,
      strategyId: canonicalPayload.strategyId,
      positionId: canonicalPayload.positionId ?? null,
      origin: canonicalPayload.origin ?? 'USER',
      symbol: canonicalPayload.symbol.toUpperCase(),
      side: canonicalPayload.side,
      type: canonicalPayload.type,
      closeReason: null,
      closeInitiator: null,
      status: persistedStatus,
      quantity: canonicalPayload.quantity,
      filledQuantity: persistedStatus === 'FILLED' ? canonicalPayload.quantity : 0,
      price: canonicalPayload.price,
      fee,
      feeSource,
      feePending,
      feeCurrency,
      effectiveFeeRate,
      exchangeOrderId,
      exchangeTradeId,
      submittedAt: now,
      filledAt: persistedStatus === 'FILLED' ? now : null,
    },
  });

  const lifecycleResult =
    shouldApplyImmediateFillLifecycle
      ? await applyOrderFillLifecycle({
          userId,
          orderId: order.id,
          mode: canonicalPayload.mode,
          fillPrice: fillPriceFromExchange,
          fillQuantity: filledQuantityFromExchange ?? canonicalPayload.quantity,
          filledAt: now,
        })
      : null;
  const orderAfterLifecycle = lifecycleResult?.order ?? order;

  if (canonicalPayload.mode === 'LIVE' && fills.length > 0) {
    await prisma.orderFill.createMany({
      data: fills.map((fill) => ({
        userId,
        botId: canonicalPayload.botId ?? null,
        strategyId: canonicalPayload.strategyId ?? null,
        orderId: order.id,
        tradeId: null,
        positionId: orderAfterLifecycle.positionId ?? null,
        symbol: fill.symbol,
        side: canonicalPayload.side,
        exchangeTradeId:
          fill.exchangeTradeId ?? `${exchangeOrderId ?? order.id}-${fill.executedAt?.toISOString() ?? 'na'}`,
        price: fill.price,
        quantity: fill.quantity,
        notional: fill.notional,
        feeCost: typeof fill.feeCost === 'number' ? fill.feeCost : null,
        feeCurrency: fill.feeCurrency,
        feeRate: fill.feeRate,
        executedAt: fill.executedAt ?? now,
        raw: (fill.raw ?? {}) as Prisma.InputJsonValue,
      })),
    });
  }

  await writeOrderAudit({
    userId,
    orderId: order.id,
    action: 'order.opened',
    level: 'INFO',
    metadata: {
      semanticPath: 'unified_order_fill_position',
      lifecycleContract: 'order->fill->position',
      mode: canonicalPayload.mode,
      modeSource: canonicalPayload.botId ? 'bot_context' : 'request',
      riskAck: canonicalPayload.riskAck,
      type: canonicalPayload.type,
      status: orderAfterLifecycle.status,
      exchangeOrderId: orderAfterLifecycle.exchangeOrderId,
      positionId: orderAfterLifecycle.positionId,
      waitingForFill: orderAfterLifecycle.status !== 'FILLED' || !orderAfterLifecycle.positionId,
      fillPriceResolved: isPositiveFiniteNumber(fillPriceFromExchange),
    },
  });

  return orderAfterLifecycle;
};

export const cancelOrder = async (userId: string, id: string, payload: CancelOrderDto) => {
  const existing = await prisma.order.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  if (existing.status === 'CANCELED' || existing.status === 'FILLED') {
    throw orderErrors.orderNotCancelable();
  }
  if (existing.syncState !== 'IN_SYNC') {
    throw orderErrors.orderNotCancelable();
  }

  if (!payload.riskAck) {
    throw orderErrors.orderCancelRiskAckRequired();
  }

  const updated = await prisma.order.update({
    where: { id: existing.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  await writeOrderAudit({
    userId,
    orderId: updated.id,
    action: 'order.canceled',
    level: 'WARN',
    metadata: {
      previousStatus: existing.status,
      riskAck: payload.riskAck,
    },
  });

  return updated;
};

export const closeOrder = async (userId: string, id: string, payload: CloseOrderDto) => {
  const existing = await prisma.order.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  if (!payload.riskAck) {
    throw orderErrors.orderCloseRiskAckRequired();
  }

  if (existing.status !== 'OPEN' && existing.status !== 'PARTIALLY_FILLED') {
    throw orderErrors.orderNotClosable();
  }
  if (existing.syncState !== 'IN_SYNC') {
    throw orderErrors.orderNotClosable();
  }

  const now = new Date();
  const updated = await prisma.order.update({
    where: { id: existing.id },
    data: {
      closeReason: 'MANUAL',
      closeInitiator: 'USER_APP',
      status: 'FILLED',
      filledQuantity: existing.quantity,
      filledAt: now,
    },
  });

  if (existing.positionId) {
    const closeAttribution = resolveUserAppManualCloseAttribution();
    await prisma.position.updateMany({
      where: {
        id: existing.positionId,
        userId,
        status: 'OPEN',
        syncState: 'IN_SYNC',
      },
      data: {
        status: 'CLOSED',
        closedAt: now,
        closeReason: closeAttribution.closeReason,
        closeInitiator: closeAttribution.closeInitiator,
        unrealizedPnl: 0,
      },
    });
  }

  await writeOrderAudit({
    userId,
    orderId: updated.id,
    action: 'order.closed',
    level: 'INFO',
    metadata: {
      previousStatus: existing.status,
      riskAck: payload.riskAck,
    },
  });

  return updated;
};
