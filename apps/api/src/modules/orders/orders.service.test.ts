import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  cancelOrder,
  closeOrder,
  getManualOrderContext,
  listOrders,
  openOrder,
  resolveLiveExecutionApiKey,
} from './orders.service';
import { ORDER_ERROR_CODES } from './orders.errors';
import { ensureSubscriptionCatalog } from '../subscriptions/subscriptions.service';
import { SubscriptionEntitlementsSchema } from '../subscriptions/subscriptionEntitlements.service';

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

const createLiveScopedBotContext = async (params: {
  userId: string;
  botName: string;
  strategyName: string;
  symbol: string;
  apiKeyId?: string;
}) => {
  const strategy = await prisma.strategy.create({
    data: {
      userId: params.userId,
      name: params.strategyName,
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
  const wallet = await prisma.wallet.create({
    data: {
      userId: params.userId,
      name: `${params.botName} wallet`,
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    },
  });
  const universe = await prisma.marketUniverse.create({
    data: {
      userId: params.userId,
      name: `${params.botName} universe`,
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      whitelist: [params.symbol],
      blacklist: [],
    },
  });
  const symbolGroup = await prisma.symbolGroup.create({
    data: {
      userId: params.userId,
      marketUniverseId: universe.id,
      name: `${params.botName} symbols`,
      symbols: [params.symbol],
    },
  });
  const bot = await prisma.bot.create({
    data: {
      userId: params.userId,
      name: params.botName,
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      positionMode: 'ONE_WAY',
      apiKeyId: params.apiKeyId ?? null,
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
      maxOpenPositions: 3,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbolGroupId: symbolGroup.id,
    },
  });

  return { bot, strategy, wallet, universe, symbolGroup };
};

const allowLive = async () => {
  await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  const freePlan = await prisma.subscriptionPlan.findUniqueOrThrow({
    where: { code: 'FREE' },
    select: { entitlements: true },
  });
  const entitlements = SubscriptionEntitlementsSchema.parse(freePlan.entitlements);
  await prisma.subscriptionPlan.update({
    where: { code: 'FREE' },
    data: {
      entitlements: {
        ...entitlements,
        features: { ...entitlements.features, liveTrading: true },
      },
    },
  });
};

describe('listOrders active order contract', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('excludes stale local rows from active status lists while preserving history access', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-list-active-sync-state@example.com', password: 'hashed' },
    });

    const activeOpenOrder = await prisma.order.create({
      data: {
        userId: user.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        syncState: 'IN_SYNC',
        quantity: 0.5,
        price: 2500,
        createdAt: new Date('2026-05-04T10:00:00.000Z'),
      },
    });
    const staleOpenOrder = await prisma.order.create({
      data: {
        userId: user.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        quantity: 0.5,
        price: 2400,
        createdAt: new Date('2026-05-04T10:01:00.000Z'),
      },
    });

    const activeOpenOrders = await listOrders(user.id, {
      status: 'OPEN',
      limit: 50,
      page: 1,
    });
    expect(activeOpenOrders.map((order) => order.id)).toEqual([activeOpenOrder.id]);

    const allOrders = await listOrders(user.id, {
      limit: 50,
      page: 1,
    });
    expect(allOrders.map((order) => order.id)).toEqual([
      staleOpenOrder.id,
      activeOpenOrder.id,
    ]);
  });
});

