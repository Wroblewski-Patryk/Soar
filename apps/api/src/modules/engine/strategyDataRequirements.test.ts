import { describe, expect, it } from 'vitest';
import {
  requiresAnyDerivativeInput,
  resolveStrategyDerivativeRequirements,
} from './strategyDataRequirements';

describe('strategyDataRequirements', () => {
  it('detects each derivatives input family from canonical strategy rules', () => {
    const requirements = resolveStrategyDerivativeRequirements([{
      open: {
        direction: 'both',
        indicatorsLong: [
          { name: 'FUNDING_RATE_ZSCORE', condition: '>', value: 1, params: {} },
          { name: 'OPEN_INTEREST_DELTA', condition: '>', value: 0, params: {} },
        ],
        indicatorsShort: [
          { name: 'ORDER_BOOK_SPREAD_BPS', condition: '<', value: 5, params: {} },
        ],
      },
    }]);

    expect(requirements).toEqual({ fundingRate: true, openInterest: true, orderBook: true });
    expect(requiresAnyDerivativeInput(requirements)).toBe(true);
  });

  it('supports legacy nested indicator arrays without matching unrelated description text', () => {
    expect(resolveStrategyDerivativeRequirements([{
      indicatorsLong: [{ name: 'ORDER_BOOK_IMBALANCE', condition: '>', value: 0.2 }],
    }])).toEqual({ fundingRate: false, openInterest: false, orderBook: true });

    expect(resolveStrategyDerivativeRequirements([{
      description: 'ORDER_BOOK should not activate a data requirement',
      open: { indicatorsLong: [{ name: 'EMA', condition: '>', value: 10 }] },
    }])).toEqual({ fundingRate: false, openInterest: false, orderBook: false });
  });
});
