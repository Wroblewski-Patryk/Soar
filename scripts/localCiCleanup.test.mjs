import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { cleanupLocalCiStaging } from './localCiCleanup.mjs';

const fixture = (t) => {
  const base = mkdtempSync(path.join(os.tmpdir(), 'soar-local-ci-cleanup-'));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const workspaceRoot = path.join(base, 'workspace');
  const stageRoot = path.join(workspaceRoot, 'tmp', 'local-ci-staging');
  const stageDir = path.join(stageRoot, 'run-1');
  const quarantineRoot = path.join(base, 'quarantine');
  mkdirSync(stageDir, { recursive: true });
  writeFileSync(path.join(stageDir, 'marker'), 'owned run\n');
  return { workspaceRoot, stageRoot, stageDir, quarantineRoot };
};

test('removes the owned staging directory and leaves an empty staging root', (t) => {
  const value = fixture(t);
  const result = cleanupLocalCiStaging(value);
  assert.equal(result.status, 'PASS');
  assert.equal(result.existsAfter, false);
  assert.deepEqual(result.rootEntriesAfter, []);
});

test('removes only the owned staging directory and rejects a stale sibling', (t) => {
  const value = fixture(t);
  const sibling = path.join(value.stageRoot, 'another-run');
  mkdirSync(sibling);
  const result = cleanupLocalCiStaging(value);
  assert.equal(result.status, 'FAIL');
  assert.equal(result.existsAfter, false);
  assert.equal(existsSync(value.stageDir), false);
  assert.equal(existsSync(sibling), true);
  assert.deepEqual(result.rootEntriesAfter, ['another-run']);
});

test('reports injected removal failure and moves the remainder outside the workspace', (t) => {
  const value = fixture(t);
  const result = cleanupLocalCiStaging({
    ...value,
    operations: { remove: () => { throw new Error('injected remove failure'); } },
  });
  assert.equal(result.status, 'FAIL');
  assert.equal(result.existsAfter, false);
  assert.match(result.errors[0], /injected remove failure/);
  assert.equal(readFileSync(path.join(result.quarantinedAt, 'marker'), 'utf8'), 'owned run\n');
});

test('reports both injected removal and quarantine failures without hiding the residue', (t) => {
  const value = fixture(t);
  const result = cleanupLocalCiStaging({
    ...value,
    operations: {
      remove: () => { throw new Error('injected remove failure'); },
      move: () => { throw new Error('injected move failure'); },
    },
  });
  assert.equal(result.status, 'FAIL');
  assert.equal(result.existsAfter, true);
  assert.equal(existsSync(value.stageDir), true);
  assert.match(result.errors.join(' '), /injected remove failure/);
  assert.match(result.errors.join(' '), /injected move failure/);
});

test('refuses to delete a path outside the owned staging root', (t) => {
  const value = fixture(t);
  const other = path.join(value.workspaceRoot, 'keep');
  mkdirSync(other);
  const result = cleanupLocalCiStaging({ ...value, stageDir: other });
  assert.equal(result.status, 'FAIL');
  assert.equal(existsSync(other), true);
  assert.match(result.errors.join(' '), /Unsafe staging/);
});
