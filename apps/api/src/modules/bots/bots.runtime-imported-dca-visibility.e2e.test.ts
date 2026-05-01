import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { DCA_ADVANCED_STRATEGY_CONFIG } from './bots.e2e.fixtures';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime imported DCA visibility', () => {
  beforeEach(resetBotsE2eState);

  it('shows executed DCA count for imported managed runtime positions even when historical OPEN trade is absent', async () => {
    const ownerEmail = 'bot-runtime-imported-dca-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(
      owner,
      'Imported DCA Visibility Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-03T10:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-03T10:10:00.000Z'),
      },
    });

    const importedPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.105,
        quantity: 100,
        leverage: 15,
        openedAt: new Date('2026-04-03T10:01:00.000Z'),
        marginUsed: 0.7,
      },
    });

    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        positionId: importedPosition.id,
        symbol: 'DOGEUSDT',
        side: 'SELL',
        lifecycleAction: 'DCA',
        price: 0.106,
        quantity: 50,
        fee: 0,
        realizedPnl: 0,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        executedAt: new Date('2026-04-03T10:02:00.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('DOGEUSDT');
    expect(positionsRes.body.openItems[0].dcaCount).toBe(1);
    expect(positionsRes.body.openItems[0].dcaPlannedLevels).toEqual([-10, -20, -30]);
    expect(positionsRes.body.openItems[0].dcaExecutedLevels).toEqual([-10]);
  });

  it('keeps DCA visible when exchange sync replaces the local position row after an add fill', async () => {
    const ownerEmail = 'bot-runtime-replaced-dca-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(
      owner,
      'Replaced Imported DCA Visibility Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-05-01T00:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T00:20:00.000Z'),
      },
    });

    const supersededPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:superseded:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'CLOSED',
        entryPrice: 0.10589,
        quantity: 75,
        leverage: 15,
        openedAt: new Date('2026-05-01T00:00:04.270Z'),
        closedAt: new Date('2026-05-01T00:18:36.000Z'),
        marginUsed: 0.53,
      },
    });
    const currentPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:current:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.106635,
        quantity: 150,
        leverage: 15,
        openedAt: new Date('2026-05-01T00:18:36.503Z'),
        marginUsed: 1.06,
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: currentPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.106635,
          quantity: 150,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:18:36.503Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: supersededPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.10738,
          quantity: 75,
          fee: 0.00402675,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:18:37.400Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId: null,
          positionId: supersededPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.1075,
          quantity: 75,
          fee: 0,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:18:38.000Z'),
        },
      ],
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('DOGEUSDT');
    expect(positionsRes.body.openItems[0].dcaCount).toBe(1);
    expect(positionsRes.body.openItems[0].dcaPlannedLevels).toEqual([-10, -20, -30]);
    expect(positionsRes.body.openItems[0].dcaExecutedLevels).toEqual([-10]);
    expect(positionsRes.body.openItems[0].tradesCount).toBe(2);
    expect(positionsRes.body.openItems[0].lastTradeAt).toBe('2026-05-01T00:18:37.400Z');
  });

  it('keeps multiple DCA fills visible across several exchange-sync replacement rows', async () => {
    const ownerEmail = 'bot-runtime-multi-replaced-dca-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(
      owner,
      'Multi Replaced Imported DCA Visibility Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-05-01T00:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T01:10:00.000Z'),
      },
    });

    const firstPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:first:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'CLOSED',
        entryPrice: 0.10589,
        quantity: 75,
        leverage: 15,
        openedAt: new Date('2026-05-01T00:00:04.270Z'),
        closedAt: new Date('2026-05-01T00:18:36.000Z'),
        marginUsed: 0.53,
      },
    });
    const secondPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:second:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'CLOSED',
        entryPrice: 0.106635,
        quantity: 150,
        leverage: 15,
        openedAt: new Date('2026-05-01T00:18:36.503Z'),
        closedAt: new Date('2026-05-01T01:05:19.000Z'),
        marginUsed: 1.06,
      },
    });
    const currentPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:current:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.1073875,
        quantity: 300,
        leverage: 15,
        openedAt: new Date('2026-05-01T01:05:19.346Z'),
        marginUsed: 2.15,
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: firstPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.10589,
          quantity: 75,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:00:04.270Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: firstPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.10738,
          quantity: 75,
          fee: 0.00402675,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:18:37.400Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: secondPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.106635,
          quantity: 150,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:18:36.503Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: secondPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.10814,
          quantity: 150,
          fee: 0.0081105,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:05:20.250Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: currentPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.1073875,
          quantity: 300,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:05:19.346Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId: null,
          positionId: secondPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.1082,
          quantity: 150,
          fee: 0,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:05:21.000Z'),
        },
      ],
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('DOGEUSDT');
    expect(positionsRes.body.openItems[0].dcaCount).toBe(2);
    expect(positionsRes.body.openItems[0].dcaPlannedLevels).toEqual([-10, -20, -30]);
    expect(positionsRes.body.openItems[0].dcaExecutedLevels).toEqual([-10, -20]);
    expect(positionsRes.body.openItems[0].tradesCount).toBe(3);
    expect(positionsRes.body.openItems[0].lastTradeAt).toBe('2026-05-01T01:05:20.250Z');
  });

  it('keeps legacy wallet-scoped DCA visible when imported trades lost bot and strategy refs', async () => {
    const ownerEmail = 'bot-runtime-wallet-scoped-legacy-dca-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(
      owner,
      'Wallet Scoped Legacy DCA Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-05-01T09:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T10:00:00.000Z'),
      },
    });

    const firstImportedRow = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: null,
        walletId,
        strategyId,
        externalId: `eth:first:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 3000,
        quantity: 0.02,
        leverage: 10,
        openedAt: new Date('2026-05-01T09:01:00.000Z'),
        closedAt: new Date('2026-05-01T09:20:00.000Z'),
        marginUsed: 6,
      },
    });
    const secondImportedRow = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: null,
        walletId,
        strategyId,
        externalId: `eth:second:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 2940,
        quantity: 0.04,
        leverage: 10,
        openedAt: new Date('2026-05-01T09:20:01.000Z'),
        closedAt: new Date('2026-05-01T09:40:00.000Z'),
        marginUsed: 11.76,
      },
    });
    const currentPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `eth:current:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 2880,
        quantity: 0.08,
        leverage: 10,
        openedAt: new Date('2026-05-01T09:40:01.000Z'),
        marginUsed: 23.04,
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: firstImportedRow.id,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 3000,
          quantity: 0.02,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T09:01:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId: null,
          walletId,
          strategyId: null,
          positionId: firstImportedRow.id,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'DCA',
          price: 2940,
          quantity: 0.02,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T09:20:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: secondImportedRow.id,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 2940,
          quantity: 0.04,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T09:20:01.000Z'),
        },
        {
          userId: ownerUser.id,
          botId: null,
          walletId,
          strategyId: null,
          positionId: secondImportedRow.id,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'DCA',
          price: 2880,
          quantity: 0.04,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T09:40:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: currentPosition.id,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 2880,
          quantity: 0.08,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T09:40:01.000Z'),
        },
      ],
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions?symbol=ETHUSDT`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0]).toEqual(
      expect.objectContaining({
        id: currentPosition.id,
        symbol: 'ETHUSDT',
        dcaCount: 2,
        dcaPlannedLevels: [-10, -20, -30],
        dcaExecutedLevels: [-10, -20],
        tradesCount: 3,
        lastTradeAt: '2026-05-01T09:40:01.000Z',
      })
    );
  });

  it('does not carry stale DCA into a same-symbol reopen after a legacy close without strategy id', async () => {
    const ownerEmail = 'bot-runtime-reopen-stale-dca-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(
      owner,
      'Reopen Stale DCA Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-05-01T00:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T02:00:00.000Z'),
      },
    });

    const firstPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `reopen:first:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'CLOSED',
        entryPrice: 0.10589,
        quantity: 75,
        leverage: 15,
        openedAt: new Date('2026-05-01T00:00:04.270Z'),
        closedAt: new Date('2026-05-01T00:18:49.555Z'),
        marginUsed: 0.53,
      },
    });
    const secondPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `reopen:second:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'CLOSED',
        entryPrice: 0.1073875,
        quantity: 300,
        leverage: 15,
        openedAt: new Date('2026-05-01T01:05:19.346Z'),
        closedAt: new Date('2026-05-01T01:42:47.177Z'),
        closeReason: 'TSL',
        closeInitiator: 'BOT_APP',
        marginUsed: 2.15,
        realizedPnl: -0.35,
      },
    });
    const reopenedPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `reopen:fresh:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.10867,
        quantity: 70,
        leverage: 15,
        openedAt: new Date('2026-05-01T01:50:55.213Z'),
        marginUsed: 0.51,
      },
    });

    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: firstPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.10589,
          quantity: 75,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:00:04.270Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: firstPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.10738,
          quantity: 75,
          fee: 0.004,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T00:18:37.400Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: secondPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.1073875,
          quantity: 300,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:05:19.346Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: secondPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'DCA',
          price: 0.10814,
          quantity: 150,
          fee: 0.008,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:05:20.250Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId: null,
          positionId: secondPosition.id,
          symbol: 'DOGEUSDT',
          side: 'BUY',
          lifecycleAction: 'CLOSE',
          price: 0.1085,
          quantity: 300,
          fee: 0.016,
          realizedPnl: -0.35,
          origin: 'BOT',
          closeReason: 'TSL',
          closeInitiator: 'BOT_APP',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:42:50.861Z'),
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          positionId: reopenedPosition.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          price: 0.10867,
          quantity: 70,
          fee: 0,
          realizedPnl: 0,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          executedAt: new Date('2026-05-01T01:50:55.213Z'),
        },
      ],
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions?symbol=DOGEUSDT`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0]).toEqual(
      expect.objectContaining({
        id: reopenedPosition.id,
        symbol: 'DOGEUSDT',
        dcaCount: 0,
        dcaExecutedLevels: [],
        tradesCount: 1,
        lastTradeAt: '2026-05-01T01:50:55.213Z',
      })
    );
    expect(positionsRes.body.historyItems[0]).toEqual(
      expect.objectContaining({
        id: secondPosition.id,
        closeReason: 'TSL',
        dcaCount: 1,
      })
    );
  });
});
