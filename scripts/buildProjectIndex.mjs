#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'output',
  'outputs',
  'tmp',
]);

const v1SurfaceMap = {
  Auth: {
    apiModules: ['auth'],
    webFeatures: ['auth'],
    routePrefixes: ['/auth'],
    workerKeywords: [],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 3,
    nextProof: 'Browser login/logout/session-expiry proof plus API auth lifecycle assertions.',
    risk: 'P0 auth/session correctness',
  },
  Profile: {
    apiModules: ['profile'],
    webFeatures: ['profile'],
    routePrefixes: ['/dashboard/profile'],
    workerKeywords: [],
    scriptKeywords: ['ui'],
    auditPriority: 6,
    nextProof: 'Profile form success/error submit proof with API readback.',
    risk: 'P1 user settings and validation',
  },
  'Profile API Keys': {
    apiModules: ['profile', 'exchange', 'logs'],
    webFeatures: ['profile', 'exchanges'],
    routePrefixes: ['/dashboard/profile', '/dashboard/exchanges'],
    workerKeywords: [],
    scriptKeywords: ['exchange', 'ui'],
    auditPriority: 4,
    nextProof: 'Create/test/delete key proof for Binance and Gate.io through adapter-owned probes and audit logs.',
    risk: 'P0 secrets/exchange access',
  },
  'Subscriptions/Admin': {
    apiModules: ['admin', 'subscriptions', 'users'],
    webFeatures: ['admin'],
    routePrefixes: ['/admin'],
    workerKeywords: [],
    scriptKeywords: ['ui'],
    auditPriority: 15,
    nextProof: 'Protected admin clickthrough with non-destructive data and entitlement checks.',
    risk: 'P0 role/entitlement access',
  },
  Wallets: {
    apiModules: ['wallets', 'exchange', 'logs'],
    webFeatures: ['wallets'],
    routePrefixes: ['/dashboard/wallets'],
    workerKeywords: [],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 7,
    nextProof: 'Wallet create/edit/delete/reset/preview proof with DB or API readback and active-bot guards.',
    risk: 'P1 capital source of truth',
  },
  Markets: {
    apiModules: ['markets', 'market-data', 'market-stream', 'exchange'],
    webFeatures: ['markets'],
    routePrefixes: ['/dashboard/markets'],
    workerKeywords: ['marketData', 'marketStream'],
    scriptKeywords: ['exchange', 'ui'],
    auditPriority: 8,
    nextProof: 'Market universe CRUD/import/capability proof, including active-bot guard behavior.',
    risk: 'P1 runtime symbol scope',
  },
  Strategies: {
    apiModules: ['strategies', 'backtests', 'engine'],
    webFeatures: ['strategies'],
    routePrefixes: ['/dashboard/strategies'],
    workerKeywords: ['backtest', 'execution'],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 9,
    nextProof: 'Strategy create/edit/delete/clone/config proof preserving RSI 20/80 and proving runtime/backtest compatibility.',
    risk: 'P1 trading decision config',
  },
  Bots: {
    apiModules: ['bots', 'engine', 'wallets', 'markets', 'strategies'],
    webFeatures: ['bots'],
    routePrefixes: ['/dashboard/bots'],
    workerKeywords: ['execution'],
    scriptKeywords: ['bot', 'go-live', 'ui'],
    auditPriority: 5,
    nextProof: 'Production-safe non-destructive clickthrough for bot actions; local action proof already exists.',
    risk: 'P0 bot lifecycle',
  },
  'Bot Runtime': {
    apiModules: ['bots', 'engine', 'orders', 'positions', 'market-stream'],
    webFeatures: ['bots', 'dashboard-home'],
    exactRoutes: ['/dashboard/bots/runtime', '/dashboard/bots/[id]/runtime'],
    routePrefixes: [],
    workerKeywords: ['execution', 'marketStream'],
    scriptKeywords: ['liveimport', 'live', 'go-live'],
    auditPriority: 2,
    nextProof: 'Representative PAPER running/stopped runtime session proof with worker telemetry and runtime readback.',
    risk: 'P0 runtime truth',
  },
  'Dashboard Home': {
    apiModules: ['bots', 'orders', 'positions', 'wallets', 'reports'],
    webFeatures: ['dashboard-home'],
    exactRoutes: ['/dashboard'],
    routePrefixes: [],
    workerKeywords: ['execution', 'marketData', 'marketStream'],
    scriptKeywords: ['ui', 'go-live'],
    auditPriority: 1,
    nextProof: 'Rendered/browser proof for selected bot, wallet KPIs, tables, loading/empty/error, responsive states, and safe clickthrough.',
    risk: 'P0 operator truth surface',
  },
  'Manual Orders': {
    apiModules: ['orders', 'bots', 'wallets', 'exchange', 'positions'],
    webFeatures: ['orders', 'dashboard-home'],
    exactRoutes: ['/dashboard'],
    routePrefixes: ['/dashboard/orders'],
    workerKeywords: ['execution'],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 10,
    nextProof: 'PAPER manual order place/cancel/close proof with validation and DB readback; LIVE remains blocked-risk.',
    risk: 'P0 money-impacting order flow',
  },
  Positions: {
    apiModules: ['positions', 'bots', 'orders', 'exchange'],
    webFeatures: ['positions', 'dashboard-home'],
    exactRoutes: ['/dashboard'],
    routePrefixes: ['/dashboard/positions'],
    workerKeywords: ['execution'],
    scriptKeywords: ['liveimport', 'go-live', 'ui'],
    auditPriority: 11,
    nextProof: 'List/close/update/takeover/import-status proof with exchange snapshot boundary and fail-closed live mutation plan.',
    risk: 'P0 position ownership/runtime truth',
  },
  Orders: {
    apiModules: ['orders', 'exchange', 'positions', 'bots'],
    webFeatures: ['orders', 'dashboard-home'],
    exactRoutes: ['/dashboard'],
    routePrefixes: ['/dashboard/orders'],
    workerKeywords: ['execution'],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 12,
    nextProof: 'Order list/cancel/fill/fee proof through API and adapter boundary, separating PAPER from exchange-backed risk.',
    risk: 'P0 order lifecycle',
  },
  Backtests: {
    apiModules: ['backtests', 'strategies', 'market-data'],
    webFeatures: ['backtest'],
    routePrefixes: ['/dashboard/backtests', '/dashboard/backtest'],
    workerKeywords: ['backtest'],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 13,
    nextProof: 'Create/cancel/delete/details/report proof using representative RSI strategy and market data.',
    risk: 'P1 simulation correctness',
  },
  Reports: {
    apiModules: ['reports', 'backtests', 'bots', 'wallets'],
    webFeatures: ['reports'],
    routePrefixes: ['/dashboard/reports'],
    workerKeywords: [],
    scriptKeywords: ['ui'],
    auditPriority: 14,
    nextProof: 'Filters/summaries/export proof with API data readback.',
    risk: 'P2 operator reporting',
  },
  'Logs/Audit Trail': {
    apiModules: ['logs'],
    webFeatures: ['logs'],
    routePrefixes: ['/dashboard/logs'],
    workerKeywords: [],
    scriptKeywords: ['ui'],
    auditPriority: 16,
    nextProof: 'Filters/pagination/action-log visibility proof using events produced by the audit.',
    risk: 'P1 auditability',
  },
  'Exchange Adapter': {
    apiModules: ['exchange', 'profile', 'orders', 'positions', 'wallets', 'market-stream'],
    webFeatures: ['exchanges', 'profile', 'dashboard-home'],
    exactRoutes: ['/dashboard'],
    routePrefixes: ['/dashboard/exchanges', '/dashboard/profile'],
    workerKeywords: ['marketStream', 'execution'],
    scriptKeywords: ['exchange', 'liveimport', 'live'],
    auditPriority: 17,
    nextProof: 'Operation-by-operation Binance/Gate.io support matrix with pass/fail-closed proofs.',
    risk: 'P0 external exchange boundary',
  },
  Workers: {
    apiModules: ['engine', 'market-stream', 'backtests', 'bots'],
    webFeatures: ['dashboard-home', 'bots'],
    exactRoutes: ['/dashboard', '/dashboard/bots/runtime', '/dashboard/bots/[id]/runtime'],
    routePrefixes: [],
    workerKeywords: ['backtest', 'execution', 'marketData', 'marketStream'],
    scriptKeywords: ['deploy', 'go-live', 'live'],
    auditPriority: 18,
    nextProof: 'Runtime loop, stream, backtest worker, and scheduler lifecycle proof beyond public /ready.',
    risk: 'P0 async runtime reliability',
  },
  Operations: {
    apiModules: ['engine', 'bots'],
    webFeatures: ['admin'],
    routePrefixes: ['/admin'],
    workerKeywords: ['execution', 'marketData', 'marketStream', 'backtest'],
    scriptKeywords: ['deploy', 'release', 'rollback', 'slo', 'rc', 'db'],
    auditPriority: 19,
    nextProof: 'Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence.',
    risk: 'P0 release safety',
  },
  'Security/Privacy': {
    apiModules: ['auth', 'isolation', 'profile', 'admin', 'subscriptions'],
    webFeatures: ['auth', 'admin', 'profile'],
    routePrefixes: ['/auth', '/admin', '/dashboard/profile'],
    workerKeywords: [],
    scriptKeywords: ['go-live', 'ui'],
    auditPriority: 20,
    nextProof: 'Ownership isolation, rate-limit, secret redaction, fail-closed, and abuse-case proof.',
    risk: 'P0 auth/secrets/data isolation',
  },
  'UX/A11y/Mobile': {
    apiModules: [],
    webFeatures: ['dashboard-home', 'bots', 'wallets', 'markets', 'strategies', 'backtest', 'profile'],
    routePrefixes: ['/dashboard', '/dashboard/bots', '/dashboard/wallets', '/dashboard/markets', '/dashboard/strategies'],
    workerKeywords: [],
    scriptKeywords: ['ui', 'i18n'],
    auditPriority: 21,
    nextProof: 'Per-screen loading/empty/error/success, keyboard/touch, responsive, and accessibility evidence.',
    risk: 'P1 product usability',
  },
};

