import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  evaluateWorkerSwitchPreflight,
  formatWorkerSwitchPreflight,
} from './checkWorkerSwitchPreflight.mjs';

const sha = 'a'.repeat(40);
const image = `sha256:${'b'.repeat(64)}`;
const nowMs = Date.parse('2026-10-20T01:00:00.000Z');
const roles = [
  'api', 'workers-market-data', 'workers-market-stream', 'workers-backtest', 'workers-execution',
];
const snapshot = () => ({
  schemaVersion: 1,
  capturedAt: new Date(nowMs - 30_000).toISOString(),
  inventoryComplete: true,
  inventorySource: 'coolify-and-docker-readback',
  provenance: {
    coolifyResourceId: 'candidate-stack',
    coolifyDeploymentId: 'candidate-build',
    coolifyResolvedSha: sha,
    apiImageId: image,
    apiImageRevision: sha,
    plannedImageIds: Object.fromEntries(roles.map((role) => [role, image])),
  },
  oldApplications: roles.map((role, index) => ({
    role,
    resourceId: `old-${role}`,
    ...(role === 'api' ? {
      workerMode: 'split',
      ownership: { marketData: 'worker', marketStream: 'worker', backtest: 'worker', execution: 'worker' },
    } : {}),
    containers: [{ id: String(index + 1).repeat(64), running: role === 'api', pid: role === 'api' ? 321 : 0 }],
  })),
});

const evaluate = (value) => evaluateWorkerSwitchPreflight({ snapshot: value, expectedSha: sha, nowMs });

test('passes a fresh complete inventory with old workers stopped and one verified candidate image', () => {
  assert.deepEqual(evaluate(snapshot()), { status: 'PASS', issues: [] });
});

test('fails before a new worker starts when an old worker is running or still has a PID', () => {
  const value = snapshot();
  value.oldApplications[3].containers[0].running = true;
  value.oldApplications[3].containers[0].pid = 52;
  assert.ok(evaluate(value).issues.includes('OLD_WORKER_ACTIVE'));

  value.oldApplications[3].containers[0].running = false;
  assert.ok(evaluate(value).issues.includes('OLD_WORKER_ACTIVE'));
});

test('requires a stopped old API unless its running topology proves no inline worker ownership', () => {
  const value = snapshot();
  value.oldApplications[0].ownership.backtest = 'inline';
  assert.ok(evaluate(value).issues.includes('OLD_API_MAY_CONSUME_INLINE'));

  value.oldApplications[0].containers[0].running = false;
  value.oldApplications[0].containers[0].pid = 0;
  assert.equal(evaluate(value).status, 'PASS');
});

test('fails closed on unknown container state, missing role, or stale readback', () => {
  const value = snapshot();
  delete value.oldApplications[1].containers[0].running;
  assert.ok(evaluate(value).issues.includes('OLD_CONTAINER_STATE_UNKNOWN'));

  const missing = snapshot();
  missing.oldApplications.pop();
  assert.ok(evaluate(missing).issues.includes('OLD_INVENTORY_INCOMPLETE'));

  const stale = snapshot();
  stale.capturedAt = new Date(nowMs - 6 * 60_000).toISOString();
  assert.ok(evaluate(stale).issues.includes('SNAPSHOT_NOT_FRESH'));

  const ambiguousTime = snapshot();
  ambiguousTime.capturedAt = '2026-10-20T01:00:00';
  assert.ok(evaluate(ambiguousTime).issues.includes('SNAPSHOT_NOT_FRESH'));
});

test('requires matching Coolify resolved SHA, image revision, and all planned image IDs', () => {
  const missing = snapshot();
  delete missing.provenance.apiImageRevision;
  assert.equal(evaluate(missing).status, 'FAIL');
  assert.ok(evaluate(missing).issues.includes('CANDIDATE_PROVENANCE_MISSING'));

  const mismatch = snapshot();
  mismatch.provenance.coolifyResolvedSha = 'c'.repeat(40);
  mismatch.provenance.plannedImageIds['workers-backtest'] = `sha256:${'d'.repeat(64)}`;
  assert.ok(evaluate(mismatch).issues.includes('CANDIDATE_SHA_MISMATCH'));
  assert.ok(evaluate(mismatch).issues.includes('CANDIDATE_IMAGE_MISMATCH'));
});

test('rejects unexpected data without printing any supplied value', () => {
  const value = snapshot();
  value.DATABASE_URL = 'postgresql://secret-value';
  const report = formatWorkerSwitchPreflight(evaluate(value));
  assert.match(report, /FAIL SNAPSHOT_SCHEMA_INVALID/);
  assert.doesNotMatch(report, /secret-value/);
});

test('CLI returns a failing exit code and only failure codes for a blocked switch', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'soar-worker-switch-'));
  try {
    const file = path.join(directory, 'snapshot.json');
    const value = snapshot();
    value.capturedAt = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(value));
    const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'checkWorkerSwitchPreflight.mjs');
    const pass = spawnSync(process.execPath, [script, '--snapshot', file, '--expected-sha', sha], {
      encoding: 'utf8',
    });
    assert.equal(pass.status, 0);
    assert.match(pass.stdout, /PASS/);

    value.oldApplications[3].containers[0].running = true;
    value.oldApplications[3].containers[0].pid = 71;
    value.unexpectedSecret = 'never-print-this';
    fs.writeFileSync(file, JSON.stringify(value));
    const result = spawnSync(process.execPath, [script, '--snapshot', file, '--expected-sha', sha], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL SNAPSHOT_SCHEMA_INVALID/);
    assert.doesNotMatch(result.stdout + result.stderr, /never-print-this/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
