import { Exchange } from '@prisma/client';

import {
  getExchangeBaseCurrencyFallbacks,
  getExchangeMarketTypeOptions,
  supportsExchangeCapability,
  type ExchangeMarketType,
} from './exchangeCapabilities';
import { getMarketCatalog } from '../markets/markets.service';
import { normalizeBaseCurrency } from '../../lib/symbols';
import { getExchangeSymbolRules } from './exchangeSymbolRules.service';

type TradeMarket = 'FUTURES' | 'SPOT';

export type ExchangeMarketTypeMetadata = {
  marketType: ExchangeMarketType;
  baseCurrency: string;
  baseCurrencies: string[];
  source: 'MARKET_CATALOG' | 'EXCHANGE_CAPABILITIES';
};

type ExchangeMetadataDeps = {
  getMarketCatalogForExchange: typeof getMarketCatalog;
  getSymbolRules: typeof getExchangeSymbolRules;
};

const defaultDeps: ExchangeMetadataDeps = {
  getMarketCatalogForExchange: getMarketCatalog,
  getSymbolRules: getExchangeSymbolRules,
};

const deriveAmountPrecisionFromStep = (step: number | null) => {
  if (typeof step !== 'number' || !Number.isFinite(step) || step <= 0) return null;
  if (Number.isInteger(step)) return 0;
  const serialized = step.toString();
  if (!serialized.includes('.')) return 0;
  return serialized.split('.')[1]?.replace(/0+$/, '').length ?? 0;
};

export const resolveExchangeMarketTypeMetadata = async (
  params: {
    exchange: Exchange;
    marketType: ExchangeMarketType;
  },
  deps: ExchangeMetadataDeps = defaultDeps
): Promise<ExchangeMarketTypeMetadata> => {
  const fallbackCurrencies = getExchangeBaseCurrencyFallbacks(params.exchange, params.marketType)
    .map((item) => normalizeBaseCurrency(item))
    .filter(Boolean);
  const resolvedFallbackCurrencies =
    fallbackCurrencies.length > 0 ? [...new Set(fallbackCurrencies)] : ['USDT'];
  const fallbackBaseCurrency = resolvedFallbackCurrencies[0] ?? 'USDT';

  if (!supportsExchangeCapability(params.exchange, 'MARKET_CATALOG')) {
    return {
      marketType: params.marketType,
      baseCurrency: fallbackBaseCurrency,
      baseCurrencies: resolvedFallbackCurrencies,
      source: 'EXCHANGE_CAPABILITIES',
    };
  }

  try {
    const catalog = await deps.getMarketCatalogForExchange(undefined, params.marketType, params.exchange);
    const normalizedCatalogBaseCurrencies = (catalog.baseCurrencies ?? [])
      .map((item) => normalizeBaseCurrency(item))
      .filter(Boolean);
    const baseCurrencies = normalizedCatalogBaseCurrencies.length
      ? [...new Set(normalizedCatalogBaseCurrencies)]
      : resolvedFallbackCurrencies;
    const baseCurrency = baseCurrencies.includes(normalizeBaseCurrency(catalog.baseCurrency))
      ? normalizeBaseCurrency(catalog.baseCurrency)
      : (baseCurrencies[0] ?? fallbackBaseCurrency);

    return {
      marketType: params.marketType,
      baseCurrency,
      baseCurrencies,
      source: 'MARKET_CATALOG',
    };
  } catch {
    return {
      marketType: params.marketType,
      baseCurrency: fallbackBaseCurrency,
      baseCurrencies: resolvedFallbackCurrencies,
      source: 'EXCHANGE_CAPABILITIES',
    };
  }
};

export const resolveExchangeMetadataByMarketType = async (
  params: {
    exchange: Exchange;
    requestedMarketType?: ExchangeMarketType | null;
  },
  deps: ExchangeMetadataDeps = defaultDeps
) => {
  const marketTypes = getExchangeMarketTypeOptions(params.exchange);
  const marketType =
    params.requestedMarketType && marketTypes.includes(params.requestedMarketType)
      ? params.requestedMarketType
      : (marketTypes[0] ?? 'SPOT');

  const marketTypeEntries = await Promise.all(
    marketTypes.map((entryMarketType) =>
      resolveExchangeMarketTypeMetadata(
        {
          exchange: params.exchange,
          marketType: entryMarketType,
        },
        deps
      )
    )
  );

  const byMarketType = marketTypeEntries.reduce<Record<ExchangeMarketType, ExchangeMarketTypeMetadata>>(
    (acc, entry) => {
      acc[entry.marketType] = entry;
      return acc;
    },
    {
      FUTURES: {
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        baseCurrencies: ['USDT'],
        source: 'EXCHANGE_CAPABILITIES',
      },
      SPOT: {
        marketType: 'SPOT',
        baseCurrency: 'USDT',
        baseCurrencies: ['USDT'],
        source: 'EXCHANGE_CAPABILITIES',
      },
    }
  );

  const selected = byMarketType[marketType] ?? byMarketType.SPOT;
  return {
    exchange: params.exchange,
    marketTypes,
    marketType: selected.marketType,
    baseCurrency: selected.baseCurrency,
    baseCurrencies: selected.baseCurrencies,
    source: selected.source,
    byMarketType,
  };
};

export const resolveSymbolTradingRulesMetadata = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
  },
  deps: ExchangeMetadataDeps = defaultDeps
) => {
  const rules = await deps.getSymbolRules({
    exchange: params.exchange,
    marketType: params.marketType,
    symbol: params.symbol,
  });

  return {
    minAmount: rules?.minQuantity ?? null,
    minNotional: rules?.minNotional ?? null,
    amountPrecision: deriveAmountPrecisionFromStep(rules?.quantityStep ?? null),
  };
};

