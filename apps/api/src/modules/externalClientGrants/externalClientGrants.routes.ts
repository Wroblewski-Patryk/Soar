import { Router } from 'express';
import { Exchange, ExternalClientAction, TradeMarket } from '@prisma/client';
import { z, ZodError } from 'zod';
import { createRateLimiter } from '../../middleware/rateLimit';
import { requireHumanSession } from '../../middleware/requireHumanSession';
import { sendError } from '../../utils/apiError';
import {
  createExternalClientGrant, getExternalClientGrant, GrantInputError,
  listExternalClientGrants, revokeExternalClientGrant,
} from './externalClientGrants.service';
import {
  SubscriptionAssignmentRequiredError,
  SubscriptionFeatureUnavailableError,
} from '../subscriptions/subscriptionEntitlements.service';

const router = Router();
router.use(requireHumanSession);

const createSchema = z.strictObject({
  botId: z.uuid(),
  clientLabel: z.string().trim().min(1).max(100),
  exchange: z.enum(Exchange),
  marketType: z.enum(TradeMarket),
  symbol: z.string().regex(/^[A-Z0-9]{5,30}$/),
  action: z.enum(ExternalClientAction),
  maxActionQuoteAmount: z.string(),
  maxTotalQuoteAmount: z.string(),
  maxActions: z.number().int().min(1).max(1000),
  ttlSeconds: z.number().int().min(60).max(7 * 24 * 60 * 60),
  password: z.string().min(1).max(200),
});

const handleError = (res: Parameters<typeof sendError>[0], error: unknown) => {
  if (error instanceof ZodError) return sendError(res, 400, 'Invalid grant request');
  if (error instanceof GrantInputError) return sendError(res, error.status, error.message);
  if (error instanceof SubscriptionAssignmentRequiredError) return sendError(res, 403, error.message);
  if (error instanceof SubscriptionFeatureUnavailableError) {
    return sendError(res, 403, 'live trading is not available on the active subscription plan', error.details);
  }
  return sendError(res, 500, 'Grant operation failed');
};

router.post('/', createRateLimiter({ windowMs: 15 * 60_000, max: 5, keyScope: 'user' }), async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try {
    const result = await createExternalClientGrant(req.user.id, createSchema.parse(req.body));
    return res.status(201).json(result);
  } catch (error) { return handleError(res, error); }
});

router.get('/', async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try { return res.json({ grants: await listExternalClientGrants(req.user.id) }); }
  catch (error) { return handleError(res, error); }
});

router.get('/:id', async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try {
    const grant = await getExternalClientGrant(req.user.id, String(req.params.id));
    return grant ? res.json({ grant }) : sendError(res, 404, 'Grant not found');
  } catch (error) { return handleError(res, error); }
});

router.post('/:id/revoke', createRateLimiter({ windowMs: 15 * 60_000, max: 10, keyScope: 'user' }), async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try {
    const grant = await revokeExternalClientGrant(req.user.id, String(req.params.id));
    return res.json({ grant });
  } catch (error) { return handleError(res, error); }
});

export default router;
