import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();

const requiredEnvFiles = [
  path.resolve(rootDir, 'apps', 'api', '.env'),
  path.resolve(rootDir, 'apps', 'web', '.env.local'),
];

export const validateRequiredEnvFiles = ({ envFiles = requiredEnvFiles, existsSync = fs.existsSync } = {}) =>
  envFiles.filter((envPath) => !existsSync(envPath));

export const writeMissingEnvGuidance = (missing, stderr = process.stderr) => {
  for (const envPath of missing) {
    stderr.write(`[prod-like] missing required env file: ${envPath}\n`);
  }
  stderr.write(
    '[prod-like] bootstrap with:\n' +
      '  Copy-Item apps/api/.env.example apps/api/.env -ErrorAction SilentlyContinue\n' +
      '  Copy-Item apps/web/.env.example apps/web/.env.local -ErrorAction SilentlyContinue\n',
  );
};

export const runStep = (label, command, args, deps = {}) =>
  new Promise((resolve, reject) => {
    const {
      cwd = rootDir,
      env = process.env,
      spawnImpl = spawn,
      stdout = process.stdout,
    } = deps;

    stdout.write(`[prod-like] ${label}\n`);
    const child = spawnImpl(command, args, {
      cwd,
      shell: true,
      stdio: 'inherit',
      env,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with code ${code ?? 1}`));
    });

    child.on('error', (error) => reject(error));
  });

export const runtimeEntries = [
  { name: 'api', command: 'pnpm', args: ['--filter', 'api', 'run', 'run'] },
  { name: 'web', command: 'pnpm', args: ['--filter', 'web', 'start'] },
  { name: 'workers', command: 'pnpm', args: ['run', 'workers/prod'] },
];

export const prefixLog = (name, chunk, isError = false, streams = {}) => {
  const { stdout = process.stdout, stderr = process.stderr } = streams;
  const lines = chunk.toString().split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const prefixed = `[prod-like/${name}] ${line}`;
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

export const startRuntime = (deps = {}) => {
  const {
    entries = runtimeEntries,
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

  for (const entry of entries) {
    const child = spawnImpl(entry.command, entry.args, {
      cwd,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
      env,
    });

    child.stdout.on('data', (chunk) => prefixLogFn(entry.name, chunk, false, { stdout, stderr }));
    child.stderr.on('data', (chunk) => prefixLogFn(entry.name, chunk, true, { stdout, stderr }));
    child.on('exit', (code, signal) => {
      if (shuttingDown) return;
      const readable = signal ? `signal ${signal}` : `code ${code ?? 0}`;
      stderr.write(`[prod-like/${entry.name}] exited with ${readable}\n`);
      shuttingDown = true;
      stopAllFn(children);
      processImpl.exit(code ?? 1);
    });

    children.push(child);
  }

  stdout.write('[prod-like] api/web/workers started\n');

  const gracefulShutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    stdout.write('[prod-like] shutdown requested\n');
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

export const main = async (deps = {}) => {
  const {
    stderr = process.stderr,
    exit = process.exit,
    validateRequiredEnvFilesFn = validateRequiredEnvFiles,
    writeMissingEnvGuidanceFn = writeMissingEnvGuidance,
    runStepFn = runStep,
    startRuntimeFn = startRuntime,
  } = deps;

  const missing = validateRequiredEnvFilesFn(deps);
  if (missing.length > 0) {
    writeMissingEnvGuidanceFn(missing, stderr);
    exit(1);
    return { status: 'FAIL', reason: 'missing-env', missing };
  }

  try {
    await runStepFn('build api', 'pnpm', ['--filter', 'api', 'build'], deps);
    await runStepFn('build web', 'pnpm', ['--filter', 'web', 'build'], deps);
  } catch (error) {
    stderr.write(`[prod-like] preflight failed: ${error.message}\n`);
    exit(1);
    return { status: 'FAIL', reason: 'preflight', error };
  }

  const runtime = startRuntimeFn(deps);
  return { status: 'STARTED', runtime };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
