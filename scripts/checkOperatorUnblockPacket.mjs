#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();

const requiredEvidenceKeys = ['preflight', 'preflightJson', 'protectedInputReadiness', 'protectedInputReadinessJson'];
const requiredInputFragments = [
  'LIVEIMPORT_READBACK_AUTH_TOKEN',
  'ROLLBACK_GUARD_AUTH_TOKEN',
  'PROD_UI_AUDIT_AUTH_TOKEN',
  'PROD_UI_AUDIT_ADMIN_TOKEN',
  'PROD_DB_CHECK_CONTAINER',
  'Engineering/Product/Operations/RC owner names',
];
const requiredProofStepFragments = [
  'no-secret final preflight',
  'protected input readiness sweep',
  'build-info wait',
  'production DB restore drill PASS',
  'LIVEIMPORT-03 protected runtime readback',
  'rollback proof PASS',
  'Gate 2 production SLO evidence PASS',
  'Gate 4 sign-off APPROVED',
  'strict RC evidence check PASS',
  'production UI clickthrough PASS',
  'final release gate ready',
  'generated V1 state refresh',
];
const requiredForbiddenFragments = [
  'production data mutation',
  'LIVE order submit/cancel/close',
  'exchange-side mutation',
  'existing production data mutation',
  'substituting public smoke for protected proof',
];
const requiredAcceptanceFragments = [
  'Final release gate ready',
  'same-date protected',
  'redacted',
  'secret-free evidence',
  'deployed target',
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    packet: 'history/artifacts/v1-operator-unblock-packet-dd1a1faf-2026-05-20.json',
    expectedSha: '',
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
    if (arg === '--packet') {
      options.packet = args[index + 1] ?? options.packet;
      index += 1;
      continue;
    }
    if (arg === '--expected-sha') {
      options.expectedSha = args[index + 1] ?? options.expectedSha;
      index += 1;
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: pnpm run ops:operator-unblock:check -- [--packet <path>] [--expected-sha <sha>] [--json]

Validates a no-secret V1 operator unblock packet by checking:
- target SHA and NO-GO status are explicit
- required evidence paths are present and resolvable
- required protected input families are named without values
- remaining proof steps, forbidden boundaries, and acceptance rule are present
- protected input readiness remains explicit
`);
};

const pathExists = (relativePath) => existsSync(path.resolve(repoRoot, relativePath));
const hasFragment = (entries, fragment) => entries.some((entry) => String(entry).includes(fragment));

export const validateOperatorUnblockPacket = (packet, options = {}) => {
  const exists = options.exists ?? pathExists;
  const expectedSha = options.expectedSha ?? '';
  const evidence = packet.evidence ?? {};
  const requiredInputs = Array.isArray(packet.requiredInputs) ? packet.requiredInputs : [];
  const remainingProofSteps = Array.isArray(packet.remainingProofSteps) ? packet.remainingProofSteps : [];
  const forbiddenWithoutApproval = Array.isArray(packet.forbiddenWithoutExplicitApproval)
    ? packet.forbiddenWithoutExplicitApproval
    : [];
  const acceptanceRule = String(packet.acceptanceRule ?? '');

  const missingEvidenceKeys = requiredEvidenceKeys.filter((key) => !(key in evidence));
  const missingEvidencePaths = Object.entries(evidence)
    .filter(([, relativePath]) => typeof relativePath === 'string' && !exists(relativePath))
    .map(([key, relativePath]) => ({ key, path: relativePath }))
    .sort((left, right) => left.key.localeCompare(right.key));
  const missingInputFragments = requiredInputFragments.filter(
    (fragment) => !hasFragment(requiredInputs, fragment),
  );
  const missingProofStepFragments = requiredProofStepFragments.filter(
    (fragment) => !hasFragment(remainingProofSteps, fragment),
  );
  const missingForbiddenFragments = requiredForbiddenFragments.filter(
    (fragment) => !hasFragment(forbiddenWithoutApproval, fragment),
  );
  const missingAcceptanceFragments = requiredAcceptanceFragments.filter(
    (fragment) => !acceptanceRule.includes(fragment),
  );

  const targetSha = packet.target?.gitSha ?? '';
  const statusOk = packet.status === 'NO-GO';
  const targetShaOk = expectedSha ? targetSha === expectedSha : Boolean(targetSha);
  const protectedInputReadiness = packet.protectedInputReadiness ?? {};
  const protectedInputReadinessOk =
    Number.isInteger(protectedInputReadiness.matchingProtectedInputNames) &&
    typeof protectedInputReadiness.status === 'string';

  const result = {
    packet: options.packetPath ?? null,
    status: 'PASS',
    target: {
      statusOk,
      targetShaOk,
      targetSha,
      expectedSha: expectedSha || null,
    },
    evidence: {
      expectedKeys: requiredEvidenceKeys.length,
      missingKeys: missingEvidenceKeys,
      missingPaths: missingEvidencePaths,
    },
    requiredInputs: {
      missingFragments: missingInputFragments,
    },
    remainingProofSteps: {
      missingFragments: missingProofStepFragments,
    },
    forbiddenWithoutApproval: {
      missingFragments: missingForbiddenFragments,
    },
    acceptanceRule: {
      missingFragments: missingAcceptanceFragments,
    },
    protectedInputReadiness: {
      ok: protectedInputReadinessOk,
      matchingProtectedInputNames: protectedInputReadiness.matchingProtectedInputNames ?? null,
      state: protectedInputReadiness.status ?? null,
    },
  };

  result.status =
    result.target.statusOk &&
    result.target.targetShaOk &&
    result.evidence.missingKeys.length === 0 &&
    result.evidence.missingPaths.length === 0 &&
    result.requiredInputs.missingFragments.length === 0 &&
    result.remainingProofSteps.missingFragments.length === 0 &&
    result.forbiddenWithoutApproval.missingFragments.length === 0 &&
    result.acceptanceRule.missingFragments.length === 0 &&
    result.protectedInputReadiness.ok
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

  const packetPath = path.resolve(repoRoot, options.packet);
  const packet = JSON.parse(await readFile(packetPath, 'utf8'));
  const result = validateOperatorUnblockPacket(packet, {
    packetPath: path.relative(repoRoot, packetPath).split(path.sep).join('/'),
    expectedSha: options.expectedSha,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Operator unblock packet check: ${result.status}`);
    console.log(`- Status NO-GO: ${result.target.statusOk ? 'yes' : 'no'}`);
    console.log(`- Target SHA ok: ${result.target.targetShaOk ? 'yes' : 'no'}`);
    console.log(`- Missing evidence keys: ${result.evidence.missingKeys.length}`);
    console.log(`- Missing evidence paths: ${result.evidence.missingPaths.length}`);
    console.log(`- Missing protected input fragments: ${result.requiredInputs.missingFragments.length}`);
    console.log(`- Missing proof steps: ${result.remainingProofSteps.missingFragments.length}`);
    console.log(`- Missing forbidden boundaries: ${result.forbiddenWithoutApproval.missingFragments.length}`);
    console.log(`- Missing acceptance fragments: ${result.acceptanceRule.missingFragments.length}`);
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
