import type {
  CcxtFundingRateLike,
  CcxtOpenInterestLike,
  CcxtOrderBookLike,
} from './ccxtPublicMarketDataNormalizer';

export type CcxtOrderLike = {
  id?: string;
  status?: string;
  symbol?: string;
  side?: string;
  type?: string;
  amount?: number;
  filled?: number;
  price?: number;
  average?: number;
  trades?: unknown[];
  fills?: unknown[];
  info?: Record<string, unknown>;
};

export type CcxtTradeFeeLike = {
  cost?: number;
  currency?: string;
  rate?: number;
};

export type CcxtTradeLike = {
  id?: string;
  order?: string;
  orderId?: string;
  symbol?: string;
  side?: string;
  price?: number;
  amount?: number;
  cost?: number;
  timestamp?: number;
  datetime?: string;
  fee?: CcxtTradeFeeLike | null;
  fees?: CcxtTradeFeeLike[];
  info?: Record<string, unknown>;
};

export type CcxtWalletCashflowLike = {
  id?: string;
  txid?: string;
  referenceId?: string;
  type?: string;
  direction?: string;
  amount?: number;
  currency?: string;
  code?: string;
  timestamp?: number;
  datetime?: string;
  status?: string;
  fee?: CcxtTradeFeeLike | number | null;
  info?: Record<string, unknown>;
};

export type CcxtPositionLike = {
  symbol?: string;
  contracts?: number;
  amount?: number;
  positionAmt?: number;
  info?: Record<string, unknown>;
};

export interface CcxtExchangeLikeClient {
  setSandboxMode?: (enabled: boolean) => void;
  loadMarkets: () => Promise<unknown>;
  fetchPositions?: (
    symbols?: string[],
    params?: Record<string, unknown>
  ) => Promise<CcxtPositionLike[]>;
  fetchTicker: (symbol: string) => Promise<{
    symbol?: string;
    timestamp?: number;
    last?: number | string | null;
    mark?: number | string | null;
    percentage?: number | string | null;
    info?: Record<string, unknown>;
  }>;
  fetchOHLCV?: (
    symbol: string,
    timeframe?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<unknown[][]>;
  fetchFundingRateHistory?: (
    symbol?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtFundingRateLike[]>;
  fetchOpenInterestHistory?: (
    symbol: string,
    timeframe?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtOpenInterestLike[]>;
  fetchOrderBook?: (
    symbol: string,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderBookLike>;
  fetchOrder?: (
    id: string,
    symbol?: string,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderLike>;
  fetchMyTrades?: (
    symbol?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtTradeLike[]>;
  fetchOpenOrders?: (
    symbol?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderLike[]>;
  fetchBalance?: (params?: Record<string, unknown>) => Promise<unknown>;
  fetchLedger?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  fetchDeposits?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  fetchWithdrawals?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  fetchTransactions?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  setLeverage?: (
    leverage: number,
    symbol?: string,
    params?: Record<string, unknown>
  ) => Promise<unknown>;
  setMarginMode?: (
    marginMode: string,
    symbol?: string,
    params?: Record<string, unknown>
  ) => Promise<unknown>;
  createOrder: (
    symbol: string,
    type: string,
    side: string,
    amount: number,
    price?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderLike>;
  cancelOrder?: (id: string, symbol?: string, params?: Record<string, unknown>) => Promise<CcxtOrderLike>;
  close?: () => Promise<void>;
}
