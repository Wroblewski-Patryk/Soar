#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export const resolveDocsRoot = (deps = {}) => {
  const { cwd = process.cwd(), existsSyncImpl = existsSync } = deps;
  const repoRoot = cwd;
  const docsRoot = path.resolve(repoRoot, 'docs');
  const migratedDocsRoot = path.resolve(repoRoot, 'docs');
  if (existsSyncImpl(path.join(docsRoot, 'operations')) || !existsSyncImpl(migratedDocsRoot)) {
    return docsRoot;
  }
  return migratedDocsRoot;
};

export const parseArgs = (argv = process.argv.slice(2), deps = {}) => {
  const { cwd = process.cwd(), docsRoot = resolveDocsRoot({ cwd }) } = deps;
  const operationsDir = path.join(docsRoot, 'operations');
  const args = argv;
  const options = {
    statusPath: path.join(operationsDir, 'v1-rc-external-gates-status.md'),
    evidencePath: path.join(cwd, 'history', 'operations', '_artifacts-rc-evidence-check-latest.json'),
    json: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--status-path') options.statusPath = args[index + 1] ?? options.statusPath;
    if (arg === '--evidence-path') options.evidencePath = args[index + 1] ?? options.evidencePath;
    if (arg === '--json') options.json = true;
  }

  options.statusPath = path.resolve(cwd, options.statusPath);
  options.evidencePath = path.resolve(cwd, options.evidencePath);
  return options;
};

export const parseGateLabel = (rawStatus, gateNumber) => {
  const regex = new RegExp(`- Gate ${gateNumber} \\(.+?\\):\\s*([^\\r\\n]+)`, 'i');
  return rawStatus.match(regex)?.[1]?.trim() ?? 'UNKNOWN';
};

export const parseStatusGeneratedAt = (rawStatus) =>
  rawStatus.match(/Generated at \(UTC\):\s*([^\r\n]+)/i)?.[1]?.trim() ?? null;

export const asIsoTimestamp = (value) => {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const main = async (deps = {}) => {
  const {
    argv = process.argv.slice(2),
    consoleImpl = console,
    exit = process.exit,
    now = () => new Date(),
    parseArgsFn = parseArgs,
    readFileImpl = readFile,
  } = deps;

  const options = parseArgsFn(argv, deps);
  if (options.help) {
    consoleImpl.log(
      'Usage: node scripts/summarizeRcGates.mjs [--status-path <file>] [--evidence-path <file>] [--json]'
    );
    exit(0);
    return { status: 0, help: true };
  }

  const rawStatus = await readFileImpl(options.statusPath, 'utf8');
  let evidence = null;
  try {
    const rawEvidence = await readFileImpl(options.evidencePath, 'utf8');
    evidence = JSON.parse(rawEvidence);
  } catch {
    evidence = null;
  }

  const gates = {
    gate1: parseGateLabel(rawStatus, 1),
    gate2: parseGateLabel(rawStatus, 2),
    gate3: parseGateLabel(rawStatus, 3),
    gate4: parseGateLabel(rawStatus, 4),
  };
  const statusGeneratedAt = parseStatusGeneratedAt(rawStatus);
  const evidenceGeneratedAt = evidence?.generatedAt ?? null;
  const evidenceIsStaleRelativeToStatus =
    asIsoTimestamp(statusGeneratedAt) != null &&
    asIsoTimestamp(evidenceGeneratedAt) != null &&
    asIsoTimestamp(evidenceGeneratedAt) < asIsoTimestamp(statusGeneratedAt);

  const summary = {
    generatedAt: now().toISOString(),
    gates,
    missingEvidenceCount: Number.isFinite(evidence?.counts?.missing) ? evidence.counts.missing : null,
    strictPassed: evidence ? Boolean(evidence.strictPassed) : null,
    gate2Policy: typeof evidence?.gate2Policy === 'string' ? evidence.gate2Policy : null,
    statusGeneratedAt,
    evidenceGeneratedAt: evidence?.generatedAt ?? null,
    evidenceFreshness: evidence
      ? evidenceIsStaleRelativeToStatus
        ? 'stale_relative_to_status'
        : 'current_or_unknown'
      : 'missing',
  };

  if (options.json) {
    consoleImpl.log(JSON.stringify(summary, null, 2));
    return { status: 0, summary };
  }

  consoleImpl.log('# RC Gates Summary');
  consoleImpl.log(`- Gate 1: ${summary.gates.gate1}`);
  consoleImpl.log(`- Gate 2: ${summary.gates.gate2}`);
  consoleImpl.log(`- Gate 3: ${summary.gates.gate3}`);
  consoleImpl.log(`- Gate 4: ${summary.gates.gate4}`);
  consoleImpl.log(`- Missing evidence: ${summary.missingEvidenceCount ?? 'n/a'}`);
  consoleImpl.log(
    `- Strict passed: ${summary.strictPassed == null ? 'n/a' : summary.strictPassed ? 'yes' : 'no'}`
  );
  consoleImpl.log(`- Gate2 policy: ${summary.gate2Policy ?? 'n/a'}`);
  consoleImpl.log(`- Status generated at: ${summary.statusGeneratedAt ?? 'n/a'}`);
  consoleImpl.log(`- Evidence generated at: ${summary.evidenceGeneratedAt ?? 'n/a'}`);
  consoleImpl.log(`- Evidence freshness: ${summary.evidenceFreshness}`);
  return { status: 0, summary };
};

if (isDirectRun()) main().catch((error) => {
  console.error('[ops:rc:gates:summary] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
