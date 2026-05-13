import { describe, expect, it, vi } from 'vitest';

import {
  fetchExchangePublicFundingRateHistory,
  fetchExchangePublicOpenInterestHistory,
  fetchExchangePublicOrderBookSnapshot,
  fetchExchangePublicRecentCandles,
  fetchExchangePublicTickerSnapshot,
} from './exchangePublicMarketData.service';

describe('exchangePublicMarketData.service', () => {
  it('reads public ticker snapshots through a disposable exchange connector', async () => {
    const connector = {
      fetchTickerSnapshot: vi.fn().mockResolvedValue({
        symbol: 'BTC/USDT',
        eventTime: 1_714_000_000_000,
        lastPrice: 100,
        markPrice: null,
        priceChangePercent24h: 1,
        raw: {},
      }),
      fetchRecentCandles: vi.fn(),
      disconnect: vi.fn().mockResolvedValue(undefined),
    };

    const snapshot = await fetchExchangePublicTickerSnapshot(
      {
        exchange: 'GATEIO',
        marketType: 'SPOT',
        symbol: 'BTCUSDT',
      },
      {
        createPublicConnector: vi.fn(() => connector),
      }
    );

    expect(connector.fetchTickerSnapshot).toHaveBeenCalledWith('BTCUSDT');
    expect(snapshot.lastPrice).toBe(100);
    expect(connector.disconnect).toHaveBeenCalledTimes(1);
  });

  it('reads public candles through a disposable exchange connector', async () => {
    const connector = {
      fetchTickerSnapshot: vi.fn(),
      fetchRecentCandles: vi.fn().mockResolvedValue([
        {
          openTime: 1_714_000_000_000,
          closeTime: 1_714_000_059_999,
          open: 100,
          high: 101,
          low: 99,
          close: 100.5,
          volume: 10,
          raw: [],
        },
      ]),
      disconnect: vi.fn().mockResolvedValue(undefined),
    };

    const candles = await fetchExchangePublicRecentCandles(
      {
        exchange: 'GATEIO',
        marketType: 'SPOT',
        symbol: 'BTCUSDT',
        interval: '1m',
        limit: 20,
      },
      {
        createPublicConnector: vi.fn(() => connector),
      }
    );

    expect(connector.fetchRecentCandles).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 20,
      since: undefined,
    });
    expect(candles).toHaveLength(1);
    expect(connector.disconnect).toHaveBeenCalledTimes(1);
  });

  it('disconnects public connectors when ticker reads fail closed', async () => {
    const connector = {
      fetchTickerSnapshot: vi.fn().mockRejectedValue(new Error('gateio_public_ticker_failed')),
      fetchRecentCandles: vi.fn(),
      disconnect: vi.fn().mockResolvedValue(undefined),
    };

    await expect(
      fetchExchangePublicTickerSnapshot(
        {
          exchange: 'GATEIO',
          marketType: 'SPOT',
          symbol: 'BTCUSDT',
        },
        {
          createPublicConnector: vi.fn(() => connector),
        }
      )
    ).rejects.toThrow('gateio_public_ticker_failed');

    expect(connector.disconnect).toHaveBeenCalledTimes(1);
  });

  it('reads public derivatives series through a disposable exchange connector', async () => {
    const connector = {
      fetchTickerSnapshot: vi.fn(),
      fetchRecentCandles: vi.fn(),
      fetchFundingRateHistory: vi.fn().mockResolvedValue([
        { timestamp: 1_714_000_000_000, fundingRate: 0.0001, raw: {} },
      ]),
      fetchOpenInterestHistory: vi.fn().mockResolvedValue([
        { timestamp: 1_714_000_000_000, openInterest: 1200, raw: {} },
      ]),
      fetchOrderBookSnapshot: vi.fn().mockResolvedValue({
        timestamp: 1_714_000_000_000,
        imbalance: 0.1,
        spreadBps: 2,
        depthRatio: 1.2,
        raw: {},
      }),
      disconnect: vi.fn().mockResolvedValue(undefined),
    };
    const deps = { createPublicConnector: vi.fn(() => connector) };

    const funding = await fetchExchangePublicFundingRateHistory(
      { exchange: 'GATEIO', marketType: 'FUTURES', symbol: 'BTCUSDT', since: 1, endTime: 2, limit: 10 },
      deps,
    );
    const openInterest = await fetchExchangePublicOpenInterestHistory(
      { exchange: 'GATEIO', marketType: 'FUTURES', symbol: 'BTCUSDT', interval: '5m', since: 1, endTime: 2, limit: 10 },
      deps,
    );
    const orderBook = await fetchExchangePublicOrderBookSnapshot(
      { exchange: 'GATEIO', marketType: 'FUTURES', symbol: 'BTCUSDT', limit: 20 },
      deps,
    );

    expect(connector.fetchFundingRateHistory).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      since: 1,
      endTime: 2,
      limit: 10,
    });
    expect(connector.fetchOpenInterestHistory).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      interval: '5m',
      since: 1,
      endTime: 2,
      limit: 10,
    });
    expect(connector.fetchOrderBookSnapshot).toHaveBeenCalledWith('BTCUSDT', 20);
    expect(funding).toHaveLength(1);
    expect(openInterest).toHaveLength(1);
    expect(orderBook.depthRatio).toBe(1.2);
    expect(connector.disconnect).toHaveBeenCalledTimes(3);
  });
});
