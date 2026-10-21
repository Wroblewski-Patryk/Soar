import { createHash } from 'node:crypto';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { fetchVerifiedDailyUsdMArchive } from './backtestBinanceFuturesIntrabarArchive';

const day = '2020-01-01';
const start = Date.parse(`${day}T00:01:00.000Z`);
const basename = `BTCUSDT-aggTrades-${day}.zip`;
const csvName = basename.replace('.zip', '.csv');
const candles = [0, 1].map((index) => ({
  openTime: start + index * 60_000,
  closeTime: start + (index + 1) * 60_000 - 1,
  open: 100, high: 100, low: 100, close: 100, volume: 2,
}));
const rows = [
  [100, 100, 1, 200, 200, start - 500, false],
  [101, 100, 1, 201, 201, start + 1, false],
  [102, 100, 1, 202, 202, start + 2, false],
  [103, 100, 1, 203, 203, start + 60_001, false],
  [104, 100, 1, 204, 204, start + 60_002, false],
  [105, 100, 1, 205, 205, start + 120_500, false],
];
const archiveFetcher = (inputRows: unknown[][], checksumOverride?: string) => {
  const csv = ['agg_trade_id,price,quantity,first_trade_id,last_trade_id,transact_time,is_buyer_maker',
    ...inputRows.map((row) => row.join(','))].join('\n');
  const zip = zipSync({ [csvName]: strToU8(csv) });
  const checksum = checksumOverride ?? createHash('sha256').update(zip).digest('hex');
  return (async (url: string) => new Response(
    url.endsWith('.CHECKSUM') ? `${checksum}  ${basename}\n` : zip,
    { status: 200 },
  )) as typeof fetch;
};

describe('Binance USD-M daily aggTrades archive', () => {
  it('verifies checksum, bounded IDs and OHLC, then reproduces the tape digest', async () => {
    const first = await fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows) });
    const second = await fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows) });
    expect(first.snapshot.zipSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(first.snapshot.rows.map((row) => row.a)).toEqual([100, 101, 102, 103, 104, 105]);
    expect(first.verified[0].intrabarProvenance.source)
      .toBe('BINANCE_USDM_AGGTRADES_ARCHIVE');
    expect(digestVerifiedBinanceFuturesIntrabar(first.verified, 'BTCUSDT'))
      .toBe(digestVerifiedBinanceFuturesIntrabar(second.verified, 'BTCUSDT'));
  });

  it('refuses a changed ZIP before replay', async () => {
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows, '0'.repeat(64)) }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_MISMATCH');
  });

  it('refuses an aggregate ID gap and a missing edge', async () => {
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows.filter((row) => row[0] !== 102)) }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_SEQUENCE_GAP');
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows.slice(1)) }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_BOUNDARY_INCOMPLETE');
  });

  it('refuses a candle not matched by source rows', async () => {
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: [{ ...candles[0], high: 101 }, candles[1]],
      fetcher: archiveFetcher(rows) })).rejects.toThrow('BACKTEST_INTRABAR_SOURCE_OHLC_MISMATCH');
  });
});

const publicIt = process.env.RUN_BINANCE_USDM_ARCHIVE_PUBLIC_PROOF === '1' ? it : it.skip;
publicIt('verifies an actual archived ALICEUSDT window older than 48 hours', async () => {
  const historicalStart = Date.parse('2026-10-18T00:02:00.000Z');
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=ALICEUSDT&interval=1m&startTime=${
    historicalStart}&endTime=${historicalStart + 120_000 - 1}&limit=2`;
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  expect(response.ok).toBe(true);
  const klines = await response.json() as Array<Array<string | number>>;
  const historicalCandles = klines.map((row) => ({
    openTime: Number(row[0]), closeTime: Number(row[6]),
    open: Number(row[1]), high: Number(row[2]), low: Number(row[3]),
    close: Number(row[4]), volume: Number(row[5]),
  }));
  expect(historicalCandles).toHaveLength(2);
  const source = await fetchVerifiedDailyUsdMArchive({ symbol: 'ALICEUSDT',
    candles: historicalCandles });
  expect(source.snapshot.zipSha256)
    .toBe('4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b');
  expect(source.verified).toHaveLength(2);
  expect(source.verified[0].intrabarTicks.length).toBeGreaterThanOrEqual(2);
  expect(source.verified[1].intrabarTicks.length).toBeGreaterThanOrEqual(2);
}, 60_000);

publicIt('covers a 100-minute archived window for the backtest warmup contract', async () => {
  const historicalStart = Date.parse('2026-10-18T02:27:00.000Z');
  const end = historicalStart + 100 * 60_000;
  const response = await fetch(
    `https://fapi.binance.com/fapi/v1/klines?symbol=ALICEUSDT&interval=1m&startTime=${
      historicalStart}&endTime=${end - 1}&limit=100`,
    { signal: AbortSignal.timeout(15_000) });
  expect(response.ok).toBe(true);
  const klines = await response.json() as Array<Array<string | number>>;
  const historicalCandles = klines.map((row) => ({
    openTime: Number(row[0]), closeTime: Number(row[6]),
    open: Number(row[1]), high: Number(row[2]), low: Number(row[3]),
    close: Number(row[4]), volume: Number(row[5]),
  }));
  expect(historicalCandles).toHaveLength(100);
  const source = await fetchVerifiedDailyUsdMArchive({ symbol: 'ALICEUSDT',
    candles: historicalCandles });
  expect(source.verified).toHaveLength(100);
  expect(source.snapshot.startTimeMs).toBe(historicalStart);
  expect(source.snapshot.endTimeMs).toBe(end);
}, 60_000);
