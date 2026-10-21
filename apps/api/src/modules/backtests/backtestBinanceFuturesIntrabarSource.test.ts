import { describe, expect, it, vi } from 'vitest';
import { fetchVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { verifyReplayIntrabarTicks } from './backtestIntrabarReplay';

const start = 1_700_000_000_000;
const nowMs = start + 60_000 + 60_000;
const candle = { openTime: start, closeTime: start + 59_999,
  open: 1, high: 1.25, low: 1, close: 1.13, volume: 4 };
const rows = [
  { a: 10, p: '1', q: '1', f: 20, l: 20, T: start + 1, m: false },
  { a: 11, p: '1.24', q: '1', f: 21, l: 21, T: start + 20_000, m: false },
  { a: 12, p: '1.25', q: '1', f: 22, l: 22, T: start + 20_000, m: false },
  { a: 13, p: '1.13', q: '1', f: 23, l: 23, T: start + 59_999, m: true },
];

describe('Binance USD-M verified intrabar source', () => {
  it('keeps exchange ID order at tied timestamps and returns deterministic provenance', async () => {
    const fetchPage = vi.fn(async () => rows);
    const first = await fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [candle], nowMs, fetchPage });
    const retry = await fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [candle], nowMs, fetchPage });
    expect(fetchPage).toHaveBeenCalledWith({ symbol: 'BTCUSDT', limit: 1000,
      startTime: start - 1000, endTime: start + 60_999 });
    expect(first).toEqual(retry);
    expect(first[0].intrabarTicks.map((tick) => [tick.eventTime, tick.sequenceId, tick.price]))
      .toEqual([[start + 1, 10, 1], [start + 20_000, 11, 1.24],
        [start + 20_000, 12, 1.25], [start + 59_999, 13, 1.13]]);
    expect(verifyReplayIntrabarTicks(first[0])).toEqual(first[0].intrabarTicks);
    expect(first[0].intrabarProvenance).toMatchObject({
      source: 'BINANCE_USDM_AGGTRADES', firstAggregateId: 10,
      lastAggregateId: 13, firstTradeId: 20, lastTradeId: 23,
      sha256: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
  });

  it('paginates inclusively by next aggregate ID without repeating a row', async () => {
    const flat = { ...candle, high: 1, close: 1, volume: 1001 };
    const many = Array.from({ length: 1001 }, (_, index) => ({
      a: index + 10, p: '1', q: '1', f: index + 20, l: index + 20,
      T: start + index, m: false,
    }));
    const fetchPage = vi.fn(async (query: { fromId?: number }) =>
      query.fromId ? many.slice(1000) : many.slice(0, 1000));
    const result = await fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [flat], nowMs, fetchPage });
    expect(fetchPage).toHaveBeenNthCalledWith(2,
      { symbol: 'BTCUSDT', fromId: 1010, limit: 1000 });
    expect(result[0].intrabarTicks).toHaveLength(1001);
  });

  it('allows additional pages only for verified archives while REST remains bounded', async () => {
    const many = Array.from({ length: 20_001 }, (_, index) => ({
      a: index + 10, p: '1', q: '1', f: index + 20, l: index + 20,
      T: start + index + 1, m: false,
    }));
    const flat = { ...candle, high: 1, close: 1, volume: many.length };
    const fetchPage = async (query: { fromId?: number }) => {
      const offset = query.fromId === undefined ? 0 : query.fromId - 10;
      return many.slice(offset, offset + 1000);
    };
    await expect(fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [flat], nowMs, fetchPage })).rejects.toThrow('BACKTEST_INTRABAR_SOURCE_LIMIT');
    const archived = await fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [flat], nowMs, fetchPage, verifiedArchive: true });
    expect(archived[0].intrabarTicks).toHaveLength(many.length);
    await expect(fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [flat], nowMs, verifiedArchive: true }))
      .rejects.toThrow('BACKTEST_INTRABAR_SOURCE_UNVERIFIED');
  });

  it('accepts skipped raw trade IDs when aggregate coverage and kline agree', async () => {
    const withRawGap = rows.map((row) => row.a === 12 ? { ...row, f: 24, l: 24 } :
      row.a === 13 ? { ...row, f: 25, l: 25 } : row);
    const result = await fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [candle], nowMs, fetchPage: async () => withRawGap });
    expect(result[0].intrabarProvenance.lastTradeId).toBe(25);
  });

  it.each([
    ['aggregate gap', rows.filter((row) => row.a !== 12), 'SEQUENCE_GAP'],
    ['raw trade overlap', rows.map((row) => row.a === 12 ? { ...row, f: 21, l: 22 } : row), 'SEQUENCE_GAP'],
    ['same-millisecond reversal', [rows[0], rows[2], rows[1], rows[3]], 'SEQUENCE_GAP'],
    ['missing volume', rows.slice(0, 3), 'OHLC_MISMATCH'],
    ['wrong high', rows.map((row) => row.a === 12 ? { ...row, p: '1.23' } : row), 'OHLC_MISMATCH'],
  ])('fails closed for %s', async (_name, response, reason) => {
    await expect(fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [candle], nowMs, fetchPage: async () => response }))
      .rejects.toThrow(`BACKTEST_INTRABAR_SOURCE_${reason}`);
  });

  it('rejects unavailable history, unsupported range and missing pages', async () => {
    await expect(fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [candle], nowMs: start + 49 * 60 * 60 * 1000,
      fetchPage: async () => rows })).rejects.toThrow('WINDOW_UNAVAILABLE');
    await expect(fetchVerifiedBinanceFuturesIntrabar({ symbol: 'BTCUSDT',
      candles: [candle], nowMs, fetchPage: async () => null }))
      .rejects.toThrow('BAD_PAGE');
  });
});