describe('openOrder live execution contract', () => {
  beforeEach(async () => {
    await cleanupDb();
    await allowLive();
  });

  it('does not execute exchange side effects for PAPER mode', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper@example.com', password: 'hashed' },
    });
    const executeLiveOrder = vi.fn();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'MARKET',
          quantity: 0.1,
          price: 43_000,
          mode: 'PAPER',
          riskAck: false,
        },
        { executeLiveOrder }
      );

      expect(executeLiveOrder).not.toHaveBeenCalled();
      expect(order.status).toBe('FILLED');
      expect(order.exchangeOrderId).toBeNull();
      expect(order.positionId).toBeTruthy();
      const openedPosition = await prisma.position.findUnique({
        where: { id: order.positionId ?? '' },
      });
      expect(openedPosition).not.toBeNull();
      expect(openedPosition?.origin).toBe('USER');
      expect(openedPosition?.entryPrice).toBe(43_000);
      const auditLog = await prisma.log.findFirst({
        where: {
          userId: user.id,
          action: 'order.opened',
          entityType: 'ORDER',
          entityId: order.id,
        },
        orderBy: { occurredAt: 'desc' },
      });
      expect(auditLog).not.toBeNull();
      const metadata = (auditLog?.metadata ?? {}) as {
        semanticPath?: string;
        lifecycleContract?: string;
        modeSource?: string;
        waitingForFill?: boolean;
      };
      expect(metadata.semanticPath).toBe('unified_order_fill_position');
      expect(metadata.lifecycleContract).toBe('order->fill->position');
      expect(metadata.modeSource).toBe('request');
      expect(metadata.waitingForFill).toBe(false);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('rejects PAPER MARKET order when canonical fill price cannot be resolved', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-waiting-fill@example.com', password: 'hashed' },
    });
    const executeLiveOrder = vi.fn();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 0.1,
            mode: 'PAPER',
            riskAck: false,
          },
          { executeLiveOrder }
        )
      ).rejects.toMatchObject({
        code: ORDER_ERROR_CODES.paperMarketPriceUnavailable,
      });

      expect(executeLiveOrder).not.toHaveBeenCalled();
      const persistedOrder = await prisma.order.findFirst({
        where: { userId: user.id },
      });
      const openedPosition = await prisma.position.findFirst({
        where: { userId: user.id },
      });
      expect(persistedOrder).toBeNull();
      expect(openedPosition).toBeNull();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fills PAPER MARKET order immediately from canonical manual-context price when bot scope is provided', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-manual-context-fill@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Paper market strategy',
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
        userId: user.id,
        name: 'Paper market universe',
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
        name: 'Paper market symbols',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Paper market bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const executeLiveOrder = vi.fn();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'MARKET',
          quantity: 0.1,
          mode: 'PAPER',
          riskAck: false,
        },
        { executeLiveOrder }
      );

      expect(executeLiveOrder).not.toHaveBeenCalled();
      expect(order.status).toBe('FILLED');
      expect(order.averageFillPrice).toBeTruthy();
      expect(order.positionId).toBeTruthy();
      const openedPosition = await prisma.position.findUnique({
        where: { id: order.positionId ?? '' },
      });
      expect(openedPosition).not.toBeNull();
      expect(openedPosition?.entryPrice).toBe(order.averageFillPrice);
      const auditLog = await prisma.log.findFirst({
        where: {
          userId: user.id,
          action: 'order.opened',
          entityType: 'ORDER',
          entityId: order.id,
        },
        orderBy: { occurredAt: 'desc' },
      });
      const metadata = (auditLog?.metadata ?? {}) as {
        waitingForFill?: boolean;
        fillPriceResolved?: boolean;
      };
      expect(metadata.waitingForFill).toBe(false);
      expect(metadata.fillPriceResolved).toBe(true);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }, 10_000);

  it('opens LIVE orders with active canonical market-group venue when direct bot symbol group is stale', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-canonical-venue@example.com', password: 'hashed' },
    });
    const { bot, strategy, symbolGroup } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live canonical venue bot',
      strategyName: 'Live canonical venue strategy',
      symbol: 'BTCUSDT',
    });
    const staleSpotUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Orders stale spot universe',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const staleSpotGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: staleSpotUniverse.id,
        name: 'Orders stale spot group',
        symbols: ['BTCUSDT'],
      },
    });
    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        symbolGroupId: staleSpotGroup.id,
        marketType: 'SPOT',
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

    const executeLiveOrder = vi.fn(async () => ({
      exchangeOrderId: 'canonical-venue-order',
      status: 'OPEN' as const,
    }));
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'LIMIT',
          quantity: 0.01,
          price: 60_000,
          mode: 'LIVE',
          riskAck: true,
          clientOrderId: 'soar_orders_service_1',
        },
        { executeLiveOrder }
      );

      expect(order.status).toBe('OPEN');
      expect(order.exchangeOrderId).toBe('canonical-venue-order');
      expect(order.strategyId).toBe(strategy.id);
      expect(executeLiveOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          bot: expect.objectContaining({
            id: bot.id,
            marketType: 'FUTURES',
            walletId: expect.any(String),
          }),
          payload: expect.objectContaining({
            mode: 'LIVE',
            strategyId: strategy.id,
            clientOrderId: 'soar_orders_service_1',
          }),
        })
      );
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('reuses and reprices existing same-symbol open position for manual PAPER MARKET add', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-manual-add-existing-position@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Paper add wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Paper add strategy',
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
        userId: user.id,
        name: 'Paper add universe',
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
        name: 'Paper add symbols',
        symbols: ['DOGEUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Paper add bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const existingPosition = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: null,
        strategyId: strategy.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 2,
        leverage: 5,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
    });

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(user.id, {
        botId: bot.id,
        symbol: 'DOGEUSDT',
        side: 'BUY',
        type: 'MARKET',
        quantity: 1,
        price: 130,
        mode: 'PAPER',
        riskAck: false,
      });

      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBe(existingPosition.id);

      const updatedPosition = await prisma.position.findUniqueOrThrow({
        where: { id: existingPosition.id },
      });
      expect(updatedPosition.quantity).toBeCloseTo(3, 10);
      expect(updatedPosition.entryPrice).toBeCloseTo(110, 10);

      const openPositions = await prisma.position.findMany({
        where: {
          userId: user.id,
          symbol: 'DOGEUSDT',
          status: 'OPEN',
        },
      });
      expect(openPositions).toHaveLength(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('keeps PAPER MARKET fill bot-scoped when another bot shares the same wallet and symbol', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-shared-wallet-bot-scope@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Paper shared wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Paper shared wallet strategy',
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
        userId: user.id,
        name: 'Paper shared wallet universe',
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
        name: 'Paper shared wallet symbols',
        symbols: ['DOGEUSDT'],
      },
    });
    const firstBot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Paper shared wallet first bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const secondBot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Paper shared wallet second bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const firstBotPosition = await prisma.position.create({
      data: {
        userId: user.id,
        botId: firstBot.id,
        walletId: wallet.id,
        strategyId: strategy.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 2,
        leverage: 5,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
    });

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(user.id, {
        botId: secondBot.id,
        symbol: 'DOGEUSDT',
        side: 'BUY',
        type: 'MARKET',
        quantity: 1,
        price: 130,
        mode: 'PAPER',
        riskAck: false,
      });

      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBeTruthy();
      expect(order.positionId).not.toBe(firstBotPosition.id);

      const firstPositionAfterFill = await prisma.position.findUniqueOrThrow({
        where: { id: firstBotPosition.id },
      });
      expect(firstPositionAfterFill.quantity).toBe(2);
      expect(firstPositionAfterFill.entryPrice).toBe(100);

      const secondBotPosition = await prisma.position.findUniqueOrThrow({
        where: { id: order.positionId ?? '' },
      });
      expect(secondBotPosition.botId).toBe(secondBot.id);
      expect(secondBotPosition.walletId).toBeNull();
      expect(secondBotPosition.side).toBe('LONG');
      expect(secondBotPosition.quantity).toBe(1);
      expect(secondBotPosition.entryPrice).toBe(130);

      const openPositions = await prisma.position.findMany({
        where: {
          userId: user.id,
          symbol: 'DOGEUSDT',
          status: 'OPEN',
          OR: [{ walletId: wallet.id }, { bot: { walletId: wallet.id } }],
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(openPositions.map((position) => position.botId)).toEqual([
        firstBot.id,
        secondBot.id,
      ]);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fails closed when manual open tries to reverse an already open symbol direction', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-manual-reverse-conflict@example.com', password: 'hashed' },
    });
    await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 2,
      },
    });

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(user.id, {
          symbol: 'DOGEUSDT',
          side: 'SELL',
          type: 'MARKET',
          quantity: 1,
          price: 90,
          mode: 'PAPER',
          riskAck: false,
        })
      ).rejects.toMatchObject({
        code: ORDER_ERROR_CODES.openPositionSideConflict,
      });
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('ignores stale local positions when checking manual reverse conflicts', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-manual-stale-reverse-conflict@example.com', password: 'hashed' },
    });
    await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        entryPrice: 100,
        quantity: 2,
      },
    });

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(user.id, {
        symbol: 'DOGEUSDT',
        side: 'SELL',
        type: 'LIMIT',
        quantity: 1,
        price: 90,
        mode: 'PAPER',
        riskAck: false,
      });

      expect(order.status).toBe('OPEN');
      expect(order.positionId).toBeNull();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('releases stale local blockers before PAPER MARKET fill creates a new position', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-stale-blocker-release@example.com', password: 'hashed' },
    });
    const staleLocalPosition = await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        entryPrice: 100,
        quantity: 2,
      },
    });

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(user.id, {
        symbol: 'DOGEUSDT',
        side: 'SELL',
        type: 'MARKET',
        quantity: 1,
        price: 90,
        mode: 'PAPER',
        riskAck: false,
      });

      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBeTruthy();

      const createdPosition = await prisma.position.findUniqueOrThrow({
        where: { id: order.positionId ?? '' },
      });
      expect(createdPosition.side).toBe('SHORT');
      expect(createdPosition.status).toBe('OPEN');
      expect(createdPosition.syncState).toBe('IN_SYNC');

      const repairedStalePosition = await prisma.position.findUniqueOrThrow({
        where: { id: staleLocalPosition.id },
      });
      expect(repairedStalePosition.status).toBe('CLOSED');
      expect(repairedStalePosition.syncState).toBe('ORPHAN_LOCAL');
      expect(repairedStalePosition.continuityState).toBe('REPAIR_ONLY_CLEANUP');
      expect(repairedStalePosition.closeReason).toBe('SYSTEM_REPAIR');
      expect(repairedStalePosition.closeInitiator).toBe('SYSTEM_REPAIR');
      expect(repairedStalePosition.unrealizedPnl).toBe(0);
      expect(repairedStalePosition.closedAt).toBeTruthy();

      const openPositions = await prisma.position.findMany({
        where: {
          userId: user.id,
          symbol: 'DOGEUSDT',
          status: 'OPEN',
        },
      });
      expect(openPositions.map((position) => position.id)).toEqual([createdPosition.id]);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fails closed when manual LIVE open reverses an owned imported exchange position', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-owned-import-reverse-conflict@example.com', password: 'hashed' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Owned import key',
        exchange: 'BINANCE',
        apiKey: 'owned_import_key',
        apiSecret: 'owned_import_secret',
      },
    });
    const { bot, wallet, strategy } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Owned import live bot',
      strategyName: 'Owned import live strategy',
      symbol: 'DOGEUSDT',
    });
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { apiKeyId: apiKey.id },
    });
    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        apiKeyId: null,
        manageExternalPositions: true,
      },
    });
    await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        strategyId: strategy.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        leverage: 5,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        externalId: `${apiKey.id}:DOGEUSDT:LONG`,
      },
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'should-not-submit',
      status: 'OPEN' as const,
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            botId: bot.id,
            symbol: 'DOGEUSDT',
            side: 'SELL',
            type: 'LIMIT',
            quantity: 100,
            price: 0.09,
            mode: 'LIVE',
            riskAck: true,
          },
          { executeLiveOrder }
        )
      ).rejects.toMatchObject({
        code: ORDER_ERROR_CODES.openPositionSideConflict,
      });
      expect(executeLiveOrder).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('ignores stale owned imported positions when checking LIVE reverse conflicts', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-owned-import-stale-reverse-conflict@example.com', password: 'hashed' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Stale owned import key',
        exchange: 'BINANCE',
        apiKey: 'stale_owned_import_key',
        apiSecret: 'stale_owned_import_secret',
      },
    });
    const { bot, wallet, strategy } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Stale owned import live bot',
      strategyName: 'Stale owned import live strategy',
      symbol: 'DOGEUSDT',
    });
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { apiKeyId: apiKey.id },
    });
    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        apiKeyId: null,
        manageExternalPositions: true,
      },
    });
    await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        strategyId: strategy.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        leverage: 5,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        externalId: `${apiKey.id}:DOGEUSDT:LONG`,
      },
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'live-stale-import-sell',
      status: 'OPEN' as const,
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'DOGEUSDT',
          side: 'SELL',
          type: 'LIMIT',
          quantity: 10,
          price: 0.09,
          mode: 'LIVE',
          riskAck: true,
        },
        { executeLiveOrder }
      );

      expect(order.exchangeOrderId).toBe('live-stale-import-sell');
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('reuses owned imported LIVE position when a same-side manual fill confirms', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-owned-import-fill-reuse@example.com', password: 'hashed' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Owned import fill key',
        exchange: 'BINANCE',
        apiKey: 'owned_import_fill_key',
        apiSecret: 'owned_import_fill_secret',
      },
    });
    const { bot, wallet, strategy } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Owned import fill live bot',
      strategyName: 'Owned import fill live strategy',
      symbol: 'DOGEUSDT',
    });
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { apiKeyId: apiKey.id },
    });
    await prisma.bot.update({
      where: { id: bot.id },
      data: {
        apiKeyId: null,
        manageExternalPositions: true,
      },
    });
    const importedPosition = await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        strategyId: strategy.id,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        leverage: 5,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        externalId: `${apiKey.id}:DOGEUSDT:LONG`,
      },
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'owned-import-fill-order',
      status: 'FILLED' as const,
      fills: [
        {
          exchangeTradeId: 'owned-import-fill-trade',
          exchangeOrderId: 'owned-import-fill-order',
          symbol: 'DOGEUSDT',
          side: 'buy',
          price: 0.2,
          quantity: 50,
          notional: 10,
          feeCost: 0.01,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: new Date('2026-05-03T12:00:00.000Z'),
          raw: {},
        },
      ],
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'DOGEUSDT',
          side: 'BUY',
          type: 'MARKET',
          quantity: 50,
          price: 0.2,
          mode: 'LIVE',
          riskAck: true,
        },
        { executeLiveOrder }
      );

      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBe(importedPosition.id);

      const openPositions = await prisma.position.findMany({
        where: {
          userId: user.id,
          symbol: 'DOGEUSDT',
          status: 'OPEN',
        },
      });
      expect(openPositions).toHaveLength(1);
      expect(openPositions[0]?.id).toBe(importedPosition.id);
      expect(openPositions[0]?.quantity).toBeCloseTo(150, 10);
      expect(openPositions[0]?.entryPrice).toBeCloseTo(0.1333333333, 10);

      const fill = await prisma.orderFill.findFirstOrThrow({
        where: { orderId: order.id },
      });
      expect(fill.positionId).toBe(importedPosition.id);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('allows manual open when the same symbol is already open on a different wallet scope', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-wallet-scoped-open@example.com', password: 'hashed' },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live scoped wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    await prisma.position.create({
      data: {
        userId: user.id,
        walletId: liveWallet.id,
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 50,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
    });
    const paperWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Paper scoped wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Paper scoped strategy',
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
        userId: user.id,
        name: 'Scoped universe',
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
        name: 'Scoped symbols',
        symbols: ['DOGEUSDT'],
      },
    });
    const paperBot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Paper scoped bot',
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

    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(user.id, {
        botId: paperBot.id,
        symbol: 'DOGEUSDT',
        side: 'BUY',
        type: 'MARKET',
        quantity: 100,
        price: 0.09,
        mode: 'PAPER',
        riskAck: false,
      });

      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBeTruthy();

      const openPositions = await prisma.position.findMany({
        where: {
          userId: user.id,
          symbol: 'DOGEUSDT',
          status: 'OPEN',
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(openPositions).toHaveLength(2);
      expect(openPositions.map((position) => position.walletId)).toEqual([
        liveWallet.id,
        null,
      ]);
      expect(openPositions.map((position) => position.side)).toEqual(['SHORT', 'LONG']);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('derives mode, wallet and strategy from canonical bot context when botId is provided', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-canonical-context@example.com', password: 'hashed' },
    });
    const strategyCanonical = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Canonical strategy',
        interval: '1m',
        leverage: 5,
        walletRisk: 1,
        config: { additional: {} },
      },
    });
    const strategySpoofed = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Spoofed strategy',
        interval: '5m',
        leverage: 3,
        walletRisk: 1,
        config: { additional: {} },
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const spoofedWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Spoofed wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Canonical market universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const group = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Canonical symbol group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Canonical live bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: liveWallet.id,
        strategyId: strategyCanonical.id,
        symbolGroupId: group.id,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: group.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: user.id,
        botId: bot.id,
        botMarketGroupId: botGroup.id,
        strategyId: strategyCanonical.id,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'binance-order-canonical-1',
      status: 'OPEN' as const,
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          walletId: spoofedWallet.id,
          strategyId: strategySpoofed.id,
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'LIMIT',
          quantity: 0.2,
          price: 60000,
          mode: 'PAPER',
          riskAck: true,
        },
        { executeLiveOrder }
      );

      expect(executeLiveOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            mode: 'LIVE',
            walletId: liveWallet.id,
            strategyId: strategyCanonical.id,
          }),
        })
      );
      expect(order.walletId).toBe(liveWallet.id);
      expect(order.strategyId).toBe(strategyCanonical.id);
      expect(order.walletId).not.toBe(spoofedWallet.id);
      expect(order.strategyId).not.toBe(strategySpoofed.id);
      expect(order.status).toBe('OPEN');
      expect(order.positionId).toBeNull();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('executes exchange order for LIVE but waits for fill truth before lifecycle finality', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'orders-live@example.com',
        password: 'hashed',
        apiKeys: {
          create: {
            label: 'Binance Live Key',
            exchange: 'BINANCE',
            apiKey: 'encrypted_key',
            apiSecret: 'encrypted_secret',
          },
        },
      },
      include: {
        apiKeys: {
          select: {
            id: true,
          },
        },
      },
    });
    const apiKeyId = user.apiKeys[0]?.id;
    expect(apiKeyId).toBeTruthy();
    const { bot } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live Bot',
      strategyName: 'Live Bot Strategy',
      symbol: 'ETHUSDT',
      apiKeyId,
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'binance-order-123',
      status: 'FILLED' as const,
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'ETHUSDT',
          side: 'SELL',
          type: 'LIMIT',
          quantity: 2,
          price: 3200,
          mode: 'LIVE',
          riskAck: true,
        },
        { executeLiveOrder }
      );

      expect(executeLiveOrder).toHaveBeenCalledOnce();
      expect(executeLiveOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          bot: expect.objectContaining({
            id: bot.id,
            exchange: 'BINANCE',
            apiKeyId,
          }),
        })
      );
      expect(order.exchangeOrderId).toBe('binance-order-123');
      expect(order.status).toBe('OPEN');
      expect(order.filledQuantity).toBe(0);
      expect(order.filledAt).toBeNull();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-market-submitted@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live Market Submitted Bot',
      strategyName: 'Live Market Submitted Strategy',
      symbol: 'BTCUSDT',
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'binance-market-submitted-1',
      status: 'OPEN' as const,
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'MARKET',
          quantity: 0.15,
          mode: 'LIVE',
          riskAck: true,
        },
        { executeLiveOrder }
      );

      expect(executeLiveOrder).toHaveBeenCalledOnce();
      expect(order.exchangeOrderId).toBe('binance-market-submitted-1');
      expect(order.status).toBe('OPEN');
      expect(order.positionId).toBeNull();
      expect(order.filledQuantity).toBe(0);
      expect(order.filledAt).toBeNull();

      const openedPosition = await prisma.position.findFirst({
        where: { userId: user.id },
      });
      expect(openedPosition).toBeNull();

      const auditLog = await prisma.log.findFirst({
        where: {
          userId: user.id,
          action: 'order.opened',
          entityType: 'ORDER',
          entityId: order.id,
        },
        orderBy: { occurredAt: 'desc' },
      });
      const metadata = (auditLog?.metadata ?? {}) as {
        waitingForFill?: boolean;
        fillPriceResolved?: boolean;
      };
      expect(metadata.waitingForFill).toBe(true);
      expect(metadata.fillPriceResolved).toBe(false);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fails closed for LIVE order when requested symbol is outside canonical bot strategy scope', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-scope-mismatch@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Live scoped strategy',
        interval: '5m',
        leverage: 7,
        walletRisk: 1,
        config: { additional: { orderType: 'MARKET', marginMode: 'ISOLATED' } },
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live scope wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Live scope universe',
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
        name: 'Live scope symbols',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Live scope bot',
        mode: 'LIVE',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });

    const executeLiveOrder = vi.fn();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            botId: bot.id,
            symbol: 'ETHUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 0.1,
            mode: 'LIVE',
            riskAck: true,
          },
          { executeLiveOrder }
        )
      ).rejects.toMatchObject({ code: 'LIVE_MANUAL_SCOPE_UNRESOLVED' });

      expect(executeLiveOrder).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fails closed for LIVE order when canonical symbol scope has multiple enabled strategies', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-manual-scope-ambiguous@example.com', password: 'hashed' },
    });
    const primaryStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Live ambiguous primary strategy',
        interval: '5m',
        leverage: 7,
        walletRisk: 1,
        config: { additional: { orderType: 'MARKET', marginMode: 'ISOLATED' } },
      },
    });
    const secondaryStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Live ambiguous secondary strategy',
        interval: '15m',
        leverage: 3,
        walletRisk: 1,
        config: { additional: { orderType: 'LIMIT', marginMode: 'CROSSED' } },
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live ambiguous wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Live ambiguous universe',
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
        name: 'Live ambiguous symbols',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Live ambiguous bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: primaryStrategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.createMany({
      data: [
        {
          userId: user.id,
          botId: bot.id,
          botMarketGroupId: botGroup.id,
          strategyId: primaryStrategy.id,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
        {
          userId: user.id,
          botId: bot.id,
          botMarketGroupId: botGroup.id,
          strategyId: secondaryStrategy.id,
          priority: 2,
          weight: 1,
          isEnabled: true,
        },
      ],
    });

    const executeLiveOrder = vi.fn();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            botId: bot.id,
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 0.1,
            mode: 'LIVE',
            riskAck: true,
          },
          { executeLiveOrder }
        )
      ).rejects.toMatchObject({ code: 'LIVE_MANUAL_SCOPE_UNRESOLVED' });

      expect(executeLiveOrder).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fails closed for LIVE order when wallet and market-universe venue context drift', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-context-mismatch@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Live context strategy',
        interval: '5m',
        leverage: 4,
        walletRisk: 1,
        config: { additional: { orderType: 'MARKET', marginMode: 'ISOLATED' } },
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live mismatch wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Live mismatch universe',
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
        name: 'Live mismatch symbols',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Live mismatch bot',
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

    const executeLiveOrder = vi.fn();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            botId: bot.id,
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 0.1,
            mode: 'LIVE',
            riskAck: true,
          },
          { executeLiveOrder }
        )
      ).rejects.toMatchObject({ code: 'LIVE_BOT_CONTEXT_MISMATCH' });

      expect(executeLiveOrder).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('persists live fee metadata and order fills returned by adapter', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-fees@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live Bot Fees',
      strategyName: 'Live Bot Fees Strategy',
      symbol: 'ETHUSDT',
    });

    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'binance-order-fee-1',
      status: 'FILLED' as const,
      exchangeTradeId: 'binance-trade-fee-1',
      fee: 2.5,
      feeSource: 'EXCHANGE_FILL' as const,
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.001,
      fills: [
        {
          exchangeTradeId: 'binance-fill-1',
          exchangeOrderId: 'binance-order-fee-1',
          symbol: 'ETHUSDT',
          side: 'sell',
          price: 3200,
          quantity: 2,
          notional: 6400,
          feeCost: 2.5,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: new Date('2026-04-03T10:00:00.000Z'),
          source: 'fetchMyTrades',
          raw: { provider: 'binance' },
        },
      ],
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const order = await openOrder(
        user.id,
        {
          botId: bot.id,
          symbol: 'ETHUSDT',
          side: 'SELL',
          type: 'LIMIT',
          quantity: 2,
          price: 3200,
          mode: 'LIVE',
          riskAck: true,
        },
        { executeLiveOrder }
      );

      expect(order.exchangeOrderId).toBe('binance-order-fee-1');
      expect(order.exchangeTradeId).toBe('binance-trade-fee-1');
      expect(order.fee).toBe(2.5);
      expect(order.feeSource).toBe('EXCHANGE_FILL');
      expect(order.feePending).toBe(false);
      expect(order.feeCurrency).toBe('USDT');
      expect(order.effectiveFeeRate).toBeCloseTo(0.001, 10);

      const fills = await prisma.orderFill.findMany({
        where: {
          orderId: order.id,
        },
      });
      expect(fills).toHaveLength(1);
      expect(fills[0]?.exchangeTradeId).toBe('binance-fill-1');
      expect(fills[0]?.feeCost).toBe(2.5);
      expect(fills[0]?.feeCurrency).toBe('USDT');
      expect(fills[0]?.feeRate).toBeCloseTo(0.001, 10);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('propagates LIVE execution error', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-fail@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live Bot Fail',
      strategyName: 'Live Bot Fail Strategy',
      symbol: 'SOLUSDT',
    });

    const executeLiveOrder = vi.fn().mockRejectedValue(new Error('LIVE_EXECUTION_FAILED'));
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            botId: bot.id,
            symbol: 'SOLUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 10,
            mode: 'LIVE',
            riskAck: true,
          },
          { executeLiveOrder }
        )
      ).rejects.toThrow('LIVE_EXECUTION_FAILED');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('propagates LIVE pretrade guard errors without masking', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live-pretrade@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live Bot Pretrade',
      strategyName: 'Live Bot Pretrade Strategy',
      symbol: 'BNBUSDT',
    });

    const executeLiveOrder = vi
      .fn()
      .mockRejectedValue(new Error('LIVE_PRETRADE_EXTERNAL_POSITION_OPEN'));
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      await expect(
        openOrder(
          user.id,
          {
            botId: bot.id,
            symbol: 'BNBUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 1,
            mode: 'LIVE',
            riskAck: true,
          },
          { executeLiveOrder }
        )
      ).rejects.toThrow('LIVE_PRETRADE_EXTERNAL_POSITION_OPEN');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });
});

