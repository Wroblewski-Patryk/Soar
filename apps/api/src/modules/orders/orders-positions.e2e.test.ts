import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { clearRuntimeSignalMarketDataStore } from '../engine/runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore, upsertRuntimeTicker } from '../engine/runtimeTickerStore';

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

const getUserId = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user.id;
};

const createMarketScope = async (params: {
  userId: string;
  name: string;
  symbols: string[];
  exchange?: 'BINANCE' | 'BYBIT' | 'OKX' | 'KRAKEN' | 'COINBASE';
  marketType?: 'FUTURES' | 'SPOT';
  baseCurrency?: string;
}) => {
  const universe = await prisma.marketUniverse.create({
    data: {
      userId: params.userId,
      name: `${params.name} universe`,
      exchange: params.exchange ?? 'BINANCE',
      marketType: params.marketType ?? 'FUTURES',
      baseCurrency: params.baseCurrency ?? 'USDT',
      whitelist: params.symbols,
      blacklist: [],
    },
    select: { id: true },
  });

  return prisma.symbolGroup.create({
    data: {
      userId: params.userId,
      marketUniverseId: universe.id,
      name: `${params.name} group`,
      symbols: params.symbols,
    },
    select: { id: true },
  });
};

describe('Orders and positions read contract', () => {
  beforeEach(async () => {
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
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

  it('rejects unauthenticated access', async () => {
    const ordersRes = await request(app).get('/dashboard/orders');
    expect(ordersRes.status).toBe(401);
    expect(ordersRes.body.error.message).toBe('Missing token');

    const positionsRes = await request(app).get('/dashboard/positions');
    expect(positionsRes.status).toBe(401);
    expect(positionsRes.body.error.message).toBe('Missing token');
  });

  it('lists and fetches only owner data for orders and positions', async () => {
    const ownerAgent = await registerAndLogin('read-owner@example.com');
    await registerAndLogin('read-other@example.com');

    const ownerId = await getUserId('read-owner@example.com');
    const otherId = await getUserId('read-other@example.com');

    const ownerPosition = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        entryPrice: 60000,
        quantity: 0.1,
      },
    });

    await prisma.position.create({
      data: {
        userId: otherId,
        symbol: 'ETHUSDT',
        side: 'SHORT',
        entryPrice: 3000,
        quantity: 1.5,
      },
    });

    const ownerOrder = await prisma.order.create({
      data: {
        userId: ownerId,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.1,
        price: 59500,
      },
    });

    await prisma.order.create({
      data: {
        userId: otherId,
        symbol: 'ETHUSDT',
        side: 'SELL',
        type: 'MARKET',
        status: 'FILLED',
        quantity: 1.5,
      },
    });

    const listPositionsRes = await ownerAgent.get('/dashboard/positions');
    expect(listPositionsRes.status).toBe(200);
    expect(listPositionsRes.body).toHaveLength(1);
    expect(listPositionsRes.body[0].id).toBe(ownerPosition.id);

    const getPositionRes = await ownerAgent.get(`/dashboard/positions/${ownerPosition.id}`);
    expect(getPositionRes.status).toBe(200);
    expect(getPositionRes.body.id).toBe(ownerPosition.id);

    const listOrdersRes = await ownerAgent.get('/dashboard/orders');
    expect(listOrdersRes.status).toBe(200);
    expect(listOrdersRes.body).toHaveLength(1);
    expect(listOrdersRes.body[0].id).toBe(ownerOrder.id);

    const getOrderRes = await ownerAgent.get(`/dashboard/orders/${ownerOrder.id}`);
    expect(getOrderRes.status).toBe(200);
    expect(getOrderRes.body.id).toBe(ownerOrder.id);
  });

  it('enforces ownership isolation for get by id', async () => {
    const ownerAgent = await registerAndLogin('read-owner-2@example.com');
    const otherAgent = await registerAndLogin('read-other-2@example.com');

    const ownerId = await getUserId('read-owner-2@example.com');

    const ownerPosition = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'SOLUSDT',
        side: 'LONG',
        entryPrice: 120,
        quantity: 10,
      },
    });

    const ownerOrder = await prisma.order.create({
      data: {
        userId: ownerId,
        symbol: 'SOLUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 10,
        price: 118,
      },
    });

    const otherPositionRes = await otherAgent.get(`/dashboard/positions/${ownerPosition.id}`);
    expect(otherPositionRes.status).toBe(404);
    expect(otherPositionRes.body.error.message).toBe('Not found');

    const otherOrderRes = await otherAgent.get(`/dashboard/orders/${ownerOrder.id}`);
    expect(otherOrderRes.status).toBe(404);
    expect(otherOrderRes.body.error.message).toBe('Not found');

    const ownerPositionRes = await ownerAgent.get(`/dashboard/positions/${ownerPosition.id}`);
    expect(ownerPositionRes.status).toBe(200);

    const ownerOrderRes = await ownerAgent.get(`/dashboard/orders/${ownerOrder.id}`);
    expect(ownerOrderRes.status).toBe(200);
  });

  it('returns manual-order context for owner and keeps explicit orderType fallback contract', async () => {
    const ownerAgent = await registerAndLogin('manual-context-owner@example.com');
    const otherAgent = await registerAndLogin('manual-context-other@example.com');
    const ownerId = await getUserId('manual-context-owner@example.com');

    const strategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Manual Context Strategy',
        description: null,
        interval: '5m',
        leverage: 9,
        walletRisk: 1.5,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'UNKNOWN_FALLBACK',
          },
        },
      },
    });

    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Manual context universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });

    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: universe.id,
        name: 'Manual context symbols',
        symbols: ['BTCUSDT'],
      },
    });

    const bot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Manual context bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });

    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerId,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 4,
        isEnabled: true,
      },
    });

    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerId,
        botId: bot.id,
        botMarketGroupId: botGroup.id,
        strategyId: strategy.id,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });

    const ownerContextRes = await ownerAgent.get('/dashboard/orders/manual-context').query({
      botId: bot.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
    });

    expect(ownerContextRes.status).toBe(200);
    expect(ownerContextRes.body.botId).toBe(bot.id);
    expect(ownerContextRes.body.symbol).toBe('BTCUSDT');
    expect(ownerContextRes.body.orderType).toBe('MARKET');
    expect(ownerContextRes.body.marginMode).toBe('ISOLATED');
    expect(ownerContextRes.body.leverage).toBe(9);
    expect(ownerContextRes.body.priceReference.markPrice).toBeNull();
    expect(ownerContextRes.body.quantityConstraints.minExecutableQty).toBeNull();

    const forbiddenContextRes = await otherAgent.get('/dashboard/orders/manual-context').query({
      botId: bot.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
    });

    expect(forbiddenContextRes.status).toBe(404);
    expect(forbiddenContextRes.body.error.message).toBe('Not found');
  });

  it('resolves manual-order strategy context from market-universe contract when symbol-group snapshot is empty', async () => {
    const ownerAgent = await registerAndLogin('manual-context-universe-contract-owner@example.com');
    const ownerId = await getUserId('manual-context-universe-contract-owner@example.com');

    const strategyFromUniverse = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Manual Context Universe Strategy',
        interval: '5m',
        leverage: 9,
        walletRisk: 1.5,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'MARKET',
          },
        },
      },
    });

    const strategyFallback = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Manual Context Fallback Strategy',
        interval: '5m',
        leverage: 3,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'CROSSED',
            orderType: 'LIMIT',
          },
        },
      },
    });

    const contractUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Manual context contract universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        filterRules: {
          minQuoteVolumeEnabled: true,
          minQuoteVolume24h: 2_000_000_000,
        },
        whitelist: ['XRPUSDT'],
        blacklist: ['ETHUSDT'],
      },
    });

    const fallbackUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Manual context fallback universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });

    const contractSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: contractUniverse.id,
        name: 'Manual context contract symbols',
        symbols: [],
      },
    });

    const fallbackSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: fallbackUniverse.id,
        name: 'Manual context fallback symbols',
        symbols: ['BTCUSDT'],
      },
    });

    const bot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Manual context contract bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });

    const contractBotGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerId,
        botId: bot.id,
        symbolGroupId: contractSymbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 4,
        isEnabled: true,
      },
    });

    const fallbackBotGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerId,
        botId: bot.id,
        symbolGroupId: fallbackSymbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 2,
        maxOpenPositions: 4,
        isEnabled: true,
      },
    });

    await prisma.marketGroupStrategyLink.createMany({
      data: [
        {
          userId: ownerId,
          botId: bot.id,
          botMarketGroupId: contractBotGroup.id,
          strategyId: strategyFromUniverse.id,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
        {
          userId: ownerId,
          botId: bot.id,
          botMarketGroupId: fallbackBotGroup.id,
          strategyId: strategyFallback.id,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
      ],
    });

    const contextRes = await ownerAgent.get('/dashboard/orders/manual-context').query({
      botId: bot.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
    });

    expect(contextRes.status).toBe(200);
    expect(contextRes.body.symbol).toBe('BTCUSDT');
    expect(contextRes.body.leverage).toBe(9);
    expect(contextRes.body.orderType).toBe('MARKET');
    expect(contextRes.body.marginMode).toBe('ISOLATED');
  });

  it('keeps manual-order context fail-closed when selected bot has no symbol-matching strategy', async () => {
    const ownerAgent = await registerAndLogin('manual-context-no-symbol-match-owner@example.com');
    const ownerId = await getUserId('manual-context-no-symbol-match-owner@example.com');

    const canonicalStrategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Manual Context No Match Canonical',
        interval: '5m',
        leverage: 11,
        walletRisk: 1.2,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'LIMIT',
          },
        },
      },
    });
    const legacyStrategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Manual Context No Match Legacy',
        interval: '15m',
        leverage: 6,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'STOP',
          },
        },
      },
    });

    const canonicalUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Manual context no match canonical universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['ETHUSDT'],
        blacklist: [],
      },
    });
    const legacyUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Manual context no match legacy universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['SOLUSDT'],
        blacklist: [],
      },
    });

    const canonicalSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: canonicalUniverse.id,
        name: 'Manual context no match canonical group',
        symbols: ['ETHUSDT'],
      },
    });
    const legacySymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: legacyUniverse.id,
        name: 'Manual context no match legacy group',
        symbols: ['SOLUSDT'],
      },
    });

    const bot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Manual context no match bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerId,
        botId: bot.id,
        symbolGroupId: canonicalSymbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerId,
        botId: bot.id,
        botMarketGroupId: botGroup.id,
        strategyId: canonicalStrategy.id,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });
    await prisma.botStrategy.create({
      data: {
        botId: bot.id,
        strategyId: legacyStrategy.id,
        symbolGroupId: legacySymbolGroup.id,
        isEnabled: true,
      },
    });

    const contextRes = await ownerAgent.get('/dashboard/orders/manual-context').query({
      botId: bot.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
    });

    expect(contextRes.status).toBe(200);
    expect(contextRes.body.symbol).toBe('BTCUSDT');
    expect(contextRes.body.orderType).toBe('MARKET');
    expect(contextRes.body.marginMode).toBe('CROSSED');
    expect(contextRes.body.leverage).toBe(1);
  });

  it('rejects LIVE manual open when selected bot has no canonical strategy scope for symbol', async () => {
    const ownerAgent = await registerAndLogin('manual-live-scope-reject-owner@example.com');
    const ownerId = await getUserId('manual-live-scope-reject-owner@example.com');

    const strategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Manual live scoped strategy',
        interval: '5m',
        leverage: 6,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'MARKET',
          },
        },
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Manual live scoped wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Manual live scoped universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: universe.id,
        name: 'Manual live scoped group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Manual live scoped bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      botId: bot.id,
      symbol: 'ETHUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 0.1,
      mode: 'LIVE',
      riskAck: true,
    });

    expect(openRes.status).toBe(400);
    expect(openRes.body.error.message).toBe(
      'selected bot has no canonical strategy scope for requested LIVE symbol'
    );
  });

  it('routes manual open through unified fill lifecycle and creates position only after fill', async () => {
    const ownerAgent = await registerAndLogin('manual-order-order-only-owner@example.com');
    const ownerId = await getUserId('manual-order-order-only-owner@example.com');

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 0.05,
      price: 61_000,
      mode: 'PAPER',
      riskAck: false,
    });

    expect(openRes.status).toBe(201);
    expect(openRes.body.symbol).toBe('BTCUSDT');
    expect(openRes.body.status).toBe('FILLED');
    const persistedManualOrder = await prisma.order.findUniqueOrThrow({
      where: { id: openRes.body.id as string },
      select: { origin: true },
    });
    expect(persistedManualOrder.origin).toBe('USER');

    const openedPosition = await prisma.position.findFirst({
      where: { userId: ownerId, id: openRes.body.positionId as string },
    });
    expect(openedPosition).not.toBeNull();
    expect(openedPosition?.origin).toBe('USER');

    const auditLog = await prisma.log.findFirst({
      where: {
        userId: ownerId,
        action: 'order.opened',
        entityType: 'ORDER',
        entityId: openRes.body.id as string,
      },
      orderBy: { occurredAt: 'desc' },
    });
    expect(auditLog).not.toBeNull();
    const metadata = (auditLog?.metadata ?? {}) as {
      semanticPath?: string;
      lifecycleContract?: string;
      waitingForFill?: boolean;
    };
    expect(metadata.semanticPath).toBe('unified_order_fill_position');
    expect(metadata.lifecycleContract).toBe('order->fill->position');
    expect(metadata.waitingForFill).toBe(false);
  });

  it('keeps manual-order write/read scope deterministic per selected bot context', async () => {
    const ownerAgent = await registerAndLogin('manual-order-selected-bot-scope@example.com');
    const ownerId = await getUserId('manual-order-selected-bot-scope@example.com');

    const liveStrategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Scoped live strategy',
        interval: '1m',
        leverage: 5,
        walletRisk: 1,
        config: { additional: {} },
      },
    });
    const paperStrategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Scoped paper strategy',
        interval: '5m',
        leverage: 3,
        walletRisk: 1,
        config: { additional: {} },
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Scoped live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const paperWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Scoped paper wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const scopeUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Scoped order universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const scopeSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: scopeUniverse.id,
        name: 'Scoped order symbols',
        symbols: ['BTCUSDT'],
      },
    });
    const liveBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Scoped live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: liveWallet.id,
        symbolGroupId: scopeSymbolGroup.id,
        strategyId: liveStrategy.id,
      },
    });
    const paperBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Scoped paper bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        walletId: paperWallet.id,
        symbolGroupId: scopeSymbolGroup.id,
        strategyId: paperStrategy.id,
      },
    });
    const liveBotGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerId,
        botId: liveBot.id,
        symbolGroupId: scopeSymbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        isEnabled: true,
      },
    });
    const paperBotGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerId,
        botId: paperBot.id,
        symbolGroupId: scopeSymbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.createMany({
      data: [
        {
          userId: ownerId,
          botId: liveBot.id,
          botMarketGroupId: liveBotGroup.id,
          strategyId: liveStrategy.id,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
        {
          userId: ownerId,
          botId: paperBot.id,
          botMarketGroupId: paperBotGroup.id,
          strategyId: paperStrategy.id,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
      ],
    });

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      botId: liveBot.id,
      walletId: paperWallet.id,
      strategyId: paperStrategy.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 0.25,
      price: 61000,
      mode: 'PAPER',
      riskAck: true,
    });
    expect(openRes.status).toBe(201);
    expect(openRes.body.status).toBe('OPEN');

    const persistedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: openRes.body.id as string },
      select: {
        botId: true,
        walletId: true,
        strategyId: true,
      },
    });
    expect(persistedOrder.botId).toBe(liveBot.id);
    expect(persistedOrder.walletId).toBe(liveWallet.id);
    expect(persistedOrder.strategyId).toBe(liveStrategy.id);
    expect(persistedOrder.walletId).not.toBe(paperWallet.id);
    expect(persistedOrder.strategyId).not.toBe(paperStrategy.id);

    const liveSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: liveBot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-20T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-20T12:00:10.000Z'),
      },
    });
    const paperSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: paperBot.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-20T12:01:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-20T12:01:10.000Z'),
      },
    });

    const liveScopeRes = await ownerAgent.get(
      `/dashboard/bots/${liveBot.id}/runtime-sessions/${liveSession.id}/positions`
    );
    expect(liveScopeRes.status).toBe(200);
    expect(
      liveScopeRes.body.openOrders.some((item: { id: string }) => item.id === openRes.body.id)
    ).toBe(true);

    const paperScopeRes = await ownerAgent.get(
      `/dashboard/bots/${paperBot.id}/runtime-sessions/${paperSession.id}/positions`
    );
    expect(paperScopeRes.status).toBe(200);
    expect(
      paperScopeRes.body.openOrders.some((item: { id: string }) => item.id === openRes.body.id)
    ).toBe(false);
  });

  it('supports open/cancel/close write endpoints with LIVE risk guards', async () => {
    const ownerAgent = await registerAndLogin('orders-write-owner@example.com');
    const ownerId = await getUserId('orders-write-owner@example.com');

    const liveWithoutAckRes = await ownerAgent.post('/dashboard/orders/open').send({
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 0.1,
      mode: 'LIVE',
      riskAck: false,
    });
    expect(liveWithoutAckRes.status).toBe(400);
    expect(liveWithoutAckRes.body.error.message).toBe('riskAck is required for LIVE order open');

    const liveStrategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Orders write live strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {
          additional: {
            orderType: 'LIMIT',
            marginMode: 'ISOLATED',
          },
        },
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Orders write live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const liveSymbolGroup = await createMarketScope({
      userId: ownerId,
      name: 'Orders write live scope',
      symbols: ['BTCUSDT'],
    });
    const liveBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Live Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        maxOpenPositions: 3,
        walletId: liveWallet.id,
        symbolGroupId: liveSymbolGroup.id,
        strategyId: liveStrategy.id,
      },
    });

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      botId: liveBot.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 0.2,
      price: 62000,
      mode: 'LIVE',
      riskAck: true,
    });
    expect(openRes.status).toBe(201);
    expect(openRes.body.status).toBe('OPEN');

    const cancelWithoutAckRes = await ownerAgent
      .post(`/dashboard/orders/${openRes.body.id}/cancel`)
      .send({ riskAck: false });
    expect(cancelWithoutAckRes.status).toBe(400);
    expect(cancelWithoutAckRes.body.error.message).toBe('riskAck is required to cancel order');

    const cancelRes = await ownerAgent
      .post(`/dashboard/orders/${openRes.body.id}/cancel`)
      .send({ riskAck: true });
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.status).toBe('CANCELED');

    const position = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3000,
        quantity: 1,
      },
    });

    const closableOrder = await prisma.order.create({
      data: {
        userId: ownerId,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'SELL',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 1,
        price: 3200,
      },
    });

    const closeRes = await ownerAgent
      .post(`/dashboard/orders/${closableOrder.id}/close`)
      .send({ riskAck: true });
    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('FILLED');

    const closedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(closedPosition.status).toBe('CLOSED');
  });

  it('updates position management mode for owner and enforces ownership', async () => {
    const ownerAgent = await registerAndLogin('positions-mode-owner@example.com');
    const otherAgent = await registerAndLogin('positions-mode-other@example.com');
    const ownerId = await getUserId('positions-mode-owner@example.com');

    const position = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 63000,
        quantity: 0.05,
        managementMode: 'BOT_MANAGED',
        origin: 'BOT',
      },
    });

    const forbiddenRes = await otherAgent
      .patch(`/dashboard/positions/${position.id}/management-mode`)
      .send({ managementMode: 'MANUAL_MANAGED' });
    expect(forbiddenRes.status).toBe(404);
    expect(forbiddenRes.body.error.message).toBe('Not found');

    const updateRes = await ownerAgent
      .patch(`/dashboard/positions/${position.id}/management-mode`)
      .send({ managementMode: 'MANUAL_MANAGED' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.managementMode).toBe('MANUAL_MANAGED');

    const updated = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(updated.managementMode).toBe('MANUAL_MANAGED');
  });

  it('updates position TP/SL manually for owner and persists audit metadata', async () => {
    const ownerAgent = await registerAndLogin('positions-manual-edit-owner@example.com');
    const otherAgent = await registerAndLogin('positions-manual-edit-other@example.com');
    const ownerId = await getUserId('positions-manual-edit-owner@example.com');

    const position = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 63000,
        quantity: 0.05,
        takeProfit: null,
        stopLoss: null,
        managementMode: 'BOT_MANAGED',
        origin: 'BOT',
      },
    });

    const forbiddenRes = await otherAgent
      .patch(`/dashboard/positions/${position.id}/manual-update`)
      .send({ takeProfit: 64000, stopLoss: 62000, notes: 'other-user', lockRules: true });
    expect(forbiddenRes.status).toBe(404);
    expect(forbiddenRes.body.error.message).toBe('Not found');

    const updateRes = await ownerAgent
      .patch(`/dashboard/positions/${position.id}/manual-update`)
      .send({
        takeProfit: 64000,
        stopLoss: 62000,
        notes: 'manual runtime adjustment',
        lockRules: true,
      });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.takeProfit).toBe(64000);
    expect(updateRes.body.stopLoss).toBe(62000);

    const updated = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(updated.takeProfit).toBe(64000);
    expect(updated.stopLoss).toBe(62000);

    const auditLog = await prisma.log.findFirst({
      where: {
        userId: ownerId,
        action: 'position.manual_update',
        entityType: 'POSITION',
        entityId: position.id,
      },
      orderBy: { occurredAt: 'desc' },
    });
    expect(auditLog).not.toBeNull();
    expect(auditLog?.source).toBe('positions.service');
    const metadata = (auditLog?.metadata ?? {}) as {
      previous?: { takeProfit?: number | null; stopLoss?: number | null };
      next?: { takeProfit?: number | null; stopLoss?: number | null };
      notes?: string | null;
      lockRules?: boolean;
    };
    expect(metadata.previous?.takeProfit ?? null).toBeNull();
    expect(metadata.previous?.stopLoss ?? null).toBeNull();
    expect(metadata.next?.takeProfit ?? null).toBe(64000);
    expect(metadata.next?.stopLoss ?? null).toBe(62000);
    expect(metadata.notes ?? null).toBe('manual runtime adjustment');
    expect(metadata.lockRules).toBe(true);
  });

  it('rejects unsafe manual TP/SL updates and closed-position edits', async () => {
    const ownerAgent = await registerAndLogin('positions-manual-edit-safety-owner@example.com');
    const ownerId = await getUserId('positions-manual-edit-safety-owner@example.com');

    const longPosition = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3000,
        quantity: 0.4,
        managementMode: 'BOT_MANAGED',
        origin: 'BOT',
      },
    });

    const unsafeLongTpRes = await ownerAgent
      .patch(`/dashboard/positions/${longPosition.id}/manual-update`)
      .send({ takeProfit: 2900 });
    expect(unsafeLongTpRes.status).toBe(400);
    expect(unsafeLongTpRes.body.error.message).toBe(
      'Take profit must be above entry price for LONG position.'
    );

    const shortPosition = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'BNBUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 600,
        quantity: 1.2,
        managementMode: 'BOT_MANAGED',
        origin: 'BOT',
      },
    });

    const unsafeShortSlRes = await ownerAgent
      .patch(`/dashboard/positions/${shortPosition.id}/manual-update`)
      .send({ stopLoss: 590 });
    expect(unsafeShortSlRes.status).toBe(400);
    expect(unsafeShortSlRes.body.error.message).toBe(
      'Stop loss must be above entry price for SHORT position.'
    );

    const closedPosition = await prisma.position.create({
      data: {
        userId: ownerId,
        symbol: 'SOLUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 180,
        quantity: 2,
        managementMode: 'BOT_MANAGED',
        origin: 'BOT',
        closedAt: new Date('2026-04-12T10:00:00.000Z'),
      },
    });

    const closedUpdateRes = await ownerAgent
      .patch(`/dashboard/positions/${closedPosition.id}/manual-update`)
      .send({ takeProfit: 190 });
    expect(closedUpdateRes.status).toBe(409);
    expect(closedUpdateRes.body.error.message).toBe('Only OPEN positions can be manually updated.');
  });

  it('keeps EXCHANGE_SYNC BOT_MANAGED runtime positions visible for LIVE bot even when PAPER bot shares symbol', async () => {
    const ownerAgent = await registerAndLogin('runtime-ownership-live-paper@example.com');
    const ownerId = await getUserId('runtime-ownership-live-paper@example.com');

    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Live runtime wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Runtime ownership universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: marketUniverse.id,
        name: 'Runtime ownership group',
        symbols: ['BTCUSDT'],
      },
    });

    const paperBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Paper runtime owner',
        mode: 'PAPER',
        marketType: 'FUTURES',
        isActive: true,
        symbolGroupId: symbolGroup.id,
        createdAt: new Date('2026-04-12T10:00:00.000Z'),
      },
    });
    const liveBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Live runtime owner',
        mode: 'LIVE',
        marketType: 'FUTURES',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: liveWallet.id,
        symbolGroupId: symbolGroup.id,
        createdAt: new Date('2026-04-12T10:05:00.000Z'),
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: liveBot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-12T11:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-12T11:02:00.000Z'),
      },
    });

    const exchangePosition = await prisma.position.create({
      data: {
        userId: ownerId,
        botId: null,
        walletId: null,
        externalId: 'runtime-owner-key:BTCUSDT:LONG',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 64000,
        quantity: 0.03,
        leverage: 5,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        openedAt: new Date('2026-04-12T10:59:00.000Z'),
      },
    });

    const positionsRes = await ownerAgent.get(
      `/dashboard/bots/${liveBot.id}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(
      positionsRes.body.openItems.some((item: { id: string }) => item.id === exchangePosition.id)
    ).toBe(true);
  });

  it('closes EXCHANGE_SYNC BOT_MANAGED runtime position selected from LIVE dashboard flow', async () => {
    const ownerAgent = await registerAndLogin('runtime-close-live-exchange@example.com');
    const ownerId = await getUserId('runtime-close-live-exchange@example.com');

    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Live close wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerId,
        name: 'Runtime close universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerId,
        marketUniverseId: marketUniverse.id,
        name: 'Runtime close group',
        symbols: ['BTCUSDT'],
      },
    });
    const liveStrategy = await prisma.strategy.create({
      data: {
        userId: ownerId,
        name: 'Runtime close strategy',
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
    });

    const paperBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Paper close owner',
        mode: 'PAPER',
        marketType: 'FUTURES',
        isActive: true,
        symbolGroupId: symbolGroup.id,
        createdAt: new Date('2026-04-12T10:00:00.000Z'),
      },
    });
    const liveBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Live close owner',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: liveWallet.id,
        symbolGroupId: symbolGroup.id,
        strategyId: liveStrategy.id,
        createdAt: new Date('2026-04-12T10:05:00.000Z'),
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: liveBot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-12T11:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-12T11:02:00.000Z'),
      },
    });

    const exchangePosition = await prisma.position.create({
      data: {
        userId: ownerId,
        botId: null,
        walletId: null,
        externalId: 'runtime-close-key:BTCUSDT:LONG',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 64000,
        quantity: 0.03,
        leverage: 5,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        openedAt: new Date('2026-04-12T10:59:00.000Z'),
      },
    });

    upsertRuntimeTicker({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      lastPrice: 64_100,
      eventTime: Date.parse('2026-04-12T11:03:00.000Z'),
      priceChangePercent24h: 0,
    });

    const closeRes = await ownerAgent
      .post(`/dashboard/bots/${liveBot.id}/runtime-sessions/${session.id}/positions/${exchangePosition.id}/close`)
      .send({ riskAck: true });

    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('closed');
    expect(closeRes.body.positionId).toBe(exchangePosition.id);

    const secondCloseRes = await ownerAgent
      .post(`/dashboard/bots/${liveBot.id}/runtime-sessions/${session.id}/positions/${exchangePosition.id}/close`)
      .send({ riskAck: true });

    expect(secondCloseRes.status).toBe(200);
    expect(secondCloseRes.body.status).toBe('closed');
    expect(secondCloseRes.body.positionId).toBe(exchangePosition.id);
  });

  it('keeps profitable PAPER runtime manual close consistent across position history and capital summary', async () => {
    const ownerAgent = await registerAndLogin('runtime-paper-profit-close@example.com');
    const ownerId = await getUserId('runtime-paper-profit-close@example.com');

    const paperWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Paper profit wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 1_000,
      },
    });

    const symbolGroup = await createMarketScope({
      userId: ownerId,
      name: 'Paper profit scope',
      symbols: ['BTCUSDT'],
    });

    const paperBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Paper profit bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        walletId: paperWallet.id,
        symbolGroupId: symbolGroup.id,
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: paperBot.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-24T09:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-24T09:02:00.000Z'),
      },
    });

    const openPosition = await prisma.position.create({
      data: {
        userId: ownerId,
        botId: paperBot.id,
        walletId: paperWallet.id,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 1,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        openedAt: new Date('2026-04-24T09:01:00.000Z'),
      },
    });

    upsertRuntimeTicker({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      lastPrice: 110,
      eventTime: Date.parse('2026-04-24T09:03:00.000Z'),
      priceChangePercent24h: 0,
    });

    const closeRes = await ownerAgent
      .post(
        `/dashboard/bots/${paperBot.id}/runtime-sessions/${session.id}/positions/${openPosition.id}/close`
      )
      .send({ riskAck: true });

    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('closed');
    expect(closeRes.body.positionId).toBe(openPosition.id);

    const closedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: openPosition.id },
    });
    expect(closedPosition.status).toBe('CLOSED');
    expect(closedPosition.realizedPnl ?? 0).toBeGreaterThan(0);

    const closeTrade = await prisma.trade.findFirstOrThrow({
      where: {
        userId: ownerId,
        botId: paperBot.id,
        positionId: openPosition.id,
        lifecycleAction: 'CLOSE',
      },
      orderBy: { executedAt: 'desc' },
    });
    expect(closeTrade.realizedPnl ?? 0).toBeGreaterThan(0);

    const positionsRes = await ownerAgent.get(
      `/dashboard/bots/${paperBot.id}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.summary.referenceBalance).toBeGreaterThan(1_000);
    expect(positionsRes.body.summary.freeCash).toBeGreaterThan(1_000);

    const historyItem = positionsRes.body.historyItems.find(
      (item: { id: string }) => item.id === openPosition.id
    ) as { realizedPnl: number } | undefined;
    expect(historyItem).toBeDefined();
    expect(historyItem?.realizedPnl ?? 0).toBeGreaterThan(0);
  });

  it('keeps LIVE open orders visible in runtime view when order was created before current session start', async () => {
    const ownerAgent = await registerAndLogin('runtime-live-open-order-carryover@example.com');
    const ownerId = await getUserId('runtime-live-open-order-carryover@example.com');

    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Live order wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });

    const liveBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Live orders bot',
        mode: 'LIVE',
        marketType: 'FUTURES',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: liveWallet.id,
        symbolGroupId: (
          await createMarketScope({
            userId: ownerId,
            name: 'Live carryover scope',
            symbols: ['BTCUSDT'],
          })
        ).id,
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: liveBot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-12T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-12T12:02:00.000Z'),
      },
    });

    const carryoverOrder = await prisma.order.create({
      data: {
        userId: ownerId,
        botId: liveBot.id,
        walletId: liveWallet.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.04,
        filledQuantity: 0,
        price: 63000,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        submittedAt: new Date('2026-04-12T11:40:00.000Z'),
        createdAt: new Date('2026-04-12T11:40:00.000Z'),
      },
    });

    const positionsRes = await ownerAgent.get(
      `/dashboard/bots/${liveBot.id}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openOrdersCount).toBe(1);
    expect(
      positionsRes.body.openOrders.some((item: { id: string }) => item.id === carryoverOrder.id)
    ).toBe(true);
    const projectedOrder = positionsRes.body.openOrders.find(
      (item: { id: string; origin?: string }) => item.id === carryoverOrder.id
    );
    expect(projectedOrder?.origin).toBe('EXCHANGE_SYNC');
  });

  it('keeps PAPER open orders visible in runtime view when order was created before current session start', async () => {
    const ownerAgent = await registerAndLogin('runtime-paper-open-order-carryover@example.com');
    const ownerId = await getUserId('runtime-paper-open-order-carryover@example.com');

    const paperWallet = await prisma.wallet.create({
      data: {
        userId: ownerId,
        name: 'Paper order wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10000,
      },
    });

    const paperBot = await prisma.bot.create({
      data: {
        userId: ownerId,
        name: 'Paper orders bot',
        mode: 'PAPER',
        marketType: 'FUTURES',
        isActive: true,
        walletId: paperWallet.id,
        symbolGroupId: (
          await createMarketScope({
            userId: ownerId,
            name: 'Paper carryover scope',
            symbols: ['ETHUSDT'],
          })
        ).id,
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerId,
        botId: paperBot.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-12T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-12T12:02:00.000Z'),
      },
    });

    const carryoverOrder = await prisma.order.create({
      data: {
        userId: ownerId,
        botId: paperBot.id,
        walletId: paperWallet.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.5,
        filledQuantity: 0,
        price: 3000,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        submittedAt: new Date('2026-04-12T11:40:00.000Z'),
        createdAt: new Date('2026-04-12T11:40:00.000Z'),
      },
    });

    const positionsRes = await ownerAgent.get(
      `/dashboard/bots/${paperBot.id}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openOrdersCount).toBe(1);
    expect(
      positionsRes.body.openOrders.some((item: { id: string }) => item.id === carryoverOrder.id)
    ).toBe(true);
    const projectedOrder = positionsRes.body.openOrders.find(
      (item: { id: string; origin?: string }) => item.id === carryoverOrder.id
    );
    expect(projectedOrder?.origin).toBe('BOT');
  });

});


