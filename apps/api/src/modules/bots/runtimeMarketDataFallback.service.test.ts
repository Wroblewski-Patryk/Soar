import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchBinancePublicRestJsonMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicRecentCandlesMock = vi.hoisted(() => vi.fn());
const fetchExchangePublicTickerSnapshotMock = vi.hoisted(() => vi.fn());

vi.mock('../exchange/binancePublicRest.service', () => ({
  fetchBinancePublicRestJson: fetchBinancePublicRestJsonMock,
}));

vi.mock('../exchange/exchangePublicMarketData.service', () => ({
  fetchExchangePublicRecentCandles: fetchExchangePublicRecentCandlesMock,
  fetchExchangePublicTickerSnapshot: fetchExchangePublicTickerSnapshotMock,
}));

import {
  fetchFallbackFundingRateHistory,
  fetchFallbackKlines,
  fetchFallbackTickerPrices,
} from './runtimeMarketDataFallback.service';

describe('runtimeMarketDataFallback.service', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
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

  it('keeps Binance-only derivatives unavailable for Gate.io instead of mixing exchange domains', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const funding = await fetchFallbackFundingRateHistory({
      exchange: 'GATEIO',
      symbol: 'BTCUSDT',
    });

    expect(funding).toEqual([]);
    expect(fetchBinancePublicRestJsonMock).not.toHaveBeenCalled();
  });
});
