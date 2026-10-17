import { describe, expect, it } from 'vitest';
import { resolveBootstrapAdminPassword, resolveSeedAdminPassword } from './seedAdminPassword';

describe('seed admin password', () => {
  it('permits the documented local seed fallback', () => {
    expect(resolveSeedAdminPassword({ NODE_ENV: 'development' })).toBe('Admin12#$');
  });

  it('refuses a known or weak production seed credential', () => {
    expect(() => resolveSeedAdminPassword({ NODE_ENV: 'production' })).toThrow(/SEED_ADMIN_PASSWORD/);
    expect(() => resolveSeedAdminPassword({
      NODE_ENV: 'production',
      SEED_ADMIN_PASSWORD: 'Admin12#$',
    })).toThrow(/at least 12/);
  });

  it('accepts a sufficiently long production credential from the environment', () => {
    expect(resolveSeedAdminPassword({
      NODE_ENV: 'production',
      SEED_ADMIN_PASSWORD: 'provided-only-by-operator',
    })).toBe('provided-only-by-operator');
  });

  it('applies the same protection to snapshot import user creation', () => {
    expect(() => resolveBootstrapAdminPassword('SNAPSHOT_USER_PASSWORD', {
      NODE_ENV: 'production',
    })).toThrow(/SNAPSHOT_USER_PASSWORD/);
  });
});
