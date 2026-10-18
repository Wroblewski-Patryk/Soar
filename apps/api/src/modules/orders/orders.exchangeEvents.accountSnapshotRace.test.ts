import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { RuntimePositionAutomationService } from
  '../engine/runtimePositionAutomation.service';
import { listRuntimeAutomationOpenPositionsBySymbol } from
  '../engine/runtimePositionAutomationDefaultPositionDeps';
import { applyLiveExchangeUserDataStreamEvent } from './orders.exchangeEvents.service';
import { applyLiveExchangeAccountUpdateEvent } from
  './orders.exchangeEvents.accountUpdate.service';
import { findLiveFillCandidatePage } from './orders.liveFillCandidates.service';
import { recoverLiveFillCandidateOnce } from './orders.liveFillRecovery.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.orderFill.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.liveOrderIntent.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botStrategy.deleteMany();
  await prisma.botSubagentConfig.deleteMany();
  await prisma.botAssistantConfig.deleteMany();
  await prisma.marketGroupStrategyLink.deleteMany();
  await prisma.botMarketGroup.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
};

const createDca = async () => {
  const id = randomUUID();
  const user = await prisma.user.create({ data: {
    email: `account-snapshot-${id}@example.test`, password: 'test-only',
  } });
  const key = await prisma.apiKey.create({ data: { userId: user.id,
    label: id, exchange: 'BINANCE', apiKey: 'test-key', apiSecret: 'test-secret' } });
  const wallet = await prisma.wallet.create({ data: { userId: user.id, name: id,
    mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES', apiKeyId: key.id } });
  const bot = await prisma.bot.create({ data: { userId: user.id, name: id,
    mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
    walletId: wallet.id, apiKeyId: key.id, isActive: true, liveOptIn: true } });
  const position = await prisma.position.create({ data: { userId: user.id,
    botId: bot.id, walletId: wallet.id, symbol: 'BTCUSDT', side: 'LONG',
    status: 'OPEN', quantity: 1, entryPrice: 100,
    origin: 'BOT', managementMode: 'BOT_MANAGED' } });
  const clientOrderId = `soar_${id.replace(/-/g, '').slice(0, 22)}`;
  const exchangeOrderId = '12345';
  const intent = await prisma.liveOrderIntent.create({ data: { userId: user.id,
    clientOrderId, payloadHash: id, exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT', payload: {
      mode: 'LIVE', origin: 'BOT', botId: bot.id, walletId: wallet.id,
      positionId: position.id, side: 'BUY', type: 'MARKET', quantity: 1,
      symbol: 'BTCUSDT', price: 90,
    } } });
  await prisma.order.create({ data: { id: intent.id, userId: user.id,
    botId: bot.id, walletId: wallet.id, positionId: position.id,
    origin: 'BOT', symbol: 'BTCUSDT', side: 'BUY', type: 'MARKET',
    status: 'OPEN', quantity: 1, exchangeOrderId,
    filledQuantity: 0, feePending: true } });
  const page = await findLiveFillCandidatePage({ limit: 10 });
  const candidate = page.candidates.find((item) => item.orderId === intent.id);
  if (!candidate) throw new Error('DCA candidate missing from isolated test database');
  const poll = (executedAt: Date | null = new Date(),
    source: 'fetchMyTrades' | 'fetchOrder' = 'fetchMyTrades') =>
    recoverLiveFillCandidateOnce({ candidate,
    lookup: async () => ({ kind: 'FOUND' as const, candidate,
      apiKeyId: key.id, lookupSource: 'ORDER_ID' as const, order: {
        id: exchangeOrderId, symbol: 'BTC/USDT:USDT', side: 'buy',
        status: 'closed', filled: 1, raw: { clientOrderId }, fills: [{
          exchangeTradeId: '991', exchangeOrderId, symbol: 'BTCUSDT',
          side: 'buy', price: 90, quantity: 1, notional: 90,
          feeCost: 0.1, feeCurrency: 'USDT', feeRate: null,
          executedAt, source, raw: { id: 991 },
        }],
      },
    }),
  });
  const accountEvent = (amount: number, at: number) => ({
    eventType: 'ACCOUNT_UPDATE' as const, marketType: 'FUTURES' as const,
    eventTime: at, transactionTime: at, balances: [],
    positions: [{ symbol: 'BTCUSDT', amount, entryPrice: 95,
      unrealizedPnl: 5, positionSide: 'LONG' as const }], raw: {},
  });
  return { user, key, bot, position, intent, poll, accountEvent };
};

const applySecondDca = async (fixture: Awaited<ReturnType<typeof createDca>>,
  at: number) => {
  const clientOrderId = `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}`;
  const exchangeOrderId = randomUUID();
  const intent = await prisma.liveOrderIntent.create({ data: {
    userId: fixture.user.id, clientOrderId, payloadHash: randomUUID(),
    exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
    payload: { mode: 'LIVE', origin: 'BOT', botId: fixture.bot.id,
      walletId: fixture.position.walletId, positionId: fixture.position.id,
      symbol: 'BTCUSDT', side: 'BUY', type: 'MARKET', quantity: 1, price: 80 },
  } });
  await prisma.order.create({ data: { id: intent.id, userId: fixture.user.id,
    botId: fixture.bot.id, walletId: fixture.position.walletId,
    positionId: fixture.position.id, origin: 'BOT', symbol: 'BTCUSDT',
    side: 'BUY', type: 'MARKET', status: 'OPEN', quantity: 1,
    exchangeOrderId, filledQuantity: 0, feePending: true,
  } });
  const event = { eventType: 'ORDER_TRADE_UPDATE' as const,
    marketType: 'FUTURES' as const, eventTime: at,
    transactionTime: at, symbol: 'BTCUSDT', side: 'BUY',
    orderType: 'MARKET', orderStatus: 'FILLED', executionType: 'TRADE',
    exchangeOrderId, clientOrderId,
    averagePrice: 80, cumulativeFilledQuantity: 1,
    lastFilledQuantity: 1, lastFilledPrice: 80,
    fee: 0.1, feeCurrency: 'USDT', exchangeTradeId: '222', raw: {},
  };
  await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
    sourceApiKeyId: fixture.key.id, event });
  await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
    sourceApiKeyId: fixture.key.id, event });
  return intent;
};

