import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { openOrder } from './orders.service';
import { ORDER_ERROR_CODES } from './orders.errors';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestContribution.deleteMany();
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

const createPaperManualContextBot = async (userId: string) => {
  const strategy = await prisma.strategy.create({
    data: {
      userId,
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
      userId,
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
      userId,
      marketUniverseId: universe.id,
      name: 'Paper market symbols',
      symbols: ['BTCUSDT'],
    },
  });
  return prisma.bot.create({
    data: {
      userId,
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
};

describe('PAPER MARKET fill price resolution', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('fills PAPER MARKET order immediately from canonical manual-context price when bot scope is provided', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-manual-context-fill@example.com', password: 'hashed' },
    });
    const bot = await createPaperManualContextBot(user.id);
    const executeLiveOrder = vi.fn();
    const fetchMarkPrice = vi.fn(async () => 25_000);
    const createPublicConnector = vi.fn(() => ({
      getSymbolTradingRules: async () => ({
        minAmount: 0.001,
        minNotional: 100,
        amountPrecision: 0.001,
      }),
      fetchMarkPrice,
      disconnect: async () => undefined,
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
          type: 'MARKET',
          quantity: 0.1,
          mode: 'PAPER',
          riskAck: false,
        },
        { executeLiveOrder, manualOrderContextDeps: { createPublicConnector } }
      );

      expect(executeLiveOrder).not.toHaveBeenCalled();
      expect(createPublicConnector).toHaveBeenCalledWith({ exchange: 'BINANCE', marketType: 'FUTURES' });
      expect(fetchMarkPrice).toHaveBeenCalledWith('BTCUSDT');
      expect(order.status).toBe('FILLED');
      expect(order.averageFillPrice).toBe(25_000);
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

  it('does not persist a bot-scoped PAPER MARKET order when the public price is unavailable', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-paper-manual-context-no-price@example.com', password: 'hashed' },
    });
    const bot = await createPaperManualContextBot(user.id);
    const executeLiveOrder = vi.fn();
    const fetchMarkPrice = vi.fn(async () => Number.NaN);
    const createPublicConnector = vi.fn(() => ({
      getSymbolTradingRules: async () => ({
        minAmount: 0.001,
        minNotional: 100,
        amountPrecision: 0.001,
      }),
      fetchMarkPrice,
      disconnect: async () => undefined,
    }));
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
            mode: 'PAPER',
            riskAck: false,
          },
          { executeLiveOrder, manualOrderContextDeps: { createPublicConnector } }
        )
      ).rejects.toMatchObject({ code: ORDER_ERROR_CODES.paperMarketPriceUnavailable });

      expect(createPublicConnector).toHaveBeenCalledWith({ exchange: 'BINANCE', marketType: 'FUTURES' });
      expect(fetchMarkPrice).toHaveBeenCalledWith('BTCUSDT');
      expect(executeLiveOrder).not.toHaveBeenCalled();
      expect(await prisma.order.count({ where: { userId: user.id } })).toBe(0);
      expect(await prisma.position.count({ where: { userId: user.id } })).toBe(0);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }, 10_000);
});
