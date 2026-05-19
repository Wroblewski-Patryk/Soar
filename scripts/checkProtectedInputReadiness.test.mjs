import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildProtectedInputReadinessMarkdown,
  evaluateProtectedInputReadiness,
} from './checkProtectedInputReadiness.mjs';

test('evaluateProtectedInputReadiness reports blocked when no protected names exist', () => {
  const result = evaluateProtectedInputReadiness({
    env: {
      PATH: 'should-not-be-reported',
      NODE_ENV: 'test',
    },
    date: '2026-05-19',
    expectedSha: 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac',
    gitRef: 'main',
  });

  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.matchingProtectedInputNamesPresent, 0);
  assert.equal(result.observedOutput, 'NO_MATCHING_PROTECTED_INPUT_NAMES_PRESENT');
  assert.equal(result.target.gitSha, 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac');
});

test('evaluateProtectedInputReadiness counts matching names without exposing values', () => {
  const result = evaluateProtectedInputReadiness({
    env: {
      LIVEIMPORT_READBACK_AUTH_TOKEN: 'secret-token',
      ROLLBACK_GUARD_AUTH_EMAIL: 'ops@example.invalid',
      ROLLBACK_GUARD_AUTH_PASSWORD: 'secret-password',
      PROD_DB_CHECK_CONTAINER: 'prod-db',
    },
    date: '2026-05-19',
  });

  assert.equal(result.status, 'PARTIAL');
  assert.equal(result.matchingProtectedInputNamesPresent, 4);
  assert.equal(
    result.families.find((family) => family.family === 'LIVEIMPORT_READBACK_*')?.matchingNamesPresent,
    1,
  );
  assert.equal(JSON.stringify(result).includes('secret-token'), false);
  assert.equal(JSON.stringify(result).includes('secret-password'), false);
  assert.equal(JSON.stringify(result).includes('ops@example.invalid'), false);
});

test('buildProtectedInputReadinessMarkdown includes counts but not values', () => {
  const result = evaluateProtectedInputReadiness({
    env: {
      PROD_UI_AUDIT_AUTH_TOKEN: 'secret-token',
    },
    date: '2026-05-19',
    expectedSha: 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac',
    buildInfoCheckedAt: '2026-05-19T04:11:46.793Z',
  });
  const markdown = buildProtectedInputReadinessMarkdown(result);

  assert.match(markdown, /Matching protected input names present: `1`/);
  assert.match(markdown, /\| `PROD_UI_AUDIT_\*` \| present \| 1 \|/);
  assert.equal(markdown.includes('secret-token'), false);
});
