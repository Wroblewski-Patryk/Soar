import { execFile } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { promisify } from 'node:util';

if (process.env.RUN_011_SUPERVISED_PROOF !== '1') {
  throw new Error('Set RUN_011_SUPERVISED_PROOF=1 for the isolated 011 process proof');
}

const exec = promisify(execFile);
const root = process.cwd();
const proofPaths = [
  'apps/api/src/modules/engine/runtime011RealSourceThreeMode.e2e.test.ts',
  'apps/api/scripts/runtime011-supervised-proof.mjs',
  'docker-compose.proof011.yml',
  'scripts/run011-supervised-proof.mjs',
];
const sourceCommit = (await exec('git', ['rev-parse', 'HEAD'], { cwd: root }))
  .stdout.trim();
const proofSourcesClean = !(await exec('git', ['status', '--porcelain', '--',
  ...proofPaths], { cwd: root })).stdout.trim();
if (process.env.RUN_011_REQUIRE_EXACT_SHA === '1' && !proofSourcesClean)
  throw new Error('011 exact-SHA proof requires committed proof sources');
const proofId = randomBytes(6).toString('hex');
const project = `soar011${proofId}`;
const image = `soar-011-supervised-proof:${proofId}`;
const composeFile = path.join(root, 'docker-compose.proof011.yml');
const env = { ...process.env, SOAR_011_PROOF_ID: proofId,
  SOAR_011_TEST_JWT: randomBytes(48).toString('hex') };
const composeArgs = ['compose', '--project-name', project, '--file', composeFile];
const call = async (args, timeout = 60_000, allowFailure = false) => {
  try {
    const result = await exec('docker', args, { cwd: root, env, timeout,
      maxBuffer: 8 * 1024 * 1024 });
    return result.stdout.trim();
  } catch (error) {
    if (allowFailure) return String(error.stdout ?? '').trim();
    const detail = String(error.stderr ?? error.message ?? error).slice(0, 2000);
    throw new Error(`docker ${args.slice(0, 3).join(' ')} failed: ${detail}`);
  }
};
const compose = (args, timeout) => call([...composeArgs, ...args], timeout);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitFor = async (label, timeout, check) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const result = await check();
    if (result) return result;
    await delay(1_000);
  }
  throw new Error(`Timed out waiting for ${label}`);
};
const inspect = async (id) => JSON.parse(await call(['inspect', id]))[0];
const proofWorkerId = async () => (await compose(['ps', '-q', 'proof-worker'])).trim();
const verifyWorker = async (id) => {
  const value = await inspect(id);
  if (value.Config.Labels?.['com.docker.compose.project'] !== project ||
      value.Config.Labels?.['com.docker.compose.service'] !== 'proof-worker' ||
      value.HostConfig.RestartPolicy?.Name !== 'unless-stopped')
    throw new Error('Refusing to touch a container outside this proof project');
  return value;
};
const sql = async (query) => (await compose(['exec', '-T', 'proof-postgres', 'psql',
  '-U', 'postgres', '-d', 'soar_position_parity_011_test', '-tAc', query])).trim();
const countsQuery = `SELECT
  (SELECT count(*) FROM "Position" WHERE status = 'OPEN'),
  (SELECT count(*) FROM "Position" WHERE status = 'CLOSED'),
  (SELECT count(*) FROM "Trade" WHERE "lifecycleAction" = 'DCA'),
  (SELECT count(*) FROM "Order"),
  (SELECT count(*) FROM "LiveOrderIntent"),
  (SELECT count(*) FROM "OrderFill"),
  (SELECT count(*) FROM "Signal" WHERE direction = 'EXIT'),
  (SELECT count(*) FROM "BacktestRun"),
  (SELECT count(*) FROM "BacktestReport"),
  (SELECT count(*) FROM "BacktestTrade")`;
const counts = async () => (await sql(countsQuery)).split('|').map(Number);
const parseMarker = (logs, marker) => {
  const line = logs.split(/\r?\n/).findLast((row) => row.includes(`${marker} {`));
  if (!line) return null;
  return JSON.parse(line.slice(line.indexOf(`${marker} `) + marker.length + 1));
};

