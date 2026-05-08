import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';

const PLACEHOLDER_EXCHANGES = ['BYBIT', 'OKX', 'KRAKEN', 'COINBASE'] as const;
let emailCounter = 0;

const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${++emailCounter}@example.com`;

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

const createPayload = () => ({
  name: 'Top USDT Futures',
  marketType: 'FUTURES',
  baseCurrency: 'USDT',
  filterRules: { minVolume24h: 1_000_000 },
  whitelist: ['BTCUSDT', 'ETHUSDT'],
  blacklist: ['USDCUSDT'],
  autoExcludeRules: { stablePairs: true },
});

const createActiveBotUsingUniverse = async (params: {
  userId: string;
  universeId: string;
  isActive?: boolean;
  createCanonicalLinksOnly?: boolean;
  mode?: 'PAPER' | 'LIVE';
}) => {
  const symbolGroup = await prisma.symbolGroup.create({
    data: {
      userId: params.userId,
      marketUniverseId: params.universeId,
      name: `Guard group ${Date.now()}`,
      symbols: ['BTCUSDT', 'ETHUSDT'],
    },
  });

  const strategy = await prisma.strategy.create({
    data: {
      userId: params.userId,
      name: `Guard strategy ${Date.now()}`,
      interval: '1h',
      leverage: 2,
      walletRisk: 1,
      config: {},
    },
  });

  const wallet = await prisma.wallet.create({
    data: {
      userId: params.userId,
      name: `Guard wallet ${Date.now()}`,
      mode: params.mode ?? 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
    },
  });

  const bot = await prisma.bot.create({
    data: {
      userId: params.userId,
      name: `Guard bot ${Date.now()}`,
      strategyId: strategy.id,
      symbolGroupId: symbolGroup.id,
      walletId: wallet.id,
      mode: params.mode ?? 'PAPER',
      isActive: params.isActive ?? true,
      paperStartBalance: 10_000,
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      positionMode: 'ONE_WAY',
      maxOpenPositions: 1,
    },
  });

  if (params.createCanonicalLinksOnly === true) {
    return;
  }

  const botMarketGroup = await prisma.botMarketGroup.create({
    data: {
      userId: params.userId,
      botId: bot.id,
      symbolGroupId: symbolGroup.id,
      lifecycleStatus: 'ACTIVE',
      isEnabled: true,
      executionOrder: 1,
      maxOpenPositions: 1,
    },
  });

  await prisma.marketGroupStrategyLink.create({
    data: {
      userId: params.userId,
      botId: bot.id,
      botMarketGroupId: botMarketGroup.id,
      strategyId: strategy.id,
      priority: 1,
      weight: 1,
      isEnabled: true,
    },
  });

  await prisma.botStrategy.create({
    data: {
      botId: bot.id,
      strategyId: strategy.id,
      symbolGroupId: symbolGroup.id,
      isEnabled: true,
    }
  });

  return bot.id;
};

describe('Markets module contract', () => {
  beforeAll(async () => {
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.paymentIntent.deleteMany();
    await prisma.userSubscription.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/dashboard/markets/universes');
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Missing token');
  });

  it('supports full CRUD for authenticated owner', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-owner'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBeDefined();
    expect(createRes.body.name).toBe('Top USDT Futures');
    expect(createRes.body.exchange).toBe('BINANCE');
    expect(createRes.body.marketType).toBe('FUTURES');
    expect(createRes.body.whitelist).toEqual(['BTCUSDT', 'ETHUSDT']);
    const universeId = createRes.body.id as string;

    const listRes = await agent.get('/dashboard/markets/universes');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(universeId);

    const getRes = await agent.get(`/dashboard/markets/universes/${universeId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(universeId);
    expect(getRes.body.exchange).toBe('BINANCE');
    expect(getRes.body.baseCurrency).toBe('USDT');
    expect(getRes.body.marketType).toBe('FUTURES');

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Top Liquid Futures',
      exchange: 'KRAKEN',
      marketType: 'SPOT',
      baseCurrency: 'EUR',
      whitelist: ['BTCUSDT'],
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Top Liquid Futures');
    expect(updateRes.body.exchange).toBe('KRAKEN');
    expect(updateRes.body.marketType).toBe('SPOT');
    expect(updateRes.body.baseCurrency).toBe('EUR');
    expect(updateRes.body.whitelist).toEqual(['BTCUSDT']);

    const deleteRes = await agent.delete(`/dashboard/markets/universes/${universeId}`);
    expect(deleteRes.status).toBe(204);

    const getDeletedRes = await agent.get(`/dashboard/markets/universes/${universeId}`);
    expect(getDeletedRes.status).toBe(404);
    expect(getDeletedRes.body.error.message).toBe('Not found');
  });

  it('normalizes market universe base currency and symbol lists at the API boundary', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-normalized-input'));

    const createRes = await agent.post('/dashboard/markets/universes').send({
      ...createPayload(),
      baseCurrency: 'usdt',
      whitelist: [' ethusdt ', 'btcusdt', 'ETHUSDT'],
      blacklist: ['usdcusdt'],
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.baseCurrency).toBe('USDT');
    expect(createRes.body.whitelist).toEqual(['ETHUSDT', 'BTCUSDT']);
    expect(createRes.body.blacklist).toEqual(['USDCUSDT']);
  });

  it('syncs linked symbol groups with composed universe contract (volume U whitelist) - blacklist', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-sync'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const createdUniverse = await prisma.marketUniverse.findUnique({
      where: { id: universeId },
      select: { userId: true },
    });
    expect(createdUniverse?.userId).toBeTruthy();
    const userId = createdUniverse!.userId;

    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId,
        marketUniverseId: universeId,
        name: 'Synced group',
        symbols: ['BTCUSDT', 'ETHUSDT'],
      },
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      filterRules: {
        minQuoteVolumeEnabled: true,
        minQuoteVolume24h: 2_000_000_000,
      },
      whitelist: ['SOLUSDT'],
      blacklist: ['ETHUSDT'],
    });
    expect(updateRes.status).toBe(200);

    const refreshedGroup = await prisma.symbolGroup.findUnique({
      where: { id: symbolGroup.id },
      select: { symbols: true },
    });
    expect(refreshedGroup?.symbols).toEqual(['BTCUSDT', 'SOLUSDT']);
  });

  it('syncs linked symbol groups to empty set when filter is disabled and whitelist is empty', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-sync-empty-contract'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const createdUniverse = await prisma.marketUniverse.findUnique({
      where: { id: universeId },
      select: { userId: true },
    });
    expect(createdUniverse?.userId).toBeTruthy();
    const userId = createdUniverse!.userId;

    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId,
        marketUniverseId: universeId,
        name: 'Synced group empty contract',
        symbols: ['BTCUSDT', 'ETHUSDT'],
      },
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      filterRules: {
        minQuoteVolumeEnabled: false,
      },
      whitelist: [],
      blacklist: [],
    });
    expect(updateRes.status).toBe(200);

    const refreshedGroup = await prisma.symbolGroup.findUnique({
      where: { id: symbolGroup.id },
      select: { symbols: true },
    });
    expect(refreshedGroup?.symbols).toEqual([]);
  });

  it('returns public market catalog filtered by base currency and market type', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-catalog'));

    const res = await agent.get('/dashboard/markets/catalog').query({
      exchange: 'BINANCE',
      baseCurrency: 'USDT',
      marketType: 'FUTURES',
    });
    expect(res.status).toBe(200);
    expect(res.body.source).toBe('BINANCE_PUBLIC');
    expect(res.body.exchange).toBe('BINANCE');
    expect(res.body.marketType).toBe('FUTURES');
    expect(res.body.baseCurrency).toBe('USDT');
    expect(Array.isArray(res.body.baseCurrencies)).toBe(true);
    expect(res.body.baseCurrencies).toContain('USDT');
    expect(Array.isArray(res.body.markets)).toBe(true);
    expect(res.body.markets.length).toBeGreaterThan(0);
    expect(res.body.markets[0]).toHaveProperty('symbol');
    expect(res.body.markets[0]).toHaveProperty('displaySymbol');
    expect(res.body.markets[0]).toHaveProperty('baseAsset');
    expect(res.body.markets[0]).toHaveProperty('quoteAsset', 'USDT');
  });

  it('returns Gate.io public market catalog through the exchange adapter contract', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-gateio-catalog'));

    const res = await agent.get('/dashboard/markets/catalog').query({
      exchange: 'GATEIO',
      baseCurrency: 'USDT',
      marketType: 'SPOT',
    });

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('GATEIO_PUBLIC');
    expect(res.body.exchange).toBe('GATEIO');
    expect(res.body.marketType).toBe('SPOT');
    expect(res.body.baseCurrency).toBe('USDT');
    expect(Array.isArray(res.body.markets)).toBe(true);
    expect(res.body.markets.length).toBeGreaterThan(0);
  });

  it('allows persisting universes with placeholder exchanges', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-placeholder-create'));

    const createRes = await agent.post('/dashboard/markets/universes').send({
      ...createPayload(),
      exchange: 'OKX',
    });
    expect(createRes.status).toBe(201);
    expect(createRes.body.exchange).toBe('OKX');
    const universeId = createRes.body.id as string;

    const getRes = await agent.get(`/dashboard/markets/universes/${universeId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.exchange).toBe('OKX');

    const listRes = await agent.get('/dashboard/markets/universes');
    expect(listRes.status).toBe(200);
    const persisted = listRes.body.find((item: { id: string }) => item.id === universeId);
    expect(persisted?.exchange).toBe('OKX');
  });

  it('returns explicit not-implemented contract for placeholder market catalog requests', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-placeholder-catalog'));
    for (const exchange of PLACEHOLDER_EXCHANGES) {
      const res = await agent.get('/dashboard/markets/catalog').query({
        exchange,
        baseCurrency: 'USDT',
        marketType: 'FUTURES',
      });

      expect(res.status).toBe(501);
      expect(res.body.error.message).toContain(
        `Exchange ${exchange} does not support MARKET_CATALOG`
      );
      expect(res.body.error.details).toEqual({
        code: 'EXCHANGE_NOT_IMPLEMENTED',
        exchange,
        capability: 'MARKET_CATALOG',
      });
    }
  });

  it('blocks universe update/delete when linked symbol group is used by active bot', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-active-guard'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const universe = await prisma.marketUniverse.findUnique({
      where: { id: universeId },
      select: { userId: true },
    });
    expect(universe?.userId).toBeTruthy();
    const userId = universe!.userId;

    await createActiveBotUsingUniverse({
      userId,
      universeId,
      isActive: true,
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Blocked while active bot runs',
    });
    expect(updateRes.status).toBe(409);
    expect(updateRes.body.error.message).toBe(
      'market universe is used by active bot and cannot be edited'
    );

    const deleteRes = await agent.delete(`/dashboard/markets/universes/${universeId}`);
    expect(deleteRes.status).toBe(409);
    expect(deleteRes.body.error.message).toBe(
      'market universe is used by active bot and cannot be deleted'
    );
  });

  it('allows universe updates and delete when linked bot is inactive', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-inactive-guard'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const universe = await prisma.marketUniverse.findUnique({
      where: { id: universeId },
      select: { userId: true },
    });
    expect(universe?.userId).toBeTruthy();
    const userId = universe!.userId;

    await createActiveBotUsingUniverse({
      userId,
      universeId,
      isActive: false,
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Allowed when bot inactive',
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Allowed when bot inactive');

    const deleteRes = await agent.delete(`/dashboard/markets/universes/${universeId}`);
    expect(deleteRes.status).toBe(204);

    const deletedUniverse = await prisma.marketUniverse.findUnique({
      where: { id: universeId },
      select: { id: true },
    });
    expect(deletedUniverse).toBeNull();
  });

  it('syncs linked symbols when a PAPER bot using the universe is inactive', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-inactive-paper-symbol-sync'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const universe = await prisma.marketUniverse.findUniqueOrThrow({
      where: { id: universeId },
      select: { userId: true },
    });

    await createActiveBotUsingUniverse({
      userId: universe.userId,
      universeId,
      isActive: false,
      mode: 'PAPER',
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      whitelist: ['SOLUSDT'],
      blacklist: ['BTCUSDT'],
      filterRules: {
        minQuoteVolumeEnabled: false,
      },
    });
    expect(updateRes.status).toBe(200);

    const linkedGroups = await prisma.symbolGroup.findMany({
      where: { userId: universe.userId, marketUniverseId: universeId },
      select: { symbols: true },
    });
    expect(linkedGroups).not.toHaveLength(0);
    expect(linkedGroups.every((group) => group.symbols.join(',') === 'SOLUSDT')).toBe(true);
  });

  it('syncs linked symbols when a LIVE bot using the universe is inactive', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-inactive-live-symbol-sync'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const universe = await prisma.marketUniverse.findUniqueOrThrow({
      where: { id: universeId },
      select: { userId: true },
    });

    await createActiveBotUsingUniverse({
      userId: universe.userId,
      universeId,
      isActive: false,
      mode: 'LIVE',
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      whitelist: ['ADAUSDT', 'SOLUSDT'],
      blacklist: ['ETHUSDT'],
      filterRules: {
        minQuoteVolumeEnabled: false,
      },
    });
    expect(updateRes.status).toBe(200);

    const linkedGroups = await prisma.symbolGroup.findMany({
      where: { userId: universe.userId, marketUniverseId: universeId },
      select: { symbols: true },
    });
    expect(linkedGroups).not.toHaveLength(0);
    expect(linkedGroups.every((group) => group.symbols.join(',') === 'ADAUSDT,SOLUSDT')).toBe(true);
  });

  it('allows universe symbol edits after the linked bot is deactivated through the bot API', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-deactivated-bot-symbol-sync'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const universe = await prisma.marketUniverse.findUniqueOrThrow({
      where: { id: universeId },
      select: { userId: true },
    });

    const botId = await createActiveBotUsingUniverse({
      userId: universe.userId,
      universeId,
      isActive: true,
      mode: 'PAPER',
    });

    const blockedUpdateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Blocked before deactivation',
    });
    expect(blockedUpdateRes.status).toBe(409);

    const deactivateRes = await agent.put(`/dashboard/bots/${botId}`).send({
      isActive: false,
    });
    expect(deactivateRes.status).toBe(200);
    expect(deactivateRes.body.isActive).toBe(false);

    const groupsAfterDeactivate = await prisma.botMarketGroup.findMany({
      where: { botId },
      select: { lifecycleStatus: true },
    });
    expect(groupsAfterDeactivate.map((group) => group.lifecycleStatus)).toEqual(['PAUSED']);

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      whitelist: ['SOLUSDT'],
      blacklist: ['BTCUSDT'],
      filterRules: {
        minQuoteVolumeEnabled: false,
      },
    });
    expect(updateRes.status).toBe(200);

    const linkedGroups = await prisma.symbolGroup.findMany({
      where: { userId: universe.userId, marketUniverseId: universeId },
      select: { symbols: true },
    });
    expect(linkedGroups).not.toHaveLength(0);
    expect(linkedGroups.every((group) => group.symbols.join(',') === 'SOLUSDT')).toBe(true);

    const reactivateRes = await agent.put(`/dashboard/bots/${botId}`).send({
      isActive: true,
    });
    expect(reactivateRes.status).toBe(200);
    expect(reactivateRes.body.isActive).toBe(true);

    const groupsAfterReactivate = await prisma.botMarketGroup.findMany({
      where: { botId },
      select: { lifecycleStatus: true },
    });
    expect(groupsAfterReactivate.map((group) => group.lifecycleStatus)).toEqual(['ACTIVE']);

    const blockedAfterReactivateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Blocked after reactivation',
    });
    expect(blockedAfterReactivateRes.status).toBe(409);
  });

  it('ignores stale legacy bot strategy links when the current active bot scope moved to another universe', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-stale-legacy-bot-strategy'));

    const sourceUniverseRes = await agent.post('/dashboard/markets/universes').send({
      ...createPayload(),
      name: 'Legacy Source Universe',
      whitelist: ['ETHUSDT'],
      blacklist: [],
    });
    expect(sourceUniverseRes.status).toBe(201);
    const sourceUniverseId = sourceUniverseRes.body.id as string;

    const currentUniverseRes = await agent.post('/dashboard/markets/universes').send({
      ...createPayload(),
      name: 'Current Bot Universe',
      whitelist: ['DOGEUSDT'],
      blacklist: [],
    });
    expect(currentUniverseRes.status).toBe(201);
    const currentUniverseId = currentUniverseRes.body.id as string;

    const sourceUniverse = await prisma.marketUniverse.findUniqueOrThrow({
      where: { id: sourceUniverseId },
      select: { userId: true },
    });

    const disabledLinkedBotId = await createActiveBotUsingUniverse({
      userId: sourceUniverse.userId,
      universeId: sourceUniverseId,
      isActive: true,
      mode: 'PAPER',
    });
    expect(disabledLinkedBotId).toBeDefined();
    const deactivateRes = await agent.put(`/dashboard/bots/${disabledLinkedBotId}`).send({
      isActive: false,
    });
    expect(deactivateRes.status).toBe(200);

    const activeCurrentBotId = await createActiveBotUsingUniverse({
      userId: sourceUniverse.userId,
      universeId: currentUniverseId,
      isActive: true,
      mode: 'PAPER',
    });
    expect(activeCurrentBotId).toBeDefined();

    const activeCurrentBot = await prisma.bot.findUniqueOrThrow({
      where: { id: activeCurrentBotId! },
      select: { strategyId: true },
    });
    const staleSourceGroup = await prisma.symbolGroup.findFirstOrThrow({
      where: {
        userId: sourceUniverse.userId,
        marketUniverseId: sourceUniverseId,
      },
      select: { id: true },
    });

    await prisma.botStrategy.create({
      data: {
        botId: activeCurrentBotId!,
        strategyId: activeCurrentBot.strategyId!,
        symbolGroupId: staleSourceGroup.id,
        isEnabled: true,
      },
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${sourceUniverseId}`).send({
      whitelist: ['ETHUSDT', 'BTCUSDT'],
      blacklist: [],
      filterRules: {
        minQuoteVolumeEnabled: false,
      },
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.whitelist).toEqual(['ETHUSDT', 'BTCUSDT']);
  });

  it('blocks universe update/delete when active primary bot still points at the universe even if group links drifted', async () => {
    const agent = await registerAndLogin(uniqueEmail('markets-primary-guard'));

    const createRes = await agent.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;
    const universe = await prisma.marketUniverse.findUnique({
      where: { id: universeId },
      select: { userId: true },
    });
    expect(universe?.userId).toBeTruthy();

    await createActiveBotUsingUniverse({
      userId: universe!.userId,
      universeId,
      isActive: true,
      createCanonicalLinksOnly: true,
    });

    const updateRes = await agent.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Blocked by active primary bot',
    });
    expect(updateRes.status).toBe(409);
    expect(updateRes.body.error.message).toBe(
      'market universe is used by active bot and cannot be edited'
    );

    const deleteRes = await agent.delete(`/dashboard/markets/universes/${universeId}`);
    expect(deleteRes.status).toBe(409);
    expect(deleteRes.body.error.message).toBe(
      'market universe is used by active bot and cannot be deleted'
    );
  });

  it('enforces ownership isolation for get/update/delete', async () => {
    const owner = await registerAndLogin(uniqueEmail('markets-owner-2'));
    const other = await registerAndLogin(uniqueEmail('markets-other'));

    const createRes = await owner.post('/dashboard/markets/universes').send(createPayload());
    expect(createRes.status).toBe(201);
    const universeId = createRes.body.id as string;

    const getRes = await other.get(`/dashboard/markets/universes/${universeId}`);
    expect(getRes.status).toBe(404);

    const updateRes = await other.put(`/dashboard/markets/universes/${universeId}`).send({
      name: 'Should not update',
    });
    expect(updateRes.status).toBe(404);

    const deleteRes = await other.delete(`/dashboard/markets/universes/${universeId}`);
    expect(deleteRes.status).toBe(404);
  });
});


