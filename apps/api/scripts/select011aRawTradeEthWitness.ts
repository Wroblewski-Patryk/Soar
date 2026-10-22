import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marketSequenceStrategyConfig } from '../src/modules/backtests/backtest011aMarketWitness.config';
import { simulateInterleavedPortfolio } from '../src/modules/backtests/backtestPortfolioSimulation.service';
import { verifyBinanceUsdMRawTradeSource,
  type RawTradeBudget, type RawTradeCandle } from '../src/modules/backtests/backtestRawTradeSource';
import { rawTradeReplayCandles } from '../src/modules/backtests/backtestRawTradeSnapshotV4';

// Frozen before the result in position-parity-011a-eth-raw-sequence-selection-plan-2026-10-22.md.
const symbol = 'ETHUSDT';
const day = '2026-10-18';
const start = Date.parse('2026-10-18T02:00:00.000Z');
const end = Date.parse('2026-10-18T04:00:00.000Z');
const minuteMs = 60_000;
const windowMinutes = 100;
const candidateCount = 21;
const expectedZipSha =
  '8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7';
const expectedKlinesSha =
  '9334eb8e2f94a34e8a45c9dfdba6544a0ee7d8f5129b85d2055cd6d19f2acc3f';
const budget: RawTradeBudget = { maxZipBytes: 29_176_827,
  maxCsvBytes: 178_044_910, maxSelectedTrades: 199_234,
  maxElapsedMs: 120_000 };
const expectedConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: -100,
      params: { period: 2 } }], indicatorsShort: [] },
  close: { mode: 'advanced', ttp: [{ percent: 0.08, arm: 0.05 }], tsl: [] },
  additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: 0.10, multiplier: 1 }], marginMode: 'ISOLATED' },
};
const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

