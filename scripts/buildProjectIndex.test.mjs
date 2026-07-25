import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

import {
  buildV1WorkMap,
  containsAnyToken,
  directoryExists,
  fileExists,
  listDirectories,
  nextRouteFromPage,
  parseArgs,
  printHelp,
  readTextIfExists,
  relativePath,
  renderList,
  renderMarkdown,
  toPosixPath,
  uniqueSorted,
  walkFiles,
} from './buildProjectIndex.mjs';

const execFileAsync = promisify(execFile);

test('parseArgs applies dated default output paths and explicit overrides', () => {
  const originalArgv = process.argv;
  try {
    process.argv = ['node', 'scripts/buildProjectIndex.mjs', '--today', '2026-06-07'];
    assert.deepEqual(parseArgs(), {
      today: '2026-06-07',
      markdownOutput: 'history/audits/project-index-2026-06-07.md',
      jsonOutput: 'history/audits/project-index-2026-06-07.json',
      help: false,
    });

    process.argv = [
      'node',
      'scripts/buildProjectIndex.mjs',
      '--today',
      '2026-06-08',
      '--markdown-output',
      'tmp/index.md',
      '--json-output',
      'tmp/index.json',
      '--help',
    ];
    assert.deepEqual(parseArgs(), {
      today: '2026-06-08',
      markdownOutput: 'tmp/index.md',
      jsonOutput: 'tmp/index.json',
      help: true,
    });
  } finally {
    process.argv = originalArgv;
  }
});

test('printHelp describes the project index CLI options', () => {
  const originalLog = console.log;
  let output = '';
  try {
    console.log = (value) => {
      output += String(value);
    };
    printHelp();
  } finally {
    console.log = originalLog;
  }

  assert.match(output, /Usage: node scripts\/buildProjectIndex\.mjs/);
  assert.match(output, /--today <yyyy-mm-dd>/);
  assert.match(output, /--markdown-output <path>/);
  assert.match(output, /--json-output <path>/);
});

test('nextRouteFromPage converts app router pages into public routes', () => {
  const routeGroupPage = path.join(
    process.cwd(),
    'apps',
    'web',
    'src',
    'app',
    '(dashboard)',
    'dashboard',
    'bots',
    '[id]',
    'page.tsx',
  );
  const rootPage = path.join(process.cwd(), 'apps', 'web', 'src', 'app', 'page.tsx');

  assert.equal(nextRouteFromPage(routeGroupPage), '/dashboard/bots/[id]');
  assert.equal(nextRouteFromPage(rootPage), '/');
});

