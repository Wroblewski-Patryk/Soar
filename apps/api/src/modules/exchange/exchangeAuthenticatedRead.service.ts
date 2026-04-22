import { Exchange } from '@prisma/client';

import { createAuthenticatedExchangeConnector } from './exchangeConnectorFactory.service';

type TradeMarket = 'FUTURES' | 'SPOT';

type AuthenticatedConnectorLike = {
  fetchPositions: (input?: { symbols?: string[] }) => Promise<Record<string, unknown>[]>;
  fetchOpenOrders: (input?: { symbol?: string }) => Promise<Record<string, unknown>[]>;
  fetchBalance: (params?: Record<string, unknown>) => Promise<unknown>;
  disconnect: () => Promise<void>;
};

type ExchangeAuthenticatedReadDeps = {
  createAuthenticatedConnector: (params: {
    exchange: Exchange;
    marketType: TradeMarket;
    apiKey: string;
    apiSecret: string;
  }) => AuthenticatedConnectorLike;
};

const defaultDeps: ExchangeAuthenticatedReadDeps = {
  createAuthenticatedConnector: createAuthenticatedExchangeConnector,
};

const withAuthenticatedConnector = async <T>(
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    apiKey: string;
    apiSecret: string;
  },
  deps: ExchangeAuthenticatedReadDeps,
  action: (connector: AuthenticatedConnectorLike) => Promise<T>
) => {
  const connector = deps.createAuthenticatedConnector(params);
  try {
    return await action(connector);
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchAuthenticatedExchangePositionsRaw = (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    apiKey: string;
    apiSecret: string;
  },
  deps: ExchangeAuthenticatedReadDeps = defaultDeps
) =>
  withAuthenticatedConnector(params, deps, async (connector) => {
    const raw = await connector.fetchPositions();
    return Array.isArray(raw) ? raw : [];
  });

export const fetchAuthenticatedExchangeOpenOrdersRaw = (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    apiKey: string;
    apiSecret: string;
  },
  deps: ExchangeAuthenticatedReadDeps = defaultDeps
) =>
  withAuthenticatedConnector(params, deps, async (connector) => {
    const raw = await connector.fetchOpenOrders();
    return Array.isArray(raw) ? raw : [];
  });

export const fetchAuthenticatedExchangeBalanceRaw = (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
    apiKey: string;
    apiSecret: string;
  },
  deps: ExchangeAuthenticatedReadDeps = defaultDeps
) => withAuthenticatedConnector(params, deps, (connector) => connector.fetchBalance());

