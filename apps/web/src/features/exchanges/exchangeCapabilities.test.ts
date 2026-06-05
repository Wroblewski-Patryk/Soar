import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  EXCHANGE_CAPABILITIES,
  EXCHANGE_OPTIONS,
  type ExchangeCapability,
  type ExchangeOption,
  supportsExchangeCapability,
} from './exchangeCapabilities';

describe('exchangeCapabilities', () => {
  it('keeps shared declaration types aligned with UI exchange options', () => {
    expectTypeOf<(typeof EXCHANGE_OPTIONS)[number]>().toEqualTypeOf<ExchangeOption>();
    expectTypeOf<(typeof EXCHANGE_CAPABILITIES)[number]>().toEqualTypeOf<ExchangeCapability>();
  });

  it('keeps Gate.io UI capability gating aligned with staged adapter rollout', () => {
    expect(EXCHANGE_OPTIONS).toContain('GATEIO');

    expect(supportsExchangeCapability('GATEIO', 'MARKET_CATALOG')).toBe(true);
    expect(supportsExchangeCapability('GATEIO', 'PAPER_PRICING_FEED')).toBe(true);
    expect(supportsExchangeCapability('GATEIO', 'LIVE_EXECUTION')).toBe(true);
    expect(supportsExchangeCapability('GATEIO', 'API_KEY_PROBE')).toBe(true);
  });

  it('fails closed for unknown exchange values in UI gating', () => {
    expect(supportsExchangeCapability('UNKNOWN', 'MARKET_CATALOG')).toBe(false);
    expect(supportsExchangeCapability(null, 'LIVE_EXECUTION')).toBe(false);
    expect(supportsExchangeCapability(undefined, 'PAPER_PRICING_FEED')).toBe(false);
  });
});
