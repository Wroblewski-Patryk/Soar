import { describe, expect, it, vi } from 'vitest';
import {
  assertSubscriptionAllowsLiveTrading,
  resolveUserEntitlementsContext,
} from './subscriptionEntitlements.service';
import { SUBSCRIPTION_PLAN_SEED } from './subscriptions.service';

type FakeDbOptions = {
  activeSubscription: unknown;
};

const freeEntitlements = SUBSCRIPTION_PLAN_SEED.find((plan) => plan.code === 'FREE')?.entitlements;

const createFakeDb = ({ activeSubscription }: FakeDbOptions) => ({
  subscriptionPlan: {
    upsert: vi.fn(async () => undefined),
    findUnique: vi.fn(async ({ where }: { where: { code: string } }) => ({
      id: `plan-${where.code.toLowerCase()}`,
      code: where.code,
    })),
  },
  userSubscription: {
    findFirst: vi
      .fn()
      .mockResolvedValueOnce({ id: 'existing-active-subscription' })
      .mockResolvedValueOnce(activeSubscription),
    updateMany: vi.fn(async () => ({ count: 0 })),
    create: vi.fn(async () => ({ id: 'created-subscription' })),
  },
  bot: {
    count: vi.fn(async () => 0),
  },
});

describe('subscriptionEntitlements.service', () => {
  it('falls back to FREE entitlements when a stored plan payload is invalid', async () => {
    const db = createFakeDb({
      activeSubscription: {
        subscriptionPlan: {
          code: 'ADVANCED',
          displayName: 'Advanced',
          entitlements: {
            version: 1,
            limits: {
              maxBotsTotal: 3,
              maxBotsByMode: { PAPER: 5, LIVE: 3 },
              maxConcurrentBacktests: 3,
            },
            features: {
              liveTrading: true,
              syncExternalPositions: true,
              manageExternalPositions: true,
            },
            cadence: {
              allowedIntervals: ['5m'],
              defaultMarketScanInterval: '1m',
              defaultPositionScanInterval: '5m',
            },
          },
        },
      },
    });

    const context = await resolveUserEntitlementsContext('user-1', db as never);

    expect(context.planCode).toBe('ADVANCED');
    expect(context.planDisplayName).toBe('Advanced');
    expect(context.entitlements).toEqual(freeEntitlements);
    expect(db.subscriptionPlan.upsert).toHaveBeenCalledTimes(SUBSCRIPTION_PLAN_SEED.length);
    expect(db.userSubscription.create).not.toHaveBeenCalled();
  });

  it('fails closed when a FREE subscription attempts LIVE trading', async () => {
    const db = createFakeDb({
      activeSubscription: {
        subscriptionPlan: {
          code: 'FREE',
          displayName: 'Free',
          entitlements: freeEntitlements,
        },
      },
    });

    await expect(assertSubscriptionAllowsLiveTrading('user-1', db as never)).rejects.toEqual(
      expect.objectContaining({
        name: 'SubscriptionFeatureUnavailableError',
        details: {
          feature: 'liveTrading',
          planCode: 'FREE',
          planDisplayName: 'Free',
        },
      }),
    );
  });
});
