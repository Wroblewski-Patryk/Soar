import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertFullSha, sha256 } from './localCiManifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = '/evidence';
const expectedSha = assertFullSha(process.env.SOURCE_COMMIT);
const testUrl = new URL(process.env.TEST_DATABASE_URL ?? '');
const runtimeUrl = new URL(process.env.DATABASE_URL ?? '');
if (
  testUrl.hostname !== 'postgres' ||
  runtimeUrl.hostname !== 'postgres' ||
  !decodeURIComponent(testUrl.pathname.slice(1)).endsWith('_test') ||
  decodeURIComponent(runtimeUrl.pathname.slice(1)).endsWith('_test') ||
  testUrl.toString() === runtimeUrl.toString() ||
  new URL(process.env.REDIS_URL ?? '').hostname !== 'redis'
) {
  throw new Error('Local CI requires only isolated Docker service URLs and an _test database');
}

mkdirSync(path.join(evidenceDir, 'steps'), { recursive: true });
const steps = [
  ['repo.guardrails', 'pnpm', ['run', 'quality:guardrails']],
  ['repo.docs-parity', 'pnpm', ['run', 'docs:parity:check']],
  ['web.lint', 'pnpm', ['--filter', 'web', 'run', 'lint']],
  ['web.typecheck', 'pnpm', ['--filter', 'web', 'run', 'typecheck']],
  ['web.vitest', 'pnpm', ['--filter', 'web', 'exec', 'vitest', 'run']],
  ['web.build', 'pnpm', ['--filter', 'web', 'run', 'build']],
  ['api.prisma-generate', 'pnpm', ['--filter', 'api', 'exec', 'prisma', 'generate', '--schema', 'prisma/schema.prisma']],
  ['api.migrate-deploy', 'pnpm', ['--filter', 'api', 'exec', 'prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'], { DATABASE_URL: testUrl.toString() }],
  ['api.migrate-status', 'pnpm', ['--filter', 'api', 'exec', 'prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'], { DATABASE_URL: testUrl.toString() }],
  ['api.build', 'pnpm', ['--filter', 'api', 'run', 'build']],
  ['api.typecheck', 'pnpm', ['--filter', 'api', 'run', 'typecheck']],
  ['api.vitest', 'pnpm', ['--filter', 'api', 'exec', 'vitest', 'run']],
];

const run = (id, command, args, overrides = {}) =>
  new Promise((resolve) => {
    const startedAt = new Date().toISOString();
    const log = `steps/${id}.log`;
    const stream = createWriteStream(path.join(evidenceDir, log), { flags: 'w' });
    stream.write(`$ ${command} ${args.join(' ')}\n`);
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...overrides },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.pipe(stream, { end: false });
    child.stderr.pipe(stream, { end: false });
    child.on('error', (error) => stream.write(`Process error: ${error.message}\n`));
    child.on('close', (code) => {
      stream.end(() => {
        const logSha256 = sha256(readFileSync(path.join(evidenceDir, log)));
        resolve({ id, exitCode: code ?? 1, log, logSha256, startedAt, completedAt: new Date().toISOString() });
      });
    });
  });

const results = [];
let failed = false;
try {
  const head = (await run('source.head', 'git', ['rev-parse', 'HEAD']));
  if (head.exitCode !== 0 || readFileSync(path.join(evidenceDir, head.log), 'utf8').trim().split('\n').at(-1) !== expectedSha) {
    throw new Error('The isolated checkout does not match SOURCE_COMMIT');
  }
  const clean = await run('source.initial-clean', 'git', ['status', '--porcelain']);
  if (clean.exitCode !== 0 || readFileSync(path.join(evidenceDir, clean.log), 'utf8').trim().split('\n').length > 1) {
    throw new Error('The isolated checkout is not clean before checks');
  }
  for (const [id, command, args, overrides] of steps) {
    process.stdout.write(`[local-ci] ${id}\n`);
    const result = await run(id, command, args, overrides);
    results.push(result);
    if (result.exitCode !== 0) throw new Error(`${id} failed; see ${result.log}`);
  }
  const trackedClean = await run('source.tracked-clean', 'git', ['diff', '--exit-code']);
  results.push(trackedClean);
  if (trackedClean.exitCode !== 0) throw new Error('Checks changed tracked source files');
} catch (error) {
  failed = true;
  process.stderr.write(`[local-ci] ${error.message}\n`);
} finally {
  writeFileSync(path.join(evidenceDir, 'runner-results.json'), `${JSON.stringify({ status: failed ? 'FAIL' : 'PASS', steps: results }, null, 2)}\n`);
}
process.exitCode = failed ? 1 : 0;
