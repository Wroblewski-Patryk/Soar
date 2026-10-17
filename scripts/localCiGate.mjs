#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REQUIRED_LOCAL_CI_STEPS,
  assertFullSha,
  localCiEvidenceRoot,
  sha256,
} from './localCiManifest.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceRoot = localCiEvidenceRoot();
const args = process.argv.slice(2);
const readArg = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? null : args[index + 1] ?? null;
};
const mode = readArg('--mode');
if (!['nightly', 'release'].includes(mode) || (mode === 'release' && !readArg('--sha')) || (mode === 'nightly' && readArg('--sha'))) {
  throw new Error('Usage: node scripts/localCiGate.mjs --mode nightly | --mode release --sha <full trusted SHA>');
}
let candidateSha = mode === 'release' ? assertFullSha(readArg('--sha')) : null;

const systemEnv = Object.fromEntries(
  [
    'PATH', 'Path', 'SystemRoot', 'WINDIR', 'ComSpec', 'PATHEXT', 'TEMP', 'TMP',
    'USERPROFILE', 'APPDATA', 'LOCALAPPDATA', 'ProgramData', 'ProgramFiles',
    'ProgramFiles(x86)', 'HOME', 'LANG',
  ].filter((key) => process.env[key] != null).map((key) => [key, process.env[key]])
);
const runId = `${new Date().toISOString().replace(/[:.]/g, '-').toLowerCase()}-${randomBytes(4).toString('hex')}`;
const startedAt = new Date().toISOString();
const project = `soar-ci-${randomBytes(5).toString('hex')}`;
const runDir = path.join(evidenceRoot, 'runs', runId);
// Docker Desktop does not reliably project newly created files from LocalAppData
// into Linux bind mounts. Keep the disposable clone under the already shared
// checkout; tmp/ is ignored and the clone is removed after every run.
const stageRoot = path.join(repoRoot, 'tmp', 'local-ci-staging');
const stageDir = path.join(stageRoot, runId);
const sourceDir = path.join(stageDir, 'source');
const composeFile = path.join(sourceDir, '.ci', 'local-ci.compose.yml');
const lockPath = path.join(evidenceRoot, 'run.lock');
const hostSteps = [];
let runnerSteps = [];
let lockHeld = false;
let composeStarted = false;
let failedReason = null;
let status = 'FAIL';
const images = { runner: null, postgres: null, redis: null };

const safeRemoveStage = () => {
  const relative = path.relative(stageRoot, stageDir);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Unsafe staging cleanup target');
  if (existsSync(stageDir)) rmSync(stageDir, { recursive: true, force: true });
};

const acquireLock = () => {
  mkdirSync(evidenceRoot, { recursive: true });
  for (let attempt = 0; attempt < (mode === 'release' ? 120 : 1); attempt += 1) {
    try {
      const fd = openSync(lockPath, 'wx');
      writeFileSync(fd, `${JSON.stringify({ pid: process.pid, runId, startedAt: new Date().toISOString() })}\n`);
      closeSync(fd);
      lockHeld = true;
      return true;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let holder = null;
      try { holder = JSON.parse(readFileSync(lockPath, 'utf8')); } catch { /* A concurrent process may still be writing. */ }
      if (holder?.pid && Number.isInteger(holder.pid)) {
        try { process.kill(holder.pid, 0); } catch (probeError) {
          if (probeError.code === 'ESRCH') {
            try { renameSync(lockPath, `${lockPath}.stale-${randomBytes(3).toString('hex')}`); } catch { /* Another process handled it. */ }
            continue;
          }
        }
      }
      if (mode === 'nightly') return false;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30_000);
    }
  }
  throw new Error('Another local CI run still holds the lock');
};

const runCapture = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? systemEnv,
    encoding: 'utf8',
    timeout: options.timeout ?? 30_000,
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(`${command} ${commandArgs.join(' ')} failed: ${(result.stderr || result.stdout || result.error?.message || '').trim()}`);
  return result.stdout.trim();
};

const runLogged = (id, command, commandArgs, options = {}) => {
  const startedAt = new Date().toISOString();
  const log = `steps/${id}.log`;
  const logPath = path.join(runDir, log);
  const fd = openSync(logPath, options.append ? 'a' : 'w');
  writeFileSync(fd, `$ ${command} ${commandArgs.join(' ')}\n`);
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? systemEnv,
    stdio: ['ignore', fd, fd],
    timeout: options.timeout ?? 30 * 60 * 1000,
    windowsHide: true,
  });
  if (result.error) writeFileSync(fd, `Process error: ${result.error.message}\n`);
  closeSync(fd);
  return {
    id,
    exitCode: result.status ?? 1,
    log,
    logSha256: sha256(readFileSync(logPath)),
    startedAt,
    completedAt: new Date().toISOString(),
  };
};

