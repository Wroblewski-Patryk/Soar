import { Exchange } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { CcxtFuturesConnector } from './ccxtFuturesConnector.service';
import { CcxtFuturesOrderFill } from './ccxtFuturesConnector.types';
import {
  assertExchangeExecutionCapabilitySupport,
  resolveExchangeExecutionSource,
  supportsExchangeExecutionCapability,
} from './exchangeExecutionCapabilityContract.service';
import { fetchAuthenticatedExchangeBalanceRaw } from './exchangeAuthenticatedRead.service';
import { liveOrderingConfig } from '../../config/runtimeExecution';
import { isAppErrorLike } from '../../lib/errors';
import { orderErrors } from '../orders/orders.errors';
import { enforceLivePretradeGuards } from '../orders/orders.quantityRules';
import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';

type TradeMarket = 'FUTURES' | 'SPOT';

export type LiveExecutionApiKey = {
  id: string;
  exchange: Exchange;
  apiKey: string;
  apiSecret: string;
};

export type SupportedExchangeReadCredentials = {
  exchange: Exchange;
  marketType: TradeMarket;
  apiKey: string;
  apiSecret: string;
};

export type SubmitLiveExchangeOrderInput = {
  userId: string;
  bot: {
    exchange: Exchange;
    marketType: TradeMarket;
    positionMode: 'ONE_WAY' | 'HEDGE';
    apiKeyId: string | null;
    walletId: string | null;
  };
  order: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT';
    quantity: number;
    price?: number;
    strategyId?: string | null;
    reduceOnly?: boolean;
  };
  targetLeverage: number | null;
};

export type SubmitLiveExchangeOrderResult = {
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

type AuthenticatedConnectorLike = {
  fetchPositions: () => Promise<Record<string, unknown>[]>;
  fetchOpenOrders: () => Promise<Record<string, unknown>[]>;
  fetchTradesForWindow?: (input: {
    symbol: string;
    since?: number;
    limit?: number;
  }) => Promise<CcxtFuturesOrderFill[]>;
  disconnect: () => Promise<void>;
  hasOpenPosition: (symbol: string) => Promise<boolean>;
  getSymbolTradingRules: (symbol: string) => Promise<{
    minAmount: number | null;
    minNotional: number | null;
    amountPrecision: number | null;
  }>;
  fetchMarkPrice: (symbol: string) => Promise<number>;
  convergeFuturesLeverageAndMargin: (params: {
    symbol: string;
    leverage: number | null;
    marginMode: 'cross' | 'isolated' | null;
  }) => Promise<void>;
};

type ExchangeAdapterBoundaryDeps = {
  createAuthenticatedConnector: (params: SupportedExchangeReadCredentials) => AuthenticatedConnectorLike;
  fetchBalanceRaw: (params: SupportedExchangeReadCredentials) => Promise<unknown>;
  resolveLiveExecutionApiKey: (params: {
    userId: string;
    bot: Pick<SubmitLiveExchangeOrderInput['bot'], 'exchange' | 'apiKeyId' | 'walletId'>;
  }) => Promise<LiveExecutionApiKey>;
  createLiveOrderAdapter: (params: {
    exchange: Exchange;
    marketType: TradeMarket;
    connector: AuthenticatedConnectorLike;
  }) => {
    placeLiveOrderWithFees: (input: {
      order: {
        symbol: string;
        side: 'buy' | 'sell';
        type: 'market' | 'limit';
        amount: number;
        price?: number;
        reduceOnly?: boolean;
        positionMode: 'ONE_WAY' | 'HEDGE';
      };
    }) => Promise<{
      exchangeOrderId: string | null;
      status?: string;
      fee?: number | null;
      feeSource?: 'ESTIMATED' | 'EXCHANGE_FILL';
      feePending?: boolean;
      feeCurrency?: string | null;
      effectiveFeeRate?: number | null;
      exchangeTradeId?: string | null;
      fills?: CcxtFuturesOrderFill[];
      rawOrderStatus?: string;
    }>;
  };
  enforceLivePretradeGuards: typeof enforceLivePretradeGuards;
  convergeLiveMarginAndLeverageIfNeeded: typeof convergeLiveMarginAndLeverageIfNeeded;
};

const getDefaultDeps = (): ExchangeAdapterBoundaryDeps => ({
  createAuthenticatedConnector: (params) =>
    resolveExchangeAdapterRegistryEntry(params).account.createAuthenticatedConnector({
      apiKey: params.apiKey,
      apiSecret: params.apiSecret,
    }) as unknown as AuthenticatedConnectorLike,
  fetchBalanceRaw: fetchAuthenticatedExchangeBalanceRaw,
  resolveLiveExecutionApiKey,
  createLiveOrderAdapter: (params) => {
    const registry = resolveExchangeAdapterRegistryEntry({
      exchange: resolveExchangeExecutionSource(params.exchange),
      marketType: params.marketType,
    });
    return registry.execution.createLiveOrderAdapter(
      params.connector as unknown as CcxtFuturesConnector
    );
  },
  enforceLivePretradeGuards,
  convergeLiveMarginAndLeverageIfNeeded,
});

const mapLiveOrderType = (type: SubmitLiveExchangeOrderInput['order']['type']) => {
  if (type === 'MARKET') return 'market' as const;
  return 'limit' as const;
};

const mapLiveOrderStatus = (
  status: string | undefined,
  fallbackType: SubmitLiveExchangeOrderInput['order']['type']
) => {
  if (status) {
    const normalized = status.toLowerCase();
    if (normalized.includes('filled') || normalized.includes('closed')) return 'FILLED' as const;
  }
  return fallbackType === 'MARKET' ? ('FILLED' as const) : ('OPEN' as const);
};

const liveMarginLeverageConvergenceCache = new Map<string, { expiresAtMs: number }>();

const getLiveConvergenceCacheKey = (params: {
  apiKeyId: string;
  symbol: string;
  leverage: number | null;
  marginMode: 'cross' | 'isolated' | null;
}) =>
  `${params.apiKeyId}:${params.symbol.toUpperCase()}:${params.leverage ?? 'na'}:${params.marginMode ?? 'na'}`;

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
      `[ExchangeAdapterBoundary] live_margin_leverage_convergence_failed symbol=${params.symbol} apiKey=${params.apiKeyId} error=${message}`
    );
  }
};

