import { describe, expect, it, vi } from 'vitest';

import {
  fetchAuthenticatedExchangeBalanceRaw,
  fetchAuthenticatedExchangeOpenOrdersRaw,
  fetchAuthenticatedExchangePositionsRaw,
} from './exchangeAuthenticatedRead.service';

describe('exchangeAuthenticatedRead.service', () => {
  it('reads authenticated positions/open-orders/balance through one connector boundary', async () => {
    const disconnect = vi.fn(async () => undefined);
    const createAuthenticatedConnector = vi.fn(() => ({
      fetchPositions: vi.fn(async () => [{ symbol: 'BTC/USDT:USDT', contracts: 1 }]),
      fetchOpenOrders: vi.fn(async () => [{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]),
      fetchBalance: vi.fn(async () => ({ total: { USDT: 100 } })),
      disconnect,
    }));

    const params = {
      exchange: 'BINANCE' as const,
      marketType: 'FUTURES' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    };

    const [positions, orders, balance] = await Promise.all([
      fetchAuthenticatedExchangePositionsRaw(params, { createAuthenticatedConnector }),
      fetchAuthenticatedExchangeOpenOrdersRaw(params, { createAuthenticatedConnector }),
      fetchAuthenticatedExchangeBalanceRaw(params, { createAuthenticatedConnector }),
    ]);

    expect(createAuthenticatedConnector).toHaveBeenCalledTimes(3);
    expect(positions).toEqual([{ symbol: 'BTC/USDT:USDT', contracts: 1 }]);
    expect(orders).toEqual([{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]);
    expect(balance).toEqual({ total: { USDT: 100 } });
    expect(disconnect).toHaveBeenCalledTimes(3);
  });
});

