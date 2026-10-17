import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Exchange, TradeMarket } from '@prisma/client';
import type { LiveFillCandidate } from '../orders/orders.liveFillCandidates.service';

const db = vi.hoisted(() => ({
  liveOrderIntent: { findUnique: vi.fn(), findMany: vi.fn() },
  bot: { findFirst: vi.fn() },
  wallet: { findFirst: vi.fn() },
  apiKey: { findFirst: vi.fn() },
  order: { findMany: vi.fn(), findUnique: vi.fn() },
}));
vi.mock('../../prisma/client', () => ({ prisma: db }));

import { lookupLiveFillCandidate } from './liveFillLookup.service';
import { findLiveFillCandidatePage } from '../orders/orders.liveFillCandidates.service';

const createdAt = new Date('2026-10-17T10:00:00.000Z');
const earlier = new Date('2026-10-17T09:00:00.000Z');
const candidate = (exchange: Exchange, marketType: TradeMarket): LiveFillCandidate => ({
  intentId: 'intent-1', orderId: 'intent-1', userId: 'user-1', exchange, marketType,
  symbol: 'BTCUSDT', clientOrderId: 'soar_abc', exchangeOrderId: null,
  createdAt, botId: 'bot-1', walletId: null, side: 'BUY', quantity: 1,
  localStatus: null, feePending: false,
});
const order = (id = '1234', clientId = 'soar_abc') => ({
  id, status: 'closed', symbol: 'BTC/USDT:USDT', side: 'buy', filled: 1,
  raw: { clientOrderId: clientId }, fills: [],
});
const connector = () => ({
  fetchOrderWithFills: vi.fn().mockResolvedValue({ order: order(), fills: [] }),
  fetchOrderByClientOrderId: vi.fn().mockResolvedValue(order()),
  fetchClosedOrdersPage: vi.fn().mockResolvedValue([]),
  disconnect: vi.fn().mockResolvedValue(undefined),
});
const deps = (read: ReturnType<typeof connector>) => ({ createConnector: vi.fn().mockReturnValue(read) });

beforeEach(() => {
  vi.clearAllMocks();
  db.order.findUnique.mockResolvedValue(null);
  db.liveOrderIntent.findUnique.mockImplementation(async () => ({
    id: 'intent-1', userId: 'user-1', clientOrderId: 'soar_abc',
    exchange: current.exchange, marketType: current.marketType, symbol: 'BTCUSDT', createdAt,
    payload: { botId: 'bot-1', walletId: null },
  }));
  db.bot.findFirst.mockImplementation(async () => ({
    apiKeyId: 'key-1', walletId: null, exchange: current.exchange,
    marketType: current.marketType, updatedAt: earlier,
  }));
  db.apiKey.findFirst.mockImplementation(async () => ({
    id: 'key-1', exchange: current.exchange, apiKey: 'test-key',
    apiSecret: 'test-secret', updatedAt: earlier,
  }));
});
const current: { exchange: Exchange; marketType: TradeMarket } =
  { exchange: 'BINANCE', marketType: 'SPOT' };

