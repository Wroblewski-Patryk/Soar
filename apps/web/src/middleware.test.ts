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
    ['/dashboard/exchanges', 'https://soar.test/dashboard/profile#api'],
    ['/dashboard/orders', 'https://soar.test/dashboard/bots/runtime?legacy=orders'],
    ['/dashboard/positions', 'https://soar.test/dashboard/bots/runtime?legacy=positions'],
  ])('redirects authenticated legacy route %s to its canonical route', (path, location) => {
    const response = middleware(createDashboardRequest(path));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(location);
  });

  it('redirects unauthenticated legacy dashboard requests to login before legacy routing', () => {
    const response = middleware(createDashboardRequest('/dashboard/positions', ''));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://soar.test/auth/login');
  });
});
