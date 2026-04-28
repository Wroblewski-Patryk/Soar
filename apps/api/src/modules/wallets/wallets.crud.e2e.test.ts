import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';

type AuthenticatedAgent = ReturnType<typeof request.agent>;

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

const createApiKey = async (
  agent: AuthenticatedAgent,
  params: {
    label: string;
    exchange: 'BINANCE' | 'BYBIT' | 'OKX' | 'KRAKEN' | 'COINBASE';
  }
) => {
  const response = await agent.post('/dashboard/profile/apiKeys').send({
    label: params.label,
    exchange: params.exchange,
    apiKey: `KEY_${params.label}`,
    apiSecret: `SECRET_${params.label}`,
    syncExternalPositions: true,
    manageExternalPositions: true,
  });

  expect(response.status).toBe(201);
  return response.body.id as string;
};

describe('Wallet CRUD and ownership contract', () => {
  beforeEach(async () => {
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.position.deleteMany();
    await prisma.order.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.log.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates PAPER wallet and normalizes context fields', async () => {
    const agent = await registerAndLogin('wallet-crud-paper@example.com');

    const response = await agent.post('/dashboard/wallets').send({
      name: '  Main paper wallet  ',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'usdt',
      paperInitialBalance: 12500,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Main paper wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 12500,
      apiKeyId: null,
      manageExternalPositions: false,
      liveAllocationMode: null,
      liveAllocationValue: null,
    });
  });

  it('persists external takeover flag on LIVE wallet', async () => {
    const agent = await registerAndLogin('wallet-crud-live-manage@example.com');
    const apiKeyId = await createApiKey(agent, {
      label: 'binance-live-manage',
      exchange: 'BINANCE',
    });

    const response = await agent.post('/dashboard/wallets').send({
      name: 'Live managed wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 50,
      manageExternalPositions: true,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      mode: 'LIVE',
      apiKeyId,
      manageExternalPositions: true,
    });
  });

  it('rejects LIVE wallet create when api key or allocation config is missing', async () => {
    const agent = await registerAndLogin('wallet-crud-live-missing@example.com');

    const response = await agent.post('/dashboard/wallets').send({
      name: 'Live wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });

    expect(response.status).toBe(400);
    expect(String(response.body.error?.message ?? '')).toMatch(/apiKeyId|LIVE|validation/i);
  });

  it('rejects LIVE wallet create when api key exchange mismatches wallet exchange', async () => {
    const agent = await registerAndLogin('wallet-crud-live-mismatch@example.com');
    const bybitApiKeyId = await createApiKey(agent, {
      label: 'bybit',
      exchange: 'BYBIT',
    });

    const response = await agent.post('/dashboard/wallets').send({
      name: 'Live Binance wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: bybitApiKeyId,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 50,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('apiKeyId exchange must match wallet exchange');
  });

  it('supports partial update without resetting existing LIVE mode fields', async () => {
    const agent = await registerAndLogin('wallet-crud-live-update@example.com');
    const apiKeyId = await createApiKey(agent, {
      label: 'binance-live',
      exchange: 'BINANCE',
    });

    const created = await agent.post('/dashboard/wallets').send({
      name: 'Live wallet before update',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 35,
    });
    expect(created.status).toBe(201);

    const updated = await agent.put(`/dashboard/wallets/${created.body.id}`).send({
      name: 'Live wallet after update',
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      id: created.body.id,
      name: 'Live wallet after update',
      mode: 'LIVE',
      apiKeyId,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 35,
    });
  });

  it('blocks wallet update when wallet is used by active bot', async () => {
    const email = 'wallet-crud-update-guard@example.com';
    const agent = await registerAndLogin(email);

    const created = await agent.post('/dashboard/wallets').send({
      name: 'Guarded update wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 5000,
    });
    expect(created.status).toBe(201);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    expect(user?.id).toBeTruthy();

    await prisma.bot.create({
      data: {
        userId: user!.id,
        name: 'Active guard bot',
        walletId: created.body.id,
        isActive: true,
      },
    });

    const updateRes = await agent.put(`/dashboard/wallets/${created.body.id}`).send({
      name: 'Should fail',
    });
    expect(updateRes.status).toBe(409);
    expect(updateRes.body.error.message).toBe('wallet is used by active bot and cannot be edited');
    expect(updateRes.body.error.details).toMatchObject({
      botName: 'Active guard bot',
    });
  });

  it('enforces ownership isolation for get/update/delete wallet endpoints', async () => {
    const owner = await registerAndLogin('wallet-crud-owner@example.com');
    const outsider = await registerAndLogin('wallet-crud-outsider@example.com');

    const created = await owner.post('/dashboard/wallets').send({
      name: 'Owner wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 1000,
    });
    expect(created.status).toBe(201);

    const getRes = await outsider.get(`/dashboard/wallets/${created.body.id}`);
    expect(getRes.status).toBe(404);

    const putRes = await outsider.put(`/dashboard/wallets/${created.body.id}`).send({
      name: 'Intrusion',
    });
    expect(putRes.status).toBe(404);

    const deleteRes = await outsider.delete(`/dashboard/wallets/${created.body.id}`);
    expect(deleteRes.status).toBe(404);
  });

  it('lists wallets only for authenticated owner', async () => {
    const owner = await registerAndLogin('wallet-crud-list-owner@example.com');
    const other = await registerAndLogin('wallet-crud-list-other@example.com');

    const ownerWallet = await owner.post('/dashboard/wallets').send({
      name: 'Owner wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 5000,
    });
    expect(ownerWallet.status).toBe(201);

    const otherWallet = await other.post('/dashboard/wallets').send({
      name: 'Other wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 7000,
    });
    expect(otherWallet.status).toBe(201);

    const ownerList = await owner.get('/dashboard/wallets');
    expect(ownerList.status).toBe(200);
    expect(ownerList.body).toHaveLength(1);
    expect(ownerList.body[0].id).toBe(ownerWallet.body.id);
  });

  it('blocks wallet deletion when wallet is linked to at least one bot', async () => {
    const email = 'wallet-crud-delete-guard@example.com';
    const agent = await registerAndLogin(email);

    const created = await agent.post('/dashboard/wallets').send({
      name: 'Guarded wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 4000,
    });
    expect(created.status).toBe(201);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    expect(user?.id).toBeTruthy();

    await prisma.bot.create({
      data: {
        userId: user!.id,
        name: 'Guard bot',
        walletId: created.body.id,
      },
    });

    const response = await agent.delete(`/dashboard/wallets/${created.body.id}`);
    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe(
      'wallet is used by at least one bot and cannot be deleted'
    );
  });

  it('deletes wallet when no bot references exist', async () => {
    const agent = await registerAndLogin('wallet-crud-delete-ok@example.com');

    const created = await agent.post('/dashboard/wallets').send({
      name: 'Disposable wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 2000,
    });
    expect(created.status).toBe(201);

    const deleted = await agent.delete(`/dashboard/wallets/${created.body.id}`);
    expect(deleted.status).toBe(204);

    const fetchAfterDelete = await agent.get(`/dashboard/wallets/${created.body.id}`);
    expect(fetchAfterDelete.status).toBe(404);
  });

  it('deletes wallet and preserves historical rows by detaching wallet references', async () => {
    const email = 'wallet-crud-delete-history@example.com';
    const agent = await registerAndLogin(email);

    const created = await agent.post('/dashboard/wallets').send({
      name: 'History wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 3200,
    });
    expect(created.status).toBe(201);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    expect(user?.id).toBeTruthy();

    const position = await prisma.position.create({
      data: {
        userId: user!.id,
        walletId: created.body.id,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 100,
        quantity: 1,
        leverage: 1,
        realizedPnl: 25,
        openedAt: new Date('2026-04-20T10:00:00.000Z'),
        closedAt: new Date('2026-04-20T11:00:00.000Z'),
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user!.id,
        walletId: created.body.id,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'FILLED',
        quantity: 1,
        filledQuantity: 1,
      },
    });

    const trade = await prisma.trade.create({
      data: {
        userId: user!.id,
        walletId: created.body.id,
        positionId: position.id,
        orderId: order.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        price: 100,
        quantity: 1,
        lifecycleAction: 'OPEN',
      },
    });

    const deleted = await agent.delete(`/dashboard/wallets/${created.body.id}`);
    expect(deleted.status).toBe(204);

    const [deletedWallet, refreshedPosition, refreshedOrder, refreshedTrade] = await Promise.all([
      prisma.wallet.findUnique({
        where: { id: created.body.id },
        select: { id: true },
      }),
      prisma.position.findUnique({
        where: { id: position.id },
        select: { walletId: true },
      }),
      prisma.order.findUnique({
        where: { id: order.id },
        select: { walletId: true },
      }),
      prisma.trade.findUnique({
        where: { id: trade.id },
        select: { walletId: true },
      }),
    ]);

    expect(deletedWallet).toBeNull();
    expect(refreshedPosition?.walletId).toBeNull();
    expect(refreshedOrder?.walletId).toBeNull();
    expect(refreshedTrade?.walletId).toBeNull();
  });
});
