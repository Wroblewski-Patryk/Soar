import test from 'node:test';
import assert from 'node:assert/strict';

import { validateFullReusableAuditHandoff } from './checkFullReusableAuditHandoff.mjs';

const sourceOfTruth = {
  product: '.codex/context/PROJECT_STATE.md',
  architecture: 'docs/architecture/**',
  auditRegistry: 'docs/analysis/reusable-audit-registry.md',
  auditBaseline: 'history/audits/audit-baseline-2026-05-19.md',
  handoff: 'history/audits/full-reusable-audit-handoff-2026-05-19.md',
  handoffJson: 'history/artifacts/full-reusable-audit-handoff-2026-05-19.json',
  rollup: 'history/audits/full-reusable-audit-rollup-2026-05-19.md',
  rollupJson: 'history/artifacts/full-reusable-audit-rollup-2026-05-19.json',
  rerunPlaybook: 'history/audits/reusable-audit-rerun-playbook-2026-05-19.md',
  rerunPlaybookJson: 'history/artifacts/reusable-audit-rerun-playbook-2026-05-19.json',
  toolingIndex: 'history/audits/reusable-audit-tooling-index-2026-05-19.md',
  toolingIndexJson: 'history/artifacts/reusable-audit-tooling-index-2026-05-19.json',
  decisionPacket: 'history/audits/audit-decision-packet-2026-05-19.md',
  repairPlaybooks: 'history/audits/audit-decision-repair-playbooks-2026-05-19.md',
  taskBoard: '.codex/context/TASK_BOARD.md',
  nextSteps: '.agents/state/next-steps.md',
  riskRegister: '.agents/state/risk-register.md',
  requirementsMatrix: '.agents/state/requirements-verification-matrix.md',
  operationsAudit: 'history/audits/operations-release-deployment-audit-2026-05-19.md',
};

const handoff = (overrides = {}) => ({
  handoffId: 'FULL-REUSABLE-AUDIT-HANDOFF-2026-05-19',
  sourceOfTruth,
  rollupSummary: {
    currentOrCurrentLocal: 23,
    partial: 0,
    failedDecisionRequired: 0,
    deferred: 1,
    currentFromPriorBaseline: 0,
  },
  residualRisks: [
    { id: 'AUD-19', summary: 'Production readiness remains historical.' },
    { id: 'GATEIO-PRODUCTION-LIVE', summary: 'Gate.io proof required.' },
    { id: 'ASSISTANT-HOT-PATH', summary: 'AI hot-path proof required.' },
  ],
  forbiddenWithoutApproval: [
    'production data mutation',
    'LIVE order submit/cancel/close',
    'exchange-side mutation',
    'runtime AI hot-path behavior without a separate approved AI/security task',
  ],
  latestValidation: [
    'corepack pnpm run audit:manifest:verify PASS',
    'corepack pnpm run audit:handoff:check PASS',
    'corepack pnpm run docs:parity:check PASS',
    'corepack pnpm run docs:parity:endpoints:api PASS',
    'corepack pnpm run i18n:audit:route-reachable:web PASS',
    'corepack pnpm run quality:guardrails PASS',
    'git diff --check PASS',
    'no chrome-headless-shell process left running',
    'no listeners on local 5432 or 6379',
    'docker compose ps showed no running services',
  ],
  runtimeBehaviorChanged: false,
  productionJourneyRun: false,
  liveExchangeMutationRun: false,
  ...overrides,
});

const allPathsExist = () => true;
const rollupSummary = {
  currentOrCurrentLocal: 23,
  partial: 0,
  failedDecisionRequired: 0,
  deferred: 1,
  currentFromPriorBaseline: 0,
};

test('validateFullReusableAuditHandoff passes complete handoffs', () => {
  const result = validateFullReusableAuditHandoff(handoff(), { exists: allPathsExist, rollupSummary });

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.sourceOfTruth.missingKeys, []);
  assert.deepEqual(result.sourceOfTruth.missingPaths, []);
  assert.deepEqual(result.rollupSummary.missingKeys, []);
  assert.deepEqual(result.rollupSummary.mismatches, []);
  assert.deepEqual(result.residualRisks.missing, []);
});

