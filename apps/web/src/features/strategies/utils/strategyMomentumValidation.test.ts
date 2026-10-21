import { describe, expect, it } from 'vitest';
import type { OpenConditions } from '../types/StrategyForm.type';
import { hasInvalidMomentumPeriod } from './strategyMomentumValidation';

describe('strategy MOMENTUM form validation', () => {
  it('finds period 1 in either direction and nested series operands', () => {
    const open: OpenConditions = { direction: 'both', indicatorsLong: [],
      indicatorsShort: [{ group: 'TREND', name: 'EMA', params: { period: 2 },
        condition: '<', value: 0, weight: 1,
        operand: { kind: 'series', indicator: 'MOMENTUM', params: { length: 1 } },
      } as OpenConditions['indicatorsShort'][number]] };
    expect(hasInvalidMomentumPeriod(open)).toBe(true);
    const short = open.indicatorsShort[0] as typeof open.indicatorsShort[number] & {
      operand: { params: { length: number } } };
    short.operand.params.length = 2;
    expect(hasInvalidMomentumPeriod(open)).toBe(false);
  });
});
