import { Exchange, OrderStatus, PositionSide, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { initializeNewLiveBotPositionState } from '../engine/runtimePositionOpeningState.service';
import {
  CancelOrderDto,
  CloseOrderDto,
  ListOrdersQuery,
  ManualOrderContextQuery,
  OpenOrderDto,
} from './orders.types';
import { ExchangeOrderFill } from '../exchange/exchangeData.types';
import { createPublicExchangeConnector } from '../exchange/exchangeConnectorFactory.service';
import { orderErrors } from './orders.errors';
import {
  getManualOrderContext as getManualOrderContextService,
  resolveManualOrderStrategyContext,
  type ManualOrderContextDeps,
} from './orders.manualContext.service';
import { applyOrderFillLifecycle } from './orders.lifecycle.service';
import {
  createOrderForLiveIntent,
  executeDurableLiveOrder,
  materializeLiveOrderInTransaction,
  type LiveBotContext,
  type LiveExecutionResult,
  type LiveOrderPayload,
} from './orders.liveIntent.service';
import { resolveOpenPositionScopeWhere } from './orders.positionScope';
import {
  resolveCanonicalRuntimeVenueContext,
  resolveInheritedRuntimeExecutionContext,
} from '../engine/runtimeBotExecutionContext';
import {
  cancelLiveOrderThroughBoundary,
  lookupLiveOrderThroughBoundary,
  resolveLiveExecutionApiKey,
  submitLiveOrderThroughBoundary,
  type LiveExecutionCredentialBinding,
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
import { assertSubscriptionAllowsLiveTrading } from '../subscriptions/subscriptionEntitlements.service';
import { resolveOpenOrderPersistenceDecision, resolvePersistedLiveOrderFill } from './orders.persistenceDecision';
import { writeOrderAudit } from './orders.audit';
import { assertExistingEntryOrderContractUnit, assertPreparedGateEntryContractUnit, defaultResolveGateEntryContractSize, resolveEntryContractUnit, type GateEntryContractEvidence } from './orders.quantityRules';
import { isMatchingGateFuturesEconomics } from '../exchange/gateFuturesEconomics';
export { resolveLiveExecutionApiKey } from '../exchange/exchangeAdapterBoundary.service';
export { resolveOpenOrderPersistenceDecision, resolvePersistedLiveOrderFill } from './orders.persistenceDecision';

type OpenOrderInput = LiveOrderPayload;

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

type OpenOrderDeps = {
  executeLiveOrder: (params: {
    userId: string;
    bot: LiveBotContext;
    payload: OpenOrderInput;
    credentialBinding?: LiveExecutionCredentialBinding | null;
  }) => Promise<LiveExecutionResult>;
  lookupLiveOrder?: (params: {
    userId: string;
    bot: LiveBotContext;
    payload: OpenOrderInput;
    credentialBinding?: LiveExecutionCredentialBinding | null;
  }) => Promise<LiveExecutionResult>;
  manualOrderContextDeps?: ManualOrderContextDeps;
  resolveGateEntryContractSize?: (symbol: string) => Promise<GateEntryContractEvidence>;
};

type CancelOrderDeps = {
  cancelLiveOrder: typeof cancelLiveOrderThroughBoundary;
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
    credentialBinding: params.credentialBinding,
    bot: params.bot,
    order: {
      symbol: params.payload.symbol,
      side: params.payload.side,
      type: resolveSupportedLiveOrderType(params.payload.type),
      quantity: params.payload.quantity,
      price: params.payload.price,
      strategyId: params.payload.strategyId,
      reduceOnly: params.payload.reduceOnly,
      contractSize: params.payload.contractSize,
      ...(params.payload.clientOrderId ? { clientOrderId: params.payload.clientOrderId } : {}),
    },
    targetLeverage,
  });
};

