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
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [{ armPercent: 5, trailPercent: 1 }],
      allowStrategyProtectionFallback: false,
    });

    expect(result.dynamicTtpStopLoss).toBeNull();
    expect(result.dynamicTtpStopLossSource).toBeNull();
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
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [{ armPercent: 0.05, trailPercent: 0.01 }],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTtpStopLoss).toBeCloseTo(0.99, 8);
    expect(result.dynamicTtpStopLossSource).toBe('runtime_state');
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
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [{ armPercent: 0.2, trailPercent: 0.04 }],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTslStopLoss).toBeCloseTo(100.8, 8);
  });

  it('derives dynamic TTP stop from strategy levels when bot-managed runtime state has not persisted TTP tracking yet', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'LONG',
      entryPrice: 100,
      quantity: 1,
      leverage: 2,
      unrealizedPnl: null,
      marketPrice: 106,
      stateEntryPrice: 100,
      runtimeState: {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 106,
      },
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTtpStopLoss).toBeCloseTo(105.5, 8);
    expect(result.dynamicTtpStopLossSource).toBe('strategy_fallback');
    expect(result.dynamicTslStopLoss).toBeNull();
  });

  it('keeps fallback dynamic TTP stop monotonic on pullback when anchor already moved higher', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'LONG',
      entryPrice: 100,
      quantity: 1,
      leverage: 2,
      unrealizedPnl: null,
      marketPrice: 105,
      stateEntryPrice: 100,
      runtimeState: {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 106,
      },
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTtpStopLoss).toBeCloseTo(105.5, 8);
    expect(result.dynamicTtpStopLossSource).toBe('strategy_fallback');
  });

  it('falls back to strategy-level TTP when stale runtime tracking does not yield a valid positive trigger', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'LONG',
      entryPrice: 100,
      quantity: 1,
      leverage: 2,
      unrealizedPnl: null,
      marketPrice: 103,
      stateEntryPrice: 100,
      runtimeState: {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 100,
        trailingTakeProfitHighPercent: 0.01,
        trailingTakeProfitStepPercent: 0.02,
      },
      trailingTakeProfitLevels: [{ armPercent: 0.05, trailPercent: 0.01 }],
      trailingStopLevels: [],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTtpStopLoss).toBeCloseTo(102.5, 8);
    expect(result.dynamicTslStopLoss).toBeNull();
  });

  it('keeps dynamic TTP stop visible after pullback when trailing loss limit proves the trail was already armed', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'LONG',
      entryPrice: 100,
      quantity: 1,
      leverage: 2,
      unrealizedPnl: null,
      marketPrice: 101,
      stateEntryPrice: 100,
      runtimeState: {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 100,
        trailingLossLimitPercent: 0.04,
      },
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [{ armPercent: 0.05, trailPercent: 0.02 }],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTtpStopLoss).toBeCloseTo(102.5, 8);
    expect(result.dynamicTslStopLoss).toBeCloseTo(102, 8);
  });

  it('renders negative trailing-loss TSL state instead of hiding an armed loss-side stop', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'SHORT',
      entryPrice: 2291.37,
      quantity: 0.036,
      leverage: 15,
      marginUsed: 5.49,
      unrealizedPnl: -1.71,
      marketPrice: 2338.9,
      stateEntryPrice: 2291.37,
      runtimeState: {
        averageEntryPrice: 2291.37,
        quantity: 0.036,
        currentAdds: 2,
        trailingAnchorPrice: 2291.37,
        trailingLossLimitPercent: -0.03,
        lastDcaPrice: 2310.26,
      },
      trailingTakeProfitLevels: [],
      trailingStopLevels: [],
      allowStrategyProtectionFallback: true,
    });

    expect(result.dynamicTtpStopLoss).toBeNull();
    expect(result.dynamicTslStopLoss).toBeCloseTo(2295.945, 6);
  });

  it('hides dynamic TSL while loss-side DCA levels remain pending', () => {
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
        currentAdds: 2,
        trailingAnchorPrice: 105,
        trailingLossLimitPercent: -0.03,
      },
      trailingTakeProfitLevels: [],
      trailingStopLevels: [{ armPercent: 0.2, trailPercent: 0.04 }],
      allowStrategyProtectionFallback: true,
      allowTrailingStopProtection: false,
    });

    expect(result.dynamicTslStopLoss).toBeNull();
  });

  it('hides dynamic TTP while profit-side DCA levels remain pending', () => {
    const result = resolveRuntimePositionDynamicStops({
      positionSide: 'LONG',
      entryPrice: 100,
      quantity: 1,
      leverage: 2,
      unrealizedPnl: null,
      marketPrice: 106,
      stateEntryPrice: 100,
      runtimeState: {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 106,
        trailingTakeProfitHighPercent: 0.11,
        trailingTakeProfitStepPercent: 0.01,
      },
      trailingTakeProfitLevels: [{ armPercent: 0.04, trailPercent: 0.01 }],
      trailingStopLevels: [],
      allowStrategyProtectionFallback: true,
      allowTrailingTakeProfitProtection: false,
    });

    expect(result.dynamicTtpStopLoss).toBeNull();
    expect(result.dynamicTtpStopLossSource).toBeNull();
  });
});
