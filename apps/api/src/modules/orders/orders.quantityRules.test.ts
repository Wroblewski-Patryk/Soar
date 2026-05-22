import { describe, expect, it } from 'vitest';

import {
  computeMinExecutableQuantity,
  enforceLivePretradeGuards,
  normalizeAmountByPrecision,
  normalizeAmountFixed,
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

  it('normalizes decimal and step precision deterministically', () => {
    expect(normalizeAmountByPrecision(0.1236, 3)).toBe(0.124);
    expect(normalizeAmountByPrecision(1.26, 0.25)).toBe(1.25);
    expect(normalizeAmountFixed(1.23456, 3)).toBe(1.235);
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
});