describe('getManualOrderContext', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('falls back to MARKET order type when strategy config orderType is unresolved', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-fallback@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Fallback strategy',
        description: null,
        interval: '5m',
        leverage: 7,
        walletRisk: 2,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'UNKNOWN',
          },
        },
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
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
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Manual context group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
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
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
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

    const context = await getManualOrderContext(
      user.id,
      {
        botId: bot.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
      },
      {
        createPublicConnector: () => ({
          getSymbolTradingRules: async () => ({
            minAmount: 0.001,
            minNotional: 100,
            amountPrecision: 0.001,
          }),
          fetchMarkPrice: async () => 25_000,
          disconnect: async () => undefined,
        }),
      }
    );

    expect(context).not.toBeNull();
    expect(context?.orderType).toBe('MARKET');
    expect(context?.marginMode).toBe('ISOLATED');
    expect(context?.leverage).toBe(7);
  });

  it('prefers canonical bot market group strategy over stale direct projections', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-canonical-first@example.com', password: 'hashed' },
    });
    const canonicalStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Canonical manual order strategy',
        description: null,
        interval: '5m',
        leverage: 12,
        walletRisk: 2,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'LIMIT',
          },
        },
      },
    });
    const staleStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Stale direct manual order strategy',
        description: null,
        interval: '1m',
        leverage: 3,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'CROSSED',
            orderType: 'MARKET',
          },
        },
      },
    });
    const canonicalUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Canonical manual order universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['DOGEUSDT'],
        blacklist: [],
      },
    });
    const staleUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Stale direct manual order universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['ETHUSDT'],
        blacklist: [],
      },
    });
    const canonicalSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: canonicalUniverse.id,
        name: 'Canonical manual order group',
        symbols: ['DOGEUSDT'],
      },
    });
    const staleSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: staleUniverse.id,
        name: 'Stale direct manual order group',
        symbols: ['ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Canonical-first manual context bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        positionMode: 'ONE_WAY',
        strategyId: staleStrategy.id,
        symbolGroupId: staleSymbolGroup.id,
        isActive: true,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
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
        userId: user.id,
        botId: bot.id,
        botMarketGroupId: botGroup.id,
        strategyId: canonicalStrategy.id,
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
      }),
      fetchMarkPrice: async () => 0.1,
      disconnect: async () => undefined,
    }));
    const context = await getManualOrderContext(
      user.id,
      {
        botId: bot.id,
        symbol: 'DOGEUSDT',
        side: 'BUY',
      },
      {
        createPublicConnector: connectorFactory,
      }
    );

    expect(context).not.toBeNull();
    expect(context?.symbol).toBe('DOGEUSDT');
    expect(context?.orderType).toBe('LIMIT');
    expect(context?.marginMode).toBe('ISOLATED');
    expect(context?.leverage).toBe(12);
    expect(connectorFactory).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
  });

  it('fails closed when selected bot has no strategy matching requested symbol', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-no-symbol-match@example.com', password: 'hashed' },
    });
    const canonicalStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Canonical non-match strategy',
        description: null,
        interval: '5m',
        leverage: 12,
        walletRisk: 1,
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
        userId: user.id,
        name: 'Legacy non-match strategy',
        description: null,
        interval: '15m',
        leverage: 8,
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
        userId: user.id,
        name: 'Manual context canonical non-match universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['ETHUSDT'],
        blacklist: [],
      },
    });
    const legacyUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Manual context legacy non-match universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['SOLUSDT'],
        blacklist: [],
      },
    });
    const canonicalSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: canonicalUniverse.id,
        name: 'Manual context canonical non-match group',
        symbols: ['ETHUSDT'],
      },
    });
    const legacySymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: legacyUniverse.id,
        name: 'Manual context legacy non-match group',
        symbols: ['SOLUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Manual context no symbol match bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
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
        userId: user.id,
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

    const context = await getManualOrderContext(
      user.id,
      {
        botId: bot.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
      },
      {
        createPublicConnector: () => ({
          getSymbolTradingRules: async () => ({
            minAmount: 0.001,
            minNotional: 100,
            amountPrecision: 0.001,
          }),
          fetchMarkPrice: async () => 25_000,
          disconnect: async () => undefined,
        }),
      }
    );

    expect(context).not.toBeNull();
    expect(context?.orderType).toBe('MARKET');
    expect(context?.marginMode).toBe('CROSSED');
    expect(context?.leverage).toBe(1);
  });

  it('does not fall back to stale direct strategy for manual context when canonical groups exist', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-no-direct-fallback@example.com', password: 'hashed' },
    });
    const canonicalStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Canonical direct fallback guard strategy',
        description: null,
        interval: '5m',
        leverage: 12,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'ISOLATED',
            orderType: 'LIMIT',
          },
        },
      },
    });
    const staleDirectStrategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Stale direct fallback guard strategy',
        description: null,
        interval: '15m',
        leverage: 8,
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
        userId: user.id,
        name: 'Manual context direct fallback canonical universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['ETHUSDT'],
        blacklist: [],
      },
    });
    const staleUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Manual context direct fallback stale universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['SOLUSDT'],
        blacklist: [],
      },
    });
    const canonicalSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: canonicalUniverse.id,
        name: 'Manual context direct fallback canonical group',
        symbols: ['ETHUSDT'],
      },
    });
    const staleSymbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: staleUniverse.id,
        name: 'Manual context direct fallback stale group',
        symbols: ['SOLUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Manual context direct fallback guard bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        strategyId: staleDirectStrategy.id,
        symbolGroupId: staleSymbolGroup.id,
        isActive: true,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
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
        userId: user.id,
        botId: bot.id,
        botMarketGroupId: botGroup.id,
        strategyId: canonicalStrategy.id,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });

    const context = await getManualOrderContext(
      user.id,
      {
        botId: bot.id,
        symbol: 'SOLUSDT',
        side: 'BUY',
      },
      {
        createPublicConnector: () => ({
          getSymbolTradingRules: async () => ({
            minAmount: 0.001,
            minNotional: 100,
            amountPrecision: 0.001,
          }),
          fetchMarkPrice: async () => 100,
          disconnect: async () => undefined,
        }),
      }
    );

    expect(context).not.toBeNull();
    expect(context?.orderType).toBe('MARKET');
    expect(context?.marginMode).toBe('CROSSED');
    expect(context?.leverage).toBe(1);
  });

  it('derives min executable quantity from minAmount/minNotional and precision', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-minqty@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Min qty strategy',
        description: null,
        interval: '15m',
        leverage: 5,
        walletRisk: 1,
        config: {
          additional: {
            marginMode: 'CROSSED',
            orderType: 'LIMIT',
          },
        },
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Min qty universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['ETHUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Min qty group',
        symbols: ['ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Min qty bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
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

    const context = await getManualOrderContext(
      user.id,
      {
        botId: bot.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
      },
      {
        createPublicConnector: () => ({
          getSymbolTradingRules: async () => ({
            minAmount: 0.0031,
            minNotional: 100,
            amountPrecision: 0.001,
          }),
          fetchMarkPrice: async () => 27_000,
          disconnect: async () => undefined,
        }),
      }
    );

    expect(context).not.toBeNull();
    expect(context?.orderType).toBe('LIMIT');
    expect(context?.quantityConstraints.minExecutableQty).toBe(0.004);
  });

  it('returns stable response when rules and mark price cannot be fetched', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-manual-context-degraded@example.com', password: 'hashed' },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Degraded strategy',
        description: null,
        interval: '5m',
        leverage: 3,
        walletRisk: 1,
        config: { additional: { marginMode: 'CROSSED', orderType: 'MARKET' } },
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Degraded universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['SOLUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Degraded group',
        symbols: ['SOLUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Degraded bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });
    const botGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
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

    const context = await getManualOrderContext(
      user.id,
      {
        botId: bot.id,
        symbol: 'SOLUSDT',
        side: 'SELL',
      },
      {
        createPublicConnector: () => ({
          getSymbolTradingRules: async () => {
            throw new Error('rules unavailable');
          },
          fetchMarkPrice: async () => {
            throw new Error('price unavailable');
          },
          disconnect: async () => undefined,
        }),
      }
    );

    expect(context).not.toBeNull();
    expect(context?.priceReference.markPrice).toBeNull();
    expect(context?.quantityConstraints.minAmount).toBeNull();
    expect(context?.quantityConstraints.minNotional).toBeNull();
    expect(context?.quantityConstraints.minExecutableQty).toBeNull();
  });
});

