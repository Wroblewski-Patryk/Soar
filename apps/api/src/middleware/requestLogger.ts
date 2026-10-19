import { NextFunction, Request, Response } from 'express';
import { metricsStore } from '../observability/metrics';
import { createModuleLogger } from '../lib/logger';

const logger = createModuleLogger('http.request');

const sensitiveQueryKeyPattern =
  /(password|passphrase|secret|token|authorization|cookie|api[-_]?key|api[-_]?secret|private[-_]?key|jwt|credential|session)/i;
const grantSecretPattern = /soar_ext_[A-Za-z0-9_-]{43}/g;
const redactGrantSecret = (value: string) => {
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { /* keep malformed URL text */ }
  return decoded.replace(grantSecretPattern, '[REDACTED]');
};

const sanitizeOriginalUrl = (originalUrl: string) => {
  const [pathname, queryString] = originalUrl.split('?', 2);
  // The external route does not log client-supplied IDs or query text at all.
  if (/^\/external-client\/grants\//i.test(pathname)) return '/external-client/grants/[REDACTED]';
  const safePathname = redactGrantSecret(pathname || originalUrl);
  if (!queryString) return safePathname;

  const query = new URLSearchParams(queryString);
  const sanitized = new URLSearchParams();
  for (const [key, value] of query.entries()) {
    sanitized.append(redactGrantSecret(key),
      sensitiveQueryKeyPattern.test(key) ? '[REDACTED]' : redactGrantSecret(value));
  }
  const sanitizedQuery = sanitized.toString();
  return sanitizedQuery ? `${safePathname}?${sanitizedQuery}` : safePathname;
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
