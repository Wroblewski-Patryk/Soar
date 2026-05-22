import { afterEach, describe, expect, it, vi } from 'vitest';

const originalNodeEnv = process.env.NODE_ENV;

describe('module logger security redaction', () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('redacts sensitive top-level, nested, array, and error fields before writing logs', async () => {
    process.env.NODE_ENV = 'production';
    const logSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { createModuleLogger } = await import('./logger');

    createModuleLogger('security-test').error('redaction_check', {
      apiSecret: 'top-secret',
      userId: 'user_123',
      nested: {
        token: 'nested-token',
        safe: 'visible-context',
      },
      attempts: [
        {
          apiKey: 'array-key',
          status: 'failed',
        },
      ],
      error: new Error('provider returned secret=leaked-token'),
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(logSpy.mock.calls[0]?.[0] as string) as Record<string, unknown>;

    expect(payload.apiSecret).toBe('[REDACTED]');
    expect(payload.userId).toBe('user_123');
    expect(payload.nested).toMatchObject({
      token: '[REDACTED]',
      safe: 'visible-context',
    });
    expect(payload.attempts).toMatchObject([
      {
        apiKey: '[REDACTED]',
        status: 'failed',
      },
    ]);
    expect(payload.error).toMatchObject({
      name: 'Error',
      message: '[REDACTED]',
      stack: '[REDACTED]',
    });
    expect(JSON.stringify(payload)).not.toContain('top-secret');
    expect(JSON.stringify(payload)).not.toContain('nested-token');
    expect(JSON.stringify(payload)).not.toContain('array-key');
    expect(JSON.stringify(payload)).not.toContain('leaked-token');
  });
});
