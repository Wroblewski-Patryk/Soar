import { Router } from 'express';
import { ExternalClientReadAction } from '@prisma/client';
import { z, ZodError } from 'zod';
import { createRateLimiter } from '../../middleware/rateLimit';
import { requireHumanSession } from '../../middleware/requireHumanSession';
import { sendError } from '../../utils/apiError';
import {
  SubscriptionAssignmentRequiredError,
  SubscriptionFeatureUnavailableError,
} from '../subscriptions/subscriptionEntitlements.service';
import { GrantInputError } from './externalClientGrants.service';
import {
  createExternalClientReadGrant, getExternalClientReadGrant,
  listExternalClientReadGrants, revokeExternalClientReadGrant,
} from './externalClientReadGrants.service';

const router = Router();
router.use(requireHumanSession);

const createSchema = z.strictObject({
  botId: z.uuid(),
  clientLabel: z.string().trim().min(1).max(100),
  action: z.enum(ExternalClientReadAction),
  ttlSeconds: z.number().int().min(60).max(7 * 24 * 60 * 60),
  password: z.string().min(1).max(200),
});

const handleError = (res: Parameters<typeof sendError>[0], error: unknown) => {
  if (error instanceof ZodError) return sendError(res, 400, 'Invalid read grant request');
  if (error instanceof GrantInputError) return sendError(res, error.status, error.message);
  if (error instanceof SubscriptionAssignmentRequiredError) return sendError(res, 403, error.message);
  if (error instanceof SubscriptionFeatureUnavailableError) {
    return sendError(res, 403, 'live trading is not available on the active subscription plan', error.details);
  }
  return sendError(res, 500, 'Read grant operation failed');
};

router.post('/', createRateLimiter({ windowMs: 15 * 60_000, max: 5, keyScope: 'user' }), async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try {
    return res.status(201).json(await createExternalClientReadGrant(req.user.id, createSchema.parse(req.body)));
  } catch (error) { return handleError(res, error); }
});

router.get('/', async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try { return res.json({ grants: await listExternalClientReadGrants(req.user.id) }); }
  catch (error) { return handleError(res, error); }
});

router.get('/:id', async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try {
    const grant = await getExternalClientReadGrant(req.user.id, String(req.params.id));
    return grant ? res.json({ grant }) : sendError(res, 404, 'Read grant not found');
  } catch (error) { return handleError(res, error); }
});

router.post('/:id/revoke', createRateLimiter({ windowMs: 15 * 60_000, max: 10, keyScope: 'user' }), async (req, res) => {
  if (!req.user?.id) return sendError(res, 401, 'Unauthorized');
  try {
    return res.json({ grant: await revokeExternalClientReadGrant(req.user.id, String(req.params.id)) });
  } catch (error) { return handleError(res, error); }
});

export default router;
