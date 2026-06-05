import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../index', () => ({ app: {} }));
vi.mock('../../prisma/client', () => ({ prisma: {} }));
vi.mock('../engine/runtimeTickerStore', () => ({
  clearRuntimeTickerStore: vi.fn(),
  upsertRuntimeTicker: vi.fn(),
}));
vi.mock('../subscriptions/subscriptions.service', () => ({
  setActiveSubscriptionForUser: vi.fn(),
}));

import { createPayload, walletIdByMarketGroupId } from './bots.e2e.shared';

describe('bots.e2e.shared createPayload', () => {
  beforeEach(() => {
    walletIdByMarketGroupId.clear();
  });

  it('builds an inactive paper bot payload with the mapped wallet id', () => {
    walletIdByMarketGroupId.set('market-group-1', 'wallet-1');

    expect(
      createPayload({
        strategyId: 'strategy-1',
        marketGroupId: 'market-group-1',
      })
    ).toEqual({
      name: 'Momentum Runner',
      strategyId: 'strategy-1',
      marketGroupId: 'market-group-1',
      walletId: 'wallet-1',
      isActive: false,
      liveOptIn: false,
    });
  });

  it('keeps an explicit wallet id ahead of the market-group mapping', () => {
    walletIdByMarketGroupId.set('market-group-1', 'mapped-wallet');

    expect(
      createPayload({
        strategyId: 'strategy-1',
        marketGroupId: 'market-group-1',
        walletId: 'explicit-wallet',
      }).walletId
    ).toBe('explicit-wallet');
  });

  it('fails fast when no wallet mapping exists', () => {
    expect(() =>
      createPayload({
        strategyId: 'strategy-1',
        marketGroupId: 'missing-market-group',
      })
    ).toThrow('Missing wallet mapping for marketGroupId=missing-market-group');
  });
});
