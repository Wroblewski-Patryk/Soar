import { normalizeSymbols } from '../../lib/symbols';
import { normalizeWalletRiskPercent } from '../engine/positionSizing';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { fetchVerifiedArchivedIntrabarForRun } from './backtestBinanceFuturesIntrabarArchive';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from './backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { BacktestRunQueue } from './backtestRunQueue';
import { findBacktestRunById, findOwnedStrategySignalConfig } from './backtests.repository';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from './backtestRange.service';
import { listDiscardableBacktestRunIds,
  listRecoverableBacktestRunIds } from './backtestRunOwnership.repository';

const runId = process.env.SOAR_011_QUEUE_RUN_ID;
const role = process.env.SOAR_011_QUEUE_ROLE;
const queueName = process.env.WORKER_BACKTEST_QUEUE;
const db = new URL(process.env.DATABASE_URL ?? '');
const redis = new URL(process.env.REDIS_URL ?? '');
if (process.env.SOAR_011_QUEUE_PROOF !== '1' || !runId ||
    !['hold', 'resume'].includes(role ?? '') ||
    db.hostname !== '127.0.0.1' || db.port === '5432' ||
    db.pathname !== '/soar_011_queue_recovery_test' ||
    redis.hostname !== '127.0.0.1' || redis.port === '6379' ||
    !queueName?.startsWith('backtest-011-queue-'))
  throw new Error('011 queue proof requires its own _test, Redis and queue');

const originalFetch = globalThis.fetch;
globalThis.fetch = ((input: Parameters<typeof fetch>[0], init?: RequestInit) => {
  if (role === 'resume') throw new Error('NETWORK_FORBIDDEN_ON_011_QUEUE_RETRY');
  const url = String(input);
  if (url.includes('data.binance.vision') && url.endsWith('.CHECKSUM'))
    process.stdout.write('ARCHIVE_CHECKSUM_FETCH\n');
  if (url.includes('data.binance.vision') && url.endsWith('.zip'))
    process.stdout.write('ARCHIVE_ZIP_FETCH\n');
  return originalFetch(input, init);
}) as typeof fetch;

const job = createClaimedBacktestRunJob({
  findBacktestRunById,
  uniqueSorted: normalizeSymbols,
  computeAdaptiveMaxCandles,
  resolveIndicatorWarmupCandles,
  normalizeWalletRiskPercent,
  parseStrategySignalRules,
  findOwnedStrategySignalConfig,
  fetchKlines: async () => { throw new Error('OHLC_FALLBACK_FORBIDDEN'); },
  fetchKlinesWithVerifiedBinanceFuturesIntrabar: async () => {
    throw new Error('RECENT_REST_PATH_FORBIDDEN');
  },
  fetchVerifiedArchivedIntrabarForRun,
  fetchSupplementalSeries: async () => ({ fundingRates: [], openInterest: [], orderBook: [] }),
  simulateInterleavedPortfolio: (input) => {
    process.stdout.write('SIMULATE\n');
    if (role !== 'hold') return simulateInterleavedPortfolio(input);
    const originalPush = Array.prototype.push;
    let held = false;
    Array.prototype.push = function (...items: unknown[]) {
      const length = originalPush.apply(this, items);
      for (const item of items) {
        const event = item as { symbol?: unknown; type?: unknown;
          timestamp?: unknown; price?: unknown } | null;
        if (!held && event?.symbol === 'ALICEUSDT' && event.type === 'DCA' &&
            event.timestamp instanceof Date &&
            event.timestamp.getTime() === Date.parse('2026-10-18T02:46:47.639Z') &&
            event.price === 0.1454) {
          held = true;
          process.stdout.write(`SOURCE_DCA_CONFIRMED ${process.pid}\n`);
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0);
        }
      }
      return length;
    };
    try {
      const result = simulateInterleavedPortfolio(input);
      if (!held) throw new Error('Expected source DCA checkpoint was not reached');
      return result;
    } finally {
      Array.prototype.push = originalPush;
    }
  },
  computeSourceWindowMs,
  maxDrawdownFromPnlSeries: () => 0,
});

const queue = new BacktestRunQueue(async (id) => {
  process.stdout.write('JOB_INVOKED\n');
  await job(id);
  process.stdout.write('JOB_RETURNED\n');
}, {
  backend: 'redis', queueName,
  redisUrl: process.env.REDIS_URL,
  recoverPendingRunIds: () => listRecoverableBacktestRunIds([runId]),
  discardProcessingRunIds: listDiscardableBacktestRunIds,
});
queue.startWorker();
process.stdout.write('READY\n');
