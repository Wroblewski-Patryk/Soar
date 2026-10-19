import { Router } from 'express';
import { createRateLimiter } from '../../middleware/rateLimit';
import { sendError } from '../../utils/apiError';
import { EXTERNAL_CLIENT_READ_GRANT_SECRET_PATTERN } from './externalClientReadGrants.service';
import { readExternalClientBotStatus } from './externalClientBotStatus.service';

const router = Router();
const ipLimiter = createRateLimiter({ windowMs: 60_000, max: 30, keyScope: 'ip',
  bucketId: 'external-client-grant-self-status', requireSharedStore: true });
const grantLimiter = createRateLimiter({ windowMs: 60_000, max: 60, keyScope: 'read_grant',
  bucketId: 'external-client-bot-status-grant', requireSharedStore: true });
const unauthorized = (res: Parameters<typeof sendError>[0]) =>
  sendError(res, 401, 'Grant unavailable');

router.get('/:botId/status', ipLimiter, grantLimiter, async (req, res) => {
  const authorization = req.headers.authorization;
  const headerCount = req.rawHeaders.filter((header) => header.toLowerCase() === 'authorization').length;
  const secret = /^Bearer (soar_read_[A-Za-z0-9_-]{43})$/i.exec(authorization ?? '')?.[1];
  if (headerCount !== 1 || !secret || !EXTERNAL_CLIENT_READ_GRANT_SECRET_PATTERN.test(secret) ||
      req.headers.cookie !== undefined || Object.keys(req.query).length > 0 ||
      Object.keys(req.body ?? {}).length > 0 || req.headers['content-length'] !== undefined ||
      req.headers['transfer-encoding'] !== undefined) {
    return unauthorized(res);
  }
  try {
    const bot = await readExternalClientBotStatus(String(req.params.botId), secret);
    return bot ? res.json({ bot }) : unauthorized(res);
  } catch {
    return sendError(res, 503, 'Bot status temporarily unavailable');
  }
});

export default router;
