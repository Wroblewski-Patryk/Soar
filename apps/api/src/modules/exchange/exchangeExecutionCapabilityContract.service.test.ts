import { describe, expect, it } from 'vitest';

import {
  ExchangeExecutionCapabilityUnsupportedError,
  assertExchangeExecutionCapabilitySupport,
  supportsExchangeExecutionCapability,
} from './exchangeExecutionCapabilityContract.service';

describe('exchangeExecutionCapabilityContract.service', () => {
  it('keeps exact authenticated read and live support explicit per exchange', () => {
    expect(supportsExchangeExecutionCapability('BINANCE', 'FUTURES', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'FUTURES', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'FUTURES', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'FUTURES', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'FUTURES', 'LIVE_ORDER_SUBMIT')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'FUTURES', 'LIVE_ORDER_CANCEL')).toBe(true);
    expect(supportsExchangeExecutionCapability('BINANCE', 'SPOT', 'LIVE_ORDER_SUBMIT')).toBe(true);

    expect(supportsExchangeExecutionCapability('BYBIT', 'FUTURES', 'BALANCE_PREVIEW')).toBe(false);
    expect(supportsExchangeExecutionCapability('OKX', 'FUTURES', 'POSITIONS_SNAPSHOT')).toBe(false);
    expect(supportsExchangeExecutionCapability('KRAKEN', 'SPOT', 'WALLET_CASHFLOW_HISTORY')).toBe(false);
    expect(supportsExchangeExecutionCapability('KRAKEN', 'FUTURES', 'BALANCE_PREVIEW')).toBe(false);
    expect(supportsExchangeExecutionCapability('COINBASE', 'SPOT', 'LIVE_ORDER_SUBMIT')).toBe(false);
    expect(supportsExchangeExecutionCapability('COINBASE', 'SPOT', 'LIVE_ORDER_CANCEL')).toBe(false);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'BALANCE_PREVIEW')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'POSITIONS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'OPEN_ORDERS_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'TRADE_HISTORY_SNAPSHOT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'WALLET_CASHFLOW_HISTORY')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'LIVE_ORDER_SUBMIT')).toBe(true);
    expect(supportsExchangeExecutionCapability('GATEIO', 'FUTURES', 'LIVE_ORDER_CANCEL')).toBe(true);
    expect(() => assertExchangeExecutionCapabilitySupport('COINBASE', 'SPOT', 'LIVE_ORDER_CANCEL')).toThrowError(
      ExchangeExecutionCapabilityUnsupportedError
    );
  });
});
