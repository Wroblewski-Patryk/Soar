import { describe, expect, it } from 'vitest';
import { resolveIsolatedTestDatabaseUrl } from './testDatabaseUrl';

describe('isolated API test database', () => {
  it('derives a separate local database without exposing its password', () => {
    expect(resolveIsolatedTestDatabaseUrl({
      runtimeUrl: 'postgresql://user:secret@localhost:5432/soar?schema=public',
    })).toBe('postgresql://user:secret@localhost:5432/soar_test?schema=public');
  });

  it('rejects remote production URLs and the runtime database itself', () => {
    expect(() => resolveIsolatedTestDatabaseUrl({
      runtimeUrl: 'postgresql://user:secret@prod.example/soar',
    })).toThrow(/TEST_DATABASE_URL/);
    expect(() => resolveIsolatedTestDatabaseUrl({
      runtimeUrl: 'postgresql://user:secret@localhost/soar',
      explicitTestUrl: 'postgresql://user:secret@localhost/soar',
    })).toThrow(/separate database/);
  });

  it('requires the explicit test database to carry a test suffix', () => {
    expect(() => resolveIsolatedTestDatabaseUrl({
      runtimeUrl: 'postgresql://user:secret@localhost/soar',
      explicitTestUrl: 'postgresql://user:secret@localhost/other',
    })).toThrow(/_test/);
  });

  it('accepts a standalone explicit test URL in CI', () => {
    expect(resolveIsolatedTestDatabaseUrl({
      runtimeUrl: undefined,
      explicitTestUrl: 'postgresql://user:secret@postgres/soar_test',
    })).toBe('postgresql://user:secret@postgres/soar_test');
  });
});
