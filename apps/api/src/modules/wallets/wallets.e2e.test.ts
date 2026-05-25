import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';

const originalApiKeyEncryptionKeys = process.env.API_KEY_ENCRYPTION_KEYS;

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

const resolveUserIdByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  expect(user?.id).toBeTruthy();
  return user!.id;
};

describe('Wallets balance preview contract', () => {
  beforeAll(() => {
    process.env.API_KEY_ENCRYPTION_KEYS = 'v1:test-wallet-preview-keyring';
  });

  beforeEach(async () => {
    delete process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE;
    delete process.env.WALLET_PREVIEW_TEST_FREE_BALANCE;
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.position.deleteMany();
    await prisma.order.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.log.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(() => {
    if (originalApiKeyEncryptionKeys === undefined) delete process.env.API_KEY_ENCRYPTION_KEYS;
    else process.env.API_KEY_ENCRYPTION_KEYS = originalApiKeyEncryptionKeys;
  });

  it('rejects unauthenticated balance preview access', async () => {
    const res = await request(app).post('/dashboard/wallets/preview-balance').send({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: 'missing',
    });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Missing token');
  });

  it('returns exchange-driven wallet metadata with market-type specific base currencies', async () => {
    const agent = await registerAndLogin('wallet-metadata-owner@example.com');

    const metadataRes = await agent.get('/dashboard/wallets/metadata').query({
      exchange: 'BINANCE',
      marketType: 'SPOT',
    });

    expect(metadataRes.status).toBe(200);
    expect(metadataRes.body).toMatchObject({
      exchange: 'BINANCE',
      marketType: 'SPOT',
      source: 'MARKET_CATALOG',
    });
    expect(metadataRes.body.marketTypes).toEqual(expect.arrayContaining(['FUTURES', 'SPOT']));
    expect(metadataRes.body.baseCurrencies).toEqual(expect.arrayContaining(['USDT', 'EUR']));
    expect(metadataRes.body.byMarketType.SPOT.baseCurrencies).toEqual(
      expect.arrayContaining(['USDT', 'EUR'])
    );
    expect(metadataRes.body.byMarketType.FUTURES.baseCurrencies).toContain('USDT');
  });

  it('falls back to exchange capability defaults when market catalog is unavailable', async () => {
    const agent = await registerAndLogin('wallet-metadata-placeholder@example.com');

    const metadataRes = await agent.get('/dashboard/wallets/metadata').query({
      exchange: 'OKX',
      marketType: 'SPOT',
    });

    expect(metadataRes.status).toBe(200);
    expect(metadataRes.body).toMatchObject({
      exchange: 'OKX',
      marketType: 'SPOT',
      source: 'EXCHANGE_CAPABILITIES',
    });
    expect(metadataRes.body.baseCurrencies).toEqual(expect.arrayContaining(['USDT', 'USDC']));
  });

  it('persists Gate.io PAPER wallet when public paper pricing is supported', async () => {
    const email = 'wallet-gateio-paper-create@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const createRes = await agent.post('/dashboard/wallets').send({
      name: 'Gate.io Paper Wallet',
      mode: 'PAPER',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      name: 'Gate.io Paper Wallet',
      mode: 'PAPER',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      apiKeyId: null,
    });
    await expect(prisma.wallet.count({ where: { userId, exchange: 'GATEIO' } })).resolves.toBe(1);
  });

  it('persists Gate.io LIVE wallet when live execution is supported', async () => {
    const email = 'wallet-gateio-live-create@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);
    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        label: 'Gate.io live key',
        exchange: 'GATEIO',
        apiKey: 'GATEIO_LIVE_KEY',
        apiSecret: 'GATEIO_LIVE_SECRET',
      },
    });

    const createRes = await agent.post('/dashboard/wallets').send({
      name: 'Gate.io Live Wallet',
      mode: 'LIVE',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 25,
      apiKeyId: apiKey.id,
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      name: 'Gate.io Live Wallet',
      mode: 'LIVE',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 25,
      apiKeyId: apiKey.id,
    });
  });

  it('returns wallet balance preview for owned API key with allocation applied', async () => {
    const agent = await registerAndLogin('wallet-preview-owner@example.com');

    const apiKeyRes = await agent.post('/dashboard/profile/apiKeys').send({
      label: 'Preview key',
      exchange: 'BINANCE',
      apiKey: 'PREVIEW_KEY_123',
      apiSecret: 'PREVIEW_SECRET_123',
      syncExternalPositions: true,
      manageExternalPositions: true,
    });
    expect(apiKeyRes.status).toBe(201);

    process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE = '250';
    process.env.WALLET_PREVIEW_TEST_FREE_BALANCE = '210';

    const previewRes = await agent.post('/dashboard/wallets/preview-balance').send({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKeyRes.body.id,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 40,
    });

    expect(previewRes.status).toBe(200);
    expect(previewRes.body).toMatchObject({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 250,
      freeBalance: 210,
      referenceBalance: 100,
      allocationApplied: {
        mode: 'PERCENT',
        value: 40,
      },
      source: 'BINANCE',
    });
    expect(typeof previewRes.body.fetchedAt).toBe('string');
  });

  it('caps LIVE preview reference balance at FIXED allocation even after higher exchange deposit', async () => {
    const agent = await registerAndLogin('wallet-preview-fixed@example.com');

    const apiKeyRes = await agent.post('/dashboard/profile/apiKeys').send({
      label: 'Preview fixed key',
      exchange: 'BINANCE',
      apiKey: 'PREVIEW_FIXED_KEY_123',
      apiSecret: 'PREVIEW_FIXED_SECRET_123',
      syncExternalPositions: true,
      manageExternalPositions: true,
    });
    expect(apiKeyRes.status).toBe(201);

    process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE = '2500';
    process.env.WALLET_PREVIEW_TEST_FREE_BALANCE = '2400';

    const previewRes = await agent.post('/dashboard/wallets/preview-balance').send({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKeyRes.body.id,
      liveAllocationMode: 'FIXED',
      liveAllocationValue: 1000,
    });

    expect(previewRes.status).toBe(200);
    expect(previewRes.body.accountBalance).toBe(2500);
    expect(previewRes.body.referenceBalance).toBe(1000);
    expect(previewRes.body.allocationApplied).toEqual({
      mode: 'FIXED',
      value: 1000,
    });
  });

  it('uses full refreshed exchange balance in preview when no LIVE allocation is provided', async () => {
    const agent = await registerAndLogin('wallet-preview-full@example.com');

    const apiKeyRes = await agent.post('/dashboard/profile/apiKeys').send({
      label: 'Preview full key',
      exchange: 'BINANCE',
      apiKey: 'PREVIEW_FULL_KEY_123',
      apiSecret: 'PREVIEW_FULL_SECRET_123',
      syncExternalPositions: true,
      manageExternalPositions: true,
    });
    expect(apiKeyRes.status).toBe(201);

    process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE = '1750';
    process.env.WALLET_PREVIEW_TEST_FREE_BALANCE = '1700';

    const previewRes = await agent.post('/dashboard/wallets/preview-balance').send({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKeyRes.body.id,
    });

    expect(previewRes.status).toBe(200);
    expect(previewRes.body.accountBalance).toBe(1750);
    expect(previewRes.body.referenceBalance).toBe(1750);
    expect(previewRes.body.allocationApplied).toBeNull();
  });

  it('persists an initial LIVE wallet balance snapshot when a live wallet is created', async () => {
    const email = 'wallet-live-initial-snapshot@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const apiKeyRes = await agent.post('/dashboard/profile/apiKeys').send({
      label: 'Initial snapshot key',
      exchange: 'BINANCE',
      apiKey: 'INITIAL_SNAPSHOT_KEY_123',
      apiSecret: 'INITIAL_SNAPSHOT_SECRET_123',
      syncExternalPositions: true,
      manageExternalPositions: true,
    });
    expect(apiKeyRes.status).toBe(201);

    process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE = '500';
    process.env.WALLET_PREVIEW_TEST_FREE_BALANCE = '450';

    const walletRes = await agent.post('/dashboard/wallets').send({
      name: 'Initial live ledger wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'usdt',
      apiKeyId: apiKeyRes.body.id,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 40,
    });
    expect(walletRes.status, JSON.stringify(walletRes.body)).toBe(201);

    const [snapshots, cashflows] = await Promise.all([
      prisma.walletBalanceSnapshot.findMany({
        where: {
          userId,
          walletId: walletRes.body.id,
        },
      }),
      prisma.walletCashflowEvent.findMany({
        where: {
          userId,
          walletId: walletRes.body.id,
        },
      }),
    ]);

    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]).toMatchObject({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 500,
      freeBalance: 450,
      allocatedBalance: 200,
      allocationMode: 'PERCENT',
      allocationValue: 40,
      source: 'EXCHANGE_BALANCE',
    });
    expect(cashflows).toHaveLength(1);
    expect(cashflows[0]).toMatchObject({
      direction: 'IN',
      source: 'INITIAL_BALANCE',
      amount: 200,
      currency: 'USDT',
      exchangeEventId: `initial:${snapshots[0].id}`,
      balanceSnapshotId: snapshots[0].id,
    });

    const [summaryRes, timelineRes, eventsRes] = await Promise.all([
      agent.get(`/dashboard/wallets/${walletRes.body.id}/performance-summary`),
      agent.get(`/dashboard/wallets/${walletRes.body.id}/equity-timeline`),
      agent.get(`/dashboard/wallets/${walletRes.body.id}/cashflow-events`),
    ]);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body).toMatchObject({
      walletId: walletRes.body.id,
      baseCurrency: 'USDT',
      completeness: 'COMPLETE',
      currentAccountBalance: 500,
      currentAllocatedBalance: 200,
      contributedCapital: 200,
      botPnl: 0,
      walletDeltaPercent: 0,
    });
    expect(timelineRes.status).toBe(200);
    expect(timelineRes.body.points).toEqual([
      expect.objectContaining({
        portfolioEquity: 200,
        contributedCapital: 200,
      }),
    ]);
    expect(timelineRes.body.markers).toEqual([
      expect.objectContaining({
        source: 'INITIAL_BALANCE',
        direction: 'IN',
        amount: 200,
      }),
    ]);
    expect(eventsRes.status).toBe(200);
    expect(eventsRes.body).toEqual([
      expect.objectContaining({
        source: 'INITIAL_BALANCE',
        amount: 200,
        currency: 'USDT',
      }),
    ]);
  });

  it('includes wallet-owned imported LIVE open positions in performance summary open PnL', async () => {
    const email = 'wallet-performance-owned-import-open-pnl@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        label: 'Wallet imported open pnl key',
        exchange: 'BINANCE',
        apiKey: 'encrypted-key',
        apiSecret: 'encrypted-secret',
        syncExternalPositions: true,
        manageExternalPositions: true,
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Wallet imported open pnl',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
      },
    });
    await prisma.walletBalanceSnapshot.create({
      data: {
        userId,
        walletId: wallet.id,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        accountBalance: 1000,
        freeBalance: 900,
        allocatedBalance: 1000,
        source: 'EXCHANGE_BALANCE',
        fetchedAt: new Date('2026-05-03T12:00:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        externalId: `${apiKey.id}:FUTURES:ETHUSDT:LONG`,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 12.5,
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        externalId: `${apiKey.id}:ADAUSDT:LONG`,
        symbol: 'ADAUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 88,
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        externalId: `${apiKey.id}:SPOT:SOLUSDT:LONG`,
        symbol: 'SOLUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 77,
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        externalId: 'other-api-key:BTCUSDT:LONG',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 99,
      },
    });

    const summaryRes = await agent.get(`/dashboard/wallets/${wallet.id}/performance-summary`);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body).toMatchObject({
      walletId: wallet.id,
      botOpenPnl: 12.5,
      botPnl: 12.5,
    });
  });

  it('includes wallet-owned imported LIVE open PnL only on the latest equity timeline point', async () => {
    const email = 'wallet-timeline-owned-import-open-pnl@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        label: 'Wallet imported timeline open pnl key',
        exchange: 'BINANCE',
        apiKey: 'encrypted-key',
        apiSecret: 'encrypted-secret',
        syncExternalPositions: true,
        manageExternalPositions: true,
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Wallet imported timeline open pnl',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
      },
    });
    await prisma.walletBalanceSnapshot.createMany({
      data: [
        {
          userId,
          walletId: wallet.id,
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          accountBalance: 900,
          freeBalance: 880,
          allocatedBalance: 900,
          source: 'EXCHANGE_BALANCE',
          fetchedAt: new Date('2026-05-03T11:00:00.000Z'),
        },
        {
          userId,
          walletId: wallet.id,
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          accountBalance: 1000,
          freeBalance: 930,
          allocatedBalance: 1000,
          source: 'EXCHANGE_BALANCE',
          fetchedAt: new Date('2026-05-03T12:00:00.000Z'),
        },
      ],
    });
    await prisma.walletCashflowEvent.create({
      data: {
        userId,
        walletId: wallet.id,
        direction: 'IN',
        source: 'INITIAL_BALANCE',
        amount: 900,
        currency: 'USDT',
        exchangeEventId: 'timeline-initial-balance',
        occurredAt: new Date('2026-05-03T10:59:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        externalId: `${apiKey.id}:FUTURES:ETHUSDT:LONG`,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 12.5,
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        externalId: `${apiKey.id}:ADAUSDT:LONG`,
        symbol: 'ADAUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 88,
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        externalId: `${apiKey.id}:SPOT:SOLUSDT:LONG`,
        symbol: 'SOLUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 77,
      },
    });
    await prisma.position.create({
      data: {
        userId,
        walletId: null,
        botId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        externalId: 'other-api-key:BTCUSDT:LONG',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        unrealizedPnl: 99,
      },
    });

    const timelineRes = await agent.get(`/dashboard/wallets/${wallet.id}/equity-timeline`);

    expect(timelineRes.status).toBe(200);
    expect(timelineRes.body.points).toHaveLength(2);
    expect(timelineRes.body.points[0]).toMatchObject({
      botOpenPnl: 0,
      botPnl: 0,
    });
    expect(timelineRes.body.points[1]).toMatchObject({
      botOpenPnl: 12.5,
      botPnl: 12.5,
    });

    const historicalTimelineRes = await agent
      .get(`/dashboard/wallets/${wallet.id}/equity-timeline`)
      .query({ to: '2026-05-03T11:30:00.000Z' });

    expect(historicalTimelineRes.status).toBe(200);
    expect(historicalTimelineRes.body.points).toHaveLength(1);
    expect(historicalTimelineRes.body.points[0]).toMatchObject({
      botOpenPnl: 0,
      botPnl: 0,
    });
  });

  it('returns 404 when selected API key does not belong to current user', async () => {
    const owner = await registerAndLogin('wallet-preview-owner-2@example.com');
    const other = await registerAndLogin('wallet-preview-other@example.com');

    const apiKeyRes = await owner.post('/dashboard/profile/apiKeys').send({
      label: 'Owner key',
      exchange: 'BINANCE',
      apiKey: 'OWNER_KEY_123',
      apiSecret: 'OWNER_SECRET_123',
      syncExternalPositions: true,
      manageExternalPositions: true,
    });
    expect(apiKeyRes.status).toBe(201);

    const previewRes = await other.post('/dashboard/wallets/preview-balance').send({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKeyRes.body.id,
    });

    expect(previewRes.status).toBe(404);
    expect(previewRes.body.error.message).toBe('api key not found for selected exchange context');
  });

  it('rejects invalid wallet analytics source filters at the API boundary', async () => {
    const email = 'wallet-analytics-invalid-source@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Analytics source wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 1000,
      },
    });

    const res = await agent
      .get(`/dashboard/wallets/${wallet.id}/cashflow-events`)
      .query({ source: 'NOT_A_SOURCE' });

    expect(res.status).toBe(400);
  });

  it('rejects inverted wallet analytics date ranges at the API boundary', async () => {
    const email = 'wallet-analytics-inverted-range@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Analytics date range wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 1000,
      },
    });

    const res = await agent
      .get(`/dashboard/wallets/${wallet.id}/equity-timeline`)
      .query({
        from: '2026-05-03T12:00:00.000Z',
        to: '2026-05-03T11:00:00.000Z',
      });

    expect(res.status).toBe(400);
  });

  it('fails closed for placeholder exchanges', async () => {
    const agent = await registerAndLogin('wallet-preview-placeholder@example.com');

    const previewRes = await agent.post('/dashboard/wallets/preview-balance').send({
      exchange: 'OKX',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: 'any-key',
    });

    expect(previewRes.status).toBe(501);
    expect(previewRes.body.error.details).toEqual({
      code: 'EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED',
      exchange: 'OKX',
      marketType: 'FUTURES',
      operation: 'BALANCE_PREVIEW',
    });
  });

  it('returns Gate.io balance preview for owned stored API key', async () => {
    const email = 'wallet-preview-gateio-stored-key@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        label: 'Gate.io preview placeholder',
        exchange: 'GATEIO',
        apiKey: 'GATEIO_PREVIEW_KEY',
        apiSecret: 'GATEIO_PREVIEW_SECRET',
      },
    });

    process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE = '640';
    process.env.WALLET_PREVIEW_TEST_FREE_BALANCE = '600';

    const previewRes = await agent.post('/dashboard/wallets/preview-balance').send({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 50,
    });

    expect(previewRes.status).toBe(200);
    expect(previewRes.body).toMatchObject({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 640,
      freeBalance: 600,
      referenceBalance: 320,
      allocationApplied: {
        mode: 'PERCENT',
        value: 50,
      },
      source: 'GATEIO',
    });
    expect(typeof previewRes.body.fetchedAt).toBe('string');
    await expect(
      prisma.apiKey.findUnique({
        where: { id: apiKey.id },
        select: { lastUsed: true },
      })
    ).resolves.toEqual({ lastUsed: expect.any(Date) });
  });

  it('rejects unauthenticated paper reset command', async () => {
    const res = await request(app).post('/dashboard/wallets/wallet-id/reset-paper');

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Missing token');
  });

  it('rejects paper reset for LIVE wallet', async () => {
    const email = 'wallet-reset-live-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(409);
    expect(resetRes.body.error.message).toBe('paper reset is allowed only for PAPER wallets');
  });

  it('blocks paper reset while an active bot uses the wallet and allows reset after deactivation', async () => {
    const email = 'wallet-reset-active-bot-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Paper wallet with active bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId,
        walletId: wallet.id,
        name: 'Active paper bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });

    const blockedRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(blockedRes.status).toBe(409);
    expect(blockedRes.body.error.message).toBe('paper reset is blocked while an active bot uses this wallet');
    expect(blockedRes.body.error.details).toMatchObject({
      walletId: wallet.id,
      botId: bot.id,
      botName: 'Active paper bot',
    });

    await prisma.bot.update({
      where: { id: bot.id },
      data: { isActive: false },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.id).toBe(wallet.id);
    expect(typeof resetRes.body.paperResetAt).toBe('string');
  });

  it('rejects paper reset when open positions exist in wallet scope', async () => {
    const email = 'wallet-reset-open-position-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });

    await prisma.position.create({
      data: {
        userId,
        walletId: wallet.id,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 1,
      },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(409);
    expect(resetRes.body.error.message).toBe('paper reset is blocked while open positions exist');
  });

  it('rejects paper reset when active open orders exist in wallet scope', async () => {
    const email = 'wallet-reset-open-order-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });

    await prisma.order.create({
      data: {
        userId,
        walletId: wallet.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 1,
        price: 100,
      },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(409);
    expect(resetRes.body.error.message).toBe('paper reset is blocked while active open orders exist');
  });

  it('allows paper reset when only orphaned stale open orders exist in wallet scope', async () => {
    const email = 'wallet-reset-orphan-open-order-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });

    const staleOrder = await prisma.order.create({
      data: {
        userId,
        walletId: wallet.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        quantity: 1,
        price: 100,
      },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.id).toBe(wallet.id);
    expect(typeof resetRes.body.paperResetAt).toBe('string');

    const persistedOrder = await prisma.order.findUnique({
      where: { id: staleOrder.id },
      select: { status: true, syncState: true },
    });
    expect(persistedOrder).toEqual({ status: 'OPEN', syncState: 'ORPHAN_LOCAL' });
  });

  it('allows paper reset when only orphaned stale open positions exist in wallet scope', async () => {
    const email = 'wallet-reset-orphan-open-position-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });

    const stalePosition = await prisma.position.create({
      data: {
        userId,
        walletId: wallet.id,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        entryPrice: 100,
        quantity: 1,
        leverage: 1,
      },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.id).toBe(wallet.id);
    expect(typeof resetRes.body.paperResetAt).toBe('string');

    const persistedPosition = await prisma.position.findUnique({
      where: { id: stalePosition.id },
      select: { status: true, syncState: true, continuityState: true },
    });
    expect(persistedPosition).toEqual({
      status: 'OPEN',
      syncState: 'ORPHAN_LOCAL',
      continuityState: 'REPAIR_ONLY_CLEANUP',
    });
  });

  it('sets paper reset checkpoint and keeps historical lifecycle rows', async () => {
    const email = 'wallet-reset-history-owner@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: 'Paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });

    const position = await prisma.position.create({
      data: {
        userId,
        walletId: wallet.id,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 100,
        quantity: 1,
        leverage: 1,
        realizedPnl: -50,
        openedAt: new Date('2026-04-19T10:00:00.000Z'),
        closedAt: new Date('2026-04-19T11:00:00.000Z'),
      },
    });

    const order = await prisma.order.create({
      data: {
        userId,
        walletId: wallet.id,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'FILLED',
        quantity: 1,
        filledQuantity: 1,
      },
    });

    await prisma.trade.create({
      data: {
        userId,
        walletId: wallet.id,
        positionId: position.id,
        orderId: order.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        price: 100,
        quantity: 1,
        lifecycleAction: 'OPEN',
      },
    });

    const resetRes = await agent.post(`/dashboard/wallets/${wallet.id}/reset-paper`);

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.id).toBe(wallet.id);
    expect(typeof resetRes.body.paperResetAt).toBe('string');

    const [positionsCount, ordersCount, tradesCount, refreshedWallet] = await Promise.all([
      prisma.position.count({ where: { userId, walletId: wallet.id } }),
      prisma.order.count({ where: { userId, walletId: wallet.id } }),
      prisma.trade.count({ where: { userId, walletId: wallet.id } }),
      prisma.wallet.findUnique({
        where: { id: wallet.id },
        select: { paperResetAt: true },
      }),
    ]);

    expect(positionsCount).toBe(1);
    expect(ordersCount).toBe(1);
    expect(tradesCount).toBe(1);
    expect(refreshedWallet?.paperResetAt).not.toBeNull();
  });
});
