import jwt from 'jsonwebtoken';
import { afterEach, describe, expect, it } from 'vitest';
import { getCandidateTokensFromRequest, getVerifiedAuthTokenCandidates } from './sessionToken';
import { Request } from 'express';

const originalJwtSecret = process.env.JWT_SECRET;
const originalJwtSecretPrevious = process.env.JWT_SECRET_PREVIOUS;
const originalJwtSecretPreviousUntil = process.env.JWT_SECRET_PREVIOUS_UNTIL;

const restoreEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

const makeRequest = (overrides: Partial<Request> = {}) =>
  ({
    headers: {},
    cookies: {},
    ...overrides,
  }) as Request;

const signCandidate = (payload: Record<string, unknown>, options: { expiresIn?: '1h' } = { expiresIn: '1h' }) =>
  jwt.sign(payload, 'session-token-secret', {
    ...(options.expiresIn ? { expiresIn: options.expiresIn } : {}),
    algorithm: 'HS256',
    issuer: 'cryptosparrow',
    audience: 'cryptosparrow-app',
  });

afterEach(() => {
  restoreEnv('JWT_SECRET', originalJwtSecret);
  restoreEnv('JWT_SECRET_PREVIOUS', originalJwtSecretPrevious);
  restoreEnv('JWT_SECRET_PREVIOUS_UNTIL', originalJwtSecretPreviousUntil);
});

describe('session token candidates', () => {
  it('extracts bearer and cookie tokens without duplicating the same token', () => {
    const req = makeRequest({
      headers: {
        authorization: 'Bearer shared-token',
        cookie: 'token=shared-token; token=older-token',
      },
      cookies: {
        token: 'parsed-token',
      },
    });

    expect(getCandidateTokensFromRequest(req)).toEqual(['shared-token', 'parsed-token', 'older-token']);
  });

  it('rejects signed candidates that are missing required session claims', () => {
    process.env.JWT_SECRET = 'session-token-secret';
    delete process.env.JWT_SECRET_PREVIOUS;
    delete process.env.JWT_SECRET_PREVIOUS_UNTIL;
    const token = signCandidate({
      userId: 'user-1',
      email: 'user@example.com',
      role: 'ROOT',
      sessionVersion: 1,
    });

    const req = makeRequest({
      cookies: {
        token,
      },
    });

    expect(getVerifiedAuthTokenCandidates(req)).toEqual([]);
  });

  it('orders valid duplicate-session candidates by newest issued-at claim', () => {
    process.env.JWT_SECRET = 'session-token-secret';
    delete process.env.JWT_SECRET_PREVIOUS;
    delete process.env.JWT_SECRET_PREVIOUS_UNTIL;
    const older = signCandidate({
      userId: 'older-user',
      email: 'older@example.com',
      role: 'USER',
      sessionVersion: 1,
      iat: 100,
    }, {});
    const newer = signCandidate({
      userId: 'newer-user',
      email: 'newer@example.com',
      role: 'USER',
      sessionVersion: 1,
      iat: 200,
    }, {});

    const req = makeRequest({
      headers: {
        cookie: `token=${encodeURIComponent(older)}; token=${encodeURIComponent(newer)}`,
      },
    });

    expect(getVerifiedAuthTokenCandidates(req).map((candidate) => candidate.claims.userId)).toEqual([
      'newer-user',
      'older-user',
    ]);
  });
});