const toPosixPath = (value) => value.split(path.sep).join('/');

const relativePath = (targetPath) => toPosixPath(path.relative(repoRoot, targetPath));

const fileExists = async (targetPath) => {
  try {
    const entry = await stat(targetPath);
    return entry.isFile();
  } catch {
    return false;
  }
};

const directoryExists = async (targetPath) => {
  try {
    const entry = await stat(targetPath);
    return entry.isDirectory();
  } catch {
    return false;
  }
};

const listDirectories = async (targetPath) => {
  if (!(await directoryExists(targetPath))) {
    return [];
  }

  const entries = await readdir(targetPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
};

const walkFiles = async (targetPath, predicate = () => true) => {
  if (!(await directoryExists(targetPath))) {
    return [];
  }

  const files = [];
  const stack = [targetPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && predicate(fullPath, entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files.sort((a, b) => relativePath(a).localeCompare(relativePath(b)));
};

const readTextIfExists = async (targetPath) => {
  if (!(await fileExists(targetPath))) {
    return '';
  }
  return readFile(targetPath, 'utf8');
};

const parseArgs = () => {
  const options = {
    today: new Date().toISOString().slice(0, 10),
    markdownOutput: '',
    jsonOutput: '',
    help: false,
  };

  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--today') {
      options.today = args[index + 1] ?? options.today;
      index += 1;
      continue;
    }
    if (arg === '--markdown-output') {
      options.markdownOutput = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--json-output') {
      options.jsonOutput = args[index + 1] ?? '';
      index += 1;
    }
  }

  options.markdownOutput =
    options.markdownOutput || `docs/operations/project-index-${options.today}.md`;
  options.jsonOutput = options.jsonOutput || `docs/operations/project-index-${options.today}.json`;
  return options;
};

const printHelp = () => {
  console.log(`Usage: node scripts/buildProjectIndex.mjs [options]

Build a local project index for V1 planning and audit continuation.

Options:
  --today <yyyy-mm-dd>          Evidence date. Defaults to current UTC date.
  --markdown-output <path>      Markdown output path.
  --json-output <path>          JSON output path.
  --help, -h                    Show this help.
`);
};

const collectPackageScripts = async () => {
  const packageJsonPath = path.join(repoRoot, 'package.json');
  const packageJson = JSON.parse(await readTextIfExists(packageJsonPath));
  return Object.keys(packageJson.scripts ?? {}).sort((a, b) => a.localeCompare(b));
};

const nextRouteFromPage = (filePath) => {
  const appRoot = path.join(repoRoot, 'apps', 'web', 'src', 'app');
  const directory = path.dirname(filePath);
  const relativeDirectory = toPosixPath(path.relative(appRoot, directory));
  const segments = relativeDirectory
    .split('/')
    .filter(Boolean)
    .filter((segment) => !segment.startsWith('('));

  return `/${segments.join('/')}`.replace(/\/$/, '') || '/';
};

const collectNextRoutes = async () => {
  const appRoot = path.join(repoRoot, 'apps', 'web', 'src', 'app');
  const pages = await walkFiles(appRoot, (_fullPath, name) => name === 'page.tsx');
  return pages.map((filePath) => ({
    route: nextRouteFromPage(filePath),
    file: relativePath(filePath),
  }));
};

const collectApiModuleSummaries = async () => {
  const modulesRoot = path.join(repoRoot, 'apps', 'api', 'src', 'modules');
  const moduleNames = await listDirectories(modulesRoot);
  const summaries = [];

  for (const moduleName of moduleNames) {
    const moduleRoot = path.join(modulesRoot, moduleName);
    const files = await walkFiles(moduleRoot, (_fullPath, name) => /\.(ts|tsx)$/.test(name));
    summaries.push({
      name: moduleName,
      routeFiles: files.filter((filePath) => filePath.endsWith('.routes.ts')).map(relativePath),
      controllerFiles: files
        .filter((filePath) => filePath.endsWith('.controller.ts'))
        .map(relativePath),
      serviceFiles: files
        .filter((filePath) => filePath.includes('.service.') || filePath.endsWith('.service.ts'))
        .map(relativePath),
      testFiles: files.filter((filePath) => /\.test\.ts$|\.e2e\.test\.ts$/.test(filePath)).map(relativePath),
      fileCount: files.length,
    });
  }

  return summaries;
};

const collectWebFeatureSummaries = async () => {
  const featuresRoot = path.join(repoRoot, 'apps', 'web', 'src', 'features');
  const featureNames = await listDirectories(featuresRoot);
  const summaries = [];

  for (const featureName of featureNames) {
    const featureRoot = path.join(featuresRoot, featureName);
    const files = await walkFiles(featureRoot, (_fullPath, name) => /\.(ts|tsx)$/.test(name));
    summaries.push({
      name: featureName,
      componentFiles: files
        .filter((filePath) => /components|view|page|table|form/i.test(filePath))
        .map(relativePath),
      testFiles: files.filter((filePath) => /\.test\.tsx?$/.test(filePath)).map(relativePath),
      fileCount: files.length,
    });
  }

  return summaries;
};

const collectWorkerFiles = async () => {
  const workersRoot = path.join(repoRoot, 'apps', 'api', 'src', 'workers');
  const files = await walkFiles(
    workersRoot,
    (_fullPath, name) => /\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name),
  );
  return files.map(relativePath);
};

