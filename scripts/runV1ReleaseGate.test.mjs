import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import {
  buildExecutionPlanSummary,
  buildSteps,
  evaluateEvidenceReadiness,
} from './runV1ReleaseGate.mjs';

const writeLiveImportReadbackArtifact = (operationsDir, date = '2026-04-22', overrides = {}) =>
  writeFile(
    path.join(operationsDir, `liveimport-03-prod-readback-${date}.json`),
    `${JSON.stringify(
      {
        auth: {
          tokenCaptured: false,
        },
        summary: {
          botsWithRuntimeReadback: 1,
          missingSymbols: [],
          ...(overrides.summary ?? {}),
        },
        ...overrides,
      },
      null,
      2,
    )}\n`,
  );

const writeProdUiClickthroughArtifact = (
  operationsDir,
  date = '2026-04-22',
  suffix = 'abc12345',
  expectedSha = ''
) =>
  writeFile(
    path.join(operationsDir, `prod-ui-module-clickthrough-${suffix}-${date}.md`),
    [
      '# Production UI Module Clickthrough Audit',
      '',
      '## Status',
      '- Result: **PASS**',
      '- Environment: production',
      `- Evidence date: ${date}`,
      `- Expected SHA: \`${expectedSha || 'not provided'}\``,
      '- Dashboard auth: token:present',
      '- Admin auth: token:present',
      '',
      '## Route Results',
      '| Route | Area | Result | HTTP | Location | Notes |',
      '| --- | --- | --- | --- | --- | --- |',
      '| `/dashboard/bots` | dashboard | PASS | 200 | - | authenticated route rendered |',
      '| `/dashboard/bots/create` | dashboard | PASS | 200 | - | authenticated route rendered |',
      '',
    ].join('\n'),
  );

const writeApprovedRcArtifacts = async (operationsDir, date = '2026-04-22', expectedSha = '') => {
  const shaLine = `Expected SHA: \`${expectedSha || 'not provided'}\``;
  await writeFile(
    path.join(operationsDir, 'v1-rc-external-gates-status.md'),
    [
      `Generated at (UTC): ${date}T15:13:58.943Z`,
      shaLine,
      '- Gate 1 (Backup snapshot + restore validation): PASS',
      '- Gate 2 (Queue-lag baseline review): PASS',
      '- Gate 3 (Incident contacts + escalation confirmation): PASS',
      '- Gate 4 (Formal RC sign-offs): PASS',
      '- Gate 4 approved status found: yes',
      '',
    ].join('\n'),
  );
  await writeFile(
    path.join(operationsDir, 'v1-rc-signoff-record.md'),
    `Date (UTC): \`${date}T15:13:58.943Z\`\n${shaLine}\n- RC status: \`APPROVED\`\n`,
  );
  await writeFile(
    path.join(operationsDir, 'v1-release-candidate-checklist.md'),
    `### Latest Verification (${date})\n${shaLine}\n- current snapshot is \`G1=PASS\`, \`G2=PASS\`, \`G3=PASS\`, \`G4=PASS\`.\n`,
  );
};

const writeActivationArtifacts = async (
  operationsDir,
  planningDir,
  date = '2026-04-22',
  expectedSha = ''
) => {
  const shaLine = expectedSha ? `\n- Candidate SHA: \`${expectedSha}\`\n` : '\n';
  await writeFile(
    path.join(operationsDir, `v1-production-activation-evidence-audit-${date}.md`),
    `# audit\n\n## Result\n- Status: **READY**${shaLine}`,
  );
  await writeFile(
    path.join(planningDir, `v1-production-activation-and-evidence-plan-${date}.md`),
    `# plan\n\n## Current Status\n- Status: **READY**${shaLine}`,
  );
};

