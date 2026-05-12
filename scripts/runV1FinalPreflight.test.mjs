import test from 'node:test';
import assert from 'node:assert/strict';

import {
  annotatePrerequisitesForEvidence,
  buildBlockerDetails,
  buildPreflightReport,
  buildPrerequisiteBlockers,
  buildRemediationHints,
  evaluatePrerequisiteGroups,
  renderPreflightMarkdown,
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
    'production UI dashboard auth': false,
    'production UI admin auth': false,
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

  assert.equal(
    requiredStatus({ PROD_UI_AUDIT_AUTH_TOKEN: 'present' })['production UI dashboard auth'],
    true,
  );
  assert.equal(
    requiredStatus({
      PROD_UI_AUDIT_AUTH_EMAIL: 'ops@example.com',
      PROD_UI_AUDIT_AUTH_PASSWORD: 'present',
    })['production UI dashboard auth'],
    true,
  );
  assert.equal(
    requiredStatus({ PROD_UI_AUDIT_ADMIN_TOKEN: 'present' })['production UI admin auth'],
    true,
  );
  assert.equal(
    requiredStatus({
      PROD_UI_AUDIT_ADMIN_EMAIL: 'admin@example.com',
      PROD_UI_AUDIT_ADMIN_PASSWORD: 'present',
    })['production UI admin auth'],
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

test('annotatePrerequisitesForEvidence accepts fresh restore evidence for the DB restore context', () => {
  const prerequisites = annotatePrerequisitesForEvidence(evaluatePrerequisiteGroups({}), {
    evidence: [
      {
        key: 'backupRestoreDrill',
        label: 'backup/restore drill evidence',
        state: 'fresh',
        required: true,
        reason: 'fresh PASS artifact found',
        path: 'docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md',
        date: '2026-05-08',
      },
    ],
  });

  const dbRestoreContext = prerequisites.required.find(
    (group) => group.key === 'production DB restore context'
  );

  assert.equal(dbRestoreContext?.ok, false);
  assert.equal(dbRestoreContext?.satisfiedByEvidence, true);
  assert.equal(dbRestoreContext?.blocking, false);
  assert.deepEqual(buildPrerequisiteBlockers(prerequisites), [
    'env:liveimport auth',
    'env:rollback guard auth',
    'env:production UI dashboard auth',
    'env:production UI admin auth',
  ]);
});

test('runBuildInfoWait can be skipped for local preflight tests', () => {
  assert.deepEqual(runBuildInfoWait({ skipBuildInfo: true }), {
    ok: true,
    skipped: true,
  });
});

test('runBuildInfoWait invokes the bundled node build-info script directly', () => {
  const calls = [];
  const result = runBuildInfoWait(
    {
      webBaseUrl: 'https://web.example.com',
      expectedSha: 'abc123',
      timeoutSeconds: 30,
      intervalSeconds: 5,
    },
    (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0, stdout: 'ok', stderr: '' };
    },
  );

  assert.equal(result.ok, true);
  assert.equal(calls[0]?.command, process.execPath);
  assert.match(calls[0]?.args[0] ?? '', /waitForWebBuildInfo\.mjs$/);
  assert.deepEqual(calls[0]?.args.slice(1), [
    '--web-base-url',
    'https://web.example.com',
    '--expected-sha',
    'abc123',
    '--timeout-seconds',
    '30',
    '--interval-seconds',
    '5',
  ]);
});

test('runPublicSmoke can be skipped for local preflight tests', () => {
  assert.deepEqual(runPublicSmoke({ skipPublicSmoke: true }), {
    ok: true,
    skipped: true,
  });
});

test('runPublicSmoke invokes the bundled node deploy smoke script directly', () => {
  const calls = [];
  const result = runPublicSmoke(
    {
      apiBaseUrl: 'https://api.example.com',
      webBaseUrl: 'https://web.example.com',
    },
    (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0, stdout: 'ok', stderr: '' };
    },
  );

  assert.equal(result.ok, true);
  assert.equal(calls[0]?.command, process.execPath);
  assert.match(calls[0]?.args[0] ?? '', /deploySmokeCheck\.mjs$/);
  assert.deepEqual(calls[0]?.args.slice(1), [
    '--api-base-url',
    'https://api.example.com',
    '--web-base-url',
    'https://web.example.com',
    '--no-workers',
  ]);
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
  assert.equal(report.blockerDetails[0]?.category, 'release_evidence');
  assert.equal(report.blockerDetails[0]?.finalEvidenceRequired, true);
  assert.equal(report.remediation[0]?.blocker, 'evidence:liveImportReadback:missing');
  assert.equal(serialized.includes('LIVEIMPORT_READBACK_AUTH_TOKEN'), true);
});

