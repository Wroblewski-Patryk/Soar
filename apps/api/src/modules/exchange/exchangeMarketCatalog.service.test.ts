import { describe, expect, it } from 'vitest';

import {
  getSupportedExchangeMarketCatalog,
  listSupportedExchangePublicMarkets,
  resetExchangeMarketCatalogCacheForTests,
} from './exchangeMarketCatalog.service';

describe('exchangeMarketCatalog.service', () => {
  it('builds supported market catalog through exchange module ownership', async () => {
    resetExchangeMarketCatalogCacheForTests();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const catalog = await getSupportedExchangeMarketCatalog(
        'USDT',
        'FUTURES',
        'BINANCE',
        {
          loadMarketMap: async () => ({
            'BTC/USDT:USDT': {
              id: 'BTCUSDT',
              symbol: 'BTC/USDT',
              base: 'BTC',
              quote: 'USDT',
              active: true,
            },
            'ETH/USDT:USDT': {
              id: 'ETHUSDT',
              symbol: 'ETH/USDT',
              base: 'ETH',
              quote: 'USDT',
              active: true,
            },
          }),
          fetchJson: async () => [
            { symbol: 'BTCUSDT', quoteVolume: '1000', lastPrice: '100000' },
            { symbol: 'ETHUSDT', quoteVolume: '500', lastPrice: '3500' },
          ],
        }
      );

      expect(catalog.source).toBe('BINANCE_PUBLIC');
      expect(catalog.exchange).toBe('BINANCE');
      expect(catalog.marketType).toBe('FUTURES');
      expect(catalog.baseCurrency).toBe('USDT');
      expect(catalog.markets).toEqual([
        {
          symbol: 'BTCUSDT',
          displaySymbol: 'BTC/USDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          quoteVolume24h: 1000,
          lastPrice: 100000,
        },
        {
          symbol: 'ETHUSDT',
          displaySymbol: 'ETH/USDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          quoteVolume24h: 500,
          lastPrice: 3500,
        },
      ]);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('fails closed for unsupported exchange market-catalog capability', async () => {
    await expect(
      listSupportedExchangePublicMarkets({
        exchange: 'BYBIT',
        marketType: 'FUTURES',
      })
    ).rejects.toThrowError();
  });

  it('keeps catalog resolution isolated between SPOT and FUTURES for the same exchange', async () => {
    resetExchangeMarketCatalogCacheForTests();
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const spotCatalog = await getSupportedExchangeMarketCatalog(
        'USDT',
        'SPOT',
        'BINANCE',
        {
          loadMarketMap: async () => ({
            'BTC/USDT': {
              id: 'BTCUSDT',
              symbol: 'BTC/USDT',
              base: 'BTC',
              quote: 'USDT',
              active: true,
            },
          }),
          fetchJson: async () => [{ symbol: 'BTCUSDT', quoteVolume: '100', lastPrice: '90000' }],
        }
      );

      const futuresCatalog = await getSupportedExchangeMarketCatalog(
        'USDT',
        'FUTURES',
        'BINANCE',
        {
          loadMarketMap: async () => ({
            'BTC/USDT:USDT': {
              id: 'BTCUSDT',
              symbol: 'BTC/USDT',
              base: 'BTC',
              quote: 'USDT',
              active: true,
            },
          }),
          fetchJson: async () => [{ symbol: 'BTCUSDT', quoteVolume: '200', lastPrice: '100000' }],
        }
      );

      expect(spotCatalog.marketType).toBe('SPOT');
      expect(spotCatalog.markets).toEqual([
        {
          symbol: 'BTCUSDT',
          displaySymbol: 'BTC/USDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          quoteVolume24h: 100,
          lastPrice: 90000,
        },
      ]);
      expect(futuresCatalog.marketType).toBe('FUTURES');
      expect(futuresCatalog.markets).toEqual([
        {
          symbol: 'BTCUSDT',
          displaySymbol: 'BTC/USDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          quoteVolume24h: 200,
          lastPrice: 100000,
        },
      ]);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });
});
