import { describe, expect, it } from 'vitest';
import { assertStrategiesCompatibleWithMarketType } from './botWriteValidation.service';

const derivativesStrategy = {
  id: 'strategy-derivatives',
  config: {
    open: {
      indicatorsLong: [
        { name: 'FUNDING_RATE', condition: '>', value: 0, params: {} },
      ],
    },
  },
};

describe('assertStrategiesCompatibleWithMarketType', () => {
  it('rejects derivatives strategies for SPOT bots', () => {
    expect(() => assertStrategiesCompatibleWithMarketType({
      marketType: 'SPOT',
      strategies: [derivativesStrategy],
    })).toThrowError(expect.objectContaining({
      code: 'STRATEGY_DERIVATIVES_REQUIRE_FUTURES',
      details: { marketType: 'SPOT', strategyIds: ['strategy-derivatives'] },
    }));
  });

  it('allows derivatives strategies for FUTURES and ordinary indicators for SPOT', () => {
    expect(() => assertStrategiesCompatibleWithMarketType({
      marketType: 'FUTURES',
      strategies: [derivativesStrategy],
    })).not.toThrow();
    expect(() => assertStrategiesCompatibleWithMarketType({
      marketType: 'SPOT',
      strategies: [{
        id: 'strategy-ema',
        config: { open: { indicatorsLong: [{ name: 'EMA', condition: '>', value: 10 }] } },
      }],
    })).not.toThrow();
  });
});
