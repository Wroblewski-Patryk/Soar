import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { resolveRuntimeOpenPositionBySymbol } from './executionOrchestrator.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.orderFill.deleteMany();
  await prisma.order.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
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

describe('resolveRuntimeOpenPositionBySymbol owned imports', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('resolves selected LIVE bot owned imported wallet-null position after direct lookup misses', async () => {
    const user = await prisma.user.create({
      data: { email: 'runtime-exit-owned-import-lookup@example.com', password: 'hashed' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Runtime lookup owned key',
        exchange: 'BINANCE',
        apiKey: 'runtime_lookup_key',
        apiSecret: 'runtime_lookup_secret',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: { additional: {} },
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['DOGEUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Runtime lookup symbols',
        symbols: ['DOGEUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        manageExternalPositions: true,
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const importedPosition = await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        strategyId: strategy.id,
        externalId: `${apiKey.id}:DOGEUSDT:LONG`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        leverage: 5,
      },
    });

    const resolved = await resolveRuntimeOpenPositionBySymbol({
      userId: user.id,
      botId: bot.id,
      walletId: wallet.id,
      symbol: 'dogeusdt',
      mode: 'LIVE',
    });

    expect(resolved?.id).toBe(importedPosition.id);
  });

  it('does not resolve unowned imported wallet-null position for selected LIVE bot', async () => {
    const user = await prisma.user.create({
      data: { email: 'runtime-exit-unowned-import-lookup@example.com', password: 'hashed' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Runtime lookup unowned key',
        exchange: 'BINANCE',
        apiKey: 'runtime_lookup_unowned_key',
        apiSecret: 'runtime_lookup_unowned_secret',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup unowned wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup unowned universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Runtime lookup unowned symbols',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Runtime lookup unowned bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        manageExternalPositions: true,
        walletId: wallet.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        externalId: `${apiKey.id}:DOGEUSDT:LONG`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        leverage: 5,
      },
    });

    const resolved = await resolveRuntimeOpenPositionBySymbol({
      userId: user.id,
      botId: bot.id,
      walletId: wallet.id,
      symbol: 'DOGEUSDT',
      mode: 'LIVE',
    });

    expect(resolved).toBeNull();
  });
});
