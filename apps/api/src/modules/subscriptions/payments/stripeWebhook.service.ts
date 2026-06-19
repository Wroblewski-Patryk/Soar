import { Prisma, type SubscriptionPlanCode } from '@prisma/client';
import { prisma } from '../../../prisma/client';

type StripeWebhookResult = {
  received: true;
  processed: boolean;
  replayed: boolean;
  ignored: boolean;
};

type StripeMetadata = Record<string, string> | null | undefined;

type StripeExpandableId = string | { id: string } | null | undefined;

type StripeWebhookEvent = {
  id: string;
  type: string;
  api_version?: string | null;
  livemode: boolean;
  created: number;
  data: {
    object: unknown;
  };
};

type StripeCheckoutSession = {
  id: string;
  status: string | null;
  payment_status: string | null;
  customer?: StripeExpandableId;
  subscription?: StripeExpandableId;
  client_reference_id?: string | null;
  metadata?: StripeMetadata;
};

type StripeSubscription = {
  id: string;
  customer?: StripeExpandableId;
  status: string;
  current_period_end?: number | null;
  canceled_at?: number | null;
  cancel_at_period_end?: boolean | null;
  metadata?: StripeMetadata;
};

const handledEventTypes = new Set([
  'checkout.session.completed',
  'checkout.session.expired',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

const subscriptionPlanCodes = new Set<SubscriptionPlanCode>(['FREE', 'ADVANCED', 'PROFESSIONAL']);

const getMetadataValue = (metadata: StripeMetadata, key: string): string | null => {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
};

const getPlanCode = (metadata: StripeMetadata, key: string): SubscriptionPlanCode | null => {
  const value = getMetadataValue(metadata, key);
  return value && subscriptionPlanCodes.has(value as SubscriptionPlanCode) ? (value as SubscriptionPlanCode) : null;
};

const getStringId = (value: StripeExpandableId) => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  if (value && typeof value === 'object' && typeof value.id === 'string') return value.id;
  return null;
};

const getUnixDate = (value: number | null | undefined): Date | null => {
  if (!value) return null;
  return new Date(value * 1000);
};

const mapSubscriptionStatus = (
  status: string,
  cancelAtPeriodEnd?: boolean | null,
): { status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'; autoRenew: boolean } => {
  if (status === 'active' || status === 'trialing') {
    return { status: 'ACTIVE', autoRenew: !cancelAtPeriodEnd };
  }
  if (status === 'past_due' || status === 'unpaid') return { status: 'PAST_DUE', autoRenew: true };
  if (status === 'canceled') return { status: 'CANCELED', autoRenew: false };
  return { status: 'EXPIRED', autoRenew: false };
};

const createSafeEventMetadata = (event: StripeWebhookEvent): Prisma.InputJsonValue => ({
  stripe: {
    apiVersion: event.api_version ?? null,
    livemode: event.livemode,
    created: event.created,
  },
});

const fail = (code: string, details: Record<string, unknown> = {}) => {
  const error = new Error(code) as Error & { status: number; code: string; details: Record<string, unknown> };
  error.status = 422;
  error.code = code;
  error.details = details;
  return error;
};

const markEvent = async (
  eventId: string,
  status: 'PROCESSED' | 'FAILED' | 'IGNORED',
  data: {
    userId?: string | null;
    subscriptionPlanId?: string | null;
    paymentIntentId?: string | null;
    providerReference?: string | null;
    errorCode?: string | null;
    metadata?: Prisma.InputJsonValue;
  } = {},
) => {
  await prisma.billingWebhookEvent.update({
    where: {
      provider_eventId: {
        provider: 'STRIPE',
        eventId,
      },
    },
    data: {
      status,
      processedAt: new Date(),
      lastAttemptAt: new Date(),
      ...data,
    },
  });
};

const beginEvent = async (event: StripeWebhookEvent): Promise<'started' | 'replayed'> => {
  const existing = await prisma.billingWebhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider: 'STRIPE',
        eventId: event.id,
      },
    },
    select: { status: true },
  });

  if (existing?.status === 'PROCESSED' || existing?.status === 'IGNORED') {
    return 'replayed';
  }

  if (existing) {
    await prisma.billingWebhookEvent.update({
      where: {
        provider_eventId: {
          provider: 'STRIPE',
          eventId: event.id,
        },
      },
      data: {
        status: 'PROCESSING',
        eventType: event.type,
        errorCode: null,
        lastAttemptAt: new Date(),
        metadata: createSafeEventMetadata(event),
      },
    });
    return 'started';
  }

  try {
    await prisma.billingWebhookEvent.create({
      data: {
        provider: 'STRIPE',
        eventId: event.id,
        eventType: event.type,
        status: 'PROCESSING',
        metadata: createSafeEventMetadata(event),
      },
    });
    return 'started';
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return 'replayed';
    }
    throw error;
  }
};