describe('read-only LIVE fill lookup', () => {
  it.each([
    ['BINANCE', 'SPOT'], ['BINANCE', 'FUTURES'],
    ['GATEIO', 'SPOT'], ['GATEIO', 'FUTURES'],
  ] as const)('looks up %s %s by persisted client ID', async (exchange, marketType) => {
    current.exchange = exchange; current.marketType = marketType;
    const read = connector();
    const result = await lookupLiveFillCandidate(candidate(exchange, marketType), deps(read));
    expect(result.kind).toBe('FOUND');
    if (result.kind === 'FOUND') expect(result.lookupSource).toBe('CLIENT_ID');
    expect(read.fetchOrderByClientOrderId).toHaveBeenCalledWith({
      symbol: 'BTCUSDT', clientOrderId: 'soar_abc',
    });
    expect(read.fetchClosedOrdersPage).not.toHaveBeenCalled();
    expect(read.disconnect).toHaveBeenCalledOnce();
  });

  it('uses a persisted numeric order ID after restart', async () => {
    current.exchange = 'GATEIO'; current.marketType = 'SPOT';
    db.order.findUnique.mockResolvedValueOnce({ userId: 'user-1',
      exchangeOrderId: '1234', symbol: 'BTCUSDT' });
    const read = connector();
    const input = { ...candidate('GATEIO', 'SPOT'), exchangeOrderId: '1234' };
    const result = await lookupLiveFillCandidate(input, deps(read));
    expect(result.kind).toBe('FOUND');
    expect(read.fetchOrderWithFills).toHaveBeenCalledWith({ symbol: 'BTCUSDT', orderId: '1234' });
    expect(read.fetchOrderByClientOrderId).not.toHaveBeenCalled();
  });

  it('recovers a quick finished Gate Spot order through bounded history', async () => {
    current.exchange = 'GATEIO'; current.marketType = 'SPOT';
    const read = connector();
    read.fetchOrderByClientOrderId.mockRejectedValue(new Error('finished text ID unavailable'));
    read.fetchClosedOrdersPage.mockResolvedValueOnce([order('1234')]);
    const result = await lookupLiveFillCandidate(candidate('GATEIO', 'SPOT'), deps(read));
    expect(result.kind).toBe('FOUND');
    if (result.kind === 'FOUND') expect(result.lookupSource).toBe('GATE_SPOT_HISTORY');
    expect(read.fetchClosedOrdersPage).toHaveBeenCalledWith(expect.objectContaining({
      page: 1, limit: 100, marketType: 'SPOT',
    }));
  });

  it('uses bounded Gate Futures history after a lost client-ID response', async () => {
    current.exchange = 'GATEIO'; current.marketType = 'FUTURES';
    const read = connector();
    read.fetchOrderByClientOrderId.mockRejectedValue(new Error('response lost'));
    read.fetchClosedOrdersPage.mockResolvedValueOnce([order('9911')]);
    const result = await lookupLiveFillCandidate(candidate('GATEIO', 'FUTURES'), deps(read));
    expect(result).toMatchObject({ kind: 'FOUND', lookupSource: 'GATE_FUTURES_HISTORY' });
    expect(read.fetchClosedOrdersPage).toHaveBeenCalledWith(expect.objectContaining({
      page: 1, limit: 100, marketType: 'FUTURES',
    }));
  });

  it('keeps missing and ambiguous Gate Spot history UNKNOWN', async () => {
    current.exchange = 'GATEIO'; current.marketType = 'SPOT';
    const read = connector();
    read.fetchOrderByClientOrderId.mockRejectedValue(new Error('not found'));
    expect((await lookupLiveFillCandidate(candidate('GATEIO', 'SPOT'), deps(read))).kind).toBe('UNKNOWN');
    read.fetchClosedOrdersPage.mockResolvedValueOnce([order('1234'), order('5678')]);
    expect(await lookupLiveFillCandidate(candidate('GATEIO', 'SPOT'), deps(read))).toMatchObject({
      kind: 'UNKNOWN', reason: 'HISTORY_AMBIGUOUS',
    });
  });

  it('keeps a capped history page UNKNOWN even when one ID was found', async () => {
    current.exchange = 'GATEIO'; current.marketType = 'SPOT';
    const read = connector();
    read.fetchOrderByClientOrderId.mockRejectedValue(new Error('finished'));
    const fullPage = [order('1234'), ...Array.from({ length: 99 }, (_, index) =>
      order(String(2000 + index), 'unrelated'))];
    read.fetchClosedOrdersPage.mockResolvedValue(fullPage);
    expect(await lookupLiveFillCandidate(candidate('GATEIO', 'SPOT'), deps(read))).toMatchObject({
      kind: 'UNKNOWN', reason: 'HISTORY_INCOMPLETE',
    });
    expect(read.fetchClosedOrdersPage).toHaveBeenCalledTimes(3);
  });

  it('does not trust an account changed since intent creation', async () => {
    current.exchange = 'BINANCE'; current.marketType = 'FUTURES';
    db.bot.findFirst.mockResolvedValueOnce({ apiKeyId: 'key-2', walletId: null,
      exchange: 'BINANCE', marketType: 'FUTURES', updatedAt: new Date('2026-10-17T11:00:00Z') });
    const read = connector();
    expect(await lookupLiveFillCandidate(candidate('BINANCE', 'FUTURES'), deps(read))).toMatchObject({
      kind: 'UNKNOWN', reason: 'IDENTITY_CHANGED',
    });
    expect(read.fetchOrderByClientOrderId).not.toHaveBeenCalled();
  });
});

describe('durable candidate page', () => {
  it('selects an unresolved intent and a local partial LIVE order after a fresh database read', async () => {
    db.liveOrderIntent.findMany
      .mockResolvedValueOnce([{ id: 'intent-1', userId: 'user-1', exchange: 'BINANCE',
        marketType: 'SPOT', symbol: 'BTCUSDT', clientOrderId: 'soar_abc',
        createdAt, payload: { botId: 'bot-1', side: 'BUY', quantity: 1 } }])
      .mockResolvedValueOnce([]);
    db.order.findMany
      .mockResolvedValueOnce([{ id: 'local-2', userId: 'user-1', symbol: 'ETHUSDT',
        exchangeOrderId: '1234', submittedAt: createdAt, createdAt,
        botId: 'bot-1', walletId: null, side: 'BUY', quantity: 2,
        status: 'PARTIALLY_FILLED', filledQuantity: 1, feePending: true,
        feeSource: 'ESTIMATED', _count: { fills: 1, trades: 0 } }])
      .mockResolvedValueOnce([]);
    const page = await findLiveFillCandidatePage();
    expect(page.candidates.map((row) => [row.orderId, row.localStatus])).toEqual([
      ['intent-1', null], ['local-2', 'PARTIALLY_FILLED'],
    ]);
    expect(page.candidates[1].exchange).toBeNull();
  });
});