test('validateFullReusableAuditHandoff fails when required source keys are missing', () => {
  const partialSourceOfTruth = { ...sourceOfTruth };
  delete partialSourceOfTruth.handoff;
  delete partialSourceOfTruth.handoffJson;
  delete partialSourceOfTruth.operationsAudit;
  delete partialSourceOfTruth.toolingIndex;
  delete partialSourceOfTruth.toolingIndexJson;
  const result = validateFullReusableAuditHandoff(
    handoff({
      sourceOfTruth: partialSourceOfTruth,
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.sourceOfTruth.missingKeys, [
    'handoff',
    'handoffJson',
    'toolingIndex',
    'toolingIndexJson',
    'operationsAudit',
  ]);
});

test('validateFullReusableAuditHandoff fails when referenced source paths are missing', () => {
  const result = validateFullReusableAuditHandoff(handoff(), {
    exists: (relativePath) => relativePath !== 'history/audits/full-reusable-audit-rollup-2026-05-19.md',
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.sourceOfTruth.missingPaths, [
    {
      key: 'rollup',
      path: 'history/audits/full-reusable-audit-rollup-2026-05-19.md',
    },
  ]);
});

test('validateFullReusableAuditHandoff fails when rollup summary keys are missing', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      rollupSummary: {
        currentOrCurrentLocal: 23,
        partial: 0,
        failedDecisionRequired: 0,
        deferred: 1,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.rollupSummary.missingKeys, ['currentFromPriorBaseline']);
});

test('validateFullReusableAuditHandoff fails when rollup summary drifts from rollup JSON', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      rollupSummary: {
        ...rollupSummary,
        currentOrCurrentLocal: 24,
      },
    }),
    { exists: allPathsExist, rollupSummary },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.rollupSummary.mismatches, [
    {
      key: 'currentOrCurrentLocal',
      declared: 24,
      actual: 23,
    },
  ]);
});

test('validateFullReusableAuditHandoff fails when required residual risks are missing', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      residualRisks: [{ id: 'AUD-19', summary: 'Production readiness remains historical.' }],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.residualRisks.missing, ['GATEIO-PRODUCTION-LIVE', 'ASSISTANT-HOT-PATH']);
});

test('validateFullReusableAuditHandoff fails when forbidden boundaries are incomplete', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      forbiddenWithoutApproval: ['production data mutation'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.forbiddenWithoutApproval.missingFragments, [
    'LIVE order submit/cancel/close',
    'exchange-side mutation',
    'runtime AI hot-path behavior',
  ]);
});

test('validateFullReusableAuditHandoff fails when latest validation omits required checks', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      latestValidation: ['corepack pnpm run audit:manifest:verify PASS'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.latestValidation.missingFragments, [
    'audit:handoff:check',
    'docs:parity:check',
    'docs:parity:endpoints:api',
    'i18n:audit:route-reachable:web',
    'quality:guardrails',
    'git diff --check',
  ]);
});

test('validateFullReusableAuditHandoff fails when latest validation omits cleanup checks', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      latestValidation: [
        'corepack pnpm run audit:manifest:verify PASS',
        'corepack pnpm run audit:handoff:check PASS',
        'corepack pnpm run docs:parity:check PASS',
        'corepack pnpm run docs:parity:endpoints:api PASS',
        'corepack pnpm run i18n:audit:route-reachable:web PASS',
        'corepack pnpm run quality:guardrails PASS',
        'git diff --check PASS',
        'no chrome-headless-shell process left running',
      ],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.latestValidation.missingCleanupFragments, [
    '5432',
    '6379',
    'docker compose ps',
  ]);
});

test('validateFullReusableAuditHandoff fails when safety booleans are unsafe', () => {
  const result = validateFullReusableAuditHandoff(
    handoff({
      runtimeBehaviorChanged: true,
      liveExchangeMutationRun: true,
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.safetyBooleans.unsafe, ['liveExchangeMutationRun', 'runtimeBehaviorChanged']);
});
