#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const requiredToolIds = [
  'AUDIT-MANIFEST-CHECK',
  'AUDIT-MANIFEST-CHECK-TEST',
  'AUDIT-MANIFEST-COMPARE',
  'AUDIT-MANIFEST-COMPARE-TEST',
  'AUDIT-MANIFEST-VERIFY',
  'AUDIT-RERUN-PLAYBOOK-CHECK',
  'AUDIT-RERUN-PLAYBOOK-CHECK-TEST',
  'AUDIT-HANDOFF-CHECK',
  'AUDIT-HANDOFF-CHECK-TEST',
  'AUDIT-REMEDIATION-PLAN-CHECK',
  'AUDIT-REMEDIATION-PLAN-CHECK-TEST',
  'AUDIT-TOOLING-INDEX-CHECK',
  'AUDIT-TOOLING-INDEX-CHECK-TEST',
  'AUDIT-DATA-DB-ISOLATED',
  'API-ENDPOINT-DOCS-PARITY',
  'OPS-PROTECTED-INPUTS-CHECK',
  'OPS-PROTECTED-INPUTS-CHECK-TEST',
];
const requiredSafetyBoundaries = [
  'architectureDecisionApplied',
  'productionDataMutation',
  'liveOrderSubmitCancelClose',
  'exchangeSideMutation',
];
const requiredClosureCommandFragments = [
  'audit:manifest:verify',
  'audit:remediation-plan:check',
  'docs:parity:check',
  'quality:guardrails',
  'git diff --check',
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    index: 'docs/operations/reusable-audit-tooling-index-2026-05-19.json',
    json: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--json') {
      options.json = true;
      continue;
    }
    if (arg === '--index') {
      options.index = args[index + 1] ?? options.index;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:tooling-index:check -- [--index <path>] [--json]

Validates the reusable audit tooling index JSON by checking:
- required tool IDs are present
- tool IDs are unique
- referenced scripts/files exist
- commands and purposes are present
- required closure commands are present
- safety boundaries remain false
`);
};

const defaultExists = (relativePath) => existsSync(path.resolve(repoRoot, relativePath));

export const validateReusableAuditToolingIndex = (toolingIndex, options = {}) => {
  const exists = options.exists ?? defaultExists;
  const tools = Array.isArray(toolingIndex.tools) ? toolingIndex.tools : [];
  const toolIds = tools.map((tool) => tool.id).filter(Boolean);
  const toolIdSet = new Set(toolIds);
  const missingToolIds = requiredToolIds.filter((toolId) => !toolIdSet.has(toolId));
  const duplicateToolIds = toolIds.filter((toolId, index, all) => all.indexOf(toolId) !== index);
  const toolsMissingCommand = tools.filter((tool) => !tool.command).map((tool) => tool.id ?? 'unknown');
  const toolsMissingPurpose = tools.filter((tool) => !tool.purpose).map((tool) => tool.id ?? 'unknown');
  const missingScripts = tools
    .filter((tool) => tool.script && !exists(tool.script))
    .map((tool) => tool.script)
    .sort();

  const safetyBoundaries = toolingIndex.safetyBoundaries ?? {};
  const missingSafetyBoundaries = requiredSafetyBoundaries.filter((key) => !(key in safetyBoundaries));
  const unsafeSafetyBoundaries = requiredSafetyBoundaries.filter((key) => safetyBoundaries[key] !== false);

  const closureCommands = Array.isArray(toolingIndex.closureCommands) ? toolingIndex.closureCommands : [];
  const cleanupChecks = Array.isArray(toolingIndex.cleanupChecks) ? toolingIndex.cleanupChecks : [];
  const primaryCommandOk = toolingIndex.primaryCommand === 'corepack pnpm run audit:manifest:verify';
  const missingClosureCommandFragments = requiredClosureCommandFragments.filter(
    (fragment) => !closureCommands.some((command) => String(command).includes(fragment)),
  );

  const result = {
    index: options.indexPath ?? null,
    status: 'PASS',
    tools: {
      expected: requiredToolIds.length,
      found: toolIdSet.size,
      missing: missingToolIds,
      duplicates: [...new Set(duplicateToolIds)],
      missingCommand: toolsMissingCommand,
      missingPurpose: toolsMissingPurpose,
      missingScripts: [...new Set(missingScripts)],
    },
    commands: {
      primaryCommandOk,
      closureCommands: closureCommands.length,
      missingClosureCommandFragments,
      cleanupChecks: cleanupChecks.length,
    },
    safetyBoundaries: {
      missing: missingSafetyBoundaries,
      unsafe: unsafeSafetyBoundaries,
    },
  };

  result.status =
    result.tools.missing.length === 0 &&
    result.tools.duplicates.length === 0 &&
    result.tools.missingCommand.length === 0 &&
    result.tools.missingPurpose.length === 0 &&
    result.tools.missingScripts.length === 0 &&
    result.commands.primaryCommandOk &&
    result.commands.closureCommands > 0 &&
    result.commands.missingClosureCommandFragments.length === 0 &&
    result.commands.cleanupChecks > 0 &&
    result.safetyBoundaries.missing.length === 0 &&
    result.safetyBoundaries.unsafe.length === 0
      ? 'PASS'
      : 'FAIL';

  return result;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const indexPath = path.resolve(repoRoot, options.index);
  const toolingIndex = JSON.parse(await readFile(indexPath, 'utf8'));
  const result = validateReusableAuditToolingIndex(toolingIndex, {
    indexPath: path.relative(repoRoot, indexPath).split(path.sep).join('/'),
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Reusable audit tooling index check: ${result.status}`);
    console.log(`- Tools: ${result.tools.found}/${result.tools.expected}`);
    console.log(`- Missing tools: ${result.tools.missing.length}`);
    console.log(`- Duplicate tools: ${result.tools.duplicates.length}`);
    console.log(`- Missing scripts: ${result.tools.missingScripts.length}`);
    console.log(`- Missing closure commands: ${result.commands.missingClosureCommandFragments.length}`);
    console.log(`- Unsafe safety boundaries: ${result.safetyBoundaries.unsafe.length}`);
  }

  if (result.status !== 'PASS') {
    process.exitCode = 1;
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
