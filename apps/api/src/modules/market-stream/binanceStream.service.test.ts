import { describe, expect, it, vi } from 'vitest';
import {
  BinanceMarketStreamWorker,
  normalizeBinanceStreamEvent,
  resolveBinanceStreamUrl,
  WebSocketLike,
} from './binanceStream.service';
import { StreamLogger } from './binanceStream.types';

const createLogger = (): StreamLogger => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createMockSocket = (): WebSocketLike => ({
  onopen: null,
  onmessage: null,
  onerror: null,
  onclose: null,
  send: vi.fn(),
  close: vi.fn(),
});

describe('normalizeBinanceStreamEvent', () => {
  it('normalizes 24hr ticker payload', () => {
    const event = normalizeBinanceStreamEvent({
      e: '24hrTicker',
      E: 1700000000000,
      s: 'BTCUSDT',
      c: '43210.5',
      P: '2.45',
    });

    expect(event).toEqual({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 1700000000000,
      lastPrice: 43210.5,
      priceChangePercent24h: 2.45,
    });
  });

  it('normalizes futures mark-price payload into ticker-compatible lifecycle truth', () => {
    const event = normalizeBinanceStreamEvent({
      e: 'markPriceUpdate',
      E: 1700000000200,
      s: 'BTCUSDT',
      p: '43123.4',
    });

    expect(event).toEqual({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 1700000000200,
      lastPrice: 43123.4,
      markPrice: 43123.4,
      priceChangePercent24h: 0,
    });
  });

  it('normalizes kline payload', () => {
    const event = normalizeBinanceStreamEvent({
      stream: 'btcusdt@kline_1m',
      data: {
        e: 'kline',
        E: 1700000000100,
        s: 'BTCUSDT',
        k: {
          i: '1m',
          t: 1700000000000,
          T: 1700000005999,
          o: '43000.1',
          h: '43100.1',
          l: '42950.0',
          c: '43050.5',
          v: '100.25',
          x: true,
        },
      },
    });

    expect(event).toEqual({
      type: 'candle',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      eventTime: 1700000000100,
      openTime: 1700000000000,
      closeTime: 1700000005999,
      open: 43000.1,
      high: 43100.1,
      low: 42950,
      close: 43050.5,
      volume: 100.25,
      isFinal: true,
    });
  });

  it('supports explicit SPOT marketType override', () => {
    const event = normalizeBinanceStreamEvent(
      {
        e: '24hrTicker',
        E: 1700000000000,
        s: 'BTCUSDT',
        c: '43210.5',
        P: '2.45',
      },
      'SPOT'
    );

    expect(event).toEqual(
      expect.objectContaining({
        type: 'ticker',
        marketType: 'SPOT',
      })
    );
  });
});

describe('BinanceMarketStreamWorker', () => {
  it('uses futures websocket by default for FUTURES market type', () => {
    expect(resolveBinanceStreamUrl('FUTURES')).toBe('wss://fstream.binance.com/ws');
  });

  it('uses spot websocket by default for SPOT market type', () => {
    expect(resolveBinanceStreamUrl('SPOT')).toBe('wss://stream.binance.com:9443/ws');
  });

  it('subscribes to ticker and kline streams on socket open', () => {
    const socket = createMockSocket();
    const socketFactory = vi.fn().mockReturnValue(socket);
    const logger = createLogger();
    const worker = new BinanceMarketStreamWorker(
      {
        streamUrl: 'wss://stream.binance.test/ws',
        symbols: ['BTCUSDT'],
        candleIntervals: ['1m'],
      },
      socketFactory,
      logger
    );

    worker.start();
    socket.onopen?.();

    expect(socketFactory).toHaveBeenCalledWith('wss://stream.binance.test/ws');
    expect(socket.send).toHaveBeenCalledTimes(1);
    const payload = JSON.parse((socket.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string) as {
      method: string;
      params: string[];
    };
    expect(payload.method).toBe('SUBSCRIBE');
    expect(payload.params).toEqual([
      'btcusdt@ticker',
      'btcusdt@markPrice@1s',
      'btcusdt@kline_1m',
    ]);
  });

  it('defaults to futures websocket when streamUrl override is not provided', () => {
    const socket = createMockSocket();
    const socketFactory = vi.fn().mockReturnValue(socket);
    const worker = new BinanceMarketStreamWorker(
      {
        symbols: ['BTCUSDT'],
        candleIntervals: ['5m'],
        marketType: 'FUTURES',
      },
      socketFactory,
      createLogger()
    );

    worker.start();

    expect(socketFactory).toHaveBeenCalledWith('wss://fstream.binance.com/ws');
  });

  it('does not subscribe to futures mark-price streams for spot workers', () => {
    const socket = createMockSocket();
    const socketFactory = vi.fn().mockReturnValue(socket);
    const worker = new BinanceMarketStreamWorker(
      {
        symbols: ['BTCUSDT'],
        candleIntervals: ['1m'],
        marketType: 'SPOT',
      },
      socketFactory,
      createLogger()
    );

    worker.start();
    socket.onopen?.();

    const payload = JSON.parse((socket.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string) as {
      params: string[];
    };
    expect(payload.params).toEqual(['btcusdt@ticker', 'btcusdt@kline_1m']);
  });

  it('logs normalized ticker event from socket message', () => {
    const socket = createMockSocket();
    const logger = createLogger();
    const worker = new BinanceMarketStreamWorker(
      {
        symbols: ['BTCUSDT'],
        candleIntervals: ['1m'],
      },
      vi.fn().mockReturnValue(socket),
      logger
    );

    worker.start();
    socket.onmessage?.({
      data: JSON.stringify({
        e: '24hrTicker',
        E: 1700000000000,
        s: 'BTCUSDT',
        c: '43210.5',
        P: '2.45',
      }),
    });

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'market_stream.ticker',
        symbol: 'BTCUSDT',
      })
    );
  });
});
