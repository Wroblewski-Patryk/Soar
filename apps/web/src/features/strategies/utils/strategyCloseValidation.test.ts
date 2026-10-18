import { describe, expect, it } from 'vitest';
import type { AdditionalState, CloseConditions } from '../types/StrategyForm.type';
import { hasUnreachableLegacyDcaLevels } from './strategyCloseValidation';

const close: CloseConditions = { mode: 'basic', tp: 10, sl: 10, ttp: [], tsl: [] };
const additional = (basis?: AdditionalState['dcaSizingBasis']): AdditionalState => ({
  dcaEnabled: true, dcaSizingBasis: basis, dcaMode: 'basic', dcaTimes: 2,
  dcaMultiplier: 1, dcaLevels: [{ percent: -20, multiplier: 1 }],
  maxPositions: 1, maxOrders: 1, positionLifetime: 1, positionUnit: 'h',
  orderLifetime: 1, orderUnit: 'h', marginMode: 'CROSSED',
});

describe('legacy DCA reachability', () => {
  it('retains the old basic close guard for unversioned strategies', () => {
    expect(hasUnreachableLegacyDcaLevels(close, additional())).toBe(true);
    expect(hasUnreachableLegacyDcaLevels(close, additional('quantity_v1'))).toBe(true);
  });

  it('allows USDT DCA to be checked before the same-side close', () => {
    expect(hasUnreachableLegacyDcaLevels(close, additional('usdt_contribution_v1'))).toBe(false);
  });
});
