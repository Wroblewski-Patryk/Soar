import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();

const workerCommands = [
  {
    name: 'execution',
    args: ['--filter', 'api', 'dev:worker:execution'],
  },
  {
    name: 'market-stream',
    args: ['--filter', 'api', 'dev:worker:market-stream'],
  },
];

const children = [];

const prefixLog = (
  name,
  chunk,
  isError = false,
  { stdout = process.stdout, stderr = process.stderr } = {}
) => {
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

const shutdown = (workerChildren = children, { exit = process.exit } = {}) => {
  for (const proc of workerChildren) {
    if (!proc.killed) proc.kill();
  }
  exit(0);
};

const handleWorkerExit = (
  workerName,
  code,
  workerChildren = children,
  { stderr = process.stderr, exit = process.exit } = {}
) => {
  const normalized = typeof code === 'number' ? code : 0;
  if (normalized !== 0) {
    stderr.write(`[worker/${workerName}] exited with code ${normalized}\n`);
    for (const proc of workerChildren) {
      if (!proc.killed) proc.kill();
    }
    exit(normalized);
  }
  return normalized;
};

const main = ({
  commands = workerCommands,
  root = rootDir,
  platform = process.platform,
  spawnImpl = spawn,
  processImpl = process,
  stdout = process.stdout,
  stderr = process.stderr,
  workerChildren = children,
} = {}) => {
  for (const worker of commands) {
    const child = spawnImpl('pnpm', worker.args, {
      cwd: root,
      shell: platform === 'win32',
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => prefixLog(worker.name, chunk, false, { stdout, stderr }));
    child.stderr.on('data', (chunk) => prefixLog(worker.name, chunk, true, { stdout, stderr }));
    child.on('exit', (code) => {
      handleWorkerExit(worker.name, code, workerChildren, {
        stderr,
        exit: processImpl.exit,
      });
    });

    workerChildren.push(child);
  }

  const shutdownImpl = () => {
    shutdown(workerChildren, { exit: processImpl.exit });
  };

  processImpl.on('SIGINT', shutdownImpl);
  processImpl.on('SIGTERM', shutdownImpl);

  return { children: workerChildren, shutdownImpl };
};

export { handleWorkerExit, main, prefixLog, shutdown };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
