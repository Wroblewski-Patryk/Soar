import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
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
    expect(aggregateRes.body.symbolStats.items).toHaveLength(0);
    expect(aggregateRes.body.positions.total).toBe(0);
    expect(aggregateRes.body.trades.total).toBe(0);
  });
});
