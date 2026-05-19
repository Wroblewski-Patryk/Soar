import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReusableAuditRerunPlaybook } from './checkReusableAuditRerunPlaybook.mjs';

const auditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);

const playbook = (overrides = {}) => ({
  rerunOrder: [
    { step: 1, auditIds: auditIds.slice(0, 8) },
    { step: 2, auditIds: auditIds.slice(8, 16) },
    { step: 3, auditIds: auditIds.slice(16, 24) },
  ],
  futureManifestCommands: {
    check: 'corepack pnpm run audit:manifest:check -- --manifest docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
    compare: 'corepack pnpm run audit:manifest:compare -- --base docs/operations/reusable-audit-artifact-manifest-2026-05-19.json --target docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
    compareJson: 'corepack pnpm run audit:manifest:compare -- --base docs/operations/reusable-audit-artifact-manifest-2026-05-19.json --target docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json --json',
  },
  preconditions: ['read registry'],
  regressionRules: ['missing audit'],
  improvementRules: ['partial becomes current'],
  stopConditions: ['decision required'],
  closureChecks: ['corepack pnpm run docs:parity:check'],
  cleanupChecks: ['docker compose ps'],
  safetyBoundaries: {
    productionDataMutationWithoutApproval: false,
    liveOrderSubmitCancelCloseWithoutApproval: false,
    exchangeSideMutationWithoutApproval: false,
    architectureDecisionApplied: false,
    runtimeBehaviorChanged: false,
  },
  ...overrides,
});

test('validateReusableAuditRerunPlaybook passes complete playbooks', () => {
  const result = validateReusableAuditRerunPlaybook(playbook());

  assert.equal(result.status, 'PASS');
  assert.equal(result.audits.found, 24);
  assert.deepEqual(result.audits.missing, []);
  assert.deepEqual(result.sections.missing, []);
  assert.deepEqual(result.safetyBoundaries.unsafe, []);
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
        check: 'corepack pnpm run audit:manifest:check -- --manifest docs/operations/reusable-audit-artifact-manifest-YYYY-MM-DD.json',
      },
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.commands.missingFutureCommands, ['compare', 'compareJson']);
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
