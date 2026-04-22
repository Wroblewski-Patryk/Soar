import { afterEach, describe, expect, it, vi } from 'vitest';
import { Request } from 'express';
import { __rateLimitInternals, createRateLimiter } from './rateLimit';

const makeRequest = (overrides: Partial<Request> = {}) =>
  ({
    method: 'GET',
    baseUrl: '/dashboard',
    path: '/orders',
    headers: {},
    query: {},
    params: {},
    body: {},
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  }) as Request;

const makeResponse = () => {
  const headers = new Map<string, string>();
  return {
    statusCode: 200,
    body: null as unknown,
    setHeader: vi.fn((name: string, value: string) => {
      headers.set(name, value);
    }),
    status: vi.fn(function (this: any, code: number) {
      this.statusCode = code;
      return this;
    }),
    json: vi.fn(function (this: any, payload: unknown) {
      this.body = payload;
      return this;
    }),
    __headers: headers,
  } as any;
};

afterEach(() => {
  delete process.env.RATE_LIMIT_ENABLE_TEST_MODE;
  delete process.env.RATE_LIMIT_ALLOW_LOCAL_FALLBACK;
  process.env.NODE_ENV = 'test';
  __rateLimitInternals.resetForTests();
});

describe('rate limit identity resolution', () => {
  it('uses auth email when keyScope=auth', () => {
    const req = makeRequest({
      body: { email: 'User@Test.com' },
    });
    const subject = __rateLimitInternals.resolveRateLimitSubject(req, 'auth');
    expect(subject).toBe('auth:user@test.com');
  });

  it('uses user id for authenticated dashboard requests', () => {
    const req = makeRequest({
      user: { id: 'user-123', email: 'u@test.com', role: 'USER' },
    });
    const subject = __rateLimitInternals.resolveRateLimitSubject(req, 'user');
    expect(subject).toBe('user:user-123');
  });

  it('uses exchange+apiKey fingerprint scope for key tests', () => {
    const req = makeRequest({
      user: { id: 'user-999', email: 'u@test.com', role: 'USER' },
      body: { exchange: 'BINANCE', apiKey: 'abc123-secret-key' },
    });
    const subject = __rateLimitInternals.resolveRateLimitSubject(req, 'user_exchange');
    expect(subject).toContain('user:user-999:exchange:binance:key:hash:');
    expect(subject.endsWith('hash:abc123-secret-key')).toBe(false);
  });
});

describe('rate limit degradation policy', () => {
  it('fails closed in production when redis is unavailable', async () => {
    process.env.NODE_ENV = 'production';
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 2, keyScope: 'user' });
    const req = makeRequest({
      user: { id: 'user-prod', email: 'prod@test.com', role: 'USER' },
    });
    const res = makeResponse();
    const next = vi.fn();

    await limiter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.__headers.get('X-RateLimit-Degraded')).toBe('redis_unavailable');
  });

  it('keeps local fallback in test/dev-style environments when explicitly allowed', async () => {
    process.env.NODE_ENV = 'test';
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, keyScope: 'user' });
    const req = makeRequest({
      user: { id: 'user-dev', email: 'dev@test.com', role: 'USER' },
    });
    const nextFirst = vi.fn();
    const resFirst = makeResponse();

    await limiter(req, resFirst, nextFirst);

    expect(nextFirst).toHaveBeenCalledTimes(1);

    const nextSecond = vi.fn();
    const resSecond = makeResponse();
    await limiter(req, resSecond, nextSecond);

    expect(nextSecond).not.toHaveBeenCalled();
    expect(resSecond.status).toHaveBeenCalledWith(429);
  });
});