test('filesystem helpers ignore generated folders and normalize repository paths', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'build-project-index-'));
  try {
    await mkdir(path.join(fixtureRoot, 'alpha'));
    await mkdir(path.join(fixtureRoot, '.tmp'));
    await mkdir(path.join(fixtureRoot, 'node_modules'));
    await writeFile(path.join(fixtureRoot, 'alpha', 'keep.test.mjs'), 'test fixture', 'utf8');
    await writeFile(path.join(fixtureRoot, '.tmp', 'skip.test.mjs'), 'ignored tmp artifact', 'utf8');
    await writeFile(path.join(fixtureRoot, 'node_modules', 'skip.test.mjs'), 'ignored', 'utf8');

    assert.equal(await directoryExists(path.join(fixtureRoot, 'alpha')), true);
    assert.equal(await directoryExists(path.join(fixtureRoot, 'missing')), false);
    assert.equal(await fileExists(path.join(fixtureRoot, 'alpha', 'keep.test.mjs')), true);
    assert.equal(await fileExists(path.join(fixtureRoot, 'alpha')), false);
    assert.deepEqual(await listDirectories(fixtureRoot), ['.tmp', 'alpha', 'node_modules']);
    assert.equal(await readTextIfExists(path.join(fixtureRoot, 'missing.txt')), '');

    const walked = await walkFiles(fixtureRoot, (_fullPath, name) => name.endsWith('.mjs'));
    assert.deepEqual(walked.map((file) => path.basename(file)), ['keep.test.mjs']);
    assert.equal(toPosixPath(path.join('apps', 'api', 'src')), 'apps/api/src');
    assert.equal(relativePath(path.join(process.cwd(), 'scripts', 'buildProjectIndex.mjs')), 'scripts/buildProjectIndex.mjs');
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('token and rendering helpers produce stable deterministic output', () => {
  assert.deepEqual(uniqueSorted(['Bots', '', 'auth', 'Bots']), ['auth', 'Bots']);
  assert.equal(containsAnyToken('apps/api/src/modules/auth/auth.routes.ts', ['AUTH']), true);
  assert.equal(containsAnyToken('apps/api/src/modules/auth/auth.routes.ts', ['wallets']), false);
  assert.equal(renderList([], (value) => value), '- none');
  assert.equal(renderList(['b', 'a'], (value) => `item:${value}`), '- item:b\n- item:a');
});

test('buildV1WorkMap links V1 rows to API, Web, routes, workers, scripts, and tests', () => {
  const workMap = buildV1WorkMap({
    v1Matrix: {
      rows: [
        {
          module: 'Bot Runtime',
          actions: 'Runtime inspection',
          requiredProof: 'local proof',
          status: 'PASS',
          notes: 'covered',
        },
        {
          module: 'Unmapped Future Surface',
          actions: 'Define',
          requiredProof: 'unknown',
          status: 'TODO',
          notes: 'needs owner',
        },
      ],
    },
    apiModules: [
      {
        name: 'bots',
        routeFiles: ['apps/api/src/modules/bots/bots.routes.ts'],
        controllerFiles: ['apps/api/src/modules/bots/bots.controller.ts'],
        serviceFiles: ['apps/api/src/modules/bots/bots.service.ts'],
        testFiles: ['apps/api/src/modules/bots/bots.e2e.test.ts'],
      },
      {
        name: 'engine',
        routeFiles: [],
        controllerFiles: [],
        serviceFiles: ['apps/api/src/modules/engine/runtime.service.ts'],
        testFiles: ['apps/api/src/modules/engine/runtime.test.ts'],
      },
    ],
    webFeatures: [
      {
        name: 'bots',
        componentFiles: ['apps/web/src/features/bots/BotRuntimeView.tsx'],
        testFiles: ['apps/web/src/features/bots/BotRuntimeView.test.tsx'],
      },
    ],
    nextRoutes: [
      { route: '/dashboard/bots/runtime', file: 'apps/web/src/app/dashboard/bots/runtime/page.tsx' },
      { route: '/dashboard/wallets', file: 'apps/web/src/app/dashboard/wallets/page.tsx' },
    ],
    workerFiles: ['apps/api/src/workers/execution.worker.ts'],
    tests: {
      files: [
        'apps/api/src/modules/bots/bots.e2e.test.ts',
        'apps/web/src/features/bots/BotRuntimeView.test.tsx',
        'apps/web/src/features/wallets/WalletsView.test.tsx',
      ],
    },
    packageScripts: ['test:go-live:api', 'bots:runtime:smoke', 'lint'],
  });

  assert.equal(workMap[0].module, 'Bot Runtime');
  assert.equal(workMap[0].counts.apiModules, 2);
  assert.equal(workMap[0].counts.webFeatures, 1);
  assert.equal(workMap[0].counts.routes, 1);
  assert.deepEqual(workMap[0].candidateWorkers, ['apps/api/src/workers/execution.worker.ts']);
  assert.deepEqual(workMap[0].candidateScripts, ['test:go-live:api']);
  assert.deepEqual(workMap[0].candidateTests, [
    'apps/api/src/modules/bots/bots.e2e.test.ts',
    'apps/web/src/features/bots/BotRuntimeView.test.tsx',
  ]);
  assert.equal(workMap[1].module, 'Unmapped Future Surface');
  assert.equal(workMap[1].risk, 'unclassified');
});

test('renderMarkdown includes matrix, work map, inventory counts, and queue markers', () => {
  const markdown = renderMarkdown({
    generatedAt: '2026-06-07T00:00:00.000Z',
    evidenceDate: '2026-06-07',
    v1Matrix: {
      source: 'history/audits/v1-product-action-audit-matrix-2026-05-10.md',
      counts: { PASS: 1 },
    },
    v1WorkMap: [
      {
        auditPriority: 1,
        module: 'Dashboard Home',
        status: 'PASS',
        risk: 'P0 operator truth surface',
        counts: { apiModules: 1, webFeatures: 1, routes: 1, candidateTests: 1 },
        nextProof: 'Rendered/browser proof.',
        actionFamily: 'inspect',
        requiredProof: 'browser',
        api: [{ name: 'bots' }],
        web: [{ name: 'dashboard-home' }],
        routes: [{ route: '/dashboard' }],
        candidateTests: ['apps/web/src/features/dashboard-home/DashboardHome.test.tsx'],
        candidateScripts: ['test:go-live:web'],
        candidateWorkers: ['apps/api/src/workers/execution.worker.ts'],
        notes: 'ready',
      },
    ],
    apiModules: [
      {
        name: 'bots',
        routeFiles: ['apps/api/src/modules/bots/bots.routes.ts'],
        controllerFiles: [],
        serviceFiles: [],
        testFiles: ['apps/api/src/modules/bots/bots.e2e.test.ts'],
        fileCount: 2,
      },
    ],
    webFeatures: [
      {
        name: 'dashboard-home',
        componentFiles: ['apps/web/src/features/dashboard-home/DashboardHome.tsx'],
        testFiles: ['apps/web/src/features/dashboard-home/DashboardHome.test.tsx'],
        fileCount: 2,
      },
    ],
    nextRoutes: [{ route: '/dashboard', file: 'apps/web/src/app/dashboard/page.tsx' }],
    workerFiles: ['apps/api/src/workers/execution.worker.ts'],
    tests: { total: 2, byArea: { api: 1, web: 1, scripts: 0, other: 0 } },
    packageScripts: ['test:go-live:web'],
    uncheckedTasks: [{ source: '.codex/context/TASK_BOARD.md', line: 10, text: '- [ ] next task' }],
    sources: { architectureSources: ['docs/architecture/01_overview-and-principles.md'] },
  });

  assert.match(markdown, /# Project Index/);
  assert.match(markdown, /- PASS: 1/);
  assert.match(markdown, /\| 1 \| Dashboard Home \| PASS \|/);
  assert.match(markdown, /apps\/web\/src\/features\/dashboard-home\/DashboardHome\.test\.tsx/);
  assert.match(markdown, /\.codex\/context\/TASK_BOARD\.md:10 - \[ \] next task/);
});

test('CLI writes markdown and JSON outputs without running on import', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'build-project-index-cli-'));
  const markdownOutput = path.join(fixtureRoot, 'project-index.md');
  const jsonOutput = path.join(fixtureRoot, 'project-index.json');
  try {
    const { stdout } = await execFileAsync(process.execPath, [
      'scripts/buildProjectIndex.mjs',
      '--today',
      '2026-06-07',
      '--markdown-output',
      markdownOutput,
      '--json-output',
      jsonOutput,
    ]);

    assert.match(stdout, /Project index written to/);
    assert.match(stdout, /Tests indexed: \d+/);
    const markdown = await readFile(markdownOutput, 'utf8');
    const json = JSON.parse(await readFile(jsonOutput, 'utf8'));
    assert.match(markdown, /# Project Index/);
    assert.equal(json.evidenceDate, '2026-06-07');
    assert.equal(Array.isArray(json.v1WorkMap), true);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
