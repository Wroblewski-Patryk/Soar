import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReusableAuditRerunPlaybook } from './checkReusableAuditRerunPlaybook.mjs';

const auditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);

const playbook = (overrides = {}) => ({
  baseline: {
    manifest: 'history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json',
    rollup: 'history/audits/full-reusable-audit-rollup-2026-05-19.md',
    rollupJson: 'history/artifacts/full-reusable-audit-rollup-2026-05-19.json',
  },
  rerunOrder: [
    { step: 1, auditIds: auditIds.slice(0, 8) },
    { step: 2, auditIds: auditIds.slice(8, 16) },
    { step: 3, auditIds: auditIds.slice(16, 24) },
  ],
  futureManifestCommands: {
    check: 'corepack pnpm run audit:manifest:check -- --manifest history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
    compare: 'corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
    compareJson: 'corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json --json-output history/audits/reusable-audit-manifest-comparison-YYYY-MM-DD.json',
  },
  preconditions: ['read registry'],
  regressionRules: ['missing audit'],
  improvementRules: ['partial becomes current'],
  stopConditions: ['decision required'],
  closureChecks: [
    'corepack pnpm run audit:manifest:verify',
    'corepack pnpm run audit:rerun-playbook:check',
    'corepack pnpm run audit:remediation-plan:check',
    'corepack pnpm run docs:parity:check',
    'corepack pnpm run quality:guardrails',
    'git diff --check',
  ],
  cleanupChecks: [
    'Get-Process chrome-headless-shell -ErrorAction SilentlyContinue',
    'Get-NetTCPConnection -LocalPort 5432,6379 -ErrorAction SilentlyContinue',
    'docker compose ps',
  ],
  safetyBoundaries: {
    productionDataMutationWithoutApproval: false,
    liveOrderSubmitCancelCloseWithoutApproval: false,
    exchangeSideMutationWithoutApproval: false,
    architectureDecisionApplied: false,
    runtimeBehaviorChanged: false,
  },
  ...overrides,
});
const allPathsExist = () => true;

test('validateReusableAuditRerunPlaybook passes complete playbooks', () => {
  const result = validateReusableAuditRerunPlaybook(playbook(), { exists: allPathsExist });

  assert.equal(result.status, 'PASS');
  assert.equal(result.audits.found, 24);
  assert.deepEqual(result.audits.missing, []);
  assert.deepEqual(result.baseline.missingKeys, []);
  assert.deepEqual(result.baseline.invalidPaths, []);
  assert.deepEqual(result.baseline.missingPaths, []);
  assert.deepEqual(result.sections.missing, []);
  assert.deepEqual(result.safetyBoundaries.unsafe, []);
});

test('validateReusableAuditRerunPlaybook fails when baseline keys are missing', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      baseline: {
        manifest: 'history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json',
        rollup: 'history/audits/full-reusable-audit-rollup-2026-05-19.md',
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.baseline.missingKeys, ['rollupJson']);
});

test('validateReusableAuditRerunPlaybook fails when baseline paths are missing', () => {
  const result = validateReusableAuditRerunPlaybook(playbook(), {
    exists: (relativePath) => relativePath !== 'history/artifacts/full-reusable-audit-rollup-2026-05-19.json',
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.baseline.missingPaths, [
    {
      key: 'rollupJson',
      path: 'history/artifacts/full-reusable-audit-rollup-2026-05-19.json',
    },
  ]);
});

test('validateReusableAuditRerunPlaybook fails when baseline values are not repository paths', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      baseline: {
        manifest: '',
        rollup: 'https://example.test/rollup.md',
        rollupJson: 'history/artifacts/full-reusable-audit-rollup-2026-05-19.json',
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.baseline.invalidPaths, [
    { key: 'manifest', value: '' },
    { key: 'rollup', value: 'https://example.test/rollup.md' },
  ]);
});

test('validateReusableAuditRerunPlaybook fails when an audit is missing', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      rerunOrder: [{ step: 1, auditIds: auditIds.filter((auditId) => auditId !== 'AUD-20') }],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.audits.missing, ['AUD-20']);
});

test('validateReusableAuditRerunPlaybook fails on duplicate audits', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      rerunOrder: [{ step: 1, auditIds: [...auditIds, 'AUD-01'] }],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.audits.duplicates, ['AUD-01']);
});

test('validateReusableAuditRerunPlaybook fails when required future commands are missing', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      futureManifestCommands: {
        check: 'corepack pnpm run audit:manifest:check -- --manifest history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
      },
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.commands.missingFutureCommands, ['compare', 'compareJson']);
});

test('validateReusableAuditRerunPlaybook fails when compareJson does not persist output', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      futureManifestCommands: {
        check: 'corepack pnpm run audit:manifest:check -- --manifest history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
        compare: 'corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
        compareJson: 'corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/audits/reusable-audit-artifact-manifest-YYYY-MM-DD.json --json',
      },
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.equal(result.commands.compareJsonWithoutOutput, true);
});

test('validateReusableAuditRerunPlaybook fails when safety boundaries are unsafe', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      safetyBoundaries: {
        productionDataMutationWithoutApproval: true,
        liveOrderSubmitCancelCloseWithoutApproval: false,
        exchangeSideMutationWithoutApproval: false,
        architectureDecisionApplied: false,
        runtimeBehaviorChanged: true,
      },
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.safetyBoundaries.unsafe, [
    'productionDataMutationWithoutApproval',
    'runtimeBehaviorChanged',
  ]);
});

test('validateReusableAuditRerunPlaybook fails when required sections are empty', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      stopConditions: [],
      cleanupChecks: [],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.sections.missing, ['stopConditions', 'cleanupChecks']);
});

test('validateReusableAuditRerunPlaybook fails when required closure checks are missing', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      closureChecks: ['corepack pnpm run docs:parity:check', 'git diff --check'],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.closureChecks.missingRequiredFragments, [
    'audit:manifest:verify',
    'audit:rerun-playbook:check',
    'audit:remediation-plan:check',
    'quality:guardrails',
  ]);
});

test('validateReusableAuditRerunPlaybook fails when required cleanup checks are missing', () => {
  const result = validateReusableAuditRerunPlaybook(
    playbook({
      cleanupChecks: ['docker compose ps'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.cleanupChecks.missingRequiredFragments, [
    'chrome-headless-shell',
    'Get-NetTCPConnection',
  ]);
});
