import { describe, expect, it } from 'vitest';

import {
  ExchangeExecutionCapabilityUnsupportedError,
  assertExchangeExecutionCapabilitySupport,
  supportsExchangeExecutionCapability,
} from './exchangeExecutionCapabilityContract.service';

describe('exchangeExecutionCapabilityContract.service', () => {
  it('keeps exact authenticated read and live support explicit per exchange', () => {
    expect(supportsExchangeExecutionCapability('BINANCE', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'LIVE_ORDER_SUBMIT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'LIVE_ORDER_CANCEL')).toBe(true);

    expect(supportsExchangeExecutionCapability('BYBIT', 'BALANCE_PREVIEW')).toBe(false);
    expect(supportsExchangeExecutionCapability('OKX', 'POSITIONS_SNAPSHOT')).toBe(false);
    expect(supportsExchangeExecutionCapability('KRAKEN', 'WALLET_CASHFLOW_HISTORY')).toBe(false);
    expect(supportsExchangeExecutionCapability('COINBASE', 'LIVE_ORDER_SUBMIT')).toBe(false);
    expect(supportsExchangeExecutionCapability('COINBASE', 'LIVE_ORDER_CANCEL')).toBe(false);
    expect(supportsExchangeExecutionCapability('GATEIO', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'TRADE_HISTORY_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'LIVE_ORDER_SUBMIT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'LIVE_ORDER_CANCEL')).toBe(true);
    expect(() => assertExchangeExecutionCapabilitySupport('COINBASE', 'LIVE_ORDER_CANCEL')).toThrowError(
      ExchangeExecutionCapabilityUnsupportedError
    );
  });
});
