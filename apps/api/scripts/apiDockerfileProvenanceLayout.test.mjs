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

  assert.doesNotMatch(
    dockerfile,
    /^COPY \.git(?:\/|\s)/m,
    'Coolify remote Docker contexts do not expose the checkout .git directory'
  );
});
