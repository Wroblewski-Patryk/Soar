import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createWalletForContext,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime history parity contract', () => {
  beforeEach(resetBotsE2eState);

  it('keeps runtime history parity for carry-over bot-managed positions on completed sessions', async () => {
    const ownerEmail = 'bot-history-parity@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'History Carry-over');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const botRes = await owner.post('/dashboard/bots').send(createPayload({ strategyId, marketGroupId }));
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;
    const walletId = botRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'COMPLETED',
        startedAt: new Date('2026-04-10T05:00:00.000Z'),
        finishedAt: new Date('2026-04-10T05:10:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T05:10:00.000Z'),
      },
      select: { id: true },
    });

    const carryOverPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 68000,
        quantity: 0.01,
        leverage: 2,
        openedAt: new Date('2026-04-10T04:40:00.000Z'),
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
      select: { id: true },
    });

    const carryOverTrade = await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        positionId: carryOverPosition.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 68000,
        quantity: 0.01,
        fee: 0.34,
        executedAt: new Date('2026-04-10T04:41:00.000Z'),
      },
      select: { id: true },
    });

    const positionsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`);
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);

    const tradesRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/trades`);
    expect(tradesRes.status).toBe(200);
    expect(tradesRes.body.total).toBeGreaterThanOrEqual(1);
    expect(
      (tradesRes.body.items as Array<{ id: string; symbol: string }>).some(
        (item) => item.id === carryOverTrade.id && item.symbol === 'BTCUSDT'
      )
    ).toBe(true);
  });

  it('keeps PRETRADE_BLOCKED diagnostics visible in runtime session event counters', async () => {
    const ownerEmail = 'bot-runtime-pretrade-blocked-diagnostics@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Pretrade Diagnostics');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const botRes = await owner.post('/dashboard/bots').send(createPayload({ strategyId, marketGroupId }));
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-10T06:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T06:01:00.000Z'),
      },
      select: { id: true },
    });

    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        eventType: 'PRETRADE_BLOCKED',
        level: 'WARN',
        symbol: 'BTCUSDT',
        message: 'Signal execution blocked by runtime orchestration guardrails',
        payload: {
          reason: 'already_open_same_side',
          direction: 'LONG',
        },
        eventAt: new Date('2026-04-10T06:01:00.000Z'),
      },
    });

    const listRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(session.id);
    expect(listRes.body[0].eventsCount).toBe(1);

    const detailRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.id).toBe(session.id);
    expect(detailRes.body.eventsCount).toBe(1);
  });

  it('keeps externally closed imported bot-managed positions visible in history with open and close timestamps', async () => {
    const ownerEmail = 'bot-history-imported-external-close@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Imported History Carry-over');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Imported history live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId,
        symbolGroupId: marketGroupId,
        strategyId,
      },
      select: { id: true },
    });
    const botId = bot.id;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-10T07:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T07:10:00.000Z'),
      },
      select: { id: true },
    });

    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
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
        entryPrice: 0.1,
        quantity: 1000,
        leverage: 5,
        openedAt: new Date('2026-04-10T06:45:00.000Z'),
        closedAt: new Date('2026-04-10T07:05:00.000Z'),
        closeReason: 'EXTERNAL_SYNC_MISSING',
        closeInitiator: 'USER_EXCHANGE',
      },
    });

    const positionsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`);
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openCount).toBe(0);
    expect(positionsRes.body.closedCount).toBe(1);
    expect(positionsRes.body.historyItems).toHaveLength(1);
    expect(positionsRes.body.historyItems[0]).toEqual(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        closeInitiator: 'USER_EXCHANGE',
        openedAt: '2026-04-10T06:45:00.000Z',
        closedAt: '2026-04-10T07:05:00.000Z',
      })
    );
  });

  it('adds an operational OPEN history anchor for imported live positions that have no local trade rows yet', async () => {
    const ownerEmail = 'bot-history-imported-open-anchor@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Imported Open Anchor');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Imported open anchor live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId,
        symbolGroupId: marketGroupId,
        strategyId,
      },
      select: { id: true },
    });
    const botId = bot.id;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-10T07:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T07:10:00.000Z'),
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: 'api-key-1:BTCUSDT:SHORT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'BTCUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 618.46,
        quantity: 0.01,
        leverage: 15,
        marginUsed: 0.40921438,
        openedAt: new Date('2026-04-10T07:03:00.000Z'),
      },
      select: { id: true },
    });

    const tradesRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/trades`);
    expect(tradesRes.status).toBe(200);
    expect(tradesRes.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `position-open:${position.id}`,
          symbol: 'BTCUSDT',
          side: 'SELL',
          lifecycleAction: 'OPEN',
          actionReason: 'POSITION_LIFETIME',
          price: 618.46,
          quantity: 0.01,
          positionId: position.id,
          margin: 0.40921438,
        }),
      ])
    );

    const positionsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`);
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: position.id,
          symbol: 'BTCUSDT',
          tradesCount: 0,
          firstTradeAt: null,
          lastTradeAt: null,
        }),
      ])
    );

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    expect(aggregateRes.body.trades.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `position-open:${position.id}`,
          symbol: 'BTCUSDT',
          lifecycleAction: 'OPEN',
          actionReason: 'POSITION_LIFETIME',
        }),
      ])
    );
  });

  it('uses canonical strategy for imported OPEN trade anchors when position strategy is missing', async () => {
    const ownerEmail = 'bot-history-imported-open-anchor-strategy@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Imported Open Anchor Strategy Context');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Imported open anchor strategy context live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId,
        symbolGroupId: marketGroupId,
        strategyId,
      },
      select: { id: true },
    });
    const botId = bot.id;
    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId,
        symbolGroupId: marketGroupId,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 1,
        isEnabled: true,
      },
      select: { id: true },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerUser.id,
        botId,
        botMarketGroupId: botMarketGroup.id,
        strategyId,
        priority: 100,
        weight: 1,
        isEnabled: true,
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-10T07:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T07:10:00.000Z'),
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId: null,
        externalId: 'api-key-1:BTCUSDT:SHORT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'BTCUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 618.46,
        quantity: 0.01,
        leverage: 15,
        marginUsed: 0.40921438,
        openedAt: new Date('2026-04-10T07:03:00.000Z'),
      },
      select: { id: true },
    });

    const tradesRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/trades`);
    expect(tradesRes.status).toBe(200);
    expect(tradesRes.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `position-open:${position.id}`,
          symbol: 'BTCUSDT',
          lifecycleAction: 'OPEN',
          actionReason: 'POSITION_LIFETIME',
          positionId: position.id,
          strategyId,
        }),
      ])
    );
  });

  it('keeps imported OPEN lifecycle visible in both runtime history and canonical positions metadata after local anchor hydration', async () => {
    const ownerEmail = 'bot-history-imported-open-ledger@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Imported Open Ledger');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Imported open ledger live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId,
        symbolGroupId: marketGroupId,
        strategyId,
      },
      select: { id: true },
    });
    const botId = bot.id;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-10T07:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T07:10:00.000Z'),
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: 'api-key-1:BTCUSDT:SHORT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'BTCUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 2.15,
        quantity: 3,
        leverage: 15,
        marginUsed: 0.43,
        openedAt: new Date('2026-04-10T07:04:00.000Z'),
      },
      select: { id: true },
    });

    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'SELL',
        lifecycleAction: 'OPEN',
        price: 2.15,
        quantity: 3,
        fee: 0,
        feeSource: 'ESTIMATED',
        feePending: false,
        feeCurrency: null,
        exchangeTradeId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        executedAt: new Date('2026-04-10T07:04:00.000Z'),
      },
    });

    const positionsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`);
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: position.id,
          symbol: 'BTCUSDT',
          tradesCount: 1,
          firstTradeAt: '2026-04-10T07:04:00.000Z',
          lastTradeAt: '2026-04-10T07:04:00.000Z',
        }),
      ])
    );

    const tradesRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/trades`);
    expect(tradesRes.status).toBe(200);
    expect(tradesRes.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          symbol: 'BTCUSDT',
          lifecycleAction: 'OPEN',
          actionReason: 'POSITION_LIFETIME',
          positionId: position.id,
        }),
      ])
    );
  });
});
