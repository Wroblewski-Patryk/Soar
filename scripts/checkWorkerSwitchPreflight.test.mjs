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
import {
  IMAGE_INSPECT_FORMAT,
  readWorkerSwitchSourceBinding,
} from './readWorkerSwitchSourceBinding.mjs';

const sha = 'a'.repeat(40);
const image = `sha256:${'b'.repeat(64)}`;
const pinnedRef = `registry.example/soar-api@sha256:${'c'.repeat(64)}`;
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
    apiImageRef: pinnedRef,
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

const mockDocker = (containers, {
  afterIds, runningIds, finalRunningIds, unavailable = false, failFinalRunning = false,
} = {}) => {
  const ids = containers.map((container) => container.id);
  const active = runningIds ?? containers.filter((container) => container.running).map((container) => container.id);
  let allCalls = 0;
  let runningCalls = 0;
  return (args) => {
    if (unavailable) return { status: 1, stdout: '', stderr: 'private daemon error' };
    if (args[0] === 'ps' && args[1] === '-aq') {
      allCalls += 1;
      return { status: 0, stdout: `${(allCalls === 1 ? ids : afterIds ?? ids).join('\n')}\n` };
    }
    if (args[0] === 'ps' && args[1] === '-q') {
      runningCalls += 1;
      if (runningCalls === 2 && failFinalRunning) {
        return { status: 1, stdout: '', stderr: 'private daemon error' };
      }
      const current = runningCalls === 2 ? finalRunningIds ?? active : active;
      return { status: 0, stdout: `${current.join('\n')}\n` };
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
const readBinding = ({
  headSha = sha, gitStatus = '', sourceCommit = sha, imageRef = pinnedRef,
  inspectedImageId = image, revisionLabel = sha, gitUnavailable = false,
} = {}) => readWorkerSwitchSourceBinding({
  root: '/fixture/soar', sourceCommit, imageRef,
  runGit: (args) => {
    if (gitUnavailable) return { status: 1, stdout: '', stderr: 'private path' };
    if (args.includes('rev-parse')) return { status: 0, stdout: `${headSha}\n` };
    if (args.includes('status')) return { status: 0, stdout: gitStatus };
    throw new Error('unexpected git call');
  },
  runDocker: (args) => {
    assert.deepEqual(args, ['image', 'inspect', '--format', IMAGE_INSPECT_FORMAT, imageRef]);
    return { status: 0, stdout: `${inspectedImageId}\t${revisionLabel}\n` };
  },
});
const buildRecord = () => ({ status: 'PASS', issues: [], sourceSha: sha, imageRef: pinnedRef, imageId: image });
const evaluate = (value, liveInventory, sourceBinding = readBinding(), record = buildRecord()) => evaluateWorkerSwitchPreflight({
  snapshot: value, expectedSha: sha, liveInventory, sourceBinding, buildRecord: record, nowMs,
});

test('complete fresh Docker/Coolify inventory passes with every old process stopped', () => {
  const value = snapshot();
  const live = readLive(liveContainers(value));
  assert.equal(live.status, 'PASS');
  assert.deepEqual(evaluate(value, live), { status: 'PASS', issues: [] });
  assert.match(formatWorkerSwitchPreflight(evaluate(value, live)), /PASS_LOCAL_PROCEDURAL_ONLY/);
});

test('exact clean SHA and pinned image ID pass the local procedural gate', () => {
  const value = snapshot();
  const binding = readBinding();
  assert.equal(binding.status, 'PASS');
  assert.deepEqual(evaluate(value, readLive(liveContainers(value)), binding), {
    status: 'PASS', issues: [],
  });
});

test('SOURCE_COMMIT must equal actual clean Git HEAD', () => {
  const value = snapshot();
  const live = readLive(liveContainers(value));
  const wrongCommit = readBinding({ sourceCommit: 'c'.repeat(40) });
  assert.deepEqual(wrongCommit, { status: 'FAIL', issues: ['SOURCE_COMMIT_HEAD_MISMATCH'] });
  assert.ok(evaluate(value, live, wrongCommit).issues.includes('SOURCE_COMMIT_HEAD_MISMATCH'));

  const dirtyTracked = readBinding({ gitStatus: ' M apps/api/Dockerfile\n' });
  assert.deepEqual(dirtyTracked, { status: 'FAIL', issues: ['SOURCE_TREE_DIRTY'] });
  assert.equal(evaluate(value, live, dirtyTracked).status, 'FAIL');

  const missingHead = readBinding({ gitUnavailable: true });
  assert.deepEqual(missingHead, { status: 'FAIL', issues: ['SOURCE_HEAD_UNAVAILABLE'] });
});

test('mutable reference or swapped image ID cannot pass local binding', () => {
  const value = snapshot();
  const live = readLive(liveContainers(value));
  const mutable = readBinding({ imageRef: `soar-api-stack:${sha}` });
  assert.deepEqual(mutable, { status: 'FAIL', issues: ['CANDIDATE_IMAGE_NOT_PINNED'] });
  assert.equal(evaluate(value, live, mutable).status, 'FAIL');

  const swapped = readBinding({ inspectedImageId: `sha256:${'c'.repeat(64)}` });
  assert.equal(swapped.status, 'PASS');
  assert.ok(evaluate(value, live, swapped).issues.includes('CANDIDATE_IMAGE_MISMATCH'));

  const mislabeled = readBinding({ revisionLabel: 'c'.repeat(40) });
  assert.ok(evaluate(value, live, mislabeled).issues.includes('CANDIDATE_SHA_MISMATCH'));

  value.provenance.plannedImageIds['workers-backtest'] = `sha256:${'d'.repeat(64)}`;
  assert.ok(evaluate(value, live).issues.includes('CANDIDATE_IMAGE_MISMATCH'));
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

  const finalReadFailed = readLive(containers, { failFinalRunning: true });
  assert.deepEqual(finalReadFailed, { status: 'FAIL', issues: ['DOCKER_READ_UNAVAILABLE'] });

  let reads = 0;
  const slow = readWorkerSwitchDockerInventory({
    runDocker: mockDocker(containers),
    now: () => reads++ === 0 ? nowMs : nowMs + 31_000,
  });
  assert.ok(slow.issues.includes('DOCKER_READ_STALE'));
});

test('worker starting after the first running read and final ID list blocks', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  const firstRunningIds = containers.filter((item) => item.running).map((item) => item.id);
  const live = readLive(containers, {
    runningIds: firstRunningIds,
    finalRunningIds: [...firstRunningIds, containers[3].id],
  });
  assert.deepEqual(live, { status: 'FAIL', issues: ['DOCKER_INVENTORY_CHANGED'] });
  assert.equal(evaluate(value, live).status, 'FAIL');
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

test('active container with no recognized labels, name, or image blocks', () => {
  const value = snapshot();
  const containers = liveContainers(value);
  containers.push({
    id: 'c'.repeat(64), name: 'other-process', running: true, pid: 777,
    imageId: `sha256:${'c'.repeat(64)}`, imageRef: 'generic:latest',
  });
  const result = evaluate(value, readLive(containers));
  assert.equal(result.status, 'FAIL');
  assert.ok(result.issues.includes('ACTIVE_CONTAINER_UNATTRIBUTED'));
  assert.doesNotMatch(formatWorkerSwitchPreflight(result), /PASS_LOCAL_PROCEDURAL_ONLY/);
});

test('missing live Docker inventory and missing candidate SHA cannot produce PASS', () => {
  const value = snapshot();
  assert.ok(evaluate(value).issues.includes('LIVE_DOCKER_REQUIRED'));
  assert.ok(evaluateWorkerSwitchPreflight({ snapshot: value, expectedSha: sha, nowMs })
    .issues.includes('LOCAL_SOURCE_BINDING_REQUIRED'));
  assert.ok(evaluateWorkerSwitchPreflight({
    snapshot: value, expectedSha: sha, sourceBinding: readBinding(), nowMs,
  }).issues.includes('BUILD_RECORD_REQUIRED'));
  const wrongRecord = buildRecord();
  wrongRecord.imageId = `sha256:${'e'.repeat(64)}`;
  assert.ok(evaluate(value, readLive(liveContainers(value)), readBinding(), wrongRecord)
    .issues.includes('BUILD_RECORD_BINDING_MISMATCH'));
  delete value.provenance.apiImageRevision;
  const result = evaluate(value, readLive(liveContainers(value)));
  assert.ok(result.issues.includes('CANDIDATE_PROVENANCE_MISSING'));
});

test('only selected Docker fields are requested and failure output omits private data', () => {
  assert.doesNotMatch(INSPECT_FORMAT, /\.Env|Password|Secret/i);
  assert.doesNotMatch(IMAGE_INSPECT_FORMAT, /\.Env|Password|Secret/i);
  const value = snapshot();
  value.DATABASE_URL = 'postgresql://never-print-this';
  const report = formatWorkerSwitchPreflight(evaluate(value, readLive(liveContainers(value))));
  assert.match(report, /FAIL SNAPSHOT_SCHEMA_INVALID/);
  assert.doesNotMatch(report, /never-print-this/);
});
