#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const requiredSourceKeys = [
  'product',
  'architecture',
  'auditRegistry',
  'auditBaseline',
  'handoff',
  'handoffJson',
  'rollup',
  'rollupJson',
  'rerunPlaybook',
  'rerunPlaybookJson',
  'toolingIndex',
  'toolingIndexJson',
  'decisionPacket',
  'repairPlaybooks',
  'taskBoard',
  'nextSteps',
  'riskRegister',
  'requirementsMatrix',
  'operationsAudit',
];
const requiredResidualRiskIds = ['AUD-19', 'GATEIO-PRODUCTION-LIVE', 'ASSISTANT-HOT-PATH'];
const requiredForbiddenFragments = [
  'production data mutation',
  'LIVE order submit/cancel/close',
  'exchange-side mutation',
  'runtime AI hot-path behavior',
];
const requiredValidationFragments = [
  'audit:manifest:verify',
  'audit:handoff:check',
  'docs:parity:check',
  'quality:guardrails',
  'git diff --check',
];
const requiredCleanupValidationFragments = [
  'chrome-headless-shell',
  '5432',
  '6379',
  'docker compose ps',
];
const requiredRollupSummaryKeys = [
  'currentOrCurrentLocal',
  'partial',
  'failedDecisionRequired',
  'deferred',
  'currentFromPriorBaseline',
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    handoff: 'history/artifacts/full-reusable-audit-handoff-2026-05-19.json',
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
    if (arg === '--handoff') {
      options.handoff = args[index + 1] ?? options.handoff;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:handoff:check -- [--handoff <path>] [--json]

Validates the reusable audit handoff JSON by checking:
- required source-of-truth paths are present and resolvable
- rollup summary matches the referenced rollup JSON when available
- required residual risks and forbidden boundaries are present
- latest validation includes core audit closure checks
- latest validation includes local cleanup checks
- production/LIVE/runtime mutation booleans stay fail-closed
`);
};

const pathExists = (relativePath) => {
  if (String(relativePath).endsWith('/**')) {
    return existsSync(path.resolve(repoRoot, String(relativePath).slice(0, -3)));
  }

  return existsSync(path.resolve(repoRoot, relativePath));
};

export const validateFullReusableAuditHandoff = (handoff, options = {}) => {
  const exists = options.exists ?? pathExists;
  const rollupSummarySource = options.rollupSummary ?? null;
  const sourceOfTruth = handoff.sourceOfTruth ?? {};
  const missingSourceKeys = requiredSourceKeys.filter((key) => !(key in sourceOfTruth));
  const missingSourcePaths = Object.entries(sourceOfTruth)
    .filter(([, relativePath]) => typeof relativePath === 'string' && !exists(relativePath))
    .map(([key, relativePath]) => ({ key, path: relativePath }))
    .sort((left, right) => left.key.localeCompare(right.key));

  const residualRisks = Array.isArray(handoff.residualRisks) ? handoff.residualRisks : [];
  const residualRiskIds = new Set(residualRisks.map((risk) => risk.id).filter(Boolean));
  const missingResidualRiskIds = requiredResidualRiskIds.filter((riskId) => !residualRiskIds.has(riskId));

  const forbiddenWithoutApproval = Array.isArray(handoff.forbiddenWithoutApproval)
    ? handoff.forbiddenWithoutApproval
    : [];
  const missingForbiddenFragments = requiredForbiddenFragments.filter(
    (fragment) => !forbiddenWithoutApproval.some((entry) => String(entry).includes(fragment)),
  );

  const latestValidation = Array.isArray(handoff.latestValidation) ? handoff.latestValidation : [];
  const missingValidationFragments = requiredValidationFragments.filter(
    (fragment) => !latestValidation.some((entry) => String(entry).includes(fragment)),
  );
  const missingCleanupValidationFragments = requiredCleanupValidationFragments.filter(
    (fragment) => !latestValidation.some((entry) => String(entry).includes(fragment)),
  );

  const expectedBooleans = {
    productionJourneyRun: false,
    liveExchangeMutationRun: false,
    runtimeBehaviorChanged: false,
  };
  const unsafeBooleans = Object.entries(expectedBooleans)
    .filter(([key, expected]) => handoff[key] !== expected)
    .map(([key]) => key);
  const rollupSummary = handoff.rollupSummary ?? {};
  const missingRollupSummaryKeys = requiredRollupSummaryKeys.filter((key) => !(key in rollupSummary));
  const rollupSummaryMismatches =
    rollupSummarySource === null
      ? []
      : requiredRollupSummaryKeys
          .filter((key) => rollupSummary[key] !== rollupSummarySource[key])
          .map((key) => ({
            key,
            declared: rollupSummary[key],
            actual: rollupSummarySource[key],
          }));

  const result = {
    handoff: options.handoffPath ?? null,
    status: 'PASS',
    sourceOfTruth: {
      expectedKeys: requiredSourceKeys.length,
      foundKeys: Object.keys(sourceOfTruth).length,
      missingKeys: missingSourceKeys,
      missingPaths: missingSourcePaths,
    },
    residualRisks: {
      expected: requiredResidualRiskIds,
      missing: missingResidualRiskIds,
    },
    rollupSummary: {
      missingKeys: missingRollupSummaryKeys,
      mismatches: rollupSummaryMismatches,
    },
    forbiddenWithoutApproval: {
      missingFragments: missingForbiddenFragments,
    },
    latestValidation: {
      missingFragments: missingValidationFragments,
      missingCleanupFragments: missingCleanupValidationFragments,
    },
    safetyBooleans: {
      unsafe: unsafeBooleans,
    },
  };

  result.status =
    result.sourceOfTruth.missingKeys.length === 0 &&
    result.sourceOfTruth.missingPaths.length === 0 &&
    result.rollupSummary.missingKeys.length === 0 &&
    result.rollupSummary.mismatches.length === 0 &&
    result.residualRisks.missing.length === 0 &&
    result.forbiddenWithoutApproval.missingFragments.length === 0 &&
    result.latestValidation.missingFragments.length === 0 &&
    result.latestValidation.missingCleanupFragments.length === 0 &&
    result.safetyBooleans.unsafe.length === 0
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

  const handoffPath = path.resolve(repoRoot, options.handoff);
  const handoff = JSON.parse(await readFile(handoffPath, 'utf8'));
  const rollupJsonPath =
    typeof handoff.sourceOfTruth?.rollupJson === 'string'
      ? path.resolve(repoRoot, handoff.sourceOfTruth.rollupJson)
      : null;
  const rollupSummary =
    rollupJsonPath && existsSync(rollupJsonPath)
      ? JSON.parse(await readFile(rollupJsonPath, 'utf8')).summary
      : null;
  const result = validateFullReusableAuditHandoff(handoff, {
    handoffPath: path.relative(repoRoot, handoffPath).split(path.sep).join('/'),
    rollupSummary,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Full reusable audit handoff check: ${result.status}`);
    console.log(`- Source keys: ${result.sourceOfTruth.foundKeys}/${result.sourceOfTruth.expectedKeys}`);
    console.log(`- Missing source paths: ${result.sourceOfTruth.missingPaths.length}`);
    console.log(`- Missing rollup summary keys: ${result.rollupSummary.missingKeys.length}`);
    console.log(`- Rollup summary mismatches: ${result.rollupSummary.mismatches.length}`);
    console.log(`- Missing residual risks: ${result.residualRisks.missing.length}`);
    console.log(`- Missing forbidden boundaries: ${result.forbiddenWithoutApproval.missingFragments.length}`);
    console.log(`- Missing validation checks: ${result.latestValidation.missingFragments.length}`);
    console.log(`- Missing cleanup validation checks: ${result.latestValidation.missingCleanupFragments.length}`);
    console.log(`- Unsafe safety booleans: ${result.safetyBooleans.unsafe.length}`);
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
