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

describe('Orders manual PAPER market truth', () => {
  beforeEach(async () => {
    await prisma.log.deleteMany();
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
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rejects PAPER MARKET open when canonical fill price truth is unavailable', async () => {
    const ownerAgent = await registerAndLogin('manual-paper-market-price-truth@example.com');
    const ownerId =
      (await prisma.user.findUniqueOrThrow({
        where: { email: 'manual-paper-market-price-truth@example.com' },
        select: { id: true },
      })).id;

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 0.05,
      mode: 'PAPER',
      riskAck: false,
    });

    expect(openRes.status).toBe(400);
    expect(openRes.body.error.message).toBe(
      'PAPER MARKET order requires canonical fill price truth'
    );

    const persistedOrders = await prisma.order.findMany({
      where: { userId: ownerId },
    });
    const persistedPositions = await prisma.position.findMany({
      where: { userId: ownerId },
    });

    expect(persistedOrders).toHaveLength(0);
    expect(persistedPositions).toHaveLength(0);
  });

  it('returns 409 when reverse-side manual open is requested for an already open symbol', async () => {
    const ownerAgent = await registerAndLogin('manual-paper-market-side-conflict@example.com');
    const ownerId =
      (await prisma.user.findUniqueOrThrow({
        where: { email: 'manual-paper-market-side-conflict@example.com' },
        select: { id: true },
      })).id;

    await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 1000,
      },
    });

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      symbol: 'DOGEUSDT',
      side: 'SELL',
      type: 'MARKET',
      quantity: 100,
      price: 0.09,
      mode: 'PAPER',
      riskAck: false,
    });

    expect(openRes.status).toBe(409);
    expect(openRes.body.error.message).toBe(
      'Open position already exists on this symbol with opposite side. Close it before opening the reverse direction.'
    );

    const persistedOrders = await prisma.order.findMany({
      where: { userId: ownerId },
    });
    expect(persistedOrders).toHaveLength(0);
  });

  it('allows manual PAPER open when another wallet already owns the same symbol', async () => {
    const ownerAgent = await registerAndLogin('manual-paper-market-wallet-scope@example.com');
    const ownerId =
      (await prisma.user.findUniqueOrThrow({
        where: { email: 'manual-paper-market-wallet-scope@example.com' },
        select: { id: true },
      })).id;

    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Existing live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    await prisma.position.create({
      data: {
        userId: ownerId,
        walletId: liveWallet.id,
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
    });
    const paperWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 1_000,
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Paper wallet scope strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'MARKET',
          },
        },
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Wallet scope universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['DOGEUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: universe.id,
        name: 'Wallet scope symbols',
        symbols: ['DOGEUSDT'],
      },
    });
    const paperBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Paper wallet scope bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        walletId: paperWallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      botId: paperBot.id,
      symbol: 'DOGEUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 50,
      price: 0.09,
      mode: 'PAPER',
      riskAck: false,
    });

    expect(openRes.status).toBe(201);
    expect(openRes.body.symbol).toBe('DOGEUSDT');
    expect(openRes.body.positionId).toBeTruthy();

    const persistedOpenPositions = await prisma.position.findMany({
      where: {
        userId: ownerId,
        symbol: 'DOGEUSDT',
        status: 'OPEN',
      },
      orderBy: { createdAt: 'asc' },
    });

    expect(persistedOpenPositions).toHaveLength(2);
    expect(persistedOpenPositions.map((position) => position.walletId)).toEqual([
      liveWallet.id,
      paperWallet.id,
    ]);
  });
});
