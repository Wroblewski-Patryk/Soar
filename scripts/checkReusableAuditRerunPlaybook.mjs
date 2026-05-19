#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const expectedAuditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);
const requiredFutureCommands = ['check', 'compare', 'compareJson'];
const requiredSafetyBoundaries = [
  'productionDataMutationWithoutApproval',
  'liveOrderSubmitCancelCloseWithoutApproval',
  'exchangeSideMutationWithoutApproval',
  'architectureDecisionApplied',
  'runtimeBehaviorChanged',
];
const requiredClosureCheckFragments = [
  'audit:manifest:verify',
  'audit:remediation-plan:check',
  'docs:parity:check',
  'quality:guardrails',
  'git diff --check',
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    playbook: 'docs/operations/reusable-audit-rerun-playbook-2026-05-19.json',
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
    if (arg === '--playbook') {
      options.playbook = args[index + 1] ?? options.playbook;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:rerun-playbook:check -- [--playbook <path>] [--json]

Validates the reusable audit rerun playbook JSON by checking:
- AUD-00 through AUD-23 are present in rerunOrder
- future manifest commands are present
- regression rules, stop conditions, required closure checks, and cleanup checks exist
- safety boundaries remain false
`);
};

const collectRerunAuditIds = (playbook) =>
  (Array.isArray(playbook.rerunOrder) ? playbook.rerunOrder : []).flatMap((step) =>
    Array.isArray(step.auditIds) ? step.auditIds : [],
  );

export const validateReusableAuditRerunPlaybook = (playbook, options = {}) => {
  const auditIds = collectRerunAuditIds(playbook);
  const auditIdSet = new Set(auditIds);
  const missingAuditIds = expectedAuditIds.filter((auditId) => !auditIdSet.has(auditId));
  const duplicateAuditIds = auditIds.filter((auditId, index, all) => all.indexOf(auditId) !== index);

  const futureCommands = playbook.futureManifestCommands ?? {};
  const missingFutureCommands = requiredFutureCommands.filter((key) => !futureCommands[key]);
  const commandWithoutBaselinePlaceholder = ['compare', 'compareJson'].filter(
    (key) => typeof futureCommands[key] === 'string' && !futureCommands[key].includes('2026-05-19'),
  );
  const commandWithoutTargetPlaceholder = requiredFutureCommands.filter(
    (key) => typeof futureCommands[key] === 'string' && !futureCommands[key].includes('YYYY-MM-DD'),
  );

  const safetyBoundaries = playbook.safetyBoundaries ?? {};
  const missingSafetyBoundaries = requiredSafetyBoundaries.filter((key) => !(key in safetyBoundaries));
  const unsafeSafetyBoundaries = requiredSafetyBoundaries.filter((key) => safetyBoundaries[key] !== false);
  const closureChecks = Array.isArray(playbook.closureChecks) ? playbook.closureChecks : [];
  const missingClosureCheckFragments = requiredClosureCheckFragments.filter(
    (fragment) => !closureChecks.some((check) => String(check).includes(fragment)),
  );

  const result = {
    playbook: options.playbookPath ?? null,
    status: 'PASS',
    audits: {
      expected: expectedAuditIds.length,
      found: auditIdSet.size,
      missing: missingAuditIds,
      duplicates: [...new Set(duplicateAuditIds)],
    },
    commands: {
      missingFutureCommands,
      commandWithoutBaselinePlaceholder,
      commandWithoutTargetPlaceholder,
    },
    sections: {
      preconditions: Array.isArray(playbook.preconditions) ? playbook.preconditions.length : 0,
      regressionRules: Array.isArray(playbook.regressionRules) ? playbook.regressionRules.length : 0,
      improvementRules: Array.isArray(playbook.improvementRules) ? playbook.improvementRules.length : 0,
      stopConditions: Array.isArray(playbook.stopConditions) ? playbook.stopConditions.length : 0,
      closureChecks: closureChecks.length,
      cleanupChecks: Array.isArray(playbook.cleanupChecks) ? playbook.cleanupChecks.length : 0,
    },
    closureChecks: {
      missingRequiredFragments: missingClosureCheckFragments,
    },
    safetyBoundaries: {
      missing: missingSafetyBoundaries,
      unsafe: unsafeSafetyBoundaries,
    },
  };

  const missingRequiredSections = Object.entries(result.sections)
    .filter(([, count]) => count === 0)
    .map(([key]) => key);

  result.sections.missing = missingRequiredSections;
  result.status =
    result.audits.missing.length === 0 &&
    result.audits.duplicates.length === 0 &&
    result.commands.missingFutureCommands.length === 0 &&
    result.commands.commandWithoutBaselinePlaceholder.length === 0 &&
    result.commands.commandWithoutTargetPlaceholder.length === 0 &&
    missingRequiredSections.length === 0 &&
    result.closureChecks.missingRequiredFragments.length === 0 &&
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

  const playbookPath = path.resolve(repoRoot, options.playbook);
  const playbook = JSON.parse(await readFile(playbookPath, 'utf8'));
  const result = validateReusableAuditRerunPlaybook(playbook, {
    playbookPath: path.relative(repoRoot, playbookPath).split(path.sep).join('/'),
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Reusable audit rerun playbook check: ${result.status}`);
    console.log(`- Audits: ${result.audits.found}/${result.audits.expected}`);
    console.log(`- Missing audits: ${result.audits.missing.length}`);
    console.log(`- Duplicate audits: ${result.audits.duplicates.length}`);
    console.log(`- Missing future commands: ${result.commands.missingFutureCommands.length}`);
    console.log(`- Missing sections: ${result.sections.missing.length}`);
    console.log(`- Missing required closure checks: ${result.closureChecks.missingRequiredFragments.length}`);
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
