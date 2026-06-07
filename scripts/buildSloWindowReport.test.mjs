import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  asNumber,
  avg,
  loadArtifacts,
  main,
  parseArgs,
  parseIso,
  pct,
  renderMarkdown,
  summarize,
  toStamp,
} from './buildSloWindowReport.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-slo-window-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const writeSloArtifact = async (dir, name, overrides = {}) => {
  const artifact = {
    startedAt: '2026-06-07T01:00:00.000Z',
    endedAt: new Date().toISOString(),
    options: {
      environment: 'production',
    },
    summary: {
      probes: {
        healthAvailabilityPct: 100,
        readyAvailabilityPct: 99.95,
        workersHealthAvailabilityPct: 100,
        workersReadyAvailabilityPct: 99.9,
      },
      http: {
        errorRatioPct: 0.25,
      },
      queueLagExecution: {
        p95: 7,
        max: 12,
      },
      liveOrderPath: {
        failureRatioPct: 0,
      },
      evaluation: {
        objectives: [
          { id: 'SLO-1A', label: '/health availability', status: 'PASS' },
          { id: 'SLO-5', label: 'Execution queue lag compliance', status: 'PASS' },
          { id: 'SLO-6', label: 'Live order failure ratio', status: 'NO_DATA' },
        ],
      },
    },
    ...overrides,
  };
  await writeFile(path.join(dir, name), `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
};

test('parses SLO window CLI options and formats utility values', () => {
  const options = parseArgs([
    '--input-dir',
    'history/operations',
    '--window-days',
    '30',
    '--output-prefix',
    'custom-slo',
    '--queue-lag-p95-threshold',
    '8.5',
    '--queue-lag-max-threshold',
    '16.5',
  ]);

  assert.equal(options.inputDir, 'history/operations');
  assert.equal(options.windowDays, 30);
  assert.equal(options.outputPrefix, 'custom-slo');
  assert.equal(options.queueLagP95Threshold, 8.5);
  assert.equal(options.queueLagMaxThreshold, 16.5);
  assert.equal(asNumber(1), 1);
  assert.equal(asNumber(Number.NaN), null);
  assert.equal(avg([2, 4, 6]), 4);
  assert.equal(avg([]), null);
  assert.equal(pct(12.3456), '12.35%');
  assert.equal(pct(null), 'n/a');
  assert.equal(parseIso('not a date'), null);
  assert.match(toStamp(), /^\d{4}-\d{2}-\d{2}T/);
});

test('loads SLO artifacts from the expected artifact name family', async () => {
  await withTempDir(async (dir) => {
    await writeSloArtifact(dir, '_artifacts-slo-window-b.json', {
      options: { environment: 'LOCAL' },
    });
    await writeSloArtifact(dir, '_artifacts-slo-window-a.json');
    await writeFile(path.join(dir, 'not-slo.json'), '{}', 'utf8');

    const artifacts = await loadArtifacts(dir);
    assert.deepEqual(
      artifacts.map((artifact) => artifact.fileName),
      ['_artifacts-slo-window-a.json', '_artifacts-slo-window-b.json'],
    );
    assert.equal(artifacts[1].environment, 'local');
    assert.equal(typeof artifacts[0].endedAtMs, 'number');
  });
});

test('summarizes in-window artifacts with objectives, environments, and queue breaches', async () => {
  await withTempDir(async (dir) => {
    await writeSloArtifact(dir, '_artifacts-slo-window-good.json');
    await writeSloArtifact(dir, '_artifacts-slo-window-breach.json', {
      options: { environment: 'local' },
      summary: {
        probes: {
          healthAvailabilityPct: 100,
          readyAvailabilityPct: 99.5,
          workersHealthAvailabilityPct: 100,
          workersReadyAvailabilityPct: 99,
        },
        http: { errorRatioPct: 0.8 },
        queueLagExecution: { p95: 15, max: 25 },
        liveOrderPath: { failureRatioPct: 1.5 },
        evaluation: {
          objectives: [
            { id: 'SLO-1A', label: '/health availability', status: 'PASS' },
            { id: 'SLO-5', label: 'Execution queue lag compliance', status: 'FAIL' },
          ],
        },
      },
    });

    const report = summarize(await loadArtifacts(dir), {
      inputDir: dir,
      windowDays: 7,
      queueLagP95Threshold: 10,
      queueLagMaxThreshold: 20,
    });

    assert.equal(report.source.artifactsInWindow, 2);
    assert.deepEqual(report.source.environmentSummary, { local: 1, production: 1 });
    assert.equal(report.source.includesProductionEvidence, true);
    assert.equal(report.aggregates.queueLagExecution.p95Max, 15);
    assert.equal(report.queueLagBreaches.length, 2);
    const queueLagObjective = report.objectiveStatusSummary.find((objective) => objective.id === 'SLO-5');
    assert.equal(queueLagObjective.label, 'Execution queue lag compliance');
    assert.equal(queueLagObjective.pass, 1);
    assert.equal(queueLagObjective.fail, 1);
    assert.equal(queueLagObjective.noData, 0);
    assert.equal(queueLagObjective.total, 2);
  });
});

test('renders markdown report with aggregate and artifact timelines', async () => {
  const markdown = renderMarkdown(
    {
      generatedAt: '2026-06-07T02:00:00.000Z',
      window: {
        days: 7,
        startUtc: '2026-05-31T02:00:00.000Z',
        endUtc: '2026-06-07T02:00:00.000Z',
      },
      source: {
        inputDir: 'history/operations',
        artifactsTotal: 1,
        artifactsInWindow: 1,
        environmentSummary: { production: 1 },
        includesProductionEvidence: true,
      },
      aggregates: {
        probes: {
          healthAvgPct: 100,
          readyAvgPct: 99.95,
          workersHealthAvgPct: 100,
          workersReadyAvgPct: 99.9,
        },
        api: { errorRatioAvgPct: 0.25 },
        queueLagExecution: { p95Avg: 7, p95Max: 7, maxAvg: 12, maxPeak: 12 },
        liveOrderPath: { failureRatioAvgPct: null },
      },
      queueLagBreaches: [],
      objectiveStatusSummary: [{ id: 'SLO-5', label: 'Queue', pass: 1, fail: 0, noData: 0, total: 1, latestStatus: 'PASS' }],
      artifactRefs: [{ file: '_artifacts-slo-window-good.json', environment: 'production', startedAt: 'start', endedAt: 'end', queueLagP95: 7, queueLagMax: 12 }],
    },
    'history/operations/report.json',
  );

  assert.match(markdown, /# V1 SLO Window Report \(7d\)/);
  assert.match(markdown, /Includes production evidence: yes/);
  assert.match(markdown, /Queue-Lag Breach Timeline\n- none/);
  assert.match(markdown, /\| SLO-5 \| Queue \| 1 \| 0 \| 0 \| 1 \| PASS \|/);
});

test('main writes JSON and markdown SLO window reports', async () => {
  await withTempDir(async (dir) => {
    await writeSloArtifact(dir, '_artifacts-slo-window-good.json');

    await main([
      '--input-dir',
      dir,
      '--window-days',
      '7',
      '--output-prefix',
      'test-slo-window',
      '--queue-lag-p95-threshold',
      '10',
      '--queue-lag-max-threshold',
      '20',
    ]);

    const entries = await readdir(dir);
    const jsonName = entries.find((entry) => /^test-slo-window-7d-.+\.json$/.test(entry));
    const mdName = entries.find((entry) => /^test-slo-window-7d-.+\.md$/.test(entry));

    assert.ok(jsonName);
    assert.ok(mdName);
    const report = JSON.parse(await readFile(path.join(dir, jsonName), 'utf8'));
    const markdown = await readFile(path.join(dir, mdName), 'utf8');
    assert.equal(report.source.artifactsInWindow, 1);
    assert.match(markdown, /Raw JSON:/);
  });
});