describe('closeOrder close attribution', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('persists USER_APP manual close attribution on both order and linked position', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-close-attribution@example.com', password: 'hashed' },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 62_000,
        quantity: 0.1,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        positionId: position.id,
        origin: 'USER',
        managementMode: 'MANUAL_MANAGED',
        symbol: 'BTCUSDT',
        side: 'SELL',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.1,
      },
    });

    const result = await closeOrder(user.id, order.id, { riskAck: true });

    expect(result).not.toBeNull();
    expect(result?.closeReason).toBe('MANUAL');
    expect(result?.closeInitiator).toBe('USER_APP');

    const closedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(closedOrder.closeReason).toBe('MANUAL');
    expect(closedOrder.closeInitiator).toBe('USER_APP');

    const closedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(closedPosition.status).toBe('CLOSED');
    expect(closedPosition.closeReason).toBe('MANUAL');
    expect(closedPosition.closeInitiator).toBe('USER_APP');
  });
});

describe('manual order action active sync-state contract', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('does not cancel stale local open-status orders', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-stale-cancel@example.com', password: 'hashed' },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.5,
        price: 2400,
      },
    });

    await expect(cancelOrder(user.id, order.id, { riskAck: true })).rejects.toMatchObject({
      code: ORDER_ERROR_CODES.orderNotCancelable,
    });

    const unchangedOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(unchangedOrder.status).toBe('OPEN');
    expect(unchangedOrder.canceledAt).toBeNull();
  });

  it('does not locally cancel exchange-backed open orders without exchange cancel support', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-cancel-exchange-backed@example.com', password: 'hashed' },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        origin: 'USER',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.5,
        price: 2400,
        exchangeOrderId: 'binance-open-order-1',
      },
    });

    await expect(cancelOrder(user.id, order.id, { riskAck: true })).rejects.toMatchObject({
      code: ORDER_ERROR_CODES.liveOrderCancelUnsupported,
    });

    const unchangedOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(unchangedOrder.status).toBe('OPEN');
    expect(unchangedOrder.canceledAt).toBeNull();
  });

  it('does not close stale local open-status orders or linked positions', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-stale-close@example.com', password: 'hashed' },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 2400,
        quantity: 0.5,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        positionId: position.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        symbol: 'ETHUSDT',
        side: 'SELL',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.5,
        price: 2450,
      },
    });

    await expect(closeOrder(user.id, order.id, { riskAck: true })).rejects.toMatchObject({
      code: ORDER_ERROR_CODES.orderNotClosable,
    });

    const unchangedOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(unchangedOrder.status).toBe('OPEN');
    expect(unchangedOrder.filledAt).toBeNull();
    const unchangedPosition = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
    expect(unchangedPosition.status).toBe('OPEN');
  });

  it('does not locally close exchange-backed open orders as filled', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-close-exchange-backed@example.com', password: 'hashed' },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        origin: 'USER',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.5,
        price: 2400,
        exchangeOrderId: 'binance-open-order-2',
      },
    });

    await expect(closeOrder(user.id, order.id, { riskAck: true })).rejects.toMatchObject({
      code: ORDER_ERROR_CODES.orderNotClosable,
    });

    const unchangedOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(unchangedOrder.status).toBe('OPEN');
    expect(unchangedOrder.filledAt).toBeNull();
    expect(unchangedOrder.filledQuantity).toBe(0);
  });

  it('does not close a stale local linked position from a synced open order', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-synced-order-stale-linked-position@example.com', password: 'hashed' },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        entryPrice: 2400,
        quantity: 0.5,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        positionId: position.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'ETHUSDT',
        side: 'SELL',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.5,
        price: 2450,
      },
    });

    const result = await closeOrder(user.id, order.id, { riskAck: true });

    expect(result?.status).toBe('FILLED');
    const unchangedPosition = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
    expect(unchangedPosition.status).toBe('OPEN');
    expect(unchangedPosition.syncState).toBe('ORPHAN_LOCAL');
    expect(unchangedPosition.closedAt).toBeNull();
    expect(unchangedPosition.closeReason).toBeNull();
    expect(unchangedPosition.closeInitiator).toBeNull();
  });
});

