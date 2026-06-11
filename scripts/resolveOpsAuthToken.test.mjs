import assert from 'node:assert/strict';
import test from 'node:test';

import {
  extractTokenFromSetCookie,
  readSetCookieHeaders,
  resolveOpsAuthToken,
} from './resolveOpsAuthToken.mjs';

test('extractTokenFromSetCookie returns decoded token cookie value', () => {
  const token = extractTokenFromSetCookie([
    'theme=dark; Path=/',
    'token=abc%20123%3D%3D; HttpOnly; SameSite=Lax',
  ]);

  assert.equal(token, 'abc 123==');
});

test('extractTokenFromSetCookie ignores missing and malformed cookie headers', () => {
  assert.equal(
    extractTokenFromSetCookie([null, '', 'session=abc; Path=/', 'token=; HttpOnly']),
    '',
  );
});

test('readSetCookieHeaders prefers getSetCookie when available', () => {
  const headers = {
    getSetCookie: () => ['token=first; HttpOnly', 'session=second; HttpOnly'],
    get: () => 'token=raw; HttpOnly',
  };

  assert.deepEqual(readSetCookieHeaders(headers), [
    'token=first; HttpOnly',
    'session=second; HttpOnly',
  ]);
});

test('resolveOpsAuthToken extracts login token from response set-cookie headers', async (t) => {
  const previousFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = previousFetch;
  });

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      headers: {
        getSetCookie: () => ['token=login-token%2Ffixture; HttpOnly; Path=/'],
      },
    };
  };

  const resolved = await resolveOpsAuthToken({
    baseUrl: ' https://api.example.test/ ',
    authEmail: 'ops@example.test',
    authPassword: 'fixture-password',
    contextLabel: 'test-ops-auth',
  });

  assert.deepEqual(resolved, {
    token: 'login-token/fixture',
    source: 'login',
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.example.test/auth/login');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    email: 'ops@example.test',
    password: 'fixture-password',
    remember: false,
  });
});
