import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { RuntimeSignalLoop } from './runtimeSignalLoop.service';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore } from './runtimeTickerStore';

const symbol = 'BTCUSDT';
const leverage = 100;

const readCounts = async (botId: string) => ({
  orders: await prisma.order.count({ where: { botId, symbol } }),
  trades: await prisma.trade.count({ where: { botId, symbol } }),
});

describe('PAPER basic DCA persisted position cycle', () => {
  let createdBotId: string | undefined;

  afterEach(async () => {
    if (createdBotId) {
      await prisma.bot.updateMany({ where: { id: createdBotId }, data: { isActive: false } });
      createdBotId = undefined;
    }
  });

  beforeEach(async () => {
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestContribution.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('holds after entry signal loss, persists 1+2+6 USDT and closes once by SL', async () => {
    const loop = new RuntimeSignalLoop();
    const agent = request.agent(app);
    const email = 'paper-basic-dca-cycle@example.test';
    expect((await agent.post('/auth/register').send({ email, password: 'test1234' })).status).toBe(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await ensureSubscriptionCatalog(prisma);
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id, planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
      metadata: { reason: 'paper-basic-dca-cycle-e2e' },
    });

    const strategyResponse = await agent.post('/dashboard/strategies').send({
      name: 'PAPER basic DCA cycle', interval: '1m', leverage, walletRisk: 1,
      config: {
        open: { direction: 'both', noMatchAction: 'EXIT',
          indicatorsLong: [{ name: 'RSI', condition: '>', value: 99, params: { period: 2 } }],
          indicatorsShort: [] },
        close: { mode: 'basic', tp: 50, sl: 20 },
        additional: { dcaEnabled: true, dcaMode: 'basic', dcaSizingBasis: 'usdt_contribution_v1',
          dcaTimes: 2, dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
      },
    });
    expect(strategyResponse.status).toBe(201);
    const strategyId = strategyResponse.body.id as string;
    const marketUniverse = await prisma.marketUniverse.create({ data: {
      userId: user.id, name: 'PAPER DCA universe', marketType: 'FUTURES', baseCurrency: 'USDT',
      whitelist: [], blacklist: [],
    } });
    const symbolGroup = await prisma.symbolGroup.create({ data: {
      userId: user.id, marketUniverseId: marketUniverse.id,
      name: 'PAPER DCA symbols', symbols: [symbol],
    } });
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: 'PAPER DCA wallet', mode: 'PAPER', exchange: 'BINANCE',
      marketType: 'FUTURES', baseCurrency: 'USDT', paperInitialBalance: 100,
    } });
    const botResponse = await agent.post('/dashboard/bots').send({
      name: 'PAPER basic DCA bot', walletId: wallet.id, strategyId,
      marketGroupId: symbolGroup.id, isActive: true, liveOptIn: false,
      consentTextVersion: null,
    });
    expect(botResponse.status).toBe(201);
    const botId = botResponse.body.id as string;
    createdBotId = botId;

    const candleBaseTime = Date.now();
    const emitFinalCandle = (index: number, close: number) => {
      const openTime = candleBaseTime + index * 60_000;
      return loop.processCandleEvent({
        type: 'candle', exchange: 'BINANCE', marketType: 'FUTURES', symbol,
        interval: '1m', eventTime: openTime + 59_999, openTime,
        closeTime: openTime + 59_999, open: close, high: close * 1.001,
        low: close * 0.999, close, volume: 1000 + index, isFinal: true,
      });
    };
    await emitFinalCandle(0, 98);
    await emitFinalCandle(1, 99);
    await emitFinalCandle(2, 100);
    await loop.processTickerEvent({ type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
      symbol, eventTime: Date.now(), lastPrice: 100, priceChangePercent24h: 1.8 });

    const opened = await prisma.position.findFirstOrThrow({ where: { botId, symbol, status: 'OPEN' } });
    expect(opened.leverage).toBe(leverage);
    expect(opened.entryPrice * opened.quantity / leverage).toBeCloseTo(1, 4);
    const entryTrades = await prisma.trade.findMany({ where: { positionId: opened.id } });
    expect(entryTrades.map((trade) => trade.lifecycleAction)).toEqual(['OPEN']);
    const entryCounts = await readCounts(botId);
    expect(entryCounts).toEqual({ orders: 1, trades: 1 });

    // A legacy no-match EXIT setting must not close the open PAPER position.
    await emitFinalCandle(3, 99.9);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status).toBe('OPEN');
    expect(await readCounts(botId)).toEqual(entryCounts);
    expect(await prisma.signal.count({ where: { botId, symbol, direction: 'EXIT' } })).toBe(0);

    const createAutomation = () => new RuntimePositionAutomationService({
      getCanonicalPositionState: async (positionId) => {
        const position = await prisma.position.findUnique({ where: { id: positionId } });
        return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice } : null;
      },
      getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
      executeDca: (input) => executeRuntimeDca(input, { getOrderRules: async () => ({
        minAmount: 0.00000001, minNotional: 0.01, amountPrecision: 8, contractSize: 1,
      }) }),
      resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
    });
    const send = (service: RuntimePositionAutomationService, price: number, tick: number) =>
      service.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
        symbol, eventTime: candleBaseTime + tick * 60_000, lastPrice: price,
        priceChangePercent24h: -1 });
    const firstService = createAutomation();
    const firstPrice = opened.entryPrice * (1 - 0.306 / leverage);
    await send(firstService, firstPrice, 4);
    const afterFirst = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    expect(afterFirst.status).toBe('OPEN');
    expect(afterFirst.closeReason).toBeNull();
    const firstDca = await prisma.trade.findMany({ where: { positionId: opened.id,
      lifecycleAction: 'DCA' }, orderBy: { executedAt: 'asc' } });
    expect(firstDca).toHaveLength(1);
    expect(firstDca[0].price * firstDca[0].quantity / leverage).toBeCloseTo(2, 4);
    expect(afterFirst.entryPrice * afterFirst.quantity / leverage).toBeCloseTo(3, 4);
    await send(firstService, firstPrice, 5);
    expect(await readCounts(botId)).toEqual({ orders: 2, trades: 2 });

    await runtimePositionStateStore.deletePositionRuntimeState(opened.id);
    const secondService = createAutomation();
    const secondPrice = afterFirst.entryPrice * (1 - 0.306 / leverage);
    await send(secondService, secondPrice, 6);
    await send(secondService, secondPrice, 7);
    const afterSecond = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    expect(afterSecond.status).toBe('OPEN');
    expect(afterSecond.closeReason).toBeNull();
    const dcaTrades = await prisma.trade.findMany({ where: { positionId: opened.id,
      lifecycleAction: 'DCA' }, orderBy: { executedAt: 'asc' } });
    expect(dcaTrades).toHaveLength(2);
    expect(dcaTrades[1].price * dcaTrades[1].quantity / leverage).toBeCloseTo(6, 4);
    expect(afterSecond.entryPrice * afterSecond.quantity / leverage).toBeCloseTo(9, 4);
    expect(await readCounts(botId)).toEqual({ orders: 3, trades: 3 });

    await runtimePositionStateStore.deletePositionRuntimeState(opened.id);
    const restartedService = createAutomation();
    const reloaded = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    const basisTrades = [...entryTrades, ...dcaTrades];
    const expectedQuantity = basisTrades.reduce((sum, trade) => sum + trade.quantity, 0);
    const expectedAverage = basisTrades.reduce((sum, trade) => sum + trade.price * trade.quantity, 0)
      / expectedQuantity;
    expect(reloaded.quantity).toBeCloseTo(expectedQuantity, 8);
    expect(reloaded.entryPrice).toBeCloseTo(expectedAverage, 8);
    expect(reloaded.entryPrice * reloaded.quantity / leverage).toBeCloseTo(9, 4);

    const stopPrice = reloaded.entryPrice * (1 - 0.205 / leverage);
    await send(restartedService, stopPrice, 8);
    await send(restartedService, stopPrice, 9);
    const closed = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    expect(closed.status).toBe('CLOSED');
    expect(closed.closeReason).toBe('SL');
    expect(closed.closeInitiator).toBe('BOT_APP');
    const allTrades = await prisma.trade.findMany({ where: { positionId: opened.id } });
    expect(allTrades.map((trade) => trade.lifecycleAction).sort()).toEqual(['CLOSE', 'DCA', 'DCA', 'OPEN']);
    const closeTrade = allTrades.find((trade) => trade.lifecycleAction === 'CLOSE')!;
    expect(closeTrade.closeReason).toBe('SL');
    expect(await readCounts(botId)).toEqual({ orders: 4, trades: 4 });
    expect(new Set(allTrades.map((trade) => trade.orderId)).size).toBe(4);
    const allOrders = await prisma.order.findMany({ where: { botId, symbol } });
    expect(allOrders.every((order) => order.status === 'FILLED')).toBe(true);
    expect(allOrders.filter((order) => order.closeReason === 'SL')).toHaveLength(1);
    const entryFees = basisTrades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
    const expectedNet = (closeTrade.price - reloaded.entryPrice) * reloaded.quantity
      - entryFees - (closeTrade.fee ?? 0);
    expect(closed.realizedPnl).toBeCloseTo(expectedNet, 6);
    expect(closeTrade.realizedPnl).toBeCloseTo(expectedNet, 6);
    expect(expectedNet).toBeLessThan(0);
  });
});
