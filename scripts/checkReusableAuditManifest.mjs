#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { repositoryPathExists } from './resolveRepositoryPath.mjs';

const repoRoot = process.cwd();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    manifest: 'history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json',
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
    if (arg === '--manifest') {
      options.manifest = args[index + 1] ?? options.manifest;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:manifest:check -- [--manifest <path>] [--json]

Validates a reusable audit artifact manifest by checking:
- JSON parse
- AUD-00 through AUD-23 coverage
- summary counts match audit statuses
- companion Markdown summary counts match JSON when available
- path validation metadata matches referenced paths
- required source-chain keys are present
- no unexpected source-chain keys are present
- required source-chain values are repository paths
- referenced repository paths exist
- safety-boundary booleans remain fail-closed
- open decisions include packet and playbook links
`);
};

const isRepositoryPath = (value) =>
  typeof value === 'string' && /^(docs|history|\.agents|\.codex|apps|scripts)\//.test(value);

const collectPaths = (value, paths = new Set()) => {
  if (Array.isArray(value)) {
    for (const item of value) collectPaths(item, paths);
    return paths;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectPaths(item, paths);
    return paths;
  }

  if (isRepositoryPath(value)) paths.add(value);
  return paths;
};

const expectedAuditIds = Array.from({ length: 24 }, (_, index) => `AUD-${String(index).padStart(2, '0')}`);
const requiredSourceChainKeys = [
  'registry',
  'baseline',
  'rollup',
  'rollupJson',
  'handoff',
  'handoffJson',
  'rerunPlaybook',
  'rerunPlaybookJson',
  'toolingIndex',
  'toolingIndexJson',
  'remediationPlan',
  'remediationPlanJson',
  'decisionPacket',
  'repairPlaybooks',
];
const requiredSafetyBoundaries = {
  productionDataMutation: false,
  liveOrderCancelClose: false,
  exchangeSideMutation: false,
  architectureDecisionApplied: true,
  runtimeBehaviorChanged: false,
};
const classifyAuditStatus = (status) => {
  const normalized = String(status ?? '').toLowerCase();
  if (normalized.startsWith('deferred')) return 'deferred';
  if (normalized.startsWith('partial')) return 'partial';
  if (normalized.startsWith('failed') || normalized.startsWith('decision required')) return 'failedDecisionRequired';
  return 'currentOrCurrentLocal';
};

export const validateReusableAuditManifest = (manifest, options = {}) => {
  const exists = options.exists ?? ((relativePath) => repositoryPathExists(repoRoot, relativePath));
  const markdownText = typeof options.markdownText === 'string' ? options.markdownText : null;
  const audits = Array.isArray(manifest.audits) ? manifest.audits : [];
  const auditIds = new Set(audits.map((audit) => audit.id));
  const missingAuditIds = expectedAuditIds.filter((auditId) => !auditIds.has(auditId));
  const duplicateAuditIds = audits
    .map((audit) => audit.id)
    .filter((auditId, index, all) => auditId && all.indexOf(auditId) !== index);

  const paths = collectPaths(manifest);
  const sourceChain = manifest.sourceChain ?? {};
  const missingSourceChainKeys = requiredSourceChainKeys.filter((key) => !(key in sourceChain));
  const unexpectedSourceChainKeys = Object.keys(sourceChain).filter((key) => !requiredSourceChainKeys.includes(key));
  const invalidSourceChainPaths = requiredSourceChainKeys
    .filter((key) => key in sourceChain && !isRepositoryPath(sourceChain[key]))
    .map((key) => ({ key, value: sourceChain[key] ?? null }));
  const missingPaths = [...paths].sort().filter((relativePath) => !exists(relativePath));
  const computedSummary = audits.reduce(
    (summary, audit) => {
      const bucket = classifyAuditStatus(audit.status);
      summary[bucket] += 1;
      return summary;
    },
    {
      currentOrCurrentLocal: 0,
      partial: 0,
      failedDecisionRequired: 0,
      deferred: 0,
    },
  );
  const declaredSummary = manifest.summary ?? {};
  const summaryMismatches = Object.entries(computedSummary)
    .filter(([key, value]) => declaredSummary[key] !== undefined && declaredSummary[key] !== value)
    .map(([key, actual]) => ({ key, declared: declaredSummary[key], actual }));
  const markdownSummaryLabels = {
    currentOrCurrentLocal: 'Current/current-local',
    partial: 'Partial',
    failedDecisionRequired: 'Failed decision-required',
    deferred: 'Deferred',
  };
  const markdownSummaryMismatches =
    markdownText === null
      ? []
      : Object.entries(markdownSummaryLabels)
          .filter(([key, label]) => {
            const expected = declaredSummary[key];
            return expected !== undefined && !markdownText.includes(`- ${label}: \`${expected}\``);
          })
          .map(([key]) => ({ key, declared: declaredSummary[key] }));
  const manifestValidation = manifest.manifestValidation ?? {};
  const manifestValidationMismatches = [];
  if (manifestValidation.pathExistenceChecked !== undefined && manifestValidation.pathExistenceChecked !== true) {
    manifestValidationMismatches.push({
      key: 'pathExistenceChecked',
      declared: manifestValidation.pathExistenceChecked,
      actual: true,
    });
  }
  if (manifestValidation.pathsChecked !== undefined && manifestValidation.pathsChecked !== paths.size) {
    manifestValidationMismatches.push({
      key: 'pathsChecked',
      declared: manifestValidation.pathsChecked,
      actual: paths.size,
    });
  }
  if (manifestValidation.missingPaths !== undefined && manifestValidation.missingPaths !== missingPaths.length) {
    manifestValidationMismatches.push({
      key: 'missingPaths',
      declared: manifestValidation.missingPaths,
      actual: missingPaths.length,
    });
  }

  const safetyBoundaries = manifest.safetyBoundaries ?? {};
  const safetyBoundaryMismatches = Object.entries(requiredSafetyBoundaries)
    .filter(([key, expected]) => safetyBoundaries[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: safetyBoundaries[key] ?? null }));

  const openDecisions = Array.isArray(manifest.openDecisions) ? manifest.openDecisions : [];
  const decisionsMissingLinks = openDecisions
    .filter((decision) => !decision.packet || !decision.playbook)
    .map((decision) => decision.id ?? 'unknown');

  return {
    manifest: options.manifestPath ?? null,
    status:
      missingAuditIds.length === 0 &&
      duplicateAuditIds.length === 0 &&
      missingSourceChainKeys.length === 0 &&
      unexpectedSourceChainKeys.length === 0 &&
      invalidSourceChainPaths.length === 0 &&
      missingPaths.length === 0 &&
      summaryMismatches.length === 0 &&
      markdownSummaryMismatches.length === 0 &&
      manifestValidationMismatches.length === 0 &&
      safetyBoundaryMismatches.length === 0 &&
      decisionsMissingLinks.length === 0
        ? 'PASS'
        : 'FAIL',
    audits: {
      expected: expectedAuditIds.length,
      found: auditIds.size,
      missing: missingAuditIds,
      duplicates: [...new Set(duplicateAuditIds)],
    },
    paths: {
      checked: paths.size,
      missing: missingPaths,
    },
    sourceChain: {
      expectedKeys: requiredSourceChainKeys.length,
      foundKeys: Object.keys(sourceChain).length,
      missingKeys: missingSourceChainKeys,
      unexpectedKeys: unexpectedSourceChainKeys,
      invalidPaths: invalidSourceChainPaths,
    },
    summary: {
      computed: computedSummary,
      mismatches: summaryMismatches,
      markdownMismatches: markdownSummaryMismatches,
    },
    manifestValidation: {
      mismatches: manifestValidationMismatches,
    },
    safetyBoundaries: {
      mismatches: safetyBoundaryMismatches,
    },
    decisions: {
      open: openDecisions.length,
      missingLinks: decisionsMissingLinks,
    },
  };
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const manifestPath = path.resolve(repoRoot, options.manifest);
  const markdownPath = manifestPath.endsWith('.json') ? manifestPath.replace(/\.json$/, '.md') : null;
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const markdownText = markdownPath && existsSync(markdownPath) ? await readFile(markdownPath, 'utf8') : null;
  const result = validateReusableAuditManifest(manifest, {
    manifestPath: path.relative(repoRoot, manifestPath).split(path.sep).join('/'),
    markdownText,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Reusable audit manifest check: ${result.status}`);
    console.log(`- Audits: ${result.audits.found}/${result.audits.expected}`);
    console.log(`- Paths checked: ${result.paths.checked}`);
    console.log(`- Source chain keys: ${result.sourceChain.foundKeys}/${result.sourceChain.expectedKeys}`);
    console.log(`- Missing source chain keys: ${result.sourceChain.missingKeys.length}`);
    console.log(`- Unexpected source chain keys: ${result.sourceChain.unexpectedKeys.length}`);
    console.log(`- Invalid source chain paths: ${result.sourceChain.invalidPaths.length}`);
    console.log(`- Missing paths: ${result.paths.missing.length}`);
    console.log(`- Summary mismatches: ${result.summary.mismatches.length}`);
    console.log(`- Markdown summary mismatches: ${result.summary.markdownMismatches.length}`);
    console.log(`- Manifest validation metadata mismatches: ${result.manifestValidation.mismatches.length}`);
    console.log(`- Safety boundary mismatches: ${result.safetyBoundaries.mismatches.length}`);
    console.log(`- Open decisions: ${result.decisions.open}`);
    console.log(`- Decisions missing packet/playbook links: ${result.decisions.missingLinks.length}`);
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
