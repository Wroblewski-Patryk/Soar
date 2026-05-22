import { describe, expect, it } from 'vitest';

import { buildRuntimeSymbolLiveOpenPositionScopes } from './botsRuntimeRead.repository';
import {
  buildRuntimeAggregateCurrentOpenItems,
  buildRuntimeAggregateCurrentOpenOrders,
  buildRuntimeAggregateProjectedHistoryItems,
  buildRuntimeAggregateProjectedTradeItems,
  buildRuntimeAggregateTradesMeta,
  resolveRuntimeAggregateCurrentDynamicStopColumns,
  selectRuntimeAggregateLatestCapitalSummary,
  selectRuntimeAggregateCurrentRows,
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
import { canUseStrategyProtectionFallbackForDisplay } from './runtimeStrategyProtectionFallbackDisplay';

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

  it('adds only persisted OPEN lifetime anchors for carry-over positions', () => {
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
          lifecycleAction: 'OPEN',
          executedAt: {
            lte: rangeEnd,
          },
        },
      ],
    });
  });
});

describe('canUseStrategyProtectionFallbackForDisplay', () => {
  it('does not use strategy-derived dynamic stops for imported LIVE positions without canonical runtime state', () => {
    expect(
      canUseStrategyProtectionFallbackForDisplay({
        position: { origin: 'EXCHANGE_SYNC' },
        strategyAutomationContextResolved: true,
        runtimeState: null,
      })
    ).toBe(false);
  });

  it('allows strategy fallback for canonical runtime-owned positions and imported positions with runtime state', () => {
    expect(
      canUseStrategyProtectionFallbackForDisplay({
        position: { origin: 'BOT' },
        strategyAutomationContextResolved: true,
        runtimeState: null,
      })
    ).toBe(true);

    expect(
      canUseStrategyProtectionFallbackForDisplay({
        position: { origin: 'EXCHANGE_SYNC' },
        strategyAutomationContextResolved: true,
        runtimeState: {
          averageEntryPrice: 100,
          quantity: 1,
          currentAdds: 0,
        },
      })
    ).toBe(true);
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

  it('uses only projected rows for aggregate trade items', () => {
    const rows = [
      {
        session: {
          id: 'completed',
          status: 'COMPLETED',
          startedAt: new Date('2026-05-04T09:00:00.000Z'),
          lastHeartbeatAt: null,
          finishedAt: new Date('2026-05-04T09:30:00.000Z'),
        },
        trades: {
          items: [
            {
              id: 'completed-trade',
              executedAt: '2026-05-04T09:20:00.000Z',
            },
          ],
        },
      },
      {
        session: {
          id: 'running-old',
          status: 'RUNNING',
          startedAt: new Date('2026-05-04T10:00:00.000Z'),
          lastHeartbeatAt: new Date('2026-05-04T10:05:00.000Z'),
          finishedAt: null,
        },
        trades: {
          items: [
            {
              id: 'stale-running-trade',
              executedAt: '2026-05-04T10:04:00.000Z',
            },
          ],
        },
      },
      {
        session: {
          id: 'running-new',
          status: 'RUNNING',
          startedAt: new Date('2026-05-04T10:10:00.000Z'),
          lastHeartbeatAt: new Date('2026-05-04T10:20:00.000Z'),
          finishedAt: null,
        },
        trades: {
          items: [
            {
              id: 'latest-running-trade',
              executedAt: '2026-05-04T10:18:00.000Z',
            },
            {
              id: 'completed-trade',
              executedAt: '2026-05-04T09:20:00.000Z',
            },
          ],
        },
      },
    ] as any[];

    const projectedRows = selectLatestRunningProjectionRows(rows);
    const tradeItems = buildRuntimeAggregateProjectedTradeItems(projectedRows);

    expect(tradeItems.map((item) => item.id)).toEqual(['latest-running-trade', 'completed-trade']);
  });

  it('uses current and projected rows for aggregate position tables', () => {
    const olderResponse = {
      openItems: [
        {
          id: 'stale-open-position',
          openedAt: '2026-05-04T10:03:00.000Z',
          entryNotional: 100,
          leverage: 2,
        },
      ],
      openOrders: [
        {
          id: 'stale-open-order',
          submittedAt: '2026-05-04T10:04:00.000Z',
          createdAt: '2026-05-04T10:04:00.000Z',
        },
      ],
      historyItems: [
        {
          id: 'stale-history',
          closedAt: '2026-05-04T10:04:30.000Z',
        },
      ],
    };
    const latestResponse = {
      openItems: [
        {
          id: 'latest-open-position',
          openedAt: '2026-05-04T10:18:00.000Z',
          entryNotional: 200,
          leverage: 2,
        },
      ],
      openOrders: [
        {
          id: 'latest-open-order',
          submittedAt: '2026-05-04T10:19:00.000Z',
          createdAt: '2026-05-04T10:19:00.000Z',
        },
      ],
      historyItems: [
        {
          id: 'latest-history',
          closedAt: '2026-05-04T10:17:00.000Z',
        },
      ],
    };
    const rows = [
      {
        session: {
          id: 'completed',
          status: 'COMPLETED',
          startedAt: new Date('2026-05-04T09:00:00.000Z'),
          lastHeartbeatAt: null,
          finishedAt: new Date('2026-05-04T09:30:00.000Z'),
        },
        positions: {
          historyItems: [
            {
              id: 'completed-history',
              closedAt: '2026-05-04T09:20:00.000Z',
            },
          ],
        },
      },
      {
        session: {
          id: 'running-old',
          status: 'RUNNING',
          startedAt: new Date('2026-05-04T10:00:00.000Z'),
          lastHeartbeatAt: new Date('2026-05-04T10:05:00.000Z'),
          finishedAt: null,
        },
        positions: olderResponse,
      },
      {
        session: {
          id: 'running-new',
          status: 'RUNNING',
          startedAt: new Date('2026-05-04T10:10:00.000Z'),
          lastHeartbeatAt: new Date('2026-05-04T10:20:00.000Z'),
          finishedAt: null,
        },
        positions: latestResponse,
      },
    ] as any[];

    const projectedRows = selectLatestRunningProjectionRows(rows);

    expect(buildRuntimeAggregateCurrentOpenItems(latestResponse).map((item) => item.id)).toEqual([
      'latest-open-position',
    ]);
    expect(buildRuntimeAggregateCurrentOpenOrders(latestResponse).map((item) => item.id)).toEqual([
      'latest-open-order',
    ]);
    expect(buildRuntimeAggregateProjectedHistoryItems(projectedRows).map((item) => item.id)).toEqual([
      'latest-history',
      'completed-history',
    ]);
  });

  it('prefers running rows for aggregate current state even when completed rows are fresher', () => {
    const rows = [
      row({
        id: 'running-current',
        status: 'RUNNING',
        startedAt: '2026-05-04T10:00:00.000Z',
        lastHeartbeatAt: '2026-05-04T10:10:00.000Z',
        symbolsTracked: 1,
      }),
      row({
        id: 'completed-fresher',
        status: 'COMPLETED',
        startedAt: '2026-05-04T10:30:00.000Z',
        finishedAt: '2026-05-04T10:40:00.000Z',
        symbolsTracked: 9,
      }),
    ];

    expect(selectRuntimeAggregateCurrentRows(rows).map((item) => item.session.id)).toEqual([
      'running-current',
    ]);
    expect(selectLatestRunningProjectionRows(rows).map((item) => item.session.id)).toEqual([
      'completed-fresher',
      'running-current',
    ]);
  });

  it('uses all rows for aggregate current state when no session is running', () => {
    const rows = [
      row({
        id: 'completed-old',
        status: 'COMPLETED',
        startedAt: '2026-05-04T09:00:00.000Z',
        finishedAt: '2026-05-04T09:30:00.000Z',
        symbolsTracked: 1,
      }),
      row({
        id: 'completed-new',
        status: 'COMPLETED',
        startedAt: '2026-05-04T10:00:00.000Z',
        finishedAt: '2026-05-04T10:30:00.000Z',
        symbolsTracked: 2,
      }),
    ];

    expect(selectRuntimeAggregateCurrentRows(rows).map((item) => item.session.id)).toEqual([
      'completed-old',
      'completed-new',
    ]);
  });

  it('uses only the current position response for aggregate dynamic stop columns', () => {
    expect(
      resolveRuntimeAggregateCurrentDynamicStopColumns({
        showDynamicStopColumns: false,
      })
    ).toBe(false);
    expect(
      resolveRuntimeAggregateCurrentDynamicStopColumns({
        showDynamicStopColumns: true,
      })
    ).toBe(true);
    expect(resolveRuntimeAggregateCurrentDynamicStopColumns(null)).toBe(false);
  });

  it('keeps account-balance-only capital summaries usable for aggregate reads', () => {
    const summary = selectRuntimeAggregateLatestCapitalSummary([
      {
        positions: {
          summary: {
            referenceBalance: null,
            freeCash: null,
            accountBalance: 512.34,
          },
        },
      },
      {
        positions: {
          summary: {
            referenceBalance: 1000,
            freeCash: 900,
            accountBalance: 1000,
          },
        },
      },
    ]);

    expect(summary?.accountBalance).toBe(512.34);
  });

  it('uses requested page size for aggregate trade metadata', () => {
    expect(
      buildRuntimeAggregateTradesMeta({
        totalTrades: 250,
        returnedItemsCount: 75,
        pageSize: 200,
      })
    ).toEqual({
      page: 1,
      pageSize: 200,
      total: 250,
      totalPages: 2,
      hasPrev: false,
      hasNext: true,
    });

    expect(
      buildRuntimeAggregateTradesMeta({
        totalTrades: 0,
        returnedItemsCount: 0,
        pageSize: 200,
      })
    ).toEqual({
      page: 1,
      pageSize: 200,
      total: 0,
      totalPages: 0,
      hasPrev: false,
      hasNext: false,
    });
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
