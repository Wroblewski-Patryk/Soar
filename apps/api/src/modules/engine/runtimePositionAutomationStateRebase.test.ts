import { describe, expect, it } from 'vitest';

import { hasMaterialCanonicalBasisDrift } from './runtimePositionAutomationStateRebase';

describe('hasMaterialCanonicalBasisDrift', () => {
  const exchangePosition = {
    origin: 'EXCHANGE_SYNC',
    quantity: 100,
    entryPrice: 50_000,
  };

  it('does not report drift without exchange sync origin or persisted state', () => {
    expect(
      hasMaterialCanonicalBasisDrift({
        position: { ...exchangePosition, origin: 'RUNTIME' },
        state: { quantity: 200, averageEntryPrice: 60_000 },
      } as any)
    ).toBe(false);

    expect(
      hasMaterialCanonicalBasisDrift({
        position: exchangePosition as any,
        state: null,
      })
    ).toBe(false);
  });

  it('treats tolerance-bound quantity and entry differences as non-material', () => {
    expect(
      hasMaterialCanonicalBasisDrift({
        position: exchangePosition as any,
        state: {
          quantity: 100 + (100 * 1e-6) / 2,
          averageEntryPrice: 50_000 + (50_000 * 1e-6) / 2,
        },
      })
    ).toBe(false);
  });

  it('reports material quantity or entry basis drift beyond tolerance', () => {
    expect(
      hasMaterialCanonicalBasisDrift({
        position: exchangePosition as any,
        state: {
          quantity: 100 + 100 * 1e-6 + 1e-8,
          averageEntryPrice: 50_000,
        },
      })
    ).toBe(true);

    expect(
      hasMaterialCanonicalBasisDrift({
        position: exchangePosition as any,
        state: {
          quantity: 100,
          averageEntryPrice: 50_000 + 50_000 * 1e-6 + 1e-5,
        },
      })
    ).toBe(true);
  });

  it('uses the absolute floor tolerance near zero', () => {
    expect(
      hasMaterialCanonicalBasisDrift({
        position: {
          origin: 'EXCHANGE_SYNC',
          quantity: 0,
          entryPrice: 0,
        } as any,
        state: {
          quantity: 1e-9,
          averageEntryPrice: 1e-9,
        },
      })
    ).toBe(false);

    expect(
      hasMaterialCanonicalBasisDrift({
        position: {
          origin: 'EXCHANGE_SYNC',
          quantity: 0,
          entryPrice: 0,
        } as any,
        state: {
          quantity: 1.1e-9,
          averageEntryPrice: 1e-9,
        },
      })
    ).toBe(true);
  });
});
