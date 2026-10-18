import { randomUUID } from 'node:crypto';
import type { Exchange, TradeMarket } from '@prisma/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import type { LiveFillCandidate } from './orders.liveFillCandidates.service';
import { CcxtFuturesConnector } from '../exchange/ccxtFuturesConnector.service';
import type { CcxtExchangeLikeClient } from '../exchange/ccxtFuturesConnector.service';
import type { CcxtFuturesOrderFill, CcxtFuturesOrderResult } from '../exchange/ccxtFuturesConnector.types';
import { lookupLiveFillCandidate, type LiveFillLookupResult } from '../exchange/liveFillLookup.service';
import { findLiveFillCandidatePage } from './orders.liveFillCandidates.service';
import { recoverLiveFillCandidateOnce } from './orders.liveFillRecovery.service';
import { applyLiveExchangeAccountUpdateEvent,
  applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { RuntimePositionAutomationService } from '../engine/runtimePositionAutomation.service';
import { selectRuntimeDisplayState } from '../bots/runtimeSessionPositionsRead.service';
import type { RuntimeManagedPosition } from '../engine/runtimePositionAutomation.types';

const userIds: string[] = [];
afterEach(async () => {
  for (const userId of userIds.splice(0)) {
    const positions = await prisma.position.findMany({ where: { userId }, select: { id: true } });
    for (const position of positions) await runtimePositionStateStore.deletePositionRuntimeState(position.id);
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.botRuntimeSymbolStat.deleteMany({ where: { userId } });
    await prisma.botRuntimeEvent.deleteMany({ where: { userId } });
    await prisma.runtimeExecutionDedupe.deleteMany({ where: { userId } });
    await prisma.orderFill.deleteMany({ where: { userId } });
    await prisma.trade.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.liveOrderIntent.deleteMany({ where: { userId } });
    await prisma.position.deleteMany({ where: { userId } });
    await prisma.botRuntimeSession.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.apiKey.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

const fixture = async (action: 'OPEN' | 'DCA' | 'CLOSE', withOrder = true,
  context: { exchange: Exchange; marketType: TradeMarket } =
    { exchange: 'BINANCE', marketType: 'FUTURES' }) => {
  const id = randomUUID();
  const user = await prisma.user.create({ data: {
    email: `live-fill-recovery-${id}@example.com`, password: 'hashed',
  } });
  userIds.push(user.id);
  const key = await prisma.apiKey.create({ data: {
    userId: user.id, label: id, exchange: context.exchange,
    apiKey: 'test-key', apiSecret: 'test-secret',
  } });
  const wallet = await prisma.wallet.create({ data: {
    userId: user.id, name: id, mode: 'LIVE', exchange: context.exchange,
    marketType: context.marketType, apiKeyId: key.id,
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: id, mode: 'LIVE', exchange: context.exchange,
    marketType: context.marketType, walletId: wallet.id, apiKeyId: key.id,
    positionMode: 'ONE_WAY', isActive: true, liveOptIn: true,
  } });
  const position = action === 'OPEN' ? null : await prisma.position.create({ data: {
    userId: user.id, botId: bot.id, walletId: wallet.id,
    symbol: 'BTCUSDT', side: 'LONG', status: 'OPEN', quantity: 1,
    entryPrice: 100, origin: 'BOT', managementMode: 'BOT_MANAGED',
  } });
  const dedupeKey = `v1|${action}|${id}`;
  const intent = await prisma.liveOrderIntent.create({ data: {
    userId: user.id, clientOrderId: `soar_${id.replace(/-/g, '').slice(0, 22)}`,
    payloadHash: id, exchange: context.exchange, marketType: context.marketType,
    symbol: 'BTCUSDT',
    payload: { mode: 'LIVE', origin: 'BOT', botId: bot.id, walletId: wallet.id,
      positionId: position?.id ?? null, side: action === 'CLOSE' ? 'SELL' : 'BUY',
      type: 'MARKET', quantity: 1, symbol: 'BTCUSDT', price: 100, runtimeDedupeKey: dedupeKey },
  } });
  const venueId = context.exchange === 'GATEIO'
    ? String(parseInt(id.slice(0, 8), 16)) : `venue-${id}`;
  if (withOrder) await prisma.order.create({ data: {
    id: intent.id, userId: user.id, botId: bot.id, walletId: wallet.id,
    positionId: position?.id ?? null, origin: 'BOT',
    symbol: 'BTCUSDT', side: action === 'CLOSE' ? 'SELL' : 'BUY',
    type: 'MARKET', status: 'OPEN', quantity: 1,
    filledQuantity: 0, feePending: true, exchangeOrderId: venueId,
  } });
  await prisma.runtimeExecutionDedupe.create({ data: {
    dedupeKey, dedupeVersion: 'v1', commandType: action,
    userId: user.id, botId: bot.id, symbol: 'BTCUSDT', status: 'PENDING',
    orderId: withOrder ? intent.id : null, positionId: position?.id ?? null,
    commandFingerprint: { positionId: position?.id ?? null, dcaLevelIndex: 0 },
    ttlExpiresAt: new Date(Date.now() + 86_400_000),
  } });
  const candidate = (await findLiveFillCandidatePage()).candidates.find((item) => item.orderId === intent.id)!;
  return { user, key, wallet, bot, position, intent, venueId, dedupeKey, candidate };
};

const fill = (venueId: string, id: string, quantity: number, feeCost: number | null,
  side = 'buy', price = 100): CcxtFuturesOrderFill => ({
  exchangeTradeId: id, exchangeOrderId: venueId, symbol: 'BTCUSDT', side,
  price, quantity, notional: price * quantity, feeCost, feeCurrency: 'USDT',
  feeRate: null, executedAt: new Date('2026-10-18T08:00:00Z'),
  source: 'fetchMyTrades', raw: { id },
});
const found = (candidate: LiveFillCandidate, apiKeyId: string, venueId: string,
  filled: number, fills: CcxtFuturesOrderFill[], status = 'closed'): Extract<LiveFillLookupResult, { kind: 'FOUND' }> => ({
  kind: 'FOUND', candidate, apiKeyId, lookupSource: 'ORDER_ID',
  order: { id: venueId, symbol: 'BTC/USDT:USDT',
    side: candidate.side?.toLowerCase(), status, filled, fills,
    raw: { clientOrderId: candidate.clientOrderId } } satisfies CcxtFuturesOrderResult,
});
const useLookup = (result: LiveFillLookupResult) => vi.fn(async () => result);

const adapterLookup = (fx: Awaited<ReturnType<typeof fixture>>,
  trades: Array<Record<string, unknown>>,
  orderState: { status: 'open' | 'closed'; filled: number } =
    { status: 'closed', filled: 1 },
  inlineTrades: Array<Record<string, unknown>> = []) => {
  const client = {
    loadMarkets: vi.fn(async () => ({ 'BTC/USDT:USDT': {
      id: 'BTCUSDT', symbol: 'BTC/USDT:USDT', swap: true,
    } })),
    fetchOrder: vi.fn(async () => ({ id: fx.venueId, status: orderState.status,
      symbol: 'BTC/USDT:USDT', side: fx.candidate.side?.toLowerCase(), type: 'market',
      amount: 1, filled: orderState.filled, average: 90, trades: inlineTrades })),
    fetchMyTrades: vi.fn(async () => trades),
    createOrder: vi.fn(),
    close: vi.fn(async () => undefined),
  };
  const connector = new CcxtFuturesConnector({ exchangeId: 'binance',
    marketType: 'swap' }, async () => client as unknown as CcxtExchangeLikeClient);
  return { lookup: (candidate: LiveFillCandidate) => lookupLiveFillCandidate(candidate,
    { createConnector: () => connector }), client };
};

const createDbBackedAutomation = (fx: Awaited<ReturnType<typeof fixture>>) => {
  const executeDca = vi.fn(async () => ({ feePaid: 0, executed: false }));
  const closeByExitSignal = vi.fn(async () => ({ status: 'submitted' as const }));
  const service = new RuntimePositionAutomationService({
    listOpenPositionsBySymbol: async (symbol) => {
      const position = await prisma.position.findFirst({ where: {
        id: fx.position!.id, symbol, status: 'OPEN',
      } });
      return position ? [{ ...position, bot: {
        walletId: fx.wallet.id, liveOptIn: true,
        wallet: { mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
          baseCurrency: 'USDT', paperInitialBalance: 10_000 },
        symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
          exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
        } },
        botMarketGroups: [],
      } } as RuntimeManagedPosition] : [];
    },
    getStrategyConfigById: async () => null,
    getDurableDcaProgress: async () => ({
      currentAdds: await prisma.trade.count({ where: {
        positionId: fx.position!.id, lifecycleAction: 'DCA',
      } }),
    }),
    executeDca, closeByExitSignal,
    resolveDcaFundsExhausted: async () => false,
  });
  return { service, executeDca, closeByExitSignal };
};

const tick = { type: 'ticker' as const, exchange: 'BINANCE' as const,
  marketType: 'FUTURES' as const, symbol: 'BTCUSDT',
  eventTime: Date.now(), lastPrice: 95, priceChangePercent24h: 0 };

describe('explicit LIVE fill recovery', () => {
  it.each([
    ['untimed trade first', false], ['timed trade first', true],
  ] as const)('keeps a mixed-time DCA uncertain from adapter through automation: %s',
    async (_label, timedFirst) => {
      const fx = await fixture('DCA');
      const venueAt = Date.now() - 2_000;
      const untimed = { id: 'untimed', order: fx.venueId,
        symbol: 'BTC/USDT:USDT', side: 'buy', price: 90,
        amount: 0.4, cost: 36, fee: { cost: 0.04, currency: 'USDT' } };
      const timed = { id: 'timed', order: fx.venueId,
        symbol: 'BTC/USDT:USDT', side: 'buy', price: 90,
        amount: 0.6, cost: 54, timestamp: venueAt,
        fee: { cost: 0.06, currency: 'USDT' } };
      const rows = timedFirst ? [timed, untimed] : [untimed, timed];
      const adapter = adapterLookup(fx, rows);
      const inspected = await adapter.lookup(fx.candidate);
      expect(inspected.kind).toBe('FOUND');
      if (inspected.kind !== 'FOUND') throw new Error('adapter lookup failed');
      expect((inspected.order.fills ?? []).map((fill) => fill.executedAt?.getTime() ?? null))
        .toEqual(timedFirst ? [venueAt, null] : [null, venueAt]);
      const matching = { eventType: 'ACCOUNT_UPDATE' as const,
        marketType: 'FUTURES' as const, eventTime: venueAt + 1_000,
        transactionTime: venueAt + 1_000, balances: [], positions: [{
          symbol: 'BTCUSDT', amount: 2, entryPrice: 95,
          unrealizedPnl: 0, positionSide: 'LONG',
        }], raw: {} };
      await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
        sourceApiKeyId: fx.key.id, event: matching });
      expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .continuityState).toBe('RECOVERING');
      const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: adapter.lookup });
      expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED', fillCount: 2 });
      expect(await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .toMatchObject({ quantity: 2, entryPrice: 95,
          continuityState: 'RECOVERING', lastDcaFillTimeUncertain: true });
      const automation = createDbBackedAutomation(fx);
      await automation.service.handleTickerEvent(tick);
      expect(automation.executeDca).not.toHaveBeenCalled();
      expect(automation.closeByExitSignal).not.toHaveBeenCalled();
      expect(automation.service.getPositionStateSnapshot(fx.position!.id)).toBeNull();
      await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
        sourceApiKeyId: fx.key.id, event: { ...matching,
          eventTime: venueAt + 2_000, transactionTime: venueAt + 2_000 } });
      expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .continuityState).toBe('RECOVERING');
      const replay = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: adapterLookup(fx, rows).lookup });
      expect(replay.kind).toBe('APPLIED');
      expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
      expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);
    });

  it('retains an untimed partial polling fill across a later final lookup', async () => {
    const fx = await fixture('DCA');
    const venueAt = Date.now() - 2_000;
    const untimed = { id: 'first', order: fx.venueId,
      symbol: 'BTC/USDT:USDT', side: 'buy', price: 90, amount: 0.4 };
    const timed = { id: 'second', order: fx.venueId,
      symbol: 'BTC/USDT:USDT', side: 'buy', price: 90,
      amount: 0.6, timestamp: venueAt };
    const first = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: adapterLookup(fx, [untimed], { status: 'open', filled: 0.4 }).lookup });
    expect(first).toMatchObject({ kind: 'APPLIED', status: 'PARTIALLY_FILLED' });
    expect(await prisma.orderFill.findFirstOrThrow({ where: { orderId: fx.intent.id } }))
      .toMatchObject({ venueExecutedAt: null });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .quantity).toBe(1);
    const candidate = (await findLiveFillCandidatePage()).candidates.find(
      (item) => item.orderId === fx.intent.id)!;
    const accountAt = venueAt + 1_000;
    await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
      sourceApiKeyId: fx.key.id,
      event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
        eventTime: accountAt, transactionTime: accountAt,
        balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
          entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
    });
    const final = await recoverLiveFillCandidateOnce({ candidate,
      lookup: adapterLookup(fx, [timed, untimed]).lookup });
    expect(final).toMatchObject({ kind: 'APPLIED', status: 'FILLED', fillCount: 2 });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95,
        continuityState: 'RECOVERING', lastDcaFillTimeUncertain: true });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
  });

  it.each(['first', 'last'] as const)(
    'repairs late venue times and continuity after fee settlement, with first fill %s',
    async (firstPosition) => {
      const fx = await fixture('DCA');
      const firstAt = Date.now() - 3_000;
      const first = { id: 'late-first', order: fx.venueId,
        symbol: 'BTC/USDT:USDT', side: 'buy', price: 90, amount: 0.4,
        fee: { cost: 0.04, currency: 'USDT' } };
      const second = { id: 'late-second', order: fx.venueId,
        symbol: 'BTC/USDT:USDT', side: 'buy', price: 90, amount: 0.6,
        timestamp: firstAt + 500, fee: { cost: 0.06, currency: 'USDT' } };
      const partial = adapterLookup(fx, [first], { status: 'open', filled: 0.4 });
      await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: partial.lookup })).resolves.toMatchObject({ kind: 'APPLIED' });
      const partialCandidate = (await findLiveFillCandidatePage()).candidates.find(
        (item) => item.orderId === fx.intent.id)!;
      const mixed = adapterLookup(fx, firstPosition === 'first'
        ? [first, second] : [second, first]);
      await expect(recoverLiveFillCandidateOnce({ candidate: partialCandidate,
        lookup: mixed.lookup })).resolves.toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
      expect(await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } }))
        .toMatchObject({ feePending: false, feeSource: 'EXCHANGE_FILL' });
      await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
        sourceApiKeyId: fx.key.id,
        event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
          eventTime: firstAt + 1_000, transactionTime: firstAt + 1_000,
          balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
            entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
      });
      expect(await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .toMatchObject({ continuityState: 'RECOVERING', lastDcaFillTimeUncertain: true });
      const automation = createDbBackedAutomation(fx);
      await automation.service.handleTickerEvent(tick);
      expect(automation.service.getPositionStateSnapshot(fx.position!.id)).toBeNull();
      // The durable selector must still visit a financially settled DCA with
      // unresolved time evidence after a process restart.
      const replayCandidate = (await findLiveFillCandidatePage()).candidates.find(
        (item) => item.orderId === fx.intent.id)!;
      expect(replayCandidate).toBeDefined();
      const complete = adapterLookup(fx, firstPosition === 'first'
        ? [{ ...first, timestamp: firstAt }, second]
        : [second, { ...first, timestamp: firstAt }]);
      await expect(recoverLiveFillCandidateOnce({ candidate: replayCandidate,
        lookup: complete.lookup })).resolves.toMatchObject({ kind: 'APPLIED' });
      expect(await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .toMatchObject({ continuityState: 'CONFIRMED', lastDcaFillTimeUncertain: false,
          lastDcaFillVenueAt: new Date(firstAt + 500) });
      await automation.service.handleTickerEvent(tick);
      expect(automation.service.getPositionStateSnapshot(fx.position!.id))
        .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1 });
      expect(automation.executeDca).not.toHaveBeenCalled();
      expect(automation.closeByExitSignal).not.toHaveBeenCalled();
      expect(await prisma.orderFill.findFirstOrThrow({ where: {
        orderId: fx.intent.id, exchangeTradeId: first.id,
      } })).toMatchObject({ venueExecutedAt: new Date(firstAt) });
      const replay = await recoverLiveFillCandidateOnce({ candidate: replayCandidate,
        lookup: adapterLookup(fx, firstPosition === 'first'
          ? [{ ...first, timestamp: firstAt }, second]
          : [second, { ...first, timestamp: firstAt }]).lookup });
      expect(replay.kind).toBe('APPLIED');
      expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
      expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);
      expect(partial.client.createOrder).not.toHaveBeenCalled();
      expect(mixed.client.createOrder).not.toHaveBeenCalled();
      expect(complete.client.createOrder).not.toHaveBeenCalled();
    });

  it.each([['stable venue ID', true], ['promoted placeholder ID', false]] as const)(
    'recovers time from trades after a complete untimed fetchOrder: %s',
    async (_label, inlineHasId) => {
      const fx = await fixture('DCA');
      const venueAt = Date.now() - 2_000;
      const inline = { ...(inlineHasId ? { id: 'real-fill', timestamp: venueAt } : {}),
        order: fx.venueId, symbol: 'BTC/USDT:USDT', side: 'buy',
        price: 90, amount: 1, fee: { cost: 0.1, currency: 'USDT' } };
      const first = adapterLookup(fx, [], undefined, [inline]);
      await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: first.lookup })).resolves.toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
      expect(first.client.fetchMyTrades).toHaveBeenCalledOnce();
      const before = await prisma.orderFill.findFirstOrThrow({ where: {
        orderId: fx.intent.id,
      } });
      expect(before.venueExecutedAt).toBeNull();
      expect(before.exchangeTradeId.startsWith('soar-fill-')).toBe(!inlineHasId);
      expect(await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } }))
        .toMatchObject({ feePending: false, feeSource: 'EXCHANGE_FILL' });
      await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
        sourceApiKeyId: fx.key.id,
        event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
          eventTime: venueAt + 500, transactionTime: venueAt + 500,
          balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
            entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
      });
      expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .continuityState).toBe('RECOVERING');
      const candidate = (await findLiveFillCandidatePage()).candidates.find(
        (item) => item.orderId === fx.intent.id)!;
      expect(candidate).toBeDefined();
      const later = adapterLookup(fx, [{ ...inline, id: 'real-fill', timestamp: venueAt }],
        undefined, [inline]);
      await expect(recoverLiveFillCandidateOnce({ candidate,
        lookup: later.lookup })).resolves.toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
      expect(later.client.fetchMyTrades).toHaveBeenCalledOnce();
      expect(await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .toMatchObject({ continuityState: 'CONFIRMED',
          lastDcaFillTimeUncertain: false, lastDcaFillVenueAt: new Date(venueAt) });
      expect(await prisma.orderFill.findFirstOrThrow({ where: { orderId: fx.intent.id } }))
        .toMatchObject({ id: before.id, exchangeTradeId: 'real-fill',
          venueExecutedAt: new Date(venueAt) });
      expect(await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } }))
        .toMatchObject({ exchangeTradeId: 'real-fill' });
      expect(await prisma.trade.findFirstOrThrow({ where: { orderId: fx.intent.id } }))
        .toMatchObject({ exchangeTradeId: 'real-fill' });
      await expect(recoverLiveFillCandidateOnce({ candidate,
        lookup: adapterLookup(fx, [{ ...inline, id: 'real-fill', timestamp: venueAt }],
          undefined, [inline]).lookup })).resolves.toMatchObject({ kind: 'APPLIED' });
      expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
      expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);
      expect(first.client.createOrder).not.toHaveBeenCalled();
      expect(later.client.createOrder).not.toHaveBeenCalled();
    });

  it('retains RECOVERING when identical placeholder fills cannot be linked to real IDs', async () => {
    const fx = await fixture('DCA');
    const venueAt = Date.now() - 2_000;
    const inline = [0, 1].map(() => ({ order: fx.venueId,
      symbol: 'BTC/USDT:USDT', side: 'buy', price: 90, amount: 0.5,
      fee: { cost: 0.05, currency: 'USDT' } }));
    const first = adapterLookup(fx, [], undefined, inline);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: first.lookup })).resolves.toMatchObject({ kind: 'APPLIED' });
    await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
      sourceApiKeyId: fx.key.id,
      event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
        eventTime: venueAt + 1_000, transactionTime: venueAt + 1_000,
        balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
          entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
    });
    const candidate = (await findLiveFillCandidatePage()).candidates.find(
      (item) => item.orderId === fx.intent.id)!;
    const later = adapterLookup(fx, [
      { ...inline[0], id: 'real-one', timestamp: venueAt },
      { ...inline[1], id: 'real-two', timestamp: venueAt + 500 },
    ], undefined, inline);
    const inspected = await later.lookup(candidate);
    expect(inspected.kind).toBe('FOUND');
    if (inspected.kind !== 'FOUND') throw new Error('lookup failed');
    expect(inspected.order.fills?.every((fill) => fill.source === 'fetchOrder')).toBe(true);
    await expect(recoverLiveFillCandidateOnce({ candidate,
      lookup: later.lookup })).resolves.toMatchObject({ kind: 'APPLIED' });
    expect(later.client.fetchMyTrades).toHaveBeenCalled();
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .continuityState).toBe('RECOVERING');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id,
      venueExecutedAt: { not: null } } })).toBe(0);
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(first.client.createOrder).not.toHaveBeenCalled();
    expect(later.client.createOrder).not.toHaveBeenCalled();
  });

  it('does not trust a full trade set that contradicts complete aggregate economics', async () => {
    const fx = await fixture('DCA');
    const venueAt = Date.now() - 2_000;
    const inline = { id: 'one', order: fx.venueId,
      symbol: 'BTC/USDT:USDT', side: 'buy', price: 90, amount: 1,
      fee: { cost: 0.1, currency: 'USDT' } };
    await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: adapterLookup(fx, [], undefined, [inline]).lookup });
    const candidate = (await findLiveFillCandidatePage()).candidates.find(
      (item) => item.orderId === fx.intent.id)!;
    await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
      sourceApiKeyId: fx.key.id,
      event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
        eventTime: venueAt + 500, transactionTime: venueAt + 500,
        balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
          entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
    });
    const later = adapterLookup(fx,
      [{ ...inline, price: 91, timestamp: venueAt }], undefined, [inline]);
    const inspected = await later.lookup(candidate);
    expect(inspected.kind).toBe('FOUND');
    if (inspected.kind !== 'FOUND') throw new Error('lookup failed');
    expect(inspected.order.fills?.[0]?.source).toBe('fetchOrder');
    await expect(recoverLiveFillCandidateOnce({ candidate,
      lookup: later.lookup })).resolves.toMatchObject({ kind: 'APPLIED' });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .continuityState).toBe('RECOVERING');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(later.client.createOrder).not.toHaveBeenCalled();
  });

  it('keeps conflicting or incomplete late fill times in recovery without writes', async () => {
    const fx = await fixture('DCA');
    const firstAt = Date.now() - 3_000;
    const rows = [
      { id: 'first', order: fx.venueId, symbol: 'BTC/USDT:USDT', side: 'buy',
        price: 90, amount: 0.4, timestamp: firstAt,
        fee: { cost: 0.04, currency: 'USDT' } },
      { id: 'second', order: fx.venueId, symbol: 'BTC/USDT:USDT', side: 'buy',
        price: 90, amount: 0.6, fee: { cost: 0.06, currency: 'USDT' } },
    ];
    await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: adapterLookup(fx, rows).lookup });
    const candidate = (await findLiveFillCandidatePage()).candidates.find(
      (item) => item.orderId === fx.intent.id)!;
    await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
      sourceApiKeyId: fx.key.id,
      event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
        eventTime: firstAt + 500, transactionTime: firstAt + 500,
        balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
          entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
    });
    const incomplete = await recoverLiveFillCandidateOnce({ candidate,
      lookup: adapterLookup(fx, rows).lookup });
    expect(incomplete.kind).toBe('APPLIED');
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .continuityState).toBe('RECOVERING');
    await recoverLiveFillCandidateOnce({ candidate,
      lookup: adapterLookup(fx, [rows[0],
        { ...rows[1], timestamp: firstAt + 500 }]).lookup });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .continuityState).toBe('RECOVERING');
    const conflict = await recoverLiveFillCandidateOnce({ candidate,
      lookup: adapterLookup(fx, [
        { ...rows[0], timestamp: firstAt + 1 },
        { ...rows[1], timestamp: firstAt + 500 },
      ]).lookup });
    expect(conflict).toMatchObject({ kind: 'UNKNOWN', reason: 'LOCAL_FILL_CONFLICT' });
    expect(await prisma.orderFill.findFirstOrThrow({ where: {
      orderId: fx.intent.id, exchangeTradeId: 'first',
    } })).toMatchObject({ venueExecutedAt: new Date(firstAt) });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .continuityState).toBe('RECOVERING');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
  });

  it('does not assign late times to indistinguishable synthetic fills', async () => {
    const fx = await fixture('DCA');
    const at = Date.now() - 3_000;
    const rows = [
      { order: fx.venueId, symbol: 'BTC/USDT:USDT', side: 'buy',
        price: 90, amount: 0.5, fee: { cost: 0.05, currency: 'USDT' } },
      { order: fx.venueId, symbol: 'BTC/USDT:USDT', side: 'buy',
        price: 90, amount: 0.5, fee: { cost: 0.05, currency: 'USDT' } },
    ];
    const initial = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: adapterLookup(fx, rows).lookup });
    expect(initial.kind).toBe('APPLIED');
    const candidate = (await findLiveFillCandidatePage()).candidates.find(
      (item) => item.orderId === fx.intent.id)!;
    const late = await recoverLiveFillCandidateOnce({ candidate,
      lookup: adapterLookup(fx, [
        { ...rows[1], timestamp: at + 500 }, { ...rows[0], timestamp: at },
      ]).lookup });
    expect(late).toMatchObject({ kind: 'UNKNOWN', reason: 'LOCAL_FILL_TIME_AMBIGUOUS' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id,
      venueExecutedAt: { not: null } } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
      .continuityState).toBe('RECOVERING');
  });

  it.each([['old', 200], ['equal', 500], ['newer', 1_000]] as const)(
    'compares a fully timed DCA against a %s account snapshot',
    async (_label, offsetMs) => {
      const fx = await fixture('DCA');
      const firstAt = Date.now() - 2_000;
      const rows = [
        { id: 'first', order: fx.venueId, symbol: 'BTC/USDT:USDT',
          side: 'buy', price: 90, amount: 0.4, timestamp: firstAt },
        { id: 'second', order: fx.venueId, symbol: 'BTC/USDT:USDT',
          side: 'buy', price: 90, amount: 0.6, timestamp: firstAt + 500 },
      ];
      const accountAt = firstAt + offsetMs;
      const event = { eventType: 'ACCOUNT_UPDATE' as const,
        marketType: 'FUTURES' as const, eventTime: accountAt,
        transactionTime: accountAt, balances: [], positions: [{
          symbol: 'BTCUSDT', amount: 2, entryPrice: 95,
          unrealizedPnl: 0, positionSide: 'LONG',
        }], raw: {} };
      await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
        sourceApiKeyId: fx.key.id, event });
      const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: adapterLookup(fx, rows).lookup });
      expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED', fillCount: 2 });
      const position = await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } });
      expect(position).toMatchObject({ quantity: 2, entryPrice: 95,
        lastDcaFillVenueAt: new Date(firstAt + 500),
        lastDcaFillTimeUncertain: false,
        continuityState: offsetMs > 500 ? 'CONFIRMED' : 'RECOVERING' });
      if (offsetMs <= 500) {
        await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
          sourceApiKeyId: fx.key.id, event: { ...event,
            eventTime: firstAt + 501, transactionTime: firstAt + 501 } });
        expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
          .continuityState).toBe('CONFIRMED');
      }
    });

  it.each([['mixed', false], ['fully timed', true]] as const)(
    'uses complete fill-time evidence before confirming a zero-snapshot CLOSE: %s',
    async (_label, allTimed) => {
      const fx = await fixture('CLOSE');
      const firstAt = Date.now() - 2_000;
      const rows = [
        { id: 'close-first', order: fx.venueId,
          symbol: 'BTC/USDT:USDT', side: 'sell', price: 110,
          amount: 0.4, ...(allTimed ? { timestamp: firstAt } : {}) },
        { id: 'close-last', order: fx.venueId,
          symbol: 'BTC/USDT:USDT', side: 'sell', price: 110,
          amount: 0.6, timestamp: firstAt + 500 },
      ];
      const accountAt = firstAt + 1_000;
      await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
        sourceApiKeyId: fx.key.id,
        event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
          eventTime: accountAt, transactionTime: accountAt,
          balances: [], positions: [{ symbol: 'BTCUSDT', amount: 0,
            entryPrice: 0, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
      });
      const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: adapterLookup(fx, rows).lookup });
      expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED', fillCount: 2 });
      expect(await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } }))
        .toMatchObject({ status: 'CLOSED', quantity: 1,
          continuityState: allTimed ? 'EXTERNAL_CLOSE_CONFIRMED' : 'RECOVERING' });
      const replay = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: adapterLookup(fx, rows).lookup });
      expect(replay.kind).toBe('APPLIED');
      expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    });

  it('rebases console and automation after a DCA commit crash, then repairs cache on replay', async () => {
    const fx = await fixture('DCA');
    await runtimePositionStateStore.setPositionRuntimeState(fx.position!.id, {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const snapshot = found(fx.candidate, fx.key.id, fx.venueId, 1,
      [fill(fx.venueId, 'dca-90', 1, 0.1, 'buy', 90)]);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot),
      afterCoreCommit: async () => { throw new Error('crash after commit'); },
    })).rejects.toThrow('crash after commit');
    const canonical = await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } });
    expect(canonical).toMatchObject({ quantity: 2, entryPrice: 95,
      continuityState: 'RECOVERING' });
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id))
      .toMatchObject({ quantity: 1, averageEntryPrice: 100 });
    const displayState = selectRuntimeDisplayState({ position: canonical,
      runtimeSnapshot: null,
      persistedState: await runtimePositionStateStore.getPositionRuntimeState(canonical.id) });
    expect(displayState).toBeNull();
    const automation = createDbBackedAutomation(fx);
    await automation.service.handleTickerEvent(tick);
    expect(automation.service.getPositionStateSnapshot(canonical.id)).toBeNull();
    expect(automation.executeDca).not.toHaveBeenCalled();
    expect(automation.closeByExitSignal).not.toHaveBeenCalled();
    const afterFillAt = canonical.lastDcaFillVenueAt!.getTime() + 1;
    await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
      sourceApiKeyId: fx.key.id,
      event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
        eventTime: afterFillAt, transactionTime: afterFillAt,
        balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
          entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
    });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: canonical.id } }))
      .continuityState).toBe('CONFIRMED');
    await automation.service.handleTickerEvent(tick);
    expect(automation.service.getPositionStateSnapshot(canonical.id))
      .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1,
        trailingAnchorPrice: 100 });
    expect(automation.executeDca).not.toHaveBeenCalled();
    expect(automation.closeByExitSignal).not.toHaveBeenCalled();
    await runtimePositionStateStore.setPositionRuntimeState(canonical.id, {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const setSpy = vi.spyOn(runtimePositionStateStore, 'setPositionRuntimeState')
      .mockResolvedValueOnce(false);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) })).rejects.toThrow('RUNTIME_STATE_SYNC_PENDING');
    setSpy.mockRestore();
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id))
      .toMatchObject({ quantity: 1, averageEntryPrice: 100 });
    const replay = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(replay).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id))
      .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1 });
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
      eventType: 'DCA_EXECUTED' } })).toBe(1);
  });

  it('keeps a closed position non-actionable when cache invalidation fails, then clears it on replay', async () => {
    const fx = await fixture('CLOSE');
    await runtimePositionStateStore.setPositionRuntimeState(fx.position!.id, {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const snapshot = found(fx.candidate, fx.key.id, fx.venueId, 1,
      [fill(fx.venueId, 'close-110', 1, 0.1, 'sell', 110)]);
    const deleteSpy = vi.spyOn(runtimePositionStateStore, 'deletePositionRuntimeState')
      .mockResolvedValueOnce(false);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) })).rejects.toThrow('RUNTIME_STATE_SYNC_PENDING');
    deleteSpy.mockRestore();
    const canonical = await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } });
    expect(canonical.status).toBe('CLOSED');
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id)).not.toBeNull();
    expect(selectRuntimeDisplayState({ position: canonical, runtimeSnapshot: null,
      persistedState: await runtimePositionStateStore.getPositionRuntimeState(canonical.id) })).toBeNull();
    const automation = createDbBackedAutomation(fx);
    await automation.service.handleTickerEvent(tick);
    expect(automation.service.getPositionStateSnapshot(canonical.id)).toBeNull();
    expect(automation.executeDca).not.toHaveBeenCalled();
    expect(automation.closeByExitSignal).not.toHaveBeenCalled();
    await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id)).toBeNull();
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
      eventType: 'POSITION_CLOSED' } })).toBe(1);
  });
  it('keeps partial DCA pending, finalizes once, and backfills a late fee', async () => {
    const fx = await fixture('DCA');
    const first = fill(fx.venueId, 'fill-1', 0.4, null);
    const second = fill(fx.venueId, 'fill-2', 0.6, null);
    const partial = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 0.4, [first], 'open')) });
    expect(partial).toMatchObject({ kind: 'APPLIED', status: 'PARTIALLY_FILLED' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(0);
    const nextCandidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    const final = await recoverLiveFillCandidateOnce({ candidate: nextCandidate,
      lookup: useLookup(found(nextCandidate, fx.key.id, fx.venueId, 1, [first, second])) });
    expect(final).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'DCA' } })).toBe(1);
    const pendingOrder = await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } });
    const pendingTrade = await prisma.trade.findFirstOrThrow({ where: { orderId: fx.intent.id } });
    expect(pendingOrder.feePending).toBe(true);
    expect(pendingTrade.fee).toBeNull();
    expect(pendingTrade.feePending).toBe(true);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey: fx.dedupeKey },
    })).status).toBe('SUCCEEDED');
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
      eventType: 'DCA_EXECUTED' } })).toBe(1);
    expect(await prisma.botRuntimeSymbolStat.count({ where: { userId: fx.user.id } })).toBe(1);
    const feeCandidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    await recoverLiveFillCandidateOnce({ candidate: feeCandidate,
      lookup: useLookup(found(feeCandidate, fx.key.id, fx.venueId, 1,
        [{ ...first, feeCost: 0.04 }, { ...second, feeCost: 0.06 }])) });
    const settled = await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } });
    expect(settled.fee).toBeCloseTo(0.1);
    expect(settled.feePending).toBe(false);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it('rolls back an unresolved OPEN intent on interruption and replays atomically', async () => {
    const fx = await fixture('OPEN', false);
    const snapshot = found(fx.candidate, fx.key.id, fx.venueId, 1,
      [fill(fx.venueId, 'open-fill-1', 0.4, 0),
        fill(fx.venueId, 'open-fill-2', 0.6, 0)]);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot), afterEventApplied: async (index) => {
        if (index === 0) throw new Error('crash');
      },
    })).rejects.toThrow('crash');
    expect(await prisma.order.count({ where: { id: fx.intent.id } })).toBe(0);
    expect(await prisma.orderFill.count({ where: { userId: fx.user.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { userId: fx.user.id } })).toBe(0);
    const replay = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(replay).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await prisma.order.count({ where: { id: fx.intent.id } })).toBe(1);
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'OPEN' } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey: fx.dedupeKey },
    })).status).toBe('SUCCEEDED');
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id } })).toBe(1);
    expect(await prisma.botRuntimeSymbolStat.count({ where: { userId: fx.user.id } })).toBe(1);
    const again = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(again.kind).toBe('APPLIED');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id } })).toBe(1);
  });

  it('repairs a legacy FILLED order missing one of two fills without repeating DCA', async () => {
    const fx = await fixture('DCA');
    await prisma.order.update({ where: { id: fx.intent.id }, data: {
      status: 'FILLED', filledQuantity: 1, averageFillPrice: 100,
      exchangeTradeId: 'missing-fill', fee: 0.04, feeSource: 'EXCHANGE_FILL',
      feePending: false,
    } });
    await prisma.position.update({ where: { id: fx.position!.id }, data: { quantity: 2 } });
    await prisma.trade.create({ data: {
      userId: fx.user.id, botId: fx.bot.id, walletId: fx.wallet.id,
      orderId: fx.intent.id, positionId: fx.position!.id, executionMode: 'LIVE',
      lifecycleAction: 'DCA', symbol: 'BTCUSDT', side: 'BUY', price: 100,
      quantity: 1, fee: 0.04, feeSource: 'EXCHANGE_FILL', feePending: false,
    } });
    const first = fill(fx.venueId, 'existing-fill', 0.4, 0.04);
    const second = fill(fx.venueId, 'missing-fill', 0.6, 0.06);
    await prisma.orderFill.create({ data: {
      userId: fx.user.id, botId: fx.bot.id, orderId: fx.intent.id,
      positionId: fx.position!.id, symbol: 'BTCUSDT', side: 'BUY',
      exchangeTradeId: 'existing-fill', price: 100, quantity: 0.4,
      notional: 40, feeCost: 0.04, feeCurrency: 'USDT', executedAt: new Date(),
    } });
    const candidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    expect(candidate.localStatus).toBe('FILLED');
    const result = await recoverLiveFillCandidateOnce({ candidate,
      lookup: useLookup(found(candidate, fx.key.id, fx.venueId, 1, [first, second])) });
    expect(result.kind).toBe('APPLIED');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it('leaves a FILLED order without lifecycle Trade UNKNOWN to avoid doubling Position', async () => {
    const fx = await fixture('DCA');
    await prisma.order.update({ where: { id: fx.intent.id }, data: {
      status: 'FILLED', filledQuantity: 1, averageFillPrice: 100,
      exchangeTradeId: 'unknown-fill',
    } });
    const candidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    const result = await recoverLiveFillCandidateOnce({ candidate,
      lookup: useLookup(found(candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'unknown-fill', 1, 0.1)])) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'LEGACY_LIFECYCLE_AMBIGUOUS' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
  });

  it('leaves UNKNOWN and ambiguous snapshots without local mutations', async () => {
    const fx = await fixture('DCA');
    const missing = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup({ kind: 'UNKNOWN', candidate: fx.candidate, reason: 'HISTORY_AMBIGUOUS' }) });
    expect(missing).toMatchObject({ kind: 'UNKNOWN', reason: 'HISTORY_AMBIGUOUS' });
    const incomplete = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'only-0.4', 0.4, 0.01)])) });
    expect(incomplete).toMatchObject({ kind: 'UNKNOWN', reason: 'VENUE_FILL_SUM_MISMATCH' });
    expect((await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } })).status).toBe('OPEN');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(0);
  });

  it('does not report an unfilled canceled venue order as applied', async () => {
    const fx = await fixture('OPEN', false);
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 0, [], 'canceled')) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'VENUE_TERMINAL_WITHOUT_FILLS' });
    expect(await prisma.order.count({ where: { id: fx.intent.id } })).toBe(0);
  });

  it('rejects a local fill whose venue identity has conflicting economics', async () => {
    const fx = await fixture('DCA');
    await prisma.orderFill.create({ data: {
      userId: fx.user.id, botId: fx.bot.id, orderId: fx.intent.id,
      positionId: fx.position!.id, symbol: 'BTCUSDT', side: 'BUY',
      exchangeTradeId: 'conflict-fill', price: 100, quantity: 0.5,
      notional: 50, feeCost: null, executedAt: new Date(),
    } });
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'conflict-fill', 1, 0.1)])) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'LOCAL_FILL_CONFLICT' });
    expect((await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } })).status).toBe('OPEN');
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
  });

  it('rechecks account provenance inside the transaction and leaves drift untouched', async () => {
    const fx = await fixture('DCA');
    await prisma.apiKey.update({ where: { id: fx.key.id }, data: {
      apiSecret: 'rotated-secret', updatedAt: new Date(fx.intent.createdAt.getTime() + 1000),
    } });
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'drift-fill', 1, 0.1)])) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'ACCOUNT_PROVENANCE_CHANGED' });
    expect((await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } })).status).toBe('OPEN');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
  });

  it('finalizes CLOSE with nullable PnL until fee arrives', async () => {
    const fx = await fixture('CLOSE');
    const first = fill(fx.venueId, 'close-fill', 1, null, 'sell', 110);
    const initial = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1, [first])) });
    expect(initial).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).realizedPnl).toBeNull();
    const feeCandidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    await recoverLiveFillCandidateOnce({ candidate: feeCandidate,
      lookup: useLookup(found(feeCandidate, fx.key.id, fx.venueId, 1,
        [{ ...first, feeCost: 0.1 }])) });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).realizedPnl).toBeCloseTo(9.9);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'CLOSE' } })).toBe(1);
  });

  it('serializes a concurrent recovery and exchange event without duplicate DCA', async () => {
    const fx = await fixture('DCA');
    const one = fill(fx.venueId, 'race-fill', 1, 0.1);
    const event = {
      eventType: 'ORDER_TRADE_UPDATE' as const, marketType: 'FUTURES' as const,
      eventTime: Date.now(), transactionTime: Date.now(), symbol: 'BTCUSDT',
      side: 'BUY', orderType: 'MARKET', orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: fx.venueId, clientOrderId: fx.intent.clientOrderId,
      averagePrice: 100, cumulativeFilledQuantity: 1, lastFilledQuantity: 1,
      lastFilledPrice: 100, fee: 0.1, feeCurrency: 'USDT',
      exchangeTradeId: 'race-fill', raw: {},
    };
    const [recovered] = await Promise.all([
      recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1, [one])) }),
      applyLiveExchangeOrderTradeUpdateEvent({ userId: fx.user.id, event }),
    ]);
    expect(['APPLIED', 'UNKNOWN']).toContain(recovered.kind);
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it.each([
    ['BINANCE', 'SPOT'], ['BINANCE', 'FUTURES'],
    ['GATEIO', 'SPOT'], ['GATEIO', 'FUTURES'],
  ] as const)('finalizes one %s %s snapshot through the shared transaction', async (exchange, marketType) => {
    const fx = await fixture('DCA', true, { exchange, marketType });
    const one = fill(fx.venueId, `fill-${exchange}-${marketType}`, 1, 0.1);
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1, [one])) });
    expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it('recovers a finished Gate Spot intent from bounded history and order trades', async () => {
    const fx = await fixture('OPEN', false, { exchange: 'GATEIO', marketType: 'SPOT' });
    const venueOrder: CcxtFuturesOrderResult = {
      id: fx.venueId, symbol: 'BTC/USDT', side: 'buy', status: 'closed', filled: 1,
      fills: [], raw: { info: { text: `t-${fx.intent.clientOrderId}` } },
    };
    const read = {
      fetchOrderWithFills: vi.fn().mockResolvedValue({ order: venueOrder, fills: [] }),
      fetchOrderByClientOrderId: vi.fn().mockRejectedValue(new Error('finished text unavailable')),
      fetchClosedOrdersPage: vi.fn().mockResolvedValue([venueOrder]),
      fetchTradesForOrder: vi.fn().mockResolvedValue([fill(fx.venueId, 'gate-fill', 1, 0)]),
      disconnect: vi.fn().mockResolvedValue(undefined),
    };
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: (candidate) => lookupLiveFillCandidate(candidate, {
        createConnector: () => read,
      }),
    });
    expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(read.fetchClosedOrdersPage).toHaveBeenCalledOnce();
    expect(read.fetchTradesForOrder).toHaveBeenCalledWith(expect.objectContaining({
      orderId: fx.venueId,
    }));
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'OPEN' } })).toBe(1);
  });
});
