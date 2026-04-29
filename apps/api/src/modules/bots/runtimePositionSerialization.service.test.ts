import { describe, expect, it } from 'vitest';
import { resolveRuntimePositionDynamicStops } from './runtimePositionSerialization.service';

describe('runtimePositionSerialization', () => {
  it('does not invent dynamic TTP or TSL display for imported LIVE positions without runtime protection state', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'SHORT',
      entryPrice: 1,
      quantity: 1000,
      leverage: 10,
      unrealizedPnl: null,
      marketPrice: 0.989,
      stateEntryPrice: 1,
      runtimeState: null,
      trailingStopLevels: [{ armPercent: 5, trailPercent: 1 }],
    });

    expect(result.dynamicTtpStopLoss).toBeNull();
    expect(result.dynamicTslStopLoss).toBeNull();
  });

  it('derives dynamic TTP stop only from canonical runtime trailing state', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'SHORT',
      entryPrice: 1,
      quantity: 1000,
      leverage: 10,
      unrealizedPnl: null,
      marketPrice: 0.9915,
      stateEntryPrice: 1,
      runtimeState: {
        averageEntryPrice: 1,
        quantity: 1000,
        currentAdds: 0,
        trailingAnchorPrice: 0.989,
        trailingTakeProfitHighPercent: 0.11,
        trailingTakeProfitStepPercent: 0.01,
      },
      trailingStopLevels: [{ armPercent: 0.05, trailPercent: 0.01 }],
    });

    expect(result.dynamicTtpStopLoss).toBeCloseTo(0.99, 8);
  });

  it('derives dynamic TSL stop from canonical runtime trailing anchor instead of display fallback', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'LONG',
      entryPrice: 100,
      quantity: 1,
      leverage: 5,
      unrealizedPnl: null,
      marketPrice: 105,
      stateEntryPrice: 100,
      runtimeState: {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 105,
      },
      trailingStopLevels: [{ armPercent: 0.2, trailPercent: 0.04 }],
    });

    expect(result.dynamicTslStopLoss).toBeCloseTo(100.8, 8);
  });
});
