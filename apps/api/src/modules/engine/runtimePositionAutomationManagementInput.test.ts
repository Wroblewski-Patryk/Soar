import { describe, expect, it } from 'vitest';
import { evaluatePositionManagement } from './positionManagement.service';
import { PositionManagementInput } from './positionManagement.types';
import { buildManagementPassInput, guardPausedFundsExhaustion } from './runtimePositionAutomationManagementInput';

const evaluatePausedWithExhaustedFunds = (input: PositionManagementInput) => {
  const state = { quantity: 1, averageEntryPrice: 100, currentAdds: 0 };
  const passInput = buildManagementPassInput(input, null, true);
  return guardPausedFundsExhaustion({ paused: true, fundsExhausted: true,
    input, state, result: evaluatePositionManagement(passInput, state) });
};

describe('paused LIVE management with unavailable DCA funds', () => {
  it('retains a reached positive add ahead of TP rather than releasing the close', () => {
    const result = evaluatePausedWithExhaustedFunds({
      side: 'LONG', currentPrice: 112, takeProfitPrice: 110,
      dca: { enabled: true, maxAdds: 2, stepPercent: 0.1, addSizeFraction: 1,
        levelPercents: [0.1, -0.3], addSizeFractions: [1, 1] },
    });
    expect(result.dcaExecuted).toBe(true);
    expect(result.dcaLevelIndex).toBe(0);
  });

  it('allows only SL for a reached loss add when funds are exhausted', () => {
    const dca = { enabled: true, maxAdds: 1, stepPercent: 0.3, addSizeFraction: 1,
      levelPercents: [-0.3], addSizeFractions: [1] };
    const sl = evaluatePausedWithExhaustedFunds({
      side: 'LONG', currentPrice: 69.5, stopLossPrice: 80, dca,
    });
    const tsl = evaluatePausedWithExhaustedFunds({
      side: 'LONG', currentPrice: 69.5, dca,
      trailingLoss: { enabled: true, startPercent: -0.1, stepPercent: 0.05 },
    });
    expect(sl.closeReason).toBe('stop_loss');
    expect(sl.dcaExecuted).toBe(false);
    expect(tsl.shouldClose).toBe(false);
  });

  it('preserves an ordinary TP when pending DCA is loss-side and not reached', () => {
    const result = evaluatePausedWithExhaustedFunds({
      side: 'LONG', currentPrice: 112, takeProfitPrice: 110,
      dca: { enabled: true, maxAdds: 1, stepPercent: 0.3, addSizeFraction: 1,
        levelPercents: [-0.3], addSizeFractions: [1] },
    });
    expect(result.closeReason).toBe('take_profit');
    expect(result.dcaExecuted).toBe(false);
  });
});
