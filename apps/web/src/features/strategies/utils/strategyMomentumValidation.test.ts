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

  it.each([0, 1, 1.5, '1', '2', 256])('rejects direct period %s', (period) => {
    const open = { direction: 'long', indicatorsLong: [
      { name: 'MOMENTUM', params: { period }, condition: '>', value: 0 },
    ], indicatorsShort: [] } as unknown as OpenConditions;
    expect(hasInvalidMomentumPeriod(open)).toBe(true);
  });

  it('ignores metadata in a non-MOMENTUM rule', () => {
    const open = { direction: 'long', indicatorsLong: [
      { name: 'EMA', params: { period: 2 }, condition: '>', value: 0,
        metadata: { name: 'MOMENTUM', params: { period: 1 } } },
    ], indicatorsShort: [] } as unknown as OpenConditions;
    expect(hasInvalidMomentumPeriod(open)).toBe(false);
  });

  it('ignores a value operand when an explicit constant is selected', () => {
    const open = { direction: 'long', indicatorsLong: [
      { name: 'EMA', params: { period: 2 }, condition: '>',
        value: { indicator: 'MOMENTUM', params: { period: 1 } },
        operand: { kind: 'constant', value: 0 } },
    ], indicatorsShort: [] } as unknown as OpenConditions;
    expect(hasInvalidMomentumPeriod(open)).toBe(false);
  });

  it.each(['indicatorsLong', 'indicatorsShort'] as const)(
    'uses value series after an invalid explicit constant in %s', (side) => {
      const rule = { name: 'EMA', params: { period: 2 }, condition: '>',
        value: { indicator: 'MOMENTUM', params: { period: 1 } },
        operand: { kind: 'constant', value: 'invalid' } };
      const open = { direction: 'both', indicatorsLong: [], indicatorsShort: [],
        [side]: [rule] } as unknown as OpenConditions;
      expect(hasInvalidMomentumPeriod(open)).toBe(true);
      rule.operand.value = '0';
      expect(hasInvalidMomentumPeriod(open)).toBe(false);
    },
  );

  it('follows explicit series and rejects a comparator band like the evaluator', () => {
    const rule: Record<string, unknown> = { name: 'EMA', params: { period: 2 }, condition: '>',
      value: { indicator: 'MOMENTUM', params: { period: 1 } },
      operand: { kind: 'series', indicator: 'EMA', params: { period: 2 } } };
    const open = { direction: 'long', indicatorsLong: [rule],
      indicatorsShort: [] } as unknown as OpenConditions;
    expect(hasInvalidMomentumPeriod(open)).toBe(false);
    rule.operand = { kind: 'series', indicator: 'MOMENTUM', params: { period: 1 } };
    expect(hasInvalidMomentumPeriod(open)).toBe(true);
    rule.operand = { kind: 'band', low: 0, high: 1 };
    expect(hasInvalidMomentumPeriod(open)).toBe(false);
  });
});
