import test from 'node:test';
import assert from 'node:assert/strict';

import { validateFullReusableAuditRollup } from './checkFullReusableAuditRollup.mjs';

const auditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);
const rollup = (overrides = {}) => ({
  productionMutation: false,
  liveOrderCancelClose: false,
  exchangeSideMutation: false,
  existingProductionDataMutation: false,
  decisionPacket: 'docs/operations/audit-decision-packet-2026-05-19.md',
  decisionRepairPlaybooks: 'docs/operations/audit-decision-repair-playbooks-2026-05-19.md',
  handoff: 'docs/operations/full-reusable-audit-handoff-2026-05-19.md',
  handoffJson: 'docs/operations/full-reusable-audit-handoff-2026-05-19.json',
  artifactManifest: 'docs/operations/reusable-audit-artifact-manifest-2026-05-19.md',
  artifactManifestJson: 'docs/operations/reusable-audit-artifact-manifest-2026-05-19.json',
  summary: {
    currentOrCurrentLocal: 23,
    partial: 0,
    failedDecisionRequired: 0,
    deferred: 1,
  },
  audits: auditIds.map((id) => ({
    id,
    status: id === 'AUD-21' ? 'deferred / scaffold-only scope verified' : 'current local',
  })),
  priorityRepairQueue: [
    'AUD-19 fresh production release gate before new production readiness claim',
    'Future hot-path assistant orchestration implementation and AI red-team proof before any runtime AI trading claim',
    'Future Gate.io production/live proof by exact exchange, market type, and operation before any production readiness claim',
  ],
  ...overrides,
});

const allPathsExist = () => true;

test('validateFullReusableAuditRollup passes complete rollups', () => {
  const result = validateFullReusableAuditRollup(rollup(), { exists: allPathsExist });

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.audits.missing, []);
  assert.deepEqual(result.summary.mismatches, []);
  assert.deepEqual(result.paths.missing, []);
});

test('validateFullReusableAuditRollup fails when an audit id is missing', () => {
  const result = validateFullReusableAuditRollup(
    rollup({
      audits: rollup().audits.filter((audit) => audit.id !== 'AUD-20'),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.audits.missing, ['AUD-20']);
});

test('validateFullReusableAuditRollup fails when summary counts drift', () => {
  const result = validateFullReusableAuditRollup(
    rollup({
      summary: {
        currentOrCurrentLocal: 24,
        partial: 0,
        failedDecisionRequired: 0,
        deferred: 0,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.summary.mismatches, [
    { key: 'currentOrCurrentLocal', declared: 24, actual: 23 },
    { key: 'deferred', declared: 0, actual: 1 },
  ]);
});

test('validateFullReusableAuditRollup treats current statuses with deferred sub-scope as current', () => {
  const result = validateFullReusableAuditRollup(
    rollup({
      audits: auditIds.map((id) => ({
        id,
        status:
          id === 'AUD-20'
            ? 'current foundation / hot-path assistant scope deferred'
            : id === 'AUD-21'
              ? 'deferred / scaffold-only scope verified'
              : 'current local',
      })),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'PASS');
  assert.equal(result.summary.computed.currentOrCurrentLocal, 23);
  assert.equal(result.summary.computed.deferred, 1);
});

test('validateFullReusableAuditRollup fails when referenced paths are missing', () => {
  const result = validateFullReusableAuditRollup(rollup(), {
    exists: (relativePath) => relativePath !== 'docs/operations/full-reusable-audit-handoff-2026-05-19.md',
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.paths.missing, [
    {
      key: 'handoff',
      path: 'docs/operations/full-reusable-audit-handoff-2026-05-19.md',
    },
  ]);
});

test('validateFullReusableAuditRollup fails when required repair queue items are missing', () => {
  const result = validateFullReusableAuditRollup(
    rollup({
      priorityRepairQueue: ['AUD-19 fresh production release gate before new production readiness claim'],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.repairQueue.missingFragments, [
    'hot-path assistant orchestration',
    'Gate.io production/live proof',
  ]);
});

test('validateFullReusableAuditRollup fails when safety booleans are unsafe', () => {
  const result = validateFullReusableAuditRollup(
    rollup({
      productionMutation: true,
      exchangeSideMutation: true,
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.safetyBooleans.unsafe, ['productionMutation', 'exchangeSideMutation']);
});
