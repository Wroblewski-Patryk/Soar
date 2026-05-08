import { describe, expect, it, vi } from 'vitest';

import { ExchangePublicPollingMarketStreamWorker } from './exchangePollingStream.service';
import { StreamLogger } from './binanceStream.types';

const createLogger = (): StreamLogger => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

describe('ExchangePublicPollingMarketStreamWorker', () => {
  it('publishes Gate.io ticker and final candle events through the canonical market-stream contract', async () => {
    const onEvent = vi.fn();
    const reader = {
      fetchTicker: vi.fn().mockResolvedValue({
        symbol: 'BTC/USDT:USDT',
        eventTime: 1_714_000_000_000,
        lastPrice: 100,
        markPrice: 100.2,
        priceChangePercent24h: 1.5,
        raw: {},
      }),
      fetchCandles: vi.fn().mockResolvedValue([
        {
          openTime: 1_714_000_000_000,
          closeTime: 1_714_000_059_999,
          open: 99,
          high: 101,
          low: 98,
          close: 100,
          volume: 12,
          raw: [],
        },
      ]),
    };

    const worker = new ExchangePublicPollingMarketStreamWorker(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbols: ['btcusdt'],
        candleIntervals: ['1m'],
        onEvent,
      },
      reader,
      createLogger()
    );

    await worker.pollOnce();

    expect(reader.fetchTicker).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
    });
    expect(reader.fetchCandles).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 2,
    });
    expect(onEvent).toHaveBeenCalledWith({
      type: 'ticker',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 1_714_000_000_000,
      lastPrice: 100,
      markPrice: 100.2,
      priceChangePercent24h: 1.5,
    });
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'candle',
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '1m',
        isFinal: true,
      })
    );
  });

  it('logs per-symbol reader failures without publishing malformed events', async () => {
    const logger = createLogger();
    const onEvent = vi.fn();
    const worker = new ExchangePublicPollingMarketStreamWorker(
      {
        exchange: 'GATEIO',
        marketType: 'SPOT',
        symbols: ['ETHUSDT'],
        candleIntervals: ['1m'],
        onEvent,
      },
      {
        fetchTicker: vi.fn().mockRejectedValue(new Error('ticker_unavailable')),
        fetchCandles: vi.fn().mockResolvedValue([]),
      },
      logger
    );

    await worker.pollOnce();

    expect(onEvent).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'market_stream.poll_ticker_failed',
        exchange: 'GATEIO',
        symbol: 'ETHUSDT',
      })
    );
  });
});