test('buildSteps passes api and web targets into deploy smoke gate', () => {
  const steps = buildSteps({
    baseUrl: 'https://stage-api.example.com',
    webBaseUrl: 'https://stage-web.example.com',
    expectedSha: '',
    authToken: '',
    authEmail: '',
    authPassword: '',
    opsBasicUser: '',
    opsBasicPassword: '',
    opsAuthHeaderName: '',
    opsAuthHeaderValue: '',
    skipLocalQuality: true,
    skipGoLiveSmoke: true,
    skipDeploySmoke: false,
    skipRuntimeFreshness: true,
    skipRollbackGuard: true,
  });

  assert.equal(steps.length, 1);
  assert.equal(steps[0].label, 'post-deploy smoke gate');
  assert.deepEqual(steps[0].args, [
    'run',
    'ops:deploy:smoke',
    '--',
    '--base-url',
    'https://stage-api.example.com',
    '--web-base-url',
    'https://stage-web.example.com',
  ]);
});

test('buildSteps adds build-info freshness gate before deploy smoke when expected sha is provided', () => {
  const steps = buildSteps({
    baseUrl: 'https://stage-api.example.com',
    webBaseUrl: 'https://stage-web.example.com',
    expectedSha: 'abc123',
    authToken: '',
    authEmail: '',
    authPassword: '',
    opsBasicUser: '',
    opsBasicPassword: '',
    opsAuthHeaderName: '',
    opsAuthHeaderValue: '',
    skipLocalQuality: true,
    skipGoLiveSmoke: true,
    skipDeploySmoke: false,
    skipRuntimeFreshness: true,
    skipRollbackGuard: true,
  });

  assert.equal(steps.length, 2);
  assert.equal(steps[0].label, 'web build-info freshness gate');
  assert.deepEqual(steps[0].args, [
    'run',
    'ops:deploy:wait-web-build-info',
    '--',
    '--web-base-url',
    'https://stage-web.example.com',
    '--expected-sha',
    'abc123',
    '--timeout-seconds',
    '900',
    '--interval-seconds',
    '30',
  ]);
  assert.equal(steps[1].label, 'post-deploy smoke gate');
});

test('buildSteps passes release auth through step env instead of command args', () => {
  const steps = buildSteps({
    baseUrl: 'https://api.example.com',
    webBaseUrl: 'https://web.example.com',
    expectedSha: '',
    authToken: 'secret-token',
    authEmail: 'ops@example.com',
    authPassword: 'secret-password',
    opsBasicUser: '',
    opsBasicPassword: '',
    opsAuthHeaderName: '',
    opsAuthHeaderValue: '',
    skipLocalQuality: true,
    skipGoLiveSmoke: true,
    skipDeploySmoke: false,
    skipRuntimeFreshness: false,
    skipRollbackGuard: false,
  });

  for (const step of steps) {
    assert.equal(step.args.includes('secret-token'), false);
    assert.equal(step.args.includes('secret-password'), false);
    assert.equal(step.args.includes('--auth-token'), false);
    assert.equal(step.args.includes('--auth-password'), false);
  }

  assert.equal(steps[0].env.SMOKE_AUTH_TOKEN, 'secret-token');
  assert.equal(steps[1].env.DEPLOY_FRESHNESS_AUTH_TOKEN, 'secret-token');
  assert.equal(steps[2].env.ROLLBACK_GUARD_AUTH_TOKEN, 'secret-token');
});

test('buildExecutionPlanSummary marks go-live smoke skipped when local quality is skipped', () => {
  const summary = buildExecutionPlanSummary({
    environment: 'prod',
    baseUrl: 'https://api.example.com',
    webBaseUrl: '',
    expectedSha: '',
    dryRun: true,
    skipLocalQuality: true,
    skipGoLiveSmoke: false,
    skipDeploySmoke: true,
    skipRuntimeFreshness: true,
    skipRollbackGuard: true,
  });

  assert.equal(summary.localQuality, 'skipped');
  assert.equal(summary.goLiveSmoke, 'skipped');
});

