import { Exchange, OrderStatus, PositionSide, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  CancelOrderDto,
  CloseOrderDto,
  ListOrdersQuery,
  ManualOrderContextQuery,
  OpenOrderDto,
} from './orders.types';
import { decrypt } from '../../utils/crypto';
import { CcxtFuturesConnector } from '../exchange/ccxtFuturesConnector.service';
import { createLiveOrderAdapter } from '../exchange/liveOrderAdapter.service';
import { CcxtFuturesOrderFill } from '../exchange/ccxtFuturesConnector.types';
import {
  createAuthenticatedExchangeConnector,
  createPublicExchangeConnector,
} from '../exchange/exchangeConnectorFactory.service';
import { liveOrderingConfig } from '../../config/runtimeExecution';
import { isAppErrorLike } from '../../lib/errors';
import { orderErrors } from './orders.errors';
import {
  getManualOrderContext as getManualOrderContextService,
  resolveManualOrderStrategyContext,
  type ManualOrderContextDeps,
} from './orders.manualContext.service';
import { applyOrderFillLifecycle } from './orders.lifecycle.service';
import { enforceLivePretradeGuards } from './orders.quantityRules';
import { resolveInheritedRuntimeExecutionContext } from '../engine/runtimeBotExecutionContext';

type OpenOrderInput = OpenOrderDto & {
  positionId?: string | null;
  origin?: 'USER' | 'BOT';
};

