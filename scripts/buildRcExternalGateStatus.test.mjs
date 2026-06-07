import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  asNumber,
  buildGateRowsFromObservation,
  buildGateRowsFromWindowReport,
  buildManualFollowUps,
  evaluateBackupRestoreGate,
  evaluateGate1FromRunbook,
  evaluateGate3FromRunbook,
  evaluateGate4FromSignoffRecord,
  extractEvidenceValues,
  findLatestDbRestoreArtifact,
  findLatestSloArtifact,
  findLatestSloWindowReportArtifact,
  gate2StatusLabel,
  loadGate2Evaluation,
  normalizeEnvironment,
  objectivePass,
  parseArgs,
  pct,
  readRunbookRaw,
  renderManualFollowUps,
  renderReport,
  renderTemplateOnly,
  resolveDocsRoot,
  resolveGeneratedAt,
  statusLabel,
} from './buildRcExternalGateStatus.mjs';

test('parseArgs, formatting helpers, and environment normalization are deterministic', () => {
  const options = parseArgs([
    '--input',
    'history/operations/slo.json',
    '--output',
    'docs/operations/status.md',
    '--runbook-path',
    'docs/operations/runbook.md',
    '--signoff-path',
    'docs/operations/signoff.md',
    '--template-only',
    '--today',
    '2026-06-07',
    '--expected-sha',
    'abc123',
  ]);

  assert.equal(options.input, 'history/operations/slo.json');
  assert.equal(options.templateOnly, true);
  assert.equal(options.expectedSha, 'abc123');
  assert.equal(resolveGeneratedAt('2026-06-07'), '2026-06-07T00:00:00.000Z');
  assert.equal(asNumber(4), 4);
  assert.equal(asNumber(Number.NaN), null);
  assert.equal(pct(99.923), '99.92%');
  assert.equal(normalizeEnvironment(' Production '), 'production');
  assert.equal(normalizeEnvironment('sandbox'), 'unknown');
  assert.equal(objectivePass(new Map([['SLO-5', 'PASS']]), 'SLO-5'), true);
  assert.equal(statusLabel(true), 'PASS');
  assert.equal(path.basename(resolveDocsRoot()), 'docs');
  assert.equal(gate2StatusLabel(true, false, 'local'), 'LOCAL_PASS (local evidence; production pending)');
});

test('buildGateRowsFromObservation prefers explicit SLO objective statuses and records details', () => {
  const evaluation = buildGateRowsFromObservation(
    {
      evaluation: {
        objectives: [
          { id: 'SLO-1A', status: 'PASS' },
          { id: 'SLO-1B', status: 'PASS' },
          { id: 'SLO-4A', status: 'PASS' },
          { id: 'SLO-4B', status: 'PASS' },
          { id: 'SLO-2', status: 'PASS' },
          { id: 'SLO-5', status: 'FAIL' },
        ],
      },
      probes: {
        readyAvailabilityPct: 100,
        workersReadyAvailabilityPct: 100,
      },
      http: {
        errorRatioPct: 0,
      },
      queueLagExecution: {
        p95: 1,
        max: 2,
      },
      liveOrderPath: {
        orderAttemptsDelta: 10,
        orderFailuresDelta: 1,
        failureRatioPct: 10,
      },
    },
    'production',
  );

  assert.equal(evaluation.sourceKind, 'slo_observation');
  assert.equal(evaluation.productionEvidence, true);
  assert.equal(evaluation.probePass, true);
  assert.equal(evaluation.reliabilityPass, true);
  assert.equal(evaluation.queueLagPass, false);
  assert.equal(evaluation.details.executionP95, 1);
  assert.equal(evaluation.details.objectiveStatuses['SLO-5'], 'FAIL');
});

test('buildGateRowsFromObservation falls back to measured thresholds when objective rows are absent', () => {
  const evaluation = buildGateRowsFromObservation(
    {
      probes: {
        readyAvailabilityPct: 99.91,
        workersReadyAvailabilityPct: 99.51,
      },
      http: {
        errorRatioPct: 0.49,
      },
      queueLagExecution: {
        p95: 10,
        max: 20,
      },
    },
    'stage',
  );

  assert.equal(evaluation.productionEvidence, false);
  assert.equal(evaluation.probePass, true);
  assert.equal(evaluation.reliabilityPass, true);
  assert.equal(evaluation.queueLagPass, true);
  assert.equal(evaluation.details.environment, 'stage');
});

