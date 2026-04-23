import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  createWalletForContext,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime monitoring aggregate endpoint', () => {
  beforeEach(resetBotsE2eState);

  it('returns aggregate payload with status/symbol filters and ownership isolation', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const other = await registerAndLogin('bots-monitoring-aggregate-other@example.com');

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const completedSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'COMPLETED',
        startedAt: new Date('2026-04-19T10:00:00.000Z'),
        finishedAt: new Date('2026-04-19T10:10:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T10:10:00.000Z'),
      },
    });
    const runningSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-19T11:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T11:05:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          sessionId: completedSession.id,
          symbol: 'BTCUSDT',
          totalSignals: 2,
          longEntries: 1,
          shortEntries: 1,
          exits: 1,
          dcaCount: 0,
          closedTrades: 1,
          winningTrades: 1,
          losingTrades: 0,
          realizedPnl: 9,
          grossProfit: 12,
          grossLoss: 3,
          feesPaid: 0.7,
          openPositionCount: 0,
          openPositionQty: 0,
          snapshotAt: new Date('2026-04-19T10:09:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          sessionId: runningSession.id,
          symbol: 'ETHUSDT',
          totalSignals: 3,
          longEntries: 2,
          shortEntries: 1,
          exits: 0,
          dcaCount: 1,
          closedTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          realizedPnl: 0,
          grossProfit: 0,
          grossLoss: 0,
          feesPaid: 0.4,
          openPositionCount: 1,
          openPositionQty: 0.3,
          lastPrice: 3200,
          snapshotAt: new Date('2026-04-19T11:04:00.000Z'),
        },
      ],
    });

    const ethPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3000,
        quantity: 0.3,
        leverage: 1,
        openedAt: new Date('2026-04-19T11:02:00.000Z'),
        managementMode: 'BOT_MANAGED',
      },
      select: { id: true },
    });
    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 60000,
        quantity: 0.01,
        leverage: 1,
        openedAt: new Date('2026-04-19T10:01:00.000Z'),
        closedAt: new Date('2026-04-19T10:08:00.000Z'),
        managementMode: 'BOT_MANAGED',
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          positionId: ethPosition.id,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 3000,
          quantity: 0.3,
          fee: 1.2,
          realizedPnl: 0,
          executedAt: new Date('2026-04-19T11:03:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'SELL',
          lifecycleAction: 'CLOSE',
          price: 60300,
          quantity: 0.01,
          fee: 0.7,
          realizedPnl: 9,
          executedAt: new Date('2026-04-19T10:07:00.000Z'),
        },
      ],
    });

    const aggregateRes = await owner
      .get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`)
      .query({
        status: 'RUNNING',
        symbol: 'ethusdt',
        sessionsLimit: 20,
        perSessionLimit: 100,
      });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.sessionDetail.id).toBe('AGGREGATE');
    expect(aggregateRes.body.sessionDetail.metadata).toEqual(
      expect.objectContaining({
        aggregate: true,
        sessionsCount: 1,
      })
    );
    expect(aggregateRes.body.symbolStats.items).toHaveLength(1);
    expect(aggregateRes.body.symbolStats.items[0].symbol).toBe('ETHUSDT');
    expect(aggregateRes.body.symbolStats.summary.totalSignals).toBe(3);
    expect(typeof aggregateRes.body.positions.openCount).toBe('number');
    expect(Array.isArray(aggregateRes.body.positions.openItems)).toBe(true);
    expect(aggregateRes.body.positions.summary).toEqual(
      expect.objectContaining({
        referenceBalance: expect.any(Number),
        freeCash: expect.any(Number),
      })
    );
    expect(aggregateRes.body.positions.summary.referenceBalance).toBeGreaterThan(0);
    expect(aggregateRes.body.positions.summary.freeCash).toBeGreaterThanOrEqual(0);
    expect(typeof aggregateRes.body.trades.total).toBe('number');
    expect(Array.isArray(aggregateRes.body.trades.items)).toBe(true);
    expect(
      aggregateRes.body.trades.items.every((item: { symbol?: string }) => item.symbol === 'ETHUSDT')
    ).toBe(true);

    const otherRes = await other.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(otherRes.status).toBe(404);
  });

  it('returns deterministic empty aggregate payload when no sessions are available', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-empty@example.com';
    const owner = await registerAndLogin(ownerEmail);

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Empty Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.sessionDetail.id).toBe('AGGREGATE');
    expect(aggregateRes.body.sessionDetail.metadata).toEqual(
      expect.objectContaining({
        aggregate: true,
        sessionsCount: 0,
      })
    );
    expect(aggregateRes.body.positions.summary).toEqual(
      expect.objectContaining({
        referenceBalance: null,
        freeCash: null,
      })
    );
    expect(aggregateRes.body.symbolStats.items).toHaveLength(0);
    expect(aggregateRes.body.positions.total).toBe(0);
    expect(aggregateRes.body.trades.total).toBe(0);
  });

  it('uses paper reset checkpoint as the active capital baseline in runtime monitoring summary', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-paper-reset@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Reset Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    const resetAt = new Date('2026-04-19T11:00:00.000Z');
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        paperInitialBalance: 1_000,
        paperResetAt: resetAt,
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
        walletId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-19T11:05:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T11:10:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        symbol: 'BTCUSDT',
        totalSignals: 1,
        longEntries: 1,
        snapshotAt: new Date('2026-04-19T11:09:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 3200,
          quantity: 1,
          leverage: 1,
          realizedPnl: -800,
          openedAt: new Date('2026-04-19T10:00:00.000Z'),
          closedAt: new Date('2026-04-19T10:30:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 60000,
          quantity: 0.01,
          leverage: 1,
          realizedPnl: -120,
          openedAt: new Date('2026-04-19T11:06:00.000Z'),
          closedAt: new Date('2026-04-19T11:08:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.positions.summary.referenceBalance).toBe(880);
    expect(aggregateRes.body.positions.summary.freeCash).toBe(880);
    expect(aggregateRes.body.positions.summary.capitalSource).toBe('PAPER_RESET_CHECKPOINT');
    expect(aggregateRes.body.positions.summary.paperResetAt).toBe(resetAt.toISOString());
    expect(aggregateRes.body.positions.summary.baseCurrency).toBe('USDT');
  });

  it('keeps aggregate positions/orders/history deterministic when running session is empty', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-mixed-sessions@example.com';
    const owner = await registerAndLogin(ownerEmail);

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Mixed Sessions Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const completedSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'COMPLETED',
        startedAt: new Date('2026-04-19T09:00:00.000Z'),
        finishedAt: new Date('2026-04-19T09:20:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T09:20:00.000Z'),
      },
    });
    await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-19T10:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T10:05:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: completedSession.id,
        symbol: 'BTCUSDT',
        totalSignals: 2,
        longEntries: 1,
        shortEntries: 1,
        exits: 1,
        dcaCount: 0,
        closedTrades: 2,
        winningTrades: 1,
        losingTrades: 1,
        realizedPnl: 8,
        grossProfit: 12,
        grossLoss: 4,
        feesPaid: 1.3,
        openPositionCount: 0,
        openPositionQty: 0,
        snapshotAt: new Date('2026-04-19T09:19:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          id: 'position-z',
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 60000,
          quantity: 0.01,
          leverage: 1,
          openedAt: new Date('2026-04-19T09:01:00.000Z'),
          closedAt: new Date('2026-04-19T09:12:00.000Z'),
          managementMode: 'BOT_MANAGED',
          realizedPnl: 5,
        },
        {
          id: 'position-a',
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 60100,
          quantity: 0.01,
          leverage: 1,
          openedAt: new Date('2026-04-19T09:02:00.000Z'),
          closedAt: new Date('2026-04-19T09:12:00.000Z'),
          managementMode: 'BOT_MANAGED',
          realizedPnl: 3,
        },
      ],
    });

    await prisma.order.create({
      data: {
        id: 'order-open-only',
        userId: ownerUser.id,
        botId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.02,
        price: 59000,
        submittedAt: new Date('2026-04-19T09:05:00.000Z'),
        managementMode: 'BOT_MANAGED',
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          id: 'trade-z',
          userId: ownerUser.id,
          botId,
          strategyId,
          positionId: 'position-z',
          symbol: 'BTCUSDT',
          side: 'SELL',
          lifecycleAction: 'CLOSE',
          price: 60500,
          quantity: 0.01,
          fee: 0.7,
          realizedPnl: 5,
          executedAt: new Date('2026-04-19T09:12:00.000Z'),
          createdAt: new Date('2026-04-19T09:12:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          id: 'trade-a',
          userId: ownerUser.id,
          botId,
          strategyId,
          positionId: 'position-a',
          symbol: 'BTCUSDT',
          side: 'SELL',
          lifecycleAction: 'CLOSE',
          price: 60400,
          quantity: 0.01,
          fee: 0.6,
          realizedPnl: 3,
          executedAt: new Date('2026-04-19T09:12:00.000Z'),
          createdAt: new Date('2026-04-19T09:12:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const firstAggregate = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(firstAggregate.status).toBe(200);
    expect(firstAggregate.body.sessionDetail.metadata).toEqual(
      expect.objectContaining({
        aggregate: true,
        sessionsCount: 2,
      })
    );
    expect(firstAggregate.body.symbolStats.summary.totalSignals).toBe(2);
    expect(firstAggregate.body.positions.openCount).toBe(0);
    expect(firstAggregate.body.positions.closedCount).toBe(2);
    expect(firstAggregate.body.positions.openOrdersCount).toBe(1);
    expect(
      firstAggregate.body.positions.openOrders.map((item: { id: string; origin?: string }) => ({
        id: item.id,
        origin: item.origin,
      }))
    ).toEqual([{ id: 'order-open-only', origin: 'BOT' }]);
    expect(firstAggregate.body.positions.historyItems.map((item: { id: string }) => item.id)).toEqual([
      'position-a',
      'position-z',
    ]);
    expect(firstAggregate.body.trades.total).toBe(2);
    expect(firstAggregate.body.trades.items.map((item: { id: string }) => item.id)).toEqual([
      'trade-a',
      'trade-z',
    ]);

    const secondAggregate = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(secondAggregate.status).toBe(200);
    expect(secondAggregate.body.positions.historyItems.map((item: { id: string }) => item.id)).toEqual(
      firstAggregate.body.positions.historyItems.map((item: { id: string }) => item.id)
    );
    expect(secondAggregate.body.trades.items.map((item: { id: string }) => item.id)).toEqual(
      firstAggregate.body.trades.items.map((item: { id: string }) => item.id)
    );
  });
});
