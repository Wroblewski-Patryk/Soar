import type { Exchange } from '@prisma/client';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { fetchKlinesWithVerifiedBinanceFuturesIntrabar,
  type BacktestKlineCandle, type BacktestMarketType } from './backtestDataGateway';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';
import { readVerifiedRawTradeSnapshotV4ForRun } from './backtestRawTradeSource.repository';
import type { RawTradeBudget } from './backtestRawTradeSource';

export class BacktestTimelineSourceError extends Error {
  constructor(readonly code: 'RUN_NOT_COMPLETED' | 'SOURCE_DIGEST_MISSING' |
    'SOURCE_UNAVAILABLE' | 'SOURCE_CHANGED') {
    super('Verified intrabar timeline unavailable');
    this.name = 'BacktestTimelineSourceError';
  }
}

export const fetchVerifiedIntrabarTimelineCandles = async (input: {
  runId: string;
  exchange: Exchange;
  symbol: string;
  timeframe: string;
  marketType: BacktestMarketType;
  maxCandles: number;
  endTimeMs?: number;
  startTimeMs?: number;
  expectedDigest: unknown;
  // Only explicitly opted-in callers use v4. The production timeline keeps
  // its existing v1-v3 and recent-REST behavior until raw source cutover.
  rawTradeV4Budget?: RawTradeBudget;
}): Promise<BacktestKlineCandle[]> => {
  if (typeof input.expectedDigest !== 'string' ||
      !/^[0-9a-f]{64}$/.test(input.expectedDigest))
    throw new BacktestTimelineSourceError('SOURCE_DIGEST_MISSING');

  try {
    if (input.rawTradeV4Budget) {
      if (typeof input.startTimeMs !== 'number' ||
          typeof input.endTimeMs !== 'number')
        throw new BacktestTimelineSourceError('SOURCE_UNAVAILABLE');
      const raw = await readVerifiedRawTradeSnapshotV4ForRun({
        runId: input.runId, symbol: input.symbol,
        startTimeMs: input.startTimeMs, endTimeMs: input.endTimeMs,
        budget: input.rawTradeV4Budget,
        expectedDigest: input.expectedDigest,
      });
      return raw.candles;
    }
    // Once the window is older than REST coverage, require the persisted
    // archive rather than reconstructing a completed run from another source.
    const archiveRequired = typeof input.startTimeMs === 'number' &&
      input.startTimeMs < Date.now() - 48 * 60 * 60_000 + 1_000;
    const archived = typeof input.startTimeMs === 'number' &&
      typeof input.endTimeMs === 'number'
      ? await readVerifiedRunArchive(input.runId, input.symbol,
        input.startTimeMs, input.endTimeMs) : null;
    if (archiveRequired && !archived)
      throw new BacktestTimelineSourceError('SOURCE_UNAVAILABLE');
    const candles = archived ?? await fetchKlinesWithVerifiedBinanceFuturesIntrabar(
      input.exchange, input.symbol, input.timeframe, input.marketType,
      input.maxCandles, input.endTimeMs, input.startTimeMs);
    const digest = digestVerifiedBinanceFuturesIntrabar(candles, input.symbol);
    if (digest !== input.expectedDigest)
      throw new BacktestTimelineSourceError('SOURCE_CHANGED');
    return candles;
  } catch (error) {
    if (error instanceof BacktestTimelineSourceError) throw error;
    if (error instanceof Error && error.message.startsWith('BACKTEST_RAW_SOURCE_'))
      throw new BacktestTimelineSourceError(
        ['BACKTEST_RAW_SOURCE_MISSING',
          'BACKTEST_RAW_SOURCE_SNAPSHOT_MISSING'].includes(error.message)
          ? 'SOURCE_UNAVAILABLE' : 'SOURCE_CHANGED');
    if (error instanceof Error && [
      'BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_CHANGED',
      'BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_MISMATCH',
      'BACKTEST_INTRABAR_ARCHIVE_BAD_ZIP',
      'BACKTEST_INTRABAR_ARCHIVE_BAD_CSV',
      'BACKTEST_INTRABAR_ARCHIVE_SEQUENCE_GAP',
      'BACKTEST_INTRABAR_ARCHIVE_BOUNDARY_INCOMPLETE',
      'BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_INVALID',
    ].includes(error.message))
      throw new BacktestTimelineSourceError('SOURCE_CHANGED');
    throw new BacktestTimelineSourceError('SOURCE_UNAVAILABLE');
  }
};
