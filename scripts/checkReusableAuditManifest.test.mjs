import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReusableAuditManifest } from './checkReusableAuditManifest.mjs';

const auditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);

const manifest = (overrides = {}) => ({
  audits: auditIds.map((id) => ({ id, status: 'current local' })),
  sourceChain: {
    registry: 'docs/analysis/reusable-audit-registry.md',
    baseline: 'docs/analysis/audit-baseline-2026-05-19.md',
    rollup: 'docs/operations/full-reusable-audit-rollup-2026-05-19.md',
    rollupJson: 'docs/operations/full-reusable-audit-rollup-2026-05-19.json',
    handoff: 'docs/operations/full-reusable-audit-handoff-2026-05-19.md',
    handoffJson: 'docs/operations/full-reusable-audit-handoff-2026-05-19.json',
    rerunPlaybook: 'docs/operations/reusable-audit-rerun-playbook-2026-05-19.md',
    rerunPlaybookJson: 'docs/operations/reusable-audit-rerun-playbook-2026-05-19.json',
    toolingIndex: 'docs/operations/reusable-audit-tooling-index-2026-05-19.md',
    toolingIndexJson: 'docs/operations/reusable-audit-tooling-index-2026-05-19.json',
    remediationPlan: 'docs/planning/audit-remediation-master-plan-2026-05-19.md',
    remediationPlanJson: 'docs/operations/audit-remediation-master-plan-2026-05-19.json',
    decisionPacket: 'docs/operations/audit-decision-packet-2026-05-19.md',
    repairPlaybooks: 'docs/operations/audit-decision-repair-playbooks-2026-05-19.md',
  },
  summary: {
    currentOrCurrentLocal: 24,
    partial: 0,
    failedDecisionRequired: 0,
    deferred: 0,
  },
  manifestValidation: {
    pathExistenceChecked: true,
    pathsChecked: 14,
    missingPaths: 0,
  },
  openDecisions: [
    {
      id: 'DEC-AUD-001',
      packet: 'docs/operations/audit-decision-packet-2026-05-19.md',
      playbook: 'docs/operations/audit-decision-repair-playbooks-2026-05-19.md',
    },
  ],
  ...overrides,
});

const allPathsExist = () => true;
const markdownText = `# Reusable Audit Artifact Manifest

## Current Summary

- Current/current-local: \`24\`
- Partial: \`0\`
- Failed decision-required: \`0\`
- Deferred: \`0\`
`;

test('validateReusableAuditManifest passes complete manifests', () => {
  const result = validateReusableAuditManifest(manifest(), { exists: allPathsExist, markdownText });

  assert.equal(result.status, 'PASS');
  assert.equal(result.audits.found, 24);
  assert.deepEqual(result.audits.missing, []);
  assert.deepEqual(result.audits.duplicates, []);
  assert.deepEqual(result.paths.missing, []);
  assert.deepEqual(result.sourceChain.missingKeys, []);
  assert.deepEqual(result.summary.mismatches, []);
  assert.deepEqual(result.summary.markdownMismatches, []);
  assert.deepEqual(result.manifestValidation.mismatches, []);
  assert.deepEqual(result.decisions.missingLinks, []);
});

