import { createHash } from 'node:crypto';
import { digestRawTradeCanonical, RAW_TRADE_SOURCE_TYPE,
  type RawTradeCandle, type VerifiedRawTradeSource } from './backtestRawTradeSource';

export type RawTradeSnapshotV4 = {
  version: 4;
  sourceType: typeof RAW_TRADE_SOURCE_TYPE;
  symbol: string;
  startTimeMs: number;
  endTimeMs: number;
  klineSource: {
    endpoint: '/fapi/v1/klines'; interval: '1m'; symbol: string;
    normalizedCandlesSha256: string;
  };
  sources: Array<{ day: string; zipSha256: string;
    checksumSha256: string; sourceUrl: string; csvBytes: number;
    selectedTradeCount: number }>;
  candles: RawTradeCandle[];
  candleTapeSha256: string[];
  tapeSha256: string;
  replayDigestSha256: string;
};

export type VerifiedRawTradeReplayCandle = RawTradeCandle & {
  intrabarTicks: Array<{ eventTime: number; price: number; sequenceId: number }>;
  intrabarProvenance: {
    source: 'BINANCE_USDM_TRADES_ARCHIVE'; endpoint: 'data.binance.vision';
    symbol: string; firstTradeId: number; lastTradeId: number;
    sha256: string; archiveProof: 'PERSISTED_CHECKSUM_REVERIFIED';
  };
};

export const rawTradeReplayDigest = (candles: RawTradeCandle[],
  candleTapeSha256: string[]) => {
  if (candles.length < 1 || candles.length !== candleTapeSha256.length ||
      candleTapeSha256.some((digest) => !/^[0-9a-f]{64}$/.test(digest)))
    throw new Error('BACKTEST_RAW_SOURCE_SNAPSHOT_CHANGED');
  return createHash('sha256').update(candles.map((candle, index) =>
    `${candle.openTime}:${candleTapeSha256[index]}`).join('|')).digest('hex');
};

export const buildRawTradeSnapshotV4 = (verified: VerifiedRawTradeSource):
RawTradeSnapshotV4 => ({
  version: 4, sourceType: RAW_TRADE_SOURCE_TYPE,
  symbol: verified.symbol,
  startTimeMs: verified.candles[0].openTime,
  endTimeMs: verified.candles[verified.candles.length - 1].closeTime + 1,
  klineSource: { endpoint: '/fapi/v1/klines', interval: '1m',
    symbol: verified.symbol,
    normalizedCandlesSha256: verified.candlesSha256 },
  sources: [{ day: verified.day, zipSha256: verified.zipSha256,
    checksumSha256: verified.checksumSha256, sourceUrl: verified.sourceUrl,
    csvBytes: verified.csvBytes,
    selectedTradeCount: verified.selectedTradeCount }],
  candles: verified.candles,
  candleTapeSha256: verified.candleTapeSha256,
  tapeSha256: verified.tapeSha256,
  replayDigestSha256: rawTradeReplayDigest(verified.candles,
    verified.candleTapeSha256),
});

export const hashRawTradeSnapshotV4 = (snapshot: RawTradeSnapshotV4) =>
  digestRawTradeCanonical(snapshot);

export const rawTradeReplayCandles = (verified: VerifiedRawTradeSource):
VerifiedRawTradeReplayCandle[] => {
  if (!verified.intrabarTicks ||
      verified.intrabarTicks.length !== verified.candles.length)
    throw new Error('BACKTEST_RAW_SOURCE_TICKS_MISSING');
  return verified.candles.map((candle, index) => {
    const ticks = verified.intrabarTicks![index];
    if (ticks.length !== candle.tradeCount ||
        ticks[0]?.sequenceId !== verified.observed[index].firstTradeId ||
        ticks.at(-1)?.sequenceId !== verified.observed[index].lastTradeId)
      throw new Error('BACKTEST_RAW_SOURCE_TICKS_CHANGED');
    return { ...candle, intrabarTicks: ticks,
      intrabarProvenance: {
        source: 'BINANCE_USDM_TRADES_ARCHIVE' as const,
        endpoint: 'data.binance.vision' as const,
        symbol: verified.symbol,
        firstTradeId: verified.observed[index].firstTradeId,
        lastTradeId: verified.observed[index].lastTradeId,
        sha256: verified.candleTapeSha256[index],
        archiveProof: 'PERSISTED_CHECKSUM_REVERIFIED' as const,
      },
    };
  });
};
