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

  it.each([2, 5])('blocks USDT contribution multiplier %s before PAPER or LIVE bot activation', (multiplier) => {
    expect(() => assertStrategiesCompatibleWithMarketType({
      marketType: 'FUTURES',
      strategies: [{
        id: 'strategy-usdt',
        config: { additional: { dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
          dcaLevels: [{ percent: -20, multiplier }] } },
      }],
    })).toThrowError(expect.objectContaining({
      code: 'RUNTIME_DCA_CONFIG_UNSUPPORTED',
      details: { strategyId: 'strategy-usdt', reason: 'USDT_DCA_RUNTIME_UNSUPPORTED' },
    }));
  });

  it('preserves the quantity multiplier limit while allowing a legacy multiplier of 2', () => {
    const config = (multiplier: number) => ({
      additional: { dcaEnabled: true, dcaLevels: [{ percent: -20, multiplier }] },
    });
    expect(() => assertStrategiesCompatibleWithMarketType({
      marketType: 'FUTURES', strategies: [{ id: 'legacy', config: config(2) }],
    })).not.toThrow();
    expect(() => assertStrategiesCompatibleWithMarketType({
      marketType: 'FUTURES', strategies: [{ id: 'legacy', config: config(5) }],
    })).toThrowError(expect.objectContaining({
      code: 'RUNTIME_DCA_CONFIG_UNSUPPORTED',
      details: { strategyId: 'legacy', reason: 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT', multiplier: 5 },
    }));
  });
});
