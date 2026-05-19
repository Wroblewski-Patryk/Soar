import test from 'node:test';
import assert from 'node:assert/strict';

import { validateAuditRemediationPlan } from './checkAuditRemediationPlan.mjs';

const phaseIds = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const workPackageIds = Array.from({ length: 8 }, (_, index) => `WP-${String(index + 1).padStart(2, '0')}`);

const remediationPlan = (overrides = {}) => ({
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
    'corepack pnpm run docs:parity:check',
    'corepack pnpm run quality:guardrails',
    'git diff --check',
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

test('validateAuditRemediationPlan passes complete plans', () => {
  const result = validateAuditRemediationPlan(remediationPlan());

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
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.phases.missing, ['P6']);
});

test('validateAuditRemediationPlan fails when a work package is missing', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      workPackages: remediationPlan().workPackages.filter((workPackage) => workPackage.id !== 'WP-08'),
    }),
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
  );

  assert.equal(result.status, 'FAIL');
  assert.equal(result.blockers.missingAud19Blocker, true);
});

test('validateAuditRemediationPlan fails when closure checks are incomplete', () => {
  const result = validateAuditRemediationPlan(
    remediationPlan({
      closureChecks: ['corepack pnpm run audit:manifest:verify'],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.closureChecks.missing, [
    'docs:parity:check',
    'quality:guardrails',
    'git diff --check',
  ]);
});
