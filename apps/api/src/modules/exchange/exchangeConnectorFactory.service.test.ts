import { describe, expect, it, vi } from 'vitest';

import {
  createAuthenticatedExchangeConnector,
  createPublicExchangeConnector,
} from './exchangeConnectorFactory.service';

vi.mock('../../utils/crypto', () => ({
  decrypt: vi.fn((value: string) => `dec:${value}`),
}));

describe('exchangeConnectorFactory.service', () => {
  it('builds public and authenticated connector configs from canonical exchange context', () => {
    const publicConnector = createPublicExchangeConnector({
      exchange: 'BINANCE',
      marketType: 'SPOT',
    }) as unknown as { config: { exchangeId: string; marketType: string } };

    const authenticatedConnector = createAuthenticatedExchangeConnector({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      apiKey: 'enc:api-key',
      apiSecret: 'enc:secret',
    }) as unknown as { config: { exchangeId: string; marketType: string; apiKey: string; secret: string } };

    expect(publicConnector.config.exchangeId).toBe('binance');
    expect(publicConnector.config.marketType).toBe('spot');
    expect(authenticatedConnector.config.exchangeId).toBe('binance');
    expect(authenticatedConnector.config.marketType).toBe('future');
    expect(authenticatedConnector.config.apiKey).toBe('dec:enc:api-key');
    expect(authenticatedConnector.config.secret).toBe('dec:enc:secret');
  });
});
