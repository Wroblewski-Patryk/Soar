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
  it('accepts reachable DCA levels in basic TP/SL mode', () => {
    expect(() => validateStrategyConfig(basicConfig())).not.toThrow();
  });

  it('rejects positive DCA levels above basic take-profit', () => {
    const error = captureValidationError(
      basicConfig({
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 1,
          dcaLevels: [{ percent: 20, multiplier: 1 }],
        },
      })
    );
    expect(error.details).toEqual(
      expect.objectContaining({
        field: 'additional.dcaLevels[0]',
        rule: 'positive_dca_above_take_profit_unreachable',
        dcaPercent: 20,
        takeProfitPercent: 10,
      })
    );
  });

  it('rejects negative DCA levels below basic stop-loss', () => {
    const error = captureValidationError(
      basicConfig({
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 1,
          dcaLevels: [{ percent: -20, multiplier: 1 }],
        },
      })
    );
    expect(error.details).toEqual(
      expect.objectContaining({
        field: 'additional.dcaLevels[0]',
        rule: 'negative_dca_below_stop_loss_unreachable',
        dcaPercent: -20,
        stopLossPercent: -10,
      })
    );
  });

  it('rejects repeated basic DCA levels when the repeated trigger is unreachable', () => {
    const error = captureValidationError(
      basicConfig({
        additional: {
          dcaEnabled: true,
          dcaMode: 'basic',
          dcaTimes: 2,
          dcaLevels: [{ percent: -15, multiplier: 1 }],
        },
      })
    );
    expect(error.details).toEqual(
      expect.objectContaining({
        field: 'additional.dcaLevels[0]',
        rule: 'negative_dca_below_stop_loss_unreachable',
      })
    );
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
});
