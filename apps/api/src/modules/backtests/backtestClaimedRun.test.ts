import { describe, expect, it, vi } from 'vitest';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { createBacktestRunJob, type BacktestRunJobDeps, type CreateTradeInput } from './backtestRunJob';

const candle = (openTime: number, close: number) => ({
  openTime,
  closeTime: openTime + 59_000,
  open: close,
  high: close + 1,
  low: close - 1,
  close,
  volume: 1_000,
});

const createDeps = (fetchKlines: BacktestRunJobDeps['fetchKlines']): BacktestRunJobDeps => ({
  findBacktestRunById: async () => ({
    id: 'run-1', userId: 'user-1', symbol: 'BTCUSDT', timeframe: '1m',
    strategyId: null, status: 'PENDING',
    seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES', maxCandles: 250 },
  }),
  safeUpdateRun: vi.fn(async () => true),
  uniqueSorted: (values) => [...new Set(values)].sort(),
  computeAdaptiveMaxCandles: () => 250,
  resolveIndicatorWarmupCandles: () => 0,
  normalizeWalletRiskPercent: () => 1,
  parseStrategySignalRules: () => null,
  findOwnedStrategySignalConfig: async () => null,
  fetchKlines,
  fetchSupplementalSeries: async () => ({ fundingRates: [], openInterest: [], orderBook: [] }),
  simulateInterleavedPortfolio: () => ({
    perSymbol: {
      BTCUSDT: {
        trades: [{
          symbol: 'BTCUSDT', side: 'LONG', entryPrice: 100, exitPrice: 110,
          quantity: 1, openedAt: new Date(0), closedAt: new Date(60_000),
          pnl: 10, fee: 0, exitReason: 'SIGNAL_EXIT', liquidated: false,
        }],
        liquidations: 0,
        events: [],
        eventCounts: { ENTRY: 1, EXIT: 1, DCA: 0, TP: 0, TTP: 0, SL: 0, TSL: 0, LIQUIDATION: 0 },
        decisionTrace: [],
      },
    },
  }),
  createBacktestTrades: vi.fn(async () => undefined),
  createBacktestContributions: vi.fn(async () => undefined),
  deleteBacktestTradesForRun: vi.fn(async () => undefined),
  countWinningBacktestTrades: vi.fn(async () => 0),
  countLosingBacktestTrades: vi.fn(async () => 0),
  upsertBacktestReportForRun: vi.fn(async () => undefined),
  computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1_000,
  maxDrawdownFromPnlSeries: () => 0,
});

const createStore = () => {
  let status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED' = 'PENDING';
  let token: string | null = null;
  let leaseValid = false;
  let attempts = 0;
  let trades: unknown[] = [];
  let report: unknown = null;
  let seedConfig: unknown = null;
  let commits = 0;
  return {
    get state() { return { status, token, trades, report, seedConfig, commits }; },
    expire: () => { leaseValid = false; },
    cancel: () => { status = 'CANCELED'; },
    claim: async () => {
      if (status !== 'PENDING' && !(status === 'RUNNING' && !leaseValid)) return null;
      token = `attempt-${++attempts}`;
      status = 'RUNNING';
      leaseValid = true;
      return token;
    },
    renew: async (_id: string, claim: string) => status === 'RUNNING' && leaseValid && token === claim,
    update: async (_id: string, claim: string) => status === 'RUNNING' && leaseValid && token === claim,
    commit: async (input: { token: string; trades: unknown[]; report: unknown; seedConfig: unknown; status: 'COMPLETED' | 'FAILED' }) => {
      if (status !== 'RUNNING' || !leaseValid || token !== input.token) return false;
      trades = [...input.trades];
      report = input.report;
      seedConfig = input.seedConfig;
      status = input.status;
      token = null;
      commits += 1;
      return true;
    },
  };
};

