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

  it('can enforce an auth IP bucket across rotated emails', async () => {
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    process.env.RATE_LIMIT_ALLOW_LOCAL_FALLBACK = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, keyScope: 'ip' });

    const firstReq = makeRequest({ method: 'POST', baseUrl: '/auth', path: '/login', body: { email: 'a@test.com' } });
    const firstRes = makeResponse();
    const firstNext = vi.fn();
    await limiter(firstReq, firstRes, firstNext);
    expect(firstNext).toHaveBeenCalledTimes(1);

    const secondReq = makeRequest({ method: 'POST', baseUrl: '/auth', path: '/login', body: { email: 'b@test.com' } });
    const secondRes = makeResponse();
    const secondNext = vi.fn();
    await limiter(secondReq, secondRes, secondNext);
    expect(secondNext).not.toHaveBeenCalled();
    expect(secondRes.status).toHaveBeenCalledWith(429);
  });

  it('uses one named IP bucket across changing grant IDs', async () => {
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, keyScope: 'ip',
      bucketId: 'external-client-grant-self-status' });
    const first = makeRequest({ baseUrl: '/external-client/grants', path: '/one/status' });
    const second = makeRequest({ baseUrl: '/external-client/grants', path: '/two/status' });
    const next = vi.fn();
    await limiter(first, makeResponse(), next);
    const response = makeResponse();
    await limiter(second, response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(429);
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
  it('keys external order requests by a hash of their order grant secret', () => {
    const first = __rateLimitInternals.resolveRateLimitSubject(makeRequest({
      headers: { authorization: `Bearer soar_ext_${'A'.repeat(43)}` },
    }), 'order_grant');
    const second = __rateLimitInternals.resolveRateLimitSubject(makeRequest({
      headers: { authorization: `Bearer soar_ext_${'B'.repeat(43)}` },
    }), 'order_grant');
    expect(first).toMatch(/^order-grant:[a-f0-9]{64}$/);
    expect(first).not.toBe(second);
    expect(__rateLimitInternals.resolveRateLimitSubject(makeRequest(), 'order_grant'))
      .toBe('ip:127.0.0.1');
  });
  it('keeps order-grant shared-store limits closed in enabled test mode', async () => {
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 10,
      keyScope: 'order_grant', requireSharedStore: true, sharedStoreTimeoutMs: 25 });
    const response = makeResponse();
    const next = vi.fn();
    await limiter(makeRequest({ headers: {
      authorization: `Bearer soar_ext_${'A'.repeat(43)}`,
    } }), response, next);
    expect(response.status).toHaveBeenCalledWith(503);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('rate limit degradation policy', () => {
  it('times out a pending shared-store connection, then accepts its recovery', async () => {
    process.env.NODE_ENV = 'test';
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    let release!: (client: any) => void;
    const pending = new Promise<any>((resolve) => { release = resolve; });
    __rateLimitInternals.setGetRedisClientForTests(() => pending);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 60,
      keyScope: 'read_grant', requireSharedStore: true, sharedStoreTimeoutMs: 25 });
    const req = makeRequest({ headers: { authorization: `Bearer soar_read_${'A'.repeat(43)}` } });
    const response = makeResponse();
    const next = vi.fn();
    const startedAt = Date.now();
    await limiter(req, response, next);
    expect(Date.now() - startedAt).toBeLessThan(1000);
    expect(response.status).toHaveBeenCalledWith(503);
    expect(next).not.toHaveBeenCalled();
    release({ eval: async () => [1, 60_000] });
    await limiter(req, makeResponse(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('times out a pending shared-store eval without falling back to memory', async () => {
    process.env.NODE_ENV = 'test';
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    const client = { eval: vi.fn()
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValue([1, 60_000]) } as any;
    __rateLimitInternals.setGetRedisClientForTests(async () => client);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 60,
      keyScope: 'read_grant', requireSharedStore: true, sharedStoreTimeoutMs: 25 });
    const req = makeRequest({ headers: { authorization: `Bearer soar_read_${'B'.repeat(43)}` } });
    const response = makeResponse();
    const next = vi.fn();
    await limiter(req, response, next);
    expect(response.status).toHaveBeenCalledWith(503);
    expect(next).not.toHaveBeenCalled();
    await limiter(req, makeResponse(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('keeps a shared-store-only public grant limit closed when local fallback is enabled', async () => {
    process.env.NODE_ENV = 'production';
    process.env.RATE_LIMIT_ALLOW_LOCAL_FALLBACK = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const limiter = createRateLimiter({ windowMs: 60_000, max: 60,
      keyScope: 'read_grant', requireSharedStore: true });
    const req = makeRequest({ headers: { authorization: `Bearer soar_read_${'A'.repeat(43)}` } });
    const response = makeResponse();
    const next = vi.fn();
    await limiter(req, response, next);
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.__headers.get('X-RateLimit-Degraded')).toBe('redis_unavailable');
  });

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
