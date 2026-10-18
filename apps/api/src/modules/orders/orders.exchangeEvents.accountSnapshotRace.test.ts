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
  const poll = () => recoverLiveFillCandidateOnce({ candidate,
    lookup: async () => ({ kind: 'FOUND' as const, candidate,
      apiKeyId: key.id, lookupSource: 'ORDER_ID' as const, order: {
        id: exchangeOrderId, symbol: 'BTC/USDT:USDT', side: 'buy',
        status: 'closed', filled: 1, raw: { clientOrderId }, fills: [{
          exchangeTradeId: '991', exchangeOrderId, symbol: 'BTCUSDT',
          side: 'buy', price: 90, quantity: 1, notional: 90,
          feeCost: 0.1, feeCurrency: 'USDT', feeRate: null,
          executedAt: new Date(), source: 'fetchMyTrades', raw: { id: 991 },
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

  it('confirms snapshot qty 2 after DCA and rechecks a poll completed after the initial read', async () => {
    const fixture = await createDca();
    const eventAt = Date.now();
    const event = fixture.accountEvent(2, eventAt);
    await applyLiveExchangeAccountUpdateEvent({ userId: fixture.user.id,
      sourceApiKeyId: fixture.key.id, event });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .continuityState).toBe('RECOVERING');
    await fixture.poll();
    expect(await prisma.position.findUniqueOrThrow({ where: { id: fixture.position.id } }))
      .toMatchObject({ quantity: 2, entryPrice: 95, continuityState: 'CONFIRMED',
        lastAccountQuantity: 2, missingSyncCount: 0 });

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
        continuityState: 'CONFIRMED', lastAccountQuantity: null });
  });
});
