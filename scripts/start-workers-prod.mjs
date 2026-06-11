import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const apiDistDir = path.resolve(rootDir, 'apps', 'api', 'dist', 'workers');

export const workerEntries = [
  { name: 'market-data', file: 'marketData.worker.js' },
  { name: 'market-stream', file: 'marketStream.worker.js' },
  { name: 'backtest', file: 'backtest.worker.js' },
  { name: 'execution', file: 'execution.worker.js' },
];

export const findMissingWorkerFiles = ({
  entries = workerEntries,
  distDir = apiDistDir,
  existsSync = fs.existsSync,
} = {}) =>
  entries
    .map((entry) => path.join(distDir, entry.file))
    .filter((workerPath) => !existsSync(workerPath));

export const writeMissingWorkerGuidance = (missing, stderr = process.stderr) => {
  stderr.write('[workers/prod] missing built worker files:\n');
  for (const workerPath of missing) {
    stderr.write(`  - ${workerPath}\n`);
  }
  stderr.write('[workers/prod] run "pnpm --filter api build" before starting workers.\n');
};

export const prefixLog = (name, chunk, isError = false, streams = {}) => {
  const { stdout = process.stdout, stderr = process.stderr } = streams;
  const text = chunk.toString();
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const prefixed = `[worker/${name}] ${line}`;
    if (isError) {
      stderr.write(`${prefixed}\n`);
    } else {
      stdout.write(`${prefixed}\n`);
    }
  }
};

export const stopAll = (children, signal = 'SIGTERM') => {
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
};

export const startWorkers = (deps = {}) => {
  const {
    entries = workerEntries,
    distDir = apiDistDir,
    cwd = rootDir,
    env = process.env,
    spawnImpl = spawn,
    stdout = process.stdout,
    stderr = process.stderr,
    processImpl = process,
    prefixLogFn = prefixLog,
    stopAllFn = stopAll,
  } = deps;

  const children = [];
  let shuttingDown = false;

  for (const worker of entries) {
    const scriptPath = path.join(distDir, worker.file);
    const child = spawnImpl('node', [scriptPath], {
      cwd,
      shell: false,
      stdio: ['inherit', 'pipe', 'pipe'],
      env,
    });

    child.stdout.on('data', (chunk) => prefixLogFn(worker.name, chunk, false, { stdout, stderr }));
    child.stderr.on('data', (chunk) => prefixLogFn(worker.name, chunk, true, { stdout, stderr }));
    child.on('exit', (code, signal) => {
      if (shuttingDown) return;
      const readable = signal ? `signal ${signal}` : `code ${code ?? 0}`;
      stderr.write(`[worker/${worker.name}] exited with ${readable}\n`);
      shuttingDown = true;
      stopAllFn(children);
      processImpl.exit(code ?? 1);
    });

    children.push(child);
  }

  const gracefulShutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    stdout.write('[workers/prod] shutdown requested\n');
    stopAllFn(children);
    processImpl.exit(0);
  };

  if (processImpl === process) {
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } else {
    processImpl.on('SIGINT', gracefulShutdown);
    processImpl.on('SIGTERM', gracefulShutdown);
  }

  return { children, gracefulShutdown };
};

export const main = (deps = {}) => {
  const {
    stderr = process.stderr,
    exit = process.exit,
    findMissingWorkerFilesFn = findMissingWorkerFiles,
    writeMissingWorkerGuidanceFn = writeMissingWorkerGuidance,
    startWorkersFn = startWorkers,
  } = deps;

  const missing = findMissingWorkerFilesFn(deps);
  if (missing.length > 0) {
    writeMissingWorkerGuidanceFn(missing, stderr);
    exit(1);
    return { status: 'FAIL', reason: 'missing-workers', missing };
  }

  const runtime = startWorkersFn(deps);
  return { status: 'STARTED', runtime };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
