import { describe, expect, it } from 'vitest';
import {
  REMEMBER_ME_JWT_EXPIRES_IN,
  REMEMBER_ME_TTL_MS,
  SESSION_JWT_EXPIRES_IN,
  SESSION_TTL_MS,
  getSessionJwtExpiresIn,
  getSessionTtlMs,
} from './auth.session';

describe('auth.session', () => {
  it('uses the standard session lifetime when remember me is disabled or omitted', () => {
    expect(getSessionTtlMs()).toBe(SESSION_TTL_MS);
    expect(getSessionJwtExpiresIn()).toBe(SESSION_JWT_EXPIRES_IN);

    expect(getSessionTtlMs(false)).toBe(SESSION_TTL_MS);
    expect(getSessionJwtExpiresIn(false)).toBe(SESSION_JWT_EXPIRES_IN);
  });

  it('uses the extended lifetime when remember me is enabled', () => {
    expect(getSessionTtlMs(true)).toBe(REMEMBER_ME_TTL_MS);
    expect(getSessionJwtExpiresIn(true)).toBe(REMEMBER_ME_JWT_EXPIRES_IN);
  });
});
