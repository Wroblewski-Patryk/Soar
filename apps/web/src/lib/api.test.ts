import { beforeEach, describe, expect, it, vi } from 'vitest';

type InterceptorHandlers = {
  onFulfilled?: (value: unknown) => unknown;
  onRejected?: (error: unknown) => unknown;
};

const interceptorHandlers: InterceptorHandlers = {};

vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: {
        response: {
          use: (onFulfilled: InterceptorHandlers['onFulfilled'], onRejected: InterceptorHandlers['onRejected']) => {
            interceptorHandlers.onFulfilled = onFulfilled;
            interceptorHandlers.onRejected = onRejected;
          },
        },
      },
    }),
  },
}));

vi.mock('./publicApiBaseUrl', () => ({
  resolvePublicApiBaseUrl: () => 'https://api.soar.luckysparrow.ch',
}));

describe('api auth-me interceptor', async () => {
  const originalWindowLocation = window.location;
  const replace = vi.fn();

  const { __apiInternals } = await import('./api');

  beforeEach(() => {
    vi.clearAllMocks();
    __apiInternals.resetForTests();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalWindowLocation,
        pathname: '/dashboard',
        replace,
      },
    });
  });

  it('redirects protected routes to expired-session login on 401 auth/me', async () => {
    await expect(
      interceptorHandlers.onRejected?.({
        config: { url: '/auth/me' },
        response: { status: 401 },
      })
    ).rejects.toEqual(
      expect.objectContaining({
        response: { status: 401 },
      })
    );

    expect(replace).toHaveBeenCalledWith('/auth/login?session=expired');
  });

  it('does not treat 429 auth/me as expired session redirect', async () => {
    await expect(
      interceptorHandlers.onRejected?.({
        config: { url: '/auth/me' },
        response: { status: 429 },
      })
    ).rejects.toEqual(
      expect.objectContaining({
        response: { status: 429 },
      })
    );

    expect(replace).not.toHaveBeenCalled();
  });

  it('falls back home only after repeated backend failures on protected auth/me', async () => {
    const backendError = {
      config: { url: '/auth/me' },
      response: { status: 503 },
      code: 'ERR_BAD_RESPONSE',
    };

    await expect(interceptorHandlers.onRejected?.(backendError)).rejects.toEqual(backendError);
    await expect(interceptorHandlers.onRejected?.(backendError)).rejects.toEqual(backendError);
    expect(replace).not.toHaveBeenCalled();

    await expect(interceptorHandlers.onRejected?.(backendError)).rejects.toEqual(backendError);
    expect(replace).toHaveBeenCalledWith('/');
  });
});