export const listOrders = async (userId: string, query: ListOrdersQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where = {
    userId,
    ...(query.status ? { status: query.status } : {}),
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

const mapLiveOrderType = (type: OpenOrderDto['type']) => {
  if (type === 'MARKET') return 'market' as const;
  if (type === 'LIMIT') return 'limit' as const;
  throw orderErrors.liveOrderTypeUnsupported();
};

const mapLiveOrderStatus = (status: string | undefined, fallbackType: OpenOrderDto['type']) => {
  if (status) {
    const normalized = status.toLowerCase();
    if (normalized.includes('filled') || normalized.includes('closed')) return 'FILLED' as const;
  }
  return fallbackType === 'MARKET' ? ('FILLED' as const) : ('OPEN' as const);
};

const liveMarginLeverageConvergenceCache = new Map<string, { expiresAtMs: number }>();

const getLiveConvergenceCacheKey = (params: {
  apiKeyId: string;
  symbol: string;
  leverage: number | null;
  marginMode: 'cross' | 'isolated' | null;
}) =>
  `${params.apiKeyId}:${params.symbol.toUpperCase()}:${params.leverage ?? 'na'}:${params.marginMode ?? 'na'}`;

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
    },
  });
  if (!bot) {
    throw orderErrors.botContextNotFound();
  }

  const inheritedExecutionContext = resolveInheritedRuntimeExecutionContext({
    walletId: bot.walletId,
    wallet: bot.wallet,
    venueContext: bot.symbolGroup?.marketUniverse,
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

type LiveExecutionApiKey = {
  id: string;
  exchange: Exchange;
  apiKey: string;
  apiSecret: string;
};

export const resolveLiveExecutionApiKey = async (params: {
  userId: string;
  bot: Pick<LiveBotContext, 'exchange' | 'apiKeyId' | 'walletId'>;
}): Promise<LiveExecutionApiKey> => {
  if (params.bot.apiKeyId) {
    const botBoundApiKey = await prisma.apiKey.findFirst({
      where: { id: params.bot.apiKeyId, userId: params.userId },
      select: {
        id: true,
        exchange: true,
        apiKey: true,
        apiSecret: true,
      },
    });

    if (botBoundApiKey && botBoundApiKey.exchange === params.bot.exchange) {
      return botBoundApiKey;
    }
  }

  if (params.bot.walletId) {
    const walletBoundApiKey = await prisma.wallet.findFirst({
      where: {
        id: params.bot.walletId,
        userId: params.userId,
        exchange: params.bot.exchange,
        apiKeyId: { not: null },
      },
      select: {
        apiKey: {
          select: {
            id: true,
            exchange: true,
            apiKey: true,
            apiSecret: true,
          },
        },
      },
    });

    if (walletBoundApiKey?.apiKey && walletBoundApiKey.apiKey.exchange === params.bot.exchange) {
      return walletBoundApiKey.apiKey;
    }
  }

  throw orderErrors.liveApiKeyRequired();
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

const convergeLiveMarginAndLeverageIfNeeded = async (params: {
  connector: CcxtFuturesConnector;
  apiKeyId: string;
  symbol: string;
  targetLeverage: number | null;
}) => {
  if (!liveOrderingConfig.convergenceEnabled) return;
  if (params.targetLeverage == null && liveOrderingConfig.targetMarginMode == null) return;

  const cacheKey = getLiveConvergenceCacheKey({
    apiKeyId: params.apiKeyId,
    symbol: params.symbol,
    leverage: params.targetLeverage,
    marginMode: liveOrderingConfig.targetMarginMode,
  });
  const nowMs = Date.now();
  const cached = liveMarginLeverageConvergenceCache.get(cacheKey);
  if (cached && cached.expiresAtMs > nowMs) {
    return;
  }

  try {
    await params.connector.convergeFuturesLeverageAndMargin({
      symbol: params.symbol,
      leverage: params.targetLeverage,
      marginMode: liveOrderingConfig.targetMarginMode,
    });
    liveMarginLeverageConvergenceCache.set(cacheKey, {
      expiresAtMs: nowMs + liveOrderingConfig.convergenceCacheTtlMs,
    });
  } catch (error) {
    if (liveOrderingConfig.convergenceStrict) {
      throw orderErrors.livePretradeMarginLeverageConvergenceFailed();
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.warn(
      `[OrdersService] live_margin_leverage_convergence_failed symbol=${params.symbol} apiKey=${params.apiKeyId} error=${message}`
    );
  }
};

const executeLiveOrderOnExchange: OpenOrderDeps['executeLiveOrder'] = async (params) => {
  const apiKey = await resolveLiveExecutionApiKey({
    userId: params.userId,
    bot: {
      exchange: params.bot.exchange,
      apiKeyId: params.bot.apiKeyId,
      walletId: params.bot.walletId,
    },
  });

  const connector = createAuthenticatedExchangeConnector({
    exchange: apiKey.exchange,
    apiKey: apiKey.apiKey,
    apiSecret: apiKey.apiSecret,
    marketType: params.bot.marketType,
  });

  const liveAdapter = createLiveOrderAdapter(connector);
  try {
    const targetLeverage = await resolveLiveTargetLeverage({
      userId: params.userId,
      marketType: params.bot.marketType,
      payload: params.payload,
    });
    await enforceLivePretradeGuards({
      connector,
      apiKeyId: apiKey.id,
      exchange: apiKey.exchange,
      marketType: params.bot.marketType,
      payload: params.payload,
    });
    await convergeLiveMarginAndLeverageIfNeeded({
      connector,
      apiKeyId: apiKey.id,
      symbol: params.payload.symbol.toUpperCase(),
      targetLeverage,
    });

    const result = await liveAdapter.placeLiveOrderWithFees({
      order: {
        symbol: params.payload.symbol.toUpperCase(),
        side: params.payload.side === 'BUY' ? 'buy' : 'sell',
        type: mapLiveOrderType(params.payload.type),
        amount: params.payload.quantity,
        price: params.payload.price,
        positionMode: params.bot.positionMode,
      },
    });

    return {
      exchangeOrderId: result.exchangeOrderId,
      status: mapLiveOrderStatus(result.rawOrderStatus ?? result.status, params.payload.type),
      fee: result.fee,
      feeSource: result.feeSource,
      feePending: result.feePending,
      feeCurrency: result.feeCurrency,
      effectiveFeeRate: result.effectiveFeeRate,
      exchangeTradeId: result.exchangeTradeId,
      fills: result.fills,
    };
  } catch (error) {
    if (isAppErrorLike(error) && error.code.startsWith('LIVE_PRETRADE_')) {
      throw error;
    }
    throw orderErrors.liveExecutionFailed();
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
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

  const now = new Date();
  const updated = await prisma.order.update({
    where: { id: existing.id },
    data: {
      status: 'FILLED',
      filledQuantity: existing.quantity,
      filledAt: now,
    },
  });

  if (existing.positionId) {
    await prisma.position.updateMany({
      where: {
        id: existing.positionId,
        userId,
        status: 'OPEN',
      },
      data: {
        status: 'CLOSED',
        closedAt: now,
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
