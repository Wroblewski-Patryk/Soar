#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rawArgs = process.argv.slice(2);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const hasFlag = (flag) => rawArgs.includes(flag);

export const protectedInputFamilies = [
  {
    family: 'LIVEIMPORT_READBACK_*',
    requiredForAccountAccessGate: false,
    prefixes: ['LIVEIMPORT_READBACK'],
    purpose: 'Protected LIVEIMPORT-03 production runtime readback',
  },
  {
    family: 'ROLLBACK_GUARD_*',
    requiredForAccountAccessGate: true,
    prefixes: ['ROLLBACK_GUARD'],
    purpose: 'Protected production rollback/runtime freshness proof',
  },
  {
    family: 'PROD_UI_AUDIT_*',
    requiredForAccountAccessGate: false,
    prefixes: ['PROD_UI_AUDIT'],
    purpose: 'Authenticated production dashboard/admin UI clickthrough',
  },
  {
    family: 'PROD_UI_*',
    requiredForAccountAccessGate: false,
    prefixes: ['PROD_UI'],
    purpose: 'Legacy production UI audit input family',
  },
  {
    family: 'SOAR_PROD_*',
    requiredForAccountAccessGate: true,
    prefixes: ['SOAR_PROD'],
    purpose: 'Production app/operator context',
  },
  {
    family: 'PROD_DB_CHECK_*',
    requiredForAccountAccessGate: true,
    prefixes: ['PROD_DB_CHECK'],
    purpose: 'Production DB restore context',
  },
  {
    family: 'PRODUCTION_DB_CHECK_*',
    requiredForAccountAccessGate: true,
    prefixes: ['PRODUCTION_DB_CHECK'],
    purpose: 'Alternate production DB restore context',
  },
  {
    family: 'RC_*',
    requiredForAccountAccessGate: true,
    prefixes: ['RC_'],
    purpose: 'Release-candidate gate context',
  },
  {
    family: 'GATE* / GATE_*',
    requiredForAccountAccessGate: true,
    prefixes: ['GATE'],
    purpose: 'Gate approver context',
  },
];

export const accountAccessGateRequirements = [
  {
    label: 'ROLLBACK_GUARD_*',
    anyOfFamilies: ['ROLLBACK_GUARD_*'],
  },
  {
    label: 'SOAR_PROD_*',
    anyOfFamilies: ['SOAR_PROD_*'],
  },
  {
    label: 'PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*',
    anyOfFamilies: ['PROD_DB_CHECK_*', 'PRODUCTION_DB_CHECK_*'],
  },
  {
    label: 'RC_*',
    anyOfFamilies: ['RC_*'],
  },
  {
    label: 'GATE* / GATE_*',
    anyOfFamilies: ['GATE* / GATE_*'],
  },
];

export const evaluateProtectedInputReadiness = ({
  env = process.env,
  date = new Date().toISOString().slice(0, 10),
  expectedSha = '',
  gitRef = '',
  buildInfoCheckedAt = '',
} = {}) => {
  const envNames = Object.keys(env).sort();
  const matchingProtectedInputNames = new Set();
  const families = protectedInputFamilies.map((definition) => {
    const matchingNames = envNames.filter((name) =>
      definition.prefixes.some((prefix) => name.startsWith(prefix)),
    );
    matchingNames.forEach((name) => matchingProtectedInputNames.add(name));
    return {
      family: definition.family,
      state: matchingNames.length > 0 ? 'present' : 'missing',
      purpose: definition.purpose,
      requiredForAccountAccessGate: definition.requiredForAccountAccessGate,
      matchingNamesPresent: matchingNames.length,
    };
  });
  const matchingProtectedInputNamesPresent = matchingProtectedInputNames.size;
  const familyByName = new Map(families.map((family) => [family.family, family]));
  const missingRequiredFamilies = accountAccessGateRequirements
    .filter((requirement) =>
      requirement.anyOfFamilies.every(
        (familyName) => (familyByName.get(familyName)?.matchingNamesPresent ?? 0) === 0,
      ),
    )
    .map((requirement) => requirement.label);
  const accountAccessGateStatus = missingRequiredFamilies.length === 0 ? 'PASS' : 'FAIL';

  return {
    id: `V1-PROTECTED-INPUT-READINESS-${expectedSha ? expectedSha.slice(0, 8).toUpperCase() : 'UNKNOWN'}-${date}`,
    date,
    status: matchingProtectedInputNamesPresent > 0 ? 'PARTIAL' : 'BLOCKED',
    releaseStatus: 'NO-GO',
    scope: 'current execution shell only',
    secretHandling: 'no secret values printed, copied, or stored',
    target: {
      gitSha: expectedSha || null,
      gitRef: gitRef || null,
      buildInfoCheckedAt: buildInfoCheckedAt || null,
    },
    matchingProtectedInputNamesPresent,
    accountAccessGate: {
      status: accountAccessGateStatus,
      requiredFamilies: accountAccessGateRequirements.map((requirement) => requirement.label),
      missingRequiredFamilies,
      bindingState:
        accountAccessGateStatus === 'PASS'
          ? 'REQUIRED_PROTECTED_INPUT_FAMILIES_BOUND_BY_NAME'
          : 'REQUIRED_PROTECTED_INPUT_FAMILIES_MISSING',
    },
    families,
    observedOutput:
      accountAccessGateStatus === 'PASS'
        ? 'ACCOUNT_ACCESS_GATE_REQUIRED_INPUTS_PRESENT'
        : matchingProtectedInputNamesPresent > 0
          ? 'MATCHING_PROTECTED_INPUT_NAMES_PRESENT_BUT_ACCOUNT_ACCESS_GATE_INCOMPLETE'
          : 'NO_MATCHING_PROTECTED_INPUT_NAMES_PRESENT',
    nextAction:
      'Execute the current operator unblock packet only after approved protected inputs and real approver fields are available.',
  };
};

