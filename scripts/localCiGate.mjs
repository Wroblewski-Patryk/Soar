#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import {
  appendFileSync,
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
  assessLocalCiResult,
  assertFullSha,
  localCiEvidenceRoot,
  sha256,
} from './localCiManifest.mjs';
import { cleanupLocalCiStaging } from './localCiCleanup.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceRoot = localCiEvidenceRoot();
const args = process.argv.slice(2);
const readArg = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? null : args[index + 1] ?? null;
};
const mode = readArg('--mode');
const failAfterStep = readArg('--self-test-fail-after');
if (!['nightly', 'release'].includes(mode) || (mode === 'release' && !readArg('--sha')) || (mode === 'nightly' && readArg('--sha'))) {
  throw new Error('Usage: node scripts/localCiGate.mjs --mode nightly | --mode release --sha <full trusted SHA>');
}
if (failAfterStep && (mode !== 'release' || failAfterStep !== 'infrastructure.ready')) {
  throw new Error('Controlled failure is allowed only after infrastructure.ready in release mode');
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
let interruptedBy = null;
let activeChild = null;
let cleanupInProgress = false;
const failures = [];
const cleanup = {
  docker: { attempted: false, status: 'NOT_REQUIRED', project },
  staging: null,
};
let status = 'FAIL';
const images = { runner: null, postgres: null, redis: null };
const noteFailure = (message) => { if (!failures.includes(message)) failures.push(message); };
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    interruptedBy ??= signal;
    if (!cleanupInProgress && activeChild) {
      const child = activeChild;
      child.kill('SIGTERM');
      setTimeout(() => { if (activeChild === child) child.kill('SIGKILL'); }, 10_000).unref();
    }
  });
}

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
  if (interruptedBy && !cleanupInProgress) throw new Error(`Interrupted by ${interruptedBy}`);
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

const runLogged = async (id, command, commandArgs, options = {}) => {
  if (interruptedBy && !cleanupInProgress) throw new Error(`Interrupted by ${interruptedBy}`);
  const startedAt = new Date().toISOString();
  const log = `steps/${id}.log`;
  const logPath = path.join(runDir, log);
  const fd = openSync(logPath, options.append ? 'a' : 'w');
  let result;
  try {
    writeFileSync(fd, `$ ${command} ${commandArgs.join(' ')}\n`);
    result = await new Promise((resolve) => {
      const child = spawn(command, commandArgs, {
        cwd: options.cwd ?? repoRoot,
        env: options.env ?? systemEnv,
        stdio: ['ignore', fd, fd],
        windowsHide: true,
      });
      activeChild = child;
      let processError = null;
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
        setTimeout(() => { if (activeChild === child) child.kill('SIGKILL'); }, 10_000).unref();
      }, options.timeout ?? 30 * 60 * 1000);
      child.on('error', (error) => { processError = error; });
      child.on('close', (code, signal) => {
        clearTimeout(timer);
        if (activeChild === child) activeChild = null;
        resolve({ code, signal, processError, timedOut });
      });
    });
    if (result.processError) writeFileSync(fd, `Process error: ${result.processError.message}\n`);
    if (result.timedOut) writeFileSync(fd, 'Process timed out\n');
    if (result.signal) writeFileSync(fd, `Process signal: ${result.signal}\n`);
  } finally {
    closeSync(fd);
  }
  return {
    id,
    exitCode: result.code ?? 1,
    log,
    logSha256: sha256(readFileSync(logPath)),
    startedAt,
    completedAt: new Date().toISOString(),
  };
};

const writeEvidenceStep = (id, detail, exitCode) => {
  const startedAt = new Date().toISOString();
  const log = `steps/${id}.log`;
  const logPath = path.join(runDir, log);
  writeFileSync(logPath, `${JSON.stringify(detail, null, 2)}\n`);
  return { id, exitCode, log, logSha256: sha256(readFileSync(logPath)), startedAt, completedAt: new Date().toISOString() };
};

