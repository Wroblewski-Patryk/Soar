import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildBinancePublicRestUrl,
  fetchBinancePublicRestJson,
} from './binancePublicRest.service';

describe('binancePublicRest.service', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('builds public REST URLs through the exchange-owned boundary', () => {
    vi.stubEnv('BINANCE_FUTURES_REST_URL', 'https://futures.example.test');

    const url = buildBinancePublicRestUrl({
      marketType: 'FUTURES',
      path: 'fapi/v1/klines',
      searchParams: new URLSearchParams({ symbol: 'BTCUSDT' }),
    });

    expect(url).toBe('https://futures.example.test/fapi/v1/klines?symbol=BTCUSDT');
  });

  it('returns parsed JSON for successful public reads and null for failed responses', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ price: '100' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchBinancePublicRestJson({
        marketType: 'SPOT',
        path: '/api/v3/ticker/price',
      })
    ).resolves.toEqual({ price: '100' });
    await expect(
      fetchBinancePublicRestJson({
        marketType: 'SPOT',
        path: '/api/v3/ticker/price',
      })
    ).resolves.toBeNull();
  });
});
