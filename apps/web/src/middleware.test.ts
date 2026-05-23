import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { middleware } from './middleware';

const createDashboardRequest = (path: string, cookie = 'token=test-token') =>
  new NextRequest(new URL(path, 'https://soar.test'), {
    headers: {
      cookie,
    },
  });

describe('dashboard middleware', () => {
  it.each([
    '/dashboard/orders',
    '/dashboard/positions',
  ])('passes through legacy-removed %s routes for app-level handling', (path) => {
    const response = middleware(createDashboardRequest(path));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects unauthenticated legacy dashboard requests to login before legacy routing', () => {
    const response = middleware(createDashboardRequest('/dashboard/positions', ''));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://soar.test/auth/login');
  });
});
