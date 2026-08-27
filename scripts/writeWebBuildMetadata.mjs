#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const webDir = path.resolve(process.cwd());
const repoRoot = path.resolve(webDir, '..', '..');
const outputDir = path.join(webDir, '.build-meta');
const outputPath = path.join(outputDir, 'BUILD_META.json');
const githubBranchApiUrl =
  'https://api.github.com/repos/Wroblewski-Patryk/Soar/commits/main';

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
    'COOLIFY_COMMIT_SHA',
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

  try {
    const gitSha = await readGitShaFromGithubBranch();
    if (gitSha) {
      return {
        gitSha,
        metadataSource: 'github-branch',
      };
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
    'COOLIFY_BRANCH',
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

const readGitShaFromGithubBranch = async () => {
  if (typeof fetch !== 'function') return null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(githubBranchApiUrl, {
        headers: {
          accept: 'application/vnd.github+json',
          'user-agent': 'soar-web-build-metadata',
        },
        signal: controller.signal,
      });

      if (!response.ok) return null;

      const payload = await response.json();
      const gitSha =
        typeof payload?.sha === 'string' && payload.sha.trim()
          ? payload.sha.trim()
          : null;
      if (gitSha) return gitSha;
    } catch {
      // Retry transient network failures inside Coolify builds.
    } finally {
      clearTimeout(timeout);
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
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