const writeAuditLog = async (
  tx: Prisma.TransactionClient,
  input: {
    userId: string;
    action: string;
    message: string;
    entityType: string;
    entityId: string;
    metadata: Prisma.InputJsonValue;
  },
) => {
  await tx.log.create({
    data: {
      userId: input.userId,
      action: input.action,
      level: 'INFO',
      source: 'stripe_webhook',
      category: 'billing',
      entityType: input.entityType,
      entityId: input.entityId,
      actor: 'stripe',
      message: input.message,
      metadata: input.metadata,
    },
  });
};

const handleCheckoutCompleted = async (session: StripeCheckoutSession) => {
  if (session.payment_status !== 'paid' || session.status !== 'complete') {
    throw fail('STRIPE_CHECKOUT_NOT_PAID', { sessionId: session.id });
  }

  const metadataUserId = getMetadataValue(session.metadata, 'userId');
  const metadataPlanCode = getPlanCode(session.metadata, 'planCode');
  const clientReferenceId =
    typeof session.client_reference_id === 'string' && session.client_reference_id.trim().length > 0
      ? session.client_reference_id.trim()
      : null;
  const stripeSubscriptionId = getStringId(session.subscription);

  if (!metadataUserId || !metadataPlanCode || !stripeSubscriptionId) {
    throw fail('STRIPE_CHECKOUT_METADATA_INCOMPLETE', { sessionId: session.id });
  }
  if (clientReferenceId && clientReferenceId !== metadataUserId) {
    throw fail('STRIPE_CHECKOUT_USER_MISMATCH', { sessionId: session.id });
  }

  return prisma.$transaction(async (tx) => {
    const paymentIntent = await tx.paymentIntent.findUnique({
      where: {
        provider_providerReference: {
          provider: 'STRIPE',
          providerReference: session.id,
        },
      },
      include: {
        subscriptionPlan: {
          select: { id: true, code: true },
        },
      },
    });
    if (!paymentIntent) throw fail('STRIPE_CHECKOUT_SESSION_UNKNOWN', { sessionId: session.id });
    if (paymentIntent.userId !== metadataUserId) {
      throw fail('STRIPE_CHECKOUT_PAYMENT_USER_MISMATCH', { sessionId: session.id });
    }
    if (paymentIntent.subscriptionPlan.code !== metadataPlanCode) {
      throw fail('STRIPE_CHECKOUT_PAYMENT_PLAN_MISMATCH', { sessionId: session.id });
    }

    if (paymentIntent.status === 'SUCCEEDED' && paymentIntent.userSubscriptionId) {
      const existingSubscription = await tx.userSubscription.findUnique({
        where: { id: paymentIntent.userSubscriptionId },
        select: {
          id: true,
          userId: true,
          subscriptionPlanId: true,
        },
      });
      if (
        existingSubscription?.userId === metadataUserId &&
        existingSubscription.subscriptionPlanId === paymentIntent.subscriptionPlanId
      ) {
        return {
          userId: metadataUserId,
          subscriptionPlanId: paymentIntent.subscriptionPlanId,
          paymentIntentId: paymentIntent.id,
          providerReference: stripeSubscriptionId,
        };
      }
    }

    const user = await tx.user.findUnique({
      where: { id: metadataUserId },
      select: { id: true },
    });
    if (!user) throw fail('STRIPE_CHECKOUT_USER_UNKNOWN', { userId: metadataUserId });

    await tx.userSubscription.updateMany({
      where: {
        userId: metadataUserId,
        status: 'ACTIVE',
      },
      data: {
        status: 'CANCELED',
        endsAt: new Date(),
      },
    });

    const subscription = await tx.userSubscription.create({
      data: {
        userId: metadataUserId,
        subscriptionPlanId: paymentIntent.subscriptionPlanId,
        status: 'ACTIVE',
        source: 'CHECKOUT',
        autoRenew: true,
        startsAt: new Date(),
        metadata: {
          stripe: {
            checkoutSessionId: session.id,
            subscriptionId: stripeSubscriptionId,
            customerId: getStringId(session.customer),
            eventSource: 'checkout.session.completed',
          },
        },
      },
    });

    await tx.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: 'SUCCEEDED',
        userSubscriptionId: subscription.id,
        metadata: {
          ...(paymentIntent.metadata && typeof paymentIntent.metadata === 'object'
            ? (paymentIntent.metadata as Record<string, unknown>)
            : {}),
          stripe: {
            checkoutSessionId: session.id,
            subscriptionId: stripeSubscriptionId,
            paymentStatus: session.payment_status,
          },
        },
      },
    });

    await writeAuditLog(tx, {
      userId: metadataUserId,
      action: 'subscription.checkout.activated',
      message: 'Stripe checkout activated subscription',
      entityType: 'UserSubscription',
      entityId: subscription.id,
      metadata: {
        planCode: paymentIntent.subscriptionPlan.code,
        paymentIntentId: paymentIntent.id,
        stripe: {
          checkoutSessionId: session.id,
          subscriptionId: stripeSubscriptionId,
        },
      },
    });

    return {
      userId: metadataUserId,
      subscriptionPlanId: paymentIntent.subscriptionPlanId,
      paymentIntentId: paymentIntent.id,
      providerReference: stripeSubscriptionId,
    };
  });
};

