import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeSymbols } from '../../lib/symbols';
import { normalizeWalletRiskPercent } from '../engine/positionSizing';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from './backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from './backtestRange.service';
import { BacktestRunQueue } from './backtestRunQueue';
import { listDiscardableBacktestRunIds,
  listRecoverableBacktestRunIds } from './backtestRunOwnership.repository';
import { findBacktestRunById, findOwnedStrategySignalConfig } from './backtests.repository';
import { createOptInRawTradeV4JobSource } from './backtestRawTradeV4JobSource';
import type { RawTradeBudget, RawTradeCandle } from './backtestRawTradeSource';

const symbol = 'ALICEUSDT';
const startTimeMs = Date.parse('2026-10-18T02:41:00.000Z');
const endTimeMs = Date.parse('2026-10-18T04:21:00.000Z');
const dcaTime = Date.parse('2026-10-18T02:46:47.639Z');
const ttpTime = Date.parse('2026-10-18T02:46:57.282Z');
const zipSha =
  'c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502';
const klineSha =
  '4738f1e447658e153413b01b32c07ad6f5d1791993e83404e611631caa698133';
const budget: RawTradeBudget = { maxZipBytes: 399_792,
  maxCsvBytes: 1_694_239, maxSelectedTrades: 1_730,
  maxElapsedMs: 30_000 };

const runId = process.env.SOAR_011A_ALICE_RAW_QUEUE_RUN_ID;
const role = process.env.SOAR_011A_ALICE_RAW_QUEUE_ROLE;
const queueName = process.env.WORKER_BACKTEST_QUEUE;
const db = new URL(process.env.DATABASE_URL ?? '');
const redis = new URL(process.env.REDIS_URL ?? '');
if (process.env.RUN_011A_ALICE_RAW_V4_NATURAL_QUEUE_PROOF !== '1' ||
    process.env.RUN_011A_RAW_V4_JOB_PROOF !== '1' || !runId ||
    !['hold', 'resume', 'retry'].includes(role ?? '') ||
    db.hostname !== '127.0.0.1' || db.port !== '62436' ||
    db.pathname !== '/soar_011a_alice_raw_natural_test' ||
    redis.hostname !== '127.0.0.1' || redis.port !== '62439' ||
    !queueName?.startsWith('backtest-011a-alice-raw-v4-natural-'))
  throw new Error('ALICE v4 queue proof requires own opt-in _test/Redis/queue');

globalThis.fetch = (() => {
  throw new Error('NETWORK_FORBIDDEN_IN_ALICE_RAW_QUEUE_PROOF');
}) as typeof fetch;

const sourceDir = process.env.RUN_011A_ALICE_RAW_SOURCE_DIR;
const releaseFile = process.env.SOAR_011A_ALICE_RAW_QUEUE_RELEASE_FILE;
const rawSource = createOptInRawTradeV4JobSource({ budget,
  loadSource: async (requestedSymbol, day, requestedStart, requestedEnd) => {
    if (role !== 'hold') throw new Error('ALICE_RAW_SOURCE_REFETCH_FORBIDDEN');
    if (!sourceDir || requestedSymbol !== symbol || day !== '2026-10-18' ||
        requestedStart !== startTimeMs || requestedEnd !== endTimeMs)
      throw new Error('ALICE_RAW_SOURCE_WINDOW_CHANGED');
    const basename = `${symbol}-trades-${day}.zip`;
    const zipBytes = readFileSync(join(sourceDir, basename));
    const checksumBytes = readFileSync(join(sourceDir, `${basename}.CHECKSUM`));
    const klineBytes = readFileSync(join(sourceDir,
      'ALICEUSDT-klines-0241-0421.json'));
    if (zipBytes.length !== budget.maxZipBytes ||
        createHash('sha256').update(zipBytes).digest('hex') !== zipSha ||
        checksumBytes.toString().trim() !== `${zipSha}  ${basename}` ||
        createHash('sha256').update(klineBytes).digest('hex') !== klineSha)
      throw new Error('ALICE_RAW_SOURCE_BYTES_CHANGED');
    const rows = JSON.parse(klineBytes.toString()) as Array<Array<string | number>>;
    const candles: RawTradeCandle[] = rows.map((row) => ({
      openTime: Number(row[0]), open: Number(row[1]), high: Number(row[2]),
      low: Number(row[3]), close: Number(row[4]), volume: Number(row[5]),
      closeTime: Number(row[6]), tradeCount: Number(row[8]),
    }));
    if (candles.length !== 100 || candles[0].openTime !== startTimeMs ||
        candles.at(-1)?.closeTime !== endTimeMs - 1 ||
        candles.reduce((sum, candle) => sum + candle.tradeCount, 0) !== 1_730)
      throw new Error('ALICE_RAW_KLINES_CHANGED');
    process.stdout.write('SOURCE_LOADED_ONCE\n');
    return { candles, zipBytes, checksumBytes };
  },
});

