import assert from 'node:assert/strict';
import test from 'node:test';

import {
  main,
  nowStamp,
  parseArgs,
  renderMarkdown,
  runStep,
} from './runCutoverDryRun.mjs';

const fixedStep = (label, exitCode = 0) => ({
  label,
  command: `pnpm test:${label}`,
  startedAt: '2026-06-07T19:00:00.000Z',
  endedAt: '2026-06-07T19:00:01.000Z',
  durationMs: 1000,
  exitCode,
});

test('parseArgs recognizes cutover dry-run safety flags and help', () => {
  assert.deepEqual(parseArgs(['--skip-infra', '--skip-client']), {
    skipInfra: true,
    skipClient: true,
  });
  assert.deepEqual(parseArgs(['--help']), {
    skipInfra: false,
    skipClient: false,
    help: true,
  });
});

test('nowStamp renders filesystem-safe ISO timestamps', () => {
  assert.equal(
    nowStamp(new Date('2026-06-07T19:01:02.345Z')),
    '2026-06-07T19-01-02-345Z',
  );
});

test('runStep uses an injected spawn runner and preserves Windows shell behavior', () => {
  const calls = [];
  const times = [10, 35];
  const stamps = [
    new Date('2026-06-07T19:00:00.000Z'),
    new Date('2026-06-07T19:00:00.025Z'),
  ];

  const result = runStep('pnpm', ['--filter', 'api', 'test'], 'api-suite', {
    platform: 'win32',
    nowMs: () => times.shift(),
    clock: () => stamps.shift(),
    spawnSync: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 7 };
    },
  });

  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['--filter', 'api', 'test'],
      options: {
        stdio: 'inherit',
        shell: true,
      },
    },
  ]);
  assert.deepEqual(result, {
    label: 'api-suite',
    command: 'pnpm --filter api test',
    startedAt: '2026-06-07T19:00:00.000Z',
    endedAt: '2026-06-07T19:00:00.025Z',
    durationMs: 25,
    exitCode: 7,
  });
});

test('renderMarkdown summarizes step outcomes and skip options', () => {
  const markdown = renderMarkdown(
    {
      generatedAt: '2026-06-07T19:00:00.000Z',
      status: 'FAILED',
      options: { skipInfra: true, skipClient: false },
      steps: [fixedStep('api-cutover-suite', 1), fixedStep('infra-down', 0)],
    },
    'history/operations/cutover.json',
  );

  assert.match(markdown, /# V1 Local Cutover Dry-Run Report \(2026-06-07\)/);
  assert.match(markdown, /\| api-cutover-suite \| `pnpm test:api-cutover-suite` \| 1 \|/);
  assert.match(markdown, /Failed steps: 1/);
  assert.match(markdown, /Skip infra: yes/);
  assert.match(markdown, /Skip client: no/);
});

test('main orchestrates the local cutover dry-run through injected steps and writes artifacts', async () => {
  const calls = [];
  const writes = [];
  const logs = [];
  const exits = [];

  const report = await main({
    argv: ['--skip-infra'],
    now: () => new Date('2026-06-07T19:02:03.004Z'),
    operationsDir: 'history/operations-test',
    console: { log: (message) => logs.push(message) },
    process: { exit: (code) => exits.push(code) },
    mkdir: async (dir, options) => {
      calls.push({ type: 'mkdir', dir, options });
    },
    writeFile: async (file, body) => {
      writes.push({ file, body });
    },
    runStep: (command, args, label) => {
      calls.push({ type: 'runStep', command, args, label });
      return fixedStep(label, 0);
    },
  });

  assert.deepEqual(
    calls.filter((call) => call.type === 'runStep').map((call) => call.label),
    [
      'api-prisma-generate',
      'api-migrate-deploy',
      'api-cutover-suite',
      'web-cutover-suite',
    ],
  );
  assert.equal(calls.some((call) => call.label === 'infra-up'), false);
  assert.equal(calls.some((call) => call.label === 'infra-down'), false);
  assert.equal(report.status, 'PASS');
  assert.equal(report.options.skipInfra, true);
  assert.equal(writes.length, 2);
  assert.match(writes[0].file, /_artifacts-cutover-dry-run-2026-06-07T19-02-03-004Z\.json$/);
  assert.match(writes[1].file, /v1-local-cutover-dry-run-2026-06-07T19-02-03-004Z\.md$/);
  assert.deepEqual(exits, [0]);
  assert.equal(logs.length, 2);
});

test('main classifies failures and still runs infra teardown after successful startup', async () => {
  const labels = [];
  const exits = [];
  const exitCodes = {
    'infra-up': 0,
    'api-prisma-generate': 1,
    'infra-down': 0,
  };

  const report = await main({
    argv: [],
    now: () => new Date('2026-06-07T19:03:00.000Z'),
    operationsDir: 'history/operations-test',
    console: { log: () => {} },
    process: { exit: (code) => exits.push(code) },
    mkdir: async () => {},
    writeFile: async () => {},
    runStep: (_command, _args, label) => {
      labels.push(label);
      return fixedStep(label, exitCodes[label] ?? 0);
    },
  });

  assert.deepEqual(labels, ['infra-up', 'api-prisma-generate', 'infra-down']);
  assert.equal(report.status, 'FAILED');
  assert.deepEqual(exits, [1]);
});

test('main help returns without running or writing artifacts', async () => {
  const logs = [];
  const exits = [];

  const result = await main({
    argv: ['--help'],
    console: { log: (message) => logs.push(message) },
    process: { exit: (code) => exits.push(code) },
    runStep: () => {
      throw new Error('runStep should not run for help');
    },
    mkdir: async () => {
      throw new Error('mkdir should not run for help');
    },
    writeFile: async () => {
      throw new Error('writeFile should not run for help');
    },
  });

  assert.deepEqual(result, { help: true });
  assert.deepEqual(exits, [0]);
  assert.match(logs.join('\n'), /Usage: node scripts\/runCutoverDryRun\.mjs/);
});
