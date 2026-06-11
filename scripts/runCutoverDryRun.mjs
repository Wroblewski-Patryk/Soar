#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const operationsDir = path.resolve(process.cwd(), 'history', 'operations');

export const parseArgs = (args = process.argv.slice(2)) => {
  const options = {
    skipInfra: false,
    skipClient: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--skip-infra') options.skipInfra = true;
    if (arg === '--skip-client') options.skipClient = true;
  }

  return options;
};

export const nowStamp = (now = new Date()) => now.toISOString().replace(/[:.]/g, '-');

export const runStep = (command, args, label, options = {}) => {
  const clock = options.clock ?? (() => new Date());
  const nowMs = options.nowMs ?? (() => Date.now());
  const startedAt = clock().toISOString();
  const startedMs = nowMs();
  const result = (options.spawnSync ?? spawnSync)(command, args, {
    stdio: 'inherit',
    shell: (options.platform ?? process.platform) === 'win32',
  });
  const endedAt = clock().toISOString();
  return {
    label,
    command: `${command} ${args.join(' ')}`,
    startedAt,
    endedAt,
    durationMs: nowMs() - startedMs,
    exitCode: typeof result.status === 'number' ? result.status : 1,
  };
};

export const renderMarkdown = (report, jsonPath) => {
  const rows = report.steps
    .map(
      (step) =>
        `| ${step.label} | \`${step.command}\` | ${step.exitCode} | ${step.durationMs} | ${step.startedAt} | ${step.endedAt} |`
    )
    .join('\n');

  return `# V1 Local Cutover Dry-Run Report (${report.generatedAt.slice(0, 10)})

## Context
- Generated (UTC): ${report.generatedAt}
- Status: ${report.status}
- Raw JSON: \`${jsonPath}\`

## Step Results
| Step | Command | Exit | Duration (ms) | Started (UTC) | Ended (UTC) |
| --- | --- | --- | --- | --- | --- |
${rows}

## Summary
- Steps total: ${report.steps.length}
- Failed steps: ${report.steps.filter((step) => step.exitCode !== 0).length}
- Skip infra: ${report.options.skipInfra ? 'yes' : 'no'}
- Skip client: ${report.options.skipClient ? 'yes' : 'no'}
`;
};

export const main = async (mainOptions = {}) => {
  const options = parseArgs(mainOptions.argv ?? process.argv.slice(2));
  const logger = mainOptions.console ?? console;
  const processImpl = mainOptions.process ?? process;
  const runStepImpl = mainOptions.runStep ?? runStep;
  const mkdirImpl = mainOptions.mkdir ?? mkdir;
  const writeFileImpl = mainOptions.writeFile ?? writeFile;
  const operationsRoot = mainOptions.operationsDir ?? operationsDir;
  const now = mainOptions.now ?? (() => new Date());
  if (options.help) {
    logger.log('Usage: node scripts/runCutoverDryRun.mjs [--skip-infra] [--skip-client]');
    processImpl.exit?.(0);
    return { help: true };
  }

  const steps = [];
  let infraStarted = false;
  let hasFailure = false;

  try {
    if (!options.skipInfra) {
      const infraUp = runStepImpl('pnpm', ['run', 'go-live:infra:up'], 'infra-up');
      steps.push(infraUp);
      if (infraUp.exitCode !== 0) {
        hasFailure = true;
      } else {
        infraStarted = true;
      }
    }

    if (!hasFailure) {
      const generate = runStepImpl('pnpm', ['--filter', 'api', 'exec', 'prisma', 'generate'], 'api-prisma-generate');
      steps.push(generate);
      if (generate.exitCode !== 0) {
        hasFailure = true;
      }
    }

    if (!hasFailure) {
      const migrate = runStepImpl('pnpm', ['--filter', 'api', 'exec', 'prisma', 'migrate', 'deploy'], 'api-migrate-deploy');
      steps.push(migrate);
      if (migrate.exitCode !== 0) {
        hasFailure = true;
      }
    }

    if (!hasFailure) {
      const apiSuite = runStepImpl(
        'pnpm',
        [
          '--filter',
          'api',
          'run',
          'test',
          'src/modules/engine/runtime-flow.e2e.test.ts',
          'src/modules/backtests/backtests.e2e.test.ts',
          'src/modules/engine/preTrade.e2e.test.ts',
          'src/modules/bots/bots.e2e.test.ts',
        ],
        'api-cutover-suite'
      );
      steps.push(apiSuite);
      if (apiSuite.exitCode !== 0) {
        hasFailure = true;
      }
    }

    if (!hasFailure && !options.skipClient) {
      const clientSuite = runStepImpl(
        'pnpm',
        [
          '--filter',
          'web',
          'exec',
          'vitest',
          'run',
          'src/features/bots/components/BotsManagement.test.tsx',
          'src/features/logs/components/AuditTrailView.test.tsx',
        ],
        'web-cutover-suite'
      );
      steps.push(clientSuite);
      if (clientSuite.exitCode !== 0) {
        hasFailure = true;
      }
    }
  } finally {
    if (infraStarted && !options.skipInfra) {
      const infraDown = runStepImpl('pnpm', ['run', 'go-live:infra:down'], 'infra-down');
      steps.push(infraDown);
      if (infraDown.exitCode !== 0) {
        hasFailure = true;
      }
    }
  }

  const generatedAt = now().toISOString();
  const stamp = nowStamp(now());
  const jsonFile = path.join(operationsRoot, `_artifacts-cutover-dry-run-${stamp}.json`);
  const mdFile = path.join(operationsRoot, `v1-local-cutover-dry-run-${stamp}.md`);
  const report = {
    generatedAt,
    status: hasFailure ? 'FAILED' : 'PASS',
    options,
    steps,
  };

  await mkdirImpl(operationsRoot, { recursive: true });
  await writeFileImpl(jsonFile, JSON.stringify(report, null, 2));
  await writeFileImpl(mdFile, renderMarkdown(report, path.relative(process.cwd(), jsonFile)));

  logger.log(`Cutover dry-run JSON: ${path.relative(process.cwd(), jsonFile)}`);
  logger.log(`Cutover dry-run report: ${path.relative(process.cwd(), mdFile)}`);
  processImpl.exit?.(hasFailure ? 1 : 0);
  return report;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('[ops:cutover:dry-run] failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
