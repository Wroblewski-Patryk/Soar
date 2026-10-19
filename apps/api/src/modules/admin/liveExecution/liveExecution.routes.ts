import { Router } from 'express';
import { z } from 'zod';
import { isAppErrorLike } from '../../../lib/errors';
import { sendError } from '../../../utils/apiError';
import { sendValidationError } from '../../../utils/formatZodError';
import { readLiveExecutionPause, setLiveExecutionPause } from '../../orders/liveExecutionPause.service';

const router = Router();
const UpdateSchema = z.object({
  paused: z.boolean(),
  reason: z.string().trim().min(10).max(500),
  expectedVersion: z.number().int().positive(),
}).strict();

router.get('/', async (_req, res) => {
  const status = await readLiveExecutionPause();
  return res.status(status.available ? 200 : 503).json(status);
});

router.put('/', async (req, res) => {
  try {
    const payload = UpdateSchema.parse(req.body);
    if (!req.user?.id) return sendError(res, 401, 'Missing token');
    const status = await setLiveExecutionPause({ actorUserId: req.user.id, ...payload });
    return res.json(status);
  } catch (error) {
    if (isAppErrorLike(error)) {
      const details = error.code === 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT'
        ? { code: error.code } : undefined;
      return sendError(res, error.status, error.message, details);
    }
    return sendValidationError(res, error);
  }
});

export default router;