const lookupLiveOrderOnExchange: NonNullable<OpenOrderDeps['lookupLiveOrder']> = async (params) =>
  lookupLiveOrderThroughBoundary({
    userId: params.userId,
    credentialBinding: params.credentialBinding,
    bot: params.bot,
    order: {
      symbol: params.payload.symbol,
      side: params.payload.side,
      type: resolveSupportedLiveOrderType(params.payload.type),
      quantity: params.payload.quantity,
      price: params.payload.price,
      reduceOnly: params.payload.reduceOnly,
      clientOrderId: params.payload.clientOrderId ?? undefined,
    },
    targetLeverage: null,
  });

const defaultOpenOrderDeps: OpenOrderDeps = {
  executeLiveOrder: executeLiveOrderOnExchange,
  lookupLiveOrder: lookupLiveOrderOnExchange,
};

const defaultCancelOrderDeps: CancelOrderDeps = {
  cancelLiveOrder: cancelLiveOrderThroughBoundary,
};

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const resolvePaperImmediateFillPrice = async (params: {
  userId: string;
  payload: OpenOrderInput;
  manualOrderContextDeps: ManualOrderContextDeps;
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
    params.manualOrderContextDeps
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
      contractSize: true,
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
  contractSize?: number;
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
      contractSize: true,
    },
    orderBy: {
      openedAt: 'desc',
    },
  });

  if (existingOpenPosition && existingOpenPosition.side !== requestedSide) {
    throw orderErrors.openPositionSideConflict();
  }
  if (existingOpenPosition && params.contractSize != null &&
      existingOpenPosition.contractSize !== params.contractSize) {
    throw orderErrors.openPositionContractUnitMismatch();
  }

  const ownedImportedPosition = await findOwnedLiveImportedOpenPositionForOrderConflict(params);
  if (ownedImportedPosition && ownedImportedPosition.side !== requestedSide) {
    throw orderErrors.openPositionSideConflict();
  }
  if (ownedImportedPosition && params.contractSize != null &&
      ownedImportedPosition.contractSize !== params.contractSize) {
    throw orderErrors.openPositionContractUnitMismatch();
  }
};

const hasExchangeOrderIdentity = (exchangeOrderId: string | null | undefined) =>
  typeof exchangeOrderId === 'string' && exchangeOrderId.trim().length > 0;

const resolveExchangeCancelContext = (order: {
  walletId: string | null;
  wallet?: {
    id: string;
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    apiKeyId: string | null;
  } | null;
  bot?: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    apiKeyId: string | null;
    walletId: string | null;
    wallet?: {
      id: string;
      exchange: Exchange;
      marketType: 'FUTURES' | 'SPOT';
      apiKeyId: string | null;
    } | null;
  } | null;
}) => {
  const wallet = order.wallet ?? order.bot?.wallet ?? null;
  const exchange = wallet?.exchange ?? order.bot?.exchange ?? null;
  if (!exchange) return null;

  return {
    exchange,
    marketType: wallet?.marketType ?? order.bot?.marketType ?? 'FUTURES',
    apiKeyId: order.bot?.apiKeyId ?? wallet?.apiKeyId ?? null,
    walletId: wallet?.id ?? order.walletId ?? order.bot?.walletId ?? null,
  };
};

