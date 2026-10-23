import type { Exchange, TradeMarket } from '@prisma/client';
import { fetchSupportedExchangeTradeHistoryRaw } from '../exchange/exchangeAdapterBoundary.service';
import { isMatchingGateFuturesEconomics } from '../exchange/gateFuturesEconomics';
import {
  ExchangeOpenOrderSnapshotItem,
  ExchangePositionSnapshotItem,
  ExchangeTradeHistoryItem,
} from './positions.exchangeSnapshot.types';

type ExchangePositionLike = {
  symbol?: string;
  side?: string;
  contracts?: number;
  contractSize?: number;
  gateFuturesEconomics?: unknown;
  initialMargin?: number;
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

type PositionMarketContext = { exchange: Exchange; marketType: TradeMarket };

const resolvePositionContractSize = (
  position: ExchangePositionLike, info: Record<string, unknown>, context: PositionMarketContext,
): number => {
  if (context.marketType !== 'FUTURES') return 1;
  // CCXT resolves this from the exact futures market; raw Gate position info has no multiplier.
  const contractSize = readNumber(position.contractSize);
  if (contractSize == null || contractSize <= 0) {
    throw new Error('EXCHANGE_FUTURES_CONTRACT_UNIT_UNVERIFIED');
  }
  for (const key of ['contractSize', 'quanto_multiplier']) {
    if (info[key] != null && readNumber(info[key]) !== contractSize) {
      throw new Error('EXCHANGE_FUTURES_CONTRACT_UNIT_UNVERIFIED');
    }
  }
  if (context.exchange === 'GATEIO') {
    const proof = position.gateFuturesEconomics;
    if (!isMatchingGateFuturesEconomics(proof, contractSize, position.symbol?.split(':', 1)[0]) ||
        (proof as { marketSymbol?: unknown }).marketSymbol !== position.symbol) {
      throw new Error('EXCHANGE_FUTURES_CONTRACT_UNIT_UNVERIFIED');
    }
    const contract = readString(info.contract);
    const symbol = position.symbol?.split(':', 1)[0];
    const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!contract || !symbol || normalize(contract) !== normalize(symbol)) {
      throw new Error('EXCHANGE_FUTURES_CONTRACT_UNIT_UNVERIFIED');
    }
  }
  return contractSize;
};

const deriveExchangePositionNotional = (
  position: ExchangePositionLike, info: Record<string, unknown>, contractSize: number,
): number | null => {
  const contracts = deriveExchangePositionContracts(position, info);
  const price = readNumber(position.markPrice) ?? readNumber(info.markPrice) ??
    readNumber(position.entryPrice) ?? readNumber(info.entryPrice);
  // Derive quote value from the verified unit; raw notional fields may use another scale.
  const notional = contracts * contractSize * (price ?? 0);
  return Number.isFinite(notional) && notional > 0 ? notional : null;
};

const deriveExchangePositionLeverage = (
  position: ExchangePositionLike, info: Record<string, unknown>, notional: number | null,
) => {
  const explicitLeverage = readNumber(position.leverage) ?? readNumber(info.leverage);
  if (explicitLeverage != null && explicitLeverage > 0) return explicitLeverage;
  const margin =
    Math.abs(
      readNumber(position.initialMargin) ?? readNumber(info.initialMargin) ??
        readNumber(info.initial_margin) ?? readNumber(info.positionInitialMargin) ??
        readNumber(info.isolatedMargin) ?? readNumber(info.isolatedWallet) ?? 0
    ) || 0;
  return notional != null && margin > 0 ? notional / margin : null;
};

const deriveExchangePositionMarginUsed = (
  position: ExchangePositionLike, info: Record<string, unknown>,
  notional: number | null, leverage: number | null,
) => {
  const isolatedMarginMode = isIsolatedMarginMode(position, info);
  const isolatedCandidates = [
    readNumber(info.isolatedWallet),
    readNumber(info.isolatedMargin),
    readNumber(info.positionInitialMargin),
    readNumber(position.initialMargin),
    readNumber(info.initialMargin),
    readNumber(info.initial_margin),
  ]
    .filter((value): value is number => value != null && value > 0)
    .map((value) => Math.abs(value));
  const explicitMargin = isolatedMarginMode
    ? (isolatedCandidates.length > 0 ? Math.max(...isolatedCandidates) : null)
    : readNumber(position.initialMargin) ??
      readNumber(info.initialMargin) ?? readNumber(info.initial_margin) ??
      readNumber(info.positionInitialMargin) ??
      readNumber(info.isolatedMargin) ??
      readNumber(info.isolatedWallet);
  if (explicitMargin != null && explicitMargin > 0) return Math.abs(explicitMargin);
  return leverage != null && leverage > 0 && notional != null ? notional / leverage : null;
};

export const normalizeExchangePosition = (
  position: ExchangePositionLike, context: PositionMarketContext,
): ExchangePositionSnapshotItem => {
  const info = (position.info ?? {}) as Record<string, unknown>;
  const contractSize = resolvePositionContractSize(position, info, context);
  const notional = deriveExchangePositionNotional(position, info, contractSize);
  const leverage = deriveExchangePositionLeverage(position, info, notional);
  const timestampMs = readNumber(position.timestamp) ?? readNumber(info.updateTime) ?? readNumber(info.time);
  return {
    symbol: position.symbol ?? readString(info.symbol) ?? 'UNKNOWN',
    side: deriveExchangePositionSide(position, info),
    contracts: deriveExchangePositionContracts(position, info),
    entryPrice: readNumber(position.entryPrice) ?? readNumber(info.entryPrice),
    markPrice: readNumber(position.markPrice) ?? readNumber(info.markPrice),
    unrealizedPnl: readNumber(position.unrealizedPnl) ?? readNumber(info.unRealizedProfit),
    marginUsed: deriveExchangePositionMarginUsed(position, info, notional, leverage),
    leverage,
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