const maxDrawdownFromPnlSeries = (pnls: number[]) => {
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  for (const pnl of pnls) {
    equity += pnl;
    if (equity > peak) peak = equity;
    const drawdown = peak > 0 ? (peak - equity) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown;
};

const job = createClaimedBacktestRunJob({
  findBacktestRunById, uniqueSorted: normalizeSymbols,
  computeAdaptiveMaxCandles, resolveIndicatorWarmupCandles,
  normalizeWalletRiskPercent, parseStrategySignalRules,
  findOwnedStrategySignalConfig,
  fetchKlines: async () => { throw new Error('OHLC_FALLBACK_FORBIDDEN'); },
  fetchVerifiedRawTradeV4ForRun: rawSource,
  fetchSupplementalSeries: async () => ({ fundingRates: [],
    openInterest: [], orderBook: [] }),
  simulateInterleavedPortfolio: (input) => {
    const tape = input.candlesBySymbol.get(symbol) ?? [];
    if (tape.length !== 100 || tape.reduce((sum, candle) =>
      sum + (candle.intrabarTicks?.length ?? 0), 0) !== 1_730)
      throw new Error('ALICE_RAW_REPLAY_TAPE_CHANGED');
    const ticks = tape[5].intrabarTicks ?? [];
    const dca = ticks.filter((tick) =>
      tick.eventTime === dcaTime && tick.price === 0.1454);
    const ttp = ticks.filter((tick) =>
      tick.eventTime === ttpTime && tick.price === 0.1454);
    if (dca.length !== 1 || dca[0].sequenceId !== 394_796_061 ||
        ttp.length !== 1 || ttp[0].sequenceId !== 394_796_067)
      throw new Error('ALICE_RAW_TICK_PAIR_CHANGED');
    if (role === 'hold') {
      process.stdout.write('SNAPSHOT_PERSISTED_BEFORE_SIMULATION\n');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0);
      throw new Error('Killed first worker unexpectedly resumed');
    }
    if (role === 'retry') throw new Error('COMPLETED_RUN_SIMULATED_AGAIN');
    if (!releaseFile) throw new Error('Recovery release file required');
    process.stdout.write('RECOVERY_CLAIMED_BEFORE_SIMULATION\n');
    while (!existsSync(releaseFile))
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    process.stdout.write('SIMULATE\n');
    const result = simulateInterleavedPortfolio(input);
    const events = result.perSymbol[symbol].events;
    const dcaEvent = events.find((event) => event.type === 'DCA' &&
      event.timestamp.getTime() === dcaTime && event.price === 0.1454);
    const ttpEvent = events.find((event) => event.type === 'TTP' &&
      event.timestamp.getTime() === ttpTime && event.price === 0.1454);
    if (!dcaEvent || !ttpEvent || dcaEvent.tradeSequence !== ttpEvent.tradeSequence ||
        dcaEvent.candleIndex !== 5 || ttpEvent.candleIndex !== 5)
      throw new Error('ALICE_RAW_DCA_TTP_PAIR_MISSING');
    process.stdout.write('RAW_DCA_TTP_CONFIRMED\n');
    return result;
  },
  computeSourceWindowMs, maxDrawdownFromPnlSeries,
});

const queue = new BacktestRunQueue(async (id) => {
  process.stdout.write('JOB_INVOKED\n');
  await job(id);
  process.stdout.write('JOB_RETURNED\n');
}, {
  backend: 'redis', queueName, redisUrl: process.env.REDIS_URL,
  recoverPendingRunIds: () => listRecoverableBacktestRunIds([runId]),
  discardProcessingRunIds: listDiscardableBacktestRunIds,
});
queue.startWorker();
process.stdout.write('READY\n');