describe('resolveLiveExecutionApiKey', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('uses bot-bound API key when ownership and exchange match bot context', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-resolver-bound@example.com', password: 'hashed' },
    });
    const key = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Bound key',
        exchange: 'BINANCE',
        apiKey: 'bound_key',
        apiSecret: 'bound_secret',
      },
    });

    const resolved = await resolveLiveExecutionApiKey({
      userId: user.id,
      bot: {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        apiKeyId: key.id,
        walletId: null,
      },
    });

    expect(resolved.id).toBe(key.id);
  });

  it('uses wallet-bound API key when bot-bound key is missing', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-resolver-wallet@example.com', password: 'hashed' },
    });
    const walletKey = await prisma.apiKey.create({
      data: {
        label: 'Wallet key',
        exchange: 'BINANCE',
        apiKey: 'wallet_binance_key',
        apiSecret: 'wallet_binance_secret',
        userId: user.id,
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: walletKey.id,
      },
    });

    const resolved = await resolveLiveExecutionApiKey({
      userId: user.id,
      bot: {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        apiKeyId: null,
        walletId: wallet.id,
      },
    });

    expect(resolved.id).toBe(walletKey.id);
    expect(resolved.exchange).toBe('BINANCE');
  });

  it('fails closed when no canonically bound API key exists for bot exchange', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-resolver-missing@example.com', password: 'hashed' },
    });
    const mismatch = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Only BYBIT key',
        exchange: 'BYBIT',
        apiKey: 'bybit_only',
        apiSecret: 'bybit_only_secret',
      },
    });

    await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Unbound binance key',
        exchange: 'BINANCE',
        apiKey: 'binance_unbound',
        apiSecret: 'binance_unbound_secret',
      },
    });

    await expect(
      resolveLiveExecutionApiKey({
        userId: user.id,
        bot: {
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          apiKeyId: mismatch.id,
          walletId: null,
        },
      })
    ).rejects.toThrow('LIVE_API_KEY_REQUIRED');
  });
});


