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
});
