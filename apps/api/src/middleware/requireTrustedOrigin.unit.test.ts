import { NextFunction, Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { requireTrustedOrigin } from './requireTrustedOrigin';

const originalCookieSameSite = process.env.COOKIE_SAME_SITE;
const originalClientUrl = process.env.CLIENT_URL;
const originalServerUrl = process.env.SERVER_URL;
const originalCorsOrigins = process.env.CORS_ORIGINS;

const restoreEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

const makeRequest = (overrides: Partial<Request> = {}) =>
  ({
    method: 'POST',
    headers: {},
    cookies: {},
    ...overrides,
  }) as Request;

const makeResponse = () =>
  ({
    status: vi.fn(function (this: Response, _code: number) {
      return this;
    }),
    json: vi.fn(function (this: Response) {
      return this;
    }),
  }) as unknown as Response;

afterEach(() => {
  restoreEnv('COOKIE_SAME_SITE', originalCookieSameSite);
  restoreEnv('CLIENT_URL', originalClientUrl);
  restoreEnv('SERVER_URL', originalServerUrl);
  restoreEnv('CORS_ORIGINS', originalCorsOrigins);
  vi.restoreAllMocks();
});

describe('requireTrustedOrigin unit guard', () => {
  it('does not require an origin for non-cookie bearer-token state changes', () => {
    process.env.COOKIE_SAME_SITE = 'none';
    const req = makeRequest({
      headers: {
        authorization: 'Bearer token-value',
      },
    });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    requireTrustedOrigin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('fails closed for cookie-backed state changes without origin when SameSite=None', () => {
    process.env.COOKIE_SAME_SITE = 'none';
    const req = makeRequest({
      cookies: {
        token: 'cookie-token',
      },
    });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    requireTrustedOrigin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Origin header required for state-changing requests',
      },
    });
  });

  it('rejects untrusted origin before a cookie-backed write can continue', () => {
    process.env.COOKIE_SAME_SITE = 'lax';
    process.env.CLIENT_URL = 'https://soar.example.com';
    const req = makeRequest({
      headers: {
        origin: 'https://evil.example.com',
      },
      cookies: {
        token: 'cookie-token',
      },
    });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    requireTrustedOrigin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Untrusted origin',
      },
    });
  });
});
