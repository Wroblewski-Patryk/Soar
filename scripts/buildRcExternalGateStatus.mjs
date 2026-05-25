#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
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
const historyOperationsDir = path.resolve(process.cwd(), 'history', 'operations');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    input: '',
    output: path.join(operationsDir, 'v1-rc-external-gates-status.md'),
    runbookPath: path.join(operationsDir, 'v1-rc-external-gates-runbook.md'),
    signoffPath: path.join(operationsDir, 'v1-rc-signoff-record.md'),
    templateOnly: false,
    today: '',
    expectedSha: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--input') options.input = args[index + 1] ?? options.input;
    if (arg === '--output') options.output = args[index + 1] ?? options.output;
    if (arg === '--runbook-path') options.runbookPath = args[index + 1] ?? options.runbookPath;
    if (arg === '--signoff-path') options.signoffPath = args[index + 1] ?? options.signoffPath;
    if (arg === '--template-only') options.templateOnly = true;
    if (arg === '--today') options.today = args[index + 1] ?? options.today;
    if (arg === '--expected-sha') options.expectedSha = args[index + 1] ?? options.expectedSha;
  }

  return options;
};

const resolveGeneratedAt = (today) => {
  const normalized = String(today ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized}T00:00:00.000Z`;
  return new Date().toISOString();
};

const asNumber = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

const pct = (value) => (value == null ? 'n/a' : `${value.toFixed(2)}%`);
const normalizeEnvironment = (value) => {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'production' || normalized === 'stage' || normalized === 'local') return normalized;
  return 'unknown';
};

const findLatestSloArtifact = async () => {
  const entries = await readdir(historyOperationsDir);
  const candidates = entries
    .filter((name) => name.startsWith('_artifacts-slo-window-') && name.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a));
  if (candidates.length === 0) return null;
  return path.join(historyOperationsDir, candidates[0]);
};

const findLatestSloWindowReportArtifact = async () => {
  const entries = await readdir(historyOperationsDir);
  const candidates = entries
    .filter((name) => name.startsWith('v1-slo-window-report-') && name.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a));
  if (candidates.length === 0) return null;
  return path.join(historyOperationsDir, candidates[0]);
};

const findLatestDbRestoreArtifact = async () => {
  const entries = await readdir(historyOperationsDir);
  const candidates = entries
    .filter((name) => name.startsWith('_artifacts-db-restore-check-') && name.endsWith('.txt'))
    .sort((a, b) => b.localeCompare(a));
  if (candidates.length === 0) return null;
  return path.join(historyOperationsDir, candidates[0]);
};

const evaluateBackupRestoreGate = async () => {
  const artifactPath = await findLatestDbRestoreArtifact();
  if (!artifactPath) {
    return {
      label: 'OPEN (manual evidence required)',
      result: 'MISSING',
      artifactPath: null,
    };
  }

  const raw = await readFile(artifactPath, 'utf8');
  const resultMatch = raw.match(/RESULT:\s*(PASS|FAIL)/i);
  const result = resultMatch?.[1]?.toUpperCase() ?? 'UNKNOWN';

  if (result === 'PASS') {
    return {
      label: 'LOCAL_PASS (target-env pending)',
      result,
      artifactPath,
    };
  }

  return {
    label: `OPEN (latest local result: ${result})`,
    result,
    artifactPath,
  };
};

const readRunbookRaw = async (runbookPathInput) => {
  const runbookPath = path.resolve(process.cwd(), runbookPathInput);
  try {
    return {
      runbookPath,
      raw: await readFile(runbookPath, 'utf8'),
    };
  } catch {
    return {
      runbookPath,
      raw: '',
    };
  }
};

const extractEvidenceValues = (raw, heading) => {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/);
  const sectionStart = lines.findIndex((line) => line.trim() === heading);
  if (sectionStart === -1) return [];
  const evidenceStart = lines.findIndex((line, index) => index > sectionStart && line.trim() === 'Evidence to record:');
  if (evidenceStart === -1) return [];

  const evidenceValues = [];
  for (let index = evidenceStart + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith('## ')) break;
    if (!line.startsWith('- ')) continue;
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;
    const value = line.slice(separatorIndex + 1).trim();
    evidenceValues.push(value);
  }
  return evidenceValues;
};

const evaluateGate1FromRunbook = async (runbookPathInput) => {
  const { runbookPath, raw } = await readRunbookRaw(runbookPathInput);
  const evidenceValues = extractEvidenceValues(raw, '## Gate 1: Backup Snapshot and Restore Validation');
  const evidenceComplete = evidenceValues.length > 0 && evidenceValues.every((value) => value.length > 0);
  return {
    label: evidenceComplete ? 'PASS' : 'OPEN',
    evidenceComplete,
    runbookPath,
  };
};

const evaluateGate3FromRunbook = async (runbookPathInput) => {
  const { runbookPath, raw } = await readRunbookRaw(runbookPathInput);
  const evidenceValues = extractEvidenceValues(raw, '## Gate 3: Incident Contacts and Escalation Confirmation');
  const evidenceComplete = evidenceValues.length > 0 && evidenceValues.every((value) => value.length > 0);
  return {
    label: evidenceComplete ? 'PASS' : 'OPEN',
    evidenceComplete,
    runbookPath,
  };
};

const evaluateGate4FromSignoffRecord = async (signoffPathInput) => {
  const signoffPath = path.resolve(process.cwd(), signoffPathInput);
  let raw = '';
  try {
    raw = await readFile(signoffPath, 'utf8');
  } catch {
    return {
      label: 'OPEN',
      approved: false,
      signoffPath,
    };
  }

  const approved = /RC status:\s*`APPROVED`/i.test(raw);
  return {
    label: approved ? 'PASS' : 'OPEN',
    approved,
    signoffPath,
  };
};

const statusLabel = (passed) => (passed ? 'PASS' : 'OPEN');
const gate2StatusLabel = (queueLagPass, productionEvidence, environmentLabel) => {
  if (!queueLagPass) return 'OPEN';
  if (productionEvidence) return 'PASS';
  const env = environmentLabel || 'unknown';
  return `LOCAL_PASS (${env} evidence; production pending)`;
};
const renderManualFollowUps = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '1. No pending manual follow-ups. Keep `v1-release-candidate-checklist.md` synchronized with current gate snapshot.';
  }
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
};
const buildManualFollowUps = ({
  gate1EvidenceComplete,
  gate2QueueLagPass,
  gate2ProductionEvidence,
  gate3EvidenceComplete,
  gate4Approved,
}) => {
  const items = [];

  if (!gate1EvidenceComplete) {
    items.push(
      'Fill backup/restore evidence in `docs/operations/v1-rc-external-gates-runbook.md` for Gate 1.'
    );
  }

  if (!gate2QueueLagPass) {
    items.push(
      'Complete Gate 2 queue-lag baseline review from fresh SLO artifacts and regenerate `v1-rc-external-gates-status.md`.'
    );
  } else if (!gate2ProductionEvidence) {
    items.push(
      'Re-run Gate 2 from production/private-route context so status can move from `LOCAL_PASS` to `PASS`.'
    );
  }

  if (!gate3EvidenceComplete) {
    items.push(
      'Fill incident contacts/escalation evidence in `docs/operations/v1-rc-external-gates-runbook.md` for Gate 3.'
    );
  }

  if (!gate4Approved) {
    items.push('Complete sign-offs in `docs/operations/v1-rc-signoff-record.md` for Gate 4.');
  }

  items.push(
    'Reflect current gate states in `docs/operations/v1-release-candidate-checklist.md` after updating evidence/sign-offs.'
  );
  return items;
};

const buildGateRowsFromObservation = (summary, environment) => {
  const objectives = Array.isArray(summary?.evaluation?.objectives)
    ? summary.evaluation.objectives
    : [];
  const objectiveStatusById = new Map(
    objectives
      .map((objective) => [objective?.id, String(objective?.status ?? '').toUpperCase()])
      .filter(([id]) => typeof id === 'string' && id.length > 0)
  );
  const objectivePass = (id) => objectiveStatusById.get(id) === 'PASS';

  const ready = asNumber(summary?.probes?.readyAvailabilityPct);
  const workersReady = asNumber(summary?.probes?.workersReadyAvailabilityPct);
  const errorRatio = asNumber(summary?.http?.errorRatioPct);
  const executionP95 = asNumber(summary?.queueLagExecution?.p95);
  const executionMax = asNumber(summary?.queueLagExecution?.max);

  const queueLagPassFromObjectives = objectivePass('SLO-5');
  const probePassFromObjectives =
    objectivePass('SLO-1A') &&
    objectivePass('SLO-1B') &&
    objectivePass('SLO-4A') &&
    objectivePass('SLO-4B');
  const reliabilityPassFromObjectives = objectivePass('SLO-2');

  const queueLagPassFallback =
    executionP95 != null && executionP95 <= 10 && executionMax != null && executionMax <= 20;
  const probePassFallback = ready != null && ready >= 99.9 && workersReady != null && workersReady >= 99.5;
  const reliabilityPassFallback = errorRatio != null && errorRatio <= 0.5;

  const queueLagPass = objectiveStatusById.has('SLO-5') ? queueLagPassFromObjectives : queueLagPassFallback;
  const probePass =
    objectiveStatusById.has('SLO-1A') &&
    objectiveStatusById.has('SLO-1B') &&
    objectiveStatusById.has('SLO-4A') &&
    objectiveStatusById.has('SLO-4B')
      ? probePassFromObjectives
      : probePassFallback;
  const reliabilityPass = objectiveStatusById.has('SLO-2')
    ? reliabilityPassFromObjectives
    : reliabilityPassFallback;
  const normalizedEnvironment = normalizeEnvironment(environment);
  const productionEvidence = normalizedEnvironment === 'production';

  return {
    probePass,
    reliabilityPass,
    queueLagPass,
    productionEvidence,
    sourceKind: 'slo_observation',
    details: {
      environment: normalizedEnvironment,
      ready,
      workersReady,
      errorRatio,
      executionP95,
      executionMax,
      orderAttempts: asNumber(summary?.liveOrderPath?.orderAttemptsDelta),
      orderFailures: asNumber(summary?.liveOrderPath?.orderFailuresDelta),
      orderFailureRatio: asNumber(summary?.liveOrderPath?.failureRatioPct),
      objectiveStatuses: Object.fromEntries(objectiveStatusById.entries()),
    },
  };
};

const buildGateRowsFromWindowReport = (report) => {
  const ready = asNumber(report?.aggregates?.probes?.readyAvgPct);
  const workersReady = asNumber(report?.aggregates?.probes?.workersReadyAvgPct);
  const errorRatio = asNumber(report?.aggregates?.api?.errorRatioAvgPct);
  const executionP95 = asNumber(report?.aggregates?.queueLagExecution?.p95Max);
  const executionMax = asNumber(report?.aggregates?.queueLagExecution?.maxPeak);
  const p95Threshold = asNumber(report?.thresholds?.queueLagP95Threshold) ?? 10;
  const maxThreshold = asNumber(report?.thresholds?.queueLagMaxThreshold) ?? 20;

  const queueLagPass = executionP95 != null && executionP95 <= p95Threshold && executionMax != null && executionMax <= maxThreshold;
  const probePass = ready != null && ready >= 99.9 && workersReady != null && workersReady >= 99.5;
  const reliabilityPass = errorRatio != null && errorRatio <= 0.5;
  const productionEvidence = Boolean(report?.source?.includesProductionEvidence);
  const environmentSummary = report?.source?.environmentSummary ?? {};

  return {
    probePass,
    reliabilityPass,
    queueLagPass,
    productionEvidence,
    sourceKind: 'slo_window_report',
    details: {
      environment: productionEvidence ? 'production' : 'mixed-or-non-production',
      environmentSummary,
      ready,
      workersReady,
      errorRatio,
      executionP95,
      executionMax,
      orderAttempts: null,
      orderFailures: null,
      orderFailureRatio: asNumber(report?.aggregates?.liveOrderPath?.failureRatioAvgPct),
      queueLagP95Threshold: p95Threshold,
      queueLagMaxThreshold: maxThreshold,
    },
  };
};

const loadGate2Evaluation = async (inputPath) => {
  const raw = await readFile(inputPath, 'utf8');
  const artifact = JSON.parse(raw);
  if (artifact?.summary) {
    const environment = normalizeEnvironment(artifact?.options?.environment);
    return {
      artifact,
      evaluation: buildGateRowsFromObservation(artifact.summary ?? {}, environment),
    };
  }

  return {
    artifact,
    evaluation: buildGateRowsFromWindowReport(artifact),
  };
};

const renderReport = ({
  artifactPath,
  artifact,
  evaluation,
  backupGate,
  gate1Runbook,
  gate3Runbook,
  gate4Signoff,
  generatedAt,
  expectedSha = '',
}) => {
  const artifactRel = path.relative(process.cwd(), artifactPath);
  const backupArtifactRel = backupGate.artifactPath
    ? path.relative(process.cwd(), backupGate.artifactPath)
    : 'n/a';
  const runbookRel = path.relative(process.cwd(), gate3Runbook.runbookPath);
  const signoffRel = path.relative(process.cwd(), gate4Signoff.signoffPath);
  const gate2Pass = evaluation.queueLagPass && evaluation.probePass && evaluation.reliabilityPass;
  const gate2Label = gate2StatusLabel(
    gate2Pass,
    evaluation.productionEvidence,
    evaluation.details.environment
  );
  const gate1Label = gate1Runbook.evidenceComplete ? 'PASS' : backupGate.label;
  const manualFollowUps = buildManualFollowUps({
    gate1EvidenceComplete: gate1Runbook.evidenceComplete,
    gate2QueueLagPass: gate2Pass,
    gate2ProductionEvidence: evaluation.productionEvidence,
    gate3EvidenceComplete: gate3Runbook.evidenceComplete,
    gate4Approved: gate4Signoff.approved,
  });
  const output = `# V1 RC External Gates Status

Generated at (UTC): ${generatedAt}
Expected SHA: \`${expectedSha || 'not provided'}\`

Source artifact: \`${artifactRel}\`
Observation window:
- started: ${artifact.startedAt ?? 'n/a'}
- ended: ${artifact.endedAt ?? 'n/a'}

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): ${gate1Label}
- Gate 2 (Queue-lag baseline review): ${gate2Label}
- Gate 3 (Incident contacts + escalation confirmation): ${gate3Runbook.label}
- Gate 4 (Formal RC sign-offs): ${gate4Signoff.label}

## Backup/Restore Evidence
- Latest local artifact: \`${backupArtifactRel}\`
- Latest local result: ${backupGate.result}
- Runbook source: \`${runbookRel}\`
- Gate 1 runbook evidence complete: ${gate1Runbook.evidenceComplete ? 'yes' : 'no'}
- Production validation: ${gate1Runbook.evidenceComplete ? 'recorded' : 'pending (manual gate)'}

## Incident Readiness Evidence
- Runbook source: \`${runbookRel}\`
- Gate 3 evidence complete: ${gate3Runbook.evidenceComplete ? 'yes' : 'no'}

## Formal Sign-Off Evidence
- Sign-off source: \`${signoffRel}\`
- Gate 4 approved status found: ${gate4Signoff.approved ? 'yes' : 'no'}

## Derived Metrics (from SLO artifact)
- source type: ${evaluation.sourceKind}
- evidence environment: ${evaluation.details.environment ?? 'unknown'}
- production evidence present: ${evaluation.productionEvidence ? 'yes' : 'no'}
- /ready availability: ${pct(evaluation.details.ready)}
- /workers/ready availability: ${pct(evaluation.details.workersReady)}
- API 5xx ratio: ${pct(evaluation.details.errorRatio)}
- execution queue lag p95: ${evaluation.details.executionP95 ?? 'n/a'}
- execution queue lag max: ${evaluation.details.executionMax ?? 'n/a'}
- execution queue lag thresholds (p95/max): ${evaluation.details.queueLagP95Threshold ?? 'n/a'}/${evaluation.details.queueLagMaxThreshold ?? 'n/a'}
- exchange order attempts delta: ${evaluation.details.orderAttempts ?? 'n/a'}
- exchange order failures delta: ${evaluation.details.orderFailures ?? 'n/a'}
- exchange order failure ratio: ${pct(evaluation.details.orderFailureRatio)}

## Suggested Checklist Updates
- Runtime and Operations Gates:
  - Production SLO metrics reviewed and within baseline -> ${gate2Label}
- Exit Evidence Workpack:
  - ops(slo): define SLO targets and collect production observation window evidence -> ${gate2StatusLabel(
    evaluation.probePass && evaluation.reliabilityPass,
    evaluation.productionEvidence,
    evaluation.details.environment
  )}

## Manual Follow-ups (Required)
${renderManualFollowUps(manualFollowUps)}
`;
  return output;
};

