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

test('consumes provenance build args in an ancestor stage and does not redeclare them in build stage', async () => {
  const dockerfile = await readFile(dockerfilePath, 'utf8');
  const baseStage = dockerfile.match(/FROM node:20-bookworm-slim AS base([\s\S]*?)FROM base AS deps/);
  const buildStage = dockerfile.match(/FROM deps AS build([\s\S]*?)FROM node:20-bookworm-slim AS runtime/);

  assert.ok(baseStage, 'expected base stage block in apps/api/Dockerfile');
  assert.ok(buildStage, 'expected build stage block in apps/api/Dockerfile');

  for (const argName of requiredArgs) {
    assert.match(
      baseStage[1],
      new RegExp(`^ARG ${argName}$`, 'm'),
      `expected ancestor stage to consume ${argName}`
    );
    assert.doesNotMatch(
      buildStage[1],
      new RegExp(`^ARG ${argName}$`, 'm'),
      `did not expect build stage to redeclare ${argName}`
    );
  }

  assert.doesNotMatch(
    dockerfile,
    /^COPY \.git(?:\/|\s)/m,
    'remote Docker contexts must not require excluded .git files'
  );
});
