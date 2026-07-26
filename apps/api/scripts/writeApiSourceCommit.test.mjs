import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
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

const stageScriptFixture = async (rootDir) => {
  const fixtureScriptPath = path.join(rootDir, 'apps', 'api', 'scripts', 'writeApiSourceCommit.mjs');
  await mkdir(path.dirname(fixtureScriptPath), { recursive: true });
  await cp(scriptPath, fixtureScriptPath);
  return fixtureScriptPath;
};

const readGeneratedSourceCommit = async (apiDir) =>
  (await readFile(path.join(apiDir, '.build-meta', 'SOURCE_COMMIT'), 'utf8')).trim();

test('writes normalized env SOURCE_COMMIT when present', async () => {
  const { rootDir, apiDir } = await makeApiDir();
  const fixtureScriptPath = await stageScriptFixture(rootDir);

  await execFileAsync(process.execPath, [fixtureScriptPath], {
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

test('accepts COOLIFY_GIT_COMMIT_SHA when SOURCE_COMMIT is absent', async () => {
  const { rootDir, apiDir } = await makeApiDir();
  const fixtureScriptPath = await stageScriptFixture(rootDir);

  await execFileAsync(process.execPath, [fixtureScriptPath], {
    cwd: apiDir,
    env: {
      ...clearSourceCommitEnv(process.env),
      COOLIFY_GIT_COMMIT_SHA: 'FEDCBA9876543210FEDCBA9876543210FEDCBA98',
    },
  });

  assert.equal(
    await readGeneratedSourceCommit(apiDir),
    'fedcba9876543210fedcba9876543210fedcba98'
  );
});

test('falls back to .git HEAD and refs when explicit SOURCE_COMMIT is absent', async () => {
  const { rootDir, apiDir } = await makeApiDir();
  const fixtureScriptPath = await stageScriptFixture(rootDir);
  const gitHeadsDir = path.join(rootDir, '.git', 'refs', 'heads');
  await mkdir(gitHeadsDir, { recursive: true });
  await writeFile(path.join(rootDir, '.git', 'HEAD'), 'ref: refs/heads/main\n');
  await writeFile(
    path.join(gitHeadsDir, 'main'),
    '0123456789abcdef0123456789abcdef01234567\n'
  );

  await execFileAsync(process.execPath, [fixtureScriptPath], {
    cwd: apiDir,
    env: clearSourceCommitEnv(process.env),
  });

  assert.equal(
    await readGeneratedSourceCommit(apiDir),
    '0123456789abcdef0123456789abcdef01234567'
  );
});

test('anchors repo and output paths to the script location instead of process.cwd()', async () => {
  const { rootDir, apiDir } = await makeApiDir();
  const fixtureScriptPath = await stageScriptFixture(rootDir);
  const gitHeadsDir = path.join(rootDir, '.git', 'refs', 'heads');
  await mkdir(gitHeadsDir, { recursive: true });
  await writeFile(path.join(rootDir, '.git', 'HEAD'), 'ref: refs/heads/main\n');
  await writeFile(
    path.join(gitHeadsDir, 'main'),
    '89abcdef0123456789abcdef0123456789abcdef\n'
  );

  await execFileAsync(process.execPath, [fixtureScriptPath], {
    cwd: rootDir,
    env: clearSourceCommitEnv(process.env),
  });

  assert.equal(
    await readGeneratedSourceCommit(apiDir),
    '89abcdef0123456789abcdef0123456789abcdef'
  );
});

test('fails closed when neither env nor git-file provenance is available', async () => {
  const { rootDir, apiDir } = await makeApiDir();
  const fixtureScriptPath = await stageScriptFixture(rootDir);

  await assert.rejects(
    execFileAsync(process.execPath, [fixtureScriptPath], {
      cwd: apiDir,
      env: clearSourceCommitEnv(process.env),
    }),
    /missing full SOURCE_COMMIT/
  );
});
