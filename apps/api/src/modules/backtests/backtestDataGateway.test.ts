import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchExchangePublicFundingRateHistory,
  fetchExchangePublicOpenInterestHistory,
  fetchExchangePublicRecentCandles,
} from '../exchange/exchangePublicMarketData.service';
import {
  fetchKlines,
  fetchKlinesWithVerifiedBinanceFuturesIntrabar,
  fetchSupplementalSeries,
  getBacktestDataGatewayCacheSizesForTests,
  hasContinuousCandleIntervals,
  resetBacktestDataGatewayCacheForTests,
  setDbCandleDelegateForTests,
  type BacktestKlineCandle,
} from './backtestDataGateway';
import { fetchVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';

vi.mock('../exchange/exchangePublicMarketData.service', () => ({
  fetchExchangePublicFundingRateHistory: vi.fn(),
  fetchExchangePublicOpenInterestHistory: vi.fn(),
  fetchExchangePublicRecentCandles: vi.fn(),
}));
vi.mock('./backtestBinanceFuturesIntrabarSource', () => ({
  fetchVerifiedBinanceFuturesIntrabar: vi.fn(),
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
  it('rejects an unbounded or incomplete strict intrabar candle window before trade replay', async () => {
    const start = Math.floor((Date.now() - 5 * ONE_MINUTE_MS) / ONE_MINUTE_MS) * ONE_MINUTE_MS;
    await expect(fetchKlinesWithVerifiedBinanceFuturesIntrabar('BINANCE',
      'BTCUSDT', '1m', 'FUTURES', 2, undefined, undefined))
      .rejects.toThrow('EXPLICIT_BOUNDED_WINDOW_REQUIRED');
    expect(fetchExchangePublicRecentCandles).not.toHaveBeenCalled();

    vi.mocked(fetchExchangePublicRecentCandles).mockResolvedValue([buildPublicCandle(start)]);
    await expect(fetchKlinesWithVerifiedBinanceFuturesIntrabar('BINANCE',
      'BTCUSDT', '1m', 'FUTURES', 2, start + 120_000, start))
      .rejects.toThrow('CANDLE_WINDOW_INCOMPLETE');
  });

  it('passes an exact exclusive end boundary to the verified source', async () => {
    const start = Math.floor((Date.now() - 5 * ONE_MINUTE_MS) / ONE_MINUTE_MS) * ONE_MINUTE_MS;
    const candles = [buildPublicCandle(start), buildPublicCandle(start + ONE_MINUTE_MS)];
    vi.mocked(fetchExchangePublicRecentCandles).mockResolvedValue(candles);
    vi.mocked(fetchVerifiedBinanceFuturesIntrabar).mockImplementation(async ({ candles: input }) =>
      input as any);
    const result = await fetchKlinesWithVerifiedBinanceFuturesIntrabar('BINANCE',
      'BTCUSDT', '1m', 'FUTURES', 2, start + 2 * ONE_MINUTE_MS, start);
    expect(result).toHaveLength(2);
    expect(fetchVerifiedBinanceFuturesIntrabar).toHaveBeenCalledWith({
      symbol: 'BTCUSDT', candles: expect.arrayContaining([
        expect.objectContaining({ openTime: start }),
        expect.objectContaining({ closeTime: start + 2 * ONE_MINUTE_MS - 1 }),
      ]),
    });
  });

  it.each([100, 60])('reads all %i explicit 1m candles when the adaptive cap is 100 plus warmup',
    async (windowCandles) => {
      const start = Math.floor((Date.now() - (windowCandles + 3) * ONE_MINUTE_MS) /
        ONE_MINUTE_MS) * ONE_MINUTE_MS;
      vi.mocked(fetchExchangePublicRecentCandles).mockImplementation(async ({ since, limit }) =>
        Array.from({ length: limit ?? 0 }, (_, index) =>
          buildPublicCandle((since as number) + index * ONE_MINUTE_MS)));
      vi.mocked(fetchVerifiedBinanceFuturesIntrabar).mockImplementation(async ({ candles }) =>
        candles as any);
      const result = await fetchKlinesWithVerifiedBinanceFuturesIntrabar('BINANCE',
        'BTCUSDT', '1m', 'FUTURES', 102, start + windowCandles * ONE_MINUTE_MS, start);
      expect(result).toHaveLength(windowCandles);
      expect(fetchExchangePublicRecentCandles).toHaveBeenCalledWith(expect.objectContaining({
        limit: windowCandles, since: start,
      }));
    });

  it('rejects a source range over 120 candles even with a larger adaptive cap', async () => {
    const start = Math.floor((Date.now() - 125 * ONE_MINUTE_MS) / ONE_MINUTE_MS) * ONE_MINUTE_MS;
    await expect(fetchKlinesWithVerifiedBinanceFuturesIntrabar('BINANCE',
      'BTCUSDT', '1m', 'FUTURES', 200, start + 121 * ONE_MINUTE_MS, start))
      .rejects.toThrow('EXPLICIT_BOUNDED_WINDOW_REQUIRED');
    expect(fetchExchangePublicRecentCandles).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetBacktestDataGatewayCacheForTests();
    setDbCandleDelegateForTests({ findMany: async () => [],
      createMany: async () => ({ count: 0 }) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetBacktestDataGatewayCacheForTests();
  });

  it('bounds retained candle and supplemental windows when many ranges are requested', async () => {
    const endTime = 1_710_000_000_000;
    for (let index = 0; index < 40; index += 1) {
      const symbol = `TEST${index}USDT`;
      await fetchKlines('GATEIO', symbol, '1m', 'FUTURES', 1, endTime, endTime);
      await fetchSupplementalSeries('GATEIO', symbol, '1m', 'FUTURES', 1, endTime, endTime);
    }

    expect(getBacktestDataGatewayCacheSizesForTests()).toEqual({
      candles: 32,
      supplemental: 32,
    });
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
