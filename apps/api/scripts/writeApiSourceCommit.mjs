#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FULL_GIT_SHA = /^[0-9a-f]{40}$/i;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(apiDir, '..', '..');
const outputDir = path.join(apiDir, '.build-meta');
const outputPath = path.join(outputDir, 'SOURCE_COMMIT');

const normalizeGitSha = (candidate) => {
  if (!candidate || !FULL_GIT_SHA.test(candidate)) return null;
  return candidate.toLowerCase();
};

const readFirstValidEnvSha = (...keys) => {
  for (const key of keys) {
    const normalizedSha = normalizeGitSha(process.env[key]?.trim() ?? '');
    if (normalizedSha) return normalizedSha;
  }
  return null;
};

const readGitShaFromRef = async (gitDir, refName) => {
  const refPath = path.join(gitDir, refName);

  try {
    const refValue = normalizeGitSha((await readFile(refPath, 'utf8')).trim());
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
      if (packedRefName === refName) {
        const normalizedSha = normalizeGitSha(sha?.trim() ?? '');
        if (normalizedSha) return normalizedSha;
      }
    }
  } catch {
    // Fall through to null.
  }

  return null;
};

const resolveSourceCommit = async () => {
  const envSha = readFirstValidEnvSha(
    'SOURCE_COMMIT',
    'GITHUB_SHA',
    'COOLIFY_GIT_COMMIT_SHA',
    'COOLIFY_COMMIT_SHA'
  );
  if (envSha) {
    return {
      gitSha: envSha,
      source: 'env',
    };
  }

  try {
    const gitDir = path.join(repoRoot, '.git');
    const headRaw = (await readFile(path.join(gitDir, 'HEAD'), 'utf8')).trim();
    const refPrefix = 'ref: ';
    const gitSha = headRaw.startsWith(refPrefix)
      ? await readGitShaFromRef(gitDir, headRaw.slice(refPrefix.length))
      : normalizeGitSha(headRaw);

    if (gitSha) {
      return {
        gitSha,
        source: 'git-files',
      };
    }
  } catch {
    // Fall through to error below.
  }

  return null;
};

const main = async () => {
  const resolved = await resolveSourceCommit();
  if (!resolved) {
    throw new Error(
      'missing full SOURCE_COMMIT and no valid .git/HEAD or .git/refs fallback was available'
    );
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${resolved.gitSha}\n`);

  console.log(
    `[writeApiSourceCommit] wrote ${path.relative(apiDir, outputPath)} (source=${resolved.source})`
  );
};

main().catch((error) => {
  console.error(
    '[writeApiSourceCommit] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
