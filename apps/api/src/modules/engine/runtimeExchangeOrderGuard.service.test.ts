import { describe, expect, it, vi } from 'vitest';
import { validateRuntimeExchangeOrder } from './runtimeExchangeOrderGuard.service';

describe('validateRuntimeExchangeOrder', () => {
  it('blocks when quantity is below exchange minimum quantity', async () => {
    const decision = await validateRuntimeExchangeOrder(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        quantity: 0.001,
        price: 50_000,
      },
      {
        getSymbolRules: vi.fn(async () => ({
          minQuantity: 0.01,
          minNotional: 5,
          quantityStep: 0.001,
          contractSize: null,
        })),
      }
    );

    expect(decision.allowed).toBe(false);
    if (decision.allowed) return;
    expect(decision.reason).toBe('exchange_min_quantity_not_met');
  });

  it('blocks when notional is below exchange minimum notional', async () => {
    const decision = await validateRuntimeExchangeOrder(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        quantity: 0.01,
        price: 100,
      },
      {
        getSymbolRules: vi.fn(async () => ({
          minQuantity: 0.001,
          minNotional: 5,
          quantityStep: 0.001,
          contractSize: null,
        })),
      }
    );

    expect(decision.allowed).toBe(false);
    if (decision.allowed) return;
    expect(decision.reason).toBe('exchange_min_notional_not_met');
  });

  it('uses contract size when evaluating derivative notional', async () => {
    const decision = await validateRuntimeExchangeOrder(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbol: 'ADAUSDT',
        quantity: 2,
        price: 0.25,
      },
      {
        getSymbolRules: vi.fn(async () => ({
          minQuantity: 1,
          minNotional: 5,
          quantityStep: 1,
          contractSize: 10,
        })),
      }
    );

    expect(decision).toEqual({ allowed: true });
  });

  it('allows when exchange rules are unavailable', async () => {
    const decision = await validateRuntimeExchangeOrder(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        quantity: 0.01,
        price: 100,
      },
      {
        getSymbolRules: vi.fn(async () => null),
      }
    );

    expect(decision).toEqual({ allowed: true });
  });
});
