import { describe, expect, it } from 'vitest';
import { inferApiBaseUrlFromLocation } from './publicApiBaseUrl';

describe('inferApiBaseUrlFromLocation', () => {
  it('infers prod api host from soar web host', () => {
    expect(
      inferApiBaseUrlFromLocation({
        hostname: 'soar.luckysparrow.ch',
        protocol: 'https:',
      }),
    ).toBe('https://api.soar.luckysparrow.ch');
  });

  it('infers stage api host from stage web host', () => {
    expect(
      inferApiBaseUrlFromLocation({
        hostname: 'stage.soar.luckysparrow.ch',
        protocol: 'https:',
      }),
    ).toBe('https://stage-api.soar.luckysparrow.ch');
  });

  it('returns undefined for localhost', () => {
    expect(
      inferApiBaseUrlFromLocation({
        hostname: 'localhost',
        protocol: 'http:',
      }),
    ).toBeUndefined();
  });

  it('returns undefined for unsupported hostnames', () => {
    expect(
      inferApiBaseUrlFromLocation({
        hostname: 'example.com',
        protocol: 'https:',
      }),
    ).toBeUndefined();
  });
});
