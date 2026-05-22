import { afterEach, describe, expect, it, vi } from 'vitest';
import nextConfig, { buildCsp } from './next.config';

describe('next security headers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  const getCspDirective = (csp: string, directive: string) =>
    csp
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${directive} `)) ?? '';
  const getCspSources = (csp: string, directive: string) =>
    getCspDirective(csp, directive).split(/\s+/).slice(1);

  it('exposes baseline security headers contract for all routes', async () => {
    expect(typeof nextConfig.headers).toBe('function');
    const rules = await nextConfig.headers?.();
    const globalRule = rules?.find((rule) => rule.source === '/:path*');
    expect(globalRule).toBeTruthy();
    const headers = globalRule?.headers ?? [];
    const findHeader = (key: string) => headers.find((item) => item.key === key)?.value;

    expect(findHeader('Content-Security-Policy')).toContain("frame-ancestors 'none'");
    expect(findHeader('X-Frame-Options')).toBe('DENY');
    expect(findHeader('X-Content-Type-Options')).toBe('nosniff');
    expect(findHeader('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(findHeader('Permissions-Policy')).toContain('camera=()');
  });

  it('adds HSTS for production responses', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const rules = await nextConfig.headers?.();
    const headers = rules?.find((rule) => rule.source === '/:path*')?.headers ?? [];
    const hsts = headers.find((item) => item.key === 'Strict-Transport-Security')?.value;

    expect(hsts).toBe('max-age=31536000; includeSubDomains');
  });

  it('allows unsafe-eval only in development CSP and keeps production script policy renderable', () => {
    const devCsp = buildCsp('development');
    const prodCsp = buildCsp('production');

    expect(devCsp).toContain("'unsafe-eval'");
    expect(prodCsp).not.toContain("'unsafe-eval'");
    expect(devCsp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(prodCsp).toContain("script-src 'self' 'unsafe-inline'");
    expect(getCspDirective(prodCsp, 'script-src')).toContain("'unsafe-inline'");
    expect(getCspDirective(prodCsp, 'script-src')).not.toContain('sha256-');
    expect(devCsp).toContain("connect-src 'self' http: https: ws: wss:");
    expect(prodCsp).toContain("connect-src 'self' https://api.soar.luckysparrow.ch");
    expect(prodCsp).toContain("https://stage-api.soar.luckysparrow.ch");
    expect(getCspSources(prodCsp, 'connect-src')).not.toContain('https:');
    expect(getCspSources(prodCsp, 'connect-src')).not.toContain('ws:');
    expect(getCspSources(prodCsp, 'connect-src')).not.toContain('wss:');
  });
});
