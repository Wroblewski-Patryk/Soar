import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { RuntimeSignalLoop } from './runtimeSignalLoop.service';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { runtimeTelemetryService } from './runtimeTelemetry.service';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore } from './runtimeTickerStore';

const symbol = 'BTCUSDT';
const leverage = 100;

describe('PAPER armed TTP with newly pending profit-side DCA', () => {
  let createdBotId: string | undefined;
  let createdPositionId: string | undefined;

  afterEach(async () => {
    if (createdPositionId) {
      await runtimePositionStateStore.deletePositionRuntimeState(createdPositionId);
      createdPositionId = undefined;
    }
    if (createdBotId) {
      await prisma.bot.updateMany({ where: { id: createdBotId }, data: { isActive: false } });
      createdBotId = undefined;
    }
  });

  it('fills reached positive DCA before an armed TTP and closes once on a later tick', async () => {
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    const loop = new RuntimeSignalLoop();
    const agent = request.agent(app);
    const email = `paper-ttp-positive-dca-${randomUUID()}@example.test`;
    expect((await agent.post('/auth/register').send({ email, password: 'test1234' })).status).toBe(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await ensureSubscriptionCatalog(prisma);
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id, planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
      metadata: { reason: 'paper-ttp-positive-dca-e2e' },
    });

    const strategyName = 'PAPER armed TTP with pending DCA';
    const baseConfig = {
      open: { direction: 'both', noMatchAction: 'EXIT',
        indicatorsLong: [{ name: 'RSI', condition: '>', value: 99, params: { period: 2 } }],
        indicatorsShort: [] },
      close: { mode: 'advanced', ttp: [{ percent: 20, arm: 10 }], tsl: [] },
      additional: { dcaEnabled: false, dcaMode: 'advanced', dcaSizingBasis: 'usdt_contribution_v1',
        dcaTimes: 1, dcaLevels: [{ percent: 30.5, multiplier: 1 }] },
    };
    const strategyResponse = await agent.post('/dashboard/strategies').send({
      name: strategyName, interval: '1m', leverage, walletRisk: 1, config: baseConfig,
    });
    expect(strategyResponse.status).toBe(201);
    const strategyId = strategyResponse.body.id as string;
    const savedStrategy = await prisma.strategy.findUniqueOrThrow({ where: { id: strategyId } });
    expect(savedStrategy.config).toEqual(expect.objectContaining({
      close: expect.objectContaining({ mode: 'advanced', ttp: [{ percent: 20, arm: 10 }] }),
      additional: expect.objectContaining({
        dcaEnabled: false, dcaSizingBasis: 'usdt_contribution_v1',
        dcaLevels: [{ percent: 30.5, multiplier: 1 }],
      }),
    }));
    const marketUniverse = await prisma.marketUniverse.create({ data: {
      userId: user.id, name: 'TTP positive DCA universe', marketType: 'FUTURES',
      baseCurrency: 'USDT', whitelist: [], blacklist: [],
    } });
    const symbolGroup = await prisma.symbolGroup.create({ data: {
      userId: user.id, marketUniverseId: marketUniverse.id,
      name: 'TTP positive DCA symbols', symbols: [symbol],
    } });
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: 'TTP positive DCA wallet', mode: 'PAPER', exchange: 'BINANCE',
      marketType: 'FUTURES', baseCurrency: 'USDT', paperInitialBalance: 100,
    } });
    const botResponse = await agent.post('/dashboard/bots').send({
      name: 'TTP positive DCA bot', walletId: wallet.id, strategyId,
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
    createdPositionId = opened.id;
    expect(opened.entryPrice * opened.quantity / leverage).toBeCloseTo(1, 4);
    expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'OPEN' } })).toBe(1);

    await emitFinalCandle(3, 99.9);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status).toBe('OPEN');
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
      recordRuntimeEvent: (input) => runtimeTelemetryService.recordRuntimeEvent(input),
      resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
    });
    const send = (service: RuntimePositionAutomationService, price: number, tick: number) =>
      service.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
        symbol, eventTime: candleBaseTime + tick * 60_000, lastPrice: price,
        priceChangePercent24h: 1 });

    const firstService = createAutomation();
    const armPrice = opened.entryPrice * (1 + 0.51 / leverage);
    await send(firstService, armPrice, 4);
    const armed = await runtimePositionStateStore.getPositionRuntimeState(opened.id);
    expect(armed?.trailingTakeProfitActiveLevelIndex).toBe(0);
    expect(armed?.trailingTakeProfitHighPercent).toBeCloseTo(0.51, 4);
    expect(armed?.trailingTakeProfitStepPercent).toBeCloseTo(0.1, 4);

    const protectedPrice = opened.entryPrice * (1 + 0.41 / leverage);
    const recoveryPrice = opened.entryPrice * (1 + 0.46 / leverage);
    await send(firstService, recoveryPrice, 5);
    const tracked = await runtimePositionStateStore.getPositionRuntimeState(opened.id);
    expect(tracked?.trailingTakeProfitHighPercent).toBeCloseTo(0.51, 4);
    expect(tracked?.trailingTakeProfitStepPercent).toBeCloseTo(0.1, 4);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status).toBe('OPEN');

    // A paused bot can receive a strategy edit while its open position retains its armed TTP.
    const paused = await agent.put(`/dashboard/bots/${botId}`).send({ isActive: false });
    expect(paused.status).toBe(200);
    expect(paused.body.isActive).toBe(false);
    const dcaConfig = { ...baseConfig, additional: { ...baseConfig.additional, dcaEnabled: true } };
    const updated = await agent.put(`/dashboard/strategies/${strategyId}`).send({
      name: strategyName, interval: '1m', leverage, walletRisk: 1, config: dcaConfig,
    });
    expect(updated.status).toBe(200);
    expect((await prisma.strategy.findUniqueOrThrow({ where: { id: strategyId } })).config)
      .toEqual(expect.objectContaining({ additional: expect.objectContaining({ dcaEnabled: true }) }));
    const resumed = await agent.put(`/dashboard/bots/${botId}`).send({ isActive: true });
    expect(resumed.status).toBe(200);
    expect(resumed.body.isActive).toBe(true);

    // This retracement is above the +30.5% DCA level and below the armed +41% TTP floor.
    const dcaAndTtpPrice = opened.entryPrice * (1 + 0.31 / leverage);
    expect((dcaAndTtpPrice / opened.entryPrice - 1) * leverage).toBeGreaterThan(0.305);
    expect(dcaAndTtpPrice).toBeLessThan(protectedPrice);
    await send(firstService, dcaAndTtpPrice, 6);
    const afterDca = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    expect(afterDca.status).toBe('OPEN');
    expect(afterDca.closeReason).toBeNull();
    expect(afterDca.quantity).toBeGreaterThan(opened.quantity);
    expect(afterDca.entryPrice).toBeGreaterThan(opened.entryPrice);
    const dcaTrades = await prisma.trade.findMany({ where: {
      positionId: opened.id, lifecycleAction: 'DCA',
    } });
    expect(dcaTrades).toHaveLength(1);
    expect(dcaTrades[0].price * dcaTrades[0].quantity / leverage).toBeCloseTo(1, 4);
    expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'CLOSE' } })).toBe(0);
    expect(await prisma.order.count({ where: { positionId: opened.id } })).toBe(2);
    expect(await prisma.runtimeExecutionDedupe.count({ where: {
      botId, commandType: 'DCA', status: 'SUCCEEDED',
    } })).toBe(1);
    const durableDca = await loadDurableDcaProgress({
      userId: user.id, positionId: opened.id, botId, walletId: wallet.id,
      strategyId, symbol, positionSide: opened.side, sizingBasis: 'usdt_contribution_v1',
    });
    expect(durableDca.currentAdds).toBe(1);
    expect(durableDca.executedDcaLevelIndices).toEqual([0]);
    const eventsAfterDca = await prisma.botRuntimeEvent.findMany({ where: { botId, symbol } });
    expect(eventsAfterDca.filter((event) => event.eventType === 'DCA_EXECUTED')).toHaveLength(1);
    expect(eventsAfterDca.filter((event) => event.eventType === 'POSITION_CLOSED')).toHaveLength(0);
    expect(eventsAfterDca.filter((event) => event.eventType === 'SIGNAL_DECISION'
      && (event.payload as { reason?: string } | null)?.reason === 'trailing_take_profit')).toHaveLength(0);
    const afterFillState = await runtimePositionStateStore.getPositionRuntimeState(opened.id);
    expect(afterFillState?.trailingTakeProfitActiveLevelIndex).toBe(0);
    const rebasedFloorPrice = afterDca.entryPrice * (1 + (
      afterFillState!.trailingTakeProfitHighPercent! - afterFillState!.trailingTakeProfitStepPercent!
    ) / leverage);
    expect(rebasedFloorPrice).toBeCloseTo(protectedPrice, 5);

    const restartedService = createAutomation();
    const laterTtpPrice = opened.entryPrice * (1 + 0.305 / leverage);
    await send(restartedService, laterTtpPrice, 7);
    const closed = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    expect(closed.status).toBe('CLOSED');
    expect(closed.closeReason).toBe('TTP');
    expect(closed.closeInitiator).toBe('BOT_APP');
    expect(closed.realizedPnl).toBeGreaterThan(0);
    expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'CLOSE', closeReason: 'TTP' } })).toBe(1);
    expect(await prisma.order.count({ where: { positionId: opened.id, closeReason: 'TTP' } })).toBe(1);
    expect(await prisma.runtimeExecutionDedupe.count({ where: { botId, commandType: 'DCA' } })).toBe(1);
    const events = await prisma.botRuntimeEvent.findMany({ where: { botId, symbol } });
    expect(events.filter((event) => event.eventType === 'DCA_EXECUTED')).toHaveLength(1);
    expect(events.filter((event) => event.eventType === 'PRETRADE_BLOCKED')).toHaveLength(0);
    expect(events.filter((event) => event.eventType === 'POSITION_CLOSED')).toHaveLength(1);
    expect(events.filter((event) => event.eventType === 'SIGNAL_DECISION'
      && (event.payload as { reason?: string } | null)?.reason === 'trailing_take_profit')).toHaveLength(1);

    const afterCloseRestart = createAutomation();
    await send(afterCloseRestart, laterTtpPrice, 8);
    const reloaded = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
    expect(reloaded.status).toBe('CLOSED');
    expect(reloaded.closeReason).toBe('TTP');
    expect(await prisma.trade.count({ where: { positionId: opened.id } })).toBe(3);
    const persistedOrders = await prisma.order.findMany({ where: { positionId: opened.id } });
    expect(persistedOrders).toHaveLength(3);
    expect(persistedOrders.every((order) => order.status === 'FILLED')).toBe(true);
    expect(await prisma.botRuntimeEvent.count({ where: { botId, symbol } })).toBe(events.length);
  });
});
