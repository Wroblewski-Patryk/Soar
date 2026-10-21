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

const runId = process.env.SOAR_ARCHIVED_PROCESS_RUN_ID;
const role = process.env.SOAR_ARCHIVED_PROCESS_ROLE;
const queueName = process.env.WORKER_BACKTEST_QUEUE;
const database = new URL(process.env.DATABASE_URL ?? '');
const redis = new URL(process.env.REDIS_URL ?? '');
if (process.env.SOAR_ARCHIVED_PROCESS_PROOF !== '1' ||
    database.pathname.slice(1) !== 'soar_011a_archived_process_test' ||
    database.hostname !== '127.0.0.1' || !database.port || database.port === '5432' ||
    redis.hostname !== '127.0.0.1' || !redis.port || redis.port === '6379' ||
    !queueName?.startsWith('backtest-011a-archived-process-') || !runId ||
    !['hold', 'resume'].includes(role ?? ''))
  throw new Error('Archived process proof requires isolated test resources');

const originalFetch = globalThis.fetch;
globalThis.fetch = ((input: Parameters<typeof fetch>[0], init?: RequestInit) => {
  if (role === 'resume') throw new Error('NETWORK_FORBIDDEN_ON_ARCHIVE_RETRY');
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
    if (role === 'hold') {
      process.stdout.write('ARCHIVE_DIGEST_PERSISTED_HOLD\n');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0);
    }
    process.stdout.write('SIMULATE\n');
    return simulateInterleavedPortfolio(input);
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
  pollIntervalMs: 100, recoveryIntervalMs: 500,
  recoverPendingRunIds: () => listRecoverableBacktestRunIds([runId]),
  discardProcessingRunIds: listDiscardableBacktestRunIds,
});
queue.startWorker();
process.stdout.write('READY\n');
