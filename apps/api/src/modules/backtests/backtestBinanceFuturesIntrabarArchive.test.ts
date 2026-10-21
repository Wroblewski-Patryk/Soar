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

const midnightStart = Date.parse('2020-01-01T23:58:00.000Z');
const midnightCandles = [0, 1, 2, 3].map((index) => ({
  openTime: midnightStart + index * 60_000,
  closeTime: midnightStart + (index + 1) * 60_000 - 1,
  open: 100, high: 100, low: 100, close: 100, volume: 2,
}));
const midnightRows = [
  [100, 100, 1, 200, 200, midnightStart - 500, false],
  ...[0, 1, 2, 3].flatMap((minute) => [1, 2].map((second) => {
    const index = minute * 2 + second;
    return [100 + index, 100, 1, 200 + index, 200 + index,
      midnightStart + minute * 60_000 + second, false];
  })),
  [109, 100, 1, 209, 209, midnightStart + 240_500, false],
];
const midnightArchiveFetcher = (options: {
  rows?: unknown[][];
  missingDay?: string;
  missingChecksumDay?: string;
  changedChecksumDay?: string;
  csvOverride?: Record<string, string>;
  zipLevel?: 0 | 9;
} = {}) => {
  const days = ['2020-01-01', '2020-01-02'];
  const requested: string[] = [];
  const payloads = new Map(days.map((archiveDay) => {
    const archiveName = `BTCUSDT-aggTrades-${archiveDay}.zip`;
    const csv = options.csvOverride?.[archiveDay] ?? [
      'agg_trade_id,price,quantity,first_trade_id,last_trade_id,transact_time,is_buyer_maker',
      ...(options.rows ?? midnightRows)
        .filter((row) => new Date(Number(row[5])).toISOString().slice(0, 10) === archiveDay)
        .map((row) => row.join(',')),
    ].join('\n');
    const zip = zipSync({ [archiveName.replace('.zip', '.csv')]: strToU8(csv) },
      { level: options.zipLevel ?? 0 });
    const checksum = createHash('sha256').update(zip).digest('hex');
    return [archiveDay, { archiveName, zip, checksum }] as const;
  }));
  const fetcher = (async (url: string) => {
    requested.push(url);
    const archiveDay = days.find((value) => url.includes(value))!;
    const payload = payloads.get(archiveDay)!;
    if (archiveDay === options.missingDay ||
        (url.endsWith('.CHECKSUM') && archiveDay === options.missingChecksumDay))
      return new Response(null, { status: 404 });
    return new Response(url.endsWith('.CHECKSUM')
      ? `${archiveDay === options.changedChecksumDay ? '0'.repeat(64) : payload.checksum}  ${payload.archiveName}\n`
      : payload.zip, { status: 200 });
  }) as typeof fetch;
  return { fetcher, requested, payloads };
};

describe('Binance USD-M daily aggTrades archive', () => {
  it('verifies checksum, bounded IDs and OHLC, then reproduces the tape digest', async () => {
    const first = await fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows) });
    const second = await fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT', candles,
      fetcher: archiveFetcher(rows) });
    expect(first.snapshot.version).toBe(1);
    if (first.snapshot.version !== 1) throw new Error('Expected one archive');
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

