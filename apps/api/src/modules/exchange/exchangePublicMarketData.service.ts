import { Exchange } from '@prisma/client';

import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';
import { CcxtPublicCandle, CcxtPublicTickerSnapshot } from './ccxtFuturesConnector.types';

type TradeMarket = 'FUTURES' | 'SPOT';

type PublicMarketDataConnectorLike = {
  fetchTickerSnapshot: (symbol: string) => Promise<CcxtPublicTickerSnapshot>;
  fetchRecentCandles: (input: {
    symbol: string;
    interval: string;
    limit?: number;
    since?: number;
  }) => Promise<CcxtPublicCandle[]>;
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
