import { describe, expect, it } from 'vitest';
import { resolvePositionPnlFraction } from './positionPnlSemantics';
import { evaluatePositionManagement } from './positionManagement.service';

describe('position management', () => {
  it('closes position on take-profit hit', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 110,
        takeProfitPrice: 108,
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('take_profit');
  });

  it('closes position on stop-loss hit', () => {
    const result = evaluatePositionManagement(
      {
        side: 'SHORT',
        currentPrice: 106,
        stopLossPrice: 105,
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('stop_loss');
  });

  it('updates trailing anchor and closes when trailing threshold is crossed', () => {
    const first = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 110,
        trailingStop: {
          enabled: true,
          type: 'percent',
          value: 0.05,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const second = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 104,
        trailingStop: {
          enabled: true,
          type: 'percent',
          value: 0.05,
        },
      },
      first.nextState
    );

    expect(first.shouldClose).toBe(false);
    expect(first.nextState.trailingAnchorPrice).toBe(110);
    expect(second.shouldClose).toBe(true);
    expect(second.closeReason).toBe('trailing_stop');
  });

  it('closes on trailing take-profit after arm level and pullback', () => {
    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 106,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.02,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const closed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 103.8,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.02,
        },
      },
      armed.nextState
    );

    expect(armed.shouldClose).toBe(false);
    expect(closed.shouldClose).toBe(true);
    expect(closed.closeReason).toBe('trailing_take_profit');
  });

  it('executes DCA and recalculates quantity and average entry', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 94,
        dca: {
          enabled: true,
          maxAdds: 2,
          stepPercent: 0.05,
          addSizeFraction: 0.5,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 2,
        currentAdds: 0,
      }
    );

    expect(result.shouldClose).toBe(false);
    expect(result.dcaExecuted).toBe(true);
    expect(result.dcaAddedQuantity).toBe(1);
    expect(result.nextState.quantity).toBe(3);
    expect(result.nextState.averageEntryPrice).toBe(98);
    expect(result.nextState.currentAdds).toBe(1);
    expect(result.nextState.lastDcaPrice).toBe(94);
  });

  it('uses canonical currentPnlFraction when provided instead of leveraged-price fallback', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 90,
        leverage: 10,
        currentPnlFraction: -0.19,
        dca: {
          enabled: true,
          maxAdds: 1,
          levelPercents: [-0.25],
          addSizeFractions: [1],
          stepPercent: 0.25,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    expect(result.dcaExecuted).toBe(false);
    expect(result.nextState.currentAdds).toBe(0);
  });

  it('evaluates next DCA level against updated average entry (not last dca price)', () => {
    const first = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 90,
        leverage: 1,
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.1, -0.1],
          addSizeFractions: [1, 1],
          stepPercent: 0.1,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    // After first add at 90 with multiplier 1x:
    // average entry becomes 95. Next -10% threshold from average is 85.5.
    // Price 84 should trigger second DCA by average-entry logic.
    const second = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 84,
        leverage: 1,
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.1, -0.1],
          addSizeFractions: [1, 1],
          stepPercent: 0.1,
          addSizeFraction: 1,
        },
      },
      first.nextState
    );

    expect(first.dcaExecuted).toBe(true);
    expect(first.nextState.averageEntryPrice).toBe(95);
    expect(second.dcaExecuted).toBe(true);
    expect(second.nextState.currentAdds).toBe(2);
  });

  it('sizes repeated USDT DCA from confirmed contribution and resumes at the new average', () => {
    const dca = {
      enabled: true,
      maxAdds: 2,
      stepPercent: 0.305,
      addSizeFraction: 2,
      levelPercents: [-0.305, -0.305],
      addSizeFractions: [2, 2],
      sizingBasis: 'usdt_contribution_v1' as const,
    };
    const firstPrice = 0.695;
    const first = evaluatePositionManagement(
      { side: 'LONG', currentPrice: firstPrice, leverage: 1, dca },
      { averageEntryPrice: 1, quantity: 1, currentAdds: 0 },
    );
    expect(first.dcaExecuted).toBe(true);
    expect(first.dcaAddedQuantity * firstPrice).toBeCloseTo(2, 4);
    expect(first.nextState.averageEntryPrice * first.nextState.quantity).toBeCloseTo(3, 4);
    expect(resolvePositionPnlFraction({
      side: 'LONG', entryPrice: first.nextState.averageEntryPrice,
      quantity: first.nextState.quantity, currentPrice: firstPrice, leverage: 1,
    })).toBeCloseTo(-0.1016667, 4);

    const resumedState = JSON.parse(JSON.stringify(first.nextState));
    const secondPrice = first.nextState.averageEntryPrice * (1 - 0.305);
    const second = evaluatePositionManagement(
      { side: 'LONG', currentPrice: secondPrice, leverage: 1, dca },
      resumedState,
    );
    expect(second.dcaExecuted).toBe(true);
    expect(second.dcaAddedQuantity * secondPrice).toBeCloseTo(6, 4);
    expect(second.nextState.averageEntryPrice * second.nextState.quantity).toBeCloseTo(9, 4);
    expect(second.nextState.currentAdds).toBe(2);
    expect(resolvePositionPnlFraction({
      side: 'LONG', entryPrice: second.nextState.averageEntryPrice,
      quantity: second.nextState.quantity, currentPrice: secondPrice, leverage: 1,
    })).toBeCloseTo(-0.1016667, 4);
    expect(evaluatePositionManagement(
      { side: 'LONG', currentPrice: secondPrice, leverage: 1, dca },
      JSON.parse(JSON.stringify(second.nextState)),
    ).dcaExecuted).toBe(false);
  });

  it('defers SL after the final basic USDT add until ROI is measured from its new average', () => {
    const dca = { enabled: true, maxAdds: 2, stepPercent: 0.3,
      addSizeFraction: 1, levelPercents: [-0.3, -0.3],
      addSizeFractions: [1, 1], sizingBasis: 'usdt_contribution_v1' as const };
    const first = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 0.7, stopLossPrice: 0.8, dca },
      { averageEntryPrice: 1, quantity: 1, currentAdds: 0 },
    );
    expect(first.dcaExecuted).toBe(true);
    expect(first.shouldClose).toBe(false);

    const secondPrice = first.nextState.averageEntryPrice * 0.7;
    const second = evaluatePositionManagement(
      { side: 'LONG', currentPrice: secondPrice,
        stopLossPrice: first.nextState.averageEntryPrice * 0.8, dca },
      JSON.parse(JSON.stringify(first.nextState)),
    );
    expect(second.dcaExecuted).toBe(true);
    expect(second.nextState.currentAdds).toBe(2);
    expect(second.shouldClose).toBe(false);

    const filledState = JSON.parse(JSON.stringify(second.nextState));
    const newStopLossPrice = filledState.averageEntryPrice * 0.8;
    const resumed = evaluatePositionManagement(
      { side: 'LONG', currentPrice: secondPrice, stopLossPrice: newStopLossPrice, dca },
      filledState,
    );
    expect(resumed.dcaExecuted).toBe(false);
    expect(resumed.shouldClose).toBe(false);

    const crossed = evaluatePositionManagement(
      { side: 'LONG', currentPrice: newStopLossPrice - 0.0001,
        stopLossPrice: newStopLossPrice, dca },
      resumed.nextState,
    );
    expect(crossed.shouldClose).toBe(true);
    expect(crossed.closeReason).toBe('stop_loss');
  });

  it('gates USDT TP/TTP by pending profit adds and SL/TSL by pending loss adds', () => {
    const dca = { enabled: true, maxAdds: 2, stepPercent: 0.3,
      addSizeFraction: 1, levelPercents: [0.3, -0.3],
      addSizeFractions: [1, 1], sizingBasis: 'usdt_contribution_v1' as const };
    const base = { averageEntryPrice: 1, quantity: 1, currentAdds: 0 };
    const tp = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 1.1, takeProfitPrice: 1.05, dca }, base,
    );
    const ttp = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 1.1, dca,
        trailingTakeProfit: { enabled: true, armPercent: 0.05, trailPercent: 0.05 } },
      { ...base, trailingTakeProfitHighPercent: 0.2, trailingTakeProfitStepPercent: 0.05 },
    );
    const sl = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 0.9, stopLossPrice: 0.95, dca }, base,
    );
    const tsl = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 0.9, dca,
        trailingLoss: { enabled: true, startPercent: -0.03, stepPercent: 0.02 } },
      { ...base, trailingLossLimitPercent: -0.05 },
    );
    for (const blocked of [tp, ttp, sl, tsl]) {
      expect(blocked.dcaExecuted).toBe(false);
      expect(blocked.shouldClose).toBe(false);
    }

    const slWithProfitPending = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 0.9, stopLossPrice: 0.95, dca },
      { ...base, currentAdds: 1, executedDcaLevelIndices: [1] },
    );
    const tpWithLossPending = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 1.1, takeProfitPrice: 1.05, dca },
      { ...base, currentAdds: 1, executedDcaLevelIndices: [0] },
    );
    expect(slWithProfitPending.closeReason).toBe('stop_loss');
    expect(tpWithLossPending.closeReason).toBe('take_profit');
  });

  it('keeps advanced USDT level multipliers paired and leaves legacy quantity sizing unchanged', () => {
    const dca = {
      enabled: true,
      maxAdds: 2,
      stepPercent: 0.2,
      addSizeFraction: 1,
      levelPercents: [-0.2, -0.3],
      addSizeFractions: [1, 0.5],
      sizingBasis: 'usdt_contribution_v1' as const,
    };
    const first = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 0.8, leverage: 1, dca },
      { averageEntryPrice: 1, quantity: 1, currentAdds: 0 },
    );
    const secondPrice = first.nextState.averageEntryPrice * 0.7;
    const second = evaluatePositionManagement(
      { side: 'LONG', currentPrice: secondPrice, leverage: 1, dca },
      first.nextState,
    );
    expect(first.dcaAddedQuantity * 0.8).toBeCloseTo(1, 4);
    expect(first.nextState.averageEntryPrice * first.nextState.quantity).toBeCloseTo(2, 4);
    expect(second.dcaAddedQuantity * secondPrice).toBeCloseTo(1, 4);
    expect(second.nextState.averageEntryPrice * second.nextState.quantity).toBeCloseTo(3, 4);
    expect(resolvePositionPnlFraction({
      side: 'LONG', entryPrice: second.nextState.averageEntryPrice,
      quantity: second.nextState.quantity, currentPrice: secondPrice, leverage: 1,
    })).toBeCloseTo(-0.2, 4);

    const legacy = evaluatePositionManagement(
      { side: 'LONG', currentPrice: 0.8, leverage: 1, dca: { ...dca, sizingBasis: undefined } },
      { averageEntryPrice: 1, quantity: 1, currentAdds: 0 },
    );
    expect(legacy.dcaAddedQuantity).toBe(1);
    expect(legacy.nextState.averageEntryPrice * legacy.nextState.quantity).toBeCloseTo(1.8, 5);
  });

  it('keeps USDT add notional independent of leverage while ROI uses leveraged margin', () => {
    const price = 0.8475;
    const result = evaluatePositionManagement(
      { side: 'LONG', currentPrice: price, leverage: 2, dca: {
        enabled: true, maxAdds: 1, stepPercent: 0.305, addSizeFraction: 2,
        levelPercents: [-0.305], addSizeFractions: [2],
        sizingBasis: 'usdt_contribution_v1',
      } },
      { averageEntryPrice: 1, quantity: 1, currentAdds: 0 },
    );

    expect(result.dcaAddedQuantity * price).toBeCloseTo(2, 4);
    expect(result.nextState.averageEntryPrice * result.nextState.quantity).toBeCloseTo(3, 4);
    expect(resolvePositionPnlFraction({
      side: 'LONG', entryPrice: result.nextState.averageEntryPrice,
      quantity: result.nextState.quantity, currentPrice: price, leverage: 2,
    })).toBeCloseTo(-0.1016667, 4);
  });

  it('applies DCA before TP and keeps TP blocked while profit-side DCA remains pending', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 110,
        takeProfitPrice: 108,
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [0.05, 0.2],
          addSizeFractions: [0.5, 0.5],
          stepPercent: 0.05,
          addSizeFraction: 0.5,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 2,
        currentAdds: 0,
      }
    );

    expect(result.dcaExecuted).toBe(true);
    expect(result.dcaAddedQuantity).toBe(1);
    expect(result.nextState.currentAdds).toBe(1);
    expect(result.shouldClose).toBe(false);
    expect(result.closeReason).toBeUndefined();
  });

  it('allows TP when remaining DCA levels are loss-side only', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 110,
        takeProfitPrice: 108,
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, -0.4],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 2,
        currentAdds: 0,
      }
    );

    expect(result.dcaExecuted).toBe(false);
    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('take_profit');
  });

  it('executes positive and negative DCA lanes independently from closest threshold', () => {
    const profitAdd = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 120,
        leverage: 1,
        dca: {
          enabled: true,
          maxAdds: 4,
          levelPercents: [0.2, 0.4, -0.2, -0.4],
          addSizeFractions: [1, 1, 1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const lossAdd = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 75,
        leverage: 1,
        currentPnlFraction: -0.25,
        dca: {
          enabled: true,
          maxAdds: 4,
          levelPercents: [0.2, 0.4, -0.2, -0.4],
          addSizeFractions: [1, 1, 1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      profitAdd.nextState
    );

    expect(profitAdd.dcaExecuted).toBe(true);
    expect(profitAdd.dcaLevelIndex).toBe(0);
    expect(profitAdd.nextState.executedDcaLevelIndices).toEqual([0]);
    expect(lossAdd.dcaExecuted).toBe(true);
    expect(lossAdd.dcaLevelIndex).toBe(2);
    expect(lossAdd.nextState.currentAdds).toBe(2);
    expect(lossAdd.nextState.executedDcaLevelIndices).toEqual([0, 2]);
  });

  it('keeps trailing take-profit blocked until profit-side DCA sequence is completed (or funds exhausted)', () => {
    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 120,
        leverage: 10,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [3, 4],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const closed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 115,
        leverage: 10,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [3, 4],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      armed.nextState
    );

    expect(armed.shouldClose).toBe(false);
    expect(closed.shouldClose).toBe(false);
    expect(closed.closeReason).toBeUndefined();
  });

  it('allows trailing take-profit when remaining DCA levels are loss-side only', () => {
    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 120,
        leverage: 10,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, -0.2],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const closed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 115,
        leverage: 10,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, -0.2],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      armed.nextState
    );

    expect(armed.shouldClose).toBe(false);
    expect(closed.shouldClose).toBe(true);
    expect(closed.closeReason).toBe('trailing_take_profit');
  });

  it('keeps trailing take-profit blocked when remaining DCA levels are still profit-side', () => {
    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 120,
        leverage: 10,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [3, 4],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const closed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 115,
        leverage: 10,
        trailingTakeProfit: {
          enabled: true,
          armPercent: 0.05,
          trailPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [3, 4],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      armed.nextState
    );

    expect(armed.shouldClose).toBe(false);
    expect(closed.shouldClose).toBe(false);
    expect(closed.closeReason).toBeUndefined();
  });

  it('keeps trailing stop blocked until DCA sequence is completed (or funds exhausted)', () => {
    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 90,
        leverage: 10,
        trailingLoss: {
          enabled: true,
          startPercent: -0.25,
          stepPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, -0.2],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const closed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 92,
        leverage: 10,
        trailingLoss: {
          enabled: true,
          startPercent: -0.25,
          stepPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, -0.2],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      armed.nextState
    );

    expect(closed.shouldClose).toBe(false);
    expect(closed.closeReason).toBeUndefined();
  });

  it('keeps stop loss blocked while pending DCA remains financially possible', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 98.5,
        leverage: 10,
        stopLossPrice: 99,
        dcaFundsExhausted: false,
        dca: {
          enabled: true,
          maxAdds: 3,
          levelPercents: [-0.2, -0.4, -0.6],
          addSizeFractions: [1, 1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 4,
        currentAdds: 2,
      }
    );

    expect(result.shouldClose).toBe(false);
    expect(result.closeReason).toBeUndefined();
  });

  it('allows stop loss when pending DCA is explicitly funds-exhausted', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 98.5,
        leverage: 10,
        stopLossPrice: 99,
        dcaFundsExhausted: true,
        dca: {
          enabled: true,
          maxAdds: 3,
          levelPercents: [-0.2, -0.4, -0.6],
          addSizeFractions: [1, 1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 4,
        currentAdds: 2,
      }
    );

    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('stop_loss');
  });

  it('allows stop loss when remaining DCA levels are profit-side only', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 98.5,
        leverage: 10,
        stopLossPrice: 99,
        dcaFundsExhausted: false,
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, 0.2],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 2,
        currentAdds: 1,
        executedDcaLevelIndices: [0],
      }
    );

    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('stop_loss');
  });

  it('keeps trailing loss blocked while pending DCA remains financially possible', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 98.5,
        leverage: 10,
        dcaFundsExhausted: false,
        trailingLoss: {
          enabled: true,
          startPercent: -0.2,
          stepPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 3,
          levelPercents: [-0.2, -0.4, -0.6],
          addSizeFractions: [1, 1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 4,
        currentAdds: 2,
        trailingLossLimitPercent: -0.1,
      }
    );

    expect(result.shouldClose).toBe(false);
    expect(result.closeReason).toBeUndefined();
  });

  it('allows trailing loss when pending DCA is explicitly funds-exhausted', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 98.5,
        leverage: 10,
        dcaFundsExhausted: true,
        trailingLoss: {
          enabled: true,
          startPercent: -0.2,
          stepPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 3,
          levelPercents: [-0.2, -0.4, -0.6],
          addSizeFractions: [1, 1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 4,
        currentAdds: 2,
        trailingLossLimitPercent: -0.1,
      }
    );

    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('trailing_stop');
  });

  it('allows trailing loss when remaining DCA levels are profit-side only', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 98.5,
        leverage: 10,
        dcaFundsExhausted: false,
        trailingLoss: {
          enabled: true,
          startPercent: -0.2,
          stepPercent: 0.1,
        },
        dca: {
          enabled: true,
          maxAdds: 2,
          levelPercents: [-0.2, 0.2],
          addSizeFractions: [1, 1],
          stepPercent: 0.2,
          addSizeFraction: 1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 2,
        currentAdds: 1,
        executedDcaLevelIndices: [0],
        trailingLossLimitPercent: -0.1,
      }
    );

    expect(result.shouldClose).toBe(true);
    expect(result.closeReason).toBe('trailing_stop');
  });

  it('applies legacy trailing-loss on profit percent after DCA completion', () => {
    const activated = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 90,
        leverage: 10,
        trailingLoss: {
          enabled: true,
          startPercent: -0.25,
          stepPercent: 0.1,
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 1,
      }
    );

    const movedUp = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 96,
        leverage: 10,
        trailingLoss: {
          enabled: true,
          startPercent: -0.25,
          stepPercent: 0.1,
        },
      },
      activated.nextState
    );

    const closed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 92,
        leverage: 10,
        trailingLoss: {
          enabled: true,
          startPercent: -0.25,
          stepPercent: 0.1,
        },
      },
      movedUp.nextState
    );

    expect(activated.nextState.trailingLossLimitPercent).toBeDefined();
    expect(closed.shouldClose).toBe(true);
    expect(closed.closeReason).toBe('trailing_stop');
  });

  it('clears trailing-loss tracker when TTP becomes active (legacy TTP/TSL exclusivity)', () => {
    const result = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 106,
        trailingTakeProfitLevels: [
          {
            armPercent: 0.05,
            trailPercent: 0.02,
          },
        ],
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
        trailingAnchorPrice: 106,
        trailingLossLimitPercent: -0.1,
      }
    );

    expect(result.shouldClose).toBe(false);
    expect(result.nextState.trailingLossLimitPercent).toBeUndefined();
  });

  it('keeps TTP armed once triggered and closes on pullback while still above base floor', () => {
    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 112,
        leverage: 1,
        trailingTakeProfitLevels: [
          {
            armPercent: 0.1,
            trailPercent: 0.05,
          },
        ],
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      },
    );

    const pulledBackWithinTunnel = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 106.8,
        leverage: 1,
        trailingTakeProfitLevels: [
          {
            armPercent: 0.1,
            trailPercent: 0.05,
          },
        ],
      },
      armed.nextState,
    );

    expect(armed.shouldClose).toBe(false);
    expect(pulledBackWithinTunnel.shouldClose).toBe(true);
    expect(pulledBackWithinTunnel.closeReason).toBe('trailing_take_profit');
    expect(pulledBackWithinTunnel.nextState.trailingTakeProfitHighPercent).toBeCloseTo(0.12, 5);
    expect(pulledBackWithinTunnel.nextState.trailingTakeProfitStepPercent).toBeCloseTo(0.05, 5);
  });

  it('keeps TTP armed instead of disarming below the first base floor when close is still blocked', () => {
    const levels = [{ armPercent: 0.1, trailPercent: 0.05 }];

    const armed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 112,
        leverage: 1,
        trailingTakeProfitLevels: levels,
        dca: {
          enabled: true,
          maxAdds: 1,
          stepPercent: 0.1,
          addSizeFraction: 0.5,
          levelPercents: [0.15],
        },
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      }
    );

    const disarmed = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 104,
        leverage: 1,
        trailingTakeProfitLevels: levels,
        dca: {
          enabled: true,
          maxAdds: 1,
          stepPercent: 0.1,
          addSizeFraction: 0.5,
          levelPercents: [0.15],
        },
      },
      armed.nextState
    );

    expect(armed.shouldClose).toBe(false);
    expect(disarmed.shouldClose).toBe(false);
    expect(disarmed.nextState.trailingTakeProfitHighPercent).toBeCloseTo(0.12, 5);
    expect(disarmed.nextState.trailingTakeProfitStepPercent).toBeCloseTo(0.05, 5);
  });

  it('keeps TTP tunnel monotonic when switching to higher threshold with wider step', () => {
    const levels = [
      { armPercent: 0.1, trailPercent: 0.05 },
      { armPercent: 0.2, trailPercent: 0.1 },
    ];

    const at19 = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 119,
        leverage: 1,
        trailingTakeProfitLevels: levels,
      },
      {
        averageEntryPrice: 100,
        quantity: 1,
        currentAdds: 0,
      },
    );

    const at23 = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 123,
        leverage: 1,
        trailingTakeProfitLevels: levels,
      },
      at19.nextState,
    );

    const at25 = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 125,
        leverage: 1,
        trailingTakeProfitLevels: levels,
      },
      at23.nextState,
    );

    const closeAt14 = evaluatePositionManagement(
      {
        side: 'LONG',
        currentPrice: 114,
        leverage: 1,
        trailingTakeProfitLevels: levels,
      },
      at25.nextState,
    );

    expect(at23.shouldClose).toBe(false);
    expect(at23.nextState.trailingTakeProfitHighPercent).toBeCloseTo(0.19, 5);
    expect(at23.nextState.trailingTakeProfitStepPercent).toBeCloseTo(0.05, 5);
    expect(at25.nextState.trailingTakeProfitHighPercent).toBeCloseTo(0.25, 5);
    expect(at25.nextState.trailingTakeProfitStepPercent).toBeCloseTo(0.1, 5);
    expect(closeAt14.shouldClose).toBe(true);
    expect(closeAt14.closeReason).toBe('trailing_take_profit');
  });
});
