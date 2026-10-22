import { Exchange, Prisma } from '@prisma/client';

import { liveOrderingConfig } from '../../config/runtimeExecution';
import { prisma } from '../../prisma/client';
import { createPublicExchangeConnector } from '../exchange/exchangeConnectorFactory.service';
import { orderErrors } from './orders.errors';
import { assertExistingGateLinkedOrderContractUnit, canReplayClosedGatePosition,
  resolveVerifiedGateLinkedPositionUnit } from './orders.positionScope';
import { resolveLiveClientOrderId, type LiveBotContext,
  type LiveOrderPayload } from './orders.liveIntent.service';

export const defaultResolveGateEntryContractSize = async (symbol: string): Promise<number | null> => {
  const connector = createPublicExchangeConnector({ exchange: 'GATEIO', marketType: 'FUTURES' });
  try {
    return (await connector.getSymbolTradingRules(symbol)).contractSize ?? null;
  } catch {
    return null;
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const resolveEntryContractUnit = async (params: {
  userId: string;
  payload: LiveOrderPayload;
  botVenue: Pick<LiveBotContext, 'exchange' | 'marketType'> | null;
  resolveGateEntryContractSize: (symbol: string) => Promise<number | null>;
}) => {
  const walletVenue = !params.botVenue && params.payload.walletId
    ? await prisma.wallet.findFirst({ where: { id: params.payload.walletId, userId: params.userId },
        select: { exchange: true, marketType: true } }) : null;
  const venue = params.botVenue ?? walletVenue;
  if (venue?.exchange !== 'GATEIO' || venue.marketType !== 'FUTURES') {
    return { isGateFuturesEntry: false, contractSize: undefined } as const;
  }
  if (params.payload.reduceOnly === true && !params.payload.positionId) {
    throw orderErrors.reduceOnlyPositionRequired();
  }
  const clientOrderId = params.payload.mode === 'LIVE' && params.payload.clientOrderId
    ? resolveLiveClientOrderId(params.payload.clientOrderId, 'GATEIO') : null;
  const intent = clientOrderId ? await prisma.liveOrderIntent.findUnique({
    where: { clientOrderId }, select: { payload: true },
  }) : null;
  const intentPayload = intent?.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as Record<string, unknown> : null;
  if (params.payload.positionId) {
    const allowClosedReplay = await canReplayClosedGatePosition({ db: prisma,
      userId: params.userId, clientOrderId, positionId: params.payload.positionId });
    const contractSize = await resolveVerifiedGateLinkedPositionUnit({
      db: prisma, userId: params.userId, positionId: params.payload.positionId,
      botId: params.payload.botId ?? null, walletId: params.payload.walletId ?? null,
      mode: params.payload.mode, symbol: params.payload.symbol, side: params.payload.side,
      quantity: params.payload.quantity, reduceOnly: params.payload.reduceOnly === true,
      allowClosedReplay,
    });
    if (intent && intentPayload?.contractSize !== contractSize) {
      throw orderErrors.gatePositionUnitUnsafe();
    }
    if (!intent) await assertExistingGateLinkedOrderContractUnit({ db: prisma,
      userId: params.userId, botId: params.payload.botId ?? null,
      positionId: params.payload.positionId, symbol: params.payload.symbol,
      contractSize });
    return { isGateFuturesEntry: false, contractSize } as const;
  }
  const observed = intent ? intentPayload?.contractSize
    : await params.resolveGateEntryContractSize(params.payload.symbol);
  if (typeof observed !== 'number' || !Number.isFinite(observed) || observed <= 0) {
    throw orderErrors.entryContractUnitUnavailable();
  }
  if (observed !== 1) throw orderErrors.entryNonunitContractUnsupported();
  return { isGateFuturesEntry: true, contractSize: observed } as const;
};

export const assertPreparedGateEntryContractUnit = (
  payload: LiveOrderPayload, bot: LiveBotContext | null,
) => {
  if (payload.contractSize != null &&
      (typeof payload.contractSize !== 'number' || !Number.isFinite(payload.contractSize) ||
        payload.contractSize <= 0)) throw orderErrors.entryContractUnitUnavailable();
  if (bot?.exchange === 'GATEIO' && bot.marketType === 'FUTURES') {
    if (payload.reduceOnly === true && !payload.positionId) throw orderErrors.reduceOnlyPositionRequired();
    if (payload.contractSize == null) throw payload.positionId
      ? orderErrors.gatePositionUnitUnsafe() : orderErrors.entryContractUnitUnavailable();
    if (payload.contractSize !== 1) throw payload.positionId
      ? orderErrors.gatePositionUnitUnsafe() : orderErrors.entryNonunitContractUnsupported();
  }
};

export const assertExistingEntryOrderContractUnit = async (
  userId: string, payload: LiveOrderPayload, contractSize: number,
) => {
  const where: Prisma.OrderWhereInput = {
    userId, symbol: payload.symbol.toUpperCase(),
    status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'] },
    ...(payload.botId ? { botId: payload.botId }
      : payload.walletId ? { walletId: payload.walletId } : { botId: null, walletId: null }),
  };
  const existing = await prisma.order.findFirst({
    where: { ...where, OR: [{ contractSize: null }, { contractSize: { not: contractSize } }] },
    select: { id: true },
  });
  if (existing) {
    throw orderErrors.openOrderContractUnitMismatch();
  }
};

type SymbolTradingRules = {
  minAmount: number | null;
  minNotional: number | null;
  amountPrecision: number | null;
  // Omitted by legacy synthetic rules; live CCXT metadata supplies a mode or null.
  amountPrecisionMode?: 'TICK_SIZE' | 'DECIMAL_PLACES' | null;
  contractSize?: number | null;
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

const getRulesCacheKey = (params: {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
}) => `${params.exchange}:${params.marketType}:${params.symbol.toUpperCase()}`;

const getExposureCacheKey = (params: {
  apiKeyId: string;
  symbol: string;
}) => `${params.apiKeyId}:${params.symbol.toUpperCase()}`;

export const resolvePrecisionStep = (
  amountPrecision: number | null,
  mode?: SymbolTradingRules['amountPrecisionMode']
): number | null => {
  if (!Number.isFinite(amountPrecision as number) || amountPrecision == null) return null;
  if (mode === 'TICK_SIZE') return amountPrecision > 0 ? amountPrecision : null;
  if (mode === 'DECIMAL_PLACES') {
    if (!Number.isInteger(amountPrecision) || amountPrecision < 0) return null;
    const step = 10 ** -amountPrecision;
    return Number.isFinite(step) && step > 0 ? step : null;
  }
  if (mode !== undefined) return null;
  // Legacy synthetic rules omitted the CCXT mode and retain their old convention.
  if (amountPrecision >= 1) return 1 / 10 ** Math.trunc(amountPrecision);
  if (amountPrecision > 0 && amountPrecision < 1) return amountPrecision;
  return null;
};

export const resolveQuantityContractSize = (
  contractSize: number | null | undefined,
  marketType: 'FUTURES' | 'SPOT'
): number | null => {
  if (marketType === 'SPOT') return 1;
  return typeof contractSize === 'number' && Number.isFinite(contractSize) && contractSize > 0
    ? contractSize
    : null;
};

export const normalizeAmountUpByPrecision = (
  value: number, amountPrecision: number | null,
  mode?: SymbolTradingRules['amountPrecisionMode']
) => {
  if (!Number.isFinite(value) || value <= 0) return value;
  if (mode !== undefined) {
    const step = resolvePrecisionStep(amountPrecision, mode);
    return step == null ? NaN : Number((Math.ceil((value - 1e-12) / step) * step).toPrecision(15));
  }
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

export const normalizeAmountFixed = (
  value: number, amountPrecision: number | null,
  mode?: SymbolTradingRules['amountPrecisionMode']
) => {
  if (!Number.isFinite(value)) return value;
  if (mode !== undefined) {
    const step = resolvePrecisionStep(amountPrecision, mode);
    return step == null ? NaN : Number((Math.round(value / step) * step).toPrecision(15));
  }
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

export const computeMinExecutableQuantity = (params: {
  marketType: 'FUTURES' | 'SPOT';
  minAmount: number | null;
  minNotional: number | null;
  markPrice: number | null;
  amountPrecision: number | null;
  amountPrecisionMode?: SymbolTradingRules['amountPrecisionMode'];
  contractSize?: number | null;
}) => {
  const step = resolvePrecisionStep(params.amountPrecision, params.amountPrecisionMode);
  if (params.amountPrecisionMode !== undefined && step == null) return null;
  const contractSize = resolveQuantityContractSize(params.contractSize, params.marketType);
  if (contractSize == null) return null;
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
    candidates.push(params.minNotional / (params.markPrice * contractSize));
  }

  if (candidates.length === 0) return null;

  const baseCandidate = Math.max(...candidates);
  let normalized = normalizeAmountUpByPrecision(
    baseCandidate, params.amountPrecision, params.amountPrecisionMode
  );

  if (!Number.isFinite(normalized) || normalized <= 0) return null;

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
    while (iterations < maxIterations && normalized * params.markPrice * contractSize + 1e-9 < params.minNotional) {
      normalized += step;
      iterations += 1;
    }
  }

  return normalizeAmountFixed(normalized, params.amountPrecision, params.amountPrecisionMode);
};

export const normalizeAmountByPrecision = (
  value: number, precision: number | null,
  mode?: SymbolTradingRules['amountPrecisionMode']
) => {
  if (!Number.isFinite(value)) return value;
  if (mode !== undefined) return normalizeAmountFixed(value, precision, mode);
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

export const getSymbolTradingRulesCached = async (params: {
  connector: {
    getSymbolTradingRules: (symbol: string) => Promise<SymbolTradingRules>;
  };
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

export const hasOpenExposureCached = async (params: {
  connector: {
    hasOpenPosition: (symbol: string) => Promise<boolean>;
  };
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

export const enforceLivePretradeGuards = async (params: {
  connector: {
    hasOpenPosition: (symbol: string) => Promise<boolean>;
    getSymbolTradingRules: (symbol: string) => Promise<SymbolTradingRules>;
    fetchMarkPrice: (symbol: string) => Promise<number>;
  };
  apiKeyId: string;
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  payload: {
    symbol: string;
    quantity: number;
    price?: number;
    reduceOnly?: boolean;
    expectedContractSize?: number;
  };
}) => {
  const normalizedSymbol = params.payload.symbol.toUpperCase();
  const quantity = Number(params.payload.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw orderErrors.livePretradeInvalidQuantity();
  }

  if (params.payload.reduceOnly !== true) {
    const hasExposure = await hasOpenExposureCached({
      connector: params.connector,
      apiKeyId: params.apiKeyId,
      symbol: normalizedSymbol,
    });
    if (hasExposure) {
      throw orderErrors.livePretradeExternalPositionOpen();
    }
  }

  const isGateFutures = params.exchange === 'GATEIO' && params.marketType === 'FUTURES';
  const rules = isGateFutures ? await params.connector.getSymbolTradingRules(normalizedSymbol)
    : await getSymbolTradingRulesCached({ connector: params.connector,
        exchange: params.exchange, marketType: params.marketType, symbol: normalizedSymbol });

  const contractSize = resolveQuantityContractSize(rules.contractSize, params.marketType);
  if (contractSize == null) {
    throw orderErrors.livePretradeContractSizeUnavailable();
  }
  if (isGateFutures) {
    if (typeof params.payload.expectedContractSize !== 'number' ||
        !Number.isFinite(params.payload.expectedContractSize) ||
        params.payload.expectedContractSize <= 0) {
      throw orderErrors.livePretradeContractSizeUnavailable();
    }
    if (contractSize !== params.payload.expectedContractSize) {
      throw orderErrors.livePretradeContractUnitMismatch();
    }
    if (contractSize !== 1) throw orderErrors.livePretradeGateNonunitUnsupported();
  }

  if (typeof rules.minAmount === 'number' && approxLessThan(quantity, rules.minAmount)) {
    throw orderErrors.livePretradeAmountBelowMin();
  }

  const normalizedByPrecision = normalizeAmountByPrecision(
    quantity, rules.amountPrecision, rules.amountPrecisionMode
  );
  if (!Number.isFinite(normalizedByPrecision)
    || approxGreaterThan(Math.abs(quantity - normalizedByPrecision), 1e-12)) {
    throw orderErrors.livePretradeAmountPrecision();
  }

  if (typeof rules.minNotional === 'number' && Number.isFinite(rules.minNotional) && rules.minNotional > 0) {
    let priceForNotional: number | null = null;
    if (typeof params.payload.price === 'number' && Number.isFinite(params.payload.price)) {
      priceForNotional = params.payload.price;
    } else {
      priceForNotional = await params.connector.fetchMarkPrice(normalizedSymbol).catch(() => null);
    }
    if (!(typeof priceForNotional === 'number' && Number.isFinite(priceForNotional) && priceForNotional > 0)) {
      throw orderErrors.livePretradeNotionalPriceUnavailable();
    }
    const notional = quantity * priceForNotional * contractSize;
    if (approxLessThan(notional, rules.minNotional)) {
      throw orderErrors.livePretradeNotionalBelowMin();
    }
  }
};

export type { SymbolTradingRules };
