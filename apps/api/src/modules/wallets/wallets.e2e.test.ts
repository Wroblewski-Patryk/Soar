import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';

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
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.log.deleteMany();
    await prisma.user.deleteMany();
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
      code: 'EXCHANGE_NOT_IMPLEMENTED',
      exchange: 'OKX',
      capability: 'LIVE_EXECUTION',
    });
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
