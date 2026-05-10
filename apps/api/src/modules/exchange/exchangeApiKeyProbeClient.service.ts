import type { Exchange } from '@prisma/client';

export type ExchangeApiKeyProbeMarketType = 'spot' | 'future';

export type ExchangeApiKeyProbeClientInput = {
  exchange: Exchange;
  apiKey: string;
  apiSecret: string;
};

export interface ExchangeApiKeyProbeClientLike {
  fetchBalance: (params?: Record<string, unknown>) => Promise<unknown>;
  close?: () => Promise<void>;
}

export type ExchangeApiKeyProbeClientFactory = (
  exchange: Exchange,
  marketType: ExchangeApiKeyProbeMarketType,
  input: ExchangeApiKeyProbeClientInput
) => Promise<ExchangeApiKeyProbeClientLike>;

const resolveCcxtExchangeId = (exchange: Exchange) => exchange.toLowerCase();

export const resolveApiKeyProbeCcxtDefaultType = (
  exchange: Exchange,
  marketType: ExchangeApiKeyProbeMarketType
) => {
  if (marketType === 'spot') return 'spot';
  if (exchange === 'GATEIO') return 'swap';
  return 'future';
};

export const createExchangeApiKeyProbeClient: ExchangeApiKeyProbeClientFactory = async (
  exchange,
  marketType,
  input
) => {
  const ccxtModule = (await import('ccxt')) as unknown as {
    [exchangeId: string]: new (config: Record<string, unknown>) => ExchangeApiKeyProbeClientLike;
  };
  const exchangeId = resolveCcxtExchangeId(exchange);
  const ExchangeCtor = ccxtModule[exchangeId];
  if (!ExchangeCtor) {
    throw new Error(`Unsupported CCXT exchange: ${exchangeId}`);
  }

  return new ExchangeCtor({
    apiKey: input.apiKey,
    secret: input.apiSecret,
    enableRateLimit: true,
    options: {
      defaultType: resolveApiKeyProbeCcxtDefaultType(exchange, marketType),
    },
  });
};