// Shared read-only domain gate for human orders and delegated preparation.
// Its checks must run before a delegated admission; they are not submit authority.
export const prepareOpenOrderRiskContext = async (userId: string, payload: OpenOrderInput,
  resolveGateEntryContractSize: (symbol: string) => Promise<GateEntryContractEvidence> = defaultResolveGateEntryContractSize,
  internalMockPermit?: unknown,
) => {
  const resolved = await resolveCanonicalBotContext(userId, payload);
  let canonicalPayload = resolved.payload;
  const { botContext } = resolved;
  const { isGateFuturesEntry, contractSize, gateFuturesEconomics, hasExistingIntent } = await resolveEntryContractUnit({
    userId, payload: canonicalPayload, botVenue: botContext?.inheritedExecutionContext ?? null,
    resolveGateEntryContractSize, internalMockPermit });
  if (contractSize != null) canonicalPayload = { ...canonicalPayload, contractSize };
  if (gateFuturesEconomics) canonicalPayload = { ...canonicalPayload, gateFuturesEconomics };
  if (canonicalPayload.gateFuturesEconomics && !isMatchingGateFuturesEconomics(
    canonicalPayload.gateFuturesEconomics, contractSize ?? NaN, canonicalPayload.symbol)) {
    throw orderErrors.entryContractUnitUnavailable();
  }
  if (isGateFuturesEntry && !hasExistingIntent)
    await assertExistingEntryOrderContractUnit(userId, canonicalPayload, contractSize!);
  await assertNoImplicitReverseOpenConflict({
    userId,
    payload: canonicalPayload,
    botContext,
    ...(isGateFuturesEntry ? { contractSize } : {}),
  });
  const liveBot = ensureLiveOrderAllowed(canonicalPayload, botContext);
  if (canonicalPayload.mode === 'LIVE') {
    await assertSubscriptionAllowsLiveTrading(userId);
  }
  return { canonicalPayload, liveBot };
};

type AdmittedMockLiveResult = { intentId: string; liveResult: LiveExecutionResult };

