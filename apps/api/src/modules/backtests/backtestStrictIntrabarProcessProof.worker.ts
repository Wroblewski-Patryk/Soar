import { normalizeSymbols } from '../../lib/symbols';
import { normalizeWalletRiskPercent } from '../engine/positionSizing';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { fetchVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from './backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { BacktestRunQueue } from './backtestRunQueue';
import { findBacktestRunById } from './backtests.repository';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from './backtestRange.service';
import { listDiscardableBacktestRunIds,
  listRecoverableBacktestRunIds } from './backtestRunOwnership.repository';
import { STRICT_PROOF_CANDLE_COUNT, strictProofCandles, strictProofPage,
  strictProofRows, type StrictProofSourceVariant } from './backtestStrictIntrabarProcessFixture';

const runId = process.env.SOAR_STRICT_PROOF_RUN_ID;
const queueName = process.env.WORKER_BACKTEST_QUEUE;
const role = process.env.SOAR_STRICT_PROOF_ROLE;
const variant = process.env.SOAR_STRICT_PROOF_SOURCE_VARIANT as StrictProofSourceVariant;
const dbName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
if (process.env.SOAR_STRICT_PROCESS_PROOF !== '1' ||
    dbName !== 'soar_011a_restart_test' || !runId ||
    !queueName?.startsWith('backtest-011a-process-') ||
    !['hold', 'resume'].includes(role ?? '') ||
    !['baseline', 'changed', 'gap'].includes(variant)) {
  throw new Error('Strict process proof requires its isolated test configuration');
}

const job = createClaimedBacktestRunJob({
  findBacktestRunById,
  uniqueSorted: normalizeSymbols,
  computeAdaptiveMaxCandles,
  resolveIndicatorWarmupCandles,
  normalizeWalletRiskPercent,
  parseStrategySignalRules,
  findOwnedStrategySignalConfig: async () => null,
  fetchKlines: async () => { throw new Error('STRICT_OHLC_FALLBACK_FORBIDDEN'); },
  fetchKlinesWithVerifiedBinanceFuturesIntrabar: async (
    exchange, symbol, timeframe, marketType, maxCandles, endTimeMs, startTimeMs,
  ) => {
    if (exchange !== 'BINANCE' || symbol !== 'BTCUSDT' || timeframe !== '1m' ||
        marketType !== 'FUTURES' || maxCandles < STRICT_PROOF_CANDLE_COUNT ||
        !startTimeMs || endTimeMs !== startTimeMs + STRICT_PROOF_CANDLE_COUNT * 60_000)
      throw new Error('STRICT_PROOF_WINDOW_MISMATCH');
    const candles = strictProofCandles(startTimeMs, variant);
    const rows = strictProofRows(startTimeMs, variant);
    return fetchVerifiedBinanceFuturesIntrabar({ symbol, candles,
      fetchPage: async (query) => strictProofPage(rows, query) });
  },
  fetchSupplementalSeries: async () => ({ fundingRates: [], openInterest: [], orderBook: [] }),
  simulateInterleavedPortfolio: (input) => {
    if (role === 'hold') {
      process.stdout.write('DIGEST_PERSISTED_HOLD\n');
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
  pollIntervalMs: 50, recoveryIntervalMs: 50,
  recoverPendingRunIds: () => listRecoverableBacktestRunIds([runId]),
  discardProcessingRunIds: listDiscardableBacktestRunIds,
});

queue.startWorker();
process.stdout.write('READY\n');