let stackStarted = false;
try {
  process.stdout.write(`011 isolated Compose project ${project}\n`);
  stackStarted = true;
  await compose(['up', '-d', 'proof-postgres', 'proof-redis'], 120_000);
  await compose(['build', 'proof-worker'], 900_000);
  await compose(['run', '--rm', '--no-deps', '-e',
    'DATABASE_URL=postgresql://postgres@proof-postgres:5432/soar_position_parity_011_test',
    'proof-worker', 'pnpm', 'exec', 'prisma', 'migrate', 'deploy'], 300_000);
  await compose(['up', '-d', '--no-build', 'proof-worker'], 120_000);
  const id = await waitFor('own worker container', 30_000, proofWorkerId);
  const initial = await verifyWorker(id);
  if (!initial.State.Running || initial.RestartCount !== 0)
    throw new Error('011 proof worker did not begin with one running instance');

  const checkpoint = await waitFor('durable source DCA checkpoint', 180_000,
    async () => parseMarker(await call(['logs', id]), 'PUBLIC_011_SUPERVISED_CHECKPOINT'));
  if (checkpoint.dcaId !== 167049972 || !checkpoint.bootId ||
      !checkpoint.paperId || !checkpoint.liveId || !checkpoint.runId ||
      !checkpoint.strategyId || !checkpoint.durableIds ||
      checkpoint.durableIds.dcaTradeIds?.length !== 2 ||
      checkpoint.durableIds.orderIds?.length !== 4 ||
      checkpoint.durableIds.intentIds?.length !== 2 ||
      checkpoint.durableIds.fillIds?.length !== 2)
    throw new Error('011 source DCA checkpoint is incomplete');
  const before = await verifyWorker(id);
  if (before.RestartCount !== 0 || before.State.Pid <= 0)
    throw new Error('011 worker restarted before controlled hard stop');
  const beforeCounts = await counts();
  if (beforeCounts.join(',') !== '2,0,2,4,2,2,0,1,1,6')
    throw new Error(`011 DCA was not durable before kill: ${beforeCounts}`);

  if (!Number.isInteger(checkpoint.pid) || checkpoint.pid <= 1)
    throw new Error('011 worker PID is not a killable child process');
  await call(['exec', id, 'sh', '-c', 'kill -0 "$1"',
    'proof-check', String(checkpoint.pid)]);
  // Kill the verified Vitest runtime child. Its own test finally must not run;
  // the bootstrap then exits nonzero and Compose restarts the same service.
  // `docker kill` would be a manual stop and suppress the restart policy.
  await call(['exec', '--user', 'root', id, 'sh', '-c', 'kill -9 "$1"',
    'proof-kill', String(checkpoint.pid)], 15_000);
  const restarted = await waitFor('Compose restart after SIGKILL', 60_000,
    async () => {
      const state = await verifyWorker(id);
      return state.RestartCount > before.RestartCount && state.State.Running &&
        state.State.Pid > 0 && state.State.Pid !== before.State.Pid ? state : null;
    });
  const done = await waitFor('automatic archive replay and TTP', 180_000,
    async () => parseMarker(await call(['logs', id]), 'PUBLIC_011_SUPERVISED_DONE'));
  if (done.previousBootId !== checkpoint.bootId || done.bootId === checkpoint.bootId ||
      done.summary.paperId !== checkpoint.paperId ||
      done.summary.liveId !== checkpoint.liveId ||
      done.summary.dcaId !== 167049972 ||
      done.summary.armAggregateId !== 167049975 ||
      done.summary.ttpId !== 167049977 || !done.summary.retainedPreCrashIds)
    throw new Error('011 automatic recovery changed identity or source ticks');
  const afterCounts = await counts();
  if (afterCounts.join(',') !== '0,2,2,6,3,3,0,1,1,6')
    throw new Error(`011 recovery added or lost durable rows: ${afterCounts}`);
  process.stdout.write(`PUBLIC_011_SUPERVISOR_PROOF ${JSON.stringify({
    project, image, sourceCommit, proofSourcesClean, containerId: id,
    previousHostPid: before.State.Pid,
    restartedHostPid: restarted.State.Pid, restartCount: restarted.RestartCount,
    checkpoint, beforeCounts, afterCounts, result: done.summary })}\n`);
} finally {
  if (stackStarted) {
    const ids = (await compose(['ps', '-aq']).catch(() => '')).split(/\r?\n/)
      .map((value) => value.trim()).filter(Boolean);
    const volumeNames = (await call(['volume', 'ls', '--filter',
      `label=com.docker.compose.project=${project}`, '--format', '{{.Name}}'])
      .catch(() => '')).split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
    const containers = await Promise.all(ids.map((id) => inspect(id)));
    const volumes = volumeNames.length > 0
      ? JSON.parse(await call(['volume', 'inspect', ...volumeNames])) : [];
    const ownContainers = containers.every((value) =>
      value.Config.Labels?.['com.docker.compose.project'] === project &&
      ['proof-worker', 'proof-postgres', 'proof-redis'].includes(
        value.Config.Labels?.['com.docker.compose.service']));
    const ownVolumes = volumes.every((value) =>
      value.Labels?.['com.docker.compose.project'] === project);
    if (ownContainers && ownVolumes && (ids.length > 0 || volumeNames.length > 0)) {
      await compose(['down', '--volumes', '--remove-orphans'], 120_000);
      await call(['image', 'rm', image], 60_000, true);
    } else if (!ownContainers || !ownVolumes) {
      process.stderr.write(`011 cleanup skipped: uncertain ownership in ${project}\n`);
    }
  }
}