const persistPreparedOpenOrder = async (
  userId: string,
  initialPayload: OpenOrderInput,
  liveBot: LiveBotContext | null,
  deps: OpenOrderDeps,
  admittedMock?: AdmittedMockLiveResult,
) => {
  let canonicalPayload = initialPayload;
  assertPreparedGateEntryContractUnit(canonicalPayload, liveBot);

  const now = new Date();
  let exchangeOrderId: string | null = null;
  let exchangeTradeId: string | null = null;
  let status: 'OPEN' | 'FILLED' = canonicalPayload.type === 'MARKET' ? 'FILLED' : 'OPEN';
  let fee: number | null = null;
  let feeSource: 'ESTIMATED' | 'EXCHANGE_FILL' = 'ESTIMATED';
  let feePending = canonicalPayload.mode === 'LIVE';
  let feeCurrency: string | null = null;
  let effectiveFeeRate: number | null = null;
  let fills: ExchangeOrderFill[] = [];
  let exchangeFilledQuantityFromSnapshot: number | null = null;
  let exchangeAverageFillPrice: number | null = null;
  let liveIntentId: string | null = null;

  if (admittedMock || (canonicalPayload.mode === 'LIVE' && process.env.NODE_ENV !== 'test')) {
    if (!liveBot) {
      throw orderErrors.liveBotNotFound();
    }
    let liveResult: LiveExecutionResult;
    if (admittedMock) {
      liveIntentId = admittedMock.intentId;
      liveResult = admittedMock.liveResult;
    } else {
      const durable = await executeDurableLiveOrder({
        userId,
        bot: liveBot,
        payload: canonicalPayload,
        execute: deps.executeLiveOrder,
        lookup: deps.lookupLiveOrder ?? lookupLiveOrderOnExchange,
      });
      if (durable.existingOrder) return durable.existingOrder;
      canonicalPayload = durable.payload;
      liveIntentId = durable.intentId;
      liveResult = durable.liveResult;
    }
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
    exchangeFilledQuantityFromSnapshot =
      typeof liveResult.exchangeFilledQuantity === 'number' ? liveResult.exchangeFilledQuantity : null;
    exchangeAverageFillPrice =
      typeof liveResult.exchangeAverageFillPrice === 'number' ? liveResult.exchangeAverageFillPrice : null;
  }

  const filledQuantityFromExchange =
    fills.length > 0
      ? fills.reduce((sum, fill) => {
          const quantity = Number(fill.quantity);
          return Number.isFinite(quantity) ? sum + Math.max(0, quantity) : sum;
        }, 0)
      : exchangeFilledQuantityFromSnapshot;
  if (liveIntentId && status === 'FILLED') {
    const quantityMatchesRequest = (quantity: number) =>
      Math.abs(quantity - canonicalPayload.quantity) <=
      1e-9 * Math.max(1, Math.abs(quantity), Math.abs(canonicalPayload.quantity));
    if (
      (filledQuantityFromExchange != null && !quantityMatchesRequest(filledQuantityFromExchange)) ||
      (exchangeFilledQuantityFromSnapshot != null &&
        !quantityMatchesRequest(exchangeFilledQuantityFromSnapshot))
    ) {
      throw orderErrors.liveExecutionUnknown({
        orderId: liveIntentId,
        clientOrderId: canonicalPayload.clientOrderId ?? '',
      });
    }
  }
  const resolvedPaperFillPrice =
    canonicalPayload.mode === 'PAPER' && status === 'FILLED'
      ? await resolvePaperImmediateFillPrice({
          userId,
          payload: canonicalPayload,
          manualOrderContextDeps: deps.manualOrderContextDeps ?? defaultManualOrderContextDeps,
        })
      : null;
  const fillPriceFromExchange =
    fills.find((fill) => Number.isFinite(fill.price) && fill.price > 0)?.price ??
    (isPositiveFiniteNumber(exchangeAverageFillPrice) ? exchangeAverageFillPrice : null) ??
    resolvedPaperFillPrice ??
    (canonicalPayload.mode === 'PAPER' && isPositiveFiniteNumber(canonicalPayload.price)
      ? canonicalPayload.price
      : null);
  if (
    canonicalPayload.mode === 'PAPER' &&
    canonicalPayload.type === 'MARKET' &&
    !isPositiveFiniteNumber(fillPriceFromExchange)
  ) {
    throw orderErrors.paperMarketPriceUnavailable();
  }
  const liveFillResolution =
    canonicalPayload.mode === 'LIVE'
      ? resolvePersistedLiveOrderFill({
          requestedQuantity: canonicalPayload.quantity,
          liveStatus: status,
          exchangeFilledQuantity: filledQuantityFromExchange,
        })
      : null;
  const orderPersistenceDecision = resolveOpenOrderPersistenceDecision({
    mode: canonicalPayload.mode,
    requestedQuantity: canonicalPayload.quantity,
    status,
    fillPriceResolved: isPositiveFiniteNumber(fillPriceFromExchange),
    liveFillResolution,
  });

  const orderData: Prisma.OrderUncheckedCreateInput = {
      ...(liveIntentId ? { id: liveIntentId } : {}),
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
      status: orderPersistenceDecision.persistedStatus,
      quantity: canonicalPayload.quantity,
      contractSize: canonicalPayload.contractSize ?? null,
      gateFuturesEconomics: canonicalPayload.gateFuturesEconomics ?? Prisma.JsonNull,
      filledQuantity: orderPersistenceDecision.persistedFilledQuantity,
      price: canonicalPayload.price,
      fee,
      feeSource,
      feePending,
      feeCurrency,
      effectiveFeeRate,
      exchangeOrderId,
      exchangeTradeId,
      submittedAt: now,
      filledAt: orderPersistenceDecision.persistedStatus === 'FILLED' ? now : null,
  };
  let newlyCreatedLivePositionId: string | null = null;
  const persisted = await createOrderForLiveIntent({
    userId,
    exchangeOrderId,
    intentId: liveIntentId,
    clientOrderId: canonicalPayload.clientOrderId,
    data: orderData,
    materialize: liveIntentId ? (tx, order) => materializeLiveOrderInTransaction({
      tx, order, userId, payload: canonicalPayload,
      fillPrice: fillPriceFromExchange,
      fillQuantity: orderPersistenceDecision.lifecycleFillQuantity,
      applyFillLifecycle: orderPersistenceDecision.shouldApplyImmediateFillLifecycle,
      fills, now,
      onNewPositionCreated: (positionId) => { newlyCreatedLivePositionId = positionId; },
    }) : undefined,
  });
  if (persisted.reused) return persisted.order;
  if (newlyCreatedLivePositionId && canonicalPayload.origin === 'BOT' && canonicalPayload.botId &&
      !await initializeNewLiveBotPositionState({ userId, positionId: newlyCreatedLivePositionId })) {
    throw new Error('RUNTIME_STATE_SYNC_PENDING');
  }
  const order = persisted.order;

  const lifecycleResult =
    canonicalPayload.mode === 'PAPER' && orderPersistenceDecision.shouldApplyImmediateFillLifecycle
      ? await applyOrderFillLifecycle({
          userId,
          orderId: order.id,
          mode: canonicalPayload.mode,
          fillPrice: fillPriceFromExchange,
          fillQuantity: orderPersistenceDecision.lifecycleFillQuantity,
          filledAt: now,
        })
      : null;
  const orderAfterLifecycle = lifecycleResult?.order ?? order;

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

export const openOrder = async (
  userId: string,
  payload: OpenOrderInput,
  deps: OpenOrderDeps = defaultOpenOrderDeps
) => {
  const prepared = await prepareOpenOrderRiskContext(userId, payload,
    deps.resolveGateEntryContractSize ?? defaultResolveGateEntryContractSize);
  return persistPreparedOpenOrder(userId, prepared.canonicalPayload, prepared.liveBot, deps);
};

// Only the internal _test executor supplies this already admitted result. The
// common persistence path above still owns Order/fill/position materialization.
export const materializeAdmittedMockLiveOrder = async (input: {
  userId: string; bot: LiveBotContext; payload: LiveOrderPayload;
  intentId: string; liveResult: LiveExecutionResult;
}) => {
  let databaseName = '';
  try { databaseName = decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname); } catch { /* fail closed */ }
  if (process.env.NODE_ENV !== 'test' || !databaseName.endsWith('_test') ||
      input.payload.mode !== 'LIVE' ||
      !input.liveResult.exchangeOrderId || input.liveResult.status !== 'FILLED') {
    throw orderErrors.liveExecutionUnknown({
      orderId: input.intentId, clientOrderId: input.payload.clientOrderId ?? '',
    });
  }
  return persistPreparedOpenOrder(input.userId, input.payload, input.bot,
    defaultOpenOrderDeps, { intentId: input.intentId, liveResult: input.liveResult });
};

