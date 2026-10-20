import test from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateWorkerSwitchPreflight,
  formatWorkerSwitchPreflight,
} from './checkWorkerSwitchPreflight.mjs';
import {
  INSPECT_FORMAT,
  readWorkerSwitchDockerInventory,
} from './readWorkerSwitchDockerInventory.mjs';

const sha = 'a'.repeat(40);
const image = `sha256:${'b'.repeat(64)}`;
const nowMs = Date.parse('2026-10-20T01:00:00.000Z');
const roles = [
  'api', 'workers-market-data', 'workers-market-stream', 'workers-backtest', 'workers-execution',
];

const snapshot = () => ({
  schemaVersion: 1,
  capturedAt: new Date(nowMs - 30_000).toISOString(),
  inventoryComplete: true,
  inventorySource: 'coolify-and-docker-readback',
  coolifyProjectName: 'soar',
  passiveResources: [{ role: 'web', resourceId: 'old-web' }],
  provenance: {
    coolifyResourceId: 'candidate-stack',
    coolifyDeploymentId: 'candidate-build',
    coolifyResolvedSha: sha,
    apiImageId: image,
    apiImageRevision: sha,
    plannedImageIds: Object.fromEntries(roles.map((role) => [role, image])),
  },
  oldApplications: roles.map((role, index) => ({
    role, resourceId: `old-${role}`,
    containers: [{ id: String(index + 1).repeat(64), running: false, pid: 0 }],
  })),
});

const liveContainers = (value) => [
  ...value.oldApplications.flatMap((app) => app.containers.map((container) => ({
    ...container,
    name: `soar-${app.role}`,
    imageId: image,
    imageRef: 'soar-api-stack:old',
    applicationUuid: app.resourceId,
    projectName: 'soar',
  }))),
  {
    id: 'f'.repeat(64), name: 'soar-web', running: true, pid: 73,
    imageId: `sha256:${'f'.repeat(64)}`, imageRef: 'soar-web:old',
    applicationUuid: 'old-web', projectName: 'soar',
  },
];

const inspectRow = (container) => [
  container.id, `/${container.name}`, String(container.running), String(container.pid),
  container.imageId, container.imageRef,
  container.applicationUuid ?? '', container.serviceUuid ?? '',
  container.databaseUuid ?? '', container.projectName ?? '',
  container.composeProject ?? '', container.composeService ?? '',
  container.legacyApplicationId ?? '',
].join('\t');

const mockDocker = (containers, { afterIds, runningIds, unavailable = false } = {}) => {
  const ids = containers.map((container) => container.id);
  const active = runningIds ?? containers.filter((container) => container.running).map((container) => container.id);
  let allCalls = 0;
  return (args) => {
    if (unavailable) return { status: 1, stdout: '', stderr: 'private daemon error' };
    if (args[0] === 'ps' && args[1] === '-aq') {
      allCalls += 1;
      return { status: 0, stdout: `${(allCalls === 1 ? ids : afterIds ?? ids).join('\n')}\n` };
    }
    if (args[0] === 'ps' && args[1] === '-q') {
      return { status: 0, stdout: `${active.join('\n')}\n` };
    }
    if (args[0] === 'inspect' && args[2] === INSPECT_FORMAT) {
      return { status: 0, stdout: `${containers.map(inspectRow).join('\n')}\n` };
    }
    throw new Error('unexpected Docker CLI call');
  };
};

const readLive = (containers, options) => readWorkerSwitchDockerInventory({
  runDocker: mockDocker(containers, options), now: () => nowMs,
});
const evaluate = (value, liveInventory) => evaluateWorkerSwitchPreflight({
  snapshot: value, expectedSha: sha, liveInventory, nowMs,
});

test('complete fresh Docker/Coolify inventory passes with every old process stopped', () => {
  const value = snapshot();
  const live = readLive(liveContainers(value));
  assert.equal(live.status, 'PASS');
  assert.deepEqual(evaluate(value, live), { status: 'PASS', issues: [] });
});

test('hidden running backtest replica fails even when JSON claims inventoryComplete', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  containers.push({
    ...containers[3], id: 'e'.repeat(64), name: 'soar-workers-backtest-extra',
    running: true, pid: 919,
  });
  const result = evaluate(value, readLive(containers));
  assert.equal(result.status, 'FAIL');
  assert.ok(result.issues.includes('UNLISTED_OLD_CONTAINER'));
  assert.ok(result.issues.includes('OLD_WORKER_ACTIVE'));
});

