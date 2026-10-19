import { Router } from 'express';
import { createRateLimiter } from '../../middleware/rateLimit';
import { sendError } from '../../utils/apiError';
import { EXTERNAL_CLIENT_GRANT_SECRET_PATTERN } from './externalClientGrants.service';
import { readExternalClientGrantSelfStatus } from './externalClientGrantSelfStatus.service';

const router = Router();
const limiter = createRateLimiter({ windowMs: 60_000, max: 30, keyScope: 'ip',
  bucketId: 'external-client-grant-self-status' });
const unauthorized = (res: Parameters<typeof sendError>[0]) =>
  sendError(res, 401, 'Grant unavailable');

router.get('/:id/status', limiter, async (req, res) => {
  const authorization = req.headers.authorization;
  const headerCount = req.rawHeaders.filter((header) => header.toLowerCase() === 'authorization').length;
  const secret = /^Bearer (soar_ext_[A-Za-z0-9_-]{43})$/i.exec(authorization ?? '')?.[1];
  if (headerCount !== 1 || !secret || !EXTERNAL_CLIENT_GRANT_SECRET_PATTERN.test(secret) ||
      req.headers.cookie !== undefined || Object.keys(req.query).length > 0 ||
      Object.keys(req.body ?? {}).length > 0 || req.headers['content-length'] !== undefined ||
      req.headers['transfer-encoding'] !== undefined) {
    return unauthorized(res);
  }
  try {
    const grant = await readExternalClientGrantSelfStatus(String(req.params.id), secret);
    return grant ? res.json({ grant }) : unauthorized(res);
  } catch {
    return sendError(res, 503, 'Grant status temporarily unavailable');
  }
});

export default router;
