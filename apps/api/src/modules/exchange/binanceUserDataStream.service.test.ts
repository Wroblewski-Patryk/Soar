import { describe, expect, it, vi } from 'vitest';
import { createHmac } from 'node:crypto';

import {
  BinanceUserDataStreamService,
  normalizeBinanceUserDataStreamEvent,
} from './binanceUserDataStream.service';

describe('binanceUserDataStream.service', () => {
  it('uses exact Binance listenKey endpoints per market type', async () => {
    const httpClient = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ listenKey: 'listen-key-1' }),
      });

    const service = new BinanceUserDataStreamService(httpClient as any, vi.fn() as any, {
      spotRestBaseUrl: 'https://spot.example',
      futuresRestBaseUrl: 'https://futures.example',
    });

    const [spotKey, futuresKey] = await Promise.all([
      service.createListenKey({
        marketType: 'SPOT',
        apiKey: 'spot-api-key',
      }),
      service.createListenKey({
        marketType: 'FUTURES',
        apiKey: 'futures-api-key',
      }),
    ]);

    expect(spotKey).toBe('listen-key-1');
    expect(futuresKey).toBe('listen-key-1');
    expect(httpClient).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: 'https://spot.example/api/v3/userDataStream',
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': 'spot-api-key',
        },
      })
    );
    expect(httpClient).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: 'https://futures.example/fapi/v1/listenKey',
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': 'futures-api-key',
        },
      })
    );
  });

  it('keeps listenKey keepalive and close scoped to the exact market family', async () => {
    const httpClient = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{}',
    });
    const service = new BinanceUserDataStreamService(httpClient as any, vi.fn() as any, {
      spotRestBaseUrl: 'https://spot.example',
      futuresRestBaseUrl: 'https://futures.example',
    });

    await service.keepAliveListenKey({
      marketType: 'SPOT',
      apiKey: 'spot-api-key',
      listenKey: 'spot-listen-key',
    });
    await service.closeListenKey({
      marketType: 'FUTURES',
      apiKey: 'futures-api-key',
      listenKey: 'futures-listen-key',
    });

    expect(httpClient).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: 'https://spot.example/api/v3/userDataStream',
        method: 'PUT',
        body: 'listenKey=spot-listen-key',
      })
    );
    expect(httpClient).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: 'https://futures.example/fapi/v1/listenKey',
        method: 'DELETE',
        body: undefined,
      })
    );
  });

  it('uses the Futures key-scoped keepalive and reports a replacement listenKey', async () => {
    const httpClient = vi.fn().mockResolvedValue({ ok: true, status: 200,
      text: async () => JSON.stringify({ listenKey: 'replacement-key' }) });
    const service = new BinanceUserDataStreamService(httpClient as any);
    const key = await service.keepAliveListenKey({ marketType: 'FUTURES',
      apiKey: 'futures-key', listenKey: 'prior-key' });
    expect(key).toBe('replacement-key');
    expect(httpClient).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://fapi.binance.com/fapi/v1/listenKey', method: 'PUT',
      body: undefined, headers: { 'X-MBX-APIKEY': 'futures-key' },
    }));
  });

  it('normalizes supported Binance Futures and Spot user-data events into one explicit event contract', () => {
    const futuresOrderUpdate = normalizeBinanceUserDataStreamEvent('FUTURES', {
      e: 'ORDER_TRADE_UPDATE',
      E: 1000,
      T: 1001,
      o: {
        s: 'BTCUSDT',
        S: 'BUY',
        o: 'MARKET',
        X: 'FILLED',
        x: 'TRADE',
        i: 12345,
        c: 'client-1',
        ap: '64000',
        l: '0.01',
        z: '0.01',
        L: '64000',
        n: '0.12',
        N: 'USDT',
        t: 998,
      },
    });
    const spotExecutionReport = normalizeBinanceUserDataStreamEvent('SPOT', {
      e: 'executionReport',
      E: 2000,
      T: 2001,
      s: 'ETHUSDT',
      S: 'SELL',
      o: 'MARKET',
      X: 'FILLED',
      x: 'TRADE',
      i: 54321,
      c: 'client-2',
      Z: '3000',
      z: '2',
      L: '1500',
      l: '2',
      n: '0.5',
      N: 'USDT',
      t: 777,
    });

    expect(futuresOrderUpdate).toEqual(
      expect.objectContaining({
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        exchangeOrderId: '12345',
        averagePrice: 64000,
      })
    );
    expect(spotExecutionReport).toEqual(
      expect.objectContaining({
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'SPOT',
        symbol: 'ETHUSDT',
        exchangeOrderId: '54321',
        averagePrice: 1500,
      })
    );
  });

  it('connects websocket sessions and emits normalized events for the exact market family', () => {
    const listeners = new Map<string, (...args: unknown[]) => void>();
    const socket = {
      on: vi.fn((event: string, listener: (...args: unknown[]) => void) => {
        listeners.set(event, listener);
      }),
      close: vi.fn(),
    };
    const webSocketFactory = vi.fn(() => socket);
    const service = new BinanceUserDataStreamService(vi.fn() as any, webSocketFactory as any, {
      futuresWebSocketBaseUrl: 'wss://futures.example/ws',
    });
    const onEvent = vi.fn();
    const onOpen = vi.fn();

    const session = service.connect({
      marketType: 'FUTURES',
      listenKey: 'listen-key-1',
      onEvent,
      onOpen,
    });

    expect(webSocketFactory).toHaveBeenCalledWith('wss://futures.example/ws/listen-key-1');
    listeners.get('open')?.();
    listeners.get('message')?.(
      Buffer.from(
        JSON.stringify({
          e: 'ACCOUNT_UPDATE',
          E: 3000,
          T: 3001,
          a: {
            B: [{ a: 'USDT', wb: '100', cw: '80' }],
            P: [{ s: 'BTCUSDT', pa: '0.01', ep: '63000', up: '2.5', ps: 'LONG' }],
          },
        })
      )
    );

    expect(session.marketType).toBe('FUTURES');
    expect(session.listenKey).toBe('listen-key-1');
    expect(onOpen).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'ACCOUNT_UPDATE',
        marketType: 'FUTURES',
        balances: [expect.objectContaining({ asset: 'USDT', walletBalance: 100 })],
        positions: [expect.objectContaining({ symbol: 'BTCUSDT', entryPrice: 63000 })],
      })
    );

    session.close();
    expect(socket.close).toHaveBeenCalledOnce();
  });

  it('subscribes Spot through a signed WebSocket API request and unwraps account events', () => {
    const listeners = new Map<string, (...args: unknown[]) => void>();
    const socket = {
      on: vi.fn((event: string, listener: (...args: unknown[]) => void) => {
        listeners.set(event, listener);
      }),
      send: vi.fn(), ping: vi.fn(), close: vi.fn(),
    };
    const service = new BinanceUserDataStreamService(vi.fn() as any,
      vi.fn(() => socket) as any, { spotWebSocketApiUrl: 'wss://spot.example/ws-api/v3' });
    const onEvent = vi.fn();
    const onOpen = vi.fn();
    const session = service.connectSignedSpot({ apiKey: 'spot-key',
      apiSecret: 'spot-secret', onEvent, onOpen });
    listeners.get('open')?.();
    const request = JSON.parse(socket.send.mock.calls[0][0]);
    expect(request).toMatchObject({ method: 'userDataStream.subscribe.signature',
      params: { apiKey: 'spot-key' } });
    expect(request.params.signature).toBe(createHmac('sha256', 'spot-secret')
      .update(`apiKey=spot-key&timestamp=${request.params.timestamp}`).digest('hex'));
    expect(onOpen).not.toHaveBeenCalled();
    listeners.get('message')?.(JSON.stringify({ id: request.id, status: 200,
      result: { subscriptionId: 7 } }));
    expect(onOpen).toHaveBeenCalledOnce();
    listeners.get('message')?.(JSON.stringify({ subscriptionId: 7, event: {
      e: 'executionReport', E: 2000, T: 2001, s: 'BTCUSDT', S: 'BUY',
      o: 'MARKET', X: 'FILLED', x: 'TRADE', i: 42, c: 'client-1',
      Z: '100', z: '1', L: '100', l: '1', n: '0', N: 'USDT', t: 99,
    } }));
    expect(onEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'ORDER_TRADE_UPDATE', marketType: 'SPOT', exchangeOrderId: '42',
    }));
    expect(session.listenKey).toBeNull();
    session.ping();
    session.close();
    expect(socket.ping).toHaveBeenCalledOnce();
    expect(socket.close).toHaveBeenCalledOnce();
  });

  it('does not include venue response bodies in listenKey errors', async () => {
    const service = new BinanceUserDataStreamService(vi.fn().mockResolvedValue({
      ok: false, status: 401, text: async () => 'secret-from-venue',
    }) as any);
    await expect(service.createListenKey({ marketType: 'FUTURES', apiKey: 'key' }))
      .rejects.toThrow('Binance listenKey create failed (401)');
  });
});
