import { describe, expect, it, vi } from 'vitest';

import { prisma } from '../../prisma/client';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { cancelOrder } from './orders.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botStrategy.deleteMany();
  await prisma.botSubagentConfig.deleteMany();
  await prisma.botAssistantConfig.deleteMany();
  await prisma.marketGroupStrategyLink.deleteMany();
  await prisma.botMarketGroup.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
};

describe('orders live cancel boundary', () => {
  it('cancels exchange-backed open orders through the live exchange boundary before local mutation', async () => {
    await cleanupDb();
    const user = await prisma.user.create({
      data: { email: 'orders-live-cancel-boundary@example.com', password: 'hashed' },
    });
    await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id,
      planCode: 'ADVANCED',
      source: 'ADMIN_OVERRIDE',
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Gate.io live cancel key',
        exchange: 'GATEIO',
        apiKey: 'gateio_cancel_key',
        apiSecret: 'gateio_cancel_secret',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Gate.io live cancel wallet',
        mode: 'LIVE',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Gate.io live cancel bot',
        mode: 'LIVE',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        walletId: wallet.id,
        apiKeyId: apiKey.id,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.01,
        price: 62_000,
        exchangeOrderId: 'gateio-open-order-1',
      },
    });
    const cancelLiveOrder = vi.fn(async () => ({
      exchangeOrderId: 'gateio-open-order-1',
      status: 'canceled',
    }));

    const canceled = await cancelOrder(user.id, order.id, { riskAck: true }, { cancelLiveOrder });

    expect(cancelLiveOrder).toHaveBeenCalledWith({
      userId: user.id,
      bot: {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKeyId: apiKey.id,
        walletId: wallet.id,
      },
      order: {
        symbol: 'BTCUSDT',
        exchangeOrderId: 'gateio-open-order-1',
      },
    });
    expect(canceled?.status).toBe('CANCELED');
    expect(canceled?.canceledAt).toBeTruthy();
  });

  it('fails closed before exchange cancel when LIVE entitlement is downgraded', async () => {
    await cleanupDb();
    const user = await prisma.user.create({
      data: { email: 'orders-live-cancel-entitlement-downgrade@example.com', password: 'hashed' },
    });
    await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id,
      planCode: 'FREE',
      source: 'ADMIN_OVERRIDE',
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Downgraded live cancel key',
        exchange: 'GATEIO',
        apiKey: 'gateio_cancel_key',
        apiSecret: 'gateio_cancel_secret',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Downgraded live cancel wallet',
        mode: 'LIVE',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Downgraded live cancel bot',
        mode: 'LIVE',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        walletId: wallet.id,
        apiKeyId: apiKey.id,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.01,
        price: 62_000,
        exchangeOrderId: 'gateio-open-order-downgraded',
      },
    });
    const cancelLiveOrder = vi.fn(async () => ({
      exchangeOrderId: 'gateio-open-order-downgraded',
      status: 'canceled',
    }));

    await expect(
      cancelOrder(user.id, order.id, { riskAck: true }, { cancelLiveOrder })
    ).rejects.toMatchObject({
      name: 'SubscriptionFeatureUnavailableError',
      details: expect.objectContaining({
        feature: 'liveTrading',
        planCode: 'FREE',
      }),
    });

    expect(cancelLiveOrder).not.toHaveBeenCalled();
    await expect(prisma.order.findUniqueOrThrow({ where: { id: order.id } })).resolves.toMatchObject({
      status: 'OPEN',
      canceledAt: null,
    });
  });
});
