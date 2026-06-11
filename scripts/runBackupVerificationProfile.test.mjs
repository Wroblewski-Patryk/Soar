import test from 'node:test';
import assert from 'node:assert/strict';

import {
  firstNonEmptyEnv,
  main,
  parseArgs,
  resolveOptions,
  run,
} from './runBackupVerificationProfile.mjs';

const logger = () => {
  const messages = [];
  return {
    messages,
    log: (message) => messages.push(message),
  };
};

test('firstNonEmptyEnv returns the first trimmed non-empty configured value', () => {
  assert.equal(
    firstNonEmptyEnv(['PRIMARY_CONTAINER', 'FALLBACK_CONTAINER'], {
      PRIMARY_CONTAINER: '   ',
      FALLBACK_CONTAINER: 'soar-postgres',
    }),
    'soar-postgres',
  );
  assert.equal(firstNonEmptyEnv(['MISSING', 'EMPTY'], { EMPTY: '' }), '');
});

test('resolveOptions uses profile env fallbacks without reading real process env', () => {
  assert.deepEqual(
    resolveOptions(
      {
        profile: 'prod',
        container: '',
        dbUser: '',
        dbName: '',
      },
      {
        PRODUCTION_DB_CHECK_CONTAINER: 'prod-postgres',
        PROD_DB_CHECK_USER: 'soar_user',
        PROD_DB_CHECK_NAME: 'soar_db',
      },
    ),
    {
      profile: 'prod',
      container: 'prod-postgres',
      dbUser: 'soar_user',
      dbName: 'soar_db',
    },
  );
});

test('resolveOptions fails closed for non-local profiles without a container', () => {
  assert.throws(
    () =>
      resolveOptions(
        {
          profile: 'stage',
          container: '',
          dbUser: '',
          dbName: '',
        },
        {},
      ),
    /Missing container for profile "stage"/,
  );
});

test('parseArgs keeps explicit CLI options ahead of environment defaults', () => {
  assert.deepEqual(
    parseArgs([
      '--profile',
      'PROD',
      '--container',
      'cli-postgres',
      '--db-user',
      'cli-user',
      '--db-name',
      'cli-db',
    ]),
    {
      profile: 'prod',
      container: 'cli-postgres',
      dbUser: 'cli-user',
      dbName: 'cli-db',
    },
  );
});

test('main executes backup restore verifier through injected runner only', () => {
  const output = logger();
  const calls = [];

  main({
    argv: ['--profile', 'prod'],
    env: {
      PROD_DB_CHECK_CONTAINER: 'prod-postgres',
      PROD_DB_CHECK_USER: 'soar_user',
      PROD_DB_CHECK_NAME: 'soar_db',
    },
    console: output,
    run: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0 };
    },
  });

  assert.deepEqual(calls, [
    {
      command: 'node',
      args: [
        'scripts/verifyLocalBackupRestore.mjs',
        '--container',
        'prod-postgres',
        '--db-user',
        'soar_user',
        '--db-name',
        'soar_db',
      ],
      options: {
        env: {
          PROD_DB_CHECK_CONTAINER: 'prod-postgres',
          PROD_DB_CHECK_USER: 'soar_user',
          PROD_DB_CHECK_NAME: 'soar_db',
        },
      },
    },
  ]);
  assert.deepEqual(output.messages, [
    '[ops:db:backup-verify] profile=prod container=prod-postgres db=soar_db user=soar_user',
    '[ops:db:backup-verify] profile=prod PASS',
  ]);
});

test('run passes injected env and Windows shell behavior to spawnSync', () => {
  const calls = [];
  const result = run('node', ['scripts/verifyLocalBackupRestore.mjs'], {
    env: { NODE_ENV: 'test' },
    platform: 'win32',
    spawnSync: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0 };
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls, [
    {
      command: 'node',
      args: ['scripts/verifyLocalBackupRestore.mjs'],
      options: {
        stdio: 'inherit',
        shell: true,
        env: { NODE_ENV: 'test' },
      },
    },
  ]);
});
