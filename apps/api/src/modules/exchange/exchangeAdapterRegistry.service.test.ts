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

  it('fails closed for exchange contexts that are not allowed by market-type options', () => {
    expect(() =>
      resolveExchangeAdapterRegistryEntry({
        exchange: 'KRAKEN',
        marketType: 'FUTURES',
      })
    ).toThrowError(ExchangeContextUnsupportedError);
  });
});
