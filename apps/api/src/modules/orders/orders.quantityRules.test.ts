import { describe, expect, it, vi } from 'vitest';

import {
  computeMinExecutableQuantity,
  enforceLivePretradeGuards,
  normalizeAmountByPrecision,
  normalizeAmountFixed,
  resolvePrecisionStep,
} from './orders.quantityRules';

describe('orders.quantityRules', () => {
  it('derives min executable quantity from min notional and rounds up to precision', () => {
    expect(
      computeMinExecutableQuantity({
        minAmount: 0.001,
        minNotional: 10,
        markPrice: 19_500,
        amountPrecision: 3,
      })
    ).toBe(0.001);

    expect(
      computeMinExecutableQuantity({
        minAmount: 0.0001,
        minNotional: 10,
        markPrice: 30_000,
        amountPrecision: 4,
      })
    ).toBe(0.0004);
  });

  it('uses contract size when deriving executable quantity from notional rules', () => {
    expect(
      computeMinExecutableQuantity({
        minAmount: 1,
        minNotional: 5,
        markPrice: 0.25,
        amountPrecision: 1,
        contractSize: 10,
      })
    ).toBe(2);
  });

  it('normalizes decimal and step precision deterministically', () => {
    expect(normalizeAmountByPrecision(0.1236, 3)).toBe(0.124);
    expect(normalizeAmountByPrecision(1.26, 0.25)).toBe(1.25);
    expect(normalizeAmountByPrecision(1.26, 0.25, 'TICK_SIZE')).toBe(1.25);
    expect(normalizeAmountFixed(1.23456, 3)).toBe(1.235);
  });

  it('keeps preview minimum on the explicit CCXT quantity grid', () => {
    expect(resolvePrecisionStep(1, 'TICK_SIZE')).toBe(1);
    expect(resolvePrecisionStep(1, 'DECIMAL_PLACES')).toBe(0.1);
    expect(resolvePrecisionStep(5, 'TICK_SIZE')).toBe(5);
    expect(resolvePrecisionStep(1, null)).toBeNull();
    const rules = { minAmount: 1, minNotional: 5.1, markPrice: 0.25,
      amountPrecision: 1, contractSize: 10 };
    expect(computeMinExecutableQuantity({ ...rules,
      amountPrecisionMode: 'TICK_SIZE' })).toBe(3);
    expect(computeMinExecutableQuantity({ ...rules,
      amountPrecisionMode: 'DECIMAL_PLACES' })).toBe(2.1);
    expect(computeMinExecutableQuantity({ ...rules, amountPrecision: 5,
      amountPrecisionMode: 'TICK_SIZE' })).toBe(5);
    expect(computeMinExecutableQuantity({ ...rules,
      amountPrecisionMode: null })).toBeNull();
  });

  it('rejects fractional tick-size contracts but accepts decimal-place quantities', async () => {
    const hasOpenPosition = vi.fn(async () => false);
    const fetchMarkPrice = vi.fn(async () => 3.305);
    const rules = { minAmount: 1, minNotional: 5, amountPrecision: 1,
      contractSize: 1 };
    const input = { apiKeyId: 'gate-precision-002', exchange: 'GATEIO' as const,
      marketType: 'FUTURES' as const, payload: { symbol: 'NGUSDT', quantity: 60.5,
        price: 3.305, reduceOnly: true } };
    const connector = { hasOpenPosition, fetchMarkPrice,
      getSymbolTradingRules: vi.fn(async () => ({ ...rules,
        amountPrecisionMode: 'TICK_SIZE' as const })) };
    await expect(enforceLivePretradeGuards({ ...input, connector }))
      .rejects.toMatchObject({ code: 'LIVE_PRETRADE_AMOUNT_PRECISION' });
    expect(hasOpenPosition).not.toHaveBeenCalled();
    expect(fetchMarkPrice).not.toHaveBeenCalled();

    // A separate market key avoids the short-lived rules cache from the first check.
    await expect(enforceLivePretradeGuards({ ...input,
      payload: { ...input.payload, symbol: 'NGDECUSDT' },
      connector: { ...connector, getSymbolTradingRules: vi.fn(async () => ({ ...rules,
        amountPrecisionMode: 'DECIMAL_PLACES' as const })) },
    })).resolves.toBeUndefined();
    await expect(enforceLivePretradeGuards({ ...input,
      payload: { ...input.payload, symbol: 'NGUNKNOWNUSDT' },
      connector: { ...connector, getSymbolTradingRules: vi.fn(async () => ({ ...rules,
        amountPrecisionMode: null })) },
    })).rejects.toMatchObject({ code: 'LIVE_PRETRADE_AMOUNT_PRECISION' });
    const fiveContractStep = { ...connector, getSymbolTradingRules: vi.fn(async () => ({
      ...rules, amountPrecision: 5, amountPrecisionMode: 'TICK_SIZE' as const,
    })) };
    await expect(enforceLivePretradeGuards({ ...input,
      payload: { ...input.payload, symbol: 'NGSTEP5USDT', quantity: 62 },
      connector: fiveContractStep,
    })).rejects.toMatchObject({ code: 'LIVE_PRETRADE_AMOUNT_PRECISION' });
    await expect(enforceLivePretradeGuards({ ...input,
      payload: { ...input.payload, symbol: 'NGSTEP5OKUSDT', quantity: 60 },
      connector: fiveContractStep,
    })).resolves.toBeUndefined();
  });

  it('preserves explicit fractional tick size for SPOT pretrade', async () => {
    const connector = { hasOpenPosition: vi.fn(async () => false),
      getSymbolTradingRules: vi.fn(async () => ({ minAmount: 0.25,
        minNotional: 1, amountPrecision: 0.25,
        amountPrecisionMode: 'TICK_SIZE' as const, contractSize: null })),
      fetchMarkPrice: vi.fn(async () => 2),
    };
    const base = { connector, apiKeyId: 'spot-tick-002', exchange: 'GATEIO' as const,
      marketType: 'SPOT' as const };
    await expect(enforceLivePretradeGuards({ ...base, payload: {
      symbol: 'SPOTTICKOKUSDT', quantity: 1.25, price: 2,
    } })).resolves.toBeUndefined();
    await expect(enforceLivePretradeGuards({ ...base, payload: {
      symbol: 'SPOTTICKBADUSDT', quantity: 1.26, price: 2,
    } })).rejects.toMatchObject({ code: 'LIVE_PRETRADE_AMOUNT_PRECISION' });
  });

  it('fails closed when min notional exists but price truth is unavailable', async () => {
    await expect(
      enforceLivePretradeGuards({
        apiKeyId: 'key-1',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        connector: {
          hasOpenPosition: async () => false,
          getSymbolTradingRules: async () => ({
            minAmount: null,
            minNotional: 10,
            amountPrecision: null,
            contractSize: null,
          }),
          fetchMarkPrice: async () => {
            throw new Error('price unavailable');
          },
        },
        payload: {
          symbol: 'BTCUSDT',
          quantity: 1,
        },
      })
    ).rejects.toMatchObject({
      code: 'LIVE_PRETRADE_NOTIONAL_PRICE_UNAVAILABLE',
    });
  });

  it('uses contract size for live pretrade notional checks', async () => {
    await expect(
      enforceLivePretradeGuards({
        apiKeyId: 'key-2',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        connector: {
          hasOpenPosition: async () => false,
          getSymbolTradingRules: async () => ({
            minAmount: 1,
            minNotional: 5,
            amountPrecision: 1,
            contractSize: 10,
          }),
          fetchMarkPrice: async () => 0.25,
        },
        payload: {
          symbol: 'ADAUSDT',
          quantity: 2,
        },
      })
    ).resolves.toBeUndefined();
  });
});
