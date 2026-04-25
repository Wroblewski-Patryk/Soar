import { Exchange } from '@prisma/client';

import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';

type TradeMarket = 'FUTURES' | 'SPOT';

export const createPublicExchangeConnector = (params: {
  exchange: Exchange;
  marketType: TradeMarket;
}) =>
  resolveExchangeAdapterRegistryEntry(params).marketData.createPublicConnector();

export const createAuthenticatedExchangeConnector = (params: {
  exchange: Exchange;
  marketType: TradeMarket;
  apiKey: string;
  apiSecret: string;
}) =>
  resolveExchangeAdapterRegistryEntry(params).account.createAuthenticatedConnector({
    apiKey: params.apiKey,
    apiSecret: params.apiSecret,
  });
