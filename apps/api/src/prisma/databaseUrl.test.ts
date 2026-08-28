import { describe, expect, it } from 'vitest';
import { resolvePrismaDatabaseUrl } from './databaseUrl';

describe('resolvePrismaDatabaseUrl', () => {
  it('adds bounded pool settings without dropping existing parameters', () => {
    const result = resolvePrismaDatabaseUrl(
      'postgresql://user:pass@db:5432/soar?schema=public',
      { PRISMA_CONNECTION_LIMIT: '5', PRISMA_POOL_TIMEOUT_SECONDS: '10' } as NodeJS.ProcessEnv,
    );

    const url = new URL(result as string);
    expect(url.searchParams.get('schema')).toBe('public');
    expect(url.searchParams.get('connection_limit')).toBe('5');
    expect(url.searchParams.get('pool_timeout')).toBe('10');
  });

  it('keeps explicit URL pool settings authoritative', () => {
    const result = resolvePrismaDatabaseUrl(
      'postgresql://user:pass@db:5432/soar?connection_limit=9&pool_timeout=20',
      { PRISMA_CONNECTION_LIMIT: '5', PRISMA_POOL_TIMEOUT_SECONDS: '10' } as NodeJS.ProcessEnv,
    );

    const url = new URL(result as string);
    expect(url.searchParams.get('connection_limit')).toBe('9');
    expect(url.searchParams.get('pool_timeout')).toBe('20');
  });

  it('leaves the URL unchanged when settings are absent or invalid', () => {
    const databaseUrl = 'postgresql://user:pass@db:5432/soar?schema=public';
    expect(resolvePrismaDatabaseUrl(databaseUrl, {} as NodeJS.ProcessEnv)).toBe(databaseUrl);
    expect(
      resolvePrismaDatabaseUrl(databaseUrl, {
        PRISMA_CONNECTION_LIMIT: '0',
        PRISMA_POOL_TIMEOUT_SECONDS: 'invalid',
      } as NodeJS.ProcessEnv),
    ).toBe(databaseUrl);
  });
});
