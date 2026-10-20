import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import type { BacktestRunJobDeps } from './backtestRunJob';
import { BacktestRunQueue } from './backtestRunQueue';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { findBacktestRunById } from './backtests.repository';
import {
  listDiscardableBacktestRunIds,
  listRecoverableBacktestRunIds,
} from './backtestRunOwnership.repository';

if (process.env.SOAR_BT_PROOF !== '1' ||
    !new URL(process.env.DATABASE_URL ?? '').pathname.endsWith('_test')) {
  throw new Error('Backtest process proof requires an isolated _test database');
}

const role = process.env.SOAR_BT_PROOF_ROLE;
const positionCycleProof = role === 'position-cycle-ack-hold' || role === 'position-cycle-recovery';
const queueName = process.env.SOAR_BT_PROOF_QUEUE;
if (!queueName) throw new Error('Proof queue name missing');
const proofRunIds = (process.env.SOAR_BT_PROOF_RUN_IDS ?? '').split(',').filter(Boolean);
if (proofRunIds.length === 0) throw new Error('Proof run IDs missing');

const deps: BacktestRunJobDeps = {
  findBacktestRunById,
  safeUpdateRun: async () => { throw new Error('Unfenced progress write'); },
  uniqueSorted: (values) => [...new Set(values)].sort(),
  computeAdaptiveMaxCandles: () => 250,
  resolveIndicatorWarmupCandles: () => 0,
  normalizeWalletRiskPercent: (value) => positionCycleProof ? value : 1,
  parseStrategySignalRules: (config) => positionCycleProof ? parseStrategySignalRules(config) : null,
  findOwnedStrategySignalConfig: async () => null,
  fetchKlines: async () => {
    if (positionCycleProof) {
      const prices = [0.99, 1, 1, 0.6949, 0.5375, 0.5375, 0.47];
      return Array.from({ length: 100 }, (_, index) => {
        const price = prices[index] ?? prices.at(-1)!;
        const openTime = 1_710_000_000_000 + index * 60_000;
        return { openTime, closeTime: openTime + 59_999,
          open: price, high: price, low: price, close: price, volume: 1_000 };
      });
    }
    if (role === 'hold' || role === 'hold-release') {
      process.stdout.write('FETCH_STARTED\n');
      if (role === 'hold') {
        await new Promise<void>(() => undefined);
      } else {
        await new Promise<void>((resolve) => process.stdin.once('data', () => resolve()));
      }
    }
    return [0, 60_000].map((openTime, index) => ({
      openTime, closeTime: openTime + 59_000,
      open: 100 + index, high: 101 + index, low: 99 + index,
      close: 100 + index, volume: 1_000,
    }));
  },
  fetchSupplementalSeries: async () => ({ fundingRates: [], openInterest: [], orderBook: [] }),
  simulateInterleavedPortfolio: (input) => {
    process.stdout.write('SIMULATE\n');
    if (positionCycleProof) return simulateInterleavedPortfolio(input);
    return {
      perSymbol: {
        BTCUSDT: {
          trades: [{
            symbol: 'BTCUSDT', side: 'LONG' as const,
            entryPrice: 100, exitPrice: 110, quantity: 1,
            openedAt: new Date(0), closedAt: new Date(60_000),
            pnl: 10, fee: 0, exitReason: 'SIGNAL_EXIT' as const,
            liquidated: false,
          }],
          liquidations: 0,
          events: [],
          eventCounts: { ENTRY: 1, EXIT: 1, DCA: 0, TP: 0, TTP: 0, SL: 0, TSL: 0, LIQUIDATION: 0 },
          decisionTrace: [],
        },
      },
    };
  },
  createBacktestTrades: async () => { throw new Error('Unfenced trade write'); },
  createBacktestContributions: async () => { throw new Error('Unfenced contribution write'); },
  deleteBacktestTradesForRun: async () => { throw new Error('Unfenced trade delete'); },
  countWinningBacktestTrades: async () => 0,
  countLosingBacktestTrades: async () => 0,
  upsertBacktestReportForRun: async () => { throw new Error('Unfenced report write'); },
  computeSourceWindowMs: () => 14 * 24 * 60 * 60 * 1_000,
  maxDrawdownFromPnlSeries: () => 0,
};

const job = createClaimedBacktestRunJob(deps);
const queue = new BacktestRunQueue(async (runId) => {
  if (positionCycleProof) process.stdout.write('JOB_INVOKED\n');
  await job(runId);
  if (role === 'hold-release') process.stdout.write('JOB_RETURNED\n');
  if (role === 'ack-hold' || role === 'position-cycle-ack-hold') {
    process.stdout.write('COMMITTED_BEFORE_ACK\n');
    await new Promise<void>(() => undefined);
  }
}, {
  backend: 'redis',
  queueName,
  redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  pollIntervalMs: 50,
  recoveryIntervalMs: 50,
  recoverPendingRunIds: () => listRecoverableBacktestRunIds(proofRunIds),
  discardProcessingRunIds: listDiscardableBacktestRunIds,
});

queue.startWorker();
process.stdout.write('READY\n');
