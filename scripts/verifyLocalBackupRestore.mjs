#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export const parseArgs = (argv = process.argv.slice(2), env = process.env) => {
  const args = argv;
  const options = {
    container: env.DB_CHECK_CONTAINER ?? '',
    dbUser: env.DB_CHECK_USER ?? 'postgres',
    dbName: env.DB_CHECK_NAME ?? 'cryptosparrow',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--container') options.container = args[index + 1] ?? options.container;
    if (arg === '--db-user') options.dbUser = args[index + 1] ?? options.dbUser;
    if (arg === '--db-name') options.dbName = args[index + 1] ?? options.dbName;
  }

  return options;
};

export const run = (command, args) =>
  execFileSync(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  }).trim();

export const nowStamp = (now = () => new Date()) => now().toISOString().replace(/[:.]/g, '-');
export const normalizeIdSuffix = (value) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

export const detectPostgresContainer = (runImpl = run) => {
  const rows = runImpl('docker', ['ps', '--format', '{{.Names}}']).split(/\r?\n/).filter(Boolean);
  const prioritized = rows.find((name) => name.includes('cryptosparrow-postgres'));
  if (prioritized) return prioritized;
  const postgresLike = rows.find((name) => name.includes('postgres'));
  return postgresLike ?? null;
};

export const dockerExecSh = (container, script, runImpl = run) => runImpl('docker', ['exec', container, 'sh', '-lc', script]);

export const main = async (deps = {}) => {
  const {
    argv = process.argv.slice(2),
    consoleImpl = console,
    cwd = process.cwd(),
    env = process.env,
    mkdirImpl = mkdir,
    writeFileImpl = writeFile,
    now = () => new Date(),
    runImpl = run,
  } = deps;
  const options = parseArgs(argv, env);
  if (options.help) {
    consoleImpl.log('Usage: node scripts/verifyLocalBackupRestore.mjs [--container <name>] [--db-user <user>] [--db-name <name>]');
    return { status: 0, help: true };
  }

  const container = options.container || detectPostgresContainer(runImpl);
  if (!container) {
    throw new Error('Cannot detect postgres container. Start Docker and pass --container <name>.');
  }

  const stamp = nowStamp(now);
  // Use full timestamp precision to avoid collisions across consecutive or parallel checks.
  const restoreDb = `${options.dbName}_restore_check_${normalizeIdSuffix(stamp)}`;
  const backupPath = `/tmp/${options.dbName}_backup_${stamp}.dump`;

  const operationsDir = path.resolve(cwd, 'history', 'operations');
  await mkdirImpl(operationsDir, { recursive: true });
  const artifactTxt = path.join(operationsDir, `_artifacts-db-restore-check-${stamp}.txt`);
  const reportMd = path.join(operationsDir, `v1-db-restore-check-${stamp}.md`);

  const lines = [];
  const push = (line) => lines.push(line);
  push(`Container: ${container}`);
  push(`DB user: ${options.dbUser}`);
  push(`Primary DB: ${options.dbName}`);
  push(`Restore DB: ${restoreDb}`);
  push('');

  try {
    push('[1/6] Creating compressed backup with pg_dump');
    dockerExecSh(container, `pg_dump -U ${options.dbUser} -d ${options.dbName} -Fc -f ${backupPath}`, runImpl);
    push(`Backup created: ${backupPath}`);
    push('');

    push('[2/6] Recreating restore database');
    dockerExecSh(
      container,
      `psql -U ${options.dbUser} -d postgres -c "DROP DATABASE IF EXISTS \\"${restoreDb}\\";" && psql -U ${options.dbUser} -d postgres -c "CREATE DATABASE \\"${restoreDb}\\";"`,
      runImpl
    );
    push('Restore database created.');
    push('');

    push('[3/6] Restoring backup into restore database');
    dockerExecSh(container, `pg_restore -U ${options.dbUser} -d ${restoreDb} ${backupPath}`, runImpl);
    push('Restore completed.');
    push('');

    push('[4/6] Running key table validation counts');
    const counts = dockerExecSh(
      container,
      `psql -U ${options.dbUser} -d ${restoreDb} -t -A -F"," -c "SELECT 'User', count(*) FROM \\"User\\" UNION ALL SELECT 'Bot', count(*) FROM \\"Bot\\" UNION ALL SELECT 'Order', count(*) FROM \\"Order\\" UNION ALL SELECT 'Position', count(*) FROM \\"Position\\" UNION ALL SELECT 'Log', count(*) FROM \\"Log\\";"`,
      runImpl
    );
    push('Validation counts (table,count):');
    push(counts || '(no rows)');
    push('');

    push('[5/6] Cleaning restore database');
    dockerExecSh(container, `psql -U ${options.dbUser} -d postgres -c "DROP DATABASE IF EXISTS \\"${restoreDb}\\";"`, runImpl);
    push('Restore database dropped.');
    push('');

    push('[6/6] Cleaning backup artifact inside container');
    dockerExecSh(container, `rm -f ${backupPath}`, runImpl);
    push('Temporary backup file removed.');
    push('');
    push('RESULT: PASS');
  } catch (error) {
    push('');
    push(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    push('RESULT: FAIL');
    try {
      dockerExecSh(container, `psql -U ${options.dbUser} -d postgres -c "DROP DATABASE IF EXISTS \\"${restoreDb}\\";"`, runImpl);
    } catch {
      // best-effort cleanup
    }
    try {
      dockerExecSh(container, `rm -f ${backupPath}`, runImpl);
    } catch {
      // best-effort cleanup
    }
  }

  const content = lines.join('\n');
  await writeFileImpl(artifactTxt, content);

  const markdown = `# V1 DB Backup/Restore Check (${stamp.slice(0, 10)})

- Generated at (UTC): ${now().toISOString()}
- Container: \`${container}\`
- DB user: \`${options.dbUser}\`
- DB name: \`${options.dbName}\`
- Raw artifact: \`${path.relative(cwd, artifactTxt)}\`

\`\`\`text
${content}
\`\`\`
`;

  await writeFileImpl(reportMd, markdown);

  const isPass = content.includes('RESULT: PASS');
  consoleImpl.log(`DB restore artifact: ${path.relative(cwd, artifactTxt)}`);
  consoleImpl.log(`DB restore report: ${path.relative(cwd, reportMd)}`);
  if (!isPass) process.exitCode = 1;
  return { status: isPass ? 0 : 1, artifactTxt, reportMd, content, markdown };
};

if (isDirectRun()) {
  main().catch((error) => {
    console.error('[ops:db:backup-restore:check-local] failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
