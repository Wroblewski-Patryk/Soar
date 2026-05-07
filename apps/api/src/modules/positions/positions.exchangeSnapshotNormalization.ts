import { fetchSupportedExchangeTradeHistoryRaw } from '../exchange/exchangeAdapterBoundary.service';
import {
  ExchangeOpenOrderSnapshotItem,
  ExchangePositionSnapshotItem,
  ExchangeTradeHistoryItem,
} from './positions.exchangeSnapshot.types';

type ExchangePositionLike = {
  symbol?: string;
  side?: string;
  contracts?: number;
  entryPrice?: number;
  markPrice?: number;
  unrealizedPnl?: number;
  leverage?: number;
  marginMode?: string;
  liquidationPrice?: number;
  timestamp?: number;
  info?: Record<string, unknown>;
};

const readNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const readString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
};

const isIsolatedMarginMode = (position: ExchangePositionLike, info: Record<string, unknown>) => {
  const marginMode = position.marginMode ?? readString(info.marginType);
  return typeof marginMode === 'string' && marginMode.trim().toLowerCase() === 'isolated';
};

const readSignedPositionAmount = (position: ExchangePositionLike, info: Record<string, unknown>) =>
  readNumber(info.positionAmt) ?? readNumber(info.contracts) ?? readNumber(position.contracts);

const deriveExchangePositionContracts = (position: ExchangePositionLike, info: Record<string, unknown>) => {
  const explicitContracts = readNumber(position.contracts) ?? readNumber(info.contracts);
  if (explicitContracts != null) return Math.abs(explicitContracts);
  const signedPositionAmount = readNumber(info.positionAmt);
  return signedPositionAmount != null ? Math.abs(signedPositionAmount) : 0;
};

const deriveExchangePositionSide = (position: ExchangePositionLike, info: Record<string, unknown>) => {
  if (position.side != null) return position.side;
  const positionSide = readString(info.positionSide);
  if (positionSide != null && positionSide.toUpperCase() !== 'BOTH') return positionSide;
  const signedPositionAmount = readSignedPositionAmount(position, info);
  if (signedPositionAmount != null && signedPositionAmount > 0) return 'LONG';
  if (signedPositionAmount != null && signedPositionAmount < 0) return 'SHORT';
  return positionSide;
};

const deriveExchangePositionLeverage = (position: ExchangePositionLike, info: Record<string, unknown>) => {
  const explicitLeverage = readNumber(position.leverage) ?? readNumber(info.leverage);
  if (explicitLeverage != null && explicitLeverage > 0) return explicitLeverage;
  const contracts = readSignedPositionAmount(position, info);
  const contractSize = readNumber(info.contractSize) ?? 1;
  const markPrice = readNumber(position.markPrice) ?? readNumber(info.markPrice);
  const entryPrice = readNumber(position.entryPrice) ?? readNumber(info.entryPrice);
  const notional =
    Math.abs(readNumber(info.notional) ?? 0) ||
    Math.abs((contracts ?? 0) * contractSize * (markPrice ?? entryPrice ?? 0));
  const margin =
    Math.abs(
      readNumber(info.initialMargin) ?? readNumber(info.positionInitialMargin) ?? readNumber(info.isolatedMargin) ??
        readNumber(info.isolatedWallet) ?? 0
    ) || 0;
  return notional > 0 && margin > 0 ? notional / margin : null;
};

