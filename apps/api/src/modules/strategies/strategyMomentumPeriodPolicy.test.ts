import { describe, expect, it } from 'vitest';
import { normalizeLegacyMomentumPeriod } from './strategyMomentumPeriodPolicy';
import { validateStrategyConfig } from './strategyConfigValidation';

describe('MOMENTUM period policy', () => {
  it('finds both directions and nested series operands without changing unrelated data', () => {
    const config = { open: { direction: 'both',
      indicatorsLong: [{ name: 'MOMENTUM', params: { period: 1, other: 9 },
        condition: '>', value: { indicator: 'MOMENTUM', params: { length: 1 } } }],
      indicatorsShort: [{ name: 'EMA', params: { period: 1 },
        condition: '<', value: 0,
        operand: { kind: 'series', indicator: 'MOMENTUM', params: { period: 1 } } }],
    }, close: { report: { name: 'MOMENTUM', params: { period: 1 } } } };
    const source = JSON.stringify(config);
    const result = normalizeLegacyMomentumPeriod(config);
    expect(result.fields).toEqual([
      'open.indicatorsLong[0].params.period',
      'open.indicatorsLong[0].value.params.length',
      'open.indicatorsShort[0].operand.params.period',
    ]);
    expect(JSON.stringify(config)).toBe(source);
    expect((result.config as typeof config).open.indicatorsLong[0].params.period).toBe(2);
    expect((result.config as typeof config).open.indicatorsShort[0].params.period).toBe(1);
    expect((result.config as typeof config).open.indicatorsShort[0].operand.params.period).toBe(2);
    expect((result.config as typeof config).close).toEqual(config.close);
    expect(normalizeLegacyMomentumPeriod(result.config).fields).toEqual([]);
  });

  it('rejects new period 1 with exact fields and allows 2', () => {
    const legacy = { open: { indicatorsLong: [], indicatorsShort: [
      { name: 'MOMENTUM', params: { period: 1 }, condition: '<', value: 0 },
    ] } };
    expect(() => validateStrategyConfig(legacy)).toThrowError(
      expect.objectContaining({ code: 'INVALID_MOMENTUM_PERIOD',
        details: { fields: ['open.indicatorsShort[0].params.period'],
          rule: 'momentum_period_integer_2_255', min: 2, max: 255 } }),
    );
    expect(() => validateStrategyConfig(normalizeLegacyMomentumPeriod(legacy).config))
      .not.toThrow();
  });

  it('covers the historical openConditions fallback used by the evaluator', () => {
    const config = { openConditions: { direction: 'short', indicatorsLong: [],
      indicatorsShort: [{ name: 'MOMENTUM', condition: '<', value: 2.5,
        params: { period: 1 } }] } };
    const normalized = normalizeLegacyMomentumPeriod(config);
    expect(normalized.fields).toEqual(['openConditions.indicatorsShort[0].params.period']);
    expect((normalized.config as typeof config).openConditions
      .indicatorsShort[0].params.period).toBe(2);
    expect(() => validateStrategyConfig(config)).toThrow();
  });

  it.each([0, 1, 1.5, '1', '2', 256, -2])(
    'rejects explicit MOMENTUM period %s without runtime clamping', (period) => {
      const config = { open: { indicatorsLong: [{ name: 'MOMENTUM',
        condition: '>', value: 0, params: { period } }], indicatorsShort: [] } };
      const inspection = normalizeLegacyMomentumPeriod(config);
      expect(inspection.invalidFields).toEqual(['open.indicatorsLong[0].params.period']);
      expect(() => validateStrategyConfig(config)).toThrowError(
        expect.objectContaining({ code: 'INVALID_MOMENTUM_PERIOD' }),
      );
      expect(inspection.fields).toEqual(period === 1
        ? ['open.indicatorsLong[0].params.period'] : []);
    },
  );

  it('accepts numeric 2 and 255, and the omitted default period', () => {
    for (const params of [{ period: 2 }, { period: 255 }, {}])
      expect(() => validateStrategyConfig({ open: { indicatorsLong: [
        { name: 'MOMENTUM', condition: '>', value: 0, params },
      ], indicatorsShort: [] } })).not.toThrow();
  });

  it('ignores metadata and values not selected as executable operands', () => {
    const config = { open: { indicatorsLong: [
      { name: 'EMA', condition: '>', value: 0, params: { period: 2 },
        metadata: { name: 'MOMENTUM', params: { period: 1 } } },
      { name: 'EMA', condition: '>', value: {
        indicator: 'MOMENTUM', params: { period: 1 } },
        operand: { kind: 'constant', value: 0 }, params: { period: 2 } },
      { name: 'MOMENTUM', condition: 'UNKNOWN', value: 0, params: { period: 1 } },
    ], indicatorsShort: [] } };
    expect(normalizeLegacyMomentumPeriod(config)).toEqual({ config,
      fields: [], invalidFields: [] });
    expect(() => validateStrategyConfig(config)).not.toThrow();
  });
});
