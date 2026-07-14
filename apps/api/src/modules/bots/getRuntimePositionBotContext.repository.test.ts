import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    bot: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { getRuntimePositionBotContext } from './runtimeSessionPositionsRead.repository';

describe('getRuntimePositionBotContext.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests the owned bot runtime context projection and returns the prisma payload', async () => {
    const context = {
      id: 'bot-1',
      apiKeyId: 'api-key-1',
      walletId: 'wallet-1',
      strategyId: 'strategy-1',
      createdAt: new Date('2026-07-14T00:00:00.000Z'),
      paperStartBalance: '1000',
      wallet: {
        apiKeyId: 'wallet-api-key-1',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: '500',
      },
      symbolGroup: {
        symbols: ['BTCUSDT'],
        marketUniverse: {
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          filterRules: { quoteAsset: 'USDT' },
          whitelist: ['BTCUSDT'],
          blacklist: [],
        },
      },
      botMarketGroups: [
        {
          symbolGroup: {
            symbols: ['ETHUSDT'],
            marketUniverse: {
              exchange: 'BINANCE',
              marketType: 'FUTURES',
              baseCurrency: 'USDT',
              filterRules: { quoteAsset: 'USDT' },
              whitelist: ['ETHUSDT'],
              blacklist: [],
            },
          },
          strategyLinks: [{ strategyId: 'strategy-1' }],
        },
      ],
    };

    mocks.prisma.bot.findFirst.mockResolvedValue(context);

    await expect(getRuntimePositionBotContext('user-1', 'bot-1')).resolves.toEqual(context);
    expect(mocks.prisma.bot.findFirst).toHaveBeenCalledWith({
      where: { id: 'bot-1', userId: 'user-1' },
      select: {
        id: true,
        apiKeyId: true,
        walletId: true,
        strategyId: true,
        createdAt: true,
        paperStartBalance: true,
        wallet: {
          select: {
            apiKeyId: true,
            mode: true,
            exchange: true,
            marketType: true,
            baseCurrency: true,
            paperInitialBalance: true,
          },
        },
        symbolGroup: {
          select: {
            symbols: true,
            marketUniverse: {
              select: {
                exchange: true,
                marketType: true,
                baseCurrency: true,
                filterRules: true,
                whitelist: true,
                blacklist: true,
              },
            },
          },
        },
        botMarketGroups: {
          where: { isEnabled: true, lifecycleStatus: 'ACTIVE' },
          select: {
            symbolGroup: {
              select: {
                symbols: true,
                marketUniverse: {
                  select: {
                    exchange: true,
                    marketType: true,
                    baseCurrency: true,
                    filterRules: true,
                    whitelist: true,
                    blacklist: true,
                  },
                },
              },
            },
            strategyLinks: {
              where: { isEnabled: true },
              select: { strategyId: true },
            },
          },
        },
      },
    });
  });
});
