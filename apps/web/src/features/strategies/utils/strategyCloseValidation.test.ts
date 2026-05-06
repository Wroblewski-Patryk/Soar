import { describe, expect, it } from 'vitest';

import type { AdditionalState, CloseConditions } from '../types/StrategyForm.type';
import { hasUnreachableBasicDcaLevels } from './strategyCloseValidation';

const basicClose = (overrides: Partial<CloseConditions> = {}): CloseConditions => ({
  mode: 'basic',
  tp: 10,
  sl: 10,
  ttp: [],
  tsl: [],
  ...overrides,
});

const additional = (overrides: Partial<AdditionalState> = {}): AdditionalState => ({
  dcaEnabled: true,
  dcaMode: 'advanced',
  dcaTimes: 2,
  dcaMultiplier: 1,
  dcaLevels: [
    { percent: -5, multiplier: 1 },
    { percent: 5, multiplier: 1 },
  ],
  maxPositions: 1,
  maxOrders: 1,
  positionLifetime: 1,
  positionUnit: 'h',
  orderLifetime: 1,
  orderUnit: 'h',
  marginMode: 'CROSSED',
  ...overrides,
});

describe('strategy close validation', () => {
  it('allows DCA levels reachable before basic TP/SL', () => {
    expect(hasUnreachableBasicDcaLevels(basicClose(), additional())).toBe(false);
  });

  it('detects positive DCA above take-profit as unreachable', () => {
    expect(
      hasUnreachableBasicDcaLevels(
        basicClose(),
        additional({ dcaLevels: [{ percent: 20, multiplier: 1 }] })
      )
    ).toBe(true);
  });

  it('detects negative DCA below stop-loss as unreachable', () => {
    expect(
      hasUnreachableBasicDcaLevels(
        basicClose(),
        additional({ dcaLevels: [{ percent: -20, multiplier: 1 }] })
      )
    ).toBe(true);
  });

  it('applies basic repeated DCA reachability', () => {
    expect(
      hasUnreachableBasicDcaLevels(
        basicClose(),
        additional({
          dcaMode: 'basic',
          dcaTimes: 2,
          dcaLevels: [{ percent: -20, multiplier: 1 }],
        })
      )
    ).toBe(true);
  });

  it('does not apply basic TP/SL reachability rules in advanced close mode', () => {
    expect(
      hasUnreachableBasicDcaLevels(
        basicClose({ mode: 'advanced' }),
        additional({ dcaLevels: [{ percent: 20, multiplier: 1 }] })
      )
    ).toBe(false);
  });
});
