import { describe, expect, it } from 'vitest';
import { __requestLoggerInternals } from './requestLogger';

describe('requestLogger security sanitization', () => {
  it('redacts sensitive query parameters before logging the URL', () => {
    expect(
      __requestLoggerInternals.sanitizeOriginalUrl(
        '/dashboard/orders?symbol=BTCUSDT&token=abc&apiKey=def&sessionId=ghi'
      )
    ).toBe('/dashboard/orders?symbol=BTCUSDT&token=%5BREDACTED%5D&apiKey=%5BREDACTED%5D&sessionId=%5BREDACTED%5D');
  });

  it('redacts grant secrets even in an unexpected path or query value', () => {
    const secret = `soar_ext_${'a'.repeat(43)}`;
    const sanitized = __requestLoggerInternals.sanitizeOriginalUrl(
      `/external-client/grants/${secret.replace('soar', '%73oar')}/status?${secret}=${secret}`);
    expect(sanitized).toBe('/external-client/grants/[REDACTED]');
    const unexpected = __requestLoggerInternals.sanitizeOriginalUrl(`/other/${secret}?value=${secret}`);
    expect(unexpected).not.toContain(secret);
    expect(unexpected).toContain('%5BREDACTED%5D');
  });
});