test('buildGateRowsFromWindowReport derives RC gate inputs from window aggregates', () => {
  const evaluation = buildGateRowsFromWindowReport({
    source: {
      includesProductionEvidence: true,
      environmentSummary: { production: 2 },
    },
    aggregates: {
      probes: {
        readyAvgPct: 99.95,
        workersReadyAvgPct: 99.7,
      },
      api: {
        errorRatioAvgPct: 0.2,
      },
      queueLagExecution: {
        p95Max: 7,
        maxPeak: 18,
      },
      liveOrderPath: {
        failureRatioAvgPct: 0,
      },
    },
    thresholds: {
      queueLagP95Threshold: 8,
      queueLagMaxThreshold: 20,
    },
  });

  assert.equal(evaluation.sourceKind, 'slo_window_report');
  assert.equal(evaluation.productionEvidence, true);
  assert.equal(evaluation.probePass, true);
  assert.equal(evaluation.reliabilityPass, true);
  assert.equal(evaluation.queueLagPass, true);
  assert.equal(evaluation.details.queueLagP95Threshold, 8);
});

test('manual follow-up helpers produce fail-closed operator actions', () => {
  const items = buildManualFollowUps({
    gate1EvidenceComplete: false,
    gate2QueueLagPass: true,
    gate2ProductionEvidence: false,
    gate3EvidenceComplete: false,
    gate4Approved: false,
  });

  assert.equal(items.length, 5);
  assert.match(renderManualFollowUps(items), /Re-run Gate 2 from production/);
  assert.match(renderManualFollowUps([]), /No pending manual follow-ups/);
});

