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

test('preserves injected provenance args in the build stage without bare redeclarations', async () => {
  const dockerfile = await readFile(dockerfilePath, 'utf8');
  const buildStage = dockerfile.match(/FROM deps AS build([\s\S]*?)FROM node:20-bookworm-slim AS runtime/);

  assert.ok(buildStage, 'expected build stage block in apps/api/Dockerfile');

  for (const argName of requiredArgs) {
    assert.match(
      buildStage[1],
      new RegExp(`^ARG ${argName}=\\$${argName}$`, 'm'),
      `expected build stage to preserve injected ${argName} with an explicit default`
    );
  }

  assert.doesNotMatch(
    dockerfile,
    /^COPY \.git(?:\/|\s)/m,
    'remote Docker contexts must not require excluded .git files'
  );
});
