import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildOpsRequestHeaders,
  normalize,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';

test('normalize trims nullable and scalar values', () => {
  assert.equal(normalize('  token-value  '), 'token-value');
  assert.equal(normalize(null), '');
  assert.equal(normalize(undefined), '');
  assert.equal(normalize(12345), '12345');
});

test('buildOpsRequestHeaders trims bearer token and encodes cookie token', () => {
  assert.deepEqual(buildOpsRequestHeaders({ token: '  abc 123/+  ' }), {
    Authorization: 'Bearer abc 123/+',
    Cookie: 'token=abc%20123%2F%2B',
  });
});

test('buildOpsRequestHeaders prefers basic authorization while preserving token cookie', () => {
  const basicPayload = Buffer.from('ops-user:ops-pass', 'utf8').toString('base64');

  assert.deepEqual(
    buildOpsRequestHeaders({
      token: ' bearer-token ',
      opsBasicUser: ' ops-user ',
      opsBasicPassword: ' ops-pass ',
    }),
    {
      Authorization: `Basic ${basicPayload}`,
      Cookie: 'token=bearer-token',
    },
  );
});

test('buildOpsRequestHeaders attaches validated custom ops auth header', () => {
  assert.deepEqual(
    buildOpsRequestHeaders({
      opsAuthHeaderName: ' X-Ops-Auth ',
      opsAuthHeaderValue: ' local-fixture-value ',
    }),
    {
      'X-Ops-Auth': 'local-fixture-value',
    },
  );
});

test('resolveOpsAuthLayerOptions fails closed for partial or invalid auth layers', () => {
  assert.throws(
    () => resolveOpsAuthLayerOptions({ opsAuthHeaderName: 'X-Ops-Auth' }),
    /custom header requires both/,
  );
  assert.throws(
    () => resolveOpsAuthLayerOptions({ opsAuthHeaderValue: 'fixture-value' }),
    /custom header requires both/,
  );
  assert.throws(
    () =>
      resolveOpsAuthLayerOptions({
        opsAuthHeaderName: 'X Ops Auth',
        opsAuthHeaderValue: 'fixture-value',
      }),
    /invalid ops auth header name/,
  );
  assert.throws(
    () => resolveOpsAuthLayerOptions({ opsBasicUser: 'ops-user' }),
    /basic auth requires both/,
  );
  assert.throws(
    () => resolveOpsAuthLayerOptions({ opsBasicPassword: 'ops-pass' }),
    /basic auth requires both/,
  );
});

test('empty ops auth input produces no request headers', () => {
  assert.deepEqual(resolveOpsAuthLayerOptions(), {
    opsAuthHeaderName: '',
    opsAuthHeaderValue: '',
    opsBasicUser: '',
    opsBasicPassword: '',
  });
  assert.deepEqual(buildOpsRequestHeaders(), {});
});
