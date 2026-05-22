import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveUiErrorMessage } from './errorResolver';
import { getAxiosMessage } from './getAxiosMessage';
import { handleError } from './handleError';

const createAxiosLikeError = (data: unknown, message = 'axios fallback') =>
  ({
    isAxiosError: true,
    response: { data },
    message,
  }) as unknown;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('resolveUiErrorMessage', () => {
  it('prefers validation detail messages when present', () => {
    const error = createAxiosLikeError({
      error: {
        details: [{ message: 'symbol is required' }, { message: 'mode is invalid' }],
        message: 'payload message',
      },
    });

    expect(resolveUiErrorMessage(error)).toBe('symbol is required, mode is invalid');
  });

  it('resolves message from payload error/message fallback chain', () => {
    expect(resolveUiErrorMessage(createAxiosLikeError({ error: '  service unavailable  ' }))).toBe(
      'service unavailable'
    );
    expect(resolveUiErrorMessage(createAxiosLikeError({ message: 'request failed' }))).toBe(
      'request failed'
    );
    expect(resolveUiErrorMessage(new Error('plain error'))).toBe('plain error');
  });

  it('applies fallback when no message is available', () => {
    expect(resolveUiErrorMessage({}, { fallback: 'fallback message' })).toBe('fallback message');
  });

  it('redacts sensitive backend and raw Error messages in production', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(
      resolveUiErrorMessage(
        createAxiosLikeError({
          error: {
            details: [{ message: 'Authorization token leaked in Prisma query SELECT * FROM users' }],
          },
        }),
        { fallback: 'Request failed' }
      )
    ).toBe('Request failed');
    expect(resolveUiErrorMessage(new Error('apiSecret=abc123'), { fallback: 'Request failed' })).toBe(
      'Request failed'
    );
  });
});

describe('compat wrappers', () => {
  it('returns undefined for non-axios in getAxiosMessage', () => {
    expect(getAxiosMessage(new Error('boom'))).toBeUndefined();
  });

  it('uses shared resolver for axios payloads in getAxiosMessage', () => {
    const error = createAxiosLikeError({ error: { message: 'api payload message' } });
    expect(getAxiosMessage(error)).toBe('api payload message');
  });

  it('keeps default fallback behavior in handleError', () => {
    expect(handleError({})).toBe('Something went wrong');
  });

  it('accepts localized fallback override in handleError', () => {
    expect(handleError({}, { fallback: 'Wystapil blad' })).toBe('Wystapil blad');
  });
});