export const cancelOrder = async (
  userId: string,
  id: string,
  payload: CancelOrderDto,
  deps: CancelOrderDeps = defaultCancelOrderDeps
) => {
  const existing = await prisma.order.findFirst({
    where: { id, userId },
    include: {
      wallet: {
        select: {
          id: true,
          exchange: true,
          marketType: true,
          apiKeyId: true,
        },
      },
      bot: {
        select: {
          exchange: true,
          marketType: true,
          apiKeyId: true,
          walletId: true,
          wallet: {
            select: {
              id: true,
              exchange: true,
              marketType: true,
              apiKeyId: true,
            },
          },
        },
      },
    },
  });
  if (!existing) return null;

  if (!payload.riskAck) {
    throw orderErrors.orderCancelRiskAckRequired();
  }

  if (existing.status === 'CANCELED' || existing.status === 'FILLED') {
    throw orderErrors.orderNotCancelable();
  }
  if (existing.syncState !== 'IN_SYNC') {
    throw orderErrors.orderNotCancelable();
  }
  if (hasExchangeOrderIdentity(existing.exchangeOrderId)) {
    await assertSubscriptionAllowsLiveTrading(userId);
    const cancelContext = resolveExchangeCancelContext(existing);
    if (!cancelContext || !existing.exchangeOrderId) {
      throw orderErrors.liveOrderCancelUnsupported();
    }
    await deps.cancelLiveOrder({
      userId,
      bot: cancelContext,
      order: {
        symbol: existing.symbol,
        exchangeOrderId: existing.exchangeOrderId,
      },
    });
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
      exchangeOrderId: existing.exchangeOrderId,
      exchangeCancel: hasExchangeOrderIdentity(existing.exchangeOrderId),
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
  if (hasExchangeOrderIdentity(existing.exchangeOrderId)) {
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
