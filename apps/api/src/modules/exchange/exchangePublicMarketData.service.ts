import { Exchange } from '@prisma/client';

import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';
import {
  CcxtPublicCandle,
  CcxtPublicFundingRatePoint,
  CcxtPublicOpenInterestPoint,
  CcxtPublicOrderBookPoint,
  CcxtPublicTickerSnapshot,
} from './ccxtFuturesConnector.types';

type TradeMarket = 'FUTURES' | 'SPOT';

type PublicMarketDataConnectorLike = {
  fetchTickerSnapshot: (symbol: string) => Promise<CcxtPublicTickerSnapshot>;
  fetchRecentCandles: (input: {
    symbol: string;
    interval: string;
    limit?: number;
    since?: number;
  }) => Promise<CcxtPublicCandle[]>;
  fetchFundingRateHistory?: (input: {
    symbol: string;
    since?: number;
    limit?: number;
    endTime?: number;
  }) => Promise<CcxtPublicFundingRatePoint[]>;
  fetchOpenInterestHistory?: (input: {
    symbol: string;
    interval: string;
    since?: number;
    limit?: number;
    endTime?: number;
  }) => Promise<CcxtPublicOpenInterestPoint[]>;
  fetchOrderBookSnapshot?: (symbol: string, limit?: number) => Promise<CcxtPublicOrderBookPoint>;
  disconnect: () => Promise<void>;
};

type ExchangePublicMarketDataDeps = {
  createPublicConnector: (params: {
    exchange: Exchange;
    marketType: TradeMarket;
  }) => PublicMarketDataConnectorLike;
};

const defaultDeps: ExchangePublicMarketDataDeps = {
  createPublicConnector: (params) =>
    resolveExchangeAdapterRegistryEntry(params).marketData.createPublicConnector(),
};

export const fetchExchangePublicTickerSnapshot = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
  },
  deps: ExchangePublicMarketDataDeps = defaultDeps
) => {
  const connector = deps.createPublicConnector(params);
  try {
    return await connector.fetchTickerSnapshot(params.symbol);
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchExchangePublicRecentCandles = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
    interval: string;
    limit?: number;
    since?: number;
  },
  deps: ExchangePublicMarketDataDeps = defaultDeps
) => {
  const connector = deps.createPublicConnector(params);
  try {
    return await connector.fetchRecentCandles({
      symbol: params.symbol,
      interval: params.interval,
      limit: params.limit,
      since: params.since,
    });
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchExchangePublicFundingRateHistory = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
    since?: number;
    limit?: number;
    endTime?: number;
  },
  deps: ExchangePublicMarketDataDeps = defaultDeps
) => {
  const connector = deps.createPublicConnector(params);
  try {
    if (typeof connector.fetchFundingRateHistory !== 'function') {
      throw new Error(`Funding-rate history is not supported for ${params.exchange} ${params.marketType}`);
    }
    return await connector.fetchFundingRateHistory({
      symbol: params.symbol,
      since: params.since,
      limit: params.limit,
      endTime: params.endTime,
    });
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchExchangePublicOpenInterestHistory = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
    interval: string;
    since?: number;
    limit?: number;
    endTime?: number;
  },
  deps: ExchangePublicMarketDataDeps = defaultDeps
) => {
  const connector = deps.createPublicConnector(params);
  try {
    if (typeof connector.fetchOpenInterestHistory !== 'function') {
      throw new Error(`Open-interest history is not supported for ${params.exchange} ${params.marketType}`);
    }
    return await connector.fetchOpenInterestHistory({
      symbol: params.symbol,
      interval: params.interval,
      since: params.since,
      limit: params.limit,
      endTime: params.endTime,
    });
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchExchangePublicOrderBookSnapshot = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
    limit?: number;
  },
  deps: ExchangePublicMarketDataDeps = defaultDeps
) => {
  const connector = deps.createPublicConnector(params);
  try {
    if (typeof connector.fetchOrderBookSnapshot !== 'function') {
      throw new Error(`Order-book snapshot is not supported for ${params.exchange} ${params.marketType}`);
    }
    return await connector.fetchOrderBookSnapshot(params.symbol, params.limit);
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};