const renderTemplateOnly = (
  backupGate,
  gate1Runbook,
  gate3Runbook,
  gate4Signoff,
  generatedAt,
  expectedSha = ''
) => {
  const backupArtifactRel = backupGate.artifactPath
    ? path.relative(process.cwd(), backupGate.artifactPath)
    : 'n/a';
  const runbookRel = path.relative(process.cwd(), gate3Runbook.runbookPath);
  const signoffRel = path.relative(process.cwd(), gate4Signoff.signoffPath);
  const gate1Label = gate1Runbook.evidenceComplete ? 'PASS' : backupGate.label;
  const manualFollowUps = buildManualFollowUps({
    gate1EvidenceComplete: gate1Runbook.evidenceComplete,
    gate2QueueLagPass: false,
    gate2ProductionEvidence: false,
    gate3EvidenceComplete: gate3Runbook.evidenceComplete,
    gate4Approved: gate4Signoff.approved,
  });
  return `# V1 RC External Gates Status

Generated at (UTC): ${generatedAt}
Expected SHA: \`${expectedSha || 'not provided'}\`

Source artifact: not provided (template-only mode)

## Gate Status Snapshot
- Gate 1 (Backup snapshot + restore validation): ${gate1Label}
- Gate 2 (Queue-lag baseline review): OPEN
- Gate 3 (Incident contacts + escalation confirmation): ${gate3Runbook.label}
- Gate 4 (Formal RC sign-offs): ${gate4Signoff.label}

## Backup/Restore Evidence
- Latest local artifact: \`${backupArtifactRel}\`
- Latest local result: ${backupGate.result}
- Runbook source: \`${runbookRel}\`
- Gate 1 runbook evidence complete: ${gate1Runbook.evidenceComplete ? 'yes' : 'no'}
- Production validation: ${gate1Runbook.evidenceComplete ? 'recorded' : 'pending (manual gate)'}

## Incident Readiness Evidence
- Runbook source: \`${runbookRel}\`
- Gate 3 evidence complete: ${gate3Runbook.evidenceComplete ? 'yes' : 'no'}

## Formal Sign-Off Evidence
- Sign-off source: \`${signoffRel}\`
- Gate 4 approved status found: ${gate4Signoff.approved ? 'yes' : 'no'}

## Required Inputs
1. Run SLO collector:
   - \`pnpm run ops:slo:collect -- --base-url https://<target-api> --duration-minutes 30 --interval-seconds 30 --auth-token <ADMIN_JWT> --environment production\`
2. Rebuild status from latest artifact:
   - \`pnpm run ops:rc:gates:status\`

## Manual Follow-ups (Required)
${renderManualFollowUps(manualFollowUps)}
`;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    console.log('Usage: node scripts/buildRcExternalGateStatus.mjs [--input <artifact.json>] [--output <status.md>] [--template-only] [--today <yyyy-mm-dd>]');
    process.exit(0);
  }
  const generatedAt = resolveGeneratedAt(options.today);

  const backupGate = await evaluateBackupRestoreGate();
  const gate1Runbook = await evaluateGate1FromRunbook(options.runbookPath);
  const gate3Runbook = await evaluateGate3FromRunbook(options.runbookPath);
  const gate4Signoff = await evaluateGate4FromSignoffRecord(options.signoffPath);

  if (options.templateOnly) {
    const outputPath = path.resolve(process.cwd(), options.output);
    await writeFile(
      outputPath,
      renderTemplateOnly(
        backupGate,
        gate1Runbook,
        gate3Runbook,
        gate4Signoff,
        generatedAt,
        options.expectedSha
      )
    );
    console.log(`RC external gates template written to: ${path.relative(process.cwd(), outputPath)}`);
    process.exit(0);
  }

  const inputPath = options.input
    ? path.resolve(process.cwd(), options.input)
    : (await findLatestSloArtifact()) ?? (await findLatestSloWindowReportArtifact());

  if (!inputPath) {
    throw new Error('No SLO artifact found. Run `pnpm run ops:slo:collect` first.');
  }

  const { artifact, evaluation } = await loadGate2Evaluation(inputPath);
  const report = renderReport({
    artifactPath: inputPath,
    artifact,
    evaluation,
    backupGate,
    gate1Runbook,
    gate3Runbook,
    gate4Signoff,
    generatedAt,
    expectedSha: options.expectedSha,
  });

  const outputPath = path.resolve(process.cwd(), options.output);
  await writeFile(outputPath, report);
  console.log(`RC external gates status written to: ${path.relative(process.cwd(), outputPath)}`);
};

main().catch((error) => {
  console.error('[ops:rc:gates:status] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