const handleCheckoutExpired = async (session: StripeCheckoutSession) => {
  const paymentIntent = await prisma.paymentIntent.update({
    where: {
      provider_providerReference: {
        provider: 'STRIPE',
        providerReference: session.id,
      },
    },
    data: {
      status: 'EXPIRED',
    },
    select: {
      id: true,
      userId: true,
      subscriptionPlanId: true,
    },
  });

  return {
    userId: paymentIntent.userId,
    subscriptionPlanId: paymentIntent.subscriptionPlanId,
    paymentIntentId: paymentIntent.id,
    providerReference: session.id,
  };
};

const handleSubscriptionLifecycle = async (subscription: StripeSubscription) => {
  const metadataUserId = getMetadataValue(subscription.metadata, 'userId');
  const metadataPlanCode = getPlanCode(subscription.metadata, 'planCode');
  if (!metadataUserId || !metadataPlanCode) {
    throw fail('STRIPE_SUBSCRIPTION_METADATA_INCOMPLETE', { subscriptionId: subscription.id });
  }

  const mapped = mapSubscriptionStatus(subscription.status, subscription.cancel_at_period_end);
  const endsAt =
    mapped.status === 'ACTIVE'
      ? getUnixDate(subscription.current_period_end)
      : getUnixDate(subscription.canceled_at) ?? getUnixDate(subscription.current_period_end) ?? new Date();

  return prisma.$transaction(async (tx) => {
    const plan = await tx.subscriptionPlan.findUnique({
      where: { code: metadataPlanCode },
      select: { id: true, code: true },
    });
    if (!plan) throw fail('STRIPE_SUBSCRIPTION_PLAN_UNKNOWN', { planCode: metadataPlanCode });

    const existing = await tx.userSubscription.findFirst({
      where: {
        userId: metadataUserId,
        source: 'CHECKOUT',
        metadata: {
          path: ['stripe', 'subscriptionId'],
          equals: subscription.id,
        },
      },
      select: {
        id: true,
        userId: true,
        subscriptionPlanId: true,
        metadata: true,
      },
    });
    if (!existing) {
      throw fail('STRIPE_SUBSCRIPTION_UNKNOWN', { subscriptionId: subscription.id });
    }
    if (existing.subscriptionPlanId !== plan.id) {
      throw fail('STRIPE_SUBSCRIPTION_PLAN_MISMATCH', { subscriptionId: subscription.id });
    }

    const user = await tx.user.findUnique({
      where: { id: metadataUserId },
      select: { id: true },
    });
    if (!user) throw fail('STRIPE_SUBSCRIPTION_USER_UNKNOWN', { userId: metadataUserId });

    const metadata =
      existing.metadata && typeof existing.metadata === 'object'
        ? (existing.metadata as Record<string, unknown>)
        : {};

    await tx.userSubscription.update({
      where: { id: existing.id },
      data: {
        status: mapped.status,
        autoRenew: mapped.autoRenew,
        endsAt,
        metadata: {
          ...metadata,
          stripe: {
            ...(typeof metadata.stripe === 'object' && metadata.stripe !== null
              ? (metadata.stripe as Record<string, unknown>)
              : {}),
            subscriptionId: subscription.id,
            customerId: getStringId(subscription.customer),
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: subscription.current_period_end ?? null,
          },
        },
      },
    });

    await writeAuditLog(tx, {
      userId: metadataUserId,
      action: 'subscription.stripe.lifecycle_reconciled',
      message: 'Stripe subscription lifecycle reconciled',
      entityType: 'UserSubscription',
      entityId: existing.id,
      metadata: {
        status: mapped.status,
        planCode: plan.code,
        stripe: {
          subscriptionId: subscription.id,
          stripeStatus: subscription.status,
        },
      },
    });

    return {
      userId: metadataUserId,
      subscriptionPlanId: plan.id,
      paymentIntentId: null,
      providerReference: subscription.id,
    };
  });
};

const processEvent = async (event: StripeWebhookEvent) => {
  if (!handledEventTypes.has(event.type)) {
    return { ignored: true, data: {} };
  }

  if (event.type === 'checkout.session.completed') {
    return {
      ignored: false,
      data: await handleCheckoutCompleted(event.data.object as StripeCheckoutSession),
    };
  }

  if (event.type === 'checkout.session.expired') {
    return {
      ignored: false,
      data: await handleCheckoutExpired(event.data.object as StripeCheckoutSession),
    };
  }

  return {
    ignored: false,
    data: await handleSubscriptionLifecycle(event.data.object as StripeSubscription),
  };
};

export const reconcileStripeWebhookEvent = async (event: StripeWebhookEvent): Promise<StripeWebhookResult> => {
  const eventState = await beginEvent(event);
  if (eventState === 'replayed') {
    return { received: true, processed: false, replayed: true, ignored: false };
  }

  try {
    const processed = await processEvent(event);
    await markEvent(event.id, processed.ignored ? 'IGNORED' : 'PROCESSED', processed.data);
    return {
      received: true,
      processed: !processed.ignored,
      replayed: false,
      ignored: processed.ignored,
    };
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'STRIPE_WEBHOOK_RECONCILIATION_FAILED';
    await markEvent(event.id, 'FAILED', { errorCode: code });
    throw error;
  }
};
