import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const dockerfilePath = path.resolve('apps/api/Dockerfile');

const requiredArgs = [
  'SOURCE_COMMIT',
  'COOLIFY_GIT_COMMIT_SHA',
  'COOLIFY_COMMIT_SHA',
  'GITHUB_SHA',
];

test('keeps provenance args inherited and never clears Coolify build-stage injection', async () => {
  const dockerfile = await readFile(dockerfilePath, 'utf8');
  const globalAndBase = dockerfile.match(/^([\s\S]*?)FROM base AS deps/m);
  const buildStage = dockerfile.match(/FROM deps AS build([\s\S]*?)FROM node:20-bookworm-slim AS runtime/);

  assert.ok(globalAndBase, 'expected global and base stage blocks in apps/api/Dockerfile');
  assert.ok(buildStage, 'expected build stage block in apps/api/Dockerfile');

  for (const argName of requiredArgs) {
    assert.match(
      globalAndBase[1],
      new RegExp(`^ARG ${argName}$`, 'm'),
      `expected ${argName} to be declared for ordinary local --build-arg usage`
    );
    assert.doesNotMatch(
      buildStage[1],
      new RegExp(`^ARG ${argName}(?:=|$)`, 'm'),
      `build-stage ${argName} redeclaration would overwrite Coolify's injected literal`
    );
  }

  const gitCopyIndex = dockerfile.indexOf('COPY .git .git');
  const writerIndex = dockerfile.indexOf('node apps/api/scripts/writeApiSourceCommit.mjs');
  const gitRemovalIndex = dockerfile.indexOf('RUN rm -rf .git');

  assert.ok(gitCopyIndex >= 0, 'expected filtered git metadata to be available as a provenance fallback');
  assert.ok(gitCopyIndex < writerIndex, 'git metadata must be copied before provenance is resolved');
  assert.ok(gitRemovalIndex > writerIndex, 'git metadata must be removed after provenance is resolved');
});

test('Docker context exposes only the git metadata needed by the provenance fallback', async () => {
  const dockerignore = await readFile(path.resolve('.dockerignore'), 'utf8');

  assert.match(dockerignore, /^\.git\/\*$/m);
  assert.match(dockerignore, /^!\.git\/HEAD$/m);
  assert.match(dockerignore, /^!\.git\/refs$/m);
  assert.match(dockerignore, /^!\.git\/refs\/\*\*$/m);
  assert.match(dockerignore, /^!\.git\/packed-refs$/m);
});
