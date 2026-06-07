import { describe, expect, it } from 'vitest';

import { parseEnvDate } from './runtimeFreshness';

describe('runtime freshness environment date parsing', () => {
  it('accepts trimmed ISO timestamps and rejects blank or malformed values', () => {
    expect(parseEnvDate(' 2026-06-06T22:16:06.802Z ')).toBe(
      Date.parse('2026-06-06T22:16:06.802Z')
    );
    expect(parseEnvDate(undefined)).toBeNull();
    expect(parseEnvDate('   ')).toBeNull();
    expect(parseEnvDate('not-a-date')).toBeNull();
  });
});
