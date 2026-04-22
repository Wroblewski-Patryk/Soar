import { describe, expect, it } from 'vitest';

import {
  createAuthenticatedExchangeConnector,
  createPublicExchangeConnector,
} from './exchangeConnectorFactory.service';
import { encrypt } from '../../utils/crypto';

describe('exchangeConnectorFactory.service', () => {
  it('builds public and authenticated connector configs from canonical exchange context', () => {
    const publicConnector = createPublicExchangeConnector({
      exchange: 'BINANCE',
      marketType: 'SPOT',
    }) as unknown as { config: { exchangeId: string; marketType: string } };

    const authenticatedConnector = createAuthenticatedExchangeConnector({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      apiKey: encrypt('api-key'),
      apiSecret: encrypt('secret'),
    }) as unknown as { config: { exchangeId: string; marketType: string; apiKey: string; secret: string } };

    expect(publicConnector.config.exchangeId).toBe('binance');
    expect(publicConnector.config.marketType).toBe('spot');
    expect(authenticatedConnector.config.exchangeId).toBe('binance');
    expect(authenticatedConnector.config.marketType).toBe('future');
    expect(authenticatedConnector.config.apiKey).toBeTruthy();
    expect(authenticatedConnector.config.secret).toBeTruthy();
  });
});