const addHostStep = (step) => { hostSteps.push(step); if (step.exitCode !== 0) throw new Error(`${step.id} failed; see ${step.log}`); };
const composeArgs = (...tail) => ['compose', '--project-name', project, '--file', composeFile, ...tail];

const writeManifest = (lockfileSha256) => {
  const allSteps = [...hostSteps, ...runnerSteps];
  const ordered = REQUIRED_LOCAL_CI_STEPS.map((id) => allSteps.find((step) => step.id === id)).filter(Boolean);
  const complete = ordered.length === REQUIRED_LOCAL_CI_STEPS.length && ordered.every((step) => step.exitCode === 0);
  status = !failedReason && complete ? 'PASS' : 'FAIL';
  const manifest = {
    schemaVersion: 1,
    mode,
    runId,
    candidateSha,
    status,
    startedAt,
    completedAt: new Date().toISOString(),
    failedReason,
    coverage: {
      ciParity: status === 'PASS' ? 'PASS' : 'FAIL',
      application: 'PARTIAL',
      gaps: ['Worker Docker image builds and isolated running-worker smoke are not covered', 'No real exchange or production user-flow proof'],
    },
    lockfileSha256,
    images,
    steps: ordered,
  };
  writeFileSync(path.join(runDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  if (mode === 'release' && candidateSha) {
    const pointerDir = path.join(evidenceRoot, 'by-sha');
    mkdirSync(pointerDir, { recursive: true });
    const pointerPath = path.join(pointerDir, `${candidateSha}.json`);
    const pending = `${pointerPath}.${runId}.tmp`;
    writeFileSync(pending, `${JSON.stringify({ sha: candidateSha, runId })}\n`);
    renameSync(pending, pointerPath);
  }
  if (mode === 'nightly') {
    const statePath = path.join(evidenceRoot, 'nightly-state.json');
    const state = { sha: candidateSha, status, failedStep: ordered.find((step) => step.exitCode !== 0)?.id ?? null };
    let previous = null;
    try { previous = JSON.parse(readFileSync(statePath, 'utf8')); } catch { /* First run. */ }
    if (JSON.stringify(previous) !== JSON.stringify(state)) {
      writeFileSync(path.join(runDir, 'state-change.json'), `${JSON.stringify({ previous, current: state })}\n`);
      writeFileSync(statePath, `${JSON.stringify(state)}\n`);
    }
  }
  process.stdout.write(`[local-ci] ${status} ${candidateSha ?? '-'} evidence=${path.join(runDir, 'manifest.json')}\n`);
};

if (!acquireLock()) process.exit(0);
try {
  mkdirSync(path.join(runDir, 'steps'), { recursive: true });
  mkdirSync(stageDir, { recursive: true });
  if (mode === 'release') {
    const pointerDir = path.join(evidenceRoot, 'by-sha');
    mkdirSync(pointerDir, { recursive: true });
    const pointerPath = path.join(pointerDir, `${candidateSha}.json`);
    const pending = `${pointerPath}.${runId}.tmp`;
    writeFileSync(pending, `${JSON.stringify({ sha: candidateSha, runId })}\n`);
    renameSync(pending, pointerPath);
  }
  const context = runCapture('docker', ['context', 'show']);
  if (context !== 'desktop-linux') throw new Error(`Refusing nonlocal Docker context: ${context}`);
  const origin = runCapture('git', ['remote', 'get-url', 'origin']);
  if (origin.toLowerCase() !== 'https://github.com/wroblewski-patryk/soar.git') {
    throw new Error('Origin must be the trusted public Soar repository');
  }
  const checkoutArgs = mode === 'nightly'
    ? ['clone', '--depth', '1', '--branch', 'main', origin, sourceDir]
    : ['clone', '--no-local', '--no-checkout', repoRoot, sourceDir];
  let checkout = runLogged('source.checkout', 'git', checkoutArgs, { timeout: 15 * 60 * 1000 });
  addHostStep(checkout);
  if (mode === 'nightly') candidateSha = assertFullSha(runCapture('git', ['rev-parse', 'HEAD'], { cwd: sourceDir }));
  const detach = runLogged('source.checkout', 'git', ['checkout', '--detach', candidateSha], { cwd: sourceDir, append: true });
  addHostStep(detach);
  // Collapse clone and detach into one required evidence step.
  hostSteps.splice(0, 2, { ...detach, startedAt: checkout.startedAt });
  if (runCapture('git', ['rev-parse', 'HEAD'], { cwd: sourceDir }) !== candidateSha ||
      runCapture('git', ['status', '--porcelain'], { cwd: sourceDir })) {
    throw new Error('Source clone is not clean at the requested SHA');
  }

  const dockerEnv = {
    ...systemEnv,
    SOAR_CI_PROJECT: project,
    SOAR_CI_SOURCE: sourceDir,
    SOAR_CI_EVIDENCE: runDir,
    SOAR_CI_SHA: candidateSha,
    SOAR_CI_DB_PASSWORD: randomBytes(20).toString('hex'),
  };
  composeStarted = true;
  addHostStep(runLogged('runner.image', 'docker', composeArgs('build', 'prepare'), { env: dockerEnv, timeout: 30 * 60 * 1000 }));
  images.runner = runCapture('docker', ['image', 'inspect', `${project}-runner:node20`, '--format', '{{.Id}}']);
  addHostStep(runLogged('deps.install', 'docker', composeArgs('run', '--rm', 'prepare'), { env: dockerEnv, timeout: 45 * 60 * 1000 }));
  addHostStep(runLogged('infrastructure.ready', 'docker', composeArgs('up', '-d', '--wait', 'postgres', 'redis'), { env: dockerEnv, timeout: 5 * 60 * 1000 }));
  for (const service of ['postgres', 'redis']) {
    const container = runCapture('docker', composeArgs('ps', '-q', service), { env: dockerEnv });
    images[service] = runCapture('docker', ['inspect', container, '--format', '{{.Image}}']);
  }
  const checks = runLogged('container.checks', 'docker', composeArgs('run', '--rm', 'checks'), { env: dockerEnv, timeout: 90 * 60 * 1000 });
  if (existsSync(path.join(runDir, 'runner-results.json'))) {
    runnerSteps = JSON.parse(readFileSync(path.join(runDir, 'runner-results.json'), 'utf8')).steps;
  }
  if (checks.exitCode !== 0) throw new Error(`Checks failed; see ${checks.log}`);
} catch (error) {
  failedReason = error.message;
} finally {
  if (composeStarted) {
    const dockerEnv = {
      ...systemEnv,
      SOAR_CI_PROJECT: project,
      SOAR_CI_SOURCE: sourceDir,
      SOAR_CI_EVIDENCE: runDir,
      SOAR_CI_SHA: candidateSha ?? '0'.repeat(40),
      SOAR_CI_DB_PASSWORD: 'cleanup-only',
    };
    try {
      const cleanup = runLogged('infrastructure.cleanup', 'docker', composeArgs('down', '--volumes', '--remove-orphans'), { env: dockerEnv, timeout: 5 * 60 * 1000 });
      hostSteps.push(cleanup);
      if (cleanup.exitCode !== 0) failedReason ??= 'Scoped Docker cleanup failed';
      if (images.runner) {
        const imageCleanup = runLogged('infrastructure.cleanup', 'docker', ['image', 'rm', `${project}-runner:node20`], { env: dockerEnv, append: true });
        hostSteps[hostSteps.length - 1] = { ...imageCleanup, startedAt: cleanup.startedAt, exitCode: cleanup.exitCode || imageCleanup.exitCode };
        if (imageCleanup.exitCode !== 0) failedReason ??= 'Scoped runner image cleanup failed';
      }
    } catch (error) { failedReason ??= `Scoped Docker cleanup failed: ${error.message}`; }
  }
  let lockfileSha256 = null;
  try {
    if (existsSync(path.join(sourceDir, 'pnpm-lock.yaml'))) {
      lockfileSha256 = sha256(readFileSync(path.join(sourceDir, 'pnpm-lock.yaml')));
    }
  } catch (error) { failedReason ??= `Lockfile evidence failed: ${error.message}`; }
  try { safeRemoveStage(); } catch (error) { failedReason ??= `Staging cleanup failed: ${error.message}`; }
  try { writeManifest(lockfileSha256); } catch (error) {
    failedReason ??= `Manifest write failed: ${error.message}`;
    status = 'FAIL';
    process.stderr.write(`[local-ci] ${failedReason}\n`);
  }
  if (lockHeld) {
    try {
      const holder = JSON.parse(readFileSync(lockPath, 'utf8'));
      if (holder.runId === runId) rmSync(lockPath);
    } catch { /* Keep another process's lock. */ }
  }
}
if (status !== 'PASS') process.exitCode = 1;
