import { describe, expect, it } from 'vitest';

import { buildRuntimeSymbolLiveOpenPositionScopes } from './botsRuntimeRead.repository';
import {
  selectLatestRunningProjectionRows,
  sumRuntimeAggregateProjectedSymbolsTracked,
} from './runtimeMonitoringAggregateRead.service';
import { buildRuntimeTradeCarryOverWindowClause } from './runtimeSessionTradesRead.service';
import { resolveRuntimePositionDcaCount } from './runtimeSessionPositionDcaCount';
import {
  buildRuntimeSessionClosedPositionWindow,
  buildRuntimeSessionOpenPositionWindow,
} from './runtimeSessionPositionWindow';
import { buildBotlessWalletTradeFallbackWhere } from './runtimeSessionTradeFallbackScope';

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

describe('buildRuntimeSessionClosedPositionWindow', () => {
  it('bounds closed positions by session start and window end', () => {
    const startedAt = new Date('2026-05-04T10:00:00.000Z');
    const windowEnd = new Date('2026-05-04T11:00:00.000Z');

    expect(buildRuntimeSessionClosedPositionWindow({ startedAt, windowEnd })).toEqual({
      gte: startedAt,
      lte: windowEnd,
    });
  });
});

describe('buildRuntimeSessionOpenPositionWindow', () => {
  it('includes carried open positions opened before the session start', () => {
    const windowEnd = new Date('2026-05-04T11:00:00.000Z');

    expect(buildRuntimeSessionOpenPositionWindow({ windowEnd })).toEqual({
      lte: windowEnd,
    });
  });
});

describe('buildRuntimeSymbolLiveOpenPositionScopes', () => {
  it('includes direct bot and owned LIVE imported open-position scopes', () => {
    expect(
      buildRuntimeSymbolLiveOpenPositionScopes({
        botId: 'bot-1',
        walletId: 'wallet-1',
        apiKeyId: 'api-key-1',
        marketType: 'FUTURES',
        ownedExternalSymbols: ['ETHUSDT', 'DOGEUSDT'],
      })
    ).toEqual([
      { botId: 'bot-1' },
      {
        botId: null,
        origin: 'EXCHANGE_SYNC',
        symbol: { in: ['ETHUSDT', 'DOGEUSDT'] },
        AND: [
          {
            OR: [
              {
                externalId: {
                  startsWith: 'api-key-1:FUTURES:',
                },
              },
              {
                externalId: {
                  startsWith: 'api-key-1:ETHUSDT:',
                },
              },
              {
                externalId: {
                  startsWith: 'api-key-1:DOGEUSDT:',
                },
              },
            ],
          },
          {
            OR: [{ walletId: 'wallet-1' }, { walletId: null }],
          },
        ],
      },
    ]);
  });

  it('falls back to direct bot scope when imported ownership is incomplete', () => {
    expect(
      buildRuntimeSymbolLiveOpenPositionScopes({
        botId: 'bot-1',
        walletId: 'wallet-1',
        apiKeyId: null,
        marketType: 'FUTURES',
        ownedExternalSymbols: ['ETHUSDT'],
      })
    ).toEqual([{ botId: 'bot-1' }]);
  });
});

describe('buildRuntimeTradeCarryOverWindowClause', () => {
  it('uses a strict executedAt window when carry-over positions are disabled', () => {
    const rangeStart = new Date('2026-05-04T10:00:00.000Z');
    const rangeEnd = new Date('2026-05-04T11:00:00.000Z');

    expect(
      buildRuntimeTradeCarryOverWindowClause({
        rangeStart,
        rangeEnd,
        shouldIncludeCarryOverPositions: false,
      })
    ).toEqual({
      executedAt: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    });
  });

  it('adds only persisted imported OPEN anchors for carry-over positions', () => {
    const rangeStart = new Date('2026-05-04T10:00:00.000Z');
    const rangeEnd = new Date('2026-05-04T11:00:00.000Z');

    expect(
      buildRuntimeTradeCarryOverWindowClause({
        rangeStart,
        rangeEnd,
        shouldIncludeCarryOverPositions: true,
      })
    ).toEqual({
      OR: [
        {
          executedAt: {
            gte: rangeStart,
            lte: rangeEnd,
          },
        },
        {
          origin: 'EXCHANGE_SYNC',
          lifecycleAction: 'OPEN',
          exchangeTradeId: null,
          executedAt: {
            lte: rangeEnd,
          },
        },
      ],
    });
  });
});

describe('runtime aggregate projection helpers', () => {
  const row = (input: {
    id: string;
    status: 'RUNNING' | 'COMPLETED';
    startedAt: string;
    lastHeartbeatAt?: string | null;
    finishedAt?: string | null;
    symbolsTracked: number;
  }) =>
    ({
      session: {
        id: input.id,
        status: input.status,
        startedAt: new Date(input.startedAt),
        lastHeartbeatAt: input.lastHeartbeatAt ? new Date(input.lastHeartbeatAt) : null,
        finishedAt: input.finishedAt ? new Date(input.finishedAt) : null,
        symbolsTracked: input.symbolsTracked,
      },
    }) as any;

  it('uses only the latest running row for projected aggregate symbols', () => {
    const rows = [
      row({
        id: 'completed',
        status: 'COMPLETED',
        startedAt: '2026-05-04T09:00:00.000Z',
        finishedAt: '2026-05-04T09:30:00.000Z',
        symbolsTracked: 2,
      }),
      row({
        id: 'running-old',
        status: 'RUNNING',
        startedAt: '2026-05-04T10:00:00.000Z',
        lastHeartbeatAt: '2026-05-04T10:05:00.000Z',
        symbolsTracked: 9,
      }),
      row({
        id: 'running-new',
        status: 'RUNNING',
        startedAt: '2026-05-04T10:10:00.000Z',
        lastHeartbeatAt: '2026-05-04T10:20:00.000Z',
        symbolsTracked: 3,
      }),
    ];

    const projectedRows = selectLatestRunningProjectionRows(rows);

    expect(projectedRows.map((item) => item.session.id)).toEqual(['completed', 'running-new']);
    expect(sumRuntimeAggregateProjectedSymbolsTracked(projectedRows)).toBe(5);
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
