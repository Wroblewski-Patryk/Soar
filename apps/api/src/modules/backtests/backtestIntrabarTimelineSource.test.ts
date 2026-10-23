import { Exchange } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { fetchVerifiedIntrabarTimelineCandles } from './backtestIntrabarTimelineSource';
import type { BacktestKlineCandle } from './backtestDataGateway';

const sourceMocks = vi.hoisted(() => ({
  readArchive: vi.fn(),
  readRawV4: vi.fn(),
  fetchRecent: vi.fn(),
}));
vi.mock('./backtestBinanceFuturesIntrabarArchive', () => ({
  readVerifiedRunArchive: sourceMocks.readArchive,
}));
vi.mock('./backtestDataGateway', () => ({
  fetchKlinesWithVerifiedBinanceFuturesIntrabar: sourceMocks.fetchRecent,
}));
vi.mock('./backtestRawTradeSource.repository', () => ({
  readVerifiedRawTradeSnapshotV4ForRun: sourceMocks.readRawV4,
}));

const minute = 60_000;
const historicalStart = Math.floor((Date.now() - 72 * 60 * minute) / minute) * minute;
const recentStart = Math.floor((Date.now() - 10 * minute) / minute) * minute;
const candles = (start: number, archive: boolean): BacktestKlineCandle[] =>
  [0, 1].map((index) => ({
    openTime: start + index * minute,
    closeTime: start + (index + 1) * minute - 1,
    open: 1, high: 1.1, low: 0.9, close: 1, volume: 2,
    intrabarTicks: [
      { eventTime: start + index * minute + 1, price: 1, sequenceId: index * 2 },
      { eventTime: start + index * minute + 2, price: 1, sequenceId: index * 2 + 1 },
    ],
    intrabarProvenance: {
      source: archive ? 'BINANCE_USDM_AGGTRADES_ARCHIVE' : 'BINANCE_USDM_AGGTRADES',
      endpoint: archive ? 'data.binance.vision' : '/fapi/v1/aggTrades',
      symbol: 'ALICEUSDT', firstAggregateId: index * 2,
      lastAggregateId: index * 2 + 1, firstTradeId: index * 2,
      lastTradeId: index * 2 + 1, sha256: String(index + 1).repeat(64),
    },
  }));
const query = (startTimeMs: number, expectedDigest: string) => ({
  runId: 'historical-run', exchange: Exchange.BINANCE, symbol: 'ALICEUSDT',
  timeframe: '1m', marketType: 'FUTURES' as const, maxCandles: 2,
  startTimeMs, endTimeMs: startTimeMs + 2 * minute, expectedDigest,
});

