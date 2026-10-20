import { Exchange, Prisma, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import type { LiveFillCandidate } from '../orders/orders.liveFillCandidates.service';
import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';
import type { CcxtFuturesOrderFill, CcxtFuturesOrderResult } from './ccxtFuturesConnector.types';

type ReadConnector = {
  fetchOrderWithFills(input: { symbol: string; orderId: string }): Promise<{
    order: CcxtFuturesOrderResult;
    fills: NonNullable<CcxtFuturesOrderResult['fills']>;
  }>;
  fetchOrderByClientOrderId(input: { symbol: string; clientOrderId: string }): Promise<CcxtFuturesOrderResult>;
  fetchClosedOrdersPage(input: {
    symbol: string; since: number; until: number; page: number; limit: number;
    marketType: 'SPOT' | 'FUTURES';
  }): Promise<CcxtFuturesOrderResult[]>;
  fetchTradesForOrder?(input: { symbol: string; orderId: string;
    since?: number; limit?: number }): Promise<NonNullable<CcxtFuturesOrderResult['fills']>>;
  disconnect(): Promise<void>;
};

export type LiveFillLookupResult =
  | {
      kind: 'FOUND'; candidate: LiveFillCandidate; apiKeyId: string;
      order: CcxtFuturesOrderResult; lookupSource: 'ORDER_ID' | 'CLIENT_ID' | 'GATE_SPOT_HISTORY' | 'GATE_FUTURES_HISTORY';
    }
  | {
      kind: 'UNKNOWN'; candidate: LiveFillCandidate;
      reason: 'IDENTITY_MISSING' | 'IDENTITY_CHANGED' | 'ACCOUNT_UNAVAILABLE' |
        'VENUE_UNSUPPORTED' | 'LOOKUP_FAILED' | 'HISTORY_AMBIGUOUS' | 'HISTORY_INCOMPLETE' |
        'LOCAL_FILLED_QUANTITY_INVALID';
    };

const normalizedSymbol = (value: string) => value.split(':')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
const rawClientId = (order: CcxtFuturesOrderResult): string | null => {
  const raw = order.raw as Record<string, unknown> | null;
  const info = raw?.info as Record<string, unknown> | undefined;
  const value = raw?.clientOrderId ?? info?.clientOrderId ?? info?.text;
  return typeof value === 'string' ? value.replace(/^t-/, '') : null;
};
const matches = (candidate: LiveFillCandidate, order: CcxtFuturesOrderResult, requireClientId: boolean) =>
  Boolean(order.id) &&
  (!candidate.exchangeOrderId || candidate.exchangeOrderId === order.id) &&
  (!order.symbol || normalizedSymbol(order.symbol) === normalizedSymbol(candidate.symbol)) &&
  (!candidate.side || !order.side || order.side.toUpperCase() === candidate.side) &&
  (!requireClientId || (candidate.clientOrderId != null && rawClientId(order) === candidate.clientOrderId)) &&
  (!rawClientId(order) || !candidate.clientOrderId || rawClientId(order) === candidate.clientOrderId);

const quantityMatches = (left: number, right: number, count: number) =>
  Number.isFinite(left) && Number.isFinite(right) &&
  Math.abs(left - right) <= 16 * Number.EPSILON *
    Math.max(Math.abs(left), Math.abs(right)) * Math.max(1, count);
const trustedTradeTime = (fill: CcxtFuturesOrderFill) =>
  fill.source === 'fetchMyTrades' && fill.executedAt != null &&
  Number.isFinite(fill.executedAt.getTime()) && fill.executedAt.getTime() > 0;
const compatibleFill = (left: CcxtFuturesOrderFill, right: CcxtFuturesOrderFill) =>
  normalizedSymbol(left.symbol) === normalizedSymbol(right.symbol) &&
  (!left.side || !right.side || left.side.toUpperCase() === right.side.toUpperCase()) &&
  (!left.exchangeOrderId || !right.exchangeOrderId ||
    left.exchangeOrderId === right.exchangeOrderId) &&
  quantityMatches(left.quantity, right.quantity, 1) &&
  quantityMatches(left.price, right.price, 1) &&
  (left.feeCost == null || right.feeCost == null ||
    quantityMatches(left.feeCost, right.feeCost, 1)) &&
  (!left.feeCurrency || !right.feeCurrency || left.feeCurrency === right.feeCurrency);

// Complete aggregate fills can carry fees but no trusted execution time. Only
// replace them with order-scoped trades when every aggregate row has exactly
// one matching trade. ID-less identical rows cannot establish that mapping.
const alignCompleteFills = (inline: CcxtFuturesOrderFill[],
  trades: CcxtFuturesOrderFill[]): number[] | null => {
  if (inline.length !== trades.length) return null;
  const used = new Set<number>();
  const match: number[] = [];
  for (const row of inline) {
    const candidates = trades.flatMap((trade, index) =>
      !used.has(index) && compatibleFill(row, trade) &&
      (!row.exchangeTradeId || row.exchangeTradeId === trade.exchangeTradeId)
        ? [index] : []);
    if (candidates.length !== 1) return null;
    match.push(candidates[0]);
    used.add(candidates[0]);
  }
  return match;
};

export const resolveLiveFillCredentials = async (
  candidate: LiveFillCandidate,
  db: Pick<Prisma.TransactionClient, 'liveOrderIntent' | 'order' | 'bot' | 'wallet' | 'apiKey'> = prisma
): Promise<
  | { kind: 'OK'; apiKeyId: string; exchange: Exchange; marketType: TradeMarket; apiKey: string; apiSecret: string }
  | { kind: 'UNKNOWN'; reason: Extract<LiveFillLookupResult, {kind: 'UNKNOWN'}>['reason'] }
> => {
  if (!candidate.intentId || !candidate.exchange || !candidate.marketType || !candidate.clientOrderId) {
    return { kind: 'UNKNOWN', reason: 'IDENTITY_MISSING' };
  }
  const intent = await db.liveOrderIntent.findUnique({ where: { id: candidate.intentId } });
  if (!intent || intent.userId !== candidate.userId || intent.clientOrderId !== candidate.clientOrderId ||
      intent.exchange !== candidate.exchange || intent.marketType !== candidate.marketType ||
      intent.symbol !== candidate.symbol || intent.createdAt.getTime() !== candidate.createdAt.getTime()) {
    return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
  }
  const localOrder = await db.order.findUnique({ where: { id: candidate.orderId },
    select: { userId: true, exchangeOrderId: true, symbol: true } });
  if ((candidate.exchangeOrderId != null &&
        (localOrder?.exchangeOrderId ?? null) !== candidate.exchangeOrderId) ||
      (localOrder && (localOrder.userId !== candidate.userId ||
        normalizedSymbol(localOrder.symbol) !== normalizedSymbol(candidate.symbol)))) {
    return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
  }
  const payload = intent.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as Record<string, unknown> : null;
  const payloadBotId = typeof payload?.botId === 'string' ? payload.botId : null;
  const payloadWalletId = typeof payload?.walletId === 'string' ? payload.walletId : null;
  if (payloadBotId !== candidate.botId || payloadWalletId !== candidate.walletId) {
    return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
  }
  let apiKeyId: string | null = null;
  if (candidate.botId) {
    const bot = await db.bot.findFirst({ where: { id: candidate.botId, userId: candidate.userId },
      select: { apiKeyId: true, walletId: true, exchange: true, marketType: true, updatedAt: true } });
    if (!bot || bot.updatedAt > intent.createdAt || bot.exchange !== intent.exchange ||
        bot.marketType !== intent.marketType || bot.walletId !== candidate.walletId) {
      return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
    }
    apiKeyId = bot.apiKeyId;
  }
  if (!apiKeyId && candidate.walletId) {
    const wallet = await db.wallet.findFirst({ where: { id: candidate.walletId, userId: candidate.userId },
      select: { apiKeyId: true, exchange: true, marketType: true, mode: true, updatedAt: true } });
    if (!wallet || wallet.updatedAt > intent.createdAt || wallet.exchange !== intent.exchange ||
        wallet.marketType !== intent.marketType || wallet.mode !== 'LIVE') {
      return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
    }
    apiKeyId = wallet.apiKeyId;
  }
  if (!apiKeyId) return { kind: 'UNKNOWN', reason: 'IDENTITY_MISSING' };
  const boundCredential = intent.apiKeyId != null && intent.apiKeyCredentialVersion != null;
  if (boundCredential && apiKeyId !== intent.apiKeyId) {
    return { kind: 'UNKNOWN', reason: 'ACCOUNT_UNAVAILABLE' };
  }
  const key = await db.apiKey.findFirst({ where: { id: apiKeyId, userId: candidate.userId },
    select: { id: true, exchange: true, apiKey: true, apiSecret: true,
      updatedAt: true, credentialVersion: true } });
  if (!key || key.exchange !== intent.exchange ||
      (boundCredential
        ? key.credentialVersion !== intent.apiKeyCredentialVersion
        : key.updatedAt > intent.createdAt)) {
    return { kind: 'UNKNOWN', reason: 'ACCOUNT_UNAVAILABLE' };
  }
  return { kind: 'OK', apiKeyId: key.id, exchange: intent.exchange,
    marketType: intent.marketType, apiKey: key.apiKey, apiSecret: key.apiSecret };
};

const defaultConnector = (credentials: {
  exchange: Exchange; marketType: TradeMarket; apiKey: string; apiSecret: string;
}): ReadConnector => resolveExchangeAdapterRegistryEntry(credentials).account.createAuthenticatedConnector(credentials);

export const lookupLiveFillCandidate = async (
  candidate: LiveFillCandidate,
  deps: { createConnector: typeof defaultConnector } = { createConnector: defaultConnector }
): Promise<LiveFillLookupResult> => {
  if (candidate.localStatus === 'FILLED' &&
      (candidate.localFilledQuantity == null || !Number.isFinite(candidate.localFilledQuantity) ||
        candidate.localFilledQuantity <= 0)) {
    return { kind: 'UNKNOWN', candidate, reason: 'LOCAL_FILLED_QUANTITY_INVALID' };
  }
  let credentials: Awaited<ReturnType<typeof resolveLiveFillCredentials>>;
  try { credentials = await resolveLiveFillCredentials(candidate); }
  catch { return { kind: 'UNKNOWN', candidate, reason: 'ACCOUNT_UNAVAILABLE' }; }
  if (credentials.kind === 'UNKNOWN') return { kind: 'UNKNOWN', candidate, reason: credentials.reason };
  if (!(['BINANCE', 'GATEIO'] as Exchange[]).includes(credentials.exchange)) {
    return { kind: 'UNKNOWN', candidate, reason: 'VENUE_UNSUPPORTED' };
  }
  let connector: ReadConnector;
  try { connector = deps.createConnector(credentials); }
  catch { return { kind: 'UNKNOWN', candidate, reason: 'VENUE_UNSUPPORTED' }; }
  try {
    const withCompleteFills = async (order: CcxtFuturesOrderResult) => {
      const inline = order.fills ?? [];
      const inlineQuantity = inline.reduce((sum, fill) => sum + fill.quantity, 0);
      if (!order.filled || !connector.fetchTradesForOrder) return order;
      const inlineComplete = quantityMatches(inlineQuantity, order.filled, inline.length);
      if (inlineComplete && inline.every(trustedTradeTime)) return order;
      try {
        const trades = await connector.fetchTradesForOrder({ symbol: candidate.symbol,
          orderId: order.id, since: Math.max(0, candidate.createdAt.getTime() - 60_000), limit: 1000 });
        const tradeQuantity = trades.reduce((sum, fill) => sum + fill.quantity, 0);
        if (quantityMatches(tradeQuantity, order.filled, trades.length) &&
            trades.every((fill) => !fill.exchangeOrderId || fill.exchangeOrderId === order.id) &&
            trades.every((fill) => normalizedSymbol(fill.symbol) === normalizedSymbol(candidate.symbol))) {
          const alignment = inlineComplete ? alignCompleteFills(inline, trades) : [];
          if (!alignment) return order;
          const inlineByTradeIndex = new Map(alignment.map((tradeIndex, inlineIndex) =>
            [tradeIndex, inline[inlineIndex]]));
          return { ...order, fills: trades.map((fill, index) => {
            const prior = inlineByTradeIndex.get(index);
            return prior?.feeCost != null && fill.feeCost == null
              ? { ...fill, feeCost: prior.feeCost, feeCurrency: prior.feeCurrency } : fill;
          }) };
        }
      } catch { /* The finalizer will reject incomplete fill evidence. */ }
      return order;
    };
    if (candidate.exchangeOrderId) {
      const snapshot = await connector.fetchOrderWithFills({ symbol: candidate.symbol, orderId: candidate.exchangeOrderId });
      if (matches(candidate, snapshot.order, false)) {
        return { kind: 'FOUND', candidate, apiKeyId: credentials.apiKeyId,
          order: await withCompleteFills({ ...snapshot.order, fills: snapshot.fills }),
          lookupSource: 'ORDER_ID' };
      }
      return { kind: 'UNKNOWN', candidate, reason: 'IDENTITY_CHANGED' };
    }
    try {
      const order = await connector.fetchOrderByClientOrderId({
        symbol: candidate.symbol, clientOrderId: candidate.clientOrderId!,
      });
      if (matches(candidate, order, true)) {
        return { kind: 'FOUND', candidate, apiKeyId: credentials.apiKeyId,
          order: await withCompleteFills(order), lookupSource: 'CLIENT_ID' };
      }
      return { kind: 'UNKNOWN', candidate, reason: 'IDENTITY_CHANGED' };
    } catch {
      if (credentials.exchange !== 'GATEIO') {
        return { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' };
      }
    }
    const since = Math.max(0, candidate.createdAt.getTime() - 60_000);
    const until = Math.min(Date.now(), candidate.createdAt.getTime() + 24 * 60 * 60_000);
    const found = new Map<string, CcxtFuturesOrderResult>();
    const limit = 100;
    for (let page = 1; page <= 3; page += 1) {
      let orders: CcxtFuturesOrderResult[];
      try {
        orders = await connector.fetchClosedOrdersPage({ symbol: candidate.symbol,
          since, until, page, limit, marketType: credentials.marketType });
      } catch { return { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' }; }
      for (const order of orders) {
        if (rawClientId(order) === candidate.clientOrderId &&
            /^\d+$/.test(order.id) && matches(candidate, order, true)) found.set(order.id, order);
      }
      if (found.size > 1) return { kind: 'UNKNOWN', candidate, reason: 'HISTORY_AMBIGUOUS' };
      if (orders.length < limit) {
        const order = [...found.values()][0];
        if (!order) return { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' };
        let snapshot = order;
        try {
          const numeric = await connector.fetchOrderWithFills({ symbol: candidate.symbol, orderId: order.id });
          if (numeric.order.id !== order.id || !matches(candidate, numeric.order, false)) {
            return { kind: 'UNKNOWN', candidate, reason: 'IDENTITY_CHANGED' };
          }
          snapshot = { ...numeric.order, fills: numeric.fills };
        } catch { /* History still supplies a verified numeric identity. */ }
        return { kind: 'FOUND', candidate, apiKeyId: credentials.apiKeyId,
          order: await withCompleteFills(snapshot),
          lookupSource: credentials.marketType === 'SPOT'
            ? 'GATE_SPOT_HISTORY' : 'GATE_FUTURES_HISTORY' };
      }
    }
    return { kind: 'UNKNOWN', candidate, reason: 'HISTORY_INCOMPLETE' };
  } catch {
    return { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' };
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};
