import { beforeEach, describe, expect, it, vi } from 'vitest';
import { navigateWithFallback } from './navigation';

describe('navigateWithFallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    window.history.pushState({}, '', '/');
  });

  it('retries navigation when the browser stays on the auth route after the delay', () => {
    vi.useFakeTimers();
    vi.stubEnv('NODE_ENV', 'production');

    const router = {
      push: vi.fn(),
      replace: vi.fn(),
    };

    window.history.pushState({}, '', '/auth/login');

    navigateWithFallback(router, {
      href: '/dashboard',
      mode: 'replace',
      fallbackPrefix: '/auth/login',
      delayMs: 100,
    });

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenNthCalledWith(1, '/dashboard');

    vi.advanceTimersByTime(100);

    expect(router.replace).toHaveBeenCalledTimes(2);
    expect(router.replace).toHaveBeenNthCalledWith(2, '/dashboard');
  });

  it('does not retry when the browser already left the fallback route', () => {
    vi.useFakeTimers();
    vi.stubEnv('NODE_ENV', 'production');

    const router = {
      push: vi.fn(),
      replace: vi.fn(),
    };

    window.history.pushState({}, '', '/auth/register');

    navigateWithFallback(router, {
      href: '/dashboard',
      mode: 'replace',
      fallbackPrefix: '/auth/register',
      delayMs: 100,
    });

    window.history.pushState({}, '', '/dashboard');
    vi.advanceTimersByTime(100);

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/dashboard');
  });

  it('skips browser fallback retries in test mode', () => {
    vi.useFakeTimers();
    vi.stubEnv('NODE_ENV', 'test');

    const router = {
      push: vi.fn(),
      replace: vi.fn(),
    };

    window.history.pushState({}, '', '/auth/login');

    navigateWithFallback(router, {
      href: '/dashboard',
      mode: 'replace',
      fallbackPrefix: '/auth/login',
      delayMs: 100,
    });

    vi.advanceTimersByTime(100);

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/dashboard');
  });
});
