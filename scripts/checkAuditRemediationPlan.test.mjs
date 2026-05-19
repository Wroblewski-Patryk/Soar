import test from 'node:test';
import assert from 'node:assert/strict';

import { validateAuditRemediationPlan } from './checkAuditRemediationPlan.mjs';

const phaseIds = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const workPackageIds = Array.from({ length: 8 }, (_, index) => `WP-${String(index + 1).padStart(2, '0')}`);

const remediationPlan = (overrides = {}) => ({
  sourceMarkdown: 'docs/planning/audit-remediation-master-plan-2026-05-19.md',
  primaryEvidence: [
    'docs/operations/full-reusable-audit-rollup-2026-05-19.md',
    'docs/operations/reusable-audit-artifact-manifest-2026-05-19.json',
  ],
  priorityRoadmap: phaseIds.map((id) => ({ id, status: id === 'P0' ? 'done' : 'planned' })),
  workPackages: workPackageIds.map((id) => ({
    id,
    scope: `Scope for ${id}`,
    validation: ['corepack pnpm run audit:manifest:verify'],
    blockers: id === 'WP-03' ? ['approved protected production access'] : [],
    doneWhen: `Done condition for ${id}`,
  })),
  currentBlockers: ['Fresh AUD-19 production release evidence requires approved protected inputs.'],
  closureChecks: [
    'corepack pnpm run audit:manifest:verify',
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
    productionReadinessClaimWithoutFreshAud19: false,
  },
  ...overrides,
});

const allPathsExist = () => true;

test('validateAuditRemediationPlan passes complete plans', () => {
  const result = validateAuditRemediationPlan(remediationPlan(), { exists: allPathsExist });

  assert.equal(result.status, 'PASS');
  assert.equal(result.phases.found, 7);
  assert.equal(result.workPackages.found, 8);
  assert.deepEqual(result.safetyBoundaries.unsafe, []);
});

test('validateAuditRemediationPlan fails when a phase is missing', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      priorityRoadmap: phaseIds.filter((id) => id !== 'P6').map((id) => ({ id })),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.phases.missing, ['P6']);
});

test('validateAuditRemediationPlan fails when a work package is missing', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      workPackages: remediationPlan().workPackages.filter((workPackage) => workPackage.id !== 'WP-08'),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.workPackages.missing, ['WP-08']);
});

test('validateAuditRemediationPlan fails when safety boundaries are unsafe', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      safetyBoundaries: {
        productionDataMutationWithoutApproval: false,
        liveOrderSubmitCancelCloseWithoutApproval: true,
        exchangeSideMutationWithoutApproval: false,
        architectureDecisionApplied: false,
        productionReadinessClaimWithoutFreshAud19: true,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.safetyBoundaries.unsafe, [
    'liveOrderSubmitCancelCloseWithoutApproval',
    'productionReadinessClaimWithoutFreshAud19',
  ]);
});

test('validateAuditRemediationPlan fails without an AUD-19 blocker', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      currentBlockers: ['Independent security review is not scheduled.'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.equal(result.blockers.missingAud19Blocker, true);
});

test('validateAuditRemediationPlan fails when closure checks are incomplete', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      closureChecks: ['corepack pnpm run audit:manifest:verify'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.closureChecks.missing, [
    'audit:remediation-plan:check',
    'docs:parity:check',
    'quality:guardrails',
    'git diff --check',
  ]);
});

test('validateAuditRemediationPlan fails when required cleanup checks are missing', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      cleanupChecks: ['docker compose ps'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.cleanupChecks.missing, [
    'chrome-headless-shell',
    'Get-NetTCPConnection',
  ]);
});

test('validateAuditRemediationPlan fails when referenced evidence is missing', () => {
  const result = validateAuditRemediationPlan(remediationPlan(), {
    exists: (relativePath) => relativePath !== 'docs/operations/full-reusable-audit-rollup-2026-05-19.md',
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.references.missing, [
    'docs/operations/full-reusable-audit-rollup-2026-05-19.md',
  ]);
});
