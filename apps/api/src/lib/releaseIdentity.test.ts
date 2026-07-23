import { describe, expect, it } from 'vitest';
import { readReleaseIdentity } from './releaseIdentity';

describe('readReleaseIdentity', () => {
  it('returns the full commit baked into the runtime image', () => {
    expect(readReleaseIdentity({
      SOURCE_COMMIT: 'ABCDEF0123456789ABCDEF0123456789ABCDEF01',
    })).toEqual({
      gitSha: 'abcdef0123456789abcdef0123456789abcdef01',
      source: 'image-build',
    });
  });

  it('fails closed for missing or abbreviated release identities', () => {
    expect(readReleaseIdentity({})).toEqual({ gitSha: null, source: 'unavailable' });
    expect(readReleaseIdentity({ SOURCE_COMMIT: 'abcdef0' })).toEqual({
      gitSha: null,
      source: 'unavailable',
    });
  });
});
