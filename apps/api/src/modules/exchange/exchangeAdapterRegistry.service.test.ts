import { describe, expect, it, vi } from 'vitest';

import {
  ExchangeContextUnsupportedError,
  resolveExchangeAdapterRegistryEntry,
} from './exchangeAdapterRegistry.service';

vi.mock('../../utils/crypto', () => ({
  decrypt: vi.fn((value: string) => `dec:${value}`),
}));

describe('exchangeAdapterRegistry.service', () => {
  it('resolves registry entrypoints for an exact exchange context', () => {
    const entry = resolveExchangeAdapterRegistryEntry({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });

    const publicConnector = entry.marketData.createPublicConnector();
    const authConnector = entry.account.createAuthenticatedConnector({
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    });

    expect((publicConnector as unknown as { config: { exchangeId: string; marketType: string } }).config).toMatchObject({
      exchangeId: 'binance',
      marketType: 'future',
    });
    expect((authConnector as unknown as {
      config: { exchangeId: string; marketType: string; apiKey: string; secret: string };
    }).config).toMatchObject({
      exchangeId: 'binance',
      marketType: 'future',
      apiKey: 'dec:enc-key',
      secret: 'dec:enc-secret',
    });
    expect(typeof entry.execution.createLiveOrderAdapter).toBe('function');
  });

  it('keeps SPOT and FUTURES connector resolution isolated for the same exchange', () => {
    const futuresEntry = resolveExchangeAdapterRegistryEntry({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    const spotEntry = resolveExchangeAdapterRegistryEntry({
      exchange: 'BINANCE',
      marketType: 'SPOT',
    });

    const futuresPublic = futuresEntry.marketData.createPublicConnector() as unknown as {
      config: { exchangeId: string; marketType: string };
    };
    const spotPublic = spotEntry.marketData.createPublicConnector() as unknown as {
      config: { exchangeId: string; marketType: string };
    };

    expect(futuresPublic.config.exchangeId).toBe('binance');
    expect(futuresPublic.config.marketType).toBe('future');
    expect(spotPublic.config.exchangeId).toBe('binance');
    expect(spotPublic.config.marketType).toBe('spot');

    const spotAuth = spotEntry.account.createAuthenticatedConnector({
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }) as unknown as {
      config: { exchangeId: string; marketType: string; apiKey: string; secret: string };
    };
    expect(spotAuth.config).toMatchObject({
      exchangeId: 'binance',
      marketType: 'spot',
      apiKey: 'dec:enc-key',
      secret: 'dec:enc-secret',
    });
  });

  it('maps Gate.io app futures context to CCXT swap for perpetual market data', () => {
    const entry = resolveExchangeAdapterRegistryEntry({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
    });

    const publicConnector = entry.marketData.createPublicConnector() as unknown as {
      config: { exchangeId: string; marketType: string };
    };
    const authConnector = entry.account.createAuthenticatedConnector({
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }) as unknown as {
      config: { exchangeId: string; marketType: string; apiKey: string; secret: string };
    };

    expect(publicConnector.config).toMatchObject({
      exchangeId: 'gateio',
      marketType: 'swap',
    });
    expect(authConnector.config).toMatchObject({
      exchangeId: 'gateio',
      marketType: 'swap',
      apiKey: 'dec:enc-key',
      secret: 'dec:enc-secret',
    });
  });

  it('opens Gate SPOT and FUTURES from the registry with the real CCXT constructor offline', async () => {
    const ccxt = (await import('ccxt')).default;
    const loadMarkets = vi.spyOn(ccxt.gate.prototype, 'loadMarkets').mockResolvedValue({});
    const createOrder = vi.spyOn(ccxt.gate.prototype, 'createOrder');
    try {
      const spot = resolveExchangeAdapterRegistryEntry({
        exchange: 'GATEIO', marketType: 'SPOT',
      }).marketData.createPublicConnector();
      const futures = resolveExchangeAdapterRegistryEntry({
        exchange: 'GATEIO', marketType: 'FUTURES',
      }).account.createAuthenticatedConnector({
        apiKey: 'enc-key', apiSecret: 'enc-secret',
      });
      await spot.connect();
      await futures.connect();
      expect(loadMarkets).toHaveBeenCalledTimes(2);
      expect(createOrder).not.toHaveBeenCalled();
      await spot.disconnect();
      await futures.disconnect();
    } finally {
      loadMarkets.mockRestore();
      createOrder.mockRestore();
    }
  });

  it.each([
    ['BINANCE', 'FUTURES', 'binance'],
    ['BYBIT', 'FUTURES', 'bybit'],
    ['OKX', 'FUTURES', 'okx'],
    ['KRAKEN', 'SPOT', 'kraken'],
    ['COINBASE', 'SPOT', 'coinbase'],
  ] as const)('opens reachable %s %s with its CCXT constructor offline', async (exchange, marketType, ccxtId) => {
    const ccxt = (await import('ccxt')).default;
    const loadMarkets = vi.spyOn(ccxt[ccxtId].prototype, 'loadMarkets').mockResolvedValue({});
    try {
      const connector = resolveExchangeAdapterRegistryEntry({
        exchange, marketType,
      }).marketData.createPublicConnector();
      await connector.connect();
      expect(loadMarkets).toHaveBeenCalledOnce();
      await connector.disconnect();
    } finally {
      loadMarkets.mockRestore();
    }
  });

  it('fails closed for exchange contexts that are not allowed by market-type options', () => {
    expect(() =>
      resolveExchangeAdapterRegistryEntry({
        exchange: 'KRAKEN',
        marketType: 'FUTURES',
      })
    ).toThrowError(ExchangeContextUnsupportedError);
  });
});
