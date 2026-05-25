import test from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateCoolifyStackEnv,
  formatCoolifyStackEnvReport,
  parseDotEnv,
} from './checkCoolifyStackEnv.mjs';

test('parseDotEnv reads unquoted and quoted values', () => {
  const env = parseDotEnv(`
    FOO=bar
    QUOTED="hello world"
    # ignored
  `);

  assert.equal(env.FOO, 'bar');
  assert.equal(env.QUOTED, 'hello world');
});

test('evaluateCoolifyStackEnv fails missing required names without printing values', () => {
  const result = evaluateCoolifyStackEnv({
    env: {
      SOURCE_COMMIT: 'abc123',
    },
    requiredKeys: ['SOURCE_COMMIT', 'DATABASE_URL'],
    recommendedKeys: ['JWT_SECRET'],
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.missingRequired, ['DATABASE_URL']);
  assert.deepEqual(result.missingRecommended, ['JWT_SECRET']);

  const report = formatCoolifyStackEnvReport(result);
  assert.match(report, /DATABASE_URL/);
  assert.doesNotMatch(report, /abc123/);
});

test('evaluateCoolifyStackEnv rejects placeholders unless allowed', () => {
  const env = {
    SOURCE_COMMIT: 'CHANGEME_EXPECTED_GIT_SHA',
    DATABASE_URL: 'postgresql://prod',
  };

  const strictResult = evaluateCoolifyStackEnv({
    env,
    requiredKeys: ['SOURCE_COMMIT', 'DATABASE_URL'],
    recommendedKeys: [],
  });
  assert.equal(strictResult.status, 'FAIL');
  assert.deepEqual(strictResult.placeholderRequired, ['SOURCE_COMMIT']);

  const exampleResult = evaluateCoolifyStackEnv({
    env,
    allowPlaceholders: true,
    requiredKeys: ['SOURCE_COMMIT', 'DATABASE_URL'],
    recommendedKeys: [],
  });
  assert.equal(exampleResult.status, 'PASS');
});
