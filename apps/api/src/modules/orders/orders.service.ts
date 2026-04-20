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
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from '../bots/runtimeSymbolCatalogResolver.service';
import { mapBotResponse } from '../bots/botResponseMapper.service';
import { liveOrderingConfig } from '../../config/runtimeExecution';
import { isAppErrorLike } from '../../lib/errors';
import { orderErrors } from './orders.errors';

type OpenOrderInput = OpenOrderDto & {
  positionId?: string | null;
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

type ManualOrderContextConnector = {
  getSymbolTradingRules: (symbol: string) => Promise<SymbolTradingRules>;
  fetchMarkPrice: (symbol: string) => Promise<number>;
  disconnect: () => Promise<void>;
};

type ManualOrderContextDeps = {
  createPublicConnector: (params: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
  }) => ManualOrderContextConnector;
};

type ResolvedManualOrderStrategyContext = {
  leverage: number | null;
  config: Record<string, unknown> | null;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const resolveOrderTypeFromStrategyConfig = (
  config: Record<string, unknown> | null
): OpenOrderDto['type'] | null => {
  const additional = asRecord(config?.additional);
  const raw = additional?.orderType;
  if (typeof raw !== 'string') return null;

  const normalized = raw.trim().toUpperCase();
  if (
    normalized === 'MARKET' ||
    normalized === 'LIMIT' ||
    normalized === 'STOP' ||
    normalized === 'STOP_LIMIT' ||
    normalized === 'TAKE_PROFIT' ||
    normalized === 'TRAILING'
  ) {
    return normalized as OpenOrderDto['type'];
  }

  return null;
};

const resolveMarginModeFromStrategyConfig = (
  config: Record<string, unknown> | null,
  marketType: 'FUTURES' | 'SPOT'
) => {
  if (marketType === 'SPOT') return 'NONE' as const;

  const additional = asRecord(config?.additional);
  const raw = typeof additional?.marginMode === 'string' ? additional.marginMode.trim().toUpperCase() : '';
  if (raw === 'ISOLATED') return 'ISOLATED' as const;
  return 'CROSSED' as const;
};

const resolvePrecisionStep = (amountPrecision: number | null): number | null => {
  if (!Number.isFinite(amountPrecision as number) || amountPrecision == null) return null;
  if (amountPrecision >= 1) return 1 / 10 ** Math.trunc(amountPrecision);
  if (amountPrecision > 0 && amountPrecision < 1) return amountPrecision;
  return null;
};

const normalizeAmountUpByPrecision = (value: number, amountPrecision: number | null) => {
  if (!Number.isFinite(value) || value <= 0) return value;
  if (amountPrecision == null || !Number.isFinite(amountPrecision)) return value;

  if (amountPrecision >= 1) {
    const decimals = Math.trunc(amountPrecision);
    const factor = 10 ** decimals;
    return Math.ceil((value - 1e-12) * factor) / factor;
  }

  if (amountPrecision > 0 && amountPrecision < 1) {
    const step = amountPrecision;
    const steps = Math.ceil((value - 1e-12) / step);
    return steps * step;
  }

  return value;
};

const normalizeAmountFixed = (value: number, amountPrecision: number | null) => {
  if (!Number.isFinite(value)) return value;
  if (amountPrecision == null || !Number.isFinite(amountPrecision)) return value;

  if (amountPrecision >= 1) {
    const decimals = Math.trunc(amountPrecision);
    return Number(value.toFixed(decimals));
  }

  if (amountPrecision > 0 && amountPrecision < 1) {
    const decimals = Math.max(0, Math.min(12, Math.ceil(-Math.log10(amountPrecision)) + 2));
    return Number(value.toFixed(decimals));
  }

  return value;
};

const computeMinExecutableQuantity = (params: {
  minAmount: number | null;
  minNotional: number | null;
  markPrice: number | null;
  amountPrecision: number | null;
}) => {
  const candidates: number[] = [];

  if (typeof params.minAmount === 'number' && Number.isFinite(params.minAmount) && params.minAmount > 0) {
    candidates.push(params.minAmount);
  }

  if (
    typeof params.minNotional === 'number' &&
    Number.isFinite(params.minNotional) &&
    params.minNotional > 0 &&
    typeof params.markPrice === 'number' &&
    Number.isFinite(params.markPrice) &&
    params.markPrice > 0
  ) {
    candidates.push(params.minNotional / params.markPrice);
  }

  if (candidates.length === 0) return null;

  const baseCandidate = Math.max(...candidates);
  let normalized = normalizeAmountUpByPrecision(baseCandidate, params.amountPrecision);

  if (!Number.isFinite(normalized) || normalized <= 0) return null;

  const step = resolvePrecisionStep(params.amountPrecision);
  if (
    step &&
    typeof params.minNotional === 'number' &&
    Number.isFinite(params.minNotional) &&
    params.minNotional > 0 &&
    typeof params.markPrice === 'number' &&
    Number.isFinite(params.markPrice) &&
    params.markPrice > 0
  ) {
    const maxIterations = 10_000;
    let iterations = 0;
    while (iterations < maxIterations && normalized * params.markPrice + 1e-9 < params.minNotional) {
      normalized += step;
      iterations += 1;
    }
  }

  return normalizeAmountFixed(normalized, params.amountPrecision);
};

const resolveManualOrderStrategyContext = async (params: {
  userId: string;
  botId: string;
  symbol: string;
}): Promise<ResolvedManualOrderStrategyContext | null> => {
  const normalizedSymbol = params.symbol.toUpperCase();
  const catalogSymbolsCache = new Map<string, string[]>();

  const groupLinks = await prisma.botMarketGroup.findMany({
    where: {
      userId: params.userId,
      botId: params.botId,
      isEnabled: true,
      lifecycleStatus: 'ACTIVE',
    },
    orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      symbolGroup: {
        select: {
          symbols: true,
          marketUniverse: {
            select: {
              exchange: true,
              marketType: true,
              baseCurrency: true,
              filterRules: true,
              whitelist: true,
              blacklist: true,
            },
          },
        },
      },
      strategyLinks: {
        where: { isEnabled: true },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
        select: {
          strategy: {
            select: {
              leverage: true,
              config: true,
            },
          },
        },
      },
    },
  });

  for (const group of groupLinks) {
    const symbols = await resolveEffectiveSymbolGroupSymbolsWithCatalog(
      group.symbolGroup,
      catalogSymbolsCache
    );
    if (!symbols.includes(normalizedSymbol)) continue;
    const selected = group.strategyLinks[0]?.strategy;
    if (selected) {
      return {
        leverage: selected.leverage,
        config: (selected.config as Record<string, unknown> | null | undefined) ?? null,
      };
    }
  }

  const legacyLinks = await prisma.botStrategy.findMany({
    where: {
      botId: params.botId,
      isEnabled: true,
      bot: { userId: params.userId },
    },
    orderBy: [{ createdAt: 'asc' }],
    select: {
      symbolGroup: {
        select: {
          symbols: true,
          marketUniverse: {
            select: {
              exchange: true,
              marketType: true,
              baseCurrency: true,
              filterRules: true,
              whitelist: true,
              blacklist: true,
            },
          },
        },
      },
      strategy: {
        select: {
          leverage: true,
          config: true,
        },
      },
    },
  });

  for (const link of legacyLinks) {
    const symbols = await resolveEffectiveSymbolGroupSymbolsWithCatalog(
      link.symbolGroup,
      catalogSymbolsCache
    );
    if (!symbols.includes(normalizedSymbol)) continue;
    return {
      leverage: link.strategy.leverage,
      config: (link.strategy.config as Record<string, unknown> | null | undefined) ?? null,
    };
  }

  const fallbackCanonical = groupLinks[0]?.strategyLinks[0]?.strategy;
  if (fallbackCanonical) {
    return {
      leverage: fallbackCanonical.leverage,
      config: (fallbackCanonical.config as Record<string, unknown> | null | undefined) ?? null,
    };
  }

  const fallbackLegacy = legacyLinks[0]?.strategy;
  if (fallbackLegacy) {
    return {
      leverage: fallbackLegacy.leverage,
      config: (fallbackLegacy.config as Record<string, unknown> | null | undefined) ?? null,
    };
  }

  return null;
};

