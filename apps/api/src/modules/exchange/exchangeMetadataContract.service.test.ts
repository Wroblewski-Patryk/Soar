import { describe, expect, it, vi } from 'vitest';

import {
  resolveExchangeMetadataByMarketType,
  resolveSymbolTradingRulesMetadata,
} from './exchangeMetadataContract.service';

describe('exchangeMetadataContract.service', () => {
  it('resolves exchange market metadata from catalog with capability fallback', async () => {
    const getMarketCatalogForExchange = vi.fn(
      async (_requestedBaseCurrency?: string, marketType?: 'FUTURES' | 'SPOT') => {
        if (marketType === 'SPOT') {
          return {
            source: 'catalog',
            exchange: 'BINANCE' as const,
            marketType: 'SPOT' as const,
            baseCurrency: 'USDT',
            baseCurrencies: ['USDT', 'EUR'],
            totalAvailable: 2,
            totalForBaseCurrency: 2,
            markets: [],
          };
        }
        return {
          source: 'catalog',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
          baseCurrency: 'USDT',
          baseCurrencies: ['USDT'],
          totalAvailable: 1,
          totalForBaseCurrency: 1,
          markets: [],
        };
      }
    );

    const metadata = await resolveExchangeMetadataByMarketType(
      {
        exchange: 'BINANCE',
        requestedMarketType: 'SPOT',
      },
      {
        getMarketCatalogForExchange,
        getSymbolRules: vi.fn(async () => null),
      }
    );

    expect(metadata.marketType).toBe('SPOT');
    expect(metadata.baseCurrencies).toEqual(expect.arrayContaining(['USDT', 'EUR']));
    expect(metadata.byMarketType.FUTURES.baseCurrencies).toContain('USDT');
  });

  it('maps symbol rules metadata and derives precision from quantity step', async () => {
    const getSymbolRules = vi.fn(async () => ({
      minQuantity: 0.005,
      minNotional: 10,
      quantityStep: 0.001,
    }));

    const rules = await resolveSymbolTradingRulesMetadata(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
      },
      {
        getMarketCatalogForExchange: vi.fn(async () => ({
          source: 'catalog',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
          baseCurrency: 'USDT',
          baseCurrencies: ['USDT'],
          totalAvailable: 1,
          totalForBaseCurrency: 1,
          markets: [],
        })),
        getSymbolRules,
      }
    );

    expect(rules).toEqual({
      minAmount: 0.005,
      minNotional: 10,
      amountPrecision: 3,
    });
  });
});
