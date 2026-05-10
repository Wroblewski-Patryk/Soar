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

  return {
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