export const buildProtectedInputReadinessMarkdown = (result) => {
  const targetSha = result.target.gitSha ? `\`${result.target.gitSha}\`` : '`unknown`';
  const buildInfoCheckedAt = result.target.buildInfoCheckedAt
    ? `\`${result.target.buildInfoCheckedAt}\``
    : '`not provided`';
  const rows = result.families
    .map(
      (family) =>
        `| \`${family.family}\` | ${family.requiredForAccountAccessGate ? 'yes' : 'no'} | ${family.state} | ${family.matchingNamesPresent} | ${family.purpose} |`,
    )
    .join('\n');

  return `# V1 Protected Input Readiness Sweep

## Context

- Evidence date: ${result.date}
- Deployed build-info SHA: ${targetSha}
- Build-info readback time: ${buildInfoCheckedAt}
- Scope: ${result.scope}
- Secret handling: ${result.secretHandling}

## Result

- Status: \`${result.status}\`
- Matching protected input names present: \`${result.matchingProtectedInputNamesPresent}\`
- Account-access gate: \`${result.accountAccessGate.status}\`
- Missing required account-access families: \`${
    result.accountAccessGate.missingRequiredFamilies.length > 0
      ? result.accountAccessGate.missingRequiredFamilies.join(', ')
      : 'none'
  }\`
- V1 release status: \`${result.releaseStatus}\`

## Checked Input Families

| Family | Required for account-access gate | State | Matching names | Purpose |
| --- | --- | --- | --- | --- |
${rows}

## Observed Output

\`\`\`text
${result.observedOutput}
\`\`\`

## Release Impact

- The current shell can run no-secret checks only when required protected
  families are missing.
- Protected \`AUD-19\` evidence remains blocked until approved operator inputs
  are provided.
- Public build-info and smoke evidence must not be substituted for protected
  runtime, rollback, restore, UI, SLO, or sign-off proof.

## Next Action

${result.nextAction}
`;
};

const parseOptions = () => {
  if (hasFlag('--help') || hasFlag('-h')) return { help: true };
  return {
    help: false,
    today: readArgValue('--today') || new Date().toISOString().slice(0, 10),
    expectedSha: readArgValue('--expected-sha') || '',
    gitRef: readArgValue('--git-ref') || '',
    buildInfoCheckedAt: readArgValue('--build-info-checked-at') || '',
    jsonOutput: readArgValue('--json-output') || '',
    markdownOutput: readArgValue('--markdown-output') || '',
    json: hasFlag('--json'),
  };
};

export const printUsage = () => {
  console.log(`Usage: node scripts/checkProtectedInputReadiness.mjs [options]

Options:
  --today <yyyy-mm-dd>              Evidence date
  --expected-sha <sha>              Production build-info SHA being checked
  --git-ref <ref>                   Production build-info git ref
  --build-info-checked-at <iso>     Build-info readback timestamp
  --json-output <path>              Write no-secret JSON report
  --markdown-output <path>          Write no-secret Markdown report
  --json                            Print JSON to stdout
  --help                            Show this message

This command checks environment variable names only. It never prints or writes
environment variable values.
`);
};

export const writeOutput = async (filePath, content) => {
  if (!filePath) return;
  await mkdir(path.dirname(path.resolve(process.cwd(), filePath)), { recursive: true });
  await writeFile(path.resolve(process.cwd(), filePath), content);
};

export const main = async () => {
  const options = parseOptions();
  if (options.help) {
    printUsage();
    return;
  }

  const result = evaluateProtectedInputReadiness({
    date: options.today,
    expectedSha: options.expectedSha,
    gitRef: options.gitRef,
    buildInfoCheckedAt: options.buildInfoCheckedAt,
  });
  const markdown = buildProtectedInputReadinessMarkdown(result);

  await writeOutput(options.jsonOutput, `${JSON.stringify(result, null, 2)}\n`);
  await writeOutput(options.markdownOutput, markdown);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Protected input readiness: ${result.status}`);
  console.log(`- Matching protected input names present: ${result.matchingProtectedInputNamesPresent}`);
  for (const family of result.families) {
    console.log(`- ${family.family}: ${family.state} (${family.matchingNamesPresent})`);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
