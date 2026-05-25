import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { getManualOrderContext } from './orders.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.order.deleteMany();
  await prisma.position.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
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

describe('getManualOrderContext contract-size rules', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('uses Gate.io futures contract size for manual-order context quantity and notional truth', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-gateio-contract-size@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Gate.io contract-size strategy',
        interval: '15m',
        leverage: 5,
        walletRisk: 1,
        config: { additional: { marginMode: 'CROSSED', orderType: 'MARKET' } },
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Gate.io contract-size universe',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['ADAUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Gate.io contract-size group',
        symbols: ['ADAUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Gate.io contract-size bot',
        mode: 'LIVE',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 3,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: user.id,
        botId: bot.id,
        botMarketGroupId: botGroup.id,
        strategyId: strategy.id,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });

    const connectorFactory = vi.fn(() => ({
      getSymbolTradingRules: async () => ({
        minAmount: 1,
        minNotional: 5,
        amountPrecision: 1,
        contractSize: 10,
      }),
      fetchMarkPrice: async () => 0.25,
      disconnect: async () => undefined,
    }));

    const context = await getManualOrderContext(
      user.id,
      { botId: bot.id, symbol: 'adausdt', side: 'SELL', quantity: 4 },
      { createPublicConnector: connectorFactory }
    );

    expect(connectorFactory).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
    });
    expect(context?.symbol).toBe('ADAUSDT');
    expect(context?.leverage).toBe(5);
    expect(context?.quantityConstraints.contractSize).toBe(10);
    expect(context?.quantityConstraints.minExecutableQty).toBe(2);
    expect(context?.sideAwarePreview.requestedQuantity).toBe(4);
    expect(context?.sideAwarePreview.estimatedNotional).toBe(10);
    expect(context?.sideAwarePreview.estimatedMargin).toBe(2);
  });
});
