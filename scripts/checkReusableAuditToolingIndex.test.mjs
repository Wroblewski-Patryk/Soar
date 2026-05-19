import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReusableAuditToolingIndex } from './checkReusableAuditToolingIndex.mjs';

const toolIds = [
  'AUDIT-MANIFEST-CHECK',
  'AUDIT-MANIFEST-CHECK-TEST',
  'AUDIT-MANIFEST-COMPARE',
  'AUDIT-MANIFEST-COMPARE-TEST',
  'AUDIT-MANIFEST-VERIFY',
  'AUDIT-RERUN-PLAYBOOK-CHECK',
  'AUDIT-RERUN-PLAYBOOK-CHECK-TEST',
  'AUDIT-TOOLING-INDEX-CHECK',
  'AUDIT-TOOLING-INDEX-CHECK-TEST',
  'AUDIT-DATA-DB-ISOLATED',
  'API-ENDPOINT-DOCS-PARITY',
  'OPS-PROTECTED-INPUTS-CHECK',
  'OPS-PROTECTED-INPUTS-CHECK-TEST',
];

const toolingIndex = (overrides = {}) => ({
  primaryCommand: 'corepack pnpm run audit:manifest:verify',
  tools: toolIds.map((id) => ({
    id,
    command: `corepack pnpm run ${id.toLowerCase()}`,
    script: 'scripts/example.mjs',
    purpose: `Purpose for ${id}`,
  })),
  safetyBoundaries: {
    architectureDecisionApplied: false,
    productionDataMutation: false,
    liveOrderSubmitCancelClose: false,
    exchangeSideMutation: false,
  },
  closureCommands: ['corepack pnpm run audit:manifest:verify'],
  cleanupChecks: ['docker compose ps'],
  ...overrides,
});

const allPathsExist = () => true;

test('validateReusableAuditToolingIndex passes complete indexes', () => {
  const result = validateReusableAuditToolingIndex(toolingIndex(), { exists: allPathsExist });

  assert.equal(result.status, 'PASS');
  assert.equal(result.tools.found, toolIds.length);
  assert.deepEqual(result.tools.missing, []);
  assert.deepEqual(result.tools.missingScripts, []);
  assert.deepEqual(result.safetyBoundaries.unsafe, []);
});

test('validateReusableAuditToolingIndex fails when a required tool is missing', () => {
  const result = validateReusableAuditToolingIndex(
    toolingIndex({
      tools: toolingIndex().tools.filter((tool) => tool.id !== 'AUDIT-MANIFEST-VERIFY'),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.tools.missing, ['AUDIT-MANIFEST-VERIFY']);
});

test('validateReusableAuditToolingIndex fails on duplicate tools', () => {
  const base = toolingIndex();
  const result = validateReusableAuditToolingIndex(
    toolingIndex({
      tools: [...base.tools, base.tools[0]],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.tools.duplicates, ['AUDIT-MANIFEST-CHECK']);
});

test('validateReusableAuditToolingIndex fails when a referenced script is missing', () => {
  const result = validateReusableAuditToolingIndex(toolingIndex(), {
    exists: (relativePath) => relativePath !== 'scripts/example.mjs',
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.tools.missingScripts, ['scripts/example.mjs']);
});

test('validateReusableAuditToolingIndex fails when safety boundaries are unsafe', () => {
  const result = validateReusableAuditToolingIndex(
    toolingIndex({
      safetyBoundaries: {
        architectureDecisionApplied: true,
        productionDataMutation: false,
        liveOrderSubmitCancelClose: true,
        exchangeSideMutation: false,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.safetyBoundaries.unsafe, [
    'architectureDecisionApplied',
    'liveOrderSubmitCancelClose',
  ]);
});