describe('strict intrabar timeline source', () => {
  beforeEach(() => {
    sourceMocks.readArchive.mockReset();
    sourceMocks.readRawV4.mockReset();
    sourceMocks.fetchRecent.mockReset();
  });

  it('refuses a missing historical snapshot before REST even when REST has the same digest', async () => {
    const archiveCandles = candles(historicalStart, true);
    const restCandles = candles(historicalStart, false);
    const digest = digestVerifiedBinanceFuturesIntrabar(archiveCandles, 'ALICEUSDT');
    expect(digestVerifiedBinanceFuturesIntrabar(restCandles, 'ALICEUSDT')).toBe(digest);
    sourceMocks.readArchive.mockResolvedValue(null);
    sourceMocks.fetchRecent.mockResolvedValue(restCandles);

    await expect(fetchVerifiedIntrabarTimelineCandles(query(historicalStart, digest)))
      .rejects.toMatchObject({ code: 'SOURCE_UNAVAILABLE' });
    expect(sourceMocks.readArchive).toHaveBeenCalledWith(
      'historical-run', 'ALICEUSDT', historicalStart, historicalStart + 2 * minute);
    expect(sourceMocks.fetchRecent).not.toHaveBeenCalled();
  });

  it('refuses a changed historical snapshot without REST fallback', async () => {
    const archiveCandles = candles(historicalStart, true);
    sourceMocks.readArchive.mockRejectedValue(
      new Error('BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_CHANGED'));
    sourceMocks.fetchRecent.mockResolvedValue(candles(historicalStart, false));

    await expect(fetchVerifiedIntrabarTimelineCandles(query(historicalStart,
      digestVerifiedBinanceFuturesIntrabar(archiveCandles, 'ALICEUSDT'))))
      .rejects.toMatchObject({ code: 'SOURCE_CHANGED' });
    expect(sourceMocks.fetchRecent).not.toHaveBeenCalled();
  });

  it('replays an intact historical snapshot without REST', async () => {
    const archiveCandles = candles(historicalStart, true);
    sourceMocks.readArchive.mockResolvedValue(archiveCandles);

    await expect(fetchVerifiedIntrabarTimelineCandles(query(historicalStart,
      digestVerifiedBinanceFuturesIntrabar(archiveCandles, 'ALICEUSDT'))))
      .resolves.toEqual(archiveCandles);
    expect(sourceMocks.fetchRecent).not.toHaveBeenCalled();
  });

  it('keeps REST replay for a recent run without an archive', async () => {
    const restCandles = candles(recentStart, false);
    sourceMocks.readArchive.mockResolvedValue(null);
    sourceMocks.fetchRecent.mockResolvedValue(restCandles);

    await expect(fetchVerifiedIntrabarTimelineCandles(query(recentStart,
      digestVerifiedBinanceFuturesIntrabar(restCandles, 'ALICEUSDT'))))
      .resolves.toEqual(restCandles);
    expect(sourceMocks.fetchRecent).toHaveBeenCalledOnce();
  });

  const rawBudget = { maxZipBytes: 1, maxCsvBytes: 1,
    maxSelectedTrades: 1, maxElapsedMs: 1 };
  const rawQuery = () => ({ ...query(historicalStart, 'a'.repeat(64)),
    rawTradeV4Budget: rawBudget });

  it.each([
    ['another exchange', { exchange: Exchange.GATEIO }],
    ['SPOT', { marketType: 'SPOT' as const }],
    ['another timeframe', { timeframe: '5m' }],
    ['too few allowed candles', { maxCandles: 1 }],
    ['zero allowed candles', { maxCandles: 0 }],
    ['fractional candle limit', { maxCandles: 2.5 }],
    ['misaligned start', { startTimeMs: historicalStart + 1 }],
    ['window wider than limit', { endTimeMs: historicalStart + 3 * minute }],
    ['window above 120', { maxCandles: 121,
      endTimeMs: historicalStart + 121 * minute }],
    ['missing start', { startTimeMs: undefined }],
    ['missing end', { endTimeMs: undefined }],
    ['cross-day window', { startTimeMs: Date.parse('2026-10-17T23:59:00Z'),
      endTimeMs: Date.parse('2026-10-18T00:01:00Z') }],
  ] as Array<[string, Partial<ReturnType<typeof rawQuery>>]>)
  ('refuses raw v4 %s before reading any source', async (_name, override) => {
    sourceMocks.readRawV4.mockResolvedValue({ candles: candles(historicalStart, true) });
    await expect(fetchVerifiedIntrabarTimelineCandles({
      ...rawQuery(), ...override,
    })).rejects.toMatchObject({ code: 'SOURCE_UNAVAILABLE' });
    expect(sourceMocks.readRawV4).not.toHaveBeenCalled();
    expect(sourceMocks.readArchive).not.toHaveBeenCalled();
    expect(sourceMocks.fetchRecent).not.toHaveBeenCalled();
  });

  it('accepts exactly bounded Binance USD-M 1m v4 and keeps it offline', async () => {
    const rawCandles = candles(historicalStart, true);
    sourceMocks.readRawV4.mockResolvedValue({ candles: rawCandles });
    await expect(fetchVerifiedIntrabarTimelineCandles(rawQuery()))
      .resolves.toEqual(rawCandles);
    expect(sourceMocks.readRawV4).toHaveBeenCalledExactlyOnceWith({
      runId: 'historical-run', symbol: 'ALICEUSDT',
      startTimeMs: historicalStart, endTimeMs: historicalStart + 2 * minute,
      budget: rawBudget, expectedDigest: 'a'.repeat(64),
    });
    expect(sourceMocks.readArchive).not.toHaveBeenCalled();
    expect(sourceMocks.fetchRecent).not.toHaveBeenCalled();
  });
});