const addHostStep = (step) => {
  hostSteps.push(step);
  if (interruptedBy) throw new Error(`Interrupted by ${interruptedBy} during ${step.id}`);
  if (step.exitCode !== 0) throw new Error(`${step.id} failed; see ${step.log}`);
  if (failAfterStep === step.id) throw new Error(`Injected failure after ${step.id}`);
};
const composeArgs = (...tail) => ['compose', '--project-name', project, '--file', composeFile, ...tail];

const writeManifest = (lockfileSha256) => {
  const allSteps = [...hostSteps, ...runnerSteps];
  const ordered = REQUIRED_LOCAL_CI_STEPS.map((id) => allSteps.find((step) => step.id === id)).filter(Boolean);
  const outcome = assessLocalCiResult({ steps: ordered, failures, cleanup });
  status = outcome.status;
  const manifest = {
    schemaVersion: 2,
    mode,
    runId,
    candidateSha,
    status,
    startedAt,
    completedAt: new Date().toISOString(),
    failedReason: outcome.failures[0] ?? null,
    failures: outcome.failures,
    cleanup,
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

const cleanupDocker = async () => {
  if (!composeStarted) {
    cleanup.docker = { attempted: false, status: 'NOT_REQUIRED', project };
    hostSteps.push(writeEvidenceStep('infrastructure.cleanup', cleanup.docker, 0));
    return;
  }
  const dockerEnv = {
    ...systemEnv,
    SOAR_CI_PROJECT: project,
    SOAR_CI_SOURCE: sourceDir,
    SOAR_CI_EVIDENCE: runDir,
    SOAR_CI_SHA: candidateSha ?? '0'.repeat(40),
    SOAR_CI_DB_PASSWORD: 'cleanup-only',
  };
  const imageTag = `${project}-runner:node20`;
  const errors = [];
  let step = null;
  try {
    step = await runLogged('infrastructure.cleanup', 'docker', composeArgs('down', '--volumes', '--remove-orphans'), {
      env: dockerEnv,
      timeout: 5 * 60 * 1000,
    });
    if (step.exitCode !== 0) errors.push('Docker Compose down failed');
    const tags = runCapture('docker', ['image', 'ls', '--format', '{{.Repository}}:{{.Tag}}']);
    if (tags.split('\n').includes(imageTag)) {
      const imageStep = await runLogged('infrastructure.cleanup', 'docker', ['image', 'rm', imageTag], {
        env: dockerEnv,
        append: true,
      });
      if (imageStep.exitCode !== 0) errors.push('Scoped runner image removal failed');
    }
    const residual = {
      containers: runCapture('docker', ['ps', '-aq', '--filter', `label=com.docker.compose.project=${project}`]),
      volumes: runCapture('docker', ['volume', 'ls', '-q', '--filter', `label=com.docker.compose.project=${project}`]),
      networks: runCapture('docker', ['network', 'ls', '-q', '--filter', `label=com.docker.compose.project=${project}`]),
      runnerImage: runCapture('docker', ['image', 'ls', '--format', '{{.Repository}}:{{.Tag}}']).split('\n').includes(imageTag),
    };
    if (residual.containers || residual.volumes || residual.networks || residual.runnerImage) {
      errors.push('Scoped Docker resources remain after cleanup');
    }
    cleanup.docker = { attempted: true, status: errors.length === 0 ? 'PASS' : 'FAIL', project, residual, errors };
  } catch (error) {
    errors.push(`Docker cleanup inspection failed: ${error.message}`);
    cleanup.docker = { attempted: true, status: 'FAIL', project, errors };
  }
  if (step) {
    const logPath = path.join(runDir, step.log);
    appendFileSync(logPath, `${JSON.stringify(cleanup.docker, null, 2)}\n`);
    hostSteps.push({ ...step, exitCode: cleanup.docker.status === 'PASS' ? 0 : 1, logSha256: sha256(readFileSync(logPath)), completedAt: new Date().toISOString() });
  } else {
    hostSteps.push(writeEvidenceStep('infrastructure.cleanup', cleanup.docker, 1));
  }
  if (cleanup.docker.status !== 'PASS') noteFailure(`Scoped Docker cleanup failed: ${errors.join('; ')}`);
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
  const checkout = await runLogged('source.checkout', 'git', checkoutArgs, { timeout: 15 * 60 * 1000 });
  addHostStep(checkout);
  if (mode === 'nightly') candidateSha = assertFullSha(runCapture('git', ['rev-parse', 'HEAD'], { cwd: sourceDir }));
  const detach = await runLogged('source.checkout', 'git', ['checkout', '--detach', candidateSha], { cwd: sourceDir, append: true });
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
  addHostStep(await runLogged('runner.image', 'docker', composeArgs('build', 'prepare'), { env: dockerEnv, timeout: 30 * 60 * 1000 }));
  images.runner = runCapture('docker', ['image', 'inspect', `${project}-runner:node20`, '--format', '{{.Id}}']);
  addHostStep(await runLogged('deps.install', 'docker', composeArgs('run', '--rm', 'prepare'), { env: dockerEnv, timeout: 45 * 60 * 1000 }));
  addHostStep(await runLogged('infrastructure.ready', 'docker', composeArgs('up', '-d', '--wait', 'postgres', 'redis'), { env: dockerEnv, timeout: 5 * 60 * 1000 }));
  for (const service of ['postgres', 'redis']) {
    const container = runCapture('docker', composeArgs('ps', '-q', service), { env: dockerEnv });
    images[service] = runCapture('docker', ['inspect', container, '--format', '{{.Image}}']);
  }
  const checks = await runLogged('container.checks', 'docker', composeArgs('run', '--rm', 'checks'), { env: dockerEnv, timeout: 90 * 60 * 1000 });
  if (existsSync(path.join(runDir, 'runner-results.json'))) {
    runnerSteps = JSON.parse(readFileSync(path.join(runDir, 'runner-results.json'), 'utf8')).steps;
  }
  if (checks.exitCode !== 0) throw new Error(`Checks failed; see ${checks.log}`);
} catch (error) {
  noteFailure(error.message);
} finally {
  cleanupInProgress = true;
  try { mkdirSync(path.join(runDir, 'steps'), { recursive: true }); }
  catch (error) { noteFailure(`Evidence directory failed: ${error.message}`); }
  try { await cleanupDocker(); } catch (error) { noteFailure(`Scoped Docker cleanup failed: ${error.message}`); }
  let lockfileSha256 = null;
  try {
    if (existsSync(path.join(sourceDir, 'pnpm-lock.yaml'))) {
      lockfileSha256 = sha256(readFileSync(path.join(sourceDir, 'pnpm-lock.yaml')));
    }
  } catch (error) { noteFailure(`Lockfile evidence failed: ${error.message}`); }
  try {
    cleanup.staging = cleanupLocalCiStaging({
      workspaceRoot: repoRoot,
      stageRoot,
      stageDir,
      quarantineRoot: path.join(evidenceRoot, 'quarantine'),
    });
  } catch (error) {
    cleanup.staging = { attempted: true, status: 'FAIL', target: path.relative(repoRoot, stageDir), existsAfter: existsSync(stageDir), quarantinedAt: null, errors: [error.message] };
  }
  try { hostSteps.push(writeEvidenceStep('staging.cleanup', cleanup.staging, cleanup.staging.status === 'PASS' ? 0 : 1)); }
  catch (error) { noteFailure(`Staging cleanup evidence failed: ${error.message}`); }
  if (cleanup.staging.status !== 'PASS') noteFailure(`Staging cleanup failed: ${cleanup.staging.errors.join('; ')}`);
  if (interruptedBy) noteFailure(`Interrupted by ${interruptedBy}`);
  try { writeManifest(lockfileSha256); } catch (error) {
    noteFailure(`Manifest write failed: ${error.message}`);
    status = 'FAIL';
    process.stderr.write(`[local-ci] ${failures.join('; ')}\n`);
  }
  if (lockHeld) {
    try {
      const holder = JSON.parse(readFileSync(lockPath, 'utf8'));
      if (holder.runId === runId) rmSync(lockPath);
    } catch { /* Keep another process's lock. */ }
  }
}
if (status !== 'PASS') process.exitCode = 1;
