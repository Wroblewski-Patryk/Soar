import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  recordRuntimeDcaFundsExhaustedTelemetry,
  recordRuntimeProtectionCloseDecisionTelemetry,
} from './runtimePositionAutomationTelemetry';
import { RuntimePositionStateStore } from './runtimePositionState.store';

describe('runtime position automation telemetry helpers', () => {
  it('records DCA funds exhausted telemetry with pretrade-blocked event shape', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);
    const eventAt = new Date('2026-06-06T12:00:00.000Z');

    await recordRuntimeDcaFundsExhaustedTelemetry({
      recordRuntimeEvent,
      userId: 'user-1',
      botId: 'bot-1',
      mode: 'LIVE',
      symbol: 'ETHUSDT',
      strategyId: 'strategy-1',
      side: 'LONG',
      eventAt,
      currentAdds: 2,
      dcaLevelCount: 3,
      estimatedAddedQuantity: 0.25,
      markPrice: 3_500,
      leverage: 5,
    });

    expect(recordRuntimeEvent).toHaveBeenCalledWith({
      userId: 'user-1',
      botId: 'bot-1',
      mode: 'LIVE',
      eventType: 'PRETRADE_BLOCKED',
      level: 'WARN',
      symbol: 'ETHUSDT',
      strategyId: 'strategy-1',
      signalDirection: 'LONG',
      message: 'Runtime DCA funds exhausted; close protections may execute',
      payload: {
        reason: 'dca_funds_exhausted',
        currentAdds: 2,
        dcaLevelCount: 3,
        estimatedAddedQuantity: 0.25,
        markPrice: 3_500,
        leverage: 5,
      },
      eventAt,
    });
  });

  it('records protection close decision telemetry with exit signal shape', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);
    const eventAt = new Date('2026-06-06T12:01:00.000Z');

    await recordRuntimeProtectionCloseDecisionTelemetry({
      recordRuntimeEvent,
      userId: 'user-1',
      botId: 'bot-1',
      mode: 'PAPER',
      positionId: 'position-1',
      symbol: 'ETHUSDT',
      strategyId: null,
      eventAt,
      closeReason: 'trailing_stop',
      currentAdds: 1,
      dcaLevelCount: 4,
      dcaFundsExhausted: true,
      estimatedAddedQuantity: 0.5,
      markPrice: 3_400,
      leverage: 3,
      currentPnlFraction: undefined,
    });

    expect(recordRuntimeEvent).toHaveBeenCalledWith({
      userId: 'user-1',
      botId: 'bot-1',
      mode: 'PAPER',
      eventType: 'SIGNAL_DECISION',
      level: 'INFO',
      symbol: 'ETHUSDT',
      strategyId: undefined,
      signalDirection: 'EXIT',
      message: 'Runtime protection close decision',
      payload: {
        positionId: 'position-1',
        reason: 'trailing_stop',
        currentAdds: 1,
        dcaLevelCount: 4,
        dcaFundsExhausted: true,
        estimatedAddedQuantity: 0.5,
        markPrice: 3_400,
        leverage: 3,
        currentPnlFraction: null,
      },
      eventAt,
    });
  });

  it('does not record telemetry when bot ownership is missing', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);

    await recordRuntimeDcaFundsExhaustedTelemetry({
      recordRuntimeEvent,
      userId: 'user-1',
      botId: null,
      mode: 'LIVE',
      symbol: 'ETHUSDT',
      side: 'SHORT',
      eventAt: new Date(),
      currentAdds: 1,
      dcaLevelCount: 2,
      estimatedAddedQuantity: 0.1,
      markPrice: 3_500,
      leverage: 5,
    });
    await recordRuntimeProtectionCloseDecisionTelemetry({
      recordRuntimeEvent,
      userId: 'user-1',
      botId: undefined,
      mode: 'LIVE',
      positionId: 'position-1',
      symbol: 'ETHUSDT',
      eventAt: new Date(),
      currentAdds: 1,
      dcaLevelCount: 2,
      dcaFundsExhausted: false,
      estimatedAddedQuantity: 0.1,
      markPrice: 3_500,
      leverage: 5,
    });

    expect(recordRuntimeEvent).not.toHaveBeenCalled();
  });
});

describe('RuntimePositionStateStore persisted state normalization', () => {
  const previousNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = previousNodeEnv;
  });

  it('normalizes non-negative integer runtime state through public store helpers', async () => {
    const store = new RuntimePositionStateStore();

    await store.setPositionRuntimeState('position-normalized', {
      quantity: 2,
      averageEntryPrice: 100,
      currentAdds: -3.8,
      executedDcaLevelIndices: [3.9, -2.1, 1.2, 3.1, Number.POSITIVE_INFINITY, Number.NaN] as any,
      trailingAnchorPrice: 90,
    });

    await expect(store.getPositionRuntimeState('position-normalized')).resolves.toEqual({
      quantity: 2,
      averageEntryPrice: 100,
      currentAdds: 0,
      executedDcaLevelIndices: [0, 1, 3],
      trailingAnchorPrice: 90,
      trailingLossLimitPercent: undefined,
      trailingTakeProfitHighPercent: undefined,
      trailingTakeProfitStepPercent: undefined,
      lastDcaPrice: undefined,
    });
  });

  it('floors positive fractional current add counts and rejects invalid basis payloads', async () => {
    const store = new RuntimePositionStateStore();

    await store.setPositionRuntimeState('position-current-adds', {
      quantity: 2,
      averageEntryPrice: 100,
      currentAdds: 2.9,
    });
    await store.setPositionRuntimeState('position-invalid', {
      quantity: 0,
      averageEntryPrice: 100,
      currentAdds: 4,
    });

    await expect(store.getPositionRuntimeState('position-current-adds')).resolves.toEqual(
      expect.objectContaining({
        currentAdds: 2,
      })
    );
    await expect(store.getPositionRuntimeState('position-invalid')).resolves.toBeNull();
  });
});
