import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { buildSteps, evaluateEvidenceReadiness } from './runV1ReleaseGate.mjs';

test('buildSteps passes api and web targets into deploy smoke gate', () => {
  const steps = buildSteps({
    baseUrl: 'https://stage-api.example.com',
    webBaseUrl: 'https://stage-web.example.com',
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

test('evaluateEvidenceReadiness marks stale prod evidence with explicit blockers', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'v1-release-gate-stale-'));
  const operationsDir = path.join(tempRoot, 'operations');
  const planningDir = path.join(tempRoot, 'planning');
  try {
    await mkdir(operationsDir, { recursive: true });
    await mkdir(planningDir, { recursive: true });
    await writeFile(
      path.join(operationsDir, 'v1-production-activation-evidence-audit-2026-04-22.md'),
      '# audit\n',
    );
    await writeFile(
      path.join(planningDir, 'v1-production-activation-and-evidence-plan-2026-04-22.md'),
      '# plan\n',
    );
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
    assert.deepEqual(result.blockers, [
      'rcExternalGateStatus:stale',
      'rcSignoffRecord:stale',
      'rcChecklist:stale',
    ]);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
