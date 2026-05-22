import { Exchange } from '@prisma/client';

import { liveOrderingConfig } from '../../config/runtimeExecution';
import { orderErrors } from './orders.errors';

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

const getRulesCacheKey = (params: {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
}) => `${params.exchange}:${params.marketType}:${params.symbol.toUpperCase()}`;

const getExposureCacheKey = (params: {
  apiKeyId: string;
  symbol: string;
}) => `${params.apiKeyId}:${params.symbol.toUpperCase()}`;

const resolvePrecisionStep = (amountPrecision: number | null): number | null => {
  if (!Number.isFinite(amountPrecision as number) || amountPrecision == null) return null;
  if (amountPrecision >= 1) return 1 / 10 ** Math.trunc(amountPrecision);
  if (amountPrecision > 0 && amountPrecision < 1) return amountPrecision;
  return null;
};

export const normalizeAmountUpByPrecision = (value: number, amountPrecision: number | null) => {
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

export const normalizeAmountFixed = (value: number, amountPrecision: number | null) => {
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

export const computeMinExecutableQuantity = (params: {
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

export const normalizeAmountByPrecision = (value: number, precision: number | null) => {
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
    const notional = quantity * priceForNotional;
    if (approxLessThan(notional, rules.minNotional)) {
      throw orderErrors.livePretradeNotionalBelowMin();
    }
  }
};

export type { SymbolTradingRules };
