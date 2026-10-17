import { Exchange, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import type { LiveFillCandidate } from '../orders/orders.liveFillCandidates.service';
import { resolveExchangeAdapterRegistryEntry } from './exchangeAdapterRegistry.service';
import type { CcxtFuturesOrderResult } from './ccxtFuturesConnector.types';

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

const resolveCredentials = async (candidate: LiveFillCandidate): Promise<
  | { kind: 'OK'; apiKeyId: string; exchange: Exchange; marketType: TradeMarket; apiKey: string; apiSecret: string }
  | { kind: 'UNKNOWN'; reason: Extract<LiveFillLookupResult, {kind: 'UNKNOWN'}>['reason'] }
> => {
  if (!candidate.intentId || !candidate.exchange || !candidate.marketType || !candidate.clientOrderId) {
    return { kind: 'UNKNOWN', reason: 'IDENTITY_MISSING' };
  }
  const intent = await prisma.liveOrderIntent.findUnique({ where: { id: candidate.intentId } });
  if (!intent || intent.userId !== candidate.userId || intent.clientOrderId !== candidate.clientOrderId ||
      intent.exchange !== candidate.exchange || intent.marketType !== candidate.marketType ||
      intent.symbol !== candidate.symbol || intent.createdAt.getTime() !== candidate.createdAt.getTime()) {
    return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
  }
  const localOrder = await prisma.order.findUnique({ where: { id: candidate.orderId },
    select: { userId: true, exchangeOrderId: true, symbol: true } });
  if ((localOrder?.exchangeOrderId ?? null) !== candidate.exchangeOrderId ||
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
    const bot = await prisma.bot.findFirst({ where: { id: candidate.botId, userId: candidate.userId },
      select: { apiKeyId: true, walletId: true, exchange: true, marketType: true, updatedAt: true } });
    if (!bot || bot.updatedAt > intent.createdAt || bot.exchange !== intent.exchange ||
        bot.marketType !== intent.marketType || bot.walletId !== candidate.walletId) {
      return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
    }
    apiKeyId = bot.apiKeyId;
  }
  if (!apiKeyId && candidate.walletId) {
    const wallet = await prisma.wallet.findFirst({ where: { id: candidate.walletId, userId: candidate.userId },
      select: { apiKeyId: true, exchange: true, marketType: true, mode: true, updatedAt: true } });
    if (!wallet || wallet.updatedAt > intent.createdAt || wallet.exchange !== intent.exchange ||
        wallet.marketType !== intent.marketType || wallet.mode !== 'LIVE') {
      return { kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED' };
    }
    apiKeyId = wallet.apiKeyId;
  }
  if (!apiKeyId) return { kind: 'UNKNOWN', reason: 'IDENTITY_MISSING' };
  const key = await prisma.apiKey.findFirst({ where: { id: apiKeyId, userId: candidate.userId },
    select: { id: true, exchange: true, apiKey: true, apiSecret: true, updatedAt: true } });
  if (!key || key.exchange !== intent.exchange || key.updatedAt > intent.createdAt) {
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
  let credentials: Awaited<ReturnType<typeof resolveCredentials>>;
  try { credentials = await resolveCredentials(candidate); }
  catch { return { kind: 'UNKNOWN', candidate, reason: 'ACCOUNT_UNAVAILABLE' }; }
  if (credentials.kind === 'UNKNOWN') return { kind: 'UNKNOWN', candidate, reason: credentials.reason };
  if (!(['BINANCE', 'GATEIO'] as Exchange[]).includes(credentials.exchange)) {
    return { kind: 'UNKNOWN', candidate, reason: 'VENUE_UNSUPPORTED' };
  }
  let connector: ReadConnector;
  try { connector = deps.createConnector(credentials); }
  catch { return { kind: 'UNKNOWN', candidate, reason: 'VENUE_UNSUPPORTED' }; }
  try {
    if (candidate.exchangeOrderId) {
      const snapshot = await connector.fetchOrderWithFills({ symbol: candidate.symbol, orderId: candidate.exchangeOrderId });
      if (matches(candidate, snapshot.order, false)) {
        return { kind: 'FOUND', candidate, apiKeyId: credentials.apiKeyId,
          order: { ...snapshot.order, fills: snapshot.fills }, lookupSource: 'ORDER_ID' };
      }
      return { kind: 'UNKNOWN', candidate, reason: 'IDENTITY_CHANGED' };
    }
    try {
      const order = await connector.fetchOrderByClientOrderId({
        symbol: candidate.symbol, clientOrderId: candidate.clientOrderId!,
      });
      if (matches(candidate, order, true)) {
        return { kind: 'FOUND', candidate, apiKeyId: credentials.apiKeyId,
          order, lookupSource: 'CLIENT_ID' };
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
        return order
          ? { kind: 'FOUND', candidate, apiKeyId: credentials.apiKeyId,
              order, lookupSource: credentials.marketType === 'SPOT'
                ? 'GATE_SPOT_HISTORY' : 'GATE_FUTURES_HISTORY' }
          : { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' };
      }
    }
    return { kind: 'UNKNOWN', candidate, reason: 'HISTORY_INCOMPLETE' };
  } catch {
    return { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' };
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};