test('validateReusableAuditManifest fails when an audit id is missing', () => {
  const result = validateReusableAuditManifest(
    manifest({
      audits: auditIds.filter((id) => id !== 'AUD-20').map((id) => ({ id })),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.audits.missing, ['AUD-20']);
});

test('validateReusableAuditManifest fails when summary counts drift from audit statuses', () => {
  const result = validateReusableAuditManifest(
    manifest({
      audits: auditIds.map((id) => ({
        id,
        status: id === 'AUD-21' ? 'deferred / scaffold-only scope verified' : 'current local',
      })),
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
    {
      key: 'currentOrCurrentLocal',
      declared: 24,
      actual: 23,
    },
    {
      key: 'deferred',
      declared: 0,
      actual: 1,
    },
  ]);
});

test('validateReusableAuditManifest treats current statuses with deferred sub-scope as current', () => {
  const result = validateReusableAuditManifest(
    manifest({
      audits: auditIds.map((id) => ({
        id,
        status: id === 'AUD-20' ? 'current foundation / hot-path assistant scope deferred' : 'current local',
      })),
      summary: {
        currentOrCurrentLocal: 24,
        partial: 0,
        failedDecisionRequired: 0,
        deferred: 0,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'PASS');
  assert.equal(result.summary.computed.currentOrCurrentLocal, 24);
  assert.equal(result.summary.computed.deferred, 0);
});

test('validateReusableAuditManifest classifies leading status buckets only', () => {
  const result = validateReusableAuditManifest(
    manifest({
      audits: auditIds.map((id) => ({
        id,
        status:
          id === 'AUD-01'
            ? 'partial / needs proof'
            : id === 'AUD-02'
              ? 'failed / decision required'
              : id === 'AUD-21'
                ? 'deferred / scaffold-only scope verified'
                : 'current local',
      })),
      summary: {
        currentOrCurrentLocal: 21,
        partial: 1,
        failedDecisionRequired: 1,
        deferred: 1,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.summary.computed, {
    currentOrCurrentLocal: 21,
    partial: 1,
    failedDecisionRequired: 1,
    deferred: 1,
  });
});

test('validateReusableAuditManifest fails when manifest validation metadata drifts', () => {
  const result = validateReusableAuditManifest(
    manifest({
      manifestValidation: {
        pathExistenceChecked: false,
        pathsChecked: 999,
        missingPaths: 1,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.manifestValidation.mismatches, [
    {
      key: 'pathExistenceChecked',
      declared: false,
      actual: true,
    },
    {
      key: 'pathsChecked',
      declared: 999,
      actual: 14,
    },
    {
      key: 'missingPaths',
      declared: 1,
      actual: 0,
    },
  ]);
});

test('validateReusableAuditManifest fails when required source-chain keys are missing', () => {
  const result = validateReusableAuditManifest(
    manifest({
      sourceChain: {
        registry: 'docs/analysis/reusable-audit-registry.md',
      },
      manifestValidation: {
        pathExistenceChecked: true,
        pathsChecked: 3,
        missingPaths: 0,
      },
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.sourceChain.missingKeys, [
    'baseline',
    'rollup',
    'rollupJson',
    'handoff',
    'handoffJson',
    'rerunPlaybook',
    'rerunPlaybookJson',
    'toolingIndex',
    'toolingIndexJson',
    'remediationPlan',
    'remediationPlanJson',
    'decisionPacket',
    'repairPlaybooks',
  ]);
});

test('validateReusableAuditManifest fails when companion markdown summary drifts', () => {
  const result = validateReusableAuditManifest(manifest(), {
    exists: allPathsExist,
    markdownText: markdownText.replace('- Current/current-local: `24`', '- Current/current-local: `23`'),
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.summary.markdownMismatches, [
    {
      key: 'currentOrCurrentLocal',
      declared: 24,
    },
  ]);
});

test('validateReusableAuditManifest fails on duplicate audit ids', () => {
  const result = validateReusableAuditManifest(
    manifest({
      audits: [...auditIds, 'AUD-01'].map((id) => ({ id })),
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.audits.duplicates, ['AUD-01']);
});

test('validateReusableAuditManifest fails when referenced paths are missing', () => {
  const result = validateReusableAuditManifest(manifest(), {
    exists: (relativePath) => relativePath !== 'docs/analysis/reusable-audit-registry.md',
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.paths.missing, ['docs/analysis/reusable-audit-registry.md']);
});

test('validateReusableAuditManifest fails when open decisions lack packet or playbook links', () => {
  const result = validateReusableAuditManifest(
    manifest({
      openDecisions: [{ id: 'DEC-AUD-001', packet: 'docs/operations/audit-decision-packet.md' }],
    }),
    { exists: allPathsExist },
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.decisions.missingLinks, ['DEC-AUD-001']);
});
