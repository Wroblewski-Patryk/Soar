import { NextFunction, Request, Response } from 'express';
import { metricsStore } from '../observability/metrics';
import { createModuleLogger } from '../lib/logger';

const logger = createModuleLogger('http.request');

// The route path comes from our route declaration. Raw URL text, parameters,
// and query strings are never logged, even if percent encoding is malformed.
const routePathForLog = (req: Request) =>
  typeof req.route?.path === 'string' ? req.route.path : '[UNMATCHED]';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    metricsStore.recordHttp({
      statusCode: res.statusCode,
      durationMs,
    });

    logger.info('http_request', {
      method: req.method,
      path: routePathForLog(req),
      statusCode: res.statusCode,
      durationMs,
    });
  });

  return next();
};
