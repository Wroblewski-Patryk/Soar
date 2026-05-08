import { describe, expect, it, vi } from 'vitest';

import {
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
});
