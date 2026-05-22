import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchExchangePublicFundingRateHistory,
  fetchExchangePublicOpenInterestHistory,
  fetchExchangePublicRecentCandles,
} from '../exchange/exchangePublicMarketData.service';
import {
  fetchKlines,
  fetchSupplementalSeries,
  hasContinuousCandleIntervals,
  resetBacktestDataGatewayCacheForTests,
  setDbCandleDelegateForTests,
  type BacktestKlineCandle,
} from './backtestDataGateway';

vi.mock('../exchange/exchangePublicMarketData.service', () => ({
  fetchExchangePublicFundingRateHistory: vi.fn(),
  fetchExchangePublicOpenInterestHistory: vi.fn(),
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

  it('excludes candles that open inside the range but close after the requested end time', async () => {
    const baseTime = 1_710_000_000_000;
    const inRange = buildPublicCandle(baseTime);
    const stillOpenAtEnd = buildPublicCandle(baseTime + ONE_MINUTE_MS);
    const endTime = stillOpenAtEnd.openTime;

    vi.mocked(fetchExchangePublicRecentCandles).mockResolvedValue([
      inRange,
      stillOpenAtEnd,
    ]);

    const candles = await fetchKlines(
      'BINANCE',
      'BTCUSDT',
      '1m',
      'FUTURES',
      2,
      endTime,
      baseTime,
    );

    expect(candles.map((item) => item.openTime)).toEqual([baseTime]);
  });

  it('queries DB cache by close time upper bound for closed-candle replay windows', async () => {
    const baseTime = 1_710_000_000_000;
    const findMany = vi.fn(async () => [
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
    const createMany = vi.fn(async () => ({ count: 1 }));
    setDbCandleDelegateForTests({ findMany, createMany });

    await fetchKlines(
      'BINANCE',
      'BTCUSDT',
      '1m',
      'FUTURES',
      1,
      baseTime + ONE_MINUTE_MS - 1,
      baseTime,
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          openTime: { gte: BigInt(baseTime) },
          closeTime: { lte: BigInt(baseTime + ONE_MINUTE_MS - 1) },
        }),
      }),
    );
    expect(fetchExchangePublicRecentCandles).not.toHaveBeenCalled();
  });

  it('uses exchange-owned derivatives history for non-Binance futures supplemental series', async () => {
    const baseTime = 1_710_000_000_000;
    vi.mocked(fetchExchangePublicFundingRateHistory).mockResolvedValue([
      { timestamp: baseTime, fundingRate: 0.0001, raw: {} },
    ]);
    vi.mocked(fetchExchangePublicOpenInterestHistory).mockResolvedValue([
      { timestamp: baseTime, openInterest: 1234, raw: {} },
    ]);

    const supplemental = await fetchSupplementalSeries(
      'GATEIO',
      'BTCUSDT',
      '5m',
      'FUTURES',
      100,
      baseTime + ONE_MINUTE_MS * 10,
      baseTime,
    );

    expect(fetchExchangePublicFundingRateHistory).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      since: baseTime,
      endTime: baseTime + ONE_MINUTE_MS * 10,
      limit: 100,
    });
    expect(fetchExchangePublicOpenInterestHistory).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '5m',
      since: baseTime,
      endTime: baseTime + ONE_MINUTE_MS * 10,
      limit: 100,
    });
    expect(supplemental.fundingRates).toEqual([{ timestamp: baseTime, fundingRate: 0.0001 }]);
    expect(supplemental.openInterest).toEqual([{ timestamp: baseTime, openInterest: 1234 }]);
    expect(supplemental.orderBook).toEqual([]);
  });
});