const deriveExchangePositionMarginUsed = (position: ExchangePositionLike, info: Record<string, unknown>) => {
  const explicitMargin = isIsolatedMarginMode(position, info)
    ? readNumber(info.isolatedWallet) ??
      readNumber(info.isolatedMargin) ??
      readNumber(info.positionInitialMargin) ??
      readNumber(info.initialMargin)
    : readNumber(info.initialMargin) ??
      readNumber(info.positionInitialMargin) ??
      readNumber(info.isolatedMargin) ??
      readNumber(info.isolatedWallet);
  if (explicitMargin != null && explicitMargin > 0) return Math.abs(explicitMargin);
  const leverage = deriveExchangePositionLeverage(position, info);
  const contracts = readSignedPositionAmount(position, info);
  const contractSize = readNumber(info.contractSize) ?? 1;
  const markPrice = readNumber(position.markPrice) ?? readNumber(info.markPrice);
  const entryPrice = readNumber(position.entryPrice) ?? readNumber(info.entryPrice);
  const notional =
    Math.abs(readNumber(info.notional) ?? 0) ||
    Math.abs((contracts ?? 0) * contractSize * (markPrice ?? entryPrice ?? 0));
  return leverage != null && leverage > 0 && notional > 0 ? notional / leverage : null;
};

export const normalizeExchangePosition = (position: ExchangePositionLike): ExchangePositionSnapshotItem => {
  const info = (position.info ?? {}) as Record<string, unknown>;
  const timestampMs = readNumber(position.timestamp) ?? readNumber(info.updateTime) ?? readNumber(info.time);
  return {
    symbol: position.symbol ?? readString(info.symbol) ?? 'UNKNOWN',
    side: deriveExchangePositionSide(position, info),
    contracts: deriveExchangePositionContracts(position, info),
    entryPrice: readNumber(position.entryPrice) ?? readNumber(info.entryPrice),
    markPrice: readNumber(position.markPrice) ?? readNumber(info.markPrice),
    unrealizedPnl: readNumber(position.unrealizedPnl) ?? readNumber(info.unRealizedProfit),
    marginUsed: deriveExchangePositionMarginUsed(position, info),
    leverage: deriveExchangePositionLeverage(position, info),
    marginMode: position.marginMode ?? readString(info.marginType),
    liquidationPrice: readNumber(position.liquidationPrice) ?? readNumber(info.liquidationPrice),
    timestamp: typeof timestampMs === 'number' ? new Date(timestampMs).toISOString() : null,
  };
};

export const normalizeExchangeOpenOrder = (order: Record<string, unknown>): ExchangeOpenOrderSnapshotItem => {
  const info = (order.info ?? {}) as Record<string, unknown>;
  const timestampMs =
    readNumber(order.timestamp) ?? readNumber(info.time) ?? readNumber(info.transactTime);
  const amount = readNumber(order.amount) ?? readNumber(info.origQty) ?? 0;
  const filled = readNumber(order.filled) ?? readNumber(info.executedQty) ?? 0;
  const explicitRemaining = readNumber(order.remaining);
  const remaining =
    typeof explicitRemaining === 'number'
      ? explicitRemaining
      : Number.isFinite(amount) && Number.isFinite(filled)
        ? Math.max(0, amount - filled)
        : null;

  return {
    exchangeOrderId: readString(order.id) ?? readString(info.orderId) ?? null,
    symbol: readString(order.symbol) ?? readString(info.symbol) ?? 'UNKNOWN',
    side: readString(order.side) ?? readString(info.side) ?? null,
    type: readString(order.type) ?? readString(info.type) ?? null,
    status: readString(order.status) ?? readString(info.status) ?? null,
    amount,
    filled,
    remaining,
    price: readNumber(order.price) ?? readNumber(info.price),
    timestamp: typeof timestampMs === 'number' ? new Date(timestampMs).toISOString() : null,
  };
};

export const normalizeExchangeTradeHistoryItem = (
  trade: Awaited<ReturnType<typeof fetchSupportedExchangeTradeHistoryRaw>>[number]
): ExchangeTradeHistoryItem => ({
  exchangeTradeId: trade.exchangeTradeId,
  exchangeOrderId: trade.exchangeOrderId,
  symbol: trade.symbol,
  side: trade.side,
  price: trade.price,
  quantity: trade.quantity,
  notional: trade.notional,
  feeCost: trade.feeCost,
  feeCurrency: trade.feeCurrency,
  feeRate: trade.feeRate,
  executedAt: trade.executedAt ? trade.executedAt.toISOString() : null,
});
