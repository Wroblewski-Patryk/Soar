import { createHash } from 'node:crypto';
import { zipSync, strToU8 } from 'fflate';
import { describe, expect, it, vi } from 'vitest';
import { verifyBinanceUsdMRawTradeSource, type RawTradeBudget,
  type RawTradeCandle } from './backtestRawTradeSource';

const symbol = 'ETHUSDT';
const day = '2026-10-18';
const minute = Date.parse('2026-10-18T02:15:00.000Z');
const name = `${symbol}-trades-${day}.zip`;
const rows = [
  `10,100.0,0.4,40,${minute - 1},false`,
  `11,101.0,0.1,10.1,${minute},true`,
  `12,99.0,0.3,29.7,${minute + 1},false`,
];
const csv = `id,price,qty,quote_qty,time,is_buyer_maker\n${rows.join('\n')}\n`;
const zipBytes = zipSync({ [name.replace('.zip', '.csv')]: strToU8(csv) });
const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const checksumBytes = strToU8(`${digest(zipBytes)}  ${name}\n`);
const candles: RawTradeCandle[] = [
  { openTime: minute - 60_000, closeTime: minute - 1,
    open: 100, high: 100, low: 100, close: 100, volume: 0.4, tradeCount: 1 },
  { openTime: minute, closeTime: minute + 59_999,
    open: 101, high: 101, low: 99, close: 99, volume: 0.4, tradeCount: 2 },
];
const budget: RawTradeBudget = { maxZipBytes: zipBytes.length,
  maxCsvBytes: strToU8(csv).length, maxSelectedTrades: 3,
  maxElapsedMs: 5_000 };
const input = () => ({ symbol, day, candles, zipBytes, checksumBytes, budget });

describe('raw USD-M trade source preflight', () => {
  it('reconstructs the exact minute boundary and accepts measured limits', async () => {
    const verified = await verifyBinanceUsdMRawTradeSource(input());
    expect(verified.selectedTradeCount).toBe(3);
    expect(verified.observed.map((value) => [value.firstTradeId,
      value.lastTradeId, value.tradeCount, value.volume]))
      .toEqual([[10, 10, 1, 0.4], [11, 12, 2, 0.4]]);
    expect(verified.zipSha256).toBe(digest(zipBytes));
  });

  it('fails closed before parsing on missing source, budget or identity', async () => {
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(), budget: undefined }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_DISABLED_NO_BUDGET');
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(), zipBytes: undefined }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_MISSING');
    const changed = new Uint8Array(zipBytes);
    changed[40] ^= 1;
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(), zipBytes: changed }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_SOURCE_CHANGED');
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
      checksumBytes: strToU8(`${'0'.repeat(64)}  ${name}\n`) }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_SOURCE_CHANGED');
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
      expectedZipSha256: '0'.repeat(64) }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_SOURCE_CHANGED');
  });

  it('fails closed on ZIP, CSV, row and elapsed-time limits', async () => {
    for (const smaller of [
      { maxZipBytes: zipBytes.length - 1 },
      { maxCsvBytes: strToU8(csv).length - 1 },
      { maxSelectedTrades: 2 },
    ]) {
      await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
        budget: { ...budget, ...smaller } })).rejects.toThrow(/BACKTEST_RAW_SOURCE_(LIMIT|BAD_ZIP)/);
    }
    const now = vi.spyOn(Date, 'now');
    now.mockReturnValueOnce(0).mockReturnValue(1);
    try {
      await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
        budget: { ...budget, maxElapsedMs: 1 } }))
        .rejects.toThrow('BACKTEST_RAW_SOURCE_TIME_LIMIT');
    } finally { now.mockRestore(); }
  });

  it('rejects a wrong candle, bad day, malformed rows and a tampered ZIP', async () => {
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
      candles: [{ ...candles[0], volume: 0.5 }, candles[1]] }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_OHLC_MISMATCH');
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(), day: '2026-02-30' }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_INVALID_WINDOW');
    const malformed = csv.replace('11,101.0', '11,');
    const malformedZip = zipSync({ [name.replace('.zip', '.csv')]: strToU8(malformed) });
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
      zipBytes: malformedZip,
      checksumBytes: strToU8(`${digest(malformedZip)}  ${name}\n`) }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_BAD_CSV');
    const wrongZip = zipSync({ ['BTCUSDT-trades-2026-10-18.csv']: strToU8(csv) });
    await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
      zipBytes: wrongZip,
      checksumBytes: strToU8(`${digest(wrongZip)}  ${name}\n`) }))
      .rejects.toThrow('BACKTEST_RAW_SOURCE_BAD_ZIP');
  });

  it('rejects out-of-order raw IDs or timestamps even when candles could match', async () => {
    for (const altered of [
      [rows[0], rows[2], rows[1]],
      [rows[0], rows[1], rows[1]],
    ]) {
      const candidate = zipSync({ [name.replace('.zip', '.csv')]:
        strToU8(`id,price,qty,quote_qty,time,is_buyer_maker\n${altered.join('\n')}\n`) });
      await expect(verifyBinanceUsdMRawTradeSource({ ...input(),
        zipBytes: candidate,
        checksumBytes: strToU8(`${digest(candidate)}  ${name}\n`) }))
        .rejects.toThrow('BACKTEST_RAW_SOURCE_BAD_CSV');
    }
  });
});
