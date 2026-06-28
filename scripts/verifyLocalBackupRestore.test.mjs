import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  detectPostgresContainer,
  dockerExecSh,
  main,
  normalizeIdSuffix,
  nowStamp,
  parseArgs,
} from './verifyLocalBackupRestore.mjs';

test('parseArgs reads explicit values before environment defaults', () => {
  assert.deepEqual(parseArgs([], { DB_CHECK_CONTAINER: 'env-db', DB_CHECK_USER: 'env-user', DB_CHECK_NAME: 'env-name' }), {
    container: 'env-db',
    dbUser: 'env-user',
    dbName: 'env-name',
  });
  assert.deepEqual(parseArgs(['--container', 'cli-db', '--db-user', 'cli-user', '--db-name', 'cli-name'], {}), {
    container: 'cli-db',
    dbUser: 'cli-user',
    dbName: 'cli-name',
  });
});

test('container and command helpers are deterministic with injected runner', () => {
  const runCalls = [];
  const runImpl = (command, args) => {
    runCalls.push([command, args]);
    return 'other\ncryptosparrow-postgres-1\nplain-postgres';
  };
  assert.equal(detectPostgresContainer(runImpl), 'cryptosparrow-postgres-1');
  assert.equal(dockerExecSh('db', 'echo ok', runImpl), 'other\ncryptosparrow-postgres-1\nplain-postgres');
  assert.deepEqual(runCalls.at(-1), ['docker', ['exec', 'db', 'sh', '-lc', 'echo ok']]);
  assert.equal(normalizeIdSuffix('2026-06-11T03:04:05.000Z'), '20260611t030405000z');
  assert.equal(nowStamp(() => new Date('2026-06-11T03:04:05.000Z')), '2026-06-11T03-04-05-000Z');
});

test('main constructs backup and restore commands without requiring Docker', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'soar-db-restore-test-'));
  try {
    const commands = [];
    const writes = new Map();
    const logs = [];
    const result = await main({
      argv: ['--container', 'db', '--db-user', 'postgres', '--db-name', 'cryptosparrow'],
      cwd: dir,
      consoleImpl: { log: (message) => logs.push(message) },
      mkdirImpl: async () => {},
      writeFileImpl: async (file, content) => writes.set(path.relative(dir, file), content),
      now: () => new Date('2026-06-11T03:04:05.000Z'),
      runImpl: (command, args) => {
        commands.push([command, args]);
        if (args.at(-1).includes('SELECT')) return 'User,1\nBot,2';
        return '';
      },
    });

    assert.equal(result.status, 0);
    assert.equal(commands.length, 6);
    assert.equal(commands[0][1].at(-1), 'pg_dump -U postgres -d cryptosparrow -Fc -f /tmp/cryptosparrow_backup_2026-06-11T03-04-05-000Z.dump');
    assert.match(commands[2][1].at(-1), /pg_restore -U postgres -d cryptosparrow_restore_check_20260611t030405000z/);
    assert.match(result.content, /RESULT: PASS/);
    assert.equal(writes.size, 2);
    assert.match(logs.join('\n'), /DB restore artifact:/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
