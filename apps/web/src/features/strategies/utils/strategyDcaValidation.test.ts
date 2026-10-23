import { describe, expect, it } from 'vitest';
import type { AdditionalState } from '../types/StrategyForm.type';
import { hasInvalidUsdtDcaConfig } from './strategyDcaValidation';

const additional = (overrides: Partial<AdditionalState> = {}): AdditionalState => ({
  dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1', dcaMode: 'basic',
  dcaTimes: 2, dcaMultiplier: 0.5, dcaLevels: [{ percent: -30.5, multiplier: 0.5 }],
  maxPositions: 1, maxOrders: 1, positionLifetime: 1, positionUnit: 'h',
  orderLifetime: 1, orderUnit: 'h', marginMode: 'CROSSED', ...overrides,
});

describe('USDT DCA form validation', () => {
  it('accepts fractional multipliers and signed levels', () => {
    expect(hasInvalidUsdtDcaConfig(additional())).toBe(false);
    expect(hasInvalidUsdtDcaConfig(additional({ dcaMode: 'advanced',
      dcaLevels: [{ percent: 20, multiplier: 2 }, { percent: -20, multiplier: 0.5 }] }))).toBe(false);
  });

  it('rejects invalid levels and multipliers before submit', () => {
    expect(hasInvalidUsdtDcaConfig(additional({ dcaLevels: [{ percent: 0, multiplier: 2 }] }))).toBe(true);
    expect(hasInvalidUsdtDcaConfig(additional({ dcaMode: 'advanced', dcaLevels: [{ percent: -2, multiplier: 11 }] }))).toBe(true);
    expect(hasInvalidUsdtDcaConfig(additional({ dcaTimes: 11 }))).toBe(true);
  });

  it('validates the Basic level instead of a stale top-level multiplier alias', () => {
    expect(hasInvalidUsdtDcaConfig(additional({ dcaMultiplier: 11 }))).toBe(false);
  });

  it('does not reinterpret an unversioned legacy ladder', () => {
    expect(hasInvalidUsdtDcaConfig(additional({ dcaSizingBasis: undefined, dcaLevels: [] }))).toBe(false);
  });
});