export const resolveLiveExecutionApiKey = async (params: {
  userId: string;
  bot: Pick<SubmitLiveExchangeOrderInput['bot'], 'exchange' | 'apiKeyId' | 'walletId'>;
}): Promise<LiveExecutionApiKey> => {
  assertExchangeExecutionCapabilitySupport(params.bot.exchange, 'LIVE_ORDER_SUBMIT');

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

  if (params.bot.walletId) {
    const walletBoundApiKey = await prisma.wallet.findFirst({
      where: {
        id: params.bot.walletId,
        userId: params.userId,
        exchange: params.bot.exchange,
        apiKeyId: { not: null },
      },
      select: {
        apiKey: {
          select: {
            id: true,
            exchange: true,
            apiKey: true,
            apiSecret: true,
          },
        },
      },
    });

    if (walletBoundApiKey?.apiKey && walletBoundApiKey.apiKey.exchange === params.bot.exchange) {
      return walletBoundApiKey.apiKey;
    }
  }

  throw orderErrors.liveApiKeyRequired();
};

export const fetchSupportedExchangePositionsRaw = async (
  params: SupportedExchangeReadCredentials,
  deps: Pick<ExchangeAdapterBoundaryDeps, 'createAuthenticatedConnector'> = getDefaultDeps()
) => {
  assertExchangeExecutionCapabilitySupport(params.exchange, 'POSITIONS_SNAPSHOT');

  const connector = deps.createAuthenticatedConnector(params);
  try {
    const raw = await connector.fetchPositions();
    return Array.isArray(raw) ? raw : [];
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchSupportedExchangeOpenOrdersRaw = async (
  params: SupportedExchangeReadCredentials,
  deps: Pick<ExchangeAdapterBoundaryDeps, 'createAuthenticatedConnector'> = getDefaultDeps()
) => {
  assertExchangeExecutionCapabilitySupport(params.exchange, 'OPEN_ORDERS_SNAPSHOT');

  const connector = deps.createAuthenticatedConnector(params);
  try {
    const raw = await connector.fetchOpenOrders();
    return Array.isArray(raw) ? raw : [];
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchSupportedExchangeTradeHistoryRaw = async (
  params: SupportedExchangeReadCredentials & {
    symbol: string;
    since?: number;
    limit?: number;
  },
  deps: Pick<ExchangeAdapterBoundaryDeps, 'createAuthenticatedConnector'> = getDefaultDeps()
) => {
  assertExchangeExecutionCapabilitySupport(params.exchange, 'TRADE_HISTORY_SNAPSHOT');

  const connector = deps.createAuthenticatedConnector(params);
  try {
    if (typeof connector.fetchTradesForWindow !== 'function') {
      throw new Error('fetchTradesForWindow is not supported by this authenticated connector');
    }
    const raw = await connector.fetchTradesForWindow({
      symbol: params.symbol,
      since: params.since,
      limit: params.limit,
    });
    return Array.isArray(raw) ? raw : [];
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};

export const fetchSupportedExchangeBalanceRaw = async (
  params: SupportedExchangeReadCredentials,
  deps: Pick<ExchangeAdapterBoundaryDeps, 'fetchBalanceRaw'> = getDefaultDeps()
) => {
  assertExchangeExecutionCapabilitySupport(params.exchange, 'BALANCE_PREVIEW');
  return deps.fetchBalanceRaw(params);
};

export const submitLiveOrderThroughBoundary = async (
  params: SubmitLiveExchangeOrderInput,
  deps: ExchangeAdapterBoundaryDeps = getDefaultDeps()
): Promise<SubmitLiveExchangeOrderResult> => {
  const apiKey = await deps.resolveLiveExecutionApiKey({
    userId: params.userId,
    bot: params.bot,
  });
  if (apiKey.exchange !== params.bot.exchange) {
    throw orderErrors.liveApiKeyRequired();
  }

  const connector = deps.createAuthenticatedConnector({
    exchange: apiKey.exchange,
    apiKey: apiKey.apiKey,
    apiSecret: apiKey.apiSecret,
    marketType: params.bot.marketType,
  });
  const liveAdapter = deps.createLiveOrderAdapter({
    exchange: params.bot.exchange,
    marketType: params.bot.marketType,
    connector,
  });

  try {
    await deps.enforceLivePretradeGuards({
      connector,
      apiKeyId: apiKey.id,
      exchange: apiKey.exchange,
      marketType: params.bot.marketType,
      payload: {
        symbol: params.order.symbol,
        quantity: params.order.quantity,
        price: params.order.price,
        reduceOnly: params.order.reduceOnly,
      },
    });
    await deps.convergeLiveMarginAndLeverageIfNeeded({
      connector: connector as unknown as CcxtFuturesConnector,
      apiKeyId: apiKey.id,
      symbol: params.order.symbol.toUpperCase(),
      targetLeverage: params.targetLeverage,
    });

    const result = await liveAdapter.placeLiveOrderWithFees({
      order: {
        symbol: params.order.symbol.toUpperCase(),
        side: params.order.side === 'BUY' ? 'buy' : 'sell',
        type: mapLiveOrderType(params.order.type),
        amount: params.order.quantity,
        price: params.order.price,
        reduceOnly: params.order.reduceOnly,
        positionMode: params.bot.positionMode,
      },
    });

    return {
      exchangeOrderId: result.exchangeOrderId,
      status: mapLiveOrderStatus(result.rawOrderStatus ?? result.status, params.order.type),
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

export const supportsExchangeAdapterOperation = supportsExchangeExecutionCapability;
export const assertExchangeAdapterOperationSupport = assertExchangeExecutionCapabilitySupport;
export const resolveExchangeAdapterSource = resolveExchangeExecutionSource;
