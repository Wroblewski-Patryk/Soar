import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExchangePublicPollingMarketStreamWorker } from './exchangePollingStream.service';
import type { MarketStreamEvent, StreamLogger } from './binanceStream.types';

const createClientMock = vi.hoisted(() => vi.fn());

vi.mock('redis', () => ({
  createClient: createClientMock,
}));

const createLogger = (): StreamLogger => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const initialNodeEnv = process.env.NODE_ENV;

describe('ExchangePublicPollingMarketStreamWorker fanout integration', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockReset();
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = initialNodeEnv;
  });

  it('publishes Gate.io polling events through the canonical market-stream fanout channel', async () => {
    const subscribers: Array<(payload: string) => void> = [];
    const redisClient = {
      on: vi.fn(),
      connect: vi.fn(async () => undefined),
      subscribe: vi.fn(async (_channel: string, handler: (payload: string) => void) => {
        subscribers.push(handler);
        return 1;
      }),
      unsubscribe: vi.fn(async () => 1),
      disconnect: vi.fn(async () => undefined),
      publish: vi.fn(async (_channel: string, payload: string) => {
        subscribers.forEach((handler) => handler(payload));
        return 1;
      }),
      set: vi.fn(async () => 'OK' as const),
      eval: vi.fn(async () => 1),
    };
    createClientMock.mockReturnValue(redisClient as any);

    const { publishMarketStreamEvent, subscribeMarketStreamEvents } = await import('./marketStreamFanout');
    const received: MarketStreamEvent[] = [];
    const unsubscribe = await subscribeMarketStreamEvents((event) => {
      received.push(event);
    });

    const worker = new ExchangePublicPollingMarketStreamWorker(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        symbols: ['btcusdt'],
        candleIntervals: ['1m'],
        onEvent: publishMarketStreamEvent,
      },
      {
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
      },
      createLogger()
    );

    await worker.pollOnce();

    expect(redisClient.publish).toHaveBeenCalledWith(
      'market_stream.events',
      expect.stringContaining('"exchange":"GATEIO"')
    );
    expect(received).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'ticker',
          exchange: 'GATEIO',
          marketType: 'FUTURES',
          symbol: 'BTCUSDT',
          lastPrice: 100,
        }),
        expect.objectContaining({
          type: 'candle',
          exchange: 'GATEIO',
          marketType: 'FUTURES',
          symbol: 'BTCUSDT',
          interval: '1m',
          isFinal: true,
        }),
      ])
    );

    await unsubscribe();
  });
});