describe('fill-backed BOT account snapshots and polling', () => {
  beforeEach(cleanupDb);
  afterEach(cleanupDb);

  it('keeps RECOVERING when snapshot qty 3 still disagrees after confirmed DCA qty 1', async () => {
    const fixture = await createDca();
    const event = fixture.accountEvent(3, Date.now());
    await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event });
    await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: fixture.accountEvent(1, event.eventTime - 1) });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 1, entryPrice: 100, continuityState: 'RECOVERING',
        lastAccountQuantity: 3, lastAccountEntryPrice: 95 });

    await expect(fixture.poll()).resolves.toMatchObject({ kind: 'APPLIED' });
    await expect(fixture.poll()).resolves.toMatchObject({ kind: 'APPLIED' });
    await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95, continuityState: 'RECOVERING',
        lastAccountQuantity: 3, missingSyncCount: 1 });
    expect(await prisma.orderFill.count({ where: { orderId: fixture.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fixture.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fixture.user.id,
      eventType: 'DCA_EXECUTED' } })).toBe(1);

    const listed = await listRuntimeAutomationOpenPositionsBySymbol('BTCUSDT');
    expect(listed.find((item) => item.id === fixture.position.id)?.continuityState)
      .toBe('RECOVERING');
    const executeDca = vi.fn(async () => ({ feePaid: 0, executed: true }));
    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const automation = new RuntimePositionAutomationService({
      listOpenPositionsBySymbol: async (symbol) =>
        (await listRuntimeAutomationOpenPositionsBySymbol(symbol))
          .filter((item) => item.id === fixture.position.id),
      executeDca, closeByExitSignal,
      recordRuntimeEvent: vi.fn(async () => undefined),
    });
    await automation.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
      marketType: 'FUTURES', symbol: 'BTCUSDT', eventTime: Date.now(),
      lastPrice: 80, priceChangePercent24h: -2 });
    expect(executeDca).not.toHaveBeenCalled();
    expect(closeByExitSignal).not.toHaveBeenCalled();

    const closeClientOrderId = `soar_close_${randomUUID().replace(/-/g, '').slice(0, 18)}`;
    const closeIntent = await prisma.liveOrderIntent.create({ data: {
      userId: fixture.user.id, clientOrderId: closeClientOrderId,
      payloadHash: randomUUID(), exchange: 'BINANCE', marketType: 'FUTURES',
      symbol: 'BTCUSDT', payload: { mode: 'LIVE', origin: 'BOT',
        botId: fixture.bot.id, walletId: fixture.position.walletId,
        positionId: fixture.position.id, symbol: 'BTCUSDT', side: 'SELL',
        type: 'MARKET', quantity: 2, price: 110 },
    } });
    await prisma.order.create({ data: { id: closeIntent.id,
      userId: fixture.user.id, botId: fixture.bot.id,
      walletId: fixture.position.walletId, positionId: fixture.position.id,
      origin: 'BOT', symbol: 'BTCUSDT', side: 'SELL', type: 'MARKET',
      status: 'OPEN', quantity: 2, exchangeOrderId: '67890',
      filledQuantity: 0, feePending: true,
    } });
    const closeEvent = { eventType: 'ORDER_TRADE_UPDATE' as const,
      marketType: 'FUTURES' as const, eventTime: Date.now(),
      transactionTime: Date.now(), symbol: 'BTCUSDT', side: 'SELL',
      orderType: 'MARKET', orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: '67890', clientOrderId: closeClientOrderId,
      averagePrice: 110, cumulativeFilledQuantity: 2,
      lastFilledQuantity: 2, lastFilledPrice: 110,
      fee: 0.2, feeCurrency: 'USDT', exchangeTradeId: '992', raw: {},
    };
    await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event: closeEvent });
    await applyLiveExchangeUserDataStreamEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event: closeEvent });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ status: 'CLOSED', quantity: 2,
        continuityState: 'RECOVERING', lastAccountQuantity: 3 });
    expect(await prisma.orderFill.count({ where: { orderId: closeIntent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: closeIntent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fixture.user.id,
      eventType: 'POSITION_CLOSED' } })).toBe(1);
  });

  it('requires a newer matching venue snapshot, surviving duplicate and divergent updates', async () => {
    const fixture = await createDca();
    const eventAt = Date.now() - 2_000;
    const event = fixture.accountEvent(2, eventAt);
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .continuityState).toBe('RECOVERING');
    await fixture.poll();
    let settled = await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } });
    expect(settled).toMatchObject({ quantity: 2, entryPrice: 95,
      continuityState: 'RECOVERING', lastAccountQuantity: 2,
      lastAccountTransactionAt: new Date(eventAt), lastDcaFillTimeUncertain: false });
    const executeDca = vi.fn(async () => ({ feePaid: 0, executed: true }));
    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const automation = new RuntimePositionAutomationService({
      listOpenPositionsBySymbol: async (symbol) =>
        (await listRuntimeAutomationOpenPositionsBySymbol(symbol))
          .filter((item) => item.id === fixture.position.id),
      executeDca, closeByExitSignal,
      recordRuntimeEvent: vi.fn(async () => undefined),
    });
    await automation.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
      marketType: 'FUTURES', symbol: 'BTCUSDT', eventTime: Date.now(),
      lastPrice: 80, priceChangePercent24h: -2 });
    expect(executeDca).not.toHaveBeenCalled();
    expect(closeByExitSignal).not.toHaveBeenCalled();
    const fillAt = settled.lastDcaFillVenueAt!.getTime();
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event });
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: fixture.accountEvent(2, fillAt) });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .continuityState).toBe('RECOVERING');
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: { ...fixture.accountEvent(2, fillAt + 1), transactionTime: null } });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .continuityState).toBe('RECOVERING');
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: fixture.accountEvent(3, fillAt + 2) });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95, continuityState: 'RECOVERING',
        lastAccountQuantity: 3 });
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: fixture.accountEvent(2, fillAt + 3) });
    settled = await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } });
    expect(settled).toMatchObject({ quantity: 2, entryPrice: 95,
      continuityState: 'CONFIRMED', lastAccountQuantity: 2, missingSyncCount: 0 });
    expect(await prisma.trade.count({ where: { orderId: fixture.intent.id } })).toBe(1);
  });

  it('rechecks an account update after a concurrent poll and rejects an old replay', async () => {
    const second = await createDca();
    let scopeRead!: () => void;
    let resume!: () => void;
    const observed = new Promise<void>((resolve) => { scopeRead = resolve; });
    const gate = new Promise<void>((resolve) => { resume = resolve; });
    const overlapping = applyLiveExchangeAccountUpdateEvent({ userId: second.user.id,
      sourceApiKeyId: second.key.id, event: second.accountEvent(2, Date.now() + 1_000),
      afterInitialScopeRead: async () => { scopeRead(); await gate; },
    });
    await observed;
    await second.poll();
    resume();
    await overlapping;
    expect(await prisma.position.findUniqueOrThrow({ where: { id: second.position.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95, continuityState: 'CONFIRMED',
        lastAccountQuantity: 2, missingSyncCount: 0 });
    expect(await prisma.orderFill.count({ where: { orderId: second.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: second.intent.id } })).toBe(1);

    const third = await createDca();
    await third.poll();
    await expect(applyLiveExchangeAccountUpdateEvent({ userId: third.user.id,
      sourceApiKeyId: third.key.id,
      event: third.accountEvent(1, Date.now() - 1_000),
    })).resolves.toEqual({ status: 'applied', updatedPositions: 0 });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: third.position.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95,
        continuityState: 'RECOVERING', lastAccountQuantity: null });
  });

  it('fails closed across restart when a polled fill has no venue timestamp', async () => {
    const fixture = await createDca();
    await fixture.poll(null);
    const settled = await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } });
    expect(settled).toMatchObject({ quantity: 2, entryPrice: 95,
      continuityState: 'RECOVERING', lastDcaFillTimeUncertain: true,
      lastDcaFillVenueAt: null });
    // A fresh service read after settlement has no process-local ordering state.
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: fixture.accountEvent(2, settled.lastExchangeSyncAt!.getTime() + 10_000) });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95,
        continuityState: 'RECOVERING', lastDcaFillTimeUncertain: true,
        lastAccountQuantity: 2 });
    await fixture.poll(null);
    expect(await prisma.trade.count({ where: { orderId: fixture.intent.id } })).toBe(1);

    const aggregate = await createDca();
    await aggregate.poll(new Date(), 'fetchOrder');
    expect(await prisma.position.findUniqueOrThrow({ where: { id: aggregate.position.id } }))
      .toMatchObject({ continuityState: 'RECOVERING',
        lastDcaFillVenueAt: null, lastDcaFillTimeUncertain: true });
  });

  it('keeps an unknown earlier fill time unresolved after a later timed DCA', async () => {
    const fixture = await createDca();
    await fixture.poll(null);
    const first = await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } });
    const secondAt = first.lastExchangeSyncAt!.getTime() + 1_000;
    const intent = await applySecondDca(fixture, secondAt);
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 3, entryPrice: 90,
        continuityState: 'RECOVERING', lastDcaFillTimeUncertain: true,
        lastDcaFillVenueAt: new Date(secondAt) });
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: { ...fixture.accountEvent(3, secondAt + 1),
        positions: [{ ...fixture.accountEvent(3, secondAt + 1).positions[0],
          entryPrice: 90 }] } });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 3, entryPrice: 90,
        continuityState: 'RECOVERING', lastAccountQuantity: 3,
        lastAccountEntryPrice: 90 });
    expect(await prisma.trade.count({ where: { orderId: intent.id } })).toBe(1);
  });

  it('retains the latest venue fill barrier when an older fill settles later', async () => {
    const fixture = await createDca();
    const laterAt = Date.now() + 2_000;
    await fixture.poll(new Date(laterAt));
    await applySecondDca(fixture, laterAt - 1_000);
    const position = await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } });
    expect(position).toMatchObject({ quantity: 3, entryPrice: 90,
      continuityState: 'RECOVERING', lastDcaFillVenueAt: new Date(laterAt),
      lastExchangeSyncAt: new Date(laterAt), lastDcaFillTimeUncertain: false });
    const between = fixture.accountEvent(3, laterAt - 500);
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: { ...between, positions: [{ ...between.positions[0], entryPrice: 90 }] } });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .continuityState).toBe('RECOVERING');
    const after = fixture.accountEvent(3, laterAt + 1);
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id,
      event: { ...after, positions: [{ ...after.positions[0], entryPrice: 90 }] } });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .continuityState).toBe('CONFIRMED');
  });
});
