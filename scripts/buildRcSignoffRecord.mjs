#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
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
    releaseTarget: 'v1.0.0',
    statusPath: path.join(operationsDir, 'v1-rc-external-gates-status.md'),
    output: path.join(operationsDir, 'v1-rc-signoff-record.md'),
    engineeringName: '',
    productName: '',
    operationsName: '',
    ownerName: '',
    ownerContact: '',
    today: '',
    expectedSha: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--release-target') options.releaseTarget = args[index + 1] ?? options.releaseTarget;
    if (arg === '--status-path') options.statusPath = args[index + 1] ?? options.statusPath;
    if (arg === '--output') options.output = args[index + 1] ?? options.output;
    if (arg === '--engineering-name') options.engineeringName = args[index + 1] ?? options.engineeringName;
    if (arg === '--product-name') options.productName = args[index + 1] ?? options.productName;
    if (arg === '--operations-name') options.operationsName = args[index + 1] ?? options.operationsName;
    if (arg === '--owner-name') options.ownerName = args[index + 1] ?? options.ownerName;
    if (arg === '--owner-contact') options.ownerContact = args[index + 1] ?? options.ownerContact;
    if (arg === '--today') options.today = args[index + 1] ?? options.today;
    if (arg === '--expected-sha') options.expectedSha = args[index + 1] ?? options.expectedSha;
  }

  options.statusPath = path.resolve(process.cwd(), options.statusPath);
  options.output = path.resolve(process.cwd(), options.output);
  return options;
};

const resolveTimestamp = (today) => {
  const normalized = String(today ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized}T00:00:00.000Z`;
  return new Date().toISOString();
};

const parseGateLine = (line) => {
  const match = line.match(/^- Gate \d+ \(.+?\):\s+(.+)$/i);
  const rawValue = match?.[1]?.trim().toUpperCase() ?? '';
  if (!rawValue) return null;
  if (rawValue.startsWith('PASS')) return 'PASS';
  if (rawValue.startsWith('OPEN')) return 'OPEN';
  if (rawValue.startsWith('BLOCKED')) return 'BLOCKED';
  if (rawValue.startsWith('LOCAL_PASS')) return 'LOCAL_PASS';
  return rawValue.split(/\s+/)[0] || null;
};

const loadGateStatuses = async (statusPath) => {
  const raw = await readFile(statusPath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const statuses = lines.map(parseGateLine).filter(Boolean);
  return {
    statuses,
    allPass: statuses.length === 4 && statuses.every((status) => status === 'PASS'),
  };
};

const approvalLine = (role, name, timestamp) => {
  if (!name) {
    return `- ${role} sign-off:\n  - Name:\n  - UTC timestamp:\n  - Notes:`;
  }
  return `- ${role} sign-off:\n  - Name: ${name}\n  - UTC timestamp: ${timestamp}\n  - Notes: approved via scripted record build`;
};

const ownerBlock = (name, contact, timestamp) => {
  if (!name) {
    return `- RC owner with rollback authority:\n  - Name:\n  - Contact:\n  - UTC assignment timestamp:`;
  }
  return `- RC owner with rollback authority:\n  - Name: ${name}\n  - Contact: ${contact || 'TBD'}\n  - UTC assignment timestamp: ${timestamp}`;
};

const listMissingApproverFields = (options) => {
  const missing = [];
  if (!options.engineeringName) missing.push('Engineering name (--engineering-name)');
  if (!options.productName) missing.push('Product name (--product-name)');
  if (!options.operationsName) missing.push('Operations name (--operations-name)');
  if (!options.ownerName) missing.push('RC owner name (--owner-name)');
  return missing;
};

const listRecommendedSignoffFields = (options) => {
  const missing = [];
  if (!options.ownerContact) missing.push('RC owner contact (--owner-contact)');
  return missing;
};

const evaluateSignoff = (options, gates) => {
  const missingApproverFields = listMissingApproverFields(options);
  const prerequisiteGatesPass =
    gates.statuses.length >= 3 && gates.statuses.slice(0, 3).every((status) => status === 'PASS');
  return {
    prerequisiteGatesPass,
    missingApproverFields,
    missingRecommendedFields: listRecommendedSignoffFields(options),
    rcStatus: prerequisiteGatesPass && missingApproverFields.length === 0 ? 'APPROVED' : 'BLOCKED',
  };
};

const render = (options, gates) => {
  // Gate 4 is the formal sign-off itself, so approval depends on Gates 1-3
  // plus the required approver fields, not on a pre-existing Gate 4 PASS.
  const evaluation = evaluateSignoff(options, gates);
  const timestamp = resolveTimestamp(options.today);

  return `# V1 RC Sign-Off Record

Release target: \`${options.releaseTarget}\`  
Date (UTC): \`${timestamp}\`
Expected SHA: \`${options.expectedSha || 'not provided'}\`

## Gate Evidence References
- RC checklist: \`docs/operations/v1-release-candidate-checklist.md\`
- External gates runbook: \`docs/operations/v1-rc-external-gates-runbook.md\`
- External gates status source: \`${path.relative(process.cwd(), options.statusPath)}\`

## Sign-Offs
${approvalLine('Engineering', options.engineeringName, timestamp)}
${approvalLine('Product', options.productName, timestamp)}
${approvalLine('Operations', options.operationsName, timestamp)}

## RC Ownership
${ownerBlock(options.ownerName, options.ownerContact, timestamp)}

## Gate Snapshot at Sign-Off Build
- Gate statuses found: ${gates.statuses.length}
- Gate values: ${gates.statuses.length > 0 ? gates.statuses.join(', ') : 'n/a'}
- Gates 1-3 pass: ${evaluation.prerequisiteGatesPass ? 'yes' : 'no'}

## Final Decision
- RC status: \`${evaluation.rcStatus}\`
- Blocking reasons (if any): ${evaluation.rcStatus === 'BLOCKED' ? 'missing gate pass and/or required approvers' : 'none'}
- Follow-up actions:
  - If BLOCKED: complete open gates and rerun \`pnpm run ops:rc:signoff:build\`.
  - If APPROVED: copy this record into release notes and finalize launch trigger.
`;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    console.log(
      'Usage: node scripts/buildRcSignoffRecord.mjs [--release-target <v>] [--status-path <file>] [--output <file>] [--engineering-name <name>] [--product-name <name>] [--operations-name <name>] [--owner-name <name>] [--owner-contact <contact>] [--today <yyyy-mm-dd>]'
    );
    process.exit(0);
  }

  const gates = await loadGateStatuses(options.statusPath);
  const content = render(options, gates);
  await writeFile(options.output, content);
  const evaluation = evaluateSignoff(options, gates);
  console.log(`RC sign-off record written to: ${path.relative(process.cwd(), options.output)}`);
  console.log(`RC status: ${evaluation.rcStatus}`);
  if (!evaluation.prerequisiteGatesPass) {
    console.log('Gate prerequisite blocker: Gates 1-3 are not all PASS.');
  }
  if (evaluation.missingApproverFields.length > 0) {
    console.log(`Missing Gate 4 fields: ${evaluation.missingApproverFields.join(', ')}`);
  }
  if (evaluation.missingRecommendedFields.length > 0) {
    console.log(`Recommended Gate 4 fields: ${evaluation.missingRecommendedFields.join(', ')}`);
  }
};

main().catch((error) => {
  console.error('[ops:rc:signoff:build] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
