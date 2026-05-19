import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReusableAuditManifest } from './checkReusableAuditManifest.mjs';

const auditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);

const manifest = (overrides = {}) => ({
  audits: auditIds.map((id) => ({ id, status: 'current local' })),
  sourceChain: {
    registry: 'docs/analysis/reusable-audit-registry.md',
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

test('validateReusableAuditManifest passes complete manifests', () => {
  const result = validateReusableAuditManifest(manifest(), { exists: allPathsExist });

  assert.equal(result.status, 'PASS');
  assert.equal(result.audits.found, 24);
  assert.deepEqual(result.audits.missing, []);
  assert.deepEqual(result.audits.duplicates, []);
  assert.deepEqual(result.paths.missing, []);
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
