import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readText = (relativePath) => readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8');
const includesAll = (text, fragments) => fragments.every((fragment) => text.includes(fragment));

test('top release and Ops package scripts point at the intended local entrypoints', async () => {
  const packageJson = JSON.parse(await readText('package.json'));
  const scripts = packageJson.scripts;

  assert.deepEqual(
    {
      'workers/prod': scripts['workers/prod'],
      'prod-like/start': scripts['prod-like/start'],
      'architecture:journey:triage': scripts['architecture:journey:triage'],
      'qa:smoke-e2e:repeatable': scripts['qa:smoke-e2e:repeatable'],
      'ops:rc:checklist:sync': scripts['ops:rc:checklist:sync'],
      'ops:rc:gates:summary': scripts['ops:rc:gates:summary'],
      'ops:db:backup-restore:check-local': scripts['ops:db:backup-restore:check-local'],
      'ops:db:restore-drill': scripts['ops:db:restore-drill'],
      'ops:rc:gates:refresh:summary:strict': scripts['ops:rc:gates:refresh:summary:strict'],
      'ops:project:scan': scripts['ops:project:scan'],
      'ops:deploy:rollback-proof': scripts['ops:deploy:rollback-proof'],
      'ops:prod-ux:proof': scripts['ops:prod-ux:proof'],
    },
    {
      'workers/prod': 'node scripts/start-workers-prod.mjs',
      'prod-like/start': 'node scripts/start-local-prod-like.mjs',
      'architecture:journey:triage': 'node scripts/triageJourneyEvidence.mjs',
      'qa:smoke-e2e:repeatable': 'node scripts/runQaRepeatableSmokeE2e.mjs',
      'ops:rc:checklist:sync': 'node scripts/syncRcChecklistFromGateStatus.mjs',
      'ops:rc:gates:summary': 'node scripts/summarizeRcGates.mjs',
      'ops:db:backup-restore:check-local': 'node scripts/verifyLocalBackupRestore.mjs',
      'ops:db:restore-drill': 'node scripts/runRestoreDrillEvidence.mjs',
      'ops:rc:gates:refresh:summary:strict': 'node scripts/runRcRefreshSummaryStrict.mjs',
      'ops:project:scan': 'node scripts/runV1StaticIssueScan.mjs',
      'ops:deploy:rollback-proof': 'node scripts/runRollbackProofEvidence.mjs',
      'ops:prod-ux:proof': 'node scripts/runProdUxA11yMobileProof.mjs',
    },
  );
});

test('release and Ops wrappers preserve safe command contracts without executing them', async () => {
  const files = Object.fromEntries(
    await Promise.all(
      [
        'scripts/runProdUxA11yMobileProof.mjs',
        'scripts/runPublicReadOnlyBrowserProof.mjs',
        'scripts/runWebNextProductionCommand.mjs',
        'scripts/runQaRepeatableSmokeE2e.mjs',
        'scripts/runRcRefreshSummaryStrict.mjs',
        'scripts/runRestoreDrillEvidence.mjs',
        'scripts/runRollbackProofEvidence.mjs',
        'scripts/runV1StaticIssueScan.mjs',
        'scripts/start-local-prod-like.mjs',
        'scripts/start-workers-prod.mjs',
        'scripts/summarizeRcGates.mjs',
        'scripts/syncRcChecklistFromGateStatus.mjs',
        'scripts/triageJourneyEvidence.mjs',
        'scripts/verifyLocalBackupRestore.mjs',
        'scripts/writeWebBuildMetadata.mjs',
      ].map(async (relativePath) => [relativePath, await readText(relativePath)]),
    ),
  );

  assert.equal(
    includesAll(files['scripts/runProdUxA11yMobileProof.mjs'], [
      'missing --i-understand-production-ux-proof approval flag',
      'resolveOpsAuthToken',
      '--headless=new',
      'Network.setCookie',
      'Auth tokens, passwords, cookies, private headers, and raw protected payloads',
      'await rm(browser.userDataDir',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runPublicReadOnlyBrowserProof.mjs'], [
      'PUBLIC_BROWSER_PROOF_WEB_BASE_URL',
      '--headless=new',
      'remote-debugging-address=127.0.0.1',
      'overflowX',
      'public-read-only-browser-proof',
      'await rm(browser.userDataDir',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runWebNextProductionCommand.mjs'], [
      "['build', 'start'].includes(command)",
      "NODE_ENV: 'production'",
      'writeWebBuildMetadata.mjs',
      "node_modules', 'next', 'dist', 'bin', 'next'",
      "env.PORT || '3002'",
      "'-H', '0.0.0.0'",
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runQaRepeatableSmokeE2e.mjs'], [
      'web,api,backtests',
      'test:go-live:web',
      'test:go-live:api',
      'src/modules/backtests/backtests.e2e.test.ts',
      'continueOnFail',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runRcRefreshSummaryStrict.mjs'], [
      'ops:rc:gates:refresh:strict',
      'ops:rc:gates:refresh:strict:prod',
      'ops:rc:gates:summary',
      '--require-production-gate2',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runRestoreDrillEvidence.mjs'], [
      'scripts/runBackupVerificationProfile.mjs',
      '_artifacts-restore-drill-',
      'v1-restore-drill-',
      'backupRestoreResultPass',
      'Expected SHA',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runRollbackProofEvidence.mjs'], [
      'SECRET_CLI_FLAGS',
      'ROLLBACK_GUARD_AUTH_TOKEN',
      'scripts/evaluateRollbackGuard.mjs',
      'shouldRollbackFalse',
      'freshnessStatusPass',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/runV1StaticIssueScan.mjs'], [
      'scanRules',
      'collectSurfaceFindings',
      'collectV1Findings',
      'collectQueueFindings',
      'SOURCE_',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/start-local-prod-like.mjs'], [
      "apps', 'api', '.env'",
      "apps', 'web', '.env.local'",
      "['--filter', 'api', 'build']",
      "['--filter', 'web', 'build']",
      "['run', 'workers/prod']",
      "process.on('SIGINT', gracefulShutdown)",
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/start-workers-prod.mjs'], [
      'marketData.worker.js',
      'marketStream.worker.js',
      'backtest.worker.js',
      'execution.worker.js',
      'run "pnpm --filter api build" before starting workers',
      "process.on('SIGTERM', gracefulShutdown)",
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/summarizeRcGates.mjs'], [
      'const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url)',
      'parseGateLabel',
      'parseStatusGeneratedAt',
      'evidenceIsStaleRelativeToStatus',
      'strictPassed',
      'Evidence freshness',
      'if (isDirectRun())',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/syncRcChecklistFromGateStatus.mjs'], [
      'const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url)',
      'refreshLatestVerificationDate',
      'refreshExpectedSha',
      'setChecklistCheckbox',
      'Engineering sign-off.',
      'RC owner assigned with rollback authority.',
      'if (isDirectRun())',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/triageJourneyEvidence.mjs'], [
      'user-action-index.csv',
      'web-journey-index.csv',
      'function-chain-evidence-index.csv',
      'api-surface-evidence-index.csv',
      'No matching indexed journey evidence found',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/verifyLocalBackupRestore.mjs'], [
      'docker',
      'pg_dump',
      'pg_restore',
      'RESULT: PASS',
      'RESULT: FAIL',
    ]),
    true,
  );

  assert.equal(
    includesAll(files['scripts/writeWebBuildMetadata.mjs'], [
      'SOURCE_COMMIT',
      'COOLIFY_GIT_COMMIT_SHA',
      'readGitShaFromRef',
      "metadataSource: 'unknown'",
      'metadataSource',
    ]),
    true,
  );
});
