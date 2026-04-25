import { Exchange } from '@prisma/client';

import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';

type TradeMarket = 'FUTURES' | 'SPOT';

type PublicConnectorLike = {
  loadMarketsMap: () => Promise<Record<string, unknown>>;
  disconnect: () => Promise<void>;
};

type ExchangePublicReadDeps = {
  createPublicConnector: (params: {
    exchange: Exchange;
    marketType: TradeMarket;
  }) => PublicConnectorLike;
};

const defaultDeps: ExchangePublicReadDeps = {
  createPublicConnector: (params) =>
    resolveExchangeAdapterRegistryEntry(params).marketData.createPublicConnector(),
};

export const loadExchangePublicMarketMap = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
  },
  deps: ExchangePublicReadDeps = defaultDeps
) => {
  const connector = deps.createPublicConnector(params);
  try {
    return await connector.loadMarketsMap();
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};
