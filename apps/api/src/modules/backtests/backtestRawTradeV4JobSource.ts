import { Exchange } from '@prisma/client';
import { prisma } from '../../prisma/client';
import type { BacktestRunJobDeps } from './backtestRunJob';
import type { RawTradeBudget, RawTradeCandle } from './backtestRawTradeSource';
import { readVerifiedRawTradeSnapshotV4ForRun,
  saveVerifiedRawTradeSnapshotV4ForRun } from './backtestRawTradeSource.repository';

type LocalSource = {
  candles: RawTradeCandle[];
  zipBytes: Uint8Array;
  checksumBytes: Uint8Array;
};

// This factory is intentionally absent from the production worker dependency
// graph. Both the caller and the process must opt in to the isolated proof.
export const createOptInRawTradeV4JobSource = (input: {
  budget: RawTradeBudget;
  loadSource: (symbol: string, day: string, startTimeMs: number,
    endTimeMs: number) => Promise<LocalSource>;
}): NonNullable<BacktestRunJobDeps['fetchVerifiedRawTradeV4ForRun']> =>
  async (runId, exchange, symbol, timeframe, marketType, maxCandles,
    endTimeMs, startTimeMs, expectedDigest, executionToken) => {
    if (process.env.RUN_011A_RAW_V4_JOB_PROOF !== '1')
      throw new Error('BACKTEST_RAW_SOURCE_JOB_DISABLED');
    const count = typeof endTimeMs === 'number' && typeof startTimeMs === 'number'
      ? (endTimeMs - startTimeMs) / 60_000 : NaN;
    if (exchange !== Exchange.BINANCE || marketType !== 'FUTURES' ||
        timeframe !== '1m' || !Number.isSafeInteger(maxCandles) ||
        !Number.isSafeInteger(startTimeMs) || !Number.isSafeInteger(endTimeMs) ||
        startTimeMs! % 60_000 !== 0 || endTimeMs! % 60_000 !== 0 ||
        !Number.isSafeInteger(count) || count < 1 || count > 120 ||
        count > maxCandles ||
        Math.floor(startTimeMs! / 86_400_000) !==
          Math.floor((endTimeMs! - 1) / 86_400_000))
      throw new Error('BACKTEST_RAW_SOURCE_INVALID_MARKET_WINDOW');
    const window = { runId, symbol, startTimeMs: startTimeMs!, endTimeMs: endTimeMs!,
      budget: input.budget, expectedDigest };
    try {
      const replay = await readVerifiedRawTradeSnapshotV4ForRun(window);
      return { candles: replay.candles,
        digest: replay.snapshot.replayDigestSha256 };
    } catch (error) {
      if (!(error instanceof Error) ||
          error.message !== 'BACKTEST_RAW_SOURCE_SNAPSHOT_MISSING') throw error;
      // A retry with a digest can never change source or fetch a replacement.
      if (expectedDigest) throw error;
      if (await prisma.backtestRawTradeSourceRef.count({ where: { runId, symbol } }))
        throw error;
    }
    if (!executionToken) throw new Error('BACKTEST_RAW_SOURCE_CLAIM_REQUIRED');
    const day = new Date(startTimeMs!).toISOString().slice(0, 10);
    const source = await input.loadSource(symbol, day, startTimeMs!, endTimeMs!);
    if (source.candles.length !== count ||
        source.candles[0]?.openTime !== startTimeMs ||
        source.candles.at(-1)?.closeTime !== endTimeMs! - 1)
      throw new Error('BACKTEST_RAW_SOURCE_INVALID_WINDOW');
    await saveVerifiedRawTradeSnapshotV4ForRun({
      runId, executionToken, symbol, day, ...source, budget: input.budget,
    });
    const replay = await readVerifiedRawTradeSnapshotV4ForRun(window);
    return { candles: replay.candles,
      digest: replay.snapshot.replayDigestSha256 };
  };
