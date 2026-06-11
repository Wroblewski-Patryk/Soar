#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const PROFILE_CONFIG = {
  local: {
    envContainers: ['DB_CHECK_CONTAINER'],
    envUsers: ['DB_CHECK_USER'],
    envNames: ['DB_CHECK_NAME'],
  },
  stage: {
    envContainers: ['STAGE_DB_CHECK_CONTAINER'],
    envUsers: ['STAGE_DB_CHECK_USER'],
    envNames: ['STAGE_DB_CHECK_NAME'],
  },
  prod: {
    envContainers: ['PROD_DB_CHECK_CONTAINER', 'PRODUCTION_DB_CHECK_CONTAINER'],
    envUsers: ['PROD_DB_CHECK_USER', 'PRODUCTION_DB_CHECK_USER'],
    envNames: ['PROD_DB_CHECK_NAME', 'PRODUCTION_DB_CHECK_NAME'],
  },
};

export const firstNonEmptyEnv = (keys, env = process.env) => {
  for (const key of keys) {
    const value = env[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return '';
};

export const parseArgs = (args = process.argv.slice(2)) => {
  const options = {
    profile: 'local',
    container: '',
    dbUser: '',
    dbName: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--profile') options.profile = (args[index + 1] ?? options.profile).toLowerCase();
    if (arg === '--container') options.container = args[index + 1] ?? options.container;
    if (arg === '--db-user') options.dbUser = args[index + 1] ?? options.dbUser;
    if (arg === '--db-name') options.dbName = args[index + 1] ?? options.dbName;
  }

  return options;
};

export const printUsage = (logger = console) => {
  logger.log(
    [
      'Usage: node scripts/runBackupVerificationProfile.mjs [--profile <local|stage|prod>] [--container <name>] [--db-user <user>] [--db-name <name>]',
      '',
      'Env by profile:',
      '  local: DB_CHECK_CONTAINER, DB_CHECK_USER, DB_CHECK_NAME',
      '  stage: STAGE_DB_CHECK_CONTAINER, STAGE_DB_CHECK_USER, STAGE_DB_CHECK_NAME',
      '  prod:  PROD_DB_CHECK_CONTAINER or PRODUCTION_DB_CHECK_CONTAINER,',
      '         PROD_DB_CHECK_USER or PRODUCTION_DB_CHECK_USER,',
      '         PROD_DB_CHECK_NAME or PRODUCTION_DB_CHECK_NAME',
    ].join('\n')
  );
};

export const run = (command, args, options = {}) =>
  (options.spawnSync ?? spawnSync)(command, args, {
    stdio: 'inherit',
    shell: (options.platform ?? process.platform) === 'win32',
    env: options.env ?? process.env,
  });

export const resolveOptions = (input, env = process.env) => {
  const profileConfig = PROFILE_CONFIG[input.profile];
  if (!profileConfig) {
    throw new Error(`Unsupported profile: ${input.profile}. Expected one of: local, stage, prod.`);
  }

  const container = input.container || firstNonEmptyEnv(profileConfig.envContainers, env) || '';
  const dbUser = input.dbUser || firstNonEmptyEnv(profileConfig.envUsers, env) || 'postgres';
  const dbName = input.dbName || firstNonEmptyEnv(profileConfig.envNames, env) || 'cryptosparrow';

  if (input.profile !== 'local' && !container) {
    throw new Error(
      `Missing container for profile "${input.profile}". Set --container or one of: ${profileConfig.envContainers.join(', ')}. For production restore drill, also verify DB user/name with: ${profileConfig.envUsers.join(', ')} and ${profileConfig.envNames.join(', ')}.`
    );
  }

  return {
    profile: input.profile,
    container,
    dbUser,
    dbName,
  };
};

export const main = (options = {}) => {
  const logger = options.console ?? console;
  const parsedOptions = parseArgs(options.argv ?? process.argv.slice(2));
  if (options.help) {
    printUsage(logger);
    options.process?.exit?.(0);
    return;
  }

  if (parsedOptions.help) {
    printUsage(logger);
    options.process?.exit?.(0);
    return;
  }

  const resolved = resolveOptions(parsedOptions, options.env ?? process.env);

  const scriptArgs = ['scripts/verifyLocalBackupRestore.mjs'];
  if (resolved.container) scriptArgs.push('--container', resolved.container);
  if (resolved.dbUser) scriptArgs.push('--db-user', resolved.dbUser);
  if (resolved.dbName) scriptArgs.push('--db-name', resolved.dbName);

  logger.log(
    `[ops:db:backup-verify] profile=${resolved.profile} container=${resolved.container || 'auto-detect'} db=${resolved.dbName} user=${resolved.dbUser}`
  );
  const runCommand = options.run ?? run;
  const result = runCommand('node', scriptArgs, { env: options.env });
  if (result.status !== 0) {
    throw new Error(`[ops:db:backup-verify] profile=${resolved.profile} failed.`);
  }
  logger.log(`[ops:db:backup-verify] profile=${resolved.profile} PASS`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(
      '[ops:db:backup-verify] failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}
