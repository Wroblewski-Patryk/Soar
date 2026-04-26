import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

const createLiveSymbolGroup = async (userId: string, name: string, symbols: string[]) => {
  const universe = await prisma.marketUniverse.create({
    data: {
      userId,
      name: `${name} Universe`,
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    },
    select: { id: true },
  });

  const symbolGroup = await prisma.symbolGroup.create({
    data: {
      userId,
      marketUniverseId: universe.id,
      name,
      symbols,
    },
    select: { id: true },
  });

  return symbolGroup.id;
};

describe('Positions takeover status API', () => {
  beforeEach(async () => {
    process.env.API_KEY_ENCRYPTION_KEYS = 'v1:test-keyring-material';
    process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION = 'v1';
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(() => {
    if (originalApiKeyEncryptionKeys === undefined) delete process.env.API_KEY_ENCRYPTION_KEYS;
    else process.env.API_KEY_ENCRYPTION_KEYS = originalApiKeyEncryptionKeys;

    if (originalApiKeyEncryptionActiveVersion === undefined) {
      delete process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION;
    } else {
      process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION = originalApiKeyEncryptionActiveVersion;
    }
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/dashboard/positions/takeover-status');
    expect(res.status).toBe(401);
  });

  it('returns takeover classification summary for exchange-synced OPEN positions', async () => {
    const email = 'positions-takeover-owner@example.com';
    const agent = await registerAndLogin(email);
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    const createApiKey = async (label: string) => {
      const res = await agent.post('/dashboard/profile/apiKeys').send({
        label,
        exchange: 'BINANCE',
        apiKey: `APIKEY_${label}_${Date.now()}`,
        apiSecret: `APISECRET_${label}_${Date.now()}`,
      });
      expect(res.status).toBe(201);
      return res.body.id as string;
    };

    const keyOwned = await createApiKey('owned');
    const keyUnowned = await createApiKey('unowned');
    const keyAmbiguous = await createApiKey('ambiguous');
    const ownedScopeId = await createLiveSymbolGroup(owner.id, 'Owned Scope', ['BTCUSDT']);
    const ambiguousScopeAId = await createLiveSymbolGroup(owner.id, 'Ambiguous Scope A', ['BNBUSDT']);
    const ambiguousScopeBId = await createLiveSymbolGroup(owner.id, 'Ambiguous Scope B', ['BNBUSDT']);

    const ownedWallet = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Owned LIVE wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyOwned,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    const ambiguousWalletA = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Ambiguous LIVE wallet A',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyAmbiguous,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    const ambiguousWalletB = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Ambiguous LIVE wallet B',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyAmbiguous,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    const ownedBot = await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'Owned live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId: keyOwned,
        walletId: ownedWallet.id,
        symbolGroupId: ownedScopeId,
      },
      select: { id: true },
    });

    await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'Ambiguous live bot A',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId: keyAmbiguous,
        walletId: ambiguousWalletA.id,
        symbolGroupId: ambiguousScopeAId,
      },
    });

    await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'Ambiguous live bot B',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId: keyAmbiguous,
        walletId: ambiguousWalletB.id,
        symbolGroupId: ambiguousScopeBId,
      },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: owner.id,
          botId: ownedBot.id,
          walletId: ownedWallet.id,
          externalId: `${keyOwned}:BTCUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 68000,
          quantity: 0.01,
          leverage: 3,
        },
        {
          userId: owner.id,
          externalId: `${keyUnowned}:ETHUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'DRIFT',
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 3000,
          quantity: 0.2,
          leverage: 3,
        },
        {
          userId: owner.id,
          externalId: `${keyAmbiguous}:BNBUSDT:SHORT`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'DRIFT',
          symbol: 'BNBUSDT',
          side: 'SHORT',
          status: 'OPEN',
          entryPrice: 500,
          quantity: 1,
          leverage: 3,
        },
        {
          userId: owner.id,
          externalId: `${keyUnowned}:XRPUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'MANUAL_MANAGED',
          syncState: 'IN_SYNC',
          symbol: 'XRPUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 1,
          quantity: 100,
          leverage: 1,
        },
        {
          userId: owner.id,
          externalId: `${keyOwned}:ADAUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          symbol: 'ADAUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 0.7,
          quantity: 100,
          leverage: 1,
          closedAt: new Date(),
        },
      ],
    });

    const res = await agent.get('/dashboard/positions/takeover-status');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.summary).toEqual({
      OWNED_AND_MANAGED: 1,
      UNOWNED: 1,
      AMBIGUOUS: 1,
      MANUAL_ONLY: 1,
    });

    const bySymbol = new Map(
      (res.body.items as Array<{ symbol: string; takeoverStatus: string }>).map((item) => [
        item.symbol,
        item.takeoverStatus,
      ])
    );
    expect(bySymbol.get('BTCUSDT')).toBe('OWNED_AND_MANAGED');
    expect(bySymbol.get('ETHUSDT')).toBe('UNOWNED');
    expect(bySymbol.get('BNBUSDT')).toBe('AMBIGUOUS');
    expect(bySymbol.get('XRPUSDT')).toBe('MANUAL_ONLY');
  });

  it('rebinds unowned BOT_MANAGED exchange-synced positions when exactly one LIVE owner exists', async () => {
    const email = 'positions-takeover-rebind@example.com';
    const agent = await registerAndLogin(email);
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    const createApiKey = async (label: string) => {
      const res = await agent.post('/dashboard/profile/apiKeys').send({
        label,
        exchange: 'BINANCE',
        apiKey: `APIKEY_${label}_${Date.now()}`,
        apiSecret: `APISECRET_${label}_${Date.now()}`,
      });
      expect(res.status).toBe(201);
      return res.body.id as string;
    };

    const keyOwned = await createApiKey('owned-rebind');
    const keyAmbiguous = await createApiKey('ambiguous-rebind');
    const keyUnowned = await createApiKey('unowned-rebind');
    const ownedScopeId = await createLiveSymbolGroup(owner.id, 'Owned Rebind Scope', ['SOLUSDT']);
    const ambiguousScopeAId = await createLiveSymbolGroup(owner.id, 'Ambiguous Rebind Scope A', ['BNBUSDT']);
    const ambiguousScopeBId = await createLiveSymbolGroup(owner.id, 'Ambiguous Rebind Scope B', ['BNBUSDT']);

    const ownedWallet = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Owned rebind wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyOwned,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'Owned rebind bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId: keyOwned,
        walletId: ownedWallet.id,
        symbolGroupId: ownedScopeId,
      },
    });

    const ambiguousWalletA = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Ambiguous rebind wallet A',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyAmbiguous,
        manageExternalPositions: true,
      },
      select: { id: true },
    });
    const ambiguousWalletB = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'Ambiguous rebind wallet B',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyAmbiguous,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    await prisma.bot.createMany({
      data: [
        {
          userId: owner.id,
          name: 'Ambiguous rebind bot A',
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          positionMode: 'ONE_WAY',
          isActive: true,
          liveOptIn: true,
          apiKeyId: keyAmbiguous,
          walletId: ambiguousWalletA.id,
          symbolGroupId: ambiguousScopeAId,
        },
        {
          userId: owner.id,
          name: 'Ambiguous rebind bot B',
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          positionMode: 'ONE_WAY',
          isActive: true,
          liveOptIn: true,
          apiKeyId: keyAmbiguous,
          walletId: ambiguousWalletB.id,
          symbolGroupId: ambiguousScopeBId,
        },
      ],
    });

    await prisma.position.createMany({
      data: [
        {
          userId: owner.id,
          externalId: `${keyOwned}:SOLUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'DRIFT',
          symbol: 'SOLUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 100,
          quantity: 1,
          leverage: 2,
        },
        {
          userId: owner.id,
          externalId: `${keyAmbiguous}:BNBUSDT:SHORT`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'DRIFT',
          symbol: 'BNBUSDT',
          side: 'SHORT',
          status: 'OPEN',
          entryPrice: 600,
          quantity: 0.5,
          leverage: 2,
        },
        {
          userId: owner.id,
          externalId: `${keyUnowned}:ADAUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'DRIFT',
          symbol: 'ADAUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 1,
          quantity: 100,
          leverage: 1,
        },
      ],
    });

    const rebindRes = await agent.post('/dashboard/positions/takeover-rebind');
    expect(rebindRes.status).toBe(200);
    expect(rebindRes.body).toMatchObject({
      scanned: 3,
      rebound: 1,
      ambiguous: 1,
      unowned: 1,
      skippedOwned: 0,
    });

    const statusRes = await agent.get('/dashboard/positions/takeover-status');
    expect(statusRes.status).toBe(200);
    const bySymbol = new Map(
      (statusRes.body.items as Array<{ symbol: string; takeoverStatus: string; botId: string | null }>).map(
        (item) => [item.symbol, item]
      )
    );

    expect(bySymbol.get('SOLUSDT')?.takeoverStatus).toBe('OWNED_AND_MANAGED');
    expect(bySymbol.get('SOLUSDT')?.botId).toBeTruthy();
    expect(bySymbol.get('BNBUSDT')?.takeoverStatus).toBe('AMBIGUOUS');
    expect(bySymbol.get('ADAUSDT')?.takeoverStatus).toBe('UNOWNED');
  });

  it('keeps BOT-origin orphan positions unresolved without explicit ownership proof', async () => {
    const email = 'positions-bot-origin-rebind@example.com';
    const agent = await registerAndLogin(email);
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    const createApiKeyRes = await agent.post('/dashboard/profile/apiKeys').send({
      label: 'bot-origin-rebind',
      exchange: 'BINANCE',
      apiKey: `APIKEY_BOT_ORIGIN_${Date.now()}`,
      apiSecret: `APISECRET_BOT_ORIGIN_${Date.now()}`,
    });
    expect(createApiKeyRes.status).toBe(201);
    const apiKeyId = createApiKeyRes.body.id as string;

    const wallet = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'bot-origin-live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    const bot = await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'bot-origin-live-bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId,
        walletId: wallet.id,
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: owner.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.2,
        quantity: 100,
        leverage: 1,
      },
      select: { id: true },
    });

    const rebindRes = await agent.post('/dashboard/positions/takeover-rebind');
    expect(rebindRes.status).toBe(200);
    expect(rebindRes.body).toMatchObject({
      scanned: 1,
      rebound: 0,
      ambiguous: 0,
      unowned: 1,
      skippedOwned: 0,
      scannedByOrigin: {
        EXCHANGE_SYNC: 0,
        BOT: 1,
      },
      reboundByOrigin: {
        EXCHANGE_SYNC: 0,
        BOT: 0,
      },
    });

    const updatedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { botId: true, walletId: true },
    });
    expect(updatedPosition.botId).toBeNull();
    expect(updatedPosition.walletId).toBeNull();
  });

  it('uses wallet-only management truth for stale BOT_MANAGED takeover rows', async () => {
    const email = 'positions-takeover-policy-drift@example.com';
    const agent = await registerAndLogin(email);
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    const createApiKey = async (label: string, options?: { manageExternalPositions?: boolean }) => {
      const res = await agent.post('/dashboard/profile/apiKeys').send({
        label,
        exchange: 'BINANCE',
        apiKey: `APIKEY_${label}_${Date.now()}`,
        apiSecret: `APISECRET_${label}_${Date.now()}`,
        syncExternalPositions: true,
        manageExternalPositions: options?.manageExternalPositions ?? true,
      });
      expect(res.status).toBe(201);
      return res.body.id as string;
    };

    const keyApiDisabled = await createApiKey('api-disabled', {
      manageExternalPositions: false,
    });
    const keyWalletDisabled = await createApiKey('wallet-disabled', {
      manageExternalPositions: true,
    });
    const apiDisabledScopeId = await createLiveSymbolGroup(owner.id, 'API Disabled Scope', ['BTCUSDT']);
    const walletDisabledScopeId = await createLiveSymbolGroup(owner.id, 'Wallet Disabled Scope', ['ETHUSDT']);

    const walletApiDisabled = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'wallet-api-disabled',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyApiDisabled,
        manageExternalPositions: true,
      },
      select: { id: true },
    });

    const walletWalletDisabled = await prisma.wallet.create({
      data: {
        userId: owner.id,
        name: 'wallet-wallet-disabled',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 100,
        apiKeyId: keyWalletDisabled,
        manageExternalPositions: false,
      },
      select: { id: true },
    });

    const botApiDisabled = await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'bot-api-disabled',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId: keyApiDisabled,
        walletId: walletApiDisabled.id,
        symbolGroupId: apiDisabledScopeId,
      },
      select: { id: true },
    });

    const botWalletDisabled = await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'bot-wallet-disabled',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        apiKeyId: keyWalletDisabled,
        walletId: walletWalletDisabled.id,
        symbolGroupId: walletDisabledScopeId,
      },
      select: { id: true },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: owner.id,
          botId: botApiDisabled.id,
          walletId: walletApiDisabled.id,
          externalId: `${keyApiDisabled}:BTCUSDT:LONG`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 68000,
          quantity: 0.01,
          leverage: 3,
        },
        {
          userId: owner.id,
          botId: botWalletDisabled.id,
          walletId: walletWalletDisabled.id,
          externalId: `${keyWalletDisabled}:ETHUSDT:SHORT`,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          symbol: 'ETHUSDT',
          side: 'SHORT',
          status: 'OPEN',
          entryPrice: 3200,
          quantity: 0.2,
          leverage: 2,
        },
      ],
    });

    const res = await agent.get('/dashboard/positions/takeover-status');
    expect(res.status).toBe(200);

    const bySymbol = new Map(
      (
        res.body.items as Array<{
          symbol: string;
          takeoverStatus: string;
          managementMode: string;
          botId: string | null;
        }>
      ).map((item) => [item.symbol, item])
    );

    expect(bySymbol.get('BTCUSDT')).toMatchObject({
      takeoverStatus: 'OWNED_AND_MANAGED',
      managementMode: 'BOT_MANAGED',
      botId: botApiDisabled.id,
    });
    expect(bySymbol.get('ETHUSDT')).toMatchObject({
      takeoverStatus: 'MANUAL_ONLY',
      managementMode: 'MANUAL_MANAGED',
      botId: null,
    });
  });
});
