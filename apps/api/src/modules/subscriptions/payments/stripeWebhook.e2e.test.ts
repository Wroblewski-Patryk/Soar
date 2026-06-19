import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prisma, type SubscriptionPlanCode } from '@prisma/client';
import { app } from '../../../index';
import { prisma } from '../../../prisma/client';
import { ensureDefaultSubscriptionForUser, ensureSubscriptionCatalog } from '../subscriptions.service';

const StripeConstructor = require('stripe') as new (secretKey: string) => {
  webhooks: {
    generateTestHeaderString: (input: { payload: string; secret: string }) => string;
  };
};

const stripe = new StripeConstructor('sk_test_webhook');
const webhookSecret = 'whsec_test_subscription_lifecycle';

const resetBillingData = async () => {
  await prisma.orderFill.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.billingWebhookEvent.deleteMany();
  await prisma.log.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.marketGroupStrategyLink.deleteMany();
  await prisma.botMarketGroup.deleteMany();
  await prisma.botStrategy.deleteMany();
  await prisma.botSubagentConfig.deleteMany();
  await prisma.botAssistantConfig.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.paymentIntent.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
};

const createUserWithDefaultSubscription = async (email: string) => {
  await ensureSubscriptionCatalog(prisma);
  const user = await prisma.user.create({
    data: {
      email,
      password: 'hashed',
    },
  });
  await ensureDefaultSubscriptionForUser(prisma, user.id);
  return user;
};

const createStripePaymentIntent = async (
  userId: string,
  planCode: Exclude<SubscriptionPlanCode, 'FREE'>,
  sessionId: string,
) => {
  const plan = await prisma.subscriptionPlan.findUniqueOrThrow({
    where: { code: planCode },
  });

  return prisma.paymentIntent.create({
    data: {
      userId,
      subscriptionPlanId: plan.id,
      provider: 'STRIPE',
      status: 'REQUIRES_ACTION',
      providerReference: sessionId,
      idempotencyKey: `test:${sessionId}`,
      amountMinor: plan.monthlyPriceMinor,
      currency: plan.currency,
      metadata: {
        planCode,
      },
    },
  });
};

const postStripeWebhook = async (event: Record<string, unknown>, secret = webhookSecret) => {
  const payload = JSON.stringify(event);
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret,
  });

  return request(app)
    .post('/webhooks/stripe')
    .set('stripe-signature', signature)
    .set('content-type', 'application/json')
    .set('content-length', String(Buffer.byteLength(payload)))
    .send(payload);
};

const checkoutCompletedEvent = (input: {
  eventId: string;
  sessionId: string;
  userId: string;
  planCode: SubscriptionPlanCode;
  subscriptionId: string;
  clientReferenceId?: string;
}) => ({
  id: input.eventId,
  object: 'event',
  api_version: '2026-02-25.clover',
  created: 1_789_344_000,
  livemode: false,
  type: 'checkout.session.completed',
  data: {
    object: {
      id: input.sessionId,
      object: 'checkout.session',
      status: 'complete',
      payment_status: 'paid',
      customer: 'cus_test',
      subscription: input.subscriptionId,
      client_reference_id: input.clientReferenceId ?? input.userId,
      metadata: {
        userId: input.userId,
        planCode: input.planCode,
        idempotencyKey: `test:${input.sessionId}`,
      },
    },
  },
});

const subscriptionEvent = (input: {
  eventId: string;
  eventType: 'customer.subscription.updated' | 'customer.subscription.deleted';
  subscriptionId: string;
  userId: string;
  planCode: SubscriptionPlanCode;
  status: string;
  cancelAtPeriodEnd?: boolean;
}) => ({
  id: input.eventId,
  object: 'event',
  api_version: '2026-02-25.clover',
  created: 1_789_344_300,
  livemode: false,
  type: input.eventType,
  data: {
    object: {
      id: input.subscriptionId,
      object: 'subscription',
      customer: 'cus_test',
      status: input.status,
      current_period_end: 1_789_948_800,
      canceled_at: input.status === 'canceled' ? 1_789_344_400 : null,
      cancel_at_period_end: input.cancelAtPeriodEnd ?? false,
      metadata: {
        userId: input.userId,
        planCode: input.planCode,
      },
    },
  },
});