const main = async () => {
  if (process.env.RUN_011A_ETH_RAW_WITNESS_SELECTOR !== '1')
    throw new Error('OPT_IN_REQUIRED');
  if (JSON.stringify(marketSequenceStrategyConfig) !== JSON.stringify(expectedConfig))
    throw new Error('FROZEN_STRATEGY_CHANGED');
  const archiveDir = process.env.RUN_011A_RAW_ARCHIVE_DIR;
  const klineDir = process.env.RUN_011A_KLINES_DIR;
  if (!archiveDir || !klineDir) throw new Error('LOCAL_SOURCE_PATHS_REQUIRED');
  const basename = `${symbol}-trades-${day}.zip`;
  const zipBytes = readFileSync(join(archiveDir, basename));
  const checksumBytes = readFileSync(join(archiveDir, `${basename}.CHECKSUM`));
  const klineBytes = readFileSync(join(klineDir, `${symbol}-klines.json`));
  if (zipBytes.length !== budget.maxZipBytes || sha256(zipBytes) !== expectedZipSha ||
      sha256(klineBytes) !== expectedKlinesSha)
    throw new Error('FROZEN_SOURCE_CHANGED');
  const rows = JSON.parse(klineBytes.toString()) as Array<Array<string | number>>;
  const candles: RawTradeCandle[] = rows.map((row) => ({
    openTime: Number(row[0]), open: Number(row[1]), high: Number(row[2]),
    low: Number(row[3]), close: Number(row[4]), volume: Number(row[5]),
    closeTime: Number(row[6]), tradeCount: Number(row[8]),
  }));
  if (candles.length !== 120 || candles[0].openTime !== start ||
      candles.at(-1)?.closeTime !== end - 1 ||
      candles.reduce((sum, candle) => sum + candle.tradeCount, 0) !==
        budget.maxSelectedTrades)
    throw new Error('FROZEN_CANDLES_CHANGED');
  const verified = await verifyBinanceUsdMRawTradeSource({ symbol, day,
    candles, zipBytes, checksumBytes, budget, collectTicks: true });
  if (verified.zipSha256 !== expectedZipSha ||
      verified.selectedTradeCount !== budget.maxSelectedTrades ||
      verified.csvBytes !== budget.maxCsvBytes)
    throw new Error('VERIFIED_SOURCE_CHANGED');
  const tape = rawTradeReplayCandles(verified);
  if (tape.length !== 120 || tape.reduce((sum, candle) =>
    sum + candle.intrabarTicks.length, 0) !== budget.maxSelectedTrades)
    throw new Error('RAW_TICK_COVERAGE_CHANGED');

  const windows: Array<{ start: string; dca: number; ttp: number;
    uniqueSourcePairs: number }> = [];
  for (let offset = 0; offset < candidateCount; offset += 1) {
    const window = tape.slice(offset, offset + windowMinutes);
    if (window.length !== windowMinutes ||
        window[0].openTime !== start + offset * minuteMs ||
        window.at(-1)?.closeTime !== start + (offset + windowMinutes) * minuteMs - 1)
      throw new Error('WINDOW_NOT_CONTIGUOUS');
    const simulation = simulateInterleavedPortfolio({ symbols: [symbol],
      candlesBySymbol: new Map([[symbol, window]]),
      analysisStartIndexBySymbol: new Map([[symbol, 2]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
      strategyConfig: marketSequenceStrategyConfig, walletRiskPercent: 10,
      initialBalance: 1_000, fillModelConfig: { feeRate: 0.0004, slippageRate: 0 },
    }).perSymbol[symbol];
    const dcas = simulation.events.filter((event) => event.type === 'DCA');
    const ttps = simulation.events.filter((event) => event.type === 'TTP');
    let uniqueSourcePairs = 0;
    for (const dca of dcas) {
      const later = ttps.filter((event) =>
        event.tradeSequence === dca.tradeSequence &&
        event.candleIndex === dca.candleIndex &&
        event.timestamp.getTime() > dca.timestamp.getTime());
      for (const ttp of later) {
        const ticks = window[dca.candleIndex].intrabarTicks;
        const dcaMatches = ticks.filter((tick) =>
          tick.eventTime === dca.timestamp.getTime() && tick.price === dca.price);
        const ttpMatches = ticks.filter((tick) =>
          tick.eventTime === ttp.timestamp.getTime() && tick.price === ttp.price);
        if (dcaMatches.length !== 1 || ttpMatches.length !== 1 ||
            ttpMatches[0].sequenceId <= dcaMatches[0].sequenceId) continue;
        uniqueSourcePairs += 1;
        windows.push({ start: new Date(window[0].openTime).toISOString(),
          dca: dcas.length, ttp: ttps.length, uniqueSourcePairs });
        process.stdout.write(JSON.stringify({ status: 'WITNESS', symbol, day,
          zipSha256: verified.zipSha256, tapeSha256: verified.tapeSha256,
          selectedTradeCount: verified.selectedTradeCount,
          candidatesSeen: offset + 1, windows,
          windowStart: new Date(window[0].openTime).toISOString(),
          windowEnd: new Date(window.at(-1)!.closeTime + 1).toISOString(),
          dca: { time: dca.timestamp.toISOString(), price: dca.price,
            rawTradeId: dcaMatches[0].sequenceId, candleIndex: dca.candleIndex },
          ttp: { time: ttp.timestamp.toISOString(), price: ttp.price,
            rawTradeId: ttpMatches[0].sequenceId, candleIndex: ttp.candleIndex },
        }) + '\n');
        return;
      }
    }
    windows.push({ start: new Date(window[0].openTime).toISOString(),
      dca: dcas.length, ttp: ttps.length, uniqueSourcePairs });
  }
  process.stdout.write(JSON.stringify({ status: 'NO_WITNESS', symbol, day,
    zipSha256: verified.zipSha256, tapeSha256: verified.tapeSha256,
    selectedTradeCount: verified.selectedTradeCount,
    candidatesSeen: candidateCount, windows, witness: null }) + '\n');
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