const collectTests = async () => {
  const roots = [
    path.join(repoRoot, 'apps'),
    path.join(repoRoot, 'scripts'),
    path.join(repoRoot, 'tests'),
  ];
  const allTests = [];
  for (const root of roots) {
    const tests = await walkFiles(root, (_fullPath, name) => /\.(test|spec)\.(ts|tsx|mjs|js)$/.test(name));
    allTests.push(...tests);
  }

  const byArea = {
    api: allTests.filter((filePath) => relativePath(filePath).startsWith('apps/api/')).length,
    web: allTests.filter((filePath) => relativePath(filePath).startsWith('apps/web/')).length,
    scripts: allTests.filter((filePath) => relativePath(filePath).startsWith('scripts/')).length,
    other: allTests.filter((filePath) => {
      const rel = relativePath(filePath);
      return !rel.startsWith('apps/api/') && !rel.startsWith('apps/web/') && !rel.startsWith('scripts/');
    }).length,
  };

  return {
    total: allTests.length,
    byArea,
    files: allTests.map(relativePath),
  };
};

const collectV1Matrix = async () => {
  const matrixPath = path.join(repoRoot, 'docs', 'operations', 'v1-product-action-audit-matrix-2026-05-10.md');
  const text = await readTextIfExists(matrixPath);
  const rows = [];
  let insideModuleMatrix = false;

  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('## ')) {
      insideModuleMatrix = line.trim() === '## Module Action Matrix';
      continue;
    }
    if (!insideModuleMatrix) {
      continue;
    }
    if (!line.startsWith('| ') || line.includes('---') || line.includes('Module |')) {
      continue;
    }

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 5) {
      continue;
    }

    const [module, actions, requiredProof, status, notes] = cells;
    rows.push({
      module,
      actions,
      requiredProof,
      status: status.replace(/`/g, ''),
      notes,
    });
  }

  const counts = rows.reduce((accumulator, row) => {
    accumulator[row.status] = (accumulator[row.status] ?? 0) + 1;
    return accumulator;
  }, {});

  return {
    source: relativePath(matrixPath),
    counts,
    rows,
  };
};

const collectUncheckedTasks = async () => {
  const sources = [
    path.join(repoRoot, '.codex', 'context', 'TASK_BOARD.md'),
    path.join(repoRoot, 'docs', 'planning', 'mvp-next-commits.md'),
    path.join(repoRoot, '.agents', 'state', 'next-steps.md'),
  ];
  const tasks = [];

  for (const sourcePath of sources) {
    const text = await readTextIfExists(sourcePath);
    for (const [lineIndex, line] of text.split(/\r?\n/).entries()) {
      if (!line.includes('[ ]')) {
        continue;
      }
      tasks.push({
        source: relativePath(sourcePath),
        line: lineIndex + 1,
        text: line.trim(),
      });
    }
  }

  return tasks;
};

const collectArchitectureSources = async () => {
  const architectureRoot = path.join(repoRoot, 'docs', 'architecture');
  const moduleDocsRoot = path.join(repoRoot, 'docs', 'modules');
  const architectureDocs = await walkFiles(architectureRoot, (_fullPath, name) => name.endsWith('.md'));
  const moduleDocs = await walkFiles(moduleDocsRoot, (_fullPath, name) => name.endsWith('.md'));
  return [...architectureDocs, ...moduleDocs].map(relativePath);
};

const uniqueSorted = (values) =>
  [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

const containsAnyToken = (value, tokens) => {
  const normalized = value.toLowerCase();
  return tokens.some((token) => normalized.includes(token.toLowerCase()));
};

const buildV1WorkMap = ({ v1Matrix, apiModules, webFeatures, nextRoutes, workerFiles, tests, packageScripts }) => {
  const apiModuleByName = new Map(apiModules.map((module) => [module.name, module]));
  const webFeatureByName = new Map(webFeatures.map((feature) => [feature.name, feature]));

  return v1Matrix.rows
    .map((row) => {
      const mapping = v1SurfaceMap[row.module] ?? {
        apiModules: [],
        webFeatures: [],
        routePrefixes: [],
        workerKeywords: [],
        scriptKeywords: [],
        auditPriority: 99,
        nextProof: 'Define exact proof before implementation.',
        risk: 'unclassified',
      };

      const api = mapping.apiModules
        .map((name) => apiModuleByName.get(name))
        .filter(Boolean)
        .map((module) => ({
          name: module.name,
          routeFiles: module.routeFiles,
          controllerFiles: module.controllerFiles,
          serviceFiles: module.serviceFiles.slice(0, 12),
          testFiles: module.testFiles,
          testFileCount: module.testFiles.length,
        }));

      const web = mapping.webFeatures
        .map((name) => webFeatureByName.get(name))
        .filter(Boolean)
        .map((feature) => ({
          name: feature.name,
          componentFiles: feature.componentFiles.slice(0, 16),
          testFiles: feature.testFiles,
          testFileCount: feature.testFiles.length,
        }));

      const routes = nextRoutes.filter((route) =>
        (mapping.exactRoutes ?? []).includes(route.route) ||
        mapping.routePrefixes.some(
          (prefix) => route.route === prefix || route.route.startsWith(`${prefix}/`),
        ),
      );

      const testTokens = uniqueSorted([
        row.module,
        ...mapping.apiModules,
        ...mapping.webFeatures,
        ...mapping.routePrefixes.map((route) => route.split('/').filter(Boolean).at(-1) ?? ''),
      ]).filter((token) => token.length > 2);

      const candidateTests = tests.files
        .filter((file) => containsAnyToken(file, testTokens))
        .slice(0, 30);

      const candidateScripts = packageScripts.filter((script) =>
        containsAnyToken(script, mapping.scriptKeywords),
      );

      const candidateWorkers = workerFiles.filter((file) =>
        containsAnyToken(file, mapping.workerKeywords),
      );

      return {
        module: row.module,
        status: row.status,
        auditPriority: mapping.auditPriority,
        risk: mapping.risk,
        actionFamily: row.actions,
        requiredProof: row.requiredProof,
        nextProof: mapping.nextProof,
        notes: row.notes,
        api,
        web,
        routes,
        candidateWorkers,
        candidateScripts,
        candidateTests,
        counts: {
          apiModules: api.length,
          webFeatures: web.length,
          routes: routes.length,
          candidateWorkers: candidateWorkers.length,
          candidateScripts: candidateScripts.length,
          candidateTests: candidateTests.length,
        },
      };
    })
    .sort((left, right) => left.auditPriority - right.auditPriority || left.module.localeCompare(right.module));
};

const buildIndex = async (options) => {
  const [
    packageScripts,
    apiModules,
    webFeatures,
    nextRoutes,
    workerFiles,
    tests,
    v1Matrix,
    uncheckedTasks,
    architectureSources,
  ] = await Promise.all([
    collectPackageScripts(),
    collectApiModuleSummaries(),
    collectWebFeatureSummaries(),
    collectNextRoutes(),
    collectWorkerFiles(),
    collectTests(),
    collectV1Matrix(),
    collectUncheckedTasks(),
    collectArchitectureSources(),
  ]);

  const baseIndex = {
    generatedAt: new Date().toISOString(),
    evidenceDate: options.today,
    repoRoot: toPosixPath(repoRoot),
    sources: {
      architectureSources,
      v1Matrix: v1Matrix.source,
      taskSources: [
        '.codex/context/TASK_BOARD.md',
        'docs/planning/mvp-next-commits.md',
        '.agents/state/next-steps.md',
      ],
    },
    packageScripts,
    apiModules,
    webFeatures,
    nextRoutes,
    workerFiles,
    tests,
    v1Matrix,
    uncheckedTasks,
  };

  return {
    ...baseIndex,
    v1WorkMap: buildV1WorkMap(baseIndex),
  };
};

const renderList = (values, mapper = (value) => value) => {
  if (values.length === 0) {
    return '- none';
  }
  return values.map((value) => `- ${mapper(value)}`).join('\n');
};

const renderMarkdown = (index) => {
  const matrixCounts = Object.entries(index.v1Matrix.counts)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([status, count]) => `- ${status}: ${count}`)
    .join('\n');

  const apiTable = index.apiModules
    .map(
      (module) =>
        `| ${module.name} | ${module.routeFiles.length} | ${module.controllerFiles.length} | ${module.serviceFiles.length} | ${module.testFiles.length} | ${module.fileCount} |`,
    )
    .join('\n');

  const webTable = index.webFeatures
    .map(
      (feature) =>
        `| ${feature.name} | ${feature.componentFiles.length} | ${feature.testFiles.length} | ${feature.fileCount} |`,
    )
    .join('\n');

  const workMapTable = index.v1WorkMap
    .map(
      (item) =>
        `| ${item.auditPriority} | ${item.module} | ${item.status} | ${item.risk} | ${item.counts.apiModules} | ${item.counts.webFeatures} | ${item.counts.routes} | ${item.counts.candidateTests} | ${item.nextProof} |`,
    )
    .join('\n');

  const workMapDetails = index.v1WorkMap
    .map((item) => {
      const apiNames = item.api.map((api) => api.name).join(', ') || 'none';
      const webNames = item.web.map((web) => web.name).join(', ') || 'none';
      const routeNames = item.routes.map((route) => route.route).join(', ') || 'none';
      const testNames = item.candidateTests.slice(0, 12).map((file) => `\`${file}\``).join(', ') || 'none';
      const scriptNames = item.candidateScripts.map((script) => `\`${script}\``).join(', ') || 'none';
      const workerNames = item.candidateWorkers.map((file) => `\`${file}\``).join(', ') || 'none';

      return `### ${item.auditPriority}. ${item.module} (${item.status})

- Risk: ${item.risk}
- Action family: ${item.actionFamily}
- Required proof: ${item.requiredProof}
- Next proof: ${item.nextProof}
- API modules: ${apiNames}
- Web features: ${webNames}
- Routes: ${routeNames}
- Candidate scripts: ${scriptNames}
- Candidate workers: ${workerNames}
- Candidate tests: ${testNames}
- Notes: ${item.notes}
`;
    })
    .join('\n');

  const routeList = renderList(index.nextRoutes, (route) => `${route.route} (${route.file})`);
  const taskList = renderList(
    index.uncheckedTasks.slice(0, 40),
    (task) => `${task.source}:${task.line} ${task.text}`,
  );

  return `# Project Index

Generated at: ${index.generatedAt}
Evidence date: ${index.evidenceDate}

## Purpose

This index is a local, no-network map of the current Soar repository. It is not
V1 approval evidence. Use it as the starting point for module-by-module audits
and fixes.

## V1 Product Action Matrix

Source: \`${index.v1Matrix.source}\`

${matrixCounts || '- none'}

## V1 Audit Work Map

This table is the working map for finishing V1. It connects each matrix row to
the likely code and validation surfaces. The priority is audit order, not
business value.

| Priority | V1 row | Status | Risk | API | Web | Routes | Candidate tests | Next proof |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
${workMapTable}

## V1 Audit Work Details

${workMapDetails}

## API Modules

| Module | Route files | Controller files | Service files | Test files | TS files |
| --- | ---: | ---: | ---: | ---: | ---: |
${apiTable}

## Web Features

| Feature | Component-like files | Test files | TS/TSX files |
| --- | ---: | ---: | ---: |
${webTable}

## Web Routes

${routeList}

## Workers

${renderList(index.workerFiles, (file) => `\`${file}\``)}

