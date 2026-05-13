import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  RuntimeSignalMarketDataGateway,
  clearRuntimeSignalMarketDataStore,
} from './runtimeSignalMarketDataGateway';

const candleRow = (index: number, close: number) => ({
  openTime: index * 60_000,
  open: close - 1,
  high: close + 1,
  low: close - 2,
  close,
  volume: 1_000,
  closeTime: index * 60_000 + 59_000,
  raw: [],
});

describe('RuntimeSignalMarketDataGateway', () => {
  beforeEach(() => {
    clearRuntimeSignalMarketDataStore();
  });

  it('ingests final candles with dedupe/sort and returns recent closes', async () => {
    const gateway = new RuntimeSignalMarketDataGateway({
      nowMs: () => 1_000,
    });

    await gateway.ingestCandleEvent({
      type: 'candle',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      eventTime: 120_000,
      openTime: 60_000,
      closeTime: 119_000,
      open: 101,
      high: 103,
      low: 100,
      close: 102,
      volume: 2_000,
      isFinal: true,
    });
    await gateway.ingestCandleEvent({
      type: 'candle',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      eventTime: 60_000,
      openTime: 0,
      closeTime: 59_000,
      open: 100,
      high: 102,
      low: 99,
      close: 101,
      volume: 1_000,
      isFinal: true,
    });
    await gateway.ingestCandleEvent({
      type: 'candle',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      eventTime: 120_000,
      openTime: 60_000,
      closeTime: 119_000,
      open: 101,
      high: 104,
      low: 100,
      close: 103,
      volume: 2_200,
      isFinal: true,
    });

    const series = gateway.getSeries('BINANCE', 'FUTURES', 'BTCUSDT', '1m');
    expect(series).toHaveLength(2);
    expect(series?.map((candle) => candle.openTime)).toEqual([0, 60_000]);
    expect(series?.[1].close).toBe(103);

    const recentCloses = gateway.getRecentCloses({
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 2,
    });
    expect(recentCloses).toEqual([101, 103]);
  });

  it('aligns derivatives points to candle timeline', async () => {
    const gateway = new RuntimeSignalMarketDataGateway({
      nowMs: () => 1_000,
    });

    await gateway.ingestCandleEvent({
      type: 'candle',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      eventTime: 60_000,
      openTime: 0,
      closeTime: 59_000,
      open: 100,
      high: 101,
      low: 99,
      close: 100,
      volume: 1_000,
      isFinal: true,
    });
    await gateway.ingestCandleEvent({
      type: 'candle',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      eventTime: 120_000,
      openTime: 60_000,
      closeTime: 119_000,
      open: 101,
      high: 102,
      low: 100,
      close: 101,
      volume: 1_100,
      isFinal: true,
    });

    gateway.getFundingRatePointsStore().set('BINANCE|FUTURES|BTCUSDT', [
      { timestamp: 59_000, fundingRate: 0.0001 },
      { timestamp: 119_000, fundingRate: -0.0002 },
    ]);
    gateway.getOpenInterestPointsStore().set('BINANCE|FUTURES|BTCUSDT', [
      { timestamp: 59_000, openInterest: 101 },
      { timestamp: 119_000, openInterest: 120 },
    ]);
    gateway.getOrderBookPointsStore().set('BINANCE|FUTURES|BTCUSDT', [
      { timestamp: 59_000, imbalance: 0.1, spreadBps: 2.5, depthRatio: 1.2 },
      { timestamp: 119_000, imbalance: 0.3, spreadBps: 3.5, depthRatio: 1.8 },
    ]);

    const candles = gateway.getSeries('BINANCE', 'FUTURES', 'BTCUSDT', '1m')!;
    const funding = gateway.resolveFundingRateSeriesForCandles(
      'BINANCE',
      'FUTURES',
      'BTCUSDT',
      candles,
    );
    const openInterest = gateway.resolveOpenInterestSeriesForCandles(
      'BINANCE',
      'FUTURES',
      'BTCUSDT',
      candles,
    );
    const orderBook = gateway.resolveOrderBookSeriesForCandles(
      'BINANCE',
      'FUTURES',
      'BTCUSDT',
      candles,
    );

    expect(funding).toEqual([0.0001, -0.0002]);
    expect(openInterest).toEqual([101, 120]);
    expect(orderBook?.orderBookImbalance).toEqual([0.1, 0.3]);
    expect(orderBook?.orderBookSpreadBps).toEqual([2.5, 3.5]);
    expect(orderBook?.orderBookDepthRatio).toEqual([1.2, 1.8]);
  });

  it('skips warmup fetch when distributed warmup lock is not acquired', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const fetchRecentCandles = vi.fn(async () => []);
    const acquireWarmupLock = vi.fn(async () => ({
      acquired: false,
      release: async () => undefined,
    }));

    try {
      const gateway = new RuntimeSignalMarketDataGateway({
        nowMs: () => 1_000_000,
        warmupEnabled: true,
        fetchRecentCandles,
        acquireWarmupLock,
      });

      await gateway.ingestCandleEvent({
        type: 'candle',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        eventTime: 60_000,
        openTime: 0,
        closeTime: 59_000,
        open: 100,
        high: 101,
        low: 99,
        close: 100,
        volume: 1_000,
        isFinal: true,
      });

      expect(acquireWarmupLock).toHaveBeenCalledWith(
        expect.objectContaining({
          seriesKey: 'BINANCE|FUTURES|BTCUSDT|1m',
        })
      );
      expect(fetchRecentCandles).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('releases distributed warmup lock after warmup attempt completes', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const fetchRecentCandles = vi.fn(async () => []);
    const releaseWarmupLock = vi.fn(async () => undefined);
    const acquireWarmupLock = vi.fn(async () => ({
      acquired: true,
      release: releaseWarmupLock,
    }));

    try {
      const gateway = new RuntimeSignalMarketDataGateway({
        nowMs: () => 1_000_000,
        warmupEnabled: true,
        fetchRecentCandles,
        acquireWarmupLock,
      });

      await gateway.ingestCandleEvent({
        type: 'candle',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        eventTime: 60_000,
        openTime: 0,
        closeTime: 59_000,
        open: 100,
        high: 101,
        low: 99,
        close: 100,
        volume: 1_000,
        isFinal: true,
      });

      expect(acquireWarmupLock).toHaveBeenCalledTimes(1);
      expect(releaseWarmupLock).toHaveBeenCalledTimes(1);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('recovers an indicator-ready decision series even when background warmup is disabled', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const fetchRecentCandles = vi.fn(async () =>
      Array.from({ length: 20 }, (_, index) =>
        candleRow(index, index === 19 ? 119 : 100 + index),
      ),
    );

    try {
      const gateway = new RuntimeSignalMarketDataGateway({
        nowMs: () => 1_000,
        warmupEnabled: false,
        fetchRecentCandles,
      });

      await gateway.ingestCandleEvent({
        type: 'candle',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        symbol: 'BTCUSDT',
        interval: '1m',
        eventTime: 20 * 60_000,
        openTime: 19 * 60_000,
        closeTime: 19 * 60_000 + 59_000,
        open: 120,
        high: 126,
        low: 119,
        close: 125,
        volume: 2_500,
        isFinal: true,
      });

      const recovered = await gateway.ensureIndicatorReadySeries({
        exchange: 'BINANCE',
        marketType: 'SPOT',
        symbol: 'BTCUSDT',
        interval: '1m',
        endTimeMs: 19 * 60_000 + 59_000,
        minCandles: 20,
      });

      expect(fetchRecentCandles).toHaveBeenCalledWith({
        exchange: 'BINANCE',
        marketType: 'SPOT',
        symbol: 'BTCUSDT',
        interval: '1m',
        limit: 20,
        since: undefined,
      });
      expect(recovered).toHaveLength(20);
      expect(recovered.at(-1)).toEqual(
        expect.objectContaining({
          openTime: 19 * 60_000,
          close: 125,
          volume: 2_500,
        })
      );
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('warms up Gate.io candles through the exchange public market-data adapter', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('binance_rest_must_not_be_called');
      },
    } as any);
    const fetchRecentCandles = vi.fn(async () =>
      Array.from({ length: 20 }, (_, index) => candleRow(index, 100 + index)),
    );

    try {
      const gateway = new RuntimeSignalMarketDataGateway({
        nowMs: () => 1_000_000,
        warmupEnabled: false,
        fetchRecentCandles,
      });

      await gateway.ingestCandleEvent({
        type: 'candle',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        eventTime: 20 * 60_000,
        openTime: 19 * 60_000,
        closeTime: 19 * 60_000 + 59_000,
        open: 120,
        high: 126,
        low: 119,
        close: 125,
        volume: 2_500,
        isFinal: true,
      });

      const recovered = await gateway.ensureIndicatorReadySeries({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        endTimeMs: 19 * 60_000 + 59_000,
        minCandles: 20,
      });

      expect(fetchRecentCandles).toHaveBeenCalledWith({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        limit: 20,
        since: undefined,
      });
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(recovered).toHaveLength(20);
      expect(gateway.getSeries('BINANCE', 'FUTURES', 'BTCUSDT', '1m')).toBeNull();
      expect(gateway.getSeries('GATEIO', 'FUTURES', 'BTCUSDT', '1m')).toHaveLength(20);
    } finally {
      fetchSpy.mockRestore();
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});
