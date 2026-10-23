import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rmdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../src/prisma/client';

const execFileAsync = promisify(execFile);
const proofIt = process.env.RUN_MOMENTUM_PAPER_IMPORT_PROOF === '1' ? it : it.skip;
const databaseUrl = new URL(process.env.DATABASE_URL ?? 'postgresql://localhost/postgres');

const rejectedSnapshot = (strategyId: string, email: string) => ({
  schemaVersion: 1, exportedAt: new Date().toISOString(), source: { email },
  data: { strategies: [{ id: strategyId, name: 'legacy', description: null,
    interval: '1m', leverage: 1, walletRisk: 1,
    config: { open: { direction: 'long', indicatorsLong: [
      { name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } },
    ], indicatorsShort: [] } } }],
    marketUniverses: [], symbolGroups: [], bots: [], botStrategies: [],
    botMarketGroups: [], marketGroupStrategyLinks: [], openPositions: [] },
});

const runRejectedImport = async (snapshot: unknown) => {
  const directory = await mkdtemp(join(tmpdir(), 'soar-momentum-import-'));
  const file = join(directory, 'snapshot.json');
  try {
    await writeFile(file, JSON.stringify(snapshot), 'utf8');
    await expect(execFileAsync(process.execPath, [
      join(process.cwd(), 'node_modules/tsx/dist/cli.mjs'),
      'scripts/importPaperRuntimeSnapshot.ts',
    ], { cwd: process.cwd(), timeout: 20_000, env: {
      ...process.env, DATABASE_URL: databaseUrl.toString(), SNAPSHOT_INPUT: file,
    } })).rejects.toMatchObject({ code: 1,
      stderr: expect.stringContaining('INVALID_MOMENTUM_PERIOD') });
  } finally {
    await unlink(file);
    await rmdir(directory);
  }
};

describe('PAPER snapshot MOMENTUM admission', () => {
  const created = { userId: '', strategyId: '' };
  beforeEach(async () => {
    if (databaseUrl.hostname !== '127.0.0.1' || databaseUrl.port === '5432' ||
        databaseUrl.pathname !== '/soar_momentum_period_001_test')
      throw new Error('Requires own isolated momentum _test');
  });
  afterEach(async () => {
    if (created.strategyId)
      await prisma.strategy.deleteMany({ where: { id: created.strategyId } });
    if (created.userId)
      await prisma.user.deleteMany({ where: { id: created.userId } });
    created.userId = '';
    created.strategyId = '';
  });

  proofIt('rejects a new strategy before creating the snapshot user', async () => {
    const strategyId = randomUUID();
    const email = `snapshot-new-${strategyId}@example.test`;
    const before = { users: await prisma.user.count(), strategies: await prisma.strategy.count() };
    await runRejectedImport(rejectedSnapshot(strategyId, email));
    expect(await prisma.user.count()).toBe(before.users);
    expect(await prisma.strategy.count()).toBe(before.strategies);
    expect(await prisma.user.findUnique({ where: { email } })).toBeNull();
    expect(await prisma.strategy.findUnique({ where: { id: strategyId } })).toBeNull();
  });

  proofIt('rejects an invalid upsert without changing the existing strategy', async () => {
    const email = `snapshot-existing-${randomUUID()}@example.test`;
    const user = await prisma.user.create({ data: { email, password: 'local-test-only' } });
    created.userId = user.id;
    const config = { open: { direction: 'long', indicatorsLong: [
      { name: 'MOMENTUM', condition: '>', value: 0, params: { period: 2 } },
    ], indicatorsShort: [] } };
    const strategy = await prisma.strategy.create({ data: { userId: user.id,
      name: 'existing', interval: '1m', leverage: 1, walletRisk: 1, config } });
    created.strategyId = strategy.id;
    await runRejectedImport(rejectedSnapshot(strategy.id, email));
    expect((await prisma.strategy.findUniqueOrThrow({ where: { id: strategy.id } })).config)
      .toEqual(config);
    expect(await prisma.user.findUnique({ where: { id: user.id } })).toMatchObject({ email });
  });
});
