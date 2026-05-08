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

  it('fails closed for exchange contexts that are not allowed by market-type options', () => {
    expect(() =>
      resolveExchangeAdapterRegistryEntry({
        exchange: 'KRAKEN',
        marketType: 'FUTURES',
      })
    ).toThrowError(ExchangeContextUnsupportedError);
  });
});
