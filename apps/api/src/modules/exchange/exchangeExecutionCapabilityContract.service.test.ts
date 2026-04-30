import { describe, expect, it } from 'vitest';

import {
  ExchangeExecutionCapabilityUnsupportedError,
  assertExchangeExecutionCapabilitySupport,
  supportsExchangeExecutionCapability,
} from './exchangeExecutionCapabilityContract.service';

describe('exchangeExecutionCapabilityContract.service', () => {
  it('keeps Binance as the only V1 exchange for authenticated reads and live submit', () => {
    expect(supportsExchangeExecutionCapability('BINANCE', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'LIVE_ORDER_SUBMIT')).toBe(true);

    expect(supportsExchangeExecutionCapability('BYBIT', 'BALANCE_PREVIEW')).toBe(false);
    expect(supportsExchangeExecutionCapability('OKX', 'POSITIONS_SNAPSHOT')).toBe(false);
    expect(supportsExchangeExecutionCapability('KRAKEN', 'WALLET_CASHFLOW_HISTORY')).toBe(false);
    expect(supportsExchangeExecutionCapability('COINBASE', 'LIVE_ORDER_SUBMIT')).toBe(false);
  });

  it('keeps exchange-side cancel explicitly unsupported', () => {
    expect(supportsExchangeExecutionCapability('BINANCE', 'LIVE_ORDER_CANCEL')).toBe(false);
    expect(() => assertExchangeExecutionCapabilitySupport('BINANCE', 'LIVE_ORDER_CANCEL')).toThrowError(
      ExchangeExecutionCapabilityUnsupportedError
    );
  });
});
