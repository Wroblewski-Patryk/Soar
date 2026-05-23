import { describe, expect, it, vi } from 'vitest';
import { createBacktestRunJob } from './backtestRunJob';

describe('createBacktestRunJob', () => {
  it('persists trades and report metrics for processed symbols', async () => {
    const safeUpdateRun = vi.fn(async () => true);
    const createBacktestTrades = vi.fn(async () => undefined);
    const upsertBacktestReportForRun = vi.fn(async () => undefined);

    const runJob = createBacktestRunJob({
      findBacktestRunById: vi.fn(async () => ({
        id: 'run-1',
        userId: 'user-1',
        symbol: 'BTCUSDT',
        timeframe: '1m',
        strategyId: null,
        status: 'PENDING',
        seedConfig: {
          symbols: ['BTCUSDT'],
          marketType: 'FUTURES',
          leverage: 3,
          marginMode: 'CROSSED',
          initialBalance: 10_000,
          maxCandles: 300,
        },
      })),
      safeUpdateRun,
      uniqueSorted: (values) => [...new Set(values)].sort(),
      computeAdaptiveMaxCandles: () => 300,
      resolveIndicatorWarmupCandles: () => 0,
      normalizeWalletRiskPercent: () => 1,
      parseStrategySignalRules: () => null,
      findOwnedStrategySignalConfig: vi.fn(async () => null),
      fetchKlines: vi.fn(async () => [
        {
          openTime: 0,
          closeTime: 59_000,
          open: 100,
          high: 101,
          low: 99,
          close: 100,
          volume: 1_000,
        },
        {
          openTime: 60_000,
          closeTime: 119_000,
          open: 101,
          high: 102,
          low: 100,
          close: 101,
          volume: 1_100,
        },
      ]),
      fetchSupplementalSeries: vi.fn(async () => ({
        fundingRates: [],
        openInterest: [],
        orderBook: [],
      })),
      simulateInterleavedPortfolio: vi.fn(
        () =>
          ({
            perSymbol: {
              BTCUSDT: {
                trades: [
                  {
                    symbol: 'BTCUSDT',
                    side: 'LONG',
                    entryPrice: 100,
                    exitPrice: 110,
                    quantity: 1,
                    openedAt: new Date('2026-01-01T00:00:00.000Z'),
                    closedAt: new Date('2026-01-01T00:01:00.000Z'),
                    pnl: 10,
                    fee: 0.5,
                    exitReason: 'SIGNAL_EXIT',
                    liquidated: false,
                  },
                ],
                liquidations: 0,
                eventCounts: {
                  ENTRY: 1,
                  EXIT: 1,
                  DCA: 0,
                  TP: 0,
                  TTP: 0,
                  SL: 0,
                  TSL: 0,
                  LIQUIDATION: 0,
                },
                decisionTrace: [],
              },
            },
            finalBalance: 10_010,
          }) as any,
      ),
      createBacktestTrades,
      deleteBacktestTradesForRun: vi.fn(async () => undefined),
      countWinningBacktestTrades: vi.fn(async () => 1),
      countLosingBacktestTrades: vi.fn(async () => 0),
      upsertBacktestReportForRun,
      computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1000,
      maxDrawdownFromPnlSeries: () => 0,
    });

    await runJob('run-1');

    expect(createBacktestTrades).toHaveBeenCalledTimes(1);
    expect(upsertBacktestReportForRun).toHaveBeenCalledTimes(1);
    const reportCalls = (upsertBacktestReportForRun as any).mock.calls as any[];
    const reportPayload = reportCalls[0]?.[0] as any;
    expect(reportPayload).toBeDefined();
    expect(reportPayload.create.totalTrades).toBe(1);
    expect(reportPayload.create.netPnl).toBe(10);
    expect(reportPayload.create.winningTrades).toBe(1);

    const updateCalls = (safeUpdateRun as any).mock.calls as any[];
    const lastRunUpdate = updateCalls[updateCalls.length - 1]?.[1] as { status: string } | undefined;
    expect(lastRunUpdate).toBeDefined();
    expect(lastRunUpdate?.status).toBe('COMPLETED');
  });

  it('passes complete multi-strategy snapshots to replay and persists primary strategy provenance', async () => {
    const simulateInterleavedPortfolio = vi.fn(
      () =>
        ({
          perSymbol: {
            BTCUSDT: {
              trades: [
                {
                  symbol: 'BTCUSDT',
                  strategyId: 'strategy-winner',
                  side: 'LONG',
                  entryPrice: 100,
                  exitPrice: 110,
                  quantity: 1,
                  openedAt: new Date('2026-01-01T00:00:00.000Z'),
                  closedAt: new Date('2026-01-01T00:01:00.000Z'),
                  pnl: 10,
                  fee: 0.5,
                  exitReason: 'SIGNAL_EXIT',
                  liquidated: false,
                },
              ],
              liquidations: 0,
              eventCounts: {
                ENTRY: 1,
                EXIT: 1,
                DCA: 0,
                TP: 0,
                TTP: 0,
                SL: 0,
                TSL: 0,
                LIQUIDATION: 0,
              },
              decisionTrace: [
                {
                  symbol: 'BTCUSDT',
                  timestamp: new Date('2026-01-01T00:00:00.000Z'),
                  candleIndex: 1,
                  signal: 'LONG',
                  side: 'LONG',
                  trigger: 'STRATEGY',
                  strategyId: 'strategy-winner',
                  mismatchReason: null,
                  merge: {
                    reason: 'weighted_winner',
                    winner: {
                      strategyId: 'strategy-winner',
                      marketGroupStrategyLinkId: 'link-winner',
                    },
                  },
                },
              ],
            },
          },
          finalBalance: 10_010,
        }) as any,
    );
    const createBacktestTrades = vi.fn(async () => undefined);
    const upsertBacktestReportForRun = vi.fn(async () => undefined);

    const runJob = createBacktestRunJob({
      findBacktestRunById: vi.fn(async () => ({
        id: 'run-multi-strategy',
        userId: 'user-1',
        symbol: 'BTCUSDT',
        timeframe: '1m',
        strategyId: 'strategy-legacy',
        status: 'PENDING',
        seedConfig: {
          symbols: ['BTCUSDT'],
          marketType: 'FUTURES',
          leverage: 2,
          marginMode: 'CROSSED',
          initialBalance: 10_000,
          maxCandles: 200,
          minDirectionalScore: 2,
          contextSnapshot: {
            botMarketGroup: {
              strategyLinks: [
                {
                  id: 'link-winner',
                  strategyId: 'strategy-winner',
                  priority: 10,
                  weight: 2,
                  walletRisk: 3,
                  config: { signal: { long: [{ left: 'close', operator: '>', right: 1 }] } },
                },
                {
                  id: 'link-secondary',
                  strategyId: 'strategy-secondary',
                  priority: 20,
                  weight: 1,
                  walletRisk: 1,
                  config: { signal: { short: [{ left: 'close', operator: '<', right: 1 }] } },
                },
              ],
            },
          },
        },
      })),
      safeUpdateRun: vi.fn(async () => true),
      uniqueSorted: (values) => [...new Set(values)].sort(),
      computeAdaptiveMaxCandles: vi.fn(() => 120),
      resolveIndicatorWarmupCandles: () => 0,
      normalizeWalletRiskPercent: () => 1,
      parseStrategySignalRules: () => ({}),
      findOwnedStrategySignalConfig: vi.fn(async () => null),
      fetchKlines: vi.fn(async () => [
        {
          openTime: 0,
          closeTime: 59_000,
          open: 100,
          high: 101,
          low: 99,
          close: 100,
          volume: 1_000,
        },
        {
          openTime: 60_000,
          closeTime: 119_000,
          open: 101,
          high: 102,
          low: 100,
          close: 101,
          volume: 1_100,
        },
      ]),
      fetchSupplementalSeries: vi.fn(async () => ({
        fundingRates: [],
        openInterest: [],
        orderBook: [],
      })),
      simulateInterleavedPortfolio,
      createBacktestTrades,
      deleteBacktestTradesForRun: vi.fn(async () => undefined),
      countWinningBacktestTrades: vi.fn(async () => 1),
      countLosingBacktestTrades: vi.fn(async () => 0),
      upsertBacktestReportForRun,
      computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1000,
      maxDrawdownFromPnlSeries: () => 0,
    });

    await runJob('run-multi-strategy');

    expect(simulateInterleavedPortfolio).toHaveBeenCalledTimes(1);
    const simulationInput = (simulateInterleavedPortfolio as any).mock.calls[0]?.[0] as any;
    expect(simulationInput.primaryStrategyId).toBe('strategy-legacy');
    expect(simulationInput.minDirectionalScore).toBe(2);
    expect(simulationInput.strategyLinks).toMatchObject([
      {
        strategyId: 'strategy-winner',
        marketGroupStrategyLinkId: 'link-winner',
        priority: 10,
        weight: 2,
        walletRiskPercent: 3,
      },
      {
        strategyId: 'strategy-secondary',
        marketGroupStrategyLinkId: 'link-secondary',
        priority: 20,
        weight: 1,
        walletRiskPercent: 1,
      },
    ]);
    const persistedTrades = (createBacktestTrades as any).mock.calls[0]?.[0] as any[];
    expect(persistedTrades[0]?.strategyId).toBe('strategy-winner');
    const reportPayload = (upsertBacktestReportForRun as any).mock.calls[0]?.[0] as any;
    expect(reportPayload.create.metrics.parityDiagnostics[0].mergeSamples[0]).toMatchObject({
      strategyId: 'strategy-winner',
      merge: {
        winner: {
          marketGroupStrategyLinkId: 'link-winner',
        },
      },
    });
  });

  it('reuses persisted effectiveMaxCandles without applying adaptive reduction twice', async () => {
    const safeUpdateRun = vi.fn(async () => true);
    const fetchKlines = vi.fn(async () => [
      {
        openTime: 0,
        closeTime: 59_000,
        open: 100,
        high: 101,
        low: 99,
        close: 100,
        volume: 1_000,
      },
      {
        openTime: 60_000,
        closeTime: 119_000,
        open: 100,
        high: 102,
        low: 99,
        close: 101,
        volume: 1_200,
      },
    ]);
    const computeAdaptiveMaxCandles = vi.fn(() => 120);

    const runJob = createBacktestRunJob({
      findBacktestRunById: vi.fn(async () => ({
        id: 'run-2',
        userId: 'user-1',
        symbol: 'BTCUSDT',
        timeframe: '1m',
        strategyId: null,
        status: 'PENDING',
        seedConfig: {
          symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
          marketType: 'FUTURES',
          leverage: 2,
          marginMode: 'CROSSED',
          initialBalance: 10_000,
          requestedMaxCandles: 600,
          effectiveMaxCandles: 400,
          maxCandles: 400,
        },
      })),
      safeUpdateRun,
      uniqueSorted: (values) => [...new Set(values)].sort(),
      computeAdaptiveMaxCandles,
      resolveIndicatorWarmupCandles: () => 0,
      normalizeWalletRiskPercent: () => 1,
      parseStrategySignalRules: () => null,
      findOwnedStrategySignalConfig: vi.fn(async () => null),
      fetchKlines,
      fetchSupplementalSeries: vi.fn(async () => ({
        fundingRates: [],
        openInterest: [],
        orderBook: [],
      })),
      simulateInterleavedPortfolio: vi.fn(
        () =>
          ({
            perSymbol: {},
            finalBalance: 10_000,
          }) as any,
      ),
      createBacktestTrades: vi.fn(async () => undefined),
      deleteBacktestTradesForRun: vi.fn(async () => undefined),
      countWinningBacktestTrades: vi.fn(async () => 0),
      countLosingBacktestTrades: vi.fn(async () => 0),
      upsertBacktestReportForRun: vi.fn(async () => undefined),
      computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1000,
      maxDrawdownFromPnlSeries: () => 0,
    });

    await runJob('run-2');

    expect(fetchKlines).toHaveBeenCalled();
    const fetchCalls = (fetchKlines as any).mock.calls as Array<any[]>;
    expect(fetchCalls[0]?.[4]).toBe(400);
    expect(computeAdaptiveMaxCandles).not.toHaveBeenCalled();
  });

  it('forwards explicit seed range boundaries to candle and supplemental fetch calls', async () => {
    const startAt = '2026-01-01T00:00:00.000Z';
    const endAt = '2026-01-15T00:00:00.000Z';
    const fetchKlines = vi.fn(async () => [
      {
        openTime: 0,
        closeTime: 59_000,
        open: 100,
        high: 101,
        low: 99,
        close: 100,
        volume: 1_000,
      },
      {
        openTime: 60_000,
        closeTime: 119_000,
        open: 100,
        high: 102,
        low: 99,
        close: 101,
        volume: 1_200,
      },
    ]);
    const fetchSupplementalSeries = vi.fn(async () => ({
      fundingRates: [],
      openInterest: [],
      orderBook: [],
    }));

    const runJob = createBacktestRunJob({
      findBacktestRunById: vi.fn(async () => ({
        id: 'run-3',
        userId: 'user-1',
        symbol: 'BTCUSDT',
        timeframe: '1m',
        strategyId: null,
        status: 'PENDING',
        seedConfig: {
          symbols: ['BTCUSDT'],
          exchange: 'GATEIO',
          marketType: 'FUTURES',
          leverage: 2,
          marginMode: 'CROSSED',
          initialBalance: 10_000,
          requestedMaxCandles: 400,
          effectiveMaxCandles: 400,
          maxCandles: 400,
          startAt,
          endAt,
          rangeSource: 'explicit',
        },
      })),
      safeUpdateRun: vi.fn(async () => true),
      uniqueSorted: (values) => [...new Set(values)].sort(),
      computeAdaptiveMaxCandles: vi.fn(() => 120),
      resolveIndicatorWarmupCandles: () => 0,
      normalizeWalletRiskPercent: () => 1,
      parseStrategySignalRules: () => null,
      findOwnedStrategySignalConfig: vi.fn(async () => null),
      fetchKlines,
      fetchSupplementalSeries,
      simulateInterleavedPortfolio: vi.fn(
        () =>
          ({
            perSymbol: {},
            finalBalance: 10_000,
          }) as any,
      ),
      createBacktestTrades: vi.fn(async () => undefined),
      deleteBacktestTradesForRun: vi.fn(async () => undefined),
      countWinningBacktestTrades: vi.fn(async () => 0),
      countLosingBacktestTrades: vi.fn(async () => 0),
      upsertBacktestReportForRun: vi.fn(async () => undefined),
      computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1000,
      maxDrawdownFromPnlSeries: () => 0,
    });

    await runJob('run-3');

    expect(fetchKlines).toHaveBeenCalled();
    const fetchKlinesCall = (fetchKlines as any).mock.calls[0] as Array<unknown>;
    expect(fetchKlinesCall[0]).toBe('GATEIO');
    expect(fetchKlinesCall[5]).toBe(Date.parse(endAt));
    expect(fetchKlinesCall[6]).toBe(Date.parse(startAt));

    expect(fetchSupplementalSeries).toHaveBeenCalled();
    const fetchSupplementalCall = (fetchSupplementalSeries as any).mock.calls[0] as Array<unknown>;
    expect(fetchSupplementalCall[0]).toBe('GATEIO');
    expect(fetchSupplementalCall[5]).toBe(Date.parse(endAt));
    expect(fetchSupplementalCall[6]).toBe(Date.parse(startAt));
  });

  it('fails soft when report upsert loses its parent rows during async completion', async () => {
    const upsertBacktestReportForRun = vi.fn(async () => false);
    const safeUpdateRun = vi.fn(async () => true);

    const runJob = createBacktestRunJob({
      findBacktestRunById: vi.fn(async () => ({
        id: 'run-missing-parent',
        userId: 'user-1',
        symbol: 'BTCUSDT',
        timeframe: '1m',
        strategyId: null,
        status: 'PENDING',
        seedConfig: {
          symbols: ['BTCUSDT'],
          marketType: 'FUTURES',
          leverage: 2,
          marginMode: 'CROSSED',
          initialBalance: 10_000,
          maxCandles: 200,
        },
      })),
      safeUpdateRun,
      uniqueSorted: (values) => [...new Set(values)].sort(),
      computeAdaptiveMaxCandles: vi.fn(() => 120),
      resolveIndicatorWarmupCandles: () => 0,
      normalizeWalletRiskPercent: () => 1,
      parseStrategySignalRules: () => null,
      findOwnedStrategySignalConfig: vi.fn(async () => null),
      fetchKlines: vi.fn(async () => [
        {
          openTime: 0,
          closeTime: 59_000,
          open: 100,
          high: 101,
          low: 99,
          close: 100,
          volume: 1_000,
        },
      ]),
      fetchSupplementalSeries: vi.fn(async () => ({
        fundingRates: [],
        openInterest: [],
        orderBook: [],
      })),
      simulateInterleavedPortfolio: vi.fn(() => {
        throw new Error('parent rows removed during async completion');
      }),
      createBacktestTrades: vi.fn(async () => undefined),
      deleteBacktestTradesForRun: vi.fn(async () => undefined),
      countWinningBacktestTrades: vi.fn(async () => 0),
      countLosingBacktestTrades: vi.fn(async () => 0),
      upsertBacktestReportForRun,
      computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1000,
      maxDrawdownFromPnlSeries: () => 0,
    });

    await expect(runJob('run-missing-parent')).resolves.toBeUndefined();
    expect(upsertBacktestReportForRun).toHaveBeenCalledTimes(1);
    expect(safeUpdateRun).toHaveBeenCalled();
  });

  it('skips terminal runs and clears stale trades before retrying active runs', async () => {
    const deleteBacktestTradesForRun = vi.fn(async () => undefined);
    const safeUpdateRun = vi.fn(async () => true);
    const createJob = (status: string) =>
      createBacktestRunJob({
        findBacktestRunById: vi.fn(async () => ({
          id: 'run-retry',
          userId: 'user-1',
          symbol: 'BTCUSDT',
          timeframe: '1m',
          strategyId: null,
          status,
          seedConfig: {
            symbols: ['BTCUSDT'],
            marketType: 'FUTURES',
            leverage: 2,
            marginMode: 'CROSSED',
            initialBalance: 10_000,
            maxCandles: 200,
          },
        })),
        safeUpdateRun,
        uniqueSorted: (values) => [...new Set(values)].sort(),
        computeAdaptiveMaxCandles: vi.fn(() => 120),
        resolveIndicatorWarmupCandles: () => 0,
        normalizeWalletRiskPercent: () => 1,
        parseStrategySignalRules: () => null,
        findOwnedStrategySignalConfig: vi.fn(async () => null),
        fetchKlines: vi.fn(async () => [
          {
            openTime: 0,
            closeTime: 59_000,
            open: 100,
            high: 101,
            low: 99,
            close: 100,
            volume: 1_000,
          },
        ]),
        fetchSupplementalSeries: vi.fn(async () => ({
          fundingRates: [],
          openInterest: [],
          orderBook: [],
        })),
        simulateInterleavedPortfolio: vi.fn(
          () =>
            ({
              perSymbol: {},
              finalBalance: 10_000,
            }) as any
        ),
        createBacktestTrades: vi.fn(async () => undefined),
        deleteBacktestTradesForRun,
        countWinningBacktestTrades: vi.fn(async () => 0),
        countLosingBacktestTrades: vi.fn(async () => 0),
        upsertBacktestReportForRun: vi.fn(async () => undefined),
        computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1000,
        maxDrawdownFromPnlSeries: () => 0,
      });

    await createJob('COMPLETED')('run-retry');
    expect(safeUpdateRun).not.toHaveBeenCalled();

    await createJob('RUNNING')('run-retry');
    expect(deleteBacktestTradesForRun).toHaveBeenCalledWith('user-1', 'run-retry');
  });
});
