#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    manifest: 'docs/operations/reusable-audit-artifact-manifest-2026-05-19.json',
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
- referenced repository paths exist
- open decisions include packet and playbook links
`);
};

const isRepositoryPath = (value) =>
  typeof value === 'string' && /^(docs|\.agents|\.codex|apps|scripts)\//.test(value);

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

export const validateReusableAuditManifest = (manifest, options = {}) => {
  const exists = options.exists ?? ((relativePath) => existsSync(path.resolve(repoRoot, relativePath)));
  const audits = Array.isArray(manifest.audits) ? manifest.audits : [];
  const auditIds = new Set(audits.map((audit) => audit.id));
  const missingAuditIds = expectedAuditIds.filter((auditId) => !auditIds.has(auditId));
  const duplicateAuditIds = audits
    .map((audit) => audit.id)
    .filter((auditId, index, all) => auditId && all.indexOf(auditId) !== index);

  const paths = collectPaths(manifest);
  const missingPaths = [...paths].sort().filter((relativePath) => !exists(relativePath));

  const openDecisions = Array.isArray(manifest.openDecisions) ? manifest.openDecisions : [];
  const decisionsMissingLinks = openDecisions
    .filter((decision) => !decision.packet || !decision.playbook)
    .map((decision) => decision.id ?? 'unknown');

  return {
    manifest: options.manifestPath ?? null,
    status:
      missingAuditIds.length === 0 &&
      duplicateAuditIds.length === 0 &&
      missingPaths.length === 0 &&
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
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const result = validateReusableAuditManifest(manifest, {
    manifestPath: path.relative(repoRoot, manifestPath).split(path.sep).join('/'),
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Reusable audit manifest check: ${result.status}`);
    console.log(`- Audits: ${result.audits.found}/${result.audits.expected}`);
    console.log(`- Paths checked: ${result.paths.checked}`);
    console.log(`- Missing paths: ${result.paths.missing.length}`);
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
