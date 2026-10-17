import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { REQUIRED_LOCAL_CI_STEPS, sha256, verifyLocalCiManifest } from './localCiManifest.mjs';

const SHA = 'a'.repeat(40);
const IMAGE = `sha256:${'b'.repeat(64)}`;

const fixture = () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'soar-local-ci-manifest-'));
  const steps = REQUIRED_LOCAL_CI_STEPS.map((id, index) => {
    const log = `${index}.log`;
    const content = `${id} passed\n`;
    writeFileSync(path.join(dir, log), content);
    return { id, exitCode: 0, log, logSha256: sha256(content) };
  });
  const manifestPath = path.join(dir, 'manifest.json');
  const manifest = {
    schemaVersion: 1,
    mode: 'release',
    candidateSha: SHA,
    status: 'PASS',
    completedAt: new Date().toISOString(),
    coverage: { ciParity: 'PASS', application: 'PARTIAL' },
    lockfileSha256: 'c'.repeat(64),
    images: { runner: IMAGE, postgres: IMAGE, redis: IMAGE },
    steps,
  };
  writeFileSync(manifestPath, JSON.stringify(manifest));
  return { dir, manifestPath, manifest };
};

test('accepts complete release evidence for the exact SHA', (t) => {
  const value = fixture();
  t.after(() => rmSync(value.dir, { recursive: true, force: true }));
  assert.equal(verifyLocalCiManifest({ manifestPath: value.manifestPath, expectedSha: SHA }).status, 'PASS');
});

test('rejects a different SHA', (t) => {
  const value = fixture();
  t.after(() => rmSync(value.dir, { recursive: true, force: true }));
  assert.throws(() => verifyLocalCiManifest({ manifestPath: value.manifestPath, expectedSha: 'd'.repeat(40) }), /SHA does not match/);
});

test('rejects a missing required step', (t) => {
  const value = fixture();
  t.after(() => rmSync(value.dir, { recursive: true, force: true }));
  value.manifest.steps.splice(4, 1);
  writeFileSync(value.manifestPath, JSON.stringify(value.manifest));
  assert.throws(() => verifyLocalCiManifest({ manifestPath: value.manifestPath, expectedSha: SHA }), /missing or extra steps/);
});

test('rejects a changed log', (t) => {
  const value = fixture();
  t.after(() => rmSync(value.dir, { recursive: true, force: true }));
  const log = path.join(value.dir, value.manifest.steps[3].log);
  writeFileSync(log, `${readFileSync(log, 'utf8')}tampered\n`);
  assert.throws(() => verifyLocalCiManifest({ manifestPath: value.manifestPath, expectedSha: SHA }), /Log was changed/);
});
