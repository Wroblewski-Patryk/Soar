import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { createClient } from 'redis';

const proofId = process.env.RUN_011_SUPERVISED_ID;
if (process.env.NODE_ENV !== 'test' || !/^[a-z0-9]{8,24}$/.test(proofId ?? '')) {
  throw new Error('011 supervisor proof requires a unique test-only ID');
}
for (const [name, host, database] of [
  ['DATABASE_URL', 'proof-postgres', 'postgres'],
  ['TEST_DATABASE_URL', 'proof-postgres', 'soar_position_parity_011_test'],
]) {
  const url = new URL(process.env[name] ?? '');
  if (url.hostname !== host || url.port !== '5432' || url.pathname !== `/${database}`)
    throw new Error(`011 supervisor proof rejects ${name}`);
}
const redisUrl = new URL(process.env.REDIS_URL ?? '');
if (redisUrl.hostname !== 'proof-redis' || redisUrl.port !== '6379')
  throw new Error('011 supervisor proof requires its own Redis');

const checkpointKey = `proof:011:supervised:${proofId}:checkpoint`;
const bootId = randomUUID();
const redis = createClient({ url: redisUrl.toString() });
redis.on('error', (error) => process.stderr.write(`011 Redis error: ${error}\n`));
await redis.connect();

const vitest = path.resolve(process.cwd(), 'node_modules/vitest/vitest.mjs');
const testFile = 'src/modules/engine/runtime011RealSourceThreeMode.e2e.test.ts';
const runStage = (stage, title, extraEnv = {}, onOutput = () => {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [vitest, 'run', testFile, '-t', title,
      '--reporter=dot', '--pool=threads', '--maxWorkers=1'], {
      cwd: process.cwd(),
      env: { ...process.env, ...extraEnv,
        RUN_011_REAL_SOURCE_CRASH_RECOVERY_PROOF: '1',
        RUN_011_REAL_SOURCE_THREE_MODE_STAGE: stage,
        RUN_011_SUPERVISED_BOOT_ID: bootId },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
      onOutput(output, child);
    });
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0 && /Tests\s+1 passed/.test(output))
        resolve({ childPid: child.pid, output });
      else reject(new Error(`011 ${stage} exited ${code}/${signal}`));
    });
  });

try {
  const stored = await redis.get(checkpointKey);
  if (!stored) {
    let checkpointWritten = false;
    let checkpointWrite = Promise.resolve();
    await runStage('crash-open', 'uses ordinary LONG', {}, (output, child) => {
      if (checkpointWritten) return;
      const match = output.match(/PUBLIC_011_DCA_CHECKPOINT (\{[^\r\n]*\})/);
      if (!match) return;
      checkpointWritten = true;
      const checkpoint = JSON.parse(match[1]);
      if (checkpoint.pid !== child.pid || checkpoint.dcaId !== 167049972)
        throw new Error('011 checkpoint PID or source DCA mismatch');
      checkpointWrite = redis.set(checkpointKey, JSON.stringify({ ...checkpoint, bootId }),
        { NX: true }).then((result) => {
          if (result !== 'OK') throw new Error('011 checkpoint already exists');
          process.stdout.write(`PUBLIC_011_SUPERVISED_CHECKPOINT ${JSON.stringify({
            ...checkpoint, bootId })}\n`);
        });
    });
    await checkpointWrite;
    throw new Error('011 first stage returned without a hard stop');
  }

  const checkpoint = JSON.parse(stored);
  if (checkpoint.bootId === bootId || checkpoint.dcaId !== 167049972 ||
      !checkpoint.paperId || !checkpoint.liveId || !checkpoint.runId ||
      !checkpoint.strategyId || !checkpoint.durableIds)
    throw new Error('011 persisted checkpoint is invalid');
  process.stdout.write(`PUBLIC_011_SUPERVISOR_AUTO_RESUME ${JSON.stringify({
    previousBootId: checkpoint.bootId, bootId, paperId: checkpoint.paperId,
    liveId: checkpoint.liveId, runId: checkpoint.runId })}\n`);
  const result = await runStage('resume', 'resumes the real source pair', {
    RUN_011_SUPERVISED_PREVIOUS_BOOT_ID: checkpoint.bootId,
    RUN_011_REAL_SOURCE_PAPER_ID: checkpoint.paperId,
    RUN_011_REAL_SOURCE_LIVE_ID: checkpoint.liveId,
    RUN_011_REAL_SOURCE_BACKTEST_ID: checkpoint.runId,
    RUN_011_REAL_SOURCE_STRATEGY_ID: checkpoint.strategyId,
    RUN_011_REAL_SOURCE_DURABLE_IDS: JSON.stringify(checkpoint.durableIds),
    RUN_011_REAL_SOURCE_PARENT_PID: String(checkpoint.pid),
  });
  const line = result.output.split(/\r?\n/).find((row) =>
    row.includes('PUBLIC_011_RUNTIME_PAIR '));
  if (!line) throw new Error('011 resumed runtime did not emit its durable summary');
  const summary = JSON.parse(line.slice(line.indexOf('PUBLIC_011_RUNTIME_PAIR ') +
    'PUBLIC_011_RUNTIME_PAIR '.length));
  if (summary.paperId !== checkpoint.paperId || summary.liveId !== checkpoint.liveId ||
      summary.dcaId !== checkpoint.dcaId || summary.armAggregateId !== 167049975 ||
      summary.ttpId !== 167049977 || !summary.retainedPreCrashIds)
    throw new Error('011 resumed runtime changed identity or source ticks');
  process.stdout.write(`PUBLIC_011_SUPERVISED_DONE ${JSON.stringify({
    bootId, previousBootId: checkpoint.bootId, summary })}\n`);
  setInterval(() => {}, 60_000);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  await redis.quit();
  process.exitCode = 1;
}
