import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPreflightReport,
  evaluatePrerequisiteGroups,
  runBuildInfoWait,
  runPublicSmoke,
} from './runV1FinalPreflight.mjs';

const requiredStatus = (env) =>
  Object.fromEntries(evaluatePrerequisiteGroups(env).required.map((group) => [group.key, group.ok]));

const optionalStatus = (env) =>
  Object.fromEntries(evaluatePrerequisiteGroups(env).optional.map((group) => [group.key, group.ok]));

test('evaluatePrerequisiteGroups fails closed when production secrets are absent', () => {
  assert.deepEqual(requiredStatus({}), {
    'liveimport auth': false,
    'rollback guard auth': false,
    'production DB restore context': false,
  });
});

test('evaluatePrerequisiteGroups accepts token or email/password auth alternatives', () => {
  assert.equal(requiredStatus({ LIVEIMPORT_READBACK_AUTH_TOKEN: 'present' })['liveimport auth'], true);
  assert.equal(
    requiredStatus({
      LIVEIMPORT_READBACK_AUTH_EMAIL: 'ops@example.com',
      LIVEIMPORT_READBACK_AUTH_PASSWORD: 'present',
    })['liveimport auth'],
    true,
  );
  assert.equal(
    requiredStatus({
      LIVEIMPORT_READBACK_AUTH_EMAIL: 'ops@example.com',
    })['liveimport auth'],
    false,
  );

  assert.equal(requiredStatus({ ROLLBACK_GUARD_AUTH_TOKEN: 'present' })['rollback guard auth'], true);
  assert.equal(
    requiredStatus({
      ROLLBACK_GUARD_AUTH_EMAIL: 'ops@example.com',
      ROLLBACK_GUARD_AUTH_PASSWORD: 'present',
    })['rollback guard auth'],
    true,
  );
});

test('evaluatePrerequisiteGroups accepts either production DB env family', () => {
  assert.equal(
    requiredStatus({
      PROD_DB_CHECK_CONTAINER: 'postgres',
      PROD_DB_CHECK_USER: 'postgres',
      PROD_DB_CHECK_NAME: 'soar',
    })['production DB restore context'],
    true,
  );
  assert.equal(
    requiredStatus({
      PRODUCTION_DB_CHECK_CONTAINER: 'postgres',
      PRODUCTION_DB_CHECK_USER: 'postgres',
      PRODUCTION_DB_CHECK_NAME: 'soar',
    })['production DB restore context'],
    true,
  );
  assert.equal(
    requiredStatus({
      PROD_DB_CHECK_CONTAINER: 'postgres',
      PROD_DB_CHECK_USER: 'postgres',
    })['production DB restore context'],
    false,
  );
});

test('evaluatePrerequisiteGroups reports optional OPS auth layers separately', () => {
  assert.deepEqual(optionalStatus({}), {
    'liveimport private OPS layer': false,
    'rollback private OPS layer': false,
  });
  assert.equal(
    optionalStatus({
      LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME: 'X-Ops',
      LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE: 'present',
    })['liveimport private OPS layer'],
    true,
  );
  assert.equal(
    optionalStatus({
      ROLLBACK_GUARD_OPS_BASIC_USER: 'ops',
      ROLLBACK_GUARD_OPS_BASIC_PASSWORD: 'present',
    })['rollback private OPS layer'],
    true,
  );
});

test('runBuildInfoWait can be skipped for local preflight tests', () => {
  assert.deepEqual(runBuildInfoWait({ skipBuildInfo: true }), {
    ok: true,
    skipped: true,
  });
});

test('runPublicSmoke can be skipped for local preflight tests', () => {
  assert.deepEqual(runPublicSmoke({ skipPublicSmoke: true }), {
    ok: true,
    skipped: true,
  });
});

test('buildPreflightReport exposes readiness without secret values', () => {
  const prerequisites = evaluatePrerequisiteGroups({
    LIVEIMPORT_READBACK_AUTH_TOKEN: 'super-secret-token',
    ROLLBACK_GUARD_AUTH_EMAIL: 'ops@example.com',
    ROLLBACK_GUARD_AUTH_PASSWORD: 'super-secret-password',
    PROD_DB_CHECK_CONTAINER: 'postgres',
    PROD_DB_CHECK_USER: 'postgres',
    PROD_DB_CHECK_NAME: 'soar',
  });
  const report = buildPreflightReport({
    options: {
      apiBaseUrl: 'https://api.example.com',
      webBaseUrl: 'https://web.example.com',
      expectedSha: 'abc123',
      today: '2026-05-08',
      skipBuildInfo: true,
    },
    buildInfo: { ok: true, skipped: true },
    publicSmoke: { ok: true, skipped: true },
    prerequisites,
    evidence: {
      evidence: [
        {
          key: 'liveImportReadback',
          label: 'LIVEIMPORT-03 runtime readback',
          state: 'missing',
          required: true,
          reason: 'no matching artifact found',
          path: null,
          date: null,
        },
      ],
    },
    blockers: ['evidence:liveImportReadback:missing'],
  });

  assert.equal(report.status, 'blocked');
  assert.equal(report.buildInfo.state, 'skipped');
  assert.equal(report.prerequisites.required.find((group) => group.key === 'liveimport auth')?.ok, true);
  const serialized = JSON.stringify(report);
  assert.equal(serialized.includes('super-secret-token'), false);
  assert.equal(serialized.includes('super-secret-password'), false);
});
