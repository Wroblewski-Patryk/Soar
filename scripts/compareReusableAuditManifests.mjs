#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    base: null,
    target: null,
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
    if (arg === '--base') {
      options.base = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === '--target') {
      options.target = args[index + 1] ?? null;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run audit:manifest:compare -- --base <path> --target <path> [--json]

Compares two reusable audit manifests and reports:
- audit status changes
- summary count deltas
- open decision deltas
- safety-boundary regressions

The command exits with a non-zero code when the target manifest regresses.
`);
};

const readJson = async (relativePath) => {
  const fullPath = path.resolve(repoRoot, relativePath);
  return JSON.parse(await readFile(fullPath, 'utf8'));
};

const statusRank = (status) => {
  const value = String(status ?? '').toLowerCase();
  if (value.includes('failed')) return 4;
  if (value.includes('partial')) return 3;
  if (value.includes('deferred')) return 2;
  if (value.includes('current')) return 0;
  return 1;
};

const indexAudits = (manifest) =>
  new Map((Array.isArray(manifest.audits) ? manifest.audits : []).map((audit) => [audit.id, audit]));

const compareAudits = (baseManifest, targetManifest) => {
  const baseAudits = indexAudits(baseManifest);
  const targetAudits = indexAudits(targetManifest);
  const ids = [...new Set([...baseAudits.keys(), ...targetAudits.keys()])].sort();

  return ids.map((id) => {
    const base = baseAudits.get(id);
    const target = targetAudits.get(id);
    const baseRank = statusRank(base?.status);
    const targetRank = statusRank(target?.status);

    return {
      id,
      baseStatus: base?.status ?? null,
      targetStatus: target?.status ?? null,
      change:
        !base ? 'added' : !target ? 'missing' : base.status === target.status ? 'unchanged' : 'changed',
      regression: Boolean(!target || (base && target && targetRank > baseRank)),
      improvement: Boolean(base && target && targetRank < baseRank),
    };
  });
};

const compareSummary = (baseSummary = {}, targetSummary = {}) => {
  const keys = [...new Set([...Object.keys(baseSummary), ...Object.keys(targetSummary)])].sort();
  return keys.map((key) => {
    const base = Number(baseSummary[key] ?? 0);
    const target = Number(targetSummary[key] ?? 0);
    const delta = target - base;
    const isNegativeBucket = ['failed', 'partial', 'deferred'].some((token) =>
      key.toLowerCase().includes(token),
    );
    const isPositiveBucket = key.toLowerCase().includes('current');

    return {
      key,
      base,
      target,
      delta,
      regression: (isNegativeBucket && delta > 0) || (isPositiveBucket && delta < 0),
      improvement: (isNegativeBucket && delta < 0) || (isPositiveBucket && delta > 0),
    };
  });
};

const compareSafetyBoundaries = (baseBoundaries = {}, targetBoundaries = {}) => {
  const keys = [...new Set([...Object.keys(baseBoundaries), ...Object.keys(targetBoundaries)])].sort();
  return keys.map((key) => {
    const base = Boolean(baseBoundaries[key]);
    const target = Boolean(targetBoundaries[key]);
    return {
      key,
      base,
      target,
      regression: base === false && target === true,
      changed: base !== target,
    };
  });
};

const getDecisionIds = (manifest) =>
  new Set((Array.isArray(manifest.openDecisions) ? manifest.openDecisions : []).map((decision) => decision.id));

const compareDecisions = (baseManifest, targetManifest) => {
  const base = getDecisionIds(baseManifest);
  const target = getDecisionIds(targetManifest);
  const added = [...target].filter((id) => !base.has(id)).sort();
  const resolved = [...base].filter((id) => !target.has(id)).sort();

  return {
    baseOpen: base.size,
    targetOpen: target.size,
    added,
    resolved,
    regression: added.length > 0,
    improvement: resolved.length > 0,
  };
};

export const compareReusableAuditManifests = (baseManifest, targetManifest, options = {}) => {
  const audits = compareAudits(baseManifest, targetManifest);
  const summary = compareSummary(baseManifest.summary, targetManifest.summary);
  const safetyBoundaries = compareSafetyBoundaries(
    baseManifest.safetyBoundaries,
    targetManifest.safetyBoundaries,
  );
  const decisions = compareDecisions(baseManifest, targetManifest);

  const regressions = {
    audits: audits.filter((audit) => audit.regression),
    summary: summary.filter((item) => item.regression),
    safetyBoundaries: safetyBoundaries.filter((item) => item.regression),
    decisions: decisions.regression ? decisions.added : [],
  };

  const improvements = {
    audits: audits.filter((audit) => audit.improvement),
    summary: summary.filter((item) => item.improvement),
    decisions: decisions.improvement ? decisions.resolved : [],
  };

  return {
    base: options.base ?? null,
    target: options.target ?? null,
    status:
      regressions.audits.length === 0 &&
      regressions.summary.length === 0 &&
      regressions.safetyBoundaries.length === 0 &&
      regressions.decisions.length === 0
        ? 'PASS'
        : 'FAIL',
    audits,
    summary,
    decisions,
    safetyBoundaries,
    regressions,
    improvements,
  };
};

const main = async () => {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.base || !options.target) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const baseManifest = await readJson(options.base);
  const targetManifest = await readJson(options.target);
  const result = compareReusableAuditManifests(baseManifest, targetManifest, {
    base: options.base,
    target: options.target,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Reusable audit manifest comparison: ${result.status}`);
    console.log(`- Audit regressions: ${result.regressions.audits.length}`);
    console.log(`- Summary regressions: ${result.regressions.summary.length}`);
    console.log(`- Safety boundary regressions: ${result.regressions.safetyBoundaries.length}`);
    console.log(`- Added open decisions: ${result.regressions.decisions.length}`);
    console.log(`- Audit improvements: ${result.improvements.audits.length}`);
    console.log(`- Resolved open decisions: ${result.improvements.decisions.length}`);
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
