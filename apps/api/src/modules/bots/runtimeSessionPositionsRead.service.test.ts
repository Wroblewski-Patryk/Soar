import { describe, expect, it } from 'vitest';

import { resolveRuntimePositionDcaCount } from './runtimeSessionPositionDcaCount';

describe('resolveRuntimePositionDcaCount', () => {
  it('does not count duplicate same-order OPEN rows as DCA progress', () => {
    const dcaCount = resolveRuntimePositionDcaCount({
      entryLegs: [
        { id: 'runtime-open', orderId: 'order-1', lifecycleAction: 'OPEN' },
        { id: 'exchange-open', orderId: 'order-1', lifecycleAction: 'OPEN' },
      ],
      explicitDcaTradeCount: 0,
      runtimeStateCurrentAdds: null,
    });

    expect(dcaCount).toBe(0);
  });

  it('keeps explicit DCA rows and runtime state progress visible', () => {
    expect(
      resolveRuntimePositionDcaCount({
        entryLegs: [
          { id: 'open', orderId: 'order-1', lifecycleAction: 'OPEN' },
          { id: 'dca', orderId: 'order-2', lifecycleAction: 'DCA' },
        ],
        explicitDcaTradeCount: 1,
        runtimeStateCurrentAdds: null,
      })
    ).toBe(1);

    expect(
      resolveRuntimePositionDcaCount({
        entryLegs: [{ id: 'open', orderId: 'order-1', lifecycleAction: 'OPEN' }],
        explicitDcaTradeCount: 0,
        runtimeStateCurrentAdds: 2,
      })
    ).toBe(2);
  });
});
