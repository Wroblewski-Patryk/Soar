import { NextFunction, Request, Response } from 'express';
import { metricsStore } from '../observability/metrics';
import { createModuleLogger } from '../lib/logger';

const logger = createModuleLogger('http.request');

const sensitiveQueryKeyPattern =
  /(password|passphrase|secret|token|authorization|cookie|api[-_]?key|api[-_]?secret|private[-_]?key|jwt|credential|session)/i;

const sanitizeOriginalUrl = (originalUrl: string) => {
  const [pathname, queryString] = originalUrl.split('?', 2);
  if (!queryString) return pathname || originalUrl;

  const query = new URLSearchParams(queryString);
  const sanitized = new URLSearchParams();
  for (const [key, value] of query.entries()) {
    sanitized.append(key, sensitiveQueryKeyPattern.test(key) ? '[REDACTED]' : value);
  }
  const sanitizedQuery = sanitized.toString();
  return sanitizedQuery ? `${pathname}?${sanitizedQuery}` : pathname;
};

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
      path: sanitizeOriginalUrl(req.originalUrl),
      statusCode: res.statusCode,
      durationMs,
    });
  });

  return next();
};

export const __requestLoggerInternals = {
  sanitizeOriginalUrl,
};
