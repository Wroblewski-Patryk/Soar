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
    expect(aggregateRes.body.sessionDetail.lastHeartbeatAt).toBeNull();
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

  it('keeps empty RUNNING aggregate metadata unfinished when no sessions are available', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-empty-running@example.com';
    const owner = await registerAndLogin(ownerEmail);

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Empty Running Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const aggregateRes = await owner
      .get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`)
      .query({ status: 'RUNNING' });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.sessionDetail.status).toBe('RUNNING');
    expect(aggregateRes.body.sessionDetail.finishedAt).toBeNull();
    expect(aggregateRes.body.sessionDetail.metadata.sessionsCount).toBe(0);
    expect(aggregateRes.body.positions.total).toBe(0);
    expect(aggregateRes.body.trades.total).toBe(0);
  });

  it('keeps LIVE bot mode in empty aggregate payload when no sessions are available', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-empty-live@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Empty Live Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'empty-live-aggregate-bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: false,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId,
        strategyId,
        symbolGroupId: marketGroupId,
      },
      select: { id: true },
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${bot.id}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.sessionDetail.id).toBe('AGGREGATE');
    expect(aggregateRes.body.sessionDetail.mode).toBe('LIVE');
    expect(aggregateRes.body.sessionDetail.metadata.sessionsCount).toBe(0);
    expect(aggregateRes.body.positions.total).toBe(0);
    expect(aggregateRes.body.trades.total).toBe(0);
  });

  it('keeps aggregate header PnL aligned with imported closed position summary when trades are missing', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-imported-position-pnl@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Imported Position PnL');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'imported-position-pnl-aggregate-bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId,
        strategyId,
        symbolGroupId: marketGroupId,
      },
      select: { id: true },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-19T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T12:10:00.000Z'),
      },
    });
    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        sessionId: session.id,
        symbol: 'BTCUSDT',
        snapshotAt: new Date('2026-04-19T12:08:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId,
        strategyId,
        externalId: 'api-key-1:BTCUSDT:LONG',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 60000,
        quantity: 0.01,
        leverage: 2,
        realizedPnl: 37.5,
        openedAt: new Date('2026-04-19T11:55:00.000Z'),
        closedAt: new Date('2026-04-19T12:05:00.000Z'),
        closeReason: 'EXTERNAL_SYNC_MISSING',
        closeInitiator: 'USER_EXCHANGE',
      },
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${bot.id}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.positions.summary.realizedPnl).toBe(37.5);
    expect(aggregateRes.body.sessionDetail.summary.realizedPnl).toBe(37.5);
    expect(aggregateRes.body.trades.total).toBe(0);
  });

  it('keeps aggregate trade totals truthful when visible trade rows are limited', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-trade-total-limit@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Trade Total Limit');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'COMPLETED',
        startedAt: new Date('2026-04-19T14:00:00.000Z'),
        finishedAt: new Date('2026-04-19T14:10:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T14:10:00.000Z'),
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 60_000,
          quantity: 0.01,
          fee: 0.5,
          executedAt: new Date('2026-04-19T14:02:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'SELL',
          lifecycleAction: 'CLOSE',
          price: 60_500,
          quantity: 0.01,
          fee: 0.6,
          realizedPnl: 5,
          executedAt: new Date('2026-04-19T14:05:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });
    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`).query({
      perSessionLimit: 1,
    });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.trades.items).toHaveLength(1);
    expect(aggregateRes.body.trades.total).toBe(2);
    expect(aggregateRes.body.sessionDetail.summary.feesPaid).toBeCloseTo(1.1);
    expect(aggregateRes.body.trades.meta).toEqual(
      expect.objectContaining({
        page: 1,
        pageSize: 1,
        total: 2,
        totalPages: 2,
        hasPrev: false,
        hasNext: true,
      })
    );
  });

  it('keeps aggregate symbol-stats summaries truthful when visible symbols are limited', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-symbol-summary-limit@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Symbol Summary Limit');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
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
        startedAt: new Date('2026-04-19T14:30:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T14:40:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          sessionId: session.id,
          symbol: 'BTCUSDT',
          totalSignals: 2,
          longEntries: 1,
          shortEntries: 1,
          exits: 0,
          dcaCount: 0,
          closedTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          realizedPnl: 5,
          grossProfit: 5,
          grossLoss: 0,
          feesPaid: 0.2,
          openPositionCount: 0,
          openPositionQty: 0,
          snapshotAt: new Date('2026-04-19T14:35:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          sessionId: session.id,
          symbol: 'ETHUSDT',
          totalSignals: 3,
          longEntries: 2,
          shortEntries: 1,
          exits: 1,
          dcaCount: 1,
          closedTrades: 1,
          winningTrades: 1,
          losingTrades: 0,
          realizedPnl: 3,
          grossProfit: 4,
          grossLoss: 1,
          feesPaid: 0.3,
          openPositionCount: 0,
          openPositionQty: 0,
          snapshotAt: new Date('2026-04-19T14:36:00.000Z'),
        },
      ],
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`).query({
      perSessionLimit: 1,
    });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.symbolStats.items).toHaveLength(1);
    expect(aggregateRes.body.sessionDetail.symbolsTracked).toBe(2);
    expect(aggregateRes.body.symbolStats.summary.totalSignals).toBe(5);
    expect(aggregateRes.body.symbolStats.summary.longEntries).toBe(3);
    expect(aggregateRes.body.symbolStats.summary.realizedPnl).toBe(8);
    expect(aggregateRes.body.sessionDetail.summary.totalSignals).toBe(5);
    expect(aggregateRes.body.sessionDetail.summary.longEntries).toBe(3);
  });

  it('keeps aggregate open position quantity truthful when visible open rows are limited', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-open-qty-limit@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Open Qty Limit');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        paperInitialBalance: 1_000,
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

    await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-19T15:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T15:10:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          id: 'aggregate-limit-btc-open',
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 60_000,
          quantity: 0.01,
          leverage: 2,
          marginUsed: 100,
          unrealizedPnl: 7,
          openedAt: new Date('2026-04-19T15:02:00.000Z'),
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
        },
        {
          id: 'aggregate-limit-eth-open',
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 3_000,
          quantity: 0.2,
          leverage: 2,
          marginUsed: 200,
          unrealizedPnl: 11,
          openedAt: new Date('2026-04-19T15:04:00.000Z'),
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
        },
      ],
    });
    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          positionId: 'aggregate-limit-btc-open',
          strategyId,
          symbol: 'BTCUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 60_000,
          quantity: 0.01,
          fee: 0.5,
          executedAt: new Date('2026-04-19T15:02:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          positionId: 'aggregate-limit-eth-open',
          strategyId,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 3_000,
          quantity: 0.2,
          fee: 0.6,
          executedAt: new Date('2026-04-19T15:04:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`).query({
      perSessionLimit: 1,
    });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.positions.openItems).toHaveLength(1);
    expect(aggregateRes.body.positions.openCount).toBe(2);
    expect(aggregateRes.body.sessionDetail.summary.openPositionCount).toBe(2);
    expect(aggregateRes.body.sessionDetail.summary.openPositionQty).toBeCloseTo(0.21);
    expect(aggregateRes.body.positions.summary.unrealizedPnl).toBeCloseTo(18);
    expect(aggregateRes.body.positions.summary.feesPaid).toBeCloseTo(1.1);
    expect(aggregateRes.body.positions.summary.referenceBalance).toBe(1_000);
    expect(aggregateRes.body.positions.summary.freeCash).toBe(700);
  });

  it('keeps aggregate open order counts truthful when visible open orders are limited', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-open-orders-limit@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Open Orders Limit');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-19T16:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-19T16:10:00.000Z'),
      },
    });

    await prisma.order.createMany({
      data: [
        {
          id: 'aggregate-open-order-newer',
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'LIMIT',
          status: 'OPEN',
          quantity: 0.01,
          price: 60_000,
          submittedAt: new Date('2026-04-19T16:06:00.000Z'),
          createdAt: new Date('2026-04-19T16:06:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          id: 'aggregate-open-order-older',
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'BUY',
          type: 'LIMIT',
          status: 'OPEN',
          quantity: 0.2,
          price: 3_000,
          submittedAt: new Date('2026-04-19T16:04:00.000Z'),
          createdAt: new Date('2026-04-19T16:04:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`).query({
      perSessionLimit: 1,
    });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.positions.openOrders).toHaveLength(1);
    expect(aggregateRes.body.positions.openOrdersCount).toBe(2);
    expect(aggregateRes.body.positions.openOrders.map((order: { id: string }) => order.id)).toEqual([
      'aggregate-open-order-newer',
    ]);
  });

  it('uses last heartbeat as aggregate finish time for non-running sessions without finishedAt', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-failed-window-end@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Failed Window End');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const heartbeatAt = new Date('2026-04-19T13:07:00.000Z');

    const failedSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'FAILED',
        startedAt: new Date('2026-04-19T13:00:00.000Z'),
        lastHeartbeatAt: heartbeatAt,
        errorMessage: 'runtime stopped after unrecoverable test error',
      },
    });
    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: failedSession.id,
        symbol: 'BTCUSDT',
        totalSignals: 1,
        snapshotAt: new Date('2026-04-19T13:05:00.000Z'),
      },
    });

    const aggregateRes = await owner
      .get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`)
      .query({ status: 'FAILED' });
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.sessionDetail.status).toBe('FAILED');
    expect(aggregateRes.body.sessionDetail.finishedAt).toBe(heartbeatAt.toISOString());
    expect(aggregateRes.body.positions.window.finishedAt).toBe(heartbeatAt.toISOString());
    expect(aggregateRes.body.trades.window.finishedAt).toBe(heartbeatAt.toISOString());
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

  it('keeps PAPER monitoring capital scoped to the selected bot even when the wallet has historical rows from another bot', async () => {
    const ownerEmail = 'bots-monitoring-aggregate-paper-scope@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Monitoring Aggregate Scope Strategy');
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
        paperInitialBalance: 100,
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

    const otherBot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'historical-paper-bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: false,
        paperStartBalance: 100,
        walletId,
        strategyId,
        symbolGroupId: marketGroupId,
      },
      select: { id: true },
    });

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
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 60000,
          quantity: 0.001,
          leverage: 1,
          realizedPnl: 20,
          openedAt: new Date('2026-04-19T11:06:00.000Z'),
          closedAt: new Date('2026-04-19T11:08:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId: otherBot.id,
          walletId,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 3200,
          quantity: 10,
          leverage: 1,
          realizedPnl: 50_000,
          openedAt: new Date('2026-04-19T11:01:00.000Z'),
          closedAt: new Date('2026-04-19T11:02:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.positions.summary.referenceBalance).toBe(120);
    expect(aggregateRes.body.positions.summary.freeCash).toBe(120);
    expect(aggregateRes.body.positions.summary.capitalSource).toBe('PAPER_RESET_CHECKPOINT');
    expect(aggregateRes.body.positions.summary.paperResetAt).toBe(resetAt.toISOString());
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
    expect(firstAggregate.body.sessionDetail.status).toBe('RUNNING');
    expect(firstAggregate.body.sessionDetail.finishedAt).toBeNull();
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