describe('two adjacent UTC daily archives', () => {
  it('verifies both checksums and a continuous merged tape with a stable digest', async () => {
    const fixture = midnightArchiveFetcher();
    const first = await fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles, fetcher: fixture.fetcher });
    const second = await fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles, fetcher: midnightArchiveFetcher().fetcher });
    expect(first.snapshot.version).toBe(2);
    if (first.snapshot.version !== 2) throw new Error('Expected two archives');
    expect(first.snapshot.archives.map((archive) => archive.day))
      .toEqual(['2020-01-01', '2020-01-02']);
    expect(first.snapshot.archives.map((archive) => archive.zipSha256))
      .toEqual(['2020-01-01', '2020-01-02'].map((archiveDay) =>
        fixture.payloads.get(archiveDay)!.checksum));
    expect(fixture.requested).toHaveLength(4);
    expect(first.snapshot.rows.map((row) => row.a))
      .toEqual([100, 101, 102, 103, 104, 105, 106, 107, 108, 109]);
    expect(digestVerifiedBinanceFuturesIntrabar(first.verified, 'BTCUSDT'))
      .toBe(digestVerifiedBinanceFuturesIntrabar(second.verified, 'BTCUSDT'));
  });

  it('fails closed when the second ZIP or checksum is missing or changed', async () => {
    for (const options of [
      { missingDay: '2020-01-02' },
      { missingChecksumDay: '2020-01-02' },
    ]) {
      await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
        candles: midnightCandles, fetcher: midnightArchiveFetcher(options).fetcher }))
        .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_FETCH_FAILED');
    }
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles,
      fetcher: midnightArchiveFetcher({ changedChecksumDay: '2020-01-02' }).fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_MISMATCH');
  });

  it('rejects a gap or time reversal at the midnight join', async () => {
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles,
      fetcher: midnightArchiveFetcher({ rows: midnightRows.filter((row) => row[0] !== 105) }).fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_SEQUENCE_GAP');
    const reversed = midnightRows.map((row) => [...row]);
    reversed[5][5] = midnightStart + 60_000 - 1;
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles,
      fetcher: midnightArchiveFetcher({ rows: reversed }).fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_BAD_CSV');
  });

  it('rejects an OHLC mismatch and a combined compressed-size overflow', async () => {
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles.map((candle, index) => index === 2
        ? { ...candle, high: 101 } : candle),
      fetcher: midnightArchiveFetcher().fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_SOURCE_OHLC_MISMATCH');
    const huge = 'x'.repeat(4 * 1024 * 1024 + 1);
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles,
      fetcher: midnightArchiveFetcher({ csvOverride: {
        '2020-01-01': huge, '2020-01-02': huge,
      } }).fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_LIMIT');
    const expanded = 'x'.repeat(33 * 1024 * 1024);
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles,
      fetcher: midnightArchiveFetcher({ zipLevel: 9, csvOverride: {
        '2020-01-01': expanded, '2020-01-02': expanded,
      } }).fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_LIMIT');
  });

  it('applies the selected-row limit to both archives together', async () => {
    const manyRows = [
      midnightRows[0],
      ...Array.from({ length: 20_001 }, (_, index) => {
        const id = 101 + index;
        return [id, 100, 1, 200 + id - 100, 200 + id - 100,
          index < 10_001 ? midnightStart + 1 : midnightStart + 120_001, false];
      }),
      [20_102, 100, 1, 20_202, 20_202, midnightStart + 240_500, false],
    ];
    await expect(fetchVerifiedDailyUsdMArchive({ symbol: 'BTCUSDT',
      candles: midnightCandles,
      fetcher: midnightArchiveFetcher({ rows: manyRows }).fetcher }))
      .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_LIMIT');
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
  expect(source.snapshot.version).toBe(1);
  if (source.snapshot.version !== 1) throw new Error('Expected one archive');
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

publicIt('verifies the frozen ALICEUSDT crossing of UTC midnight from two official archives', async () => {
  const historicalStart = Date.parse('2026-10-17T23:50:00.000Z');
  const end = historicalStart + 20 * 60_000;
  const response = await fetch(
    `https://fapi.binance.com/fapi/v1/klines?symbol=ALICEUSDT&interval=1m&startTime=${
      historicalStart}&endTime=${end - 1}&limit=20`,
    { signal: AbortSignal.timeout(20_000) });
  expect(response.ok).toBe(true);
  const klines = await response.json() as Array<Array<string | number>>;
  const historicalCandles = klines.map((row) => ({
    openTime: Number(row[0]), closeTime: Number(row[6]),
    open: Number(row[1]), high: Number(row[2]), low: Number(row[3]),
    close: Number(row[4]), volume: Number(row[5]),
  }));
  expect(historicalCandles).toHaveLength(20);
  const source = await fetchVerifiedDailyUsdMArchive({ symbol: 'ALICEUSDT',
    candles: historicalCandles });
  expect(source.snapshot.version).toBe(2);
  if (source.snapshot.version !== 2) throw new Error('Expected two archives');
  expect(source.snapshot.archives.map((archive) => archive.day))
    .toEqual(['2026-10-17', '2026-10-18']);
  expect(source.snapshot.archives.map((archive) => archive.zipSha256)).toEqual([
    '0cb11b74fb1514e650613d23fb60224a4131af6fcbff0c14218604762dee9b01',
    '4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b',
  ]);
  expect(source.verified).toHaveLength(20);
  expect(source.verified.every((candle) => candle.intrabarTicks.length >= 2)).toBe(true);
  expect(digestVerifiedBinanceFuturesIntrabar(source.verified, 'ALICEUSDT'))
    .toMatch(/^[0-9a-f]{64}$/);
}, 90_000);
