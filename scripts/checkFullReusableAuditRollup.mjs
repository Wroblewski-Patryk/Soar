#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const expectedAuditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);
const requiredPathKeys = [
  'decisionPacket',
  'decisionRepairPlaybooks',
  'handoff',
  'handoffJson',
  'artifactManifest',
  'artifactManifestJson',
];
const requiredRepairQueueFragments = [
  'AUD-19 fresh production release gate',
  'hot-path assistant orchestration',
  'Gate.io production/live proof',
];
const falseSafetyBooleans = [
  'productionMutation',
  'liveOrderCancelClose',
  'exchangeSideMutation',
  'existingProductionDataMutation',
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    rollup: 'docs/operations/full-reusable-audit-rollup-2026-05-19.json',
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
    if (arg === '--rollup') {
      options.rollup = args[index + 1] ?? options.rollup;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:rollup:check -- [--rollup <path>] [--json]

Validates the full reusable audit rollup JSON by checking:
- AUD-00 through AUD-23 coverage
- summary counts match audit statuses
- referenced rollup paths exist
- required repair queue items remain present
- production/LIVE/exchange mutation safety booleans remain false
`);
};

const defaultExists = (relativePath) => existsSync(path.resolve(repoRoot, relativePath));
const classifyAuditStatus = (status) => {
  const normalized = String(status ?? '').toLowerCase();
  if (normalized.startsWith('deferred')) return 'deferred';
  if (normalized.startsWith('partial')) return 'partial';
  if (normalized.startsWith('failed') || normalized.startsWith('decision required')) {
    return 'failedDecisionRequired';
  }
  return 'currentOrCurrentLocal';
};

export const validateFullReusableAuditRollup = (rollup, options = {}) => {
  const exists = options.exists ?? defaultExists;
  const audits = Array.isArray(rollup.audits) ? rollup.audits : [];
  const auditIds = audits.map((audit) => audit.id).filter(Boolean);
  const auditIdSet = new Set(auditIds);
  const missingAuditIds = expectedAuditIds.filter((auditId) => !auditIdSet.has(auditId));
  const duplicateAuditIds = auditIds.filter((auditId, index, all) => all.indexOf(auditId) !== index);
  const computedSummary = audits.reduce(
    (summary, audit) => {
      summary[classifyAuditStatus(audit.status)] += 1;
      return summary;
    },
    {
      currentOrCurrentLocal: 0,
      partial: 0,
      failedDecisionRequired: 0,
      deferred: 0,
    },
  );
  const declaredSummary = rollup.summary ?? {};
  const summaryMismatches = Object.entries(computedSummary)
    .filter(([key, value]) => declaredSummary[key] !== undefined && declaredSummary[key] !== value)
    .map(([key, actual]) => ({ key, declared: declaredSummary[key], actual }));

  const missingPathKeys = requiredPathKeys.filter((key) => !(key in rollup));
  const missingPaths = requiredPathKeys
    .filter((key) => typeof rollup[key] === 'string' && !exists(rollup[key]))
    .map((key) => ({ key, path: rollup[key] }));

  const repairQueue = Array.isArray(rollup.priorityRepairQueue) ? rollup.priorityRepairQueue : [];
  const missingRepairQueueFragments = requiredRepairQueueFragments.filter(
    (fragment) => !repairQueue.some((entry) => String(entry).includes(fragment)),
  );
  const unsafeSafetyBooleans = falseSafetyBooleans.filter((key) => rollup[key] !== false);

  const result = {
    rollup: options.rollupPath ?? null,
    status: 'PASS',
    audits: {
      expected: expectedAuditIds.length,
      found: auditIdSet.size,
      missing: missingAuditIds,
      duplicates: [...new Set(duplicateAuditIds)],
    },
    summary: {
      computed: computedSummary,
      mismatches: summaryMismatches,
    },
    paths: {
      missingKeys: missingPathKeys,
      missing: missingPaths,
    },
    repairQueue: {
      missingFragments: missingRepairQueueFragments,
    },
    safetyBooleans: {
      unsafe: unsafeSafetyBooleans,
    },
  };

  result.status =
    result.audits.missing.length === 0 &&
    result.audits.duplicates.length === 0 &&
    result.summary.mismatches.length === 0 &&
    result.paths.missingKeys.length === 0 &&
    result.paths.missing.length === 0 &&
    result.repairQueue.missingFragments.length === 0 &&
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

  const rollupPath = path.resolve(repoRoot, options.rollup);
  const rollup = JSON.parse(await readFile(rollupPath, 'utf8'));
  const result = validateFullReusableAuditRollup(rollup, {
    rollupPath: path.relative(repoRoot, rollupPath).split(path.sep).join('/'),
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Full reusable audit rollup check: ${result.status}`);
    console.log(`- Audits: ${result.audits.found}/${result.audits.expected}`);
    console.log(`- Summary mismatches: ${result.summary.mismatches.length}`);
    console.log(`- Missing path keys: ${result.paths.missingKeys.length}`);
    console.log(`- Missing paths: ${result.paths.missing.length}`);
    console.log(`- Missing repair queue items: ${result.repairQueue.missingFragments.length}`);
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
