import { Router } from 'express';
import { createRateLimiter } from '../../../middleware/rateLimit';
import { handleStripeWebhook } from './stripeWebhook.controller';

const stripeWebhookRouter = Router();
const webhookLimiter = createRateLimiter({ windowMs: 60_000, max: 120, keyScope: 'ip' });

stripeWebhookRouter.post('/', webhookLimiter, handleStripeWebhook);

export default stripeWebhookRouter;