type LiveBotContext = {
  id: string;
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  positionMode: 'ONE_WAY' | 'HEDGE';
  apiKeyId: string | null;
};

type CanonicalOrderBotContext = {
  id: string;
  mode: 'PAPER' | 'LIVE';
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  positionMode: 'ONE_WAY' | 'HEDGE';
  apiKeyId: string | null;
  walletId: string | null;
  strategyId: string | null;
  liveOptIn: boolean;
  isActive: boolean;
  consentTextVersion: string | null;
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

type SymbolTradingRules = {
  minAmount: number | null;
  minNotional: number | null;
  amountPrecision: number | null;
};

type CachedRules = {
  expiresAtMs: number;
  rules: SymbolTradingRules;
};

type CachedExposure = {
  expiresAtMs: number;
  hasOpenPosition: boolean;
};

const symbolRulesCache = new Map<string, CachedRules>();
const symbolExposureCache = new Map<string, CachedExposure>();
const liveMarginLeverageConvergenceCache = new Map<string, { expiresAtMs: number }>();

const getRulesCacheKey = (params: {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
}) => `${params.exchange}:${params.marketType}:${params.symbol.toUpperCase()}`;

const getExposureCacheKey = (params: {
  apiKeyId: string;
  symbol: string;
}) => `${params.apiKeyId}:${params.symbol.toUpperCase()}`;

const getLiveConvergenceCacheKey = (params: {
  apiKeyId: string;
  symbol: string;
  leverage: number | null;
  marginMode: 'cross' | 'isolated' | null;
}) =>
  `${params.apiKeyId}:${params.symbol.toUpperCase()}:${params.leverage ?? 'na'}:${params.marginMode ?? 'na'}`;

const normalizeAmountByPrecision = (value: number, precision: number | null) => {
  if (!Number.isFinite(value)) return value;
  if (precision == null || !Number.isFinite(precision)) return value;
  if (precision >= 1) {
    const factor = 10 ** Math.trunc(precision);
    return Math.round(value * factor) / factor;
  }
  if (precision > 0 && precision < 1) {
    const steps = Math.round(value / precision);
    return steps * precision;
  }
  return value;
};

const approxGreaterThan = (left: number, right: number, eps = 1e-12) => left - right > eps;
const approxLessThan = (left: number, right: number, eps = 1e-12) => right - left > eps;

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
      exchange: true,
      marketType: true,
      positionMode: true,
      apiKeyId: true,
      walletId: true,
      liveOptIn: true,
      isActive: true,
      consentTextVersion: true,
      botStrategies: {
        select: {
          strategyId: true,
          isEnabled: true,
          createdAt: true,
        },
      },
      marketGroupStrategyLinks: {
        select: {
          strategyId: true,
          isEnabled: true,
          priority: true,
          createdAt: true,
          botMarketGroup: {
            select: {
              isEnabled: true,
              lifecycleStatus: true,
              executionOrder: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });
  if (!bot) {
    throw orderErrors.botContextNotFound();
  }

  const botWithCanonicalStrategy = mapBotResponse(bot);
  const resolvedStrategyId = botWithCanonicalStrategy.strategyId ?? null;
  const botContext: CanonicalOrderBotContext = {
    id: bot.id,
    mode: bot.mode,
    exchange: bot.exchange,
    marketType: bot.marketType,
    positionMode: bot.positionMode,
    apiKeyId: bot.apiKeyId,
    walletId: bot.walletId,
    strategyId: resolvedStrategyId,
    liveOptIn: bot.liveOptIn,
    isActive: bot.isActive,
    consentTextVersion: bot.consentTextVersion,
  };

  return {
    payload: {
      ...payload,
      botId: botContext.id,
      mode: botContext.mode,
      walletId: botContext.walletId ?? undefined,
      strategyId: botContext.strategyId ?? undefined,
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

  return {
    id: botContext.id,
    exchange: botContext.exchange,
    marketType: botContext.marketType,
    positionMode: botContext.positionMode,
    apiKeyId: botContext.apiKeyId,
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
  bot: Pick<LiveBotContext, 'exchange' | 'apiKeyId'>;
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

  const fallbackApiKey = await prisma.apiKey.findFirst({
    where: {
      userId: params.userId,
      exchange: params.bot.exchange,
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      exchange: true,
      apiKey: true,
      apiSecret: true,
    },
  });

  if (!fallbackApiKey) {
    throw orderErrors.liveApiKeyRequired();
  }

  return fallbackApiKey;
};

const getSymbolTradingRulesCached = async (params: {
  connector: CcxtFuturesConnector;
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
}) => {
  const cacheKey = getRulesCacheKey({
    exchange: params.exchange,
    marketType: params.marketType,
    symbol: params.symbol,
  });
  const nowMs = Date.now();
  const cached = symbolRulesCache.get(cacheKey);
  if (cached && cached.expiresAtMs > nowMs) {
    return cached.rules;
  }

  const rules = await params.connector.getSymbolTradingRules(params.symbol);
  symbolRulesCache.set(cacheKey, {
    expiresAtMs: nowMs + liveOrderingConfig.rulesCacheTtlMs,
    rules,
  });
  return rules;
};

const hasOpenExposureCached = async (params: {
  connector: CcxtFuturesConnector;
  apiKeyId: string;
  symbol: string;
}) => {
  const cacheKey = getExposureCacheKey({
    apiKeyId: params.apiKeyId,
    symbol: params.symbol,
  });
  const nowMs = Date.now();
  const cached = symbolExposureCache.get(cacheKey);
  if (cached && cached.expiresAtMs > nowMs) {
    return cached.hasOpenPosition;
  }

  const hasOpenPosition = await params.connector.hasOpenPosition(params.symbol);
  symbolExposureCache.set(cacheKey, {
    expiresAtMs: nowMs + liveOrderingConfig.exposureCacheTtlMs,
    hasOpenPosition,
  });
  return hasOpenPosition;
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

const defaultManualOrderContextDeps: ManualOrderContextDeps = {
  createPublicConnector: ({ exchange, marketType }) =>
    new CcxtFuturesConnector({
      exchangeId: exchange.toLowerCase(),
      marketType: marketType === 'SPOT' ? 'spot' : 'future',
    }),
};

export const getManualOrderContext = async (
  userId: string,
  query: ManualOrderContextQuery,
  deps: ManualOrderContextDeps = defaultManualOrderContextDeps
) => {
  const bot = await prisma.bot.findFirst({
    where: { id: query.botId, userId },
    select: {
      id: true,
      mode: true,
      exchange: true,
      marketType: true,
      maxOpenPositions: true,
    },
  });

  if (!bot) return null;

  const normalizedSymbol = query.symbol.toUpperCase();
  const strategyContext = await resolveManualOrderStrategyContext({
    userId,
    botId: bot.id,
    symbol: normalizedSymbol,
  });
  const resolvedLeverage =
    bot.marketType === 'SPOT' ? 1 : Math.max(1, Math.floor(strategyContext?.leverage ?? 1));
  const resolvedOrderType = resolveOrderTypeFromStrategyConfig(strategyContext?.config ?? null) ?? 'MARKET';
  const resolvedMarginMode = resolveMarginModeFromStrategyConfig(strategyContext?.config ?? null, bot.marketType);

  let rules: SymbolTradingRules = {
    minAmount: null,
    minNotional: null,
    amountPrecision: null,
  };
  let markPrice: number | null = null;

  // E2E should stay deterministic in CI/local without external exchange availability.
  const shouldSkipExternalFetch =
    process.env.NODE_ENV === 'test' && deps === defaultManualOrderContextDeps;
  if (!shouldSkipExternalFetch) {
    const connector = deps.createPublicConnector({
      exchange: bot.exchange,
      marketType: bot.marketType,
    });
    try {
      const [rulesResult, markPriceResult] = await Promise.allSettled([
        connector.getSymbolTradingRules(normalizedSymbol),
        connector.fetchMarkPrice(normalizedSymbol),
      ]);

      if (rulesResult.status === 'fulfilled') {
        rules = rulesResult.value;
      }
      if (markPriceResult.status === 'fulfilled' && Number.isFinite(markPriceResult.value)) {
        markPrice = markPriceResult.value;
      }
    } finally {
      await connector.disconnect().catch(() => undefined);
    }
  }

  const minExecutableQty = computeMinExecutableQuantity({
    minAmount: rules.minAmount,
    minNotional: rules.minNotional,
    markPrice,
    amountPrecision: rules.amountPrecision,
  });

  const requestedQuantity =
    typeof query.quantity === 'number' && Number.isFinite(query.quantity) && query.quantity > 0
      ? query.quantity
      : null;
  const estimatedNotional =
    requestedQuantity != null && markPrice != null
      ? normalizeAmountFixed(requestedQuantity * markPrice, rules.amountPrecision)
      : null;
  const estimatedMargin =
    estimatedNotional != null ? estimatedNotional / Math.max(1, resolvedLeverage) : null;

  return {
    botId: bot.id,
    symbol: normalizedSymbol,
    mode: bot.mode,
    orderType: resolvedOrderType,
    marginMode: resolvedMarginMode,
    leverage: resolvedLeverage,
    priceReference: {
      markPrice,
      source: markPrice != null ? 'exchange_mark' : 'unavailable',
    },
    quantityConstraints: {
      minAmount: rules.minAmount,
      amountPrecision: rules.amountPrecision,
      minNotional: rules.minNotional,
      minExecutableQty,
    },
    sideAwarePreview: {
      side: query.side,
      requestedQuantity,
      estimatedNotional,
      estimatedMargin,
      maxOpenPositions: bot.maxOpenPositions,
    },
  };
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

const enforceLivePretradeGuards = async (params: {
  connector: CcxtFuturesConnector;
  apiKeyId: string;
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  payload: OpenOrderInput;
}) => {
  const normalizedSymbol = params.payload.symbol.toUpperCase();
  const quantity = Number(params.payload.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw orderErrors.livePretradeInvalidQuantity();
  }

  const hasExposure = await hasOpenExposureCached({
    connector: params.connector,
    apiKeyId: params.apiKeyId,
    symbol: normalizedSymbol,
  });
  if (hasExposure) {
    throw orderErrors.livePretradeExternalPositionOpen();
  }

  const rules = await getSymbolTradingRulesCached({
    connector: params.connector,
    exchange: params.exchange,
    marketType: params.marketType,
    symbol: normalizedSymbol,
  });

  if (typeof rules.minAmount === 'number' && approxLessThan(quantity, rules.minAmount)) {
    throw orderErrors.livePretradeAmountBelowMin();
  }

  const normalizedByPrecision = normalizeAmountByPrecision(quantity, rules.amountPrecision);
  if (Number.isFinite(normalizedByPrecision) && approxGreaterThan(Math.abs(quantity - normalizedByPrecision), 1e-12)) {
    throw orderErrors.livePretradeAmountPrecision();
  }

  if (typeof rules.minNotional === 'number') {
    let priceForNotional: number | null = null;
    if (typeof params.payload.price === 'number' && Number.isFinite(params.payload.price)) {
      priceForNotional = params.payload.price;
    } else {
      priceForNotional = await params.connector.fetchMarkPrice(normalizedSymbol).catch(() => null);
    }
    if (typeof priceForNotional === 'number' && Number.isFinite(priceForNotional)) {
      const notional = quantity * priceForNotional;
      if (approxLessThan(notional, rules.minNotional)) {
        throw orderErrors.livePretradeNotionalBelowMin();
      }
    }
  }
};

const executeLiveOrderOnExchange: OpenOrderDeps['executeLiveOrder'] = async (params) => {
  const apiKey = await resolveLiveExecutionApiKey({
    userId: params.userId,
    bot: {
      exchange: params.bot.exchange,
      apiKeyId: params.bot.apiKeyId,
    },
  });

  const connector = new CcxtFuturesConnector({
    exchangeId: apiKey.exchange.toLowerCase(),
    apiKey: decrypt(apiKey.apiKey),
    secret: decrypt(apiKey.apiSecret),
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

type ApplyOrderFillLifecycleInput = {
  userId: string;
  orderId: string;
  fillPrice: number | null;
  fillQuantity: number | null;
  filledAt?: Date;
  leverage?: number | null;
};

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
      typeof params.fillPrice === 'number' && Number.isFinite(params.fillPrice) && params.fillPrice > 0
        ? params.fillPrice
        : existingOrder.averageFillPrice ?? existingOrder.price ?? null;

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

    if (fillStatus !== 'FILLED') {
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
        entryPrice:
          typeof fillPrice === 'number' && Number.isFinite(fillPrice) && fillPrice > 0
            ? fillPrice
            : 0,
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

  const order = await prisma.order.create({
    data: {
      userId,
      botId: canonicalPayload.botId,
      walletId: canonicalPayload.walletId,
      strategyId: canonicalPayload.strategyId,
      positionId: canonicalPayload.positionId ?? null,
      origin: 'USER',
      symbol: canonicalPayload.symbol.toUpperCase(),
      side: canonicalPayload.side,
      type: canonicalPayload.type,
      status,
      quantity: canonicalPayload.quantity,
      filledQuantity: status === 'FILLED' ? canonicalPayload.quantity : 0,
      price: canonicalPayload.price,
      fee,
      feeSource,
      feePending,
      feeCurrency,
      effectiveFeeRate,
      exchangeOrderId,
      exchangeTradeId,
      submittedAt: now,
      filledAt: status === 'FILLED' ? now : null,
    },
  });

  const filledQuantityFromExchange =
    fills.length > 0
      ? fills.reduce((sum, fill) => {
          const quantity = Number(fill.quantity);
          return Number.isFinite(quantity) ? sum + Math.max(0, quantity) : sum;
        }, 0)
      : null;
  const fillPriceFromExchange =
    fills.find((fill) => Number.isFinite(fill.price) && fill.price > 0)?.price ?? canonicalPayload.price ?? null;

  const lifecycleResult =
    order.status === 'FILLED'
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