describe('claimed backtest run', () => {
  it('allows only one of two concurrent workers to execute and commit', async () => {
    let release!: () => void;
    let entered!: () => void;
    const started = new Promise<void>((resolve) => { entered = resolve; });
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const fetch = vi.fn(async () => {
      entered();
      await gate;
      return [candle(0, 100), candle(60_000, 101)];
    });
    const deps = createDeps(fetch);
    const store = createStore();
    const workerA = createClaimedBacktestRunJob(deps, store as any);
    const workerB = createClaimedBacktestRunJob(deps, store as any);

    const first = workerA('run-1');
    await started;
    await workerB('run-1');
    release();
    await first;

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(store.state.status).toBe('COMPLETED');
    expect(store.state.commits).toBe(1);
    expect(store.state.trades).toHaveLength(1);
    expect(store.state.report).not.toBeNull();
    expect(deps.createBacktestTrades).not.toHaveBeenCalled();
  });

  it('fences a worker resumed after lease expiry and takeover', async () => {
    let release!: () => void;
    let entered!: () => void;
    const started = new Promise<void>((resolve) => { entered = resolve; });
    const gate = new Promise<void>((resolve) => { release = resolve; });
    let fetches = 0;
    const deps = createDeps(async () => {
      fetches += 1;
      if (fetches === 1) {
        entered();
        await gate;
      }
      return [candle(0, 100), candle(60_000, 101)];
    });
    const store = createStore();
    const first = createClaimedBacktestRunJob(deps, store as any)('run-1');
    await started;
    store.expire();
    await createClaimedBacktestRunJob(deps, store as any)('run-1');
    release();
    await first;

    expect(store.state.status).toBe('COMPLETED');
    expect(store.state.commits).toBe(1);
    expect(store.state.trades).toHaveLength(1);
  });

  it('does not overwrite cancellation after a worker resumes', async () => {
    let release!: () => void;
    let entered!: () => void;
    const started = new Promise<void>((resolve) => { entered = resolve; });
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const deps = createDeps(async () => {
      entered();
      await gate;
      return [candle(0, 100), candle(60_000, 101)];
    });
    const store = createStore();
    const first = createClaimedBacktestRunJob(deps, store as any)('run-1');
    await started;
    store.cancel();
    release();
    await first;

    expect(store.state.status).toBe('CANCELED');
    expect(store.state.commits).toBe(0);
    expect(store.state.trades).toHaveLength(0);
  });

  it('discards partial trades and totals when the second symbol fails after the first trade', async () => {
    const deps = createDeps(async () => [candle(0, 100), candle(60_000, 101)]);
    deps.findBacktestRunById = async () => ({
      id: 'run-1', userId: 'user-1', symbol: 'BTCUSDT', timeframe: '1m',
      strategyId: null, status: 'PENDING',
      seedConfig: { symbols: ['BTCUSDT', 'ETHUSDT'], marketType: 'FUTURES', maxCandles: 250 },
    });
    const firstSymbol = deps.simulateInterleavedPortfolio(
      {} as Parameters<BacktestRunJobDeps['simulateInterleavedPortfolio']>[0],
    ).perSymbol.BTCUSDT;
    deps.simulateInterleavedPortfolio = () => ({
      perSymbol: new Proxy({ BTCUSDT: firstSymbol }, {
        get(target, symbol) {
          if (symbol === 'ETHUSDT') throw new Error('second symbol failed after first trade');
          return Reflect.get(target, symbol);
        },
      }),
    });
    const store = createStore();

    await createClaimedBacktestRunJob(deps, store as any)('run-1');

    expect(store.state.status).toBe('FAILED');
    expect(store.state.trades).toHaveLength(0);
    const report = store.state.report as {
      create: Record<string, any>;
      update: Record<string, any>;
    };
    for (const values of [report.create, report.update]) {
      expect(values).toMatchObject({
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: null,
        netPnl: null,
        grossProfit: null,
        grossLoss: null,
        maxDrawdown: null,
        sharpe: null,
      });
      expect(values.metrics.runLifecycle).toMatchObject({
        state: 'FAILED', reportReady: false, degraded: true,
      });
    }
    expect((store.state.seedConfig as { liveProgress: { totalTrades: number } }).liveProgress.totalTrades).toBe(0);

    // The direct job has write dependencies rather than a claimed trade buffer.
    // It must clear rows written for the first symbol before reporting FAILED.
    const persistedTrades: CreateTradeInput[] = [];
    deps.createBacktestTrades = vi.fn(async (items) => { persistedTrades.push(...items); });
    deps.deleteBacktestTradesForRun = vi.fn(async () => { persistedTrades.length = 0; });
    const directReport = vi.fn(async () => undefined);
    deps.upsertBacktestReportForRun = directReport;

    await createBacktestRunJob(deps)('run-1');

    expect(deps.createBacktestTrades).toHaveBeenCalledTimes(1);
    expect(deps.deleteBacktestTradesForRun).toHaveBeenCalledTimes(2);
    expect(persistedTrades).toHaveLength(0);
    expect(directReport).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ totalTrades: 0, netPnl: null }),
      update: expect.objectContaining({ totalTrades: 0, netPnl: null }),
    }));
  });
});
