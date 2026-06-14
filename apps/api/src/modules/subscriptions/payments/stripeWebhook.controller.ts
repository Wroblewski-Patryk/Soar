import { Request, Response } from 'express';
import { mapErrorToHttpResponse } from '../../../lib/httpErrorMapper';
import { sendError } from '../../../utils/apiError';
import { subscriptionErrors } from '../subscriptions.errors';
import { reconcileStripeWebhookEvent } from './stripeWebhook.service';

type StripeWebhookClient = {
  webhooks: {
    constructEvent: (payload: Buffer, signature: string, secret: string) => unknown;
  };
};

const StripeConstructor = require('stripe') as new (
  secretKey: string,
  config: { apiVersion: string },
) => StripeWebhookClient;

const STRIPE_API_VERSION = '2026-02-25.clover';

const getStripeWebhookClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw subscriptionErrors.paymentProviderStripeNotConfigured();
  }

  return new StripeConstructor(secretKey, {
    apiVersion: STRIPE_API_VERSION,
  });
};

const getStripeWebhookSecret = () => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    throw subscriptionErrors.paymentProviderStripeNotConfigured();
  }
  return webhookSecret;
};

const sendMappedError = (res: Response, error: unknown) => {
  const mapped = mapErrorToHttpResponse(error);

  if (mapped.code === 'PAYMENT_PROVIDER_STRIPE_NOT_CONFIGURED') {
    return sendError(res, 503, 'stripe webhook is not configured');
  }

  return sendError(res, mapped.status, mapped.message, mapped.details);
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.header('stripe-signature');
  if (!signature) {
    return sendError(res, 400, 'Missing Stripe signature');
  }
  if (!Buffer.isBuffer(req.body)) {
    return sendError(res, 400, 'Stripe webhook requires raw request body');
  }

  try {
    const event = getStripeWebhookClient().webhooks.constructEvent(
      req.body,
      signature,
      getStripeWebhookSecret(),
    );
    const result = await reconcileStripeWebhookEvent(event as Parameters<typeof reconcileStripeWebhookEvent>[0]);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('signature')) {
      return sendError(res, 400, 'Invalid Stripe signature');
    }
    return sendMappedError(res, error);
  }
};
