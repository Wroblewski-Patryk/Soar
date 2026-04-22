import { describe, expect, it } from 'vitest';

import {
  ExchangeAuthenticatedReadUnsupportedError,
  assertAuthenticatedExchangeReadSupport,
  resolveAuthenticatedExchangeReadSource,
  supportsAuthenticatedExchangeRead,
} from './exchangeAuthenticatedReadContract.service';

describe('exchangeAuthenticatedReadContract.service', () => {
  it('declares current authenticated read support explicitly per operation family', () => {
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('OKX', 'BALANCE_PREVIEW')).toBe(false);
    expect(supportsAuthenticatedExchangeRead('BYBIT', 'POSITIONS_SNAPSHOT')).toBe(false);
  });

  it('fails closed with explicit operation details when authenticated read is unsupported', () => {
    expect(() => assertAuthenticatedExchangeReadSupport('OKX', 'BALANCE_PREVIEW')).toThrowError(
      ExchangeAuthenticatedReadUnsupportedError
    );

    try {
      assertAuthenticatedExchangeReadSupport('OKX', 'BALANCE_PREVIEW');
    } catch (error) {
      expect(error).toBeInstanceOf(ExchangeAuthenticatedReadUnsupportedError);
      expect((error as ExchangeAuthenticatedReadUnsupportedError).toDetails()).toEqual({
        code: 'EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED',
        exchange: 'OKX',
        operation: 'BALANCE_PREVIEW',
      });
    }
  });

  it('derives authenticated read source label from actual exchange owner', () => {
    expect(resolveAuthenticatedExchangeReadSource('BINANCE')).toBe('BINANCE');
  });
});
