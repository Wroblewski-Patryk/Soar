import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaFindManyMock = vi.hoisted(() => vi.fn());
const resolveEffectiveSymbolGroupSymbolsWithCatalogMock = vi.hoisted(() => vi.fn());

vi.mock('../prisma/client', () => ({
  prisma: {
    bot: {
      findMany: prismaFindManyMock,
    },
  },
}));

vi.mock('../modules/bots/runtimeSymbolCatalogResolver.service', () => ({
  resolveEffectiveSymbolGroupSymbolsWithCatalog: resolveEffectiveSymbolGroupSymbolsWithCatalogMock,
}));

describe('marketStreamSubscriptions.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses canonical symbol-group resolver so market-stream subscriptions match runtime scope', async () => {
    prismaFindManyMock.mockResolvedValue([
      {
        symbolGroup: {
          symbols: [],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: {
              minQuoteVolumeEnabled: true,
              minQuoteVolume24h: 1000000,
            },
            whitelist: [],
            blacklist: [],
          },
        },
        strategy: {
          interval: '5m',
        },
        botMarketGroups: [
          {
            symbolGroup: {
              symbols: [],
              marketUniverse: {
                exchange: 'BINANCE',
                marketType: 'FUTURES',
                baseCurrency: 'USDT',
                filterRules: {
                  minQuoteVolumeEnabled: true,
                  minQuoteVolume24h: 1000000,
                },
                whitelist: [],
                blacklist: [],
              },
            },
            strategyLinks: [
              {
                strategy: {
                  interval: '5m',
                },
              },
            ],
          },
        ],
      },
    ]);
    resolveEffectiveSymbolGroupSymbolsWithCatalogMock.mockResolvedValue([
      '1000000MOGUSDT',
      '1000BONKUSDT',
      '1000FLOKIUSDT',
    ]);

    const { resolveMarketStreamDynamicSubscriptions } = await import('./marketStreamSubscriptions.service');
    const result = await resolveMarketStreamDynamicSubscriptions({
      marketType: 'FUTURES',
      envSymbols: ['BTCUSDT'],
      envIntervals: ['1m'],
    });

    expect(resolveEffectiveSymbolGroupSymbolsWithCatalogMock).toHaveBeenCalledTimes(1);
    expect(result.symbols).toEqual([
      '1000000MOGUSDT',
      '1000BONKUSDT',
      '1000FLOKIUSDT',
      'BTCUSDT',
    ]);
    expect(result.candleIntervals).toEqual(['1m', '5m']);
  });
});
