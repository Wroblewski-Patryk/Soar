import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { closeOrder, getManualOrderContext, openOrder, resolveLiveExecutionApiKey } from './orders.service';
import { ORDER_ERROR_CODES } from './orders.errors';

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

describe('openOrder live execution contract', () => {
  beforeEach(async () => {
    await cleanupDb();
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
        paperWallet.id,
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

  it('executes exchange order for LIVE and persists exchangeOrderId/status', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-live@example.com', password: 'hashed' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Binance Live Key',
        exchange: 'BINANCE',
        apiKey: 'encrypted_key',
        apiSecret: 'encrypted_secret',
      },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id,
      botName: 'Live Bot',
      strategyName: 'Live Bot Strategy',
      symbol: 'ETHUSDT',
      apiKeyId: apiKey.id,
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
            apiKeyId: apiKey.id,
          }),
        })
      );
      expect(order.exchangeOrderId).toBe('binance-order-123');
      expect(order.status).toBe('FILLED');
      expect(order.filledQuantity).toBe(2);
      expect(order.filledAt).not.toBeNull();
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
          apiKeyId: mismatch.id,
          walletId: null,
        },
      })
    ).rejects.toThrow('LIVE_API_KEY_REQUIRED');
  });
});


