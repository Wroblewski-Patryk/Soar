import { describe, expect, it } from 'vitest';

import { buildBotlessWalletTradeFallbackWhere } from './runtimeSessionPositionsRead.service';
import { resolveRuntimePositionDcaCount } from './runtimeSessionPositionDcaCount';

describe('buildBotlessWalletTradeFallbackWhere', () => {
  it('does not include botless wallet trades for PAPER runtime position reads', () => {
    expect(
      buildBotlessWalletTradeFallbackWhere({
        mode: 'PAPER',
        walletId: 'wallet-paper-1',
        symbols: ['BTCUSDT'],
        windowStart: new Date('2026-05-04T10:00:00.000Z'),
        windowEnd: new Date('2026-05-04T11:00:00.000Z'),
      })
    ).toEqual([]);
  });

  it('keeps botless wallet trade fallback for LIVE runtime recovery reads', () => {
    const windowStart = new Date('2026-05-04T10:00:00.000Z');
    const windowEnd = new Date('2026-05-04T11:00:00.000Z');

    expect(
      buildBotlessWalletTradeFallbackWhere({
        mode: 'LIVE',
        walletId: 'wallet-live-1',
        symbols: ['BTCUSDT', 'ETHUSDT'],
        windowStart,
        windowEnd,
      })
    ).toEqual([
      {
        botId: null,
        walletId: 'wallet-live-1',
        managementMode: 'BOT_MANAGED',
        symbol: { in: ['BTCUSDT', 'ETHUSDT'] },
        executedAt: {
          gte: windowStart,
          lte: windowEnd,
        },
      },
    ]);
  });
});

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
