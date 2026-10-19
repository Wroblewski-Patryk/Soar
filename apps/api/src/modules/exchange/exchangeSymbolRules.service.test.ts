import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetExchangeSymbolRulesCacheForTests,
  getExchangeSymbolRules,
} from './exchangeSymbolRules.service';

describe('exchangeSymbolRules.service', () => {
  beforeEach(() => {
    __resetExchangeSymbolRulesCacheForTests();
  });

  it('extracts min quantity and min notional from symbol limits and filters', async () => {
    const loadMarketMap = vi.fn(async () => ({
      'BTC/USDT:USDT': {
        id: 'BTCUSDT',
        symbol: 'BTC/USDT:USDT',
        active: true,
        quote: 'USDT', settle: 'USDT', contract: true, linear: true, inverse: false,
        limits: {
          amount: { min: 0.001 },
          cost: { min: 5 },
        },
        info: {
          filters: [
            { filterType: 'LOT_SIZE', minQty: '0.001', stepSize: '0.001' },
            { filterType: 'PRICE_FILTER', tickSize: '0.01' },
            { filterType: 'NOTIONAL', minNotional: '10' },
          ],
        },
      },
    }));

    const rules = await getExchangeSymbolRules(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
      },
      {
        nowMs: () => 1_000,
        loadMarketMap,
      }
    );

    expect(loadMarketMap).toHaveBeenCalledTimes(1);
    expect(rules).toEqual({
      minQuantity: 0.001,
      minNotional: 10,
      quantityStep: 0.001,
      priceStep: 0.01,
      contractSize: null,
      quoteCurrency: 'USDT',
      settleCurrency: 'USDT',
      isContract: true,
      isLinear: true,
      isInverse: false,
    });
  });

  it('uses cache and avoids repeated exchange market loads inside TTL', async () => {
    let now = 1_000;
    const loadMarketMap = vi.fn(async () => ({
      'ETH/USDT:USDT': {
        id: 'ETHUSDT',
        symbol: 'ETH/USDT:USDT',
        active: true,
        limits: {
          amount: { min: 0.01 },
          cost: { min: 5 },
        },
        info: {
          filters: [{ filterType: 'LOT_SIZE', minQty: '0.01', stepSize: '0.01' }],
        },
      },
    }));

    const deps = {
      nowMs: () => now,
      loadMarketMap,
    };

    await getExchangeSymbolRules(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'ETHUSDT',
      },
      deps
    );

    now = 2_000;
    await getExchangeSymbolRules(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'ETHUSDT',
      },
      deps
    );

    expect(loadMarketMap).toHaveBeenCalledTimes(1);
  });

  it('returns null for exchanges without live execution capability', async () => {
    const loadMarketMap = vi.fn(async () => ({}));

    const rules = await getExchangeSymbolRules(
      {
        exchange: 'BYBIT',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
      },
      {
        nowMs: () => 1_000,
        loadMarketMap,
      }
    );

    expect(rules).toBeNull();
    expect(loadMarketMap).not.toHaveBeenCalled();
  });

  it('allows Gate.io public symbol rules without enabling paper or live execution', async () => {
    const loadMarketMap = vi.fn(async () => ({
      BTC_USDT: {
        id: 'BTC_USDT',
        symbol: 'BTC/USDT:USDT',
        active: true,
        quote: 'USDT', settle: 'USDT', contract: true, linear: true, inverse: false,
        limits: {
          amount: { min: 0.0001 },
          cost: { min: 1 },
        },
        info: {},
      },
    }));

    const rules = await getExchangeSymbolRules(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
      },
      {
        nowMs: () => 1_000,
        loadMarketMap,
      }
    );

    expect(loadMarketMap).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
    });
    expect(rules).toEqual({
      minQuantity: 0.0001,
      minNotional: 1,
      quantityStep: null,
      priceStep: null,
      contractSize: null,
      quoteCurrency: 'USDT',
      settleCurrency: 'USDT',
      isContract: true,
      isLinear: true,
      isInverse: false,
    });
  });

  it('rejects two raw markets that collapse to one venue symbol', async () => {
    const rules = await getExchangeSymbolRules({
      exchange: 'GATEIO', marketType: 'FUTURES', symbol: 'BTCUSDT',
    }, {
      nowMs: () => 1_000,
      loadMarketMap: async () => ({
        first: { id: 'BTC_USDT', quote: 'USDT', settle: 'USDT', contract: true },
        second: { id: 'BTCUSDT', quote: 'USD', settle: 'USD', contract: true },
      }),
    });
    expect(rules).toBeNull();
  });

  it('does not return an expired currency proof after market refresh fails', async () => {
    let now = 1_000;
    const loadMarketMap = vi.fn()
      .mockResolvedValueOnce({ BTC_USDT: { id: 'BTC_USDT', quote: 'USDT', settle: 'USDT' } })
      .mockRejectedValueOnce(new Error('market unavailable'));
    const deps = { nowMs: () => now, loadMarketMap };
    const input = { exchange: 'GATEIO' as const, marketType: 'FUTURES' as const,
      symbol: 'BTCUSDT', requireCurrentMetadata: true };
    expect((await getExchangeSymbolRules(input, deps))?.quoteCurrency).toBe('USDT');
    now += 700_000;
    expect(await getExchangeSymbolRules(input, deps)).toBeNull();
    expect(loadMarketMap).toHaveBeenCalledTimes(2);
  });
});
