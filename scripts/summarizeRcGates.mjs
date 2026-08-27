#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const resolveDocsRoot = () => {
  const docsRoot = path.resolve(repoRoot, 'docs');
  const migratedDocsRoot = path.resolve(repoRoot, 'docs');
  if (existsSync(path.join(docsRoot, 'operations')) || !existsSync(migratedDocsRoot)) {
    return docsRoot;
  }
  return migratedDocsRoot;
};

const operationsDir = path.join(resolveDocsRoot(), 'operations');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    statusPath: path.join(operationsDir, 'v1-rc-external-gates-status.md'),
    evidencePath: path.join(process.cwd(), 'history', 'operations', '_artifacts-rc-evidence-check-latest.json'),
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

  options.statusPath = path.resolve(process.cwd(), options.statusPath);
  options.evidencePath = path.resolve(process.cwd(), options.evidencePath);
  return options;
};

const parseGateLabel = (rawStatus, gateNumber) => {
  const regex = new RegExp(`- Gate ${gateNumber} \\(.+?\\):\\s*([^\\r\\n]+)`, 'i');
  return rawStatus.match(regex)?.[1]?.trim() ?? 'UNKNOWN';
};

const parseStatusGeneratedAt = (rawStatus) =>
  rawStatus.match(/Generated at \(UTC\):\s*([^\r\n]+)/i)?.[1]?.trim() ?? null;

const asIsoTimestamp = (value) => {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    console.log(
      'Usage: node scripts/summarizeRcGates.mjs [--status-path <file>] [--evidence-path <file>] [--json]'
    );
    process.exit(0);
  }

  const rawStatus = await readFile(options.statusPath, 'utf8');
  let evidence = null;
  try {
    const rawEvidence = await readFile(options.evidencePath, 'utf8');
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
    generatedAt: new Date().toISOString(),
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
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log('# RC Gates Summary');
  console.log(`- Gate 1: ${summary.gates.gate1}`);
  console.log(`- Gate 2: ${summary.gates.gate2}`);
  console.log(`- Gate 3: ${summary.gates.gate3}`);
  console.log(`- Gate 4: ${summary.gates.gate4}`);
  console.log(`- Missing evidence: ${summary.missingEvidenceCount ?? 'n/a'}`);
  console.log(
    `- Strict passed: ${summary.strictPassed == null ? 'n/a' : summary.strictPassed ? 'yes' : 'no'}`
  );
  console.log(`- Gate2 policy: ${summary.gate2Policy ?? 'n/a'}`);
  console.log(`- Status generated at: ${summary.statusGeneratedAt ?? 'n/a'}`);
  console.log(`- Evidence generated at: ${summary.evidenceGeneratedAt ?? 'n/a'}`);
  console.log(`- Evidence freshness: ${summary.evidenceFreshness}`);
};

main().catch((error) => {
  console.error('[ops:rc:gates:summary] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
