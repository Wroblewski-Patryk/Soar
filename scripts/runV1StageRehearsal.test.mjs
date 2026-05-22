import assert from 'node:assert/strict';
import test from 'node:test';

import { buildReleaseGateInvocation, parseArgs } from './runV1StageRehearsal.mjs';

test('rejects secret-bearing CLI flags for stage rehearsal', () => {
  assert.throws(
    () => parseArgs(['--auth-token', 'secret-token']),
    /--auth-token is secret-bearing/
  );
  assert.throws(
    () => parseArgs(['--auth-password', 'secret-password']),
    /--auth-password is secret-bearing/
  );
  assert.throws(
    () => parseArgs(['--ops-basic-password', 'secret-password']),
    /--ops-basic-password is secret-bearing/
  );
  assert.throws(
    () => parseArgs(['--ops-auth-header-value', 'secret-header']),
    /--ops-auth-header-value is secret-bearing/
  );
});

test('passes protected stage rehearsal credentials through env, not child argv or artifact command', () => {
  const invocation = buildReleaseGateInvocation({
    stamp: '2026-05-21Tsecure-stage',
    baseUrl: 'https://stage-api.example.test',
    webBaseUrl: 'https://stage.example.test',
    authToken: 'secret-token',
    authEmail: 'admin@example.test',
    authPassword: 'secret-password',
    opsBasicUser: 'ops-user',
    opsBasicPassword: 'secret-basic-password',
    opsAuthHeaderName: 'X-Ops-Secret',
    opsAuthHeaderValue: 'secret-header-value',
    dryRun: false,
  });

  assert.equal(invocation.args.includes('--auth-token'), false);
  assert.equal(invocation.args.includes('--auth-password'), false);
  assert.equal(invocation.args.includes('--ops-basic-password'), false);
  assert.equal(invocation.args.includes('--ops-auth-header-value'), false);
  assert.equal(invocation.command.includes('secret-token'), false);
  assert.equal(invocation.command.includes('secret-password'), false);
  assert.equal(invocation.command.includes('secret-basic-password'), false);
  assert.equal(invocation.command.includes('secret-header-value'), false);
  assert.equal(invocation.childEnv.RELEASE_GATE_AUTH_TOKEN, 'secret-token');
  assert.equal(invocation.childEnv.RELEASE_GATE_AUTH_PASSWORD, 'secret-password');
  assert.equal(invocation.childEnv.RELEASE_GATE_OPS_BASIC_PASSWORD, 'secret-basic-password');
  assert.equal(invocation.childEnv.RELEASE_GATE_OPS_AUTH_HEADER_VALUE, 'secret-header-value');
});
