import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marketSequenceStrategyConfig } from '../src/modules/backtests/backtest011aMarketWitness.config';
import { simulateInterleavedPortfolio } from '../src/modules/backtests/backtestPortfolioSimulation.service';
import { verifyBinanceUsdMRawTradeSource,
  type RawTradeBudget, type RawTradeCandle } from '../src/modules/backtests/backtestRawTradeSource';
import { rawTradeReplayCandles } from '../src/modules/backtests/backtestRawTradeSnapshotV4';

// Frozen before raw CSV was parsed in position-parity-011a-alice-raw-witness-plan-2026-10-22.md.
const symbol = 'ALICEUSDT';
const day = '2026-10-18';
const start = Date.parse('2026-10-18T02:41:00.000Z');
const end = Date.parse('2026-10-18T04:21:00.000Z');
const expectedZipSha =
  'c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502';
const expectedKlineSha =
  '4738f1e447658e153413b01b32c07ad6f5d1791993e83404e611631caa698133';
const budget: RawTradeBudget = { maxZipBytes: 399_792,
  maxCsvBytes: 1_694_239, maxSelectedTrades: 1_730,
  maxElapsedMs: 30_000 };
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
  if (process.env.RUN_011A_ALICE_RAW_WITNESS_SELECTOR !== '1')
    throw new Error('OPT_IN_REQUIRED');
  if (JSON.stringify(marketSequenceStrategyConfig) !== JSON.stringify(expectedConfig))
    throw new Error('FROZEN_STRATEGY_CHANGED');
  const sourceDir = process.env.RUN_011A_ALICE_RAW_SOURCE_DIR;
  if (!sourceDir) throw new Error('LOCAL_SOURCE_DIR_REQUIRED');
  const basename = `${symbol}-trades-${day}.zip`;
  const zipBytes = readFileSync(join(sourceDir, basename));
  const checksumBytes = readFileSync(join(sourceDir, `${basename}.CHECKSUM`));
  const klineBytes = readFileSync(join(sourceDir, 'ALICEUSDT-klines-0241-0421.json'));
  if (zipBytes.length !== budget.maxZipBytes || sha256(zipBytes) !== expectedZipSha ||
      checksumBytes.length !== 98 ||
      new TextDecoder().decode(checksumBytes).trim() !==
        `${expectedZipSha}  ${basename}` ||
      sha256(klineBytes) !== expectedKlineSha)
    throw new Error('FROZEN_SOURCE_CHANGED');
  const rows = JSON.parse(klineBytes.toString()) as Array<Array<string | number>>;
  const candles: RawTradeCandle[] = rows.map((row) => ({
    openTime: Number(row[0]), open: Number(row[1]), high: Number(row[2]),
    low: Number(row[3]), close: Number(row[4]), volume: Number(row[5]),
    closeTime: Number(row[6]), tradeCount: Number(row[8]),
  }));
  if (candles.length !== 100 || candles[0].openTime !== start ||
      candles.at(-1)?.closeTime !== end - 1 ||
      candles.reduce((sum, candle) => sum + candle.tradeCount, 0) !==
        budget.maxSelectedTrades)
    throw new Error('FROZEN_CANDLES_CHANGED');
  const began = Date.now();
  const verified = await verifyBinanceUsdMRawTradeSource({ symbol, day,
    candles, zipBytes, checksumBytes, budget, collectTicks: true });
  const verificationMs = Date.now() - began;
  if (verified.zipSha256 !== expectedZipSha ||
      verified.csvBytes !== budget.maxCsvBytes ||
      verified.selectedTradeCount !== budget.maxSelectedTrades)
    throw new Error('VERIFIED_SOURCE_CHANGED');
  const tape = rawTradeReplayCandles(verified);
  if (tape.length !== 100 || tape.reduce((sum, candle) =>
    sum + candle.intrabarTicks.length, 0) !== budget.maxSelectedTrades)
    throw new Error('RAW_TICK_COVERAGE_CHANGED');
  const simulation = simulateInterleavedPortfolio({ symbols: [symbol],
    candlesBySymbol: new Map([[symbol, tape]]),
    analysisStartIndexBySymbol: new Map([[symbol, 2]]),
    marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
    strategyConfig: marketSequenceStrategyConfig, walletRiskPercent: 10,
    initialBalance: 1_000, fillModelConfig: { feeRate: 0.0004, slippageRate: 0 },
  }).perSymbol[symbol];
  const dcas = simulation.events.filter((event) => event.type === 'DCA');
  const ttps = simulation.events.filter((event) => event.type === 'TTP');
  let sameCandleLaterPairs = 0;
  let ambiguousOrMissingSourcePairs = 0;
  for (const dca of dcas) {
    const later = ttps.filter((ttp) =>
      ttp.tradeSequence === dca.tradeSequence &&
      ttp.candleIndex === dca.candleIndex &&
      ttp.timestamp.getTime() > dca.timestamp.getTime());
    for (const ttp of later) {
      sameCandleLaterPairs += 1;
      const ticks = tape[dca.candleIndex].intrabarTicks;
      const dcaMatches = ticks.filter((tick) =>
        tick.eventTime === dca.timestamp.getTime() && tick.price === dca.price);
      const ttpMatches = ticks.filter((tick) =>
        tick.eventTime === ttp.timestamp.getTime() && tick.price === ttp.price);
      if (dcaMatches.length !== 1 || ttpMatches.length !== 1 ||
          ttpMatches[0].sequenceId <= dcaMatches[0].sequenceId) {
        ambiguousOrMissingSourcePairs += 1;
        continue;
      }
      process.stdout.write(JSON.stringify({ status: 'WITNESS', symbol, day,
        windowStart: new Date(start).toISOString(),
        windowEnd: new Date(end).toISOString(),
        zipSha256: verified.zipSha256, tapeSha256: verified.tapeSha256,
        selectedTradeCount: verified.selectedTradeCount, verificationMs,
        dcaEvents: dcas.length, ttpEvents: ttps.length, sameCandleLaterPairs,
        dca: { time: dca.timestamp.toISOString(), price: dca.price,
          rawTradeId: dcaMatches[0].sequenceId, candleIndex: dca.candleIndex,
          tradeSequence: dca.tradeSequence },
        ttp: { time: ttp.timestamp.toISOString(), price: ttp.price,
          rawTradeId: ttpMatches[0].sequenceId, candleIndex: ttp.candleIndex,
          tradeSequence: ttp.tradeSequence },
      }) + '\n');
      return;
    }
  }
  process.stdout.write(JSON.stringify({ status: 'NO_WITNESS', symbol, day,
    windowStart: new Date(start).toISOString(),
    windowEnd: new Date(end).toISOString(),
    zipSha256: verified.zipSha256, tapeSha256: verified.tapeSha256,
    selectedTradeCount: verified.selectedTradeCount, verificationMs,
    dcaEvents: dcas.length, ttpEvents: ttps.length, sameCandleLaterPairs,
    ambiguousOrMissingSourcePairs, witness: null }) + '\n');
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