test('live old API or worker state changed since the snapshot fails', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  containers[0].running = true;
  containers[0].pid = 42;
  const result = evaluate(value, readLive(containers));
  assert.ok(result.issues.includes('SNAPSHOT_STATE_MISMATCH'));
  assert.ok(result.issues.includes('OLD_WORKER_ACTIVE'));
});

test('stale snapshot and unknown Soar resource fail', () => {
  const value = snapshot();
  value.capturedAt = new Date(nowMs - 6 * 60_000).toISOString();
  const containers = liveContainers(value);
  containers.push({
    id: 'd'.repeat(64), name: 'soar-extra', running: true, pid: 77,
    imageId: image, imageRef: 'soar-api-stack:old',
    applicationUuid: 'unlisted-coolify-resource', projectName: 'soar',
  });
  const result = evaluate(value, readLive(containers));
  assert.ok(result.issues.includes('SNAPSHOT_NOT_FRESH'));
  assert.ok(result.issues.includes('UNASSIGNED_SOAR_CONTAINER'));
});

test('Docker read error, changing container set, or changing running state blocks', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  const unavailable = readLive(containers, { unavailable: true });
  assert.deepEqual(unavailable, { status: 'FAIL', issues: ['DOCKER_READ_UNAVAILABLE'] });
  assert.equal(evaluate(value, unavailable).status, 'FAIL');
  assert.doesNotMatch(formatWorkerSwitchPreflight(evaluate(value, unavailable)), /private daemon error/);

  const changed = readLive(containers, { afterIds: [...containers.map((item) => item.id), 'c'.repeat(64)] });
  assert.ok(changed.issues.includes('DOCKER_INVENTORY_CHANGED'));

  const runningChanged = readLive(containers, { runningIds: [...containers.filter((item) => item.running).map((item) => item.id), containers[3].id] });
  assert.ok(runningChanged.issues.includes('DOCKER_INVENTORY_CHANGED'));

  let reads = 0;
  const slow = readWorkerSwitchDockerInventory({
    runDocker: mockDocker(containers),
    now: () => reads++ === 0 ? nowMs : nowMs + 31_000,
  });
  assert.ok(slow.issues.includes('DOCKER_READ_STALE'));
});

test('unlabeled Soar container and passive resource running worker fail attribution', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  containers.push({
    id: 'd'.repeat(64), name: 'cryptosparrow-extra', running: true, pid: 55,
    imageId: image, imageRef: 'unknown:old',
  });
  containers[5].name = 'soar-workers-backtest-misclassified-as-web';
  const result = evaluate(value, readLive(containers));
  assert.ok(result.issues.includes('UNASSIGNED_SOAR_CONTAINER'));
  assert.ok(result.issues.includes('PASSIVE_RESOURCE_MAY_CONSUME'));
});

test('renamed unlabeled replica using the old worker image fails attribution', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  containers.push({
    id: 'c'.repeat(64), name: 'renamed-process', running: true, pid: 91,
    imageId: image, imageRef: 'generic:old',
  });
  const result = evaluate(value, readLive(containers));
  assert.ok(result.issues.includes('UNASSIGNED_SOAR_CONTAINER'));
});

test('missing live Docker inventory and missing candidate SHA cannot produce PASS', () => {
  const value = snapshot();
  assert.ok(evaluate(value).issues.includes('LIVE_DOCKER_REQUIRED'));
  delete value.provenance.apiImageRevision;
  const result = evaluate(value, readLive(liveContainers(value)));
  assert.ok(result.issues.includes('CANDIDATE_PROVENANCE_MISSING'));
});

test('only selected Docker fields are requested and failure output omits private data', () => {
  assert.doesNotMatch(INSPECT_FORMAT, /\.Env|Password|Secret/i);
  const value = snapshot();
  value.DATABASE_URL = 'postgresql://never-print-this';
  const report = formatWorkerSwitchPreflight(evaluate(value, readLive(liveContainers(value))));
  assert.match(report, /FAIL SNAPSHOT_SCHEMA_INVALID/);
  assert.doesNotMatch(report, /never-print-this/);
});
