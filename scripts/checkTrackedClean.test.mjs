import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('./checkTrackedClean.mjs', import.meta.url));

test('tracked-clean rejects staged and unstaged changes but allows unrelated untracked files', (t) => {
  const tempRoot = path.resolve(os.tmpdir());
  const dir = mkdtempSync(path.join(tempRoot, 'soar-tracked-clean-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(dir)), tempRoot);
    rmSync(dir, { recursive: true, force: true });
  });

  const git = (...args) => spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', windowsHide: true });
  const run = () => spawnSync(process.execPath, [checker], { cwd: dir, encoding: 'utf8', windowsHide: true });
  const expectGit = (...args) => {
    const result = git(...args);
    assert.equal(result.status, 0, result.stderr);
  };
  const tracked = path.join(dir, 'tracked.txt');

  expectGit('init', '--quiet');
  expectGit('config', 'core.autocrlf', 'false');
  expectGit('config', 'user.name', 'Soar CI Test');
  expectGit('config', 'user.email', 'soar-ci@example.test');
  writeFileSync(tracked, 'base\n');
  expectGit('add', 'tracked.txt');
  expectGit('commit', '--quiet', '-m', 'base');

  assert.equal(run().status, 0);
  writeFileSync(path.join(dir, 'foreign.txt'), 'untracked\n');
  assert.equal(run().status, 0);

  writeFileSync(tracked, 'unstaged\n');
  assert.match(run().stderr, /Tracked source files changed:[\s\S]*tracked\.txt/);
  assert.equal(run().status, 1);

  writeFileSync(tracked, 'staged\n');
  expectGit('add', 'tracked.txt');
  assert.equal(git('diff', '--exit-code').status, 0, 'the previous gate check misses staged changes');
  assert.equal(run().status, 1);

  writeFileSync(tracked, 'base\n');
  assert.equal(run().status, 1, 'staged changes remain dirty even when the worktree matches HEAD');

  expectGit('restore', '--staged', 'tracked.txt');
  assert.equal(run().status, 0);
});
