import { existsSync } from 'node:fs';
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
const naturalLeaseProof = role === 'position-cycle-natural-lease-hold' ||
  role === 'position-cycle-natural-lease-release' ||
  role === 'position-cycle-natural-lease-recovery';
const tpMidCalculationProof = role === 'position-cycle-tp-mid-hold' ||
  role === 'position-cycle-tp-mid-release' ||
  role === 'position-cycle-natural-lease-hold' ||
  role === 'position-cycle-natural-lease-release';
const midCalculationProof = role === 'position-cycle-mid-hold' ||
  role === 'position-cycle-mid-release' || tpMidCalculationProof;
const tpAfterDcaProof = role === 'position-cycle-tp-ack-hold' ||
  role === 'position-cycle-tp-recovery' || tpMidCalculationProof ||
  role === 'position-cycle-tp-mid-recovery' ||
  role === 'position-cycle-natural-lease-recovery';
const advancedTtpProof = role === 'position-cycle-advanced-ttp-ack-hold' ||
  role === 'position-cycle-advanced-ttp-recovery';
const negativeTslProof = role === 'position-cycle-negative-tsl-ack-hold' ||
  role === 'position-cycle-negative-tsl-recovery';
const positionCycleProof = midCalculationProof || role === 'position-cycle-ack-hold' ||
  role === 'position-cycle-recovery' || tpAfterDcaProof || advancedTtpProof || negativeTslProof;
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
      // The final drop prevents a fresh valid LONG vote after the close.
      const prices = advancedTtpProof
        ? [99, 100, 100, 99.9, 130, 140, 140, 127, 100]
        : negativeTslProof
        ? [99, 100, 100, 49, 57, 25, 25, 20]
        : tpAfterDcaProof
        ? [0.99, 1, 1, 0.6949, 0.5375, 0.5375, 0.72, 0.5]
        : [0.99, 1, 1, 0.6949, 0.5375, 0.5375, 0.47];
      return Array.from({ length: 100 }, (_, index) => {
        const price = prices[index] ?? prices.at(-1)!;
        const openTime = 1_710_000_000_000 + index * 60_000;
        // At candle 5 the high reaches positive DCA while the close retraces
        // through the armed TTP guard. DCA must win this candle; TTP comes later.
        const close = advancedTtpProof && index === 5 ? 127 : price;
        return { openTime, closeTime: openTime + 59_999,
          open: price, high: price, low: close, close, volume: 1_000 };
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
    if (midCalculationProof) {
      const candles = input.candlesBySymbol.get('BTCUSDT');
      const exitPrice = tpMidCalculationProof ? 0.72 : 0.47;
      if (!candles || candles.length < 7 || candles[6].close !== exitPrice) {
        throw new Error('007 mid-calculation proof requires the expected exit candle');
      }
      const confirmedDcaUsdt: number[] = [];
      const originalPush = Array.prototype.push;
      Array.prototype.push = function (...items: unknown[]) {
        const length = originalPush.apply(this, items);
        for (const item of items) {
          const event = item as {
            symbol?: unknown; type?: unknown; contribution?: { contributionUsdt?: unknown };
          } | null;
          if (event?.symbol === 'BTCUSDT' && event.type === 'DCA' &&
              typeof event.contribution?.contributionUsdt === 'number') {
            confirmedDcaUsdt[confirmedDcaUsdt.length] = event.contribution.contributionUsdt;
          }
        }
        return length;
      };
      const guardedCandles = [...candles];
      let checkpointReached = false;
      guardedCandles[6] = new Proxy(candles[6], {
        get(target, property, receiver) {
          // The clock reaches candle 6 only after the two basic DCA candles.
          // Precomputation can also read candle 6, so pause only in the clock picker.
          if (property === 'openTime' && !checkpointReached &&
              new Error().stack?.includes('pickNextSymbol')) {
            if (confirmedDcaUsdt.length !== 2 ||
                Math.abs(confirmedDcaUsdt[0] - 2) > 1e-6 ||
                Math.abs(confirmedDcaUsdt[1] - 6) > 1e-6) {
              throw new Error('007 checkpoint reached without confirmed 2/6 USDT DCA events');
            }
            checkpointReached = true;
            process.stdout.write(tpMidCalculationProof
              ? 'AFTER_BOTH_DCA_BEFORE_TP\n' : 'AFTER_BOTH_DCA_BEFORE_SL\n');
            const gate = new Int32Array(new SharedArrayBuffer(4));
            if (role === 'position-cycle-mid-release' || role === 'position-cycle-tp-mid-release' ||
                role === 'position-cycle-natural-lease-release') {
              const releaseFile = process.env.SOAR_BT_PROOF_RELEASE_FILE;
              if (!releaseFile) throw new Error('Mid-calculation release file missing');
              const deadline = Date.now() + 30_000;
              while (!existsSync(releaseFile)) {
                if (Date.now() >= deadline) throw new Error('Mid-calculation release timed out');
                Atomics.wait(gate, 0, 0, 50);
              }
            } else {
              Atomics.wait(gate, 0, 0);
            }
          }
          return Reflect.get(target, property, receiver);
        },
      });
      const candlesBySymbol = new Map(input.candlesBySymbol);
      candlesBySymbol.set('BTCUSDT', guardedCandles);
      try {
        return simulateInterleavedPortfolio({ ...input, candlesBySymbol });
      } finally {
        Array.prototype.push = originalPush;
      }
    }
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
  if (role === 'ack-hold' || role === 'position-cycle-ack-hold' ||
      role === 'position-cycle-tp-ack-hold' ||
      role === 'position-cycle-advanced-ttp-ack-hold' ||
      role === 'position-cycle-negative-tsl-ack-hold') {
    process.stdout.write('COMMITTED_BEFORE_ACK\n');
    await new Promise<void>(() => undefined);
  }
}, {
  backend: 'redis',
  queueName,
  redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  ...(naturalLeaseProof ? {} : { pollIntervalMs: 50, recoveryIntervalMs: 50 }),
  recoverPendingRunIds: () => listRecoverableBacktestRunIds(proofRunIds),
  discardProcessingRunIds: listDiscardableBacktestRunIds,
});

queue.startWorker();
process.stdout.write('READY\n');
