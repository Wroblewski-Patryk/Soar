import { describe, expect, it } from 'vitest';

import { validateStrategyConfig } from './strategyConfigValidation';

const basicConfig = (overrides: Record<string, unknown> = {}) => ({
  open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
  close: {
    mode: 'basic',
    tp: 10,
    sl: 10,
    ttp: [],
    tsl: [],
  },
  additional: {
    dcaEnabled: true,
    dcaMode: 'advanced',
    dcaTimes: 2,
    dcaLevels: [
      { percent: -5, multiplier: 1 },
      { percent: 5, multiplier: 1 },
    ],
  },
  ...overrides,
});

const captureValidationError = (config: unknown) => {
  try {
    validateStrategyConfig(config);
  } catch (error) {
    return error as { details?: Record<string, unknown> };
  }
  throw new Error('Expected validation to fail');
};

describe('validateStrategyConfig', () => {
  it('accepts signed DCA levels in basic TP/SL mode', () => {
    expect(() => validateStrategyConfig(basicConfig())).not.toThrow();
  });

  it('accepts positive DCA beyond TP and negative DCA beyond SL for USDT sizing', () => {
    expect(() => validateStrategyConfig(
      basicConfig({
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaSizingBasis: 'usdt_contribution_v1',
          dcaTimes: 2,
          dcaLevels: [{ percent: 20, multiplier: 0.5 }, { percent: -20, multiplier: 2 }],
        },
      })
    )).not.toThrow();
  });

  it('rejects an unknown sizing basis', () => {
    const error = captureValidationError(
      basicConfig({
        additional: {
          dcaEnabled: true,
          dcaMode: 'basic',
          dcaSizingBasis: 'unknown',
          dcaTimes: 1,
          dcaLevels: [{ percent: -20, multiplier: 1 }],
        },
      })
    );
    expect(error.details).toEqual(
      expect.objectContaining({
        field: 'additional.dcaSizingBasis',
        rule: 'invalid_dca_sizing_basis',
      })
    );
  });

  it('rejects invalid USDT multipliers and retains legacy reachability rules', () => {
    const error = captureValidationError(
      basicConfig({
        additional: {
          dcaEnabled: true,
          dcaMode: 'basic',
          dcaSizingBasis: 'usdt_contribution_v1',
          dcaTimes: 2,
          dcaLevels: [{ percent: -15, multiplier: 11 }],
        },
      })
    );
    expect(error.details).toEqual(
      expect.objectContaining({
        field: 'additional.dcaLevels[0]',
        rule: 'invalid_dca_level',
      })
    );
    const legacyError = captureValidationError(basicConfig({
      additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 2,
        dcaLevels: [{ percent: -15, multiplier: 1 }] },
    }));
    expect(legacyError.details).toEqual(expect.objectContaining({
      field: 'additional.dcaLevels[0]', rule: 'negative_dca_below_stop_loss_unreachable',
    }));
  });

  it('does not apply basic TP/SL reachability rules in advanced close mode', () => {
    expect(() =>
      validateStrategyConfig(
        basicConfig({
          close: {
            mode: 'advanced',
            tp: 10,
            sl: 10,
            ttp: [{ percent: 20, arm: 5 }],
            tsl: [],
          },
          additional: {
            dcaEnabled: true,
            dcaMode: 'advanced',
            dcaTimes: 2,
            dcaLevels: [
              { percent: 20, multiplier: 1 },
              { percent: -20, multiplier: 1 },
            ],
          },
        })
      )
    ).not.toThrow();
  });

  it('requires advanced USDT DCA count to match the configured ladder', () => {
    const error = captureValidationError(basicConfig({
      additional: { dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
        dcaMode: 'advanced', dcaTimes: 2, dcaLevels: [{ percent: -5, multiplier: 0.5 }] },
    }));
    expect(error.details).toEqual(expect.objectContaining({
      field: 'additional.dcaLevels', rule: 'invalid_dca_ladder',
    }));
  });
});
