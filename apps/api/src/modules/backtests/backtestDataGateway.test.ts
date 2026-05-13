import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchExchangePublicRecentCandles } from '../exchange/exchangePublicMarketData.service';
import {
  fetchKlines,
  hasContinuousCandleIntervals,
  resetBacktestDataGatewayCacheForTests,
  setDbCandleDelegateForTests,
  type BacktestKlineCandle,
} from './backtestDataGateway';

vi.mock('../exchange/exchangePublicMarketData.service', () => ({
  fetchExchangePublicRecentCandles: vi.fn(),
}));

const ONE_MINUTE_MS = 60_000;

const buildCandle = (openTime: number): BacktestKlineCandle => ({
  openTime,
  closeTime: openTime + ONE_MINUTE_MS - 1,
  open: 100,
  high: 101,
  low: 99,
  close: 100.5,
  volume: 1_000,
});

const buildPublicCandle = (openTime: number) => ({
  ...buildCandle(openTime),
  raw: [],
});

describe('backtestDataGateway', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetBacktestDataGatewayCacheForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetBacktestDataGatewayCacheForTests();
  });

  it('detects interval gaps in DB cache candle windows', () => {
    const baseTime = 1_710_000_000_000;
    const candles = [
      buildCandle(baseTime),
      buildCandle(baseTime + ONE_MINUTE_MS),
      buildCandle(baseTime + ONE_MINUTE_MS * 3),
    ];

    expect(hasContinuousCandleIntervals(candles, '1m')).toBe(false);
    expect(
      hasContinuousCandleIntervals(
        [buildCandle(baseTime), buildCandle(baseTime + ONE_MINUTE_MS), buildCandle(baseTime + ONE_MINUTE_MS * 2)],
        '1m',
      ),
    ).toBe(true);
  });

  it('falls back to network fetch when DB cache candles contain interval gaps', async () => {
    const baseTime = 1_710_000_000_000;
    const findMany = vi.fn(async () => [
      {
        openTime: BigInt(baseTime + ONE_MINUTE_MS * 3),
        closeTime: BigInt(baseTime + ONE_MINUTE_MS * 4 - 1),
        open: 103,
        high: 104,
        low: 102,
        close: 103.5,
        volume: 1_030,
      },
      {
        openTime: BigInt(baseTime + ONE_MINUTE_MS),
        closeTime: BigInt(baseTime + ONE_MINUTE_MS * 2 - 1),
        open: 101,
        high: 102,
        low: 100,
        close: 101.5,
        volume: 1_010,
      },
      {
        openTime: BigInt(baseTime),
        closeTime: BigInt(baseTime + ONE_MINUTE_MS - 1),
        open: 100,
        high: 101,
        low: 99,
        close: 100.5,
        volume: 1_000,
      },
    ]);
    const createMany = vi.fn(async () => ({ count: 3 }));
    setDbCandleDelegateForTests({ findMany, createMany });

    vi.mocked(fetchExchangePublicRecentCandles).mockResolvedValue([
      buildPublicCandle(baseTime),
      buildPublicCandle(baseTime + ONE_MINUTE_MS),
      buildPublicCandle(baseTime + ONE_MINUTE_MS * 2),
    ]);

    const candles = await fetchKlines('BINANCE', 'BTCUSDT', '1m', 'FUTURES', 3, baseTime + ONE_MINUTE_MS * 3);

    expect(findMany).toHaveBeenCalledTimes(1);
    expect(fetchExchangePublicRecentCandles).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 3,
      since: expect.any(Number),
    });
    expect(candles.map((item) => item.openTime)).toEqual([
      baseTime,
      baseTime + ONE_MINUTE_MS,
      baseTime + ONE_MINUTE_MS * 2,
    ]);
    expect(createMany).toHaveBeenCalledTimes(1);
  });

  it('uses the exchange market-data boundary for non-Binance candle windows without reading Binance cache rows', async () => {
    const baseTime = 1_710_000_000_000;
    const findMany = vi.fn(async (args: any) =>
      args.where?.source === 'BINANCE'
        ? [
            {
              openTime: BigInt(baseTime),
              closeTime: BigInt(baseTime + ONE_MINUTE_MS - 1),
              open: 1,
              high: 1,
              low: 1,
              close: 1,
              volume: 1,
            },
            {
              openTime: BigInt(baseTime + ONE_MINUTE_MS),
              closeTime: BigInt(baseTime + ONE_MINUTE_MS * 2 - 1),
              open: 2,
              high: 2,
              low: 2,
              close: 2,
              volume: 2,
            },
          ]
        : [],
    );
    const createMany = vi.fn(async () => ({ count: 2 }));
    setDbCandleDelegateForTests({ findMany, createMany });

    vi.mocked(fetchExchangePublicRecentCandles).mockResolvedValue([
      buildPublicCandle(baseTime),
      buildPublicCandle(baseTime + ONE_MINUTE_MS),
    ]);

    const candles = await fetchKlines(
      'GATEIO',
      'BTCUSDT',
      '1m',
      'FUTURES',
      2,
      baseTime + ONE_MINUTE_MS * 2,
      baseTime,
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          source: 'GATEIO',
        }),
      }),
    );
    expect(fetchExchangePublicRecentCandles).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 2,
      since: baseTime,
    });
    expect(candles.map((item) => item.openTime)).toEqual([
      baseTime,
      baseTime + ONE_MINUTE_MS,
    ]);
    expect(createMany).toHaveBeenCalledTimes(1);
  });
});
