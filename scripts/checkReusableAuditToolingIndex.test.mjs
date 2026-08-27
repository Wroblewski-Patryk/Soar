import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReusableAuditToolingIndex } from './checkReusableAuditToolingIndex.mjs';

const toolIds = [
  'AUDIT-MANIFEST-CHECK',
  'AUDIT-MANIFEST-CHECK-TEST',
  'AUDIT-MANIFEST-COMPARE',
  'AUDIT-MANIFEST-COMPARE-TEST',
  'AUDIT-MANIFEST-VERIFY',
  'AUDIT-ROLLUP-CHECK',
  'AUDIT-ROLLUP-CHECK-TEST',
  'AUDIT-RERUN-PLAYBOOK-CHECK',
  'AUDIT-RERUN-PLAYBOOK-CHECK-TEST',
  'AUDIT-HANDOFF-CHECK',
  'AUDIT-HANDOFF-CHECK-TEST',
  'AUDIT-REMEDIATION-PLAN-CHECK',
  'AUDIT-REMEDIATION-PLAN-CHECK-TEST',
  'AUDIT-TOOLING-INDEX-CHECK',
  'AUDIT-TOOLING-INDEX-CHECK-TEST',
  'AUDIT-DATA-DB-ISOLATED',
  'API-ENDPOINT-DOCS-PARITY',
  'OPS-PROTECTED-INPUTS-CHECK',
  'OPS-PROTECTED-INPUTS-CHECK-TEST',
  'OPS-OPERATOR-UNBLOCK-CHECK',
  'OPS-OPERATOR-UNBLOCK-CHECK-TEST',
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
  closureCommands: [
    'corepack pnpm run audit:manifest:verify',
    'corepack pnpm run audit:remediation-plan:check',
    'corepack pnpm run audit:tooling-index:check',
    'corepack pnpm run docs:parity:check',
    'corepack pnpm run quality:guardrails',
    'git diff --check',
  ],
  cleanupChecks: [
    'Get-Process chrome-headless-shell -ErrorAction SilentlyContinue',
    'Get-NetTCPConnection -LocalPort 5432,6379 -ErrorAction SilentlyContinue',
    'docker compose ps',
  ],
  ...overrides,
});

const allPathsExist = () => true;
const packageScripts = Object.fromEntries(toolIds.map((id) => [id.toLowerCase(), 'mock command']));
const markdownText = toolIds.map((id) => `| \`${id}\` | command | script | purpose |`).join('\n');

test('validateReusableAuditToolingIndex passes complete indexes', () => {
  const result = validateReusableAuditToolingIndex(toolingIndex(), {
    exists: allPathsExist,
    packageScripts,
    markdownText,
  });

  assert.equal(result.status, 'PASS');
  assert.equal(result.tools.found, toolIds.length);
  assert.deepEqual(result.tools.missing, []);
  assert.deepEqual(result.tools.missingMarkdownToolIds, []);
  assert.deepEqual(result.tools.missingScripts, []);
  assert.deepEqual(result.safetyBoundaries.unsafe, []);
});

test('validateReusableAuditToolingIndex fails when a required tool is missing', () => {
  const result = validateReusableAuditToolingIndex(
    toolingIndex({
      tools: toolingIndex().tools.filter((tool) => tool.id !== 'AUDIT-MANIFEST-VERIFY'),
    }),
    { exists: allPathsExist, packageScripts },
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
    { exists: allPathsExist, packageScripts },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.tools.duplicates, ['AUDIT-MANIFEST-CHECK']);
});

test('validateReusableAuditToolingIndex fails when a referenced script is missing', () => {
  const result = validateReusableAuditToolingIndex(toolingIndex(), {
    exists: (relativePath) => relativePath !== 'scripts/example.mjs',
    packageScripts,
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
    { exists: allPathsExist, packageScripts },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.safetyBoundaries.unsafe, [
    'architectureDecisionApplied',
    'liveOrderSubmitCancelClose',
  ]);
});

test('validateReusableAuditToolingIndex fails when required closure commands are missing', () => {
  const result = validateReusableAuditToolingIndex(
    toolingIndex({
      closureCommands: ['corepack pnpm run audit:manifest:verify', 'git diff --check'],
    }),
    { exists: allPathsExist, packageScripts },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.commands.missingClosureCommandFragments, [
    'audit:remediation-plan:check',
    'audit:tooling-index:check',
    'docs:parity:check',
    'quality:guardrails',
  ]);
});

test('validateReusableAuditToolingIndex fails when required cleanup checks are missing', () => {
  const result = validateReusableAuditToolingIndex(
    toolingIndex({
      cleanupChecks: ['docker compose ps'],
    }),
    { exists: allPathsExist, packageScripts },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.commands.missingCleanupCheckFragments, [
    'chrome-headless-shell',
    'Get-NetTCPConnection',
  ]);
});

test('validateReusableAuditToolingIndex fails when a pnpm run command is missing from package scripts', () => {
  const { 'audit-manifest-verify': _missing, ...packageScriptsWithoutVerify } = packageScripts;
  const result = validateReusableAuditToolingIndex(toolingIndex(), {
    exists: allPathsExist,
    packageScripts: packageScriptsWithoutVerify,
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.tools.missingPackageScripts, [
    {
      id: 'AUDIT-MANIFEST-VERIFY',
      scriptName: 'audit-manifest-verify',
    },
  ]);
});

test('validateReusableAuditToolingIndex fails when companion markdown omits a tool id', () => {
  const result = validateReusableAuditToolingIndex(toolingIndex(), {
    exists: allPathsExist,
    packageScripts,
    markdownText: markdownText.replace('| `AUDIT-HANDOFF-CHECK` | command | script | purpose |', ''),
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.tools.missingMarkdownToolIds, ['AUDIT-HANDOFF-CHECK']);
});
