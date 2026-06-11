#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
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
    signoffPath: path.join(operationsDir, 'v1-rc-signoff-record.md'),
    checklistPath: path.join(operationsDir, 'v1-release-candidate-checklist.md'),
    today: '',
    expectedSha: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--status-path') options.statusPath = args[index + 1] ?? options.statusPath;
    if (arg === '--signoff-path') options.signoffPath = args[index + 1] ?? options.signoffPath;
    if (arg === '--checklist-path') options.checklistPath = args[index + 1] ?? options.checklistPath;
    if (arg === '--today') options.today = args[index + 1] ?? options.today;
    if (arg === '--expected-sha') options.expectedSha = args[index + 1] ?? options.expectedSha;
  }

  options.statusPath = path.resolve(cwd, options.statusPath);
  options.signoffPath = path.resolve(cwd, options.signoffPath);
  options.checklistPath = path.resolve(cwd, options.checklistPath);
  return options;
};

export const resolveDate = (today) => {
  const normalized = String(today ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  return new Date().toISOString().slice(0, 10);
};

export const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getGateLabel = (rawStatus, gateNumber) => {
  const regex = new RegExp(`- Gate ${gateNumber} \\(.+?\\):\\s*([^\\r\\n]+)`, 'i');
  const match = rawStatus.match(regex);
  return match?.[1]?.trim().toUpperCase() ?? 'OPEN';
};

export const refreshLatestVerificationDate = (rawChecklist, isoDate) =>
  rawChecklist.replace(/### Latest Verification \(\d{4}-\d{2}-\d{2}\)/, `### Latest Verification (${isoDate})`);

export const refreshOutstandingExternalGates = (rawChecklist, isoDate, gate1, gate2, gate3, gate4) =>
  rawChecklist
    .replace(/## Outstanding External Gates \(\d{4}-\d{2}-\d{2}\)/, `## Outstanding External Gates (${isoDate})`)
    .replace(
      /- .*snapshot is `G1=.*$/m,
      `- current snapshot is \`G1=${gate1}\`, \`G2=${gate2}\`, \`G3=${gate3}\`, \`G4=${gate4}\` (synced ${isoDate}).`
    );

export const refreshExpectedSha = (rawChecklist, expectedSha) => {
  const value = expectedSha || 'not provided';
  if (/^Expected SHA:\s*`?.+?`?\s*$/m.test(rawChecklist)) {
    return rawChecklist.replace(/^Expected SHA:\s*`?.+?`?\s*$/m, `Expected SHA: \`${value}\``);
  }
  return rawChecklist.replace(
    /(### Latest Verification \(\d{4}-\d{2}-\d{2}\)\r?\n)/,
    `$1Expected SHA: \`${value}\`\n`
  );
};

export const extractValueAfterLabel = (raw, label) => {
  const regex = new RegExp(`^\\s*${escapeRegExp(label)}\\s*(.*)$`, 'im');
  const match = raw.match(regex);
  return match?.[1]?.trim() ?? '';
};

export const parseSignoff = (rawSignoff) => {
  const engineeringBlockMatch = rawSignoff.match(/- Engineering sign-off:[\s\S]*?^\s*- Name:[ \t]*(.*)$/im);
  const productBlockMatch = rawSignoff.match(/- Product sign-off:[\s\S]*?^\s*- Name:[ \t]*(.*)$/im);
  const operationsBlockMatch = rawSignoff.match(/- Operations sign-off:[\s\S]*?^\s*- Name:[ \t]*(.*)$/im);
  const ownerBlockMatch = rawSignoff.match(/- RC owner with rollback authority:[\s\S]*?^\s*- Name:[ \t]*(.*)$/im);

  return {
    engineeringSigned: (engineeringBlockMatch?.[1]?.trim() ?? '').length > 0,
    productSigned: (productBlockMatch?.[1]?.trim() ?? '').length > 0,
    operationsSigned: (operationsBlockMatch?.[1]?.trim() ?? '').length > 0,
    ownerAssigned: (ownerBlockMatch?.[1]?.trim() ?? '').length > 0,
  };
};

export const setChecklistCheckbox = (rawChecklist, label, checked) => {
  const regex = new RegExp(`^- \\[[ x]\\] ${escapeRegExp(label)}$`, 'm');
  const replacement = `- [${checked ? 'x' : ' '}] ${label}`;
  return rawChecklist.replace(regex, replacement);
};

export const main = async (deps = {}) => {
  const {
    argv = process.argv.slice(2),
    consoleImpl = console,
    exit = process.exit,
    parseArgsFn = parseArgs,
    readFileImpl = readFile,
    writeFileImpl = writeFile,
  } = deps;

  const options = parseArgsFn(argv, deps);
  if (options.help) {
    consoleImpl.log(
      'Usage: node scripts/syncRcChecklistFromGateStatus.mjs [--status-path <file>] [--signoff-path <file>] [--checklist-path <file>] [--today <yyyy-mm-dd>]'
    );
    exit(0);
    return { status: 0, help: true };
  }

  const [rawStatus, rawSignoff, rawChecklist] = await Promise.all([
    readFileImpl(options.statusPath, 'utf8'),
    readFileImpl(options.signoffPath, 'utf8'),
    readFileImpl(options.checklistPath, 'utf8'),
  ]);

  const gate1 = getGateLabel(rawStatus, 1);
  const gate2 = getGateLabel(rawStatus, 2);
  const gate3 = getGateLabel(rawStatus, 3);
  const gate4 = getGateLabel(rawStatus, 4);
  const signoff = parseSignoff(rawSignoff);
  const isoDate = resolveDate(options.today);

  let nextChecklist = rawChecklist;
  nextChecklist = refreshLatestVerificationDate(nextChecklist, isoDate);
  nextChecklist = refreshExpectedSha(nextChecklist, options.expectedSha);
  nextChecklist = refreshOutstandingExternalGates(nextChecklist, isoDate, gate1, gate2, gate3, gate4);
  nextChecklist = setChecklistCheckbox(nextChecklist, 'Queue lag metrics reviewed and within baseline.', gate2 === 'PASS');
  nextChecklist = setChecklistCheckbox(
    nextChecklist,
    'Incident contacts and escalation chain confirmed.',
    gate3 === 'PASS'
  );
  nextChecklist = setChecklistCheckbox(nextChecklist, 'Backup snapshot created and restore path validated.', gate1 === 'PASS');
  nextChecklist = setChecklistCheckbox(nextChecklist, 'Engineering sign-off.', signoff.engineeringSigned);
  nextChecklist = setChecklistCheckbox(nextChecklist, 'Product sign-off.', signoff.productSigned);
  nextChecklist = setChecklistCheckbox(nextChecklist, 'Operations sign-off.', signoff.operationsSigned);
  nextChecklist = setChecklistCheckbox(nextChecklist, 'RC owner assigned with rollback authority.', signoff.ownerAssigned);

  await writeFileImpl(options.checklistPath, nextChecklist);
  consoleImpl.log(`RC checklist synced from gate status: ${path.relative(process.cwd(), options.checklistPath)}`);
  return { status: 0, checklistPath: options.checklistPath, nextChecklist };
};

if (isDirectRun()) main().catch((error) => {
  console.error('[ops:rc:checklist:sync] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