const checkoutExpiredEvent = (input: { eventId: string; sessionId: string }) => ({
  id: input.eventId,
  object: 'event',
  api_version: '2026-02-25.clover',
  created: 1_789_344_100,
  livemode: false,
  type: 'checkout.session.expired',
  data: {
    object: {
      id: input.sessionId,
      object: 'checkout.session',
      status: 'expired',
      payment_status: 'unpaid',
      metadata: {},
    },
  },
});

describe('Stripe subscription webhook reconciliation', () => {
  beforeEach(async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_webhook';
    process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;
    await resetBillingData();
  });

  it('activates exactly one checkout subscription for a paid checkout session', async () => {
    const user = await createUserWithDefaultSubscription('stripe-checkout-activate@example.com');
    await createStripePaymentIntent(user.id, 'ADVANCED', 'cs_paid_activate');

    const response = await postStripeWebhook(
      checkoutCompletedEvent({
        eventId: 'evt_checkout_activate',
        sessionId: 'cs_paid_activate',
        userId: user.id,
        planCode: 'ADVANCED',
        subscriptionId: 'sub_activate',
      }),
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ processed: true, replayed: false });

    const activeSubscriptions = await prisma.userSubscription.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: { subscriptionPlan: { select: { code: true } } },
    });
    expect(activeSubscriptions).toHaveLength(1);
    expect(activeSubscriptions[0]).toMatchObject({
      source: 'CHECKOUT',
      subscriptionPlan: { code: 'ADVANCED' },
    });

    const storedIntent = await prisma.paymentIntent.findUniqueOrThrow({
      where: { provider_providerReference: { provider: 'STRIPE', providerReference: 'cs_paid_activate' } },
    });
    expect(storedIntent.status).toBe('SUCCEEDED');
    expect(storedIntent.userSubscriptionId).toBe(activeSubscriptions[0].id);
  });

  it('does not reapply duplicate webhook events', async () => {
    const user = await createUserWithDefaultSubscription('stripe-checkout-replay@example.com');
    await createStripePaymentIntent(user.id, 'ADVANCED', 'cs_paid_replay');
    const event = checkoutCompletedEvent({
      eventId: 'evt_checkout_replay',
      sessionId: 'cs_paid_replay',
      userId: user.id,
      planCode: 'ADVANCED',
      subscriptionId: 'sub_replay',
    });

    expect((await postStripeWebhook(event)).status).toBe(200);
    const replay = await postStripeWebhook(event);

    expect(replay.status).toBe(200);
    expect(replay.body).toMatchObject({ processed: false, replayed: true });
    await expect(
      prisma.userSubscription.findMany({
        where: { userId: user.id, source: 'CHECKOUT' },
      }),
    ).resolves.toHaveLength(1);
  });

  it('does not reapply a second event id for the same checkout session', async () => {
    const user = await createUserWithDefaultSubscription('stripe-checkout-session-idempotent@example.com');
    await createStripePaymentIntent(user.id, 'ADVANCED', 'cs_paid_same_session');

    const first = checkoutCompletedEvent({
      eventId: 'evt_checkout_same_session_first',
      sessionId: 'cs_paid_same_session',
      userId: user.id,
      planCode: 'ADVANCED',
      subscriptionId: 'sub_same_session',
    });
    const second = checkoutCompletedEvent({
      eventId: 'evt_checkout_same_session_second',
      sessionId: 'cs_paid_same_session',
      userId: user.id,
      planCode: 'ADVANCED',
      subscriptionId: 'sub_same_session',
    });

    expect((await postStripeWebhook(first)).status).toBe(200);
    expect((await postStripeWebhook(second)).status).toBe(200);

    await expect(
      prisma.userSubscription.findMany({
        where: { userId: user.id, source: 'CHECKOUT' },
      }),
    ).resolves.toHaveLength(1);
    await expect(
      prisma.userSubscription.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
      }),
    ).resolves.toHaveLength(1);
  });

  it('rejects invalid signatures before mutating billing state', async () => {
    const user = await createUserWithDefaultSubscription('stripe-invalid-signature@example.com');
    await createStripePaymentIntent(user.id, 'ADVANCED', 'cs_bad_signature');
    const response = await postStripeWebhook(
      checkoutCompletedEvent({
        eventId: 'evt_bad_signature',
        sessionId: 'cs_bad_signature',
        userId: user.id,
        planCode: 'ADVANCED',
        subscriptionId: 'sub_bad_signature',
      }),
      'wrong_secret',
    );

    expect(response.status).toBe(400);
    expect(await prisma.billingWebhookEvent.count()).toBe(0);
    expect(await prisma.userSubscription.count({ where: { userId: user.id, source: 'CHECKOUT' } })).toBe(0);
  });

  it('rejects unknown checkout sessions without granting entitlement', async () => {
    const user = await createUserWithDefaultSubscription('stripe-unknown-session@example.com');

    const response = await postStripeWebhook(
      checkoutCompletedEvent({
        eventId: 'evt_unknown_session',
        sessionId: 'cs_unknown_session',
        userId: user.id,
        planCode: 'ADVANCED',
        subscriptionId: 'sub_unknown_session',
      }),
    );

    expect(response.status).toBe(422);
    expect(await prisma.userSubscription.count({ where: { userId: user.id, source: 'CHECKOUT' } })).toBe(0);
    const event = await prisma.billingWebhookEvent.findUniqueOrThrow({
      where: { provider_eventId: { provider: 'STRIPE', eventId: 'evt_unknown_session' } },
    });
    expect(event.status).toBe('FAILED');
    expect(event.errorCode).toBe('STRIPE_CHECKOUT_SESSION_UNKNOWN');
  });

  it('rejects unknown checkout plan metadata without granting entitlement', async () => {
    const user = await createUserWithDefaultSubscription('stripe-unknown-plan@example.com');
    const event = checkoutCompletedEvent({
      eventId: 'evt_unknown_plan',
      sessionId: 'cs_unknown_plan',
      userId: user.id,
      planCode: 'ADVANCED',
      subscriptionId: 'sub_unknown_plan',
    }) as ReturnType<typeof checkoutCompletedEvent>;
    (event.data.object.metadata as Record<string, string>).planCode = 'ENTERPRISE';

    const response = await postStripeWebhook(event);

    expect(response.status).toBe(422);
    expect(await prisma.userSubscription.count({ where: { userId: user.id, source: 'CHECKOUT' } })).toBe(0);
    const storedEvent = await prisma.billingWebhookEvent.findUniqueOrThrow({
      where: { provider_eventId: { provider: 'STRIPE', eventId: 'evt_unknown_plan' } },
    });
    expect(storedEvent.status).toBe('FAILED');
    expect(storedEvent.errorCode).toBe('STRIPE_CHECKOUT_METADATA_INCOMPLETE');
  });

  it('expires the stored checkout intent when Stripe reports checkout expiration', async () => {
    const user = await createUserWithDefaultSubscription('stripe-checkout-expired@example.com');
    await createStripePaymentIntent(user.id, 'ADVANCED', 'cs_expired_checkout');

    const response = await postStripeWebhook(
      checkoutExpiredEvent({
        eventId: 'evt_checkout_expired',
        sessionId: 'cs_expired_checkout',
      }),
    );

    expect(response.status).toBe(200);
    const storedIntent = await prisma.paymentIntent.findUniqueOrThrow({
      where: { provider_providerReference: { provider: 'STRIPE', providerReference: 'cs_expired_checkout' } },
    });
    expect(storedIntent.status).toBe('EXPIRED');
    expect(await prisma.userSubscription.count({ where: { userId: user.id, source: 'CHECKOUT' } })).toBe(0);
  });

  it('rejects cross-user checkout metadata before mutating another user subscription', async () => {
    const owner = await createUserWithDefaultSubscription('stripe-owner@example.com');
    const attacker = await createUserWithDefaultSubscription('stripe-attacker@example.com');
    await createStripePaymentIntent(owner.id, 'ADVANCED', 'cs_cross_user');

    const response = await postStripeWebhook(
      checkoutCompletedEvent({
        eventId: 'evt_cross_user',
        sessionId: 'cs_cross_user',
        userId: attacker.id,
        planCode: 'ADVANCED',
        subscriptionId: 'sub_cross_user',
      }),
    );

    expect(response.status).toBe(422);
    expect(await prisma.userSubscription.count({ where: { userId: owner.id, source: 'CHECKOUT' } })).toBe(0);
    expect(await prisma.userSubscription.count({ where: { userId: attacker.id, source: 'CHECKOUT' } })).toBe(0);
  });

  it('reconciles subscription cancellation into expired entitlement state', async () => {
    const user = await createUserWithDefaultSubscription('stripe-subscription-cancel@example.com');
    const plan = await prisma.subscriptionPlan.findUniqueOrThrow({ where: { code: 'ADVANCED' } });
    const checkoutSubscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        subscriptionPlanId: plan.id,
        source: 'CHECKOUT',
        status: 'ACTIVE',
        autoRenew: true,
        metadata: {
          stripe: {
            subscriptionId: 'sub_cancel',
          },
        } satisfies Prisma.InputJsonValue,
      },
    });

    const response = await postStripeWebhook(
      subscriptionEvent({
        eventId: 'evt_subscription_cancel',
        eventType: 'customer.subscription.deleted',
        subscriptionId: 'sub_cancel',
        userId: user.id,
        planCode: 'ADVANCED',
        status: 'canceled',
      }),
    );

    expect(response.status).toBe(200);
    const storedSubscription = await prisma.userSubscription.findUniqueOrThrow({
      where: { id: checkoutSubscription.id },
    });
    expect(storedSubscription.status).toBe('CANCELED');
    expect(storedSubscription.autoRenew).toBe(false);
    expect(storedSubscription.endsAt).toBeInstanceOf(Date);
  });

  it('keeps period-end canceled subscriptions active while disabling auto-renew', async () => {
    const user = await createUserWithDefaultSubscription('stripe-subscription-cancel-period-end@example.com');
    const plan = await prisma.subscriptionPlan.findUniqueOrThrow({ where: { code: 'ADVANCED' } });
    const checkoutSubscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        subscriptionPlanId: plan.id,
        source: 'CHECKOUT',
        status: 'ACTIVE',
        autoRenew: true,
        metadata: {
          stripe: {
            subscriptionId: 'sub_cancel_period_end',
          },
        } satisfies Prisma.InputJsonValue,
      },
    });

    const response = await postStripeWebhook(
      subscriptionEvent({
        eventId: 'evt_subscription_cancel_period_end',
        eventType: 'customer.subscription.updated',
        subscriptionId: 'sub_cancel_period_end',
        userId: user.id,
        planCode: 'ADVANCED',
        status: 'active',
        cancelAtPeriodEnd: true,
      }),
    );

    expect(response.status).toBe(200);
    const storedSubscription = await prisma.userSubscription.findUniqueOrThrow({
      where: { id: checkoutSubscription.id },
    });
    expect(storedSubscription.status).toBe('ACTIVE');
    expect(storedSubscription.autoRenew).toBe(false);
    expect(storedSubscription.endsAt).toEqual(new Date(1_789_948_800 * 1000));
  });
});
