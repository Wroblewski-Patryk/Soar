import assert from 'node:assert/strict';
import test from 'node:test';

import {
  computeSummary,
  endpointSamples,
  evaluateObjective,
  isLocalOrPrivateHost,
  isPrivateIpv4,
  normalizeEnvironment,
  normalizeTargetProfile,
  parseArgs,
  parseBaseUrl,
  parseBoolean,
  parseOptionalNumber,
  percentile,
  readCounter,
  renderMarkdown,
  safeDelta,
  successRatio,
} from './collectSloEvidence.mjs';

const thresholds = {
  targetProfile: 'V1',
  apiAvailabilityPct: 99,
  workerAvailabilityPct: 99,
  api5xxRatioPct: 1,
  apiAvgDurationMs: 250,
  queueLagExecutionThreshold: 10,
  queueLagExecutionCompliancePct: 99,
  liveOrderFailureRatioPct: 1,
};

test('SLO parser normalizes local dry-run options and rejects secret CLI flags', () => {
  const options = parseArgs({
    rawArgs: [
      '--base-url',
      'http://127.0.0.1:3001',
      '--environment',
      'production',
      '--allow-local-production-evidence',
      '--target-profile',
      'mvp',
      '--api-availability-pct',
      '98.5',
    ],
    env: {},
  });

  assert.equal(options.baseUrl, 'http://127.0.0.1:3001');
  assert.equal(options.environment, 'production');
  assert.equal(options.allowLocalProductionEvidence, true);
  assert.equal(options.targetProfile, 'MVP');
  assert.equal(options.thresholds.apiAvailabilityPct, 98.5);

  assert.throws(
    () => parseArgs({ rawArgs: ['--auth-token', 'secret'], env: {} }),
    /secret-bearing/,
  );
});

test('SLO scalar helpers handle invalid values and private host detection', () => {
  assert.equal(parseOptionalNumber('12.5'), 12.5);
  assert.equal(parseOptionalNumber('not-a-number'), null);
  assert.equal(parseBoolean('yes'), true);
  assert.equal(parseBoolean('off', true), false);
  assert.equal(normalizeEnvironment('STAGE'), 'stage');
  assert.equal(normalizeEnvironment('invalid'), 'local');
  assert.equal(normalizeTargetProfile('mvp'), 'MVP');
  assert.equal(normalizeTargetProfile('unknown'), 'V1');
  assert.equal(parseBaseUrl('https://api.example.test').hostname, 'api.example.test');
  assert.throws(() => parseBaseUrl('not a url'), /valid absolute URL/);
  assert.equal(isPrivateIpv4('172.16.0.5'), true);
  assert.equal(isPrivateIpv4('172.32.0.5'), false);
  assert.equal(isLocalOrPrivateHost('localhost'), true);
  assert.equal(isLocalOrPrivateHost('api.soar.luckysparrow.ch'), false);
});

test('computeSummary evaluates endpoint availability, queue lag, and order failure objectives', () => {
  const samples = [
    {
      '/health': { status: 200, durationMs: 10 },
      '/ready': { status: 200, durationMs: 11 },
      '/workers/health': { status: 200, durationMs: 12 },
      '/workers/ready': { status: 200, durationMs: 13 },
      '/metrics': {
        status: 200,
        payload: {
          http: { requestsTotal: 100, status5xx: 1, totalDurationMs: 10_000 },
          worker: { queueLag: { execution: 2 } },
          exchange: { orderAttempts: 10, orderFailures: 0 },
        },
      },
    },
    {
      '/health': { status: 200, durationMs: 10 },
      '/ready': { status: 503, durationMs: 20 },
      '/workers/health': { status: 200, durationMs: 12 },
      '/workers/ready': { status: 200, durationMs: 13 },
      '/metrics': {
        status: 200,
        payload: {
          http: { requestsTotal: 200, status5xx: 2, totalDurationMs: 20_000 },
          worker: { queueLag: { execution: 9 } },
          exchange: { orderAttempts: 20, orderFailures: 1 },
        },
      },
    },
  ];

  assert.equal(endpointSamples(samples, '/ready').length, 2);
  assert.equal(successRatio(samples, '/ready'), 50);
  assert.equal(readCounter(samples[0]['/metrics'].payload, ['http', 'requestsTotal']), 100);
  assert.equal(safeDelta(10, 3), 0);
  assert.equal(percentile([1, 10, 2], 95), 10);

  const summary = computeSummary(samples, thresholds);

  assert.equal(summary.probes.healthAvailabilityPct, 100);
  assert.equal(summary.probes.readyAvailabilityPct, 50);
  assert.equal(summary.http.requestsDelta, 100);
  assert.equal(summary.http.errorRatioPct, 1);
  assert.equal(summary.http.averageDurationMs, 100);
  assert.equal(summary.queueLagExecution.withinThresholdPct, 100);
  assert.equal(summary.liveOrderPath.failureRatioPct, 10);
  assert.equal(summary.evaluation.overallStatus, 'FAIL');
  assert.deepEqual(summary.evaluation.failedObjectiveIds, ['SLO-1B', 'SLO-6']);
});

test('renderMarkdown records no-secret run context and objective table', () => {
  const objective = evaluateObjective({
    id: 'SLO-X',
    label: 'Synthetic objective',
    comparator: '>=',
    threshold: 99,
    observed: 100,
    unit: '%',
  });
  assert.equal(objective.status, 'PASS');

  const summary = {
    probes: {
      healthAvailabilityPct: 100,
      readyAvailabilityPct: 100,
      workersHealthAvailabilityPct: 100,
      workersReadyAvailabilityPct: 100,
    },
    http: { requestsDelta: 1, status5xxDelta: 0, errorRatioPct: 0, averageDurationMs: 10 },
    queueLagExecution: { sampleCount: 1, p50: 1, p95: 1, max: 1, threshold: 10, withinThresholdPct: 100 },
    liveOrderPath: { orderAttemptsDelta: 0, orderFailuresDelta: 0, failureRatioPct: null },
    evaluation: {
      targetProfile: 'V1',
      objectives: [objective],
      overallStatus: 'PASS',
      failedObjectiveIds: [],
      noDataObjectiveIds: [],
    },
  };

  const markdown = renderMarkdown({
    startedAt: '2026-06-07T00:00:00.000Z',
    endedAt: '2026-06-07T00:01:00.000Z',
    options: {
      baseUrl: 'http://127.0.0.1:3001',
      durationMinutes: 1,
      intervalSeconds: 1,
      authToken: 'secret-value',
      environment: 'local',
      allowLocalProductionEvidence: true,
    },
    summary,
    artifacts: { jsonPath: 'history/operations/slo.json' },
  });

  assert.match(markdown, /Auth token provided: yes/);
  assert.doesNotMatch(markdown, /secret-value/);
  assert.match(markdown, /\| SLO-X \| Synthetic objective \| >= 99% \| 100\.0000% \| PASS \|/);
});
