import { describe, expect, it, vi } from 'vitest';

import { loadExchangePublicMarketMap } from './exchangePublicRead.service';

describe('exchangePublicRead.service', () => {
  it('loads market map through canonical public connector and disconnects afterwards', async () => {
    const disconnect = vi.fn(async () => undefined);
    const createPublicConnector = vi.fn(() => ({
      loadMarketsMap: vi.fn(async () => ({
        'BTC/USDT:USDT': { id: 'BTCUSDT' },
      })),
      disconnect,
    }));

    const result = await loadExchangePublicMarketMap(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
      },
      {
        createPublicConnector,
      }
    );

    expect(createPublicConnector).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    expect(result).toEqual({
      'BTC/USDT:USDT': { id: 'BTCUSDT' },
    });
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});

