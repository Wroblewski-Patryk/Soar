import { spawnSync } from 'node:child_process';

const CONTAINER_ID = /^[0-9a-f]{64}$/i;
const IMAGE_ID = /^sha256:[0-9a-f]{64}$/i;
const MAX_READ_MS = 30_000;

// Select only identity, state, and Coolify ownership labels. Never read Env.
export const INSPECT_FORMAT = [
  '{{.Id}}', '{{.Name}}', '{{.State.Running}}', '{{.State.Pid}}',
  '{{.Image}}', '{{.Config.Image}}',
  '{{with .Config.Labels}}{{index . "coolify.applicationUuid"}}{{end}}',
  '{{with .Config.Labels}}{{index . "coolify.serviceUuid"}}{{end}}',
  '{{with .Config.Labels}}{{index . "coolify.databaseUuid"}}{{end}}',
  '{{with .Config.Labels}}{{index . "coolify.projectName"}}{{end}}',
  '{{with .Config.Labels}}{{index . "com.docker.compose.project"}}{{end}}',
  '{{with .Config.Labels}}{{index . "com.docker.compose.service"}}{{end}}',
  '{{with .Config.Labels}}{{index . "coolify.applicationId"}}{{end}}',
].join('\t');

const defaultRunDocker = (args) => spawnSync('docker', args, {
  encoding: 'utf8', timeout: 15_000, maxBuffer: 4 * 1024 * 1024,
});

const lines = (value) => String(value ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const rows = (value) => String(value ?? '').split(/\r?\n/).filter((line) => line.length > 0);
const emptyLabel = (value) => value === '<no value>' || value === '<nil>' ? '' : value;
const sameIds = (left, right) => left.length === right.length &&
  left.every((id) => right.includes(id));

export const readWorkerSwitchDockerInventory = ({
  runDocker = defaultRunDocker,
  now = () => Date.now(),
} = {}) => {
  const startedAt = now();
  const execute = (args) => {
    try {
      const result = runDocker(args);
      return result?.status === 0 && typeof result.stdout === 'string' ? result.stdout : null;
    } catch {
      return null;
    }
  };
  const beforeRaw = execute(['ps', '-aq', '--no-trunc']);
  if (beforeRaw === null) return { status: 'FAIL', issues: ['DOCKER_READ_UNAVAILABLE'] };
  const before = lines(beforeRaw);
  if (before.length > 512 || before.some((id) => !CONTAINER_ID.test(id)) ||
      new Set(before).size !== before.length) {
    return { status: 'FAIL', issues: ['DOCKER_INVENTORY_INVALID'] };
  }

  const inspectRaw = before.length
    ? execute(['inspect', '--format', INSPECT_FORMAT, ...before])
    : '';
  if (inspectRaw === null) return { status: 'FAIL', issues: ['DOCKER_READ_UNAVAILABLE'] };
  const containers = [];
  for (const line of rows(inspectRaw)) {
    const fields = line.split('\t').map(emptyLabel);
    if (fields.length !== 13 || !CONTAINER_ID.test(fields[0]) ||
        !['true', 'false'].includes(fields[2]) ||
        !/^\d+$/.test(fields[3]) || !IMAGE_ID.test(fields[4])) {
      return { status: 'FAIL', issues: ['DOCKER_INVENTORY_INVALID'] };
    }
    containers.push({
      id: fields[0], name: fields[1].replace(/^\//, ''),
      running: fields[2] === 'true', pid: Number(fields[3]),
      imageId: fields[4], imageRef: fields[5],
      applicationUuid: fields[6], serviceUuid: fields[7],
      databaseUuid: fields[8], projectName: fields[9],
      composeProject: fields[10], composeService: fields[11],
      legacyApplicationId: fields[12],
    });
  }
  if (!sameIds(before, containers.map((container) => container.id))) {
    return { status: 'FAIL', issues: ['DOCKER_INVENTORY_CHANGED'] };
  }

  // Read running state again after the final complete-ID list. A worker can
  // start between an earlier running read and that final list without changing
  // the list of container IDs.
  const runningRaw = execute(['ps', '-q', '--no-trunc']);
  const afterRaw = execute(['ps', '-aq', '--no-trunc']);
  const finalRunningRaw = execute(['ps', '-q', '--no-trunc']);
  if (runningRaw === null || afterRaw === null || finalRunningRaw === null) {
    return { status: 'FAIL', issues: ['DOCKER_READ_UNAVAILABLE'] };
  }
  const running = lines(runningRaw);
  const after = lines(afterRaw);
  const finalRunning = lines(finalRunningRaw);
  if (!sameIds(before, after) || running.some((id) => !before.includes(id)) ||
      finalRunning.some((id) => !before.includes(id)) ||
      containers.some((container) => container.running !== running.includes(container.id) ||
        container.running !== finalRunning.includes(container.id))) {
    return { status: 'FAIL', issues: ['DOCKER_INVENTORY_CHANGED'] };
  }
  if (now() - startedAt > MAX_READ_MS) {
    return { status: 'FAIL', issues: ['DOCKER_READ_STALE'] };
  }
  return { status: 'PASS', issues: [], containers };
};
