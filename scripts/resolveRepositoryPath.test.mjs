import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { repositoryPathExists, resolveRepositoryPath } from './resolveRepositoryPath.mjs';

test('resolveRepositoryPath resolves regular repository paths', async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'soar-repo-path-'));
  await mkdir(path.join(repoRoot, 'history', 'artifacts'), { recursive: true });
  await writeFile(path.join(repoRoot, 'history', 'artifacts', 'example.json'), '{}\n');

  assert.equal(
    resolveRepositoryPath(repoRoot, 'history/artifacts/example.json'),
    path.resolve(repoRoot, 'history/artifacts/example.json'),
  );
  assert.equal(repositoryPathExists(repoRoot, 'history/artifacts/example.json'), true);
});

test('resolveRepositoryPath maps logical docs paths to migrated docs root when needed', async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'soar-repo-path-'));
  await mkdir(path.join(repoRoot, 'docs', 'analysis'), { recursive: true });
  await writeFile(path.join(repoRoot, 'docs', 'analysis', 'documentation-drift.md'), '# Drift\n');

  assert.equal(
    resolveRepositoryPath(repoRoot, 'docs/analysis/documentation-drift.md'),
    path.resolve(repoRoot, 'docs', 'analysis', 'documentation-drift.md'),
  );
  assert.equal(repositoryPathExists(repoRoot, 'docs/analysis/documentation-drift.md'), true);
});

test('repositoryPathExists remains false for missing paths', async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'soar-repo-path-'));

  assert.equal(repositoryPathExists(repoRoot, 'docs/missing.md'), false);
  assert.equal(repositoryPathExists(repoRoot, 'history/artifacts/missing.json'), false);
});
