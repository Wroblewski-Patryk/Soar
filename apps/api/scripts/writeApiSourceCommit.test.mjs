import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptPath = path.resolve('apps/api/scripts/writeApiSourceCommit.mjs');

const clearSourceCommitEnv = (env) => {
  const nextEnv = { ...env };
  for (const key of ['SOURCE_COMMIT', 'GITHUB_SHA', 'COOLIFY_GIT_COMMIT_SHA', 'COOLIFY_COMMIT_SHA']) {
    delete nextEnv[key];
  }
  return nextEnv;
};

const makeApiDir = async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), 'soar-api-source-commit-'));
  const apiDir = path.join(rootDir, 'apps', 'api');
  await mkdir(apiDir, { recursive: true });
  return { rootDir, apiDir };
};

const readGeneratedSourceCommit = async (apiDir) =>
  (await readFile(path.join(apiDir, '.build-meta', 'SOURCE_COMMIT'), 'utf8')).trim();

test('writes normalized env SOURCE_COMMIT when present', async () => {
  const { apiDir } = await makeApiDir();

  await execFileAsync(process.execPath, [scriptPath], {
    cwd: apiDir,
    env: {
      ...clearSourceCommitEnv(process.env),
      SOURCE_COMMIT: 'ABCDEF0123456789ABCDEF0123456789ABCDEF01',
    },
  });

  assert.equal(
    await readGeneratedSourceCommit(apiDir),
    'abcdef0123456789abcdef0123456789abcdef01'
  );
});

test('falls back to .git HEAD and refs when explicit SOURCE_COMMIT is absent', async () => {
  const { rootDir, apiDir } = await makeApiDir();
  const gitHeadsDir = path.join(rootDir, '.git', 'refs', 'heads');
  await mkdir(gitHeadsDir, { recursive: true });
  await writeFile(path.join(rootDir, '.git', 'HEAD'), 'ref: refs/heads/main\n');
  await writeFile(
    path.join(gitHeadsDir, 'main'),
    '0123456789abcdef0123456789abcdef01234567\n'
  );

  await execFileAsync(process.execPath, [scriptPath], {
    cwd: apiDir,
    env: clearSourceCommitEnv(process.env),
  });

  assert.equal(
    await readGeneratedSourceCommit(apiDir),
    '0123456789abcdef0123456789abcdef01234567'
  );
});

test('fails closed when neither env nor git-file provenance is available', async () => {
  const { apiDir } = await makeApiDir();

  await assert.rejects(
    execFileAsync(process.execPath, [scriptPath], {
      cwd: apiDir,
      env: clearSourceCommitEnv(process.env),
    }),
    /missing full SOURCE_COMMIT/
  );
});