test('runbook, signoff, and latest-artifact helpers read local fixtures', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'rc-gates-status-'));

  try {
    const operationsDir = path.join(fixtureRoot, 'history', 'operations');
    await mkdir(operationsDir, { recursive: true });
    await writeFile(path.join(operationsDir, '_artifacts-slo-window-2026-06-07T01.json'), '{}\n');
    await writeFile(path.join(operationsDir, '_artifacts-slo-window-2026-06-07T02.json'), '{}\n');
    await writeFile(path.join(operationsDir, 'v1-slo-window-report-7d-2026-06-07T01.json'), '{}\n');
    await writeFile(path.join(operationsDir, 'v1-slo-window-report-7d-2026-06-07T03.json'), '{}\n');
    await writeFile(path.join(operationsDir, '_artifacts-db-restore-check-2026-06-07T01.txt'), 'RESULT: FAIL\n');
    await writeFile(path.join(operationsDir, '_artifacts-db-restore-check-2026-06-07T02.txt'), 'RESULT: PASS\n');

    const runbookPath = path.join(fixtureRoot, 'runbook.md');
    await writeFile(
      runbookPath,
      [
        '## Gate 1: Backup Snapshot and Restore Validation',
        'Evidence to record:',
        '- Backup artifact: backup.sql',
        '- Restore artifact: restore.log',
        '## Gate 3: Incident Contacts and Escalation Confirmation',
        'Evidence to record:',
        '- Primary contact: Ops',
      ].join('\n'),
    );
    const signoffPath = path.join(fixtureRoot, 'signoff.md');
    await writeFile(signoffPath, '- RC status: `APPROVED`\n');

    assert.equal(path.basename(await findLatestSloArtifact(operationsDir)), '_artifacts-slo-window-2026-06-07T02.json');
    assert.equal(
      path.basename(await findLatestSloWindowReportArtifact(operationsDir)),
      'v1-slo-window-report-7d-2026-06-07T03.json',
    );
    assert.equal(
      path.basename(await findLatestDbRestoreArtifact(operationsDir)),
      '_artifacts-db-restore-check-2026-06-07T02.txt',
    );
    assert.equal((await evaluateBackupRestoreGate(operationsDir)).label, 'LOCAL_PASS (target-env pending)');
    assert.equal((await evaluateGate1FromRunbook(runbookPath)).label, 'PASS');
    assert.equal((await evaluateGate3FromRunbook(runbookPath)).label, 'PASS');
    assert.equal((await evaluateGate4FromSignoffRecord(signoffPath)).label, 'PASS');
    assert.deepEqual(
      extractEvidenceValues((await readRunbookRaw(runbookPath)).raw, '## Gate 3: Incident Contacts and Escalation Confirmation'),
      ['Ops'],
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('loadGate2Evaluation and renderers support observation and window artifacts', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'rc-gates-render-'));

  try {
    const observationPath = path.join(fixtureRoot, '_artifacts-slo-window-observation.json');
    const windowReportPath = path.join(fixtureRoot, 'v1-slo-window-report.json');
    await writeFile(
      observationPath,
      JSON.stringify({
        startedAt: '2026-06-07T00:00:00.000Z',
        endedAt: '2026-06-07T00:30:00.000Z',
        options: { environment: 'production' },
        summary: {
          evaluation: {
            objectives: [
              { id: 'SLO-1A', status: 'PASS' },
              { id: 'SLO-1B', status: 'PASS' },
              { id: 'SLO-4A', status: 'PASS' },
              { id: 'SLO-4B', status: 'PASS' },
              { id: 'SLO-2', status: 'PASS' },
              { id: 'SLO-5', status: 'PASS' },
            ],
          },
          probes: { readyAvailabilityPct: 100, workersReadyAvailabilityPct: 100 },
          http: { errorRatioPct: 0 },
          queueLagExecution: { p95: 1, max: 2 },
          liveOrderPath: { orderAttemptsDelta: 0, orderFailuresDelta: 0, failureRatioPct: null },
        },
      }),
    );
    await writeFile(
      windowReportPath,
      JSON.stringify({
        source: { includesProductionEvidence: false, environmentSummary: { local: 1 } },
        aggregates: {
          probes: { readyAvgPct: 100, workersReadyAvgPct: 100 },
          api: { errorRatioAvgPct: 0 },
          queueLagExecution: { p95Max: 1, maxPeak: 2 },
          liveOrderPath: { failureRatioAvgPct: null },
        },
      }),
    );

    const observation = await loadGate2Evaluation(observationPath);
    const windowReport = await loadGate2Evaluation(windowReportPath);

    assert.equal(observation.evaluation.sourceKind, 'slo_observation');
    assert.equal(windowReport.evaluation.sourceKind, 'slo_window_report');

    const report = renderReport({
      artifactPath: observationPath,
      artifact: observation.artifact,
      evaluation: observation.evaluation,
      backupGate: { artifactPath: null, result: 'MISSING', label: 'OPEN (manual evidence required)' },
      gate1Runbook: { evidenceComplete: true, label: 'PASS', runbookPath: path.join(fixtureRoot, 'runbook.md') },
      gate3Runbook: { evidenceComplete: true, label: 'PASS', runbookPath: path.join(fixtureRoot, 'runbook.md') },
      gate4Signoff: { approved: true, label: 'PASS', signoffPath: path.join(fixtureRoot, 'signoff.md') },
      generatedAt: '2026-06-07T00:00:00.000Z',
      expectedSha: 'abc123',
    });
    const template = renderTemplateOnly(
      { artifactPath: null, result: 'MISSING', label: 'OPEN (manual evidence required)' },
      { evidenceComplete: false, runbookPath: path.join(fixtureRoot, 'runbook.md') },
      { evidenceComplete: false, label: 'OPEN', runbookPath: path.join(fixtureRoot, 'runbook.md') },
      { approved: false, label: 'OPEN', signoffPath: path.join(fixtureRoot, 'signoff.md') },
      '2026-06-07T00:00:00.000Z',
      'abc123',
    );

    assert.match(report, /Gate 2 \(Queue-lag baseline review\): PASS/);
    assert.match(report, /Expected SHA: `abc123`/);
    assert.match(template, /Source artifact: not provided/);
    assert.match(await readFile(observationPath, 'utf8'), /production/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
