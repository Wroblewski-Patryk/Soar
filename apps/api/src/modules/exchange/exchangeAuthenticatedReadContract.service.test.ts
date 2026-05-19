import { describe, expect, it } from 'vitest';

import {
  ExchangeAuthenticatedReadUnsupportedError,
  assertAuthenticatedExchangeReadSupport,
  resolveAuthenticatedExchangeReadSource,
  supportsAuthenticatedExchangeRead,
} from './exchangeAuthenticatedReadContract.service';

describe('exchangeAuthenticatedReadContract.service', () => {
  it('declares current authenticated read support explicitly per operation family', () => {
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'FUTURES', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'FUTURES', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'FUTURES', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('BINANCE', 'FUTURES', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('OKX', 'FUTURES', 'BALANCE_PREVIEW')).toBe(false);
    expect(supportsAuthenticatedExchangeRead('BYBIT', 'FUTURES', 'POSITIONS_SNAPSHOT')).toBe(false);
    expect(supportsAuthenticatedExchangeRead('COINBASE', 'SPOT', 'WALLET_CASHFLOW_HISTORY')).toBe(false);
    expect(supportsAuthenticatedExchangeRead('GATEIO', 'FUTURES', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('GATEIO', 'FUTURES', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('GATEIO', 'FUTURES', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('GATEIO', 'FUTURES', 'TRADE_HISTORY_SNAPSHOT')).toBe(true);
    expect(supportsAuthenticatedExchangeRead('GATEIO', 'FUTURES', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
  });

  it('fails closed with explicit operation details when authenticated read is unsupported', () => {
    expect(() => assertAuthenticatedExchangeReadSupport('OKX', 'FUTURES', 'BALANCE_PREVIEW')).toThrowError(
      ExchangeAuthenticatedReadUnsupportedError
    );

    try {
      assertAuthenticatedExchangeReadSupport('OKX', 'FUTURES', 'BALANCE_PREVIEW');
    } catch (error) {
      expect(error).toBeInstanceOf(ExchangeAuthenticatedReadUnsupportedError);
      expect((error as ExchangeAuthenticatedReadUnsupportedError).toDetails()).toEqual({
        code: 'EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED',
        exchange: 'OKX',
        marketType: 'FUTURES',
        operation: 'BALANCE_PREVIEW',
      });
    }
  });

  it('derives authenticated read source label from actual exchange owner', () => {
    expect(resolveAuthenticatedExchangeReadSource('BINANCE', 'FUTURES')).toBe('BINANCE');
  });
});
