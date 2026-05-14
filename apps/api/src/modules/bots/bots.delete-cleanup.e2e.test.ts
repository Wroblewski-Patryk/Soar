import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots delete cleanup contract', () => {
  beforeEach(resetBotsE2eState);

  it('deletes bot-owned runtime and trading artifacts while preserving the strategy', async () => {
    const email = 'bots-delete-runtime-cleanup@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Delete Runtime Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    const createRes = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId }),
    });
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: user.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });
    await prisma.botRuntimeEvent.create({
      data: {
        userId: user.id,
        botId,
        sessionId: session.id,
        eventType: 'HEARTBEAT',
        level: 'INFO',
        eventAt: new Date(),
      },
    });
    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: user.id,
        botId,
        sessionId: session.id,
        symbol: 'BTCUSDT',
      },
    });
    const dedupe = await prisma.runtimeExecutionDedupe.create({
      data: {
        dedupeKey: 'delete-runtime-cleanup:bot-dedupe',
        dedupeVersion: 'v1',
        commandType: 'DCA',
        userId: user.id,
        botId,
        symbol: 'BTCUSDT',
        commandFingerprint: { botId, symbol: 'BTCUSDT', level: 1 },
        ttlExpiresAt: new Date(Date.now() + 60_000),
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId,
        strategyId,
        walletId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId,
        strategyId,
        walletId,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 1,
        price: 100,
      },
    });
    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        botId,
        strategyId,
        walletId,
        positionId: position.id,
        orderId: order.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 100,
        quantity: 1,
      },
    });

    await prisma.orderFill.create({
      data: {
        userId: user.id,
        botId,
        strategyId,
        orderId: order.id,
        tradeId: trade.id,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        exchangeTradeId: 'delete-runtime-cleanup-fill',
        price: 100,
        quantity: 1,
        notional: 100,
        executedAt: new Date(),
      },
    });
    await prisma.signal.create({
      data: {
        userId: user.id,
        botId,
        strategyId,
        symbol: 'BTCUSDT',
        timeframe: '5m',
        direction: 'LONG',
      },
    });
    await prisma.log.create({
      data: {
        userId: user.id,
        botId,
        strategyId,
        action: 'bot.delete.fixture',
        source: 'test',
        message: 'bot delete cleanup fixture',
      },
    });

    const deleteRes = await agent.delete(`/dashboard/bots/${botId}`);
    expect(deleteRes.status).toBe(204);

    const [
      sessionsCount,
      eventsCount,
      statsCount,
      dedupeCount,
      positionsCount,
      ordersCount,
      tradesCount,
      fillsCount,
      signalsCount,
      logsCount,
      strategy,
    ] = await Promise.all([
      prisma.botRuntimeSession.count({ where: { botId } }),
      prisma.botRuntimeEvent.count({ where: { botId } }),
      prisma.botRuntimeSymbolStat.count({ where: { botId } }),
      prisma.runtimeExecutionDedupe.count({ where: { id: dedupe.id } }),
      prisma.position.count({ where: { id: position.id } }),
      prisma.order.count({ where: { id: order.id } }),
      prisma.trade.count({ where: { id: trade.id } }),
      prisma.orderFill.count({ where: { orderId: order.id } }),
      prisma.signal.count({ where: { botId } }),
      prisma.log.count({ where: { botId } }),
      prisma.strategy.findUnique({ where: { id: strategyId } }),
    ]);

    expect(sessionsCount).toBe(0);
    expect(eventsCount).toBe(0);
    expect(statsCount).toBe(0);
    expect(dedupeCount).toBe(0);
    expect(positionsCount).toBe(0);
    expect(ordersCount).toBe(0);
    expect(tradesCount).toBe(0);
    expect(fillsCount).toBe(0);
    expect(signalsCount).toBe(0);
    expect(logsCount).toBe(0);
    expect(strategy?.id).toBe(strategyId);
  });
});
