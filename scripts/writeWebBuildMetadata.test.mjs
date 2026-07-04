import { execFile } from 'node:child_process';
import { mkdtemp, readFile, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptPath = path.resolve('scripts/writeWebBuildMetadata.mjs');

const clearBuildMetadataEnv = (env) => {
  const nextEnv = { ...env };
  for (const key of [
    'SOURCE_COMMIT',
    'GITHUB_SHA',
    'COOLIFY_GIT_COMMIT_SHA',
    'COOLIFY_COMMIT_SHA',
    'VERCEL_GIT_COMMIT_SHA',
    'RAILWAY_GIT_COMMIT_SHA',
    'SOURCE_BRANCH',
    'COOLIFY_GIT_BRANCH',
    'COOLIFY_BRANCH',
    'GITHUB_REF_NAME',
    'VERCEL_GIT_COMMIT_REF',
    'RAILWAY_GIT_BRANCH',
  ]) {
    delete nextEnv[key];
  }
  return nextEnv;
};

const makeWebDir = async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), 'soar-web-build-meta-'));
  const webDir = path.join(rootDir, 'apps', 'web');
  await mkdir(webDir, { recursive: true });
  return webDir;
};

const readGeneratedMetadata = async (webDir) =>
  JSON.parse(await readFile(path.join(webDir, '.build-meta', 'BUILD_META.json'), 'utf8'));

test('writes env metadata as authoritative build metadata', async () => {
  const webDir = await makeWebDir();
  await execFileAsync(process.execPath, [scriptPath], {
    cwd: webDir,
    env: {
      ...clearBuildMetadataEnv(process.env),
      SOURCE_COMMIT: '0123456789abcdef0123456789abcdef01234567',
      SOURCE_BRANCH: 'main',
    },
  });

  const metadata = await readGeneratedMetadata(webDir);
  assert.equal(metadata.gitSha, '0123456789abcdef0123456789abcdef01234567');
  assert.equal(metadata.gitRef, 'main');
  assert.equal(metadata.metadataSource, 'env');
});

test('writes Coolify commit alias as authoritative build metadata', async () => {
  const webDir = await makeWebDir();
  await execFileAsync(process.execPath, [scriptPath], {
    cwd: webDir,
    env: {
      ...clearBuildMetadataEnv(process.env),
      COOLIFY_GIT_COMMIT_SHA: 'abcdefabcdefabcdefabcdefabcdefabcdefabcd',
      COOLIFY_BRANCH: 'main',
    },
  });

  const metadata = await readGeneratedMetadata(webDir);
  assert.equal(metadata.gitSha, 'abcdefabcdefabcdefabcdefabcdefabcdefabcd');
  assert.equal(metadata.gitRef, 'main');
  assert.equal(metadata.metadataSource, 'env');
});

test('does not substitute GitHub branch head when build metadata is absent', async () => {
  const webDir = await makeWebDir();
  await execFileAsync(process.execPath, [scriptPath], {
    cwd: webDir,
    env: clearBuildMetadataEnv(process.env),
  });

  const metadata = await readGeneratedMetadata(webDir);
  assert.equal(metadata.gitSha, null);
  assert.equal(metadata.gitRef, null);
  assert.equal(metadata.metadataSource, 'unknown');
});
