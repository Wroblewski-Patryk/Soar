#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const webDir = path.resolve(process.cwd());
const repoRoot = path.resolve(webDir, '..', '..');
const outputDir = path.join(webDir, '.next');
const outputPath = path.join(outputDir, 'BUILD_META.json');

const readTrimmedEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return null;
};

const resolveGitSha = async () => {
  const envSha = readTrimmedEnv(
    'SOURCE_COMMIT',
    'GITHUB_SHA',
    'COOLIFY_GIT_COMMIT_SHA',
    'VERCEL_GIT_COMMIT_SHA',
    'RAILWAY_GIT_COMMIT_SHA'
  );
  if (envSha) {
    return {
      gitSha: envSha,
      metadataSource: 'env',
    };
  }

  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: webDir,
    });
    const gitSha = stdout.trim();
    if (gitSha) {
      return {
        gitSha,
        metadataSource: 'git',
      };
    }
  } catch {
    // Fall through to repo metadata files.
  }

  try {
    const gitDir = path.join(repoRoot, '.git');
    const headRaw = (await readFile(path.join(gitDir, 'HEAD'), 'utf8')).trim();
    if (headRaw) {
      const refPrefix = 'ref: ';
      const gitSha = headRaw.startsWith(refPrefix)
        ? await readGitShaFromRef(gitDir, headRaw.slice(refPrefix.length))
        : headRaw;

      if (gitSha) {
        return {
          gitSha,
          metadataSource: 'git-files',
        };
      }
    }
  } catch {
    // Fall through to unknown metadata.
  }

  return {
    gitSha: null,
    metadataSource: 'unknown',
  };
};

const resolveGitRef = () =>
  readTrimmedEnv(
    'SOURCE_BRANCH',
    'COOLIFY_GIT_BRANCH',
    'GITHUB_REF_NAME',
    'VERCEL_GIT_COMMIT_REF',
    'RAILWAY_GIT_BRANCH'
  );

const readGitShaFromRef = async (gitDir, refName) => {
  const refPath = path.join(gitDir, refName);

  try {
    const refValue = (await readFile(refPath, 'utf8')).trim();
    if (refValue) return refValue;
  } catch {
    // Fall through to packed refs.
  }

  try {
    const packedRefs = await readFile(path.join(gitDir, 'packed-refs'), 'utf8');
    const lines = packedRefs.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('^')) continue;

      const [sha, packedRefName] = trimmed.split(' ');
      if (packedRefName === refName && sha) {
        return sha.trim();
      }
    }
  } catch {
    // Fall through to null.
  }

  return null;
};

const main = async () => {
  const { gitSha, metadataSource } = await resolveGitSha();
  const gitRef = resolveGitRef();

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    outputPath,
    JSON.stringify(
      {
        gitSha,
        gitRef,
        metadataSource,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log(
    `[writeWebBuildMetadata] wrote ${path.relative(webDir, outputPath)} (gitSha=${gitSha ?? 'n/a'}, source=${metadataSource})`
  );
};

main().catch((error) => {
  console.error(
    '[writeWebBuildMetadata] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
