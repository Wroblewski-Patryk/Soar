import { describe, expect, it, vi } from 'vitest';
import { runtimeExecutionDedupeService } from '../engine/runtimeExecutionDedupe.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { evaluatePositionManagement } from '../engine/positionManagement.service';
import { syncRuntimeDcaStateFromExchangeFill } from './orders.exchangeEvents.service';

describe('asynchronous DCA fill trailing protection sync', () => {
  it.each([
    ['LONG', 123.0769230769, 130, 125, 126],
    ['SHORT', 80, 70, 75, 74],
  ] as const)('%s preserves the active TTP level and protected market price across restart',
    async (side, nextEntryPrice, safePrice, closePrice, protectedPrice) => {
      const positionId = `async-ttp-${side}`;
      const dedupe = vi.spyOn(runtimeExecutionDedupeService, 'markSucceededByOrderId')
        .mockResolvedValue({ commandFingerprint: { dcaLevelIndex: 0 } } as any);
      try {
        await runtimePositionStateStore.setPositionRuntimeState(positionId, {
          quantity: 1, averageEntryPrice: 100, currentAdds: 0,
          trailingTakeProfitHighPercent: 0.51, trailingTakeProfitStepPercent: 0.25,
          trailingTakeProfitActiveLevelIndex: 1,
        });
        expect(await syncRuntimeDcaStateFromExchangeFill({
          orderId: `async-ttp-order-${side}`, positionId, nextQuantity: 1.3,
          nextEntryPrice, fillPrice: side === 'LONG' ? 200 : 40,
          positionSide: side, leverage: 1,
        })).toBe(true);
        expect(await syncRuntimeDcaStateFromExchangeFill({
          orderId: `async-ttp-order-${side}`, positionId, nextQuantity: 1.3,
          nextEntryPrice, fillPrice: side === 'LONG' ? 200 : 40,
          positionSide: side, leverage: 1,
        })).toBe(true);
        const restored = JSON.parse(JSON.stringify(
          await runtimePositionStateStore.getPositionRuntimeState(positionId)));
        expect(restored.trailingTakeProfitActiveLevelIndex).toBe(1);
        const limit = restored.trailingTakeProfitHighPercent - restored.trailingTakeProfitStepPercent;
        expect(side === 'LONG' ? nextEntryPrice * (1 + limit)
          : nextEntryPrice * (1 - limit)).toBeCloseTo(protectedPrice);
        const input = { side, dcaSizingBasis: 'usdt_contribution_v1' as const,
          trailingTakeProfitLevels: [
            { armPercent: 0.25, trailPercent: 0.12 },
            { armPercent: 0.5, trailPercent: 0.25 },
          ] };
        const safe = evaluatePositionManagement({ ...input, currentPrice: safePrice }, restored);
        expect(safe.shouldClose).toBe(false);
        expect(safe.nextState.trailingTakeProfitActiveLevelIndex).toBe(1);
        expect(evaluatePositionManagement({ ...input, currentPrice: closePrice },
          safe.nextState).closeReason).toBe('trailing_take_profit');
      } finally {
        dedupe.mockRestore();
        await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      }
    });

  it.each([
    ['LONG', 80, 50, 31, 32],
    ['SHORT', 120, 150, 169, 168],
  ] as const)('%s preserves the active TSL level and protected market price across restart',
    async (side, nextEntryPrice, safePrice, closePrice, protectedPrice) => {
      const positionId = `async-tsl-${side}`;
      const dedupe = vi.spyOn(runtimeExecutionDedupeService, 'markSucceededByOrderId')
        .mockResolvedValue({ commandFingerprint: { dcaLevelIndex: 0 } } as any);
      try {
        await runtimePositionStateStore.setPositionRuntimeState(positionId, {
          quantity: 1, averageEntryPrice: 100, currentAdds: 0,
          trailingLossLimitPercent: -0.68, trailingLossActiveLevelIndex: 1,
        });
        expect(await syncRuntimeDcaStateFromExchangeFill({
          orderId: `async-tsl-order-${side}`, positionId, nextQuantity: 1.3,
          nextEntryPrice, fillPrice: side === 'LONG' ? 20 : 180,
          positionSide: side, leverage: 1,
        })).toBe(true);
        const restored = JSON.parse(JSON.stringify(
          await runtimePositionStateStore.getPositionRuntimeState(positionId)));
        expect(restored.trailingLossActiveLevelIndex).toBe(1);
        expect(side === 'LONG' ? nextEntryPrice * (1 + restored.trailingLossLimitPercent)
          : nextEntryPrice * (1 - restored.trailingLossLimitPercent))
          .toBeCloseTo(protectedPrice);
        const input = { side, dcaSizingBasis: 'usdt_contribution_v1' as const,
          trailingLossLevels: [
            { startPercent: -0.5, stepPercent: 0.25 },
            { startPercent: -0.25, stepPercent: 0.12 },
          ] };
        const safe = evaluatePositionManagement({ ...input, currentPrice: safePrice }, restored);
        expect(safe.shouldClose).toBe(false);
        expect(safe.nextState.trailingLossActiveLevelIndex).toBe(1);
        expect(evaluatePositionManagement({ ...input, currentPrice: closePrice },
          safe.nextState).closeReason).toBe('trailing_stop');
      } finally {
        dedupe.mockRestore();
        await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      }
    });

  it('leaves an incomplete protection snapshot pending instead of copying stale ROI', async () => {
    const positionId = 'async-incomplete-protection';
    const dedupe = vi.spyOn(runtimeExecutionDedupeService, 'markSucceededByOrderId')
      .mockResolvedValue({ commandFingerprint: { dcaLevelIndex: 0 } } as any);
    try {
      await runtimePositionStateStore.setPositionRuntimeState(positionId, {
        quantity: 1, averageEntryPrice: 100, currentAdds: 0,
        trailingTakeProfitHighPercent: 0.51,
        trailingTakeProfitActiveLevelIndex: 1,
      });
      expect(await syncRuntimeDcaStateFromExchangeFill({
        orderId: 'async-incomplete-order', positionId, nextQuantity: 1.3,
        nextEntryPrice: 123.0769230769, fillPrice: 200,
        positionSide: 'LONG', leverage: 1,
      })).toBe(false);
      expect(await runtimePositionStateStore.getPositionRuntimeState(positionId))
        .toMatchObject({ quantity: 1, averageEntryPrice: 100,
          trailingTakeProfitHighPercent: 0.51 });
    } finally {
      dedupe.mockRestore();
      await runtimePositionStateStore.deletePositionRuntimeState(positionId);
    }
  });
});
