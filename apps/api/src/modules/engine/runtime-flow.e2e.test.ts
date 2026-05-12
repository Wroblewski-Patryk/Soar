import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { RuntimeSignalLoop } from './runtimeSignalLoop.service';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore } from './runtimeTickerStore';
import { setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pollUntil = async <T>(
  resolver: () => Promise<T | null>,
  predicate: (value: T | null) => boolean,
  timeoutMs = 4_000,
  intervalMs = 100
) => {
  const deadline = Date.now() + timeoutMs;
  let current = await resolver();
  while (!predicate(current) && Date.now() < deadline) {
    await wait(intervalMs);
    current = await resolver();
  }
  return current;
};

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

describe('Runtime flow e2e (strategy -> backtest -> paper runtime)', () => {
  beforeEach(async () => {
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
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

  it('creates runtime orders/positions and closes via ticker lifecycle after strategy entry for PAPER bot', async () => {
    const runtimeSignalLoop = new RuntimeSignalLoop();
    const email = 'runtime-flow@example.com';
    const agent = await registerAndLogin(email);
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id,
      planCode: 'PROFESSIONAL',
      source: 'ADMIN_OVERRIDE',
      metadata: { reason: 'runtime-flow-e2e-plan-upgrade' },
    });

    const strategyRes = await agent.post('/dashboard/strategies').send({
      name: 'Runtime Strategy',
      interval: '1m',
      leverage: 1,
      walletRisk: 1,
      config: {
        open: {
          direction: 'both',
          noMatchAction: 'EXIT',
          indicatorsLong: [
            {
              name: 'RSI',
              condition: '>',
              value: 99,
              params: { period: 2 },
            },
          ],
          indicatorsShort: [],
        },
        close: { mode: 'basic', tp: 2, sl: 1 },
      },
    });
    expect(strategyRes.status).toBe(201);
    const strategyId = strategyRes.body.id as string;
    const createMarketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Runtime Bot Create Universe',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const createSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: createMarketUniverse.id,
        name: 'Runtime Bot Create Group',
        symbols: ['BTCUSDT'],
      },
    });

    const backtestRes = await agent.post('/dashboard/backtests/runs').send({
      name: 'Runtime Backtest',
      symbol: 'BTCUSDT',
      timeframe: '1m',
      strategyId,
    });
    expect(backtestRes.status).toBe(201);

    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Runtime Flow Paper Wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
      select: {
        id: true,
      },
    });

    const botRes = await agent.post('/dashboard/bots').send({
      name: 'Runtime Paper Bot',
      walletId: wallet.id,
      strategyId,
      marketGroupId: createSymbolGroup.id,
      isActive: true,
      liveOptIn: false,
      consentTextVersion: null,
    });
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    await expect(
      prisma.botMarketGroup.findFirstOrThrow({ where: { botId, isEnabled: true, lifecycleStatus: 'ACTIVE' } })
    ).resolves.toBeTruthy();

    const candleBaseTime = Date.now();
    const emitFinalCandle = async (index: number, close: number) => {
      const openTime = candleBaseTime + index * 60_000;
      const closeTime = openTime + 59_999;
      await runtimeSignalLoop.processCandleEvent({
        type: 'candle',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        eventTime: closeTime,
        openTime,
        closeTime,
        open: close,
        high: close * 1.001,
        low: close * 0.999,
        close,
        volume: 1000 + index,
        isFinal: true,
      });
    };

    await emitFinalCandle(0, 64000);
    await emitFinalCandle(1, 64100);
    await emitFinalCandle(2, 64200);

    await runtimeSignalLoop.processTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: Date.now(),
      lastPrice: 64200,
      priceChangePercent24h: 1.8,
    });

    const openedPosition = await pollUntil(
      () =>
        prisma.position.findFirst({
          where: {
            botId,
            symbol: 'BTCUSDT',
            status: 'OPEN',
          },
        }),
      (value) => Boolean(value)
    );
    expect(openedPosition).toBeTruthy();

    const openedOrder = await pollUntil(
      () =>
        prisma.order.findFirst({
          where: {
            botId,
            symbol: 'BTCUSDT',
          },
          orderBy: { createdAt: 'desc' },
        }),
      (value) => Boolean(value)
    );
    expect(openedOrder).toBeTruthy();

    const runtimeSignal = await pollUntil(
      () =>
        prisma.signal.findFirst({
          where: {
            botId,
            symbol: 'BTCUSDT',
          },
          orderBy: { createdAt: 'desc' },
        }),
      (value) => value?.direction === 'LONG'
    );
    expect(runtimeSignal?.direction).toBe('LONG');

    await emitFinalCandle(3, 50000);
    const exitSignal = await pollUntil(
      () =>
        prisma.signal.findFirst({
          where: {
            botId,
            symbol: 'BTCUSDT',
          },
          orderBy: { createdAt: 'desc' },
        }),
      (value) => value?.direction === 'EXIT'
    );
    expect(exitSignal?.direction).toBe('EXIT');

    await runtimeSignalLoop.processTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: Date.now() + 60_000,
      lastPrice: 50000,
      priceChangePercent24h: -3.8,
    });

    const closedPosition = await pollUntil(
      () =>
        prisma.position.findFirst({
          where: {
            botId,
            symbol: 'BTCUSDT',
          },
          orderBy: { createdAt: 'desc' },
        }),
      (value) => value?.status === 'CLOSED'
    );
    expect(closedPosition?.status).toBe('CLOSED');

    const runtimeSession = await pollUntil(
      () =>
        prisma.botRuntimeSession.findFirst({
          where: {
            botId,
            status: 'RUNNING',
            mode: 'PAPER',
          },
          orderBy: { startedAt: 'desc' },
        }),
      (value) => Boolean(value)
    );
    expect(runtimeSession?.status).toBe('RUNNING');

    const runtimeStats = await pollUntil(
      () =>
        prisma.botRuntimeSymbolStat.findFirst({
          where: {
            botId,
            sessionId: runtimeSession?.id,
            symbol: 'BTCUSDT',
          },
        }),
      (value) => Boolean(value) && Number(value?.totalSignals ?? 0) >= 2
    );
    expect(runtimeStats?.symbol).toBe('BTCUSDT');
    expect(Number(runtimeStats?.totalSignals ?? 0)).toBeGreaterThanOrEqual(2);
    expect(Number(runtimeStats?.longEntries ?? 0)).toBeGreaterThanOrEqual(1);
    expect(Number(runtimeStats?.exits ?? 0)).toBeGreaterThanOrEqual(1);
    expect(Number(runtimeStats?.lastPrice ?? 0)).toBe(50000);

    const runtimeEventsCount = await prisma.botRuntimeEvent.count({
      where: {
        botId,
        sessionId: runtimeSession?.id,
      },
    });
    expect(runtimeEventsCount).toBeGreaterThanOrEqual(3);

    const sessionsRes = await agent.get(`/dashboard/bots/${botId}/runtime-sessions`).query({
      status: 'RUNNING',
      limit: 10,
    });
    expect(sessionsRes.status).toBe(200);
    const apiSession = (
      sessionsRes.body as Array<{
        id: string;
        mode: string;
        status: string;
        eventsCount: number;
        symbolsTracked: number;
        summary: { totalSignals: number };
      }>
    ).find((session) => session.id === runtimeSession?.id);
    expect(apiSession).toBeTruthy();
    expect(apiSession).toEqual(
      expect.objectContaining({
        mode: 'PAPER',
        status: 'RUNNING',
        eventsCount: expect.any(Number),
        symbolsTracked: 1,
      })
    );
    expect(apiSession?.eventsCount).toBeGreaterThanOrEqual(3);
    expect(apiSession?.summary.totalSignals).toBeGreaterThanOrEqual(2);

    const detailRes = await agent.get(`/dashboard/bots/${botId}/runtime-sessions/${runtimeSession?.id}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.id).toBe(runtimeSession?.id);
    expect(detailRes.body.eventsCount).toBeGreaterThanOrEqual(3);
    expect(detailRes.body.symbolsTracked).toBe(1);
    expect(detailRes.body.summary.totalSignals).toBeGreaterThanOrEqual(2);
    expect(detailRes.body.summary.longEntries).toBeGreaterThanOrEqual(1);
    expect(detailRes.body.summary.exits).toBeGreaterThanOrEqual(1);

    const symbolStatsRes = await agent.get(
      `/dashboard/bots/${botId}/runtime-sessions/${runtimeSession?.id}/symbol-stats`
    );
    expect(symbolStatsRes.status).toBe(200);
    const apiBtcStats = (
      symbolStatsRes.body.items as Array<{
        symbol: string;
        totalSignals: number;
        longEntries: number;
        exits: number;
        lastPrice?: number | string | null;
        lastSignalDirection?: string | null;
      }>
    ).find((item) => item.symbol === 'BTCUSDT');
    expect(apiBtcStats).toBeTruthy();
    expect(apiBtcStats?.totalSignals).toBeGreaterThanOrEqual(2);
    expect(apiBtcStats?.longEntries).toBeGreaterThanOrEqual(1);
    expect(apiBtcStats?.exits).toBeGreaterThanOrEqual(1);
    expect(Number(apiBtcStats?.lastPrice ?? 0)).toBe(50000);
    expect(apiBtcStats?.lastSignalDirection).toBe('EXIT');

    const aggregateRes = await agent.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`).query({
      status: 'RUNNING',
      symbol: 'btcusdt',
      sessionsLimit: 10,
      perSessionLimit: 20,
    });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.sessionDetail.metadata.sessionsCount).toBe(1);
    expect(aggregateRes.body.symbolStats.items).toHaveLength(1);
    expect(aggregateRes.body.symbolStats.items[0].symbol).toBe('BTCUSDT');
    expect(aggregateRes.body.symbolStats.summary.totalSignals).toBeGreaterThanOrEqual(2);
    expect(aggregateRes.body.positions.closedCount).toBeGreaterThanOrEqual(1);
  });
});


