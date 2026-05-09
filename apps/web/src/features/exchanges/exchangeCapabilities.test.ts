import { describe, expect, it } from 'vitest';

import { EXCHANGE_OPTIONS, supportsExchangeCapability } from './exchangeCapabilities';

describe('exchangeCapabilities', () => {
  it('keeps Gate.io UI capability gating aligned with staged adapter rollout', () => {
    expect(EXCHANGE_OPTIONS).toContain('GATEIO');

    expect(supportsExchangeCapability('GATEIO', 'MARKET_CATALOG')).toBe(true);
    expect(supportsExchangeCapability('GATEIO', 'PAPER_PRICING_FEED')).toBe(true);
    expect(supportsExchangeCapability('GATEIO', 'LIVE_EXECUTION')).toBe(false);
    expect(supportsExchangeCapability('GATEIO', 'API_KEY_PROBE')).toBe(false);
  });

  it('fails closed for unknown exchange values in UI gating', () => {
    expect(supportsExchangeCapability('UNKNOWN', 'MARKET_CATALOG')).toBe(false);
    expect(supportsExchangeCapability(null, 'LIVE_EXECUTION')).toBe(false);
    expect(supportsExchangeCapability(undefined, 'PAPER_PRICING_FEED')).toBe(false);
  });
});