## Test Inventory

- Total test/spec files: ${index.tests.total}
- API tests: ${index.tests.byArea.api}
- Web tests: ${index.tests.byArea.web}
- Script tests: ${index.tests.byArea.scripts}
- Other tests: ${index.tests.byArea.other}

## Package Scripts

${renderList(index.packageScripts, (script) => `\`${script}\``)}

## Open Queue Markers

Showing up to 40 unchecked markers from the canonical queue sources.

${taskList}

## Architecture And Module Sources

${renderList(index.sources.architectureSources, (file) => `\`${file}\``)}

## Use In Next Work

1. Pick one V1 matrix row that is not \`PASS\`.
2. Use this index to find the matching API module, Web feature, route, tests,
   and worker surface.
3. Add focused evidence before calling the row complete.
4. Update the V1 matrix and task/context state after the slice.
`;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const index = await buildIndex(options);
  const markdownPath = path.resolve(repoRoot, options.markdownOutput);
  const jsonPath = path.resolve(repoRoot, options.jsonOutput);

  await writeFile(markdownPath, renderMarkdown(index), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  console.log(`Project index written to ${relativePath(markdownPath)}`);
  console.log(`Project index JSON written to ${relativePath(jsonPath)}`);
  console.log(`V1 statuses: ${JSON.stringify(index.v1Matrix.counts)}`);
  console.log(`Tests indexed: ${index.tests.total}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
