import { describe, expect, it, vi } from 'vitest';
import { LivePositionReconciliationLoop } from './livePositionReconciliationLoop';

describe('LivePositionReconciliationLoop overlap protection', () => {
  it('does not overlap slow reconciliation runs', async () => {
    let release: (() => void) | undefined;
    let invocation = 0;
    const reconcile = vi.fn(async () => {
      invocation += 1;
      if (invocation === 1) {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
      }
      return { openPositionsSeen: 1 };
    });
    const loop = new LivePositionReconciliationLoop(reconcile, 1_000);

    const first = loop.runOnce();
    await loop.runOnce();
    expect(reconcile).toHaveBeenCalledTimes(1);

    release?.();
    await first;
    await loop.runOnce();
    expect(reconcile).toHaveBeenCalledTimes(2);
  });
});
