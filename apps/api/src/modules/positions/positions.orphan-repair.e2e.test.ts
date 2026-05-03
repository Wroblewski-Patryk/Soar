import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../../index';
import { prisma } from '../../prisma/client';

const originalApiKeyEncryptionKeys = process.env.API_KEY_ENCRYPTION_KEYS;
const originalApiKeyEncryptionActiveVersion = process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION;

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

describe('Positions orphan repair API', () => {
  beforeEach(async () => {
    process.env.API_KEY_ENCRYPTION_KEYS = 'v1:test-orphan-repair-keyring';
    process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION = 'v1';
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(() => {
    if (originalApiKeyEncryptionKeys === undefined) delete process.env.API_KEY_ENCRYPTION_KEYS;
    else process.env.API_KEY_ENCRYPTION_KEYS = originalApiKeyEncryptionKeys;

    if (originalApiKeyEncryptionActiveVersion === undefined) {
      delete process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION;
    } else {
      process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION = originalApiKeyEncryptionActiveVersion;
    }
  });

  it('rebinds canonical local orphans, closes detached blockers, and re-imports exchange truth', async () => {
    const agent = await registerAndLogin('positions-orphan-repair@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'positions-orphan-repair@example.com' },
      select: { id: true },
    });

    const apiKeyRes = await agent.post('/dashboard/profile/apiKeys').send({
      label: 'repair-main',
      exchange: 'BINANCE',
      apiKey: 'ABCD1234EFGH5678',
      apiSecret: 'SECRET1234VALUE5678',
    });
    expect(apiKeyRes.status).toBe(201);
    const apiKeyId = apiKeyRes.body.id as string;

    const wallet = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Repair live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: owner.id,
        name: 'Repair universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT', 'DOGEUSDT', 'ADAUSDT'],
        blacklist: [],
      },
      select: { id: true },
    });

    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: owner.id,
        marketUniverseId: marketUniverse.id,
        name: 'Repair group',
        symbols: ['BTCUSDT', 'DOGEUSDT', 'ADAUSDT'],
      },
      select: { id: true },
    });

    const strategy = await prisma.strategy.create({
      data: {
        userId: owner.id,
        name: 'Repair strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {
          additional: {
            orderType: 'MARKET',
            marginMode: 'ISOLATED',
          },
        },
      },
      select: { id: true },
    });

    const bot = await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'Repair live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        manageExternalPositions: true,
        apiKeyId,
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
      select: { id: true },
    });

    const canonicalOrphan = await prisma.position.create({
      data: {
        userId: owner.id,
        botId: null,
        walletId: wallet.id,
        strategyId: strategy.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'ADAUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.12,
        quantity: 100,
        leverage: 5,
      },
      select: { id: true },
    });

    const staleLocalOrphan = await prisma.position.create({
      data: {
        userId: owner.id,
        botId: null,
        walletId: wallet.id,
        strategyId: strategy.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 50,
        leverage: 5,
      },
      select: { id: true },
    });

    const detachedBlocker = await prisma.position.create({
      data: {
        userId: owner.id,
        botId: null,
        walletId: null,
        strategyId: null,
        externalId: null,
        origin: 'USER',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'BTCUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 60_000,
        quantity: 0.01,
        leverage: 5,
      },
      select: { id: true },
    });

    const repairRes = await agent.post('/dashboard/positions/orphan-repair');
    expect(repairRes.status).toBe(200);
    expect(repairRes.body.localRepair).toMatchObject({
      scanned: 2,
      reboundToCanonicalBot: 1,
      closedDetachedOrphans: 1,
      unresolved: 0,
    });
    expect(repairRes.body.exchangeReconciliation.openPositionsSeen).toBe(1);

    const reboundPosition = await prisma.position.findUniqueOrThrow({
      where: { id: canonicalOrphan.id },
      select: {
        botId: true,
        walletId: true,
        strategyId: true,
        status: true,
      },
    });
    expect(reboundPosition).toMatchObject({
      botId: bot.id,
      walletId: wallet.id,
      strategyId: strategy.id,
      status: 'OPEN',
    });

    const closedBlocker = await prisma.position.findUniqueOrThrow({
      where: { id: detachedBlocker.id },
      select: {
        status: true,
        syncState: true,
        closedAt: true,
        closeReason: true,
        closeInitiator: true,
      },
    });
    expect(closedBlocker.status).toBe('CLOSED');
    expect(closedBlocker.syncState).toBe('ORPHAN_LOCAL');
    expect(closedBlocker.closedAt).not.toBeNull();
    expect(closedBlocker.closeReason).toBe('SYSTEM_REPAIR');
    expect(closedBlocker.closeInitiator).toBe('SYSTEM_REPAIR');

    const syncedExchangePosition = await prisma.position.findFirst({
      where: {
        userId: owner.id,
        origin: 'EXCHANGE_SYNC',
        status: 'OPEN',
        symbol: 'BTCUSDT',
      },
      select: {
        botId: true,
        walletId: true,
        externalId: true,
        side: true,
      },
    });
    expect(syncedExchangePosition).toMatchObject({
      botId: bot.id,
      walletId: wallet.id,
      side: 'LONG',
    });
    expect(syncedExchangePosition?.externalId).toBe(`${apiKeyId}:FUTURES:BTCUSDT:LONG`);

    const ignoredLocalOrphan = await prisma.position.findUniqueOrThrow({
      where: { id: staleLocalOrphan.id },
      select: {
        botId: true,
        walletId: true,
        strategyId: true,
        status: true,
        syncState: true,
        continuityState: true,
      },
    });
    expect(ignoredLocalOrphan).toEqual({
      botId: null,
      walletId: wallet.id,
      strategyId: strategy.id,
      status: 'OPEN',
      syncState: 'ORPHAN_LOCAL',
      continuityState: 'REPAIR_ONLY_CLEANUP',
    });
  });
});