test('evaluateEvidenceReadiness marks missing stage evidence as not ready', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-missing-'));
  const operationsDir = path.join(tempRoot, 'operations');
  try {
    await mkdir(operationsDir, { recursive: true });
    const result = await evaluateEvidenceReadiness({
      environment: 'stage',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.deepEqual(result.blockers, ['activationAudit:missing', 'activationPlan:missing']);
    assert.equal(result.evidence.find((row) => row.key === 'activationAudit')?.state, 'missing');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh activation artifacts without ready status', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-activation-blocked-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeFile(
      path.join(operationsDir, 'v1-production-activation-evidence-audit-2026-04-22.md'),
      '# audit\n\n## Result\n- Status: **BLOCKED**\n',
    );
    await writeFile(
      path.join(planningDir, 'v1-production-activation-and-evidence-plan-2026-04-22.md'),
      '# plan\n\n## Current Status\n- Status: **BLOCKED**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'stage',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.deepEqual(result.blockers, ['activationAudit:failed', 'activationPlan:failed']);
    assert.equal(result.evidence.find((row) => row.key === 'activationAudit')?.state, 'failed');
    assert.equal(result.evidence.find((row) => row.key === 'activationPlan')?.state, 'failed');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh activation artifacts for a different expected SHA', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-sha-mismatch-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir, '2026-04-22', 'old-sha-123');

    const result = await evaluateEvidenceReadiness({
      environment: 'stage',
      evidenceDir: operationsDir,
      today: '2026-04-22',
      expectedSha: 'new-sha-456',
    });

    assert.equal(result.ready, false);
    assert.deepEqual(result.blockers, ['activationAudit:failed', 'activationPlan:failed']);
    assert.equal(
      result.evidence.find((row) => row.key === 'activationAudit')?.reason,
      'artifact is fresh but is not tied to the expected deployment SHA',
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh restore and rollback proof for a different expected SHA', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-proof-sha-mismatch-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  const evidenceDir = path.join(tempRoot, 'evidence');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await mkdir(evidenceDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir, '2026-04-22', 'new-sha-456');
    await writeApprovedRcArtifacts(operationsDir, '2026-04-22', 'new-sha-456');
    await writeLiveImportReadbackArtifact(operationsDir, '2026-04-22', {
      target: { expectedSha: 'new-sha-456' },
    });
    await writeProdUiClickthroughArtifact(operationsDir, '2026-04-22', 'abc12345', 'new-sha-456');
    await writeFile(
      path.join(evidenceDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **PASS**\n- Expected SHA: `old-sha-123`\n',
    );
    await writeFile(
      path.join(evidenceDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n- Expected SHA: `old-sha-123`\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
      expectedSha: 'new-sha-456',
      historyRoot: tempRoot,
    });

    assert.equal(result.ready, false);
    assert.deepEqual(result.blockers, ['backupRestoreDrill:failed', 'rollbackProof:failed']);
    assert.equal(
      result.evidence.find((row) => row.key === 'backupRestoreDrill')?.reason,
      'artifact is fresh but is not tied to the expected deployment SHA',
    );
    assert.equal(
      result.evidence.find((row) => row.key === 'rollbackProof')?.reason,
      'artifact is fresh but is not tied to the expected deployment SHA',
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh RC artifacts for a different expected SHA', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-rc-sha-mismatch-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  const evidenceDir = path.join(tempRoot, 'evidence');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await mkdir(evidenceDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir, '2026-04-22', 'new-sha-456');
    await writeApprovedRcArtifacts(operationsDir, '2026-04-22', 'old-sha-123');
    await writeLiveImportReadbackArtifact(operationsDir, '2026-04-22', {
      target: { expectedSha: 'new-sha-456' },
    });
    await writeProdUiClickthroughArtifact(operationsDir, '2026-04-22', 'abc12345', 'new-sha-456');
    await writeFile(
      path.join(evidenceDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **PASS**\n- Expected SHA: `new-sha-456`\n',
    );
    await writeFile(
      path.join(evidenceDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n- Expected SHA: `new-sha-456`\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
      expectedSha: 'new-sha-456',
      historyRoot: tempRoot,
    });

    assert.equal(result.ready, false);
    assert.deepEqual(result.blockers, [
      'rcExternalGateStatus:failed',
      'rcSignoffRecord:failed',
      'rcChecklist:failed',
    ]);
    assert.equal(
      result.evidence.find((row) => row.key === 'rcExternalGateStatus')?.reason,
      'artifact is fresh but is not tied to the expected deployment SHA',
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness marks stale prod evidence with explicit blockers', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-stale-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeFile(
      path.join(operationsDir, 'v1-rc-external-gates-status.md'),
      'Generated at (UTC): 2026-04-19T15:13:58.943Z\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rc-signoff-record.md'),
      'Date (UTC): `2026-04-19T15:13:58.943Z`\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-release-candidate-checklist.md'),
      '### Latest Verification (2026-04-19)\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-19T10-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-19T10:00:00.000Z\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-19T10-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-19T10:05:00.000Z\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.equal(result.evidence.find((row) => row.key === 'activationAudit')?.state, 'fresh');
    assert.equal(result.evidence.find((row) => row.key === 'activationPlan')?.state, 'fresh');
    assert.equal(result.evidence.find((row) => row.key === 'rcExternalGateStatus')?.state, 'stale');
    assert.equal(result.evidence.find((row) => row.key === 'rcSignoffRecord')?.state, 'stale');
    assert.equal(result.evidence.find((row) => row.key === 'rcChecklist')?.state, 'stale');
    assert.equal(result.evidence.find((row) => row.key === 'liveImportReadback')?.state, 'missing');
    assert.equal(result.evidence.find((row) => row.key === 'prodUiClickthrough')?.state, 'missing');
    assert.equal(result.evidence.find((row) => row.key === 'backupRestoreDrill')?.state, 'stale');
    assert.equal(result.evidence.find((row) => row.key === 'rollbackProof')?.state, 'stale');
    assert.deepEqual(result.blockers, [
      'rcExternalGateStatus:stale',
      'rcSignoffRecord:stale',
      'rcChecklist:stale',
      'liveImportReadback:missing',
      'prodUiClickthrough:missing',
      'backupRestoreDrill:stale',
      'rollbackProof:stale',
    ]);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness accepts fresh prod rollback and backup proof', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-fresh-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeApprovedRcArtifacts(operationsDir);
    await writeLiveImportReadbackArtifact(operationsDir);
    await writeProdUiClickthroughArtifact(operationsDir);
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **PASS**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, true);
    assert.deepEqual(result.blockers, []);
    assert.equal(result.evidence.find((row) => row.key === 'liveImportReadback')?.state, 'fresh');
    assert.equal(result.evidence.find((row) => row.key === 'prodUiClickthrough')?.state, 'fresh');
    assert.equal(result.evidence.find((row) => row.key === 'backupRestoreDrill')?.state, 'fresh');
    assert.equal(result.evidence.find((row) => row.key === 'rollbackProof')?.state, 'fresh');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh prod restore proof when artifact status is FAIL', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-failed-proof-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeApprovedRcArtifacts(operationsDir);
    await writeLiveImportReadbackArtifact(operationsDir);
    await writeProdUiClickthroughArtifact(operationsDir);
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **FAIL**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.equal(result.evidence.find((row) => row.key === 'backupRestoreDrill')?.state, 'failed');
    assert.deepEqual(result.blockers, ['backupRestoreDrill:failed']);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness prefers the latest same-day prod restore proof artifact', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-latest-proof-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeApprovedRcArtifacts(operationsDir);
    await writeLiveImportReadbackArtifact(operationsDir);
    await writeProdUiClickthroughArtifact(operationsDir);
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **FAIL**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T22-31-28-000Z.md'),
      '- Generated at (UTC): 2026-04-22T22:31:28.000Z\n- Status: **PASS**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, true);
    assert.match(
      result.evidence.find((row) => row.key === 'backupRestoreDrill')?.path ?? '',
      /v1-restore-drill-prod-2026-04-22T22-31-28-000Z\.md$/,
    );
    assert.deepEqual(result.blockers, []);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh prod RC artifacts that are not approved', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-rc-blocked-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeFile(
      path.join(operationsDir, 'v1-rc-external-gates-status.md'),
      [
        'Generated at (UTC): 2026-04-22T15:13:58.943Z',
        '- Gate 1 (Backup snapshot + restore validation): PASS',
        '- Gate 2 (Queue-lag baseline review): PASS',
        '- Gate 3 (Incident contacts + escalation confirmation): PASS',
        '- Gate 4 (Formal RC sign-offs): OPEN',
        '- Gate 4 approved status found: no',
        '',
      ].join('\n'),
    );
    await writeFile(
      path.join(operationsDir, 'v1-rc-signoff-record.md'),
      'Date (UTC): `2026-04-22T15:13:58.943Z`\n- RC status: `BLOCKED`\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-release-candidate-checklist.md'),
      '### Latest Verification (2026-04-22)\n- current snapshot is `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=OPEN`.\n',
    );
    await writeLiveImportReadbackArtifact(operationsDir);
    await writeProdUiClickthroughArtifact(operationsDir);
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **PASS**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.equal(result.evidence.find((row) => row.key === 'rcExternalGateStatus')?.state, 'failed');
    assert.equal(result.evidence.find((row) => row.key === 'rcSignoffRecord')?.state, 'failed');
    assert.equal(result.evidence.find((row) => row.key === 'rcChecklist')?.state, 'failed');
    assert.deepEqual(result.blockers, [
      'rcExternalGateStatus:failed',
      'rcSignoffRecord:failed',
      'rcChecklist:failed',
    ]);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh prod live-import readback without runtime visibility', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-liveimport-failed-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeApprovedRcArtifacts(operationsDir);
    await writeLiveImportReadbackArtifact(operationsDir, '2026-04-22', {
      summary: {
        botsWithRuntimeReadback: 0,
        missingSymbols: ['ETHUSDT'],
      },
    });
    await writeProdUiClickthroughArtifact(operationsDir);
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **PASS**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.equal(result.evidence.find((row) => row.key === 'liveImportReadback')?.state, 'failed');
    assert.deepEqual(result.blockers, ['liveImportReadback:failed']);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness rejects fresh prod UI clickthrough without authenticated Bots coverage', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-ui-failed-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir);
    await writeApprovedRcArtifacts(operationsDir);
    await writeLiveImportReadbackArtifact(operationsDir);
    await writeFile(
      path.join(operationsDir, 'prod-ui-module-clickthrough-abc12345-2026-04-22.md'),
      [
        '# Production UI Module Clickthrough Audit',
        '',
        '## Status',
        '- Result: **BLOCKED_AUTH**',
        '- Evidence date: 2026-04-22',
        '- Dashboard auth: missing',
        '',
        '## Route Results',
        '| `/dashboard/bots` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | auth required |',
        '',
      ].join('\n'),
    );
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-04-22T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:00:00.000Z\n- Status: **PASS**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-04-22T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-04-22T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-04-22',
    });

    assert.equal(result.ready, false);
    assert.equal(result.evidence.find((row) => row.key === 'prodUiClickthrough')?.state, 'failed');
    assert.deepEqual(result.blockers, ['prodUiClickthrough:failed']);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('evaluateEvidenceReadiness prefers newer prod UI clickthrough date over lexically later sha', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-ui-latest-date-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeActivationArtifacts(operationsDir, planningDir, '2026-05-12');
    await writeApprovedRcArtifacts(operationsDir, '2026-05-12');
    await writeLiveImportReadbackArtifact(operationsDir, '2026-05-12');
    await writeProdUiClickthroughArtifact(operationsDir, '2026-05-10', 'fd8da90b');
    await writeProdUiClickthroughArtifact(operationsDir, '2026-05-12', '00169d7f');
    await writeFile(
      path.join(operationsDir, 'v1-restore-drill-prod-2026-05-12T19-00-00-000Z.md'),
      '- Generated at (UTC): 2026-05-12T19:00:00.000Z\n- Status: **PASS**\n',
    );
    await writeFile(
      path.join(operationsDir, 'v1-rollback-proof-prod-2026-05-12T19-05-00-000Z.md'),
      '- Generated at (UTC): 2026-05-12T19:05:00.000Z\n- Status: **PASS**\n',
    );

    const result = await evaluateEvidenceReadiness({
      environment: 'prod',
      evidenceDir: operationsDir,
      today: '2026-05-12',
    });

    assert.equal(result.ready, true);
    assert.match(
      result.evidence.find((row) => row.key === 'prodUiClickthrough')?.path ?? '',
      /prod-ui-module-clickthrough-00169d7f-2026-05-12\.md$/,
    );
    assert.deepEqual(result.blockers, []);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