test('buildRemediationHints maps known final V1 blockers to existing commands', () => {
  const hints = buildRemediationHints([
    'env:liveimport auth',
    'env:production UI dashboard auth',
    'env:production UI admin auth',
    'env:production DB restore context',
    'evidence:prodUiClickthrough:missing',
    'evidence:prodUiClickthrough:stale',
    'evidence:rcSignoffRecord:failed',
    'evidence:rollbackProof:failed',
    'unknown:blocker',
  ]);

  assert.deepEqual(
    hints.map((hint) => hint.blocker),
    [
      'env:liveimport auth',
      'env:production UI dashboard auth',
      'env:production UI admin auth',
      'env:production DB restore context',
      'evidence:prodUiClickthrough:missing',
      'evidence:prodUiClickthrough:stale',
      'evidence:rcSignoffRecord:failed',
      'evidence:rollbackProof:failed',
    ],
  );
  assert.match(hints[0].command, /ops:liveimport:readback/);
  assert.match(hints[1].command, /ops:ui:prod-clickthrough/);
  assert.match(hints[2].command, /ops:ui:prod-clickthrough/);
  assert.match(hints[3].command, /ops:db:restore-drill:prod/);
  assert.match(hints[4].command, /ops:ui:prod-clickthrough/);
  assert.match(hints[5].command, /ops:ui:prod-clickthrough/);
  assert.match(hints[6].command, /ops:rc:signoff:build/);
  assert.match(hints[7].command, /ops:deploy:rollback-proof/);
  const serialized = JSON.stringify(hints);
  assert.equal(serialized.includes('super-secret'), false);
});

test('buildRemediationHints uses node-based public deploy checks', () => {
  const hints = buildRemediationHints(['build-info', 'public-smoke']);

  assert.match(hints[0]?.command ?? '', /node scripts\/waitForWebBuildInfo\.mjs/);
  assert.match(hints[1]?.command ?? '', /node scripts\/deploySmokeCheck\.mjs/);
  assert.equal(JSON.stringify(hints).includes('pnpm run ops:deploy'), false);
});

test('buildBlockerDetails exposes stable categories for Web/operator status', () => {
  const details = buildBlockerDetails([
    'build-info',
    'public-smoke',
    'env:liveimport auth',
    'env:production UI dashboard auth',
    'evidence:prodUiClickthrough:failed',
    'evidence:prodUiClickthrough:stale',
    'evidence:rcSignoffRecord:failed',
    'evidence:liveImportReadback:missing',
    'custom:blocker',
  ]);

  assert.deepEqual(
    details.map((detail) => detail.category),
    [
      'deploy_freshness',
      'public_reachability',
      'protected_prerequisite',
      'protected_prerequisite',
      'release_evidence',
      'release_evidence',
      'release_evidence',
      'release_evidence',
      'unknown',
    ],
  );
  assert.equal(details[2].protectedInputRequired, true);
  assert.equal(details[2].finalEvidenceRequired, false);
  assert.equal(details[3].protectedInputRequired, true);
  assert.equal(details[3].finalEvidenceRequired, false);
  assert.equal(details[4].protectedInputRequired, true);
  assert.equal(details[4].finalEvidenceRequired, true);
  assert.equal(details[5].protectedInputRequired, true);
  assert.equal(details[5].finalEvidenceRequired, true);
  assert.equal(details[6].protectedInputRequired, false);
  assert.equal(details[6].finalEvidenceRequired, true);
  assert.equal(details[7].protectedInputRequired, true);
  assert.equal(details[7].remediationAvailable, true);
  assert.equal(details[8].remediationAvailable, false);
  assert.equal(JSON.stringify(details).includes('super-secret'), false);
});

test('renderPreflightMarkdown summarizes blockers without secret values', () => {
  const prerequisites = evaluatePrerequisiteGroups({
    LIVEIMPORT_READBACK_AUTH_TOKEN: 'super-secret-token',
  });
  const report = buildPreflightReport({
    options: {
      apiBaseUrl: 'https://api.example.com',
      webBaseUrl: 'https://web.example.com',
      expectedSha: 'abc123',
      today: '2026-05-08',
      skipBuildInfo: true,
      skipPublicSmoke: true,
    },
    buildInfo: { ok: true, skipped: true },
    publicSmoke: { ok: true, skipped: true },
    prerequisites,
    evidence: {
      evidence: [
        {
          key: 'rollbackProof',
          label: 'rollback proof pack',
          state: 'failed',
          required: true,
          reason: 'artifact is fresh but does not report PASS',
          path: 'docs/operations/v1-rollback-proof-prod-2026-05-08T00-00-00-000Z.md',
          date: '2026-05-08',
        },
      ],
    },
    blockers: ['env:rollback guard auth', 'evidence:rollbackProof:failed'],
  });

  const markdown = renderPreflightMarkdown(report, 'tmp/preflight.json');

  assert.match(markdown, /# V1 Final Preflight Report/);
  assert.match(markdown, /Status: blocked/);
  assert.match(markdown, /env:rollback guard auth/);
  assert.match(markdown, /release_evidence/);
  assert.match(markdown, /tmp\/preflight\.json/);
  assert.equal(markdown.includes('- - '), false);
  assert.equal(markdown.includes('super-secret-token'), false);
});
