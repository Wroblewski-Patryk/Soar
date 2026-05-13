import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchBinancePublicRestJsonMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicFundingRateHistoryMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicOpenInterestHistoryMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicOrderBookSnapshotMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicRecentCandlesMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicTickerSnapshotMock = vi.hoisted(() => vi.fn());

vi.mock('../exchange/binancePublicRest.service', () => ({
  fetchBinancePublicRestJson: fetchBinancePublicRestJsonMock,
}));

vi.mock('../exchange/exchangePublicMarketData.service', () => ({
  fetchExchangePublicFundingRateHistory: fetchExchangePublicFundingRateHistoryMock,
  fetchExchangePublicOpenInterestHistory: fetchExchangePublicOpenInterestHistoryMock,
  fetchExchangePublicOrderBookSnapshot: fetchExchangePublicOrderBookSnapshotMock,
  fetchExchangePublicRecentCandles: fetchExchangePublicRecentCandlesMock,
  fetchExchangePublicTickerSnapshot: fetchExchangePublicTickerSnapshotMock,
}));

import {
  fetchFallbackFundingRateHistory,
  fetchFallbackFundingRateSnapshot,
  fetchFallbackKlines,
  fetchFallbackOpenInterestHistory,
  fetchFallbackOpenInterestSnapshot,
  fetchFallbackOrderBookSnapshot,
  fetchFallbackTickerPrices,
} from './runtimeMarketDataFallback.service';

describe('runtimeMarketDataFallback.service', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('routes Binance candle fallback through the exchange-owned public market-data boundary', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fetchExchangePublicRecentCandlesMock.mockResolvedValue([
      {
        openTime: 1_714_000_000_000,
        closeTime: 1_714_000_059_999,
        open: 100,
        high: 101,
        low: 99,
        close: 100.5,
        volume: 10,
      },
    ]);

    const candles = await fetchFallbackKlines({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '5m',
      limit: 20,
    });

    expect(fetchBinancePublicRestJsonMock).not.toHaveBeenCalled();
    expect(fetchExchangePublicRecentCandlesMock).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '5m',
      limit: 20,
    });
    expect(candles).toHaveLength(1);
    expect(candles[0].close).toBe(100.5);
  });

  it('routes non-Binance candle fallback through the exchange-owned public market-data boundary', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fetchExchangePublicRecentCandlesMock.mockResolvedValue([
      {
        openTime: 1_714_000_000_000,
        closeTime: 1_714_000_059_999,
        open: 100,
        high: 101,
        low: 99,
        close: 100.5,
        volume: 10,
      },
    ]);

    const candles = await fetchFallbackKlines({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '5m',
      limit: 20,
    });

    expect(fetchBinancePublicRestJsonMock).not.toHaveBeenCalled();
    expect(fetchExchangePublicRecentCandlesMock).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '5m',
      limit: 20,
    });
    expect(candles).toHaveLength(1);
    expect(candles[0].close).toBe(100.5);
  });

  it('routes non-Binance ticker fallback through the exchange-owned public market-data boundary', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fetchExchangePublicTickerSnapshotMock.mockResolvedValue({
      symbol: 'BTC/USDT:USDT',
      eventTime: 1_714_000_000_000,
      lastPrice: 100,
      markPrice: 101,
      priceChangePercent24h: 0,
      raw: {},
    });

    const prices = await fetchFallbackTickerPrices({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbols: ['BTCUSDT'],
    });

    expect(fetchBinancePublicRestJsonMock).not.toHaveBeenCalled();
    expect(fetchExchangePublicTickerSnapshotMock).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
    });
    expect(prices.get('BTCUSDT')).toBe(101);
  });

  it('routes Binance ticker fallback through the exchange-owned public market-data boundary', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fetchExchangePublicTickerSnapshotMock.mockResolvedValue({
      symbol: 'BTC/USDT:USDT',
      eventTime: 1_714_000_000_000,
      lastPrice: 100,
      markPrice: 102,
      priceChangePercent24h: 0,
      raw: {},
    });

    const prices = await fetchFallbackTickerPrices({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbols: ['BTCUSDT'],
    });

    expect(fetchBinancePublicRestJsonMock).not.toHaveBeenCalled();
    expect(fetchExchangePublicTickerSnapshotMock).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
    });
    expect(prices.get('BTCUSDT')).toBe(102);
  });

  it('routes non-Binance derivative fallbacks through the exchange-owned public market-data boundary', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fetchExchangePublicFundingRateHistoryMock.mockResolvedValue([
      { timestamp: 1_714_000_000_000, fundingRate: 0.0001 },
    ]);
    fetchExchangePublicOpenInterestHistoryMock.mockResolvedValue([
      { timestamp: 1_714_000_000_000, openInterest: 10_000 },
    ]);
    fetchExchangePublicOrderBookSnapshotMock.mockResolvedValue({
      timestamp: 1_714_000_000_000,
      imbalance: 0.1,
      spreadBps: 2.5,
      depthRatio: 1.2,
    });

    const funding = await fetchFallbackFundingRateHistory({
      exchange: 'GATEIO',
      symbol: 'BTCUSDT',
      limit: 20,
      endTimeMs: 1_714_000_060_000,
    });
    const fundingSnapshot = await fetchFallbackFundingRateSnapshot('BTCUSDT', 'GATEIO');
    const openInterest = await fetchFallbackOpenInterestHistory({
      exchange: 'GATEIO',
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 20,
      endTimeMs: 1_714_000_060_000,
    });
    const openInterestSnapshot = await fetchFallbackOpenInterestSnapshot('BTCUSDT', 'GATEIO');
    const orderBook = await fetchFallbackOrderBookSnapshot('BTCUSDT', 'GATEIO');

    expect(funding).toEqual([{ timestamp: 1_714_000_000_000, fundingRate: 0.0001 }]);
    expect(fundingSnapshot).toEqual({ timestamp: 1_714_000_000_000, fundingRate: 0.0001 });
    expect(openInterest).toEqual([{ timestamp: 1_714_000_000_000, openInterest: 10_000 }]);
    expect(openInterestSnapshot).toEqual({ timestamp: 1_714_000_000_000, openInterest: 10_000 });
    expect(orderBook).toEqual({
      timestamp: 1_714_000_000_000,
      imbalance: 0.1,
      spreadBps: 2.5,
      depthRatio: 1.2,
    });
    expect(fetchBinancePublicRestJsonMock).not.toHaveBeenCalled();
    expect(fetchExchangePublicFundingRateHistoryMock).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      limit: 20,
      endTime: 1_714_000_060_000,
    });
    expect(fetchExchangePublicOpenInterestHistoryMock).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '5m',
      limit: 20,
      endTime: 1_714_000_060_000,
    });
    expect(fetchExchangePublicOrderBookSnapshotMock).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      limit: 100,
    });
  });
});
