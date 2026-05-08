import { describe, expect, it } from 'vitest';

import { resolveMarketStreamWorkerConfig } from './marketStreamWorkerConfig';

describe('marketStreamWorkerConfig', () => {
  it('keeps Binance futures websocket as the default worker source', () => {
    expect(resolveMarketStreamWorkerConfig({})).toEqual({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      envSymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
      envIntervals: ['1m', '5m'],
      refreshMs: 30_000,
      pollMs: 30_000,
    });
  });

  it('selects Gate.io polling only through explicit opt-in env', () => {
    expect(
      resolveMarketStreamWorkerConfig({
        MARKET_STREAM_EXCHANGE: 'GATEIO',
        MARKET_STREAM_MARKET_TYPE: 'SPOT',
        MARKET_STREAM_SYMBOLS: ' btcusdt, ETHUSDT ,, ',
        MARKET_STREAM_INTERVALS: '1M, 5m',
        MARKET_STREAM_SUBSCRIPTIONS_REFRESH_MS: '15000',
        MARKET_STREAM_POLL_MS: '45000',
      })
    ).toEqual({
      exchange: 'GATEIO',
      marketType: 'SPOT',
      envSymbols: ['btcusdt', 'ETHUSDT'],
      envIntervals: ['1m', '5m'],
      refreshMs: 15_000,
      pollMs: 45_000,
    });
  });

  it('falls closed to Binance defaults for unsupported exchange and invalid timing values', () => {
    expect(
      resolveMarketStreamWorkerConfig({
        MARKET_STREAM_EXCHANGE: 'BYBIT',
        MARKET_STREAM_MARKET_TYPE: 'MARGIN',
        MARKET_STREAM_SYMBOLS: ' , ',
        MARKET_STREAM_INTERVALS: '',
        MARKET_STREAM_SUBSCRIPTIONS_REFRESH_MS: '-1',
        MARKET_STREAM_POLL_MS: 'not-a-number',
      })
    ).toEqual({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      envSymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
      envIntervals: ['1m', '5m'],
      refreshMs: 30_000,
      pollMs: 30_000,
    });
  });
});
