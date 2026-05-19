#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const requiredPhaseIds = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const requiredWorkPackageIds = Array.from({ length: 8 }, (_, index) => `WP-${String(index + 1).padStart(2, '0')}`);
const requiredSafetyBoundaries = [
  'productionDataMutationWithoutApproval',
  'liveOrderSubmitCancelCloseWithoutApproval',
  'exchangeSideMutationWithoutApproval',
  'architectureDecisionApplied',
  'productionReadinessClaimWithoutFreshAud19',
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
    plan: 'docs/operations/audit-remediation-master-plan-2026-05-19.json',
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
    if (arg === '--plan') {
      options.plan = args[index + 1] ?? options.plan;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:remediation-plan:check -- [--plan <path>] [--json]

Validates the reusable audit remediation master plan JSON by checking:
- P0 through P6 roadmap phases are present
- WP-01 through WP-08 work packages are present and actionable
- safety boundaries remain false
- blockers and closure checks are explicit
`);
};

const idsFrom = (items) => (Array.isArray(items) ? items.map((item) => item.id).filter(Boolean) : []);
const uniqueDuplicates = (items) => [...new Set(items.filter((item, index, all) => all.indexOf(item) !== index))];
const defaultExists = (relativePath) => existsSync(path.resolve(repoRoot, relativePath));

export const validateAuditRemediationPlan = (plan, options = {}) => {
  const exists = options.exists ?? defaultExists;
  const phaseIds = idsFrom(plan.priorityRoadmap);
  const workPackageIds = idsFrom(plan.workPackages);
  const safetyBoundaries = plan.safetyBoundaries ?? {};
  const closureChecks = Array.isArray(plan.closureChecks) ? plan.closureChecks : [];
  const currentBlockers = Array.isArray(plan.currentBlockers) ? plan.currentBlockers : [];
  const referencedPaths = [
    plan.sourceMarkdown,
    ...(Array.isArray(plan.primaryEvidence) ? plan.primaryEvidence : []),
  ].filter(Boolean);

  const result = {
    plan: options.planPath ?? null,
    status: 'PASS',
    phases: {
      expected: requiredPhaseIds.length,
      found: new Set(phaseIds).size,
      missing: requiredPhaseIds.filter((id) => !phaseIds.includes(id)),
      duplicates: uniqueDuplicates(phaseIds),
    },
    workPackages: {
      expected: requiredWorkPackageIds.length,
      found: new Set(workPackageIds).size,
      missing: requiredWorkPackageIds.filter((id) => !workPackageIds.includes(id)),
      duplicates: uniqueDuplicates(workPackageIds),
      missingDoneWhen: [],
      missingValidationOrBlocker: [],
    },
    closureChecks: {
      missing: requiredClosureCheckFragments.filter(
        (fragment) => !closureChecks.some((check) => String(check).includes(fragment)),
      ),
      count: closureChecks.length,
    },
    references: {
      checked: referencedPaths.length,
      missing: referencedPaths.filter((relativePath) => !exists(relativePath)).sort(),
    },
    blockers: {
      count: currentBlockers.length,
      missingAud19Blocker: !currentBlockers.some((blocker) => String(blocker).includes('AUD-19')),
    },
    safetyBoundaries: {
      missing: requiredSafetyBoundaries.filter((key) => !(key in safetyBoundaries)),
      unsafe: requiredSafetyBoundaries.filter((key) => safetyBoundaries[key] !== false),
    },
  };

  const workPackages = Array.isArray(plan.workPackages) ? plan.workPackages : [];
  result.workPackages.missingDoneWhen = workPackages
    .filter((workPackage) => !workPackage.doneWhen)
    .map((workPackage) => workPackage.id ?? 'unknown');
  result.workPackages.missingValidationOrBlocker = workPackages
    .filter((workPackage) => {
      const validation = Array.isArray(workPackage.validation) ? workPackage.validation : [];
      const blockers = Array.isArray(workPackage.blockers) ? workPackage.blockers : [];
      return validation.length === 0 && blockers.length === 0;
    })
    .map((workPackage) => workPackage.id ?? 'unknown');

  result.status =
    result.phases.missing.length === 0 &&
    result.phases.duplicates.length === 0 &&
    result.workPackages.missing.length === 0 &&
    result.workPackages.duplicates.length === 0 &&
    result.workPackages.missingDoneWhen.length === 0 &&
    result.workPackages.missingValidationOrBlocker.length === 0 &&
    result.closureChecks.missing.length === 0 &&
    result.references.missing.length === 0 &&
    result.blockers.count > 0 &&
    !result.blockers.missingAud19Blocker &&
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

  const planPath = path.resolve(repoRoot, options.plan);
  const plan = JSON.parse(await readFile(planPath, 'utf8'));
  const result = validateAuditRemediationPlan(plan, {
    planPath: path.relative(repoRoot, planPath).split(path.sep).join('/'),
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Audit remediation plan check: ${result.status}`);
    console.log(`- Phases: ${result.phases.found}/${result.phases.expected}`);
    console.log(`- Work packages: ${result.workPackages.found}/${result.workPackages.expected}`);
    console.log(`- References checked: ${result.references.checked}`);
    console.log(`- Missing references: ${result.references.missing.length}`);
    console.log(`- Missing closure checks: ${result.closureChecks.missing.length}`);
    console.log(`- Current blockers: ${result.blockers.count}`);
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
