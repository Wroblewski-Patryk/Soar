import test from 'node:test';
import assert from 'node:assert/strict';

import { compareReusableAuditManifests } from './compareReusableAuditManifests.mjs';

const dedupeAudits = (audits) =>
  audits.filter((audit, index, all) => all.findIndex((item) => item.id === audit.id) === index);

const manifest = (overrides = {}) => ({
  summary: {
    currentOrCurrentLocal: 2,
    partial: 1,
    failedDecisionRequired: 1,
    deferred: 0,
    ...(overrides.summary ?? {}),
  },
  safetyBoundaries: {
    productionDataMutation: false,
    liveOrderCancelClose: false,
    exchangeSideMutation: false,
    architectureDecisionApplied: false,
    runtimeBehaviorChanged: false,
    ...(overrides.safetyBoundaries ?? {}),
  },
  audits: dedupeAudits([
    ...(overrides.audits ?? []),
    { id: 'AUD-00', status: 'current local' },
    { id: 'AUD-01', status: 'failed doc consistency / decision required' },
    { id: 'AUD-20', status: 'partial / failed against hot-path architecture claim' },
  ]),
  openDecisions: overrides.openDecisions ?? [{ id: 'DEC-AUD-001' }, { id: 'DEC-AUD-002' }],
});

test('compareReusableAuditManifests passes unchanged manifests', () => {
  const result = compareReusableAuditManifests(manifest(), manifest());

  assert.equal(result.status, 'PASS');
  assert.equal(result.regressions.audits.length, 0);
  assert.equal(result.regressions.summary.length, 0);
  assert.equal(result.regressions.decisions.length, 0);
  assert.equal(result.regressions.safetyBoundaries.length, 0);
});

test('compareReusableAuditManifests fails when an audit status regresses', () => {
  const result = compareReusableAuditManifests(
    manifest(),
    manifest({
      audits: [{ id: 'AUD-00', status: 'partial / new gap' }],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(
    result.regressions.audits.map((audit) => audit.id),
    ['AUD-00'],
  );
});

test('compareReusableAuditManifests fails when negative summary buckets grow', () => {
  const result = compareReusableAuditManifests(
    manifest(),
    manifest({
      summary: {
        partial: 2,
        failedDecisionRequired: 2,
      },
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(
    result.regressions.summary.map((item) => item.key),
    ['failedDecisionRequired', 'partial'],
  );
});

test('compareReusableAuditManifests fails when a new open decision appears', () => {
  const result = compareReusableAuditManifests(
    manifest(),
    manifest({
      openDecisions: [{ id: 'DEC-AUD-003' }],
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.regressions.decisions, ['DEC-AUD-003']);
});

test('compareReusableAuditManifests fails when safety boundaries are crossed', () => {
  const result = compareReusableAuditManifests(
    manifest(),
    manifest({
      safetyBoundaries: {
        productionDataMutation: true,
        runtimeBehaviorChanged: true,
      },
    }),
  );

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(
    result.regressions.safetyBoundaries.map((item) => item.key),
    ['productionDataMutation', 'runtimeBehaviorChanged'],
  );
});

test('compareReusableAuditManifests records improvements without failing', () => {
  const result = compareReusableAuditManifests(
    manifest(),
    manifest({
      summary: {
        currentOrCurrentLocal: 3,
        partial: 0,
        failedDecisionRequired: 0,
      },
      audits: [
        { id: 'AUD-01', status: 'current local' },
        { id: 'AUD-20', status: 'current local' },
      ],
      openDecisions: [],
    }),
  );

  assert.equal(result.status, 'PASS');
  assert.deepEqual(
    result.improvements.audits.map((audit) => audit.id),
    ['AUD-01', 'AUD-20'],
  );
  assert.deepEqual(
    result.improvements.summary.map((item) => item.key),
    ['currentOrCurrentLocal', 'failedDecisionRequired', 'partial'],
  );
});
