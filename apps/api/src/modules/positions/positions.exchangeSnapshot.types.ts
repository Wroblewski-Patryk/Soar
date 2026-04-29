import { Exchange } from '@prisma/client';

export type ExchangePositionSnapshotItem = {
  symbol: string;
  side: string | null;
  contracts: number;
  entryPrice: number | null;
  markPrice: number | null;
  unrealizedPnl: number | null;
  leverage: number | null;
  marginMode: string | null;
  liquidationPrice: number | null;
  timestamp: string | null;
};

export type ExchangePositionSnapshot = {
  source: Exchange;
  syncedAt: string;
  positions: ExchangePositionSnapshotItem[];
};

export type ExchangeOpenOrderSnapshotItem = {
  exchangeOrderId: string | null;
  symbol: string;
  side: string | null;
  type: string | null;
  status: string | null;
  amount: number;
  filled: number;
  remaining: number | null;
  price: number | null;
  timestamp: string | null;
};

export type ExchangeOpenOrderSnapshot = {
  source: Exchange;
  syncedAt: string;
  orders: ExchangeOpenOrderSnapshotItem[];
};

export type ExchangeTradeHistoryItem = {
  exchangeTradeId: string | null;
  exchangeOrderId: string | null;
  symbol: string;
  side: string | null;
  price: number;
  quantity: number;
  notional: number;
  feeCost: number;
  feeCurrency: string | null;
  feeRate: number | null;
  executedAt: string | null;
};

export type ExchangeTradeHistorySnapshot = {
  source: Exchange;
  syncedAt: string;
  symbol: string;
  trades: ExchangeTradeHistoryItem[];
};
