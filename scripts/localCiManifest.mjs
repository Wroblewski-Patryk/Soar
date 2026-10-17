import { createHash } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const REQUIRED_LOCAL_CI_STEPS = [
  'source.checkout',
  'runner.image',
  'deps.install',
  'infrastructure.ready',
  'repo.guardrails',
  'repo.docs-parity',
  'web.lint',
  'web.typecheck',
  'web.vitest',
  'web.build',
  'api.prisma-generate',
  'api.migrate-deploy',
  'api.migrate-status',
  'api.build',
  'api.typecheck',
  'api.vitest',
  'source.tracked-clean',
  'infrastructure.cleanup',
];

export const sha256 = (data) => createHash('sha256').update(data).digest('hex');

export const localCiEvidenceRoot = () =>
  path.resolve(
    process.env.SOAR_LOCAL_CI_EVIDENCE_ROOT ||
      path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), '.local', 'share'), 'Soar', 'local-ci')
  );

export const assertFullSha = (value) => {
  if (!/^[a-f0-9]{40}$/.test(String(value ?? ''))) {
    throw new Error('A full 40-character lowercase commit SHA is required');
  }
  return value;
};

const assertInside = (root, candidate) => {
  const relative = path.relative(root, candidate);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Evidence path escapes its run directory');
  }
};

export const verifyLocalCiManifest = ({
  manifestPath,
  expectedSha,
  requireReleaseMode = false,
  maxAgeHours = null,
  now = new Date(),
}) => {
  assertFullSha(expectedSha);
  const manifestFile = realpathSync(manifestPath);
  const runDir = path.dirname(manifestFile);
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  if (manifest.schemaVersion !== 1) throw new Error('Unsupported local CI manifest schema');
  if (manifest.candidateSha !== expectedSha) throw new Error('Local CI SHA does not match release SHA');
  if (requireReleaseMode && manifest.mode !== 'release') throw new Error('A fresh release-mode run is required');
  if (manifest.status !== 'PASS') throw new Error('Local CI manifest is not PASS');
  if (manifest.coverage?.ciParity !== 'PASS') throw new Error('CI parity is incomplete');
  if (!/^[a-f0-9]{64}$/.test(manifest.lockfileSha256 ?? '')) {
    throw new Error('Missing lockfile digest');
  }
  for (const image of ['runner', 'postgres', 'redis']) {
    if (!/^sha256:[a-f0-9]{64}$/.test(manifest.images?.[image] ?? '')) {
      throw new Error(`Missing ${image} image ID`);
    }
  }
  if (maxAgeHours != null) {
    const ageMs = now.getTime() - Date.parse(manifest.completedAt);
    if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > maxAgeHours * 60 * 60 * 1000) {
      throw new Error('Local CI release evidence is stale');
    }
  }
  if (!Array.isArray(manifest.steps) || manifest.steps.length !== REQUIRED_LOCAL_CI_STEPS.length) {
    throw new Error('Local CI manifest has missing or extra steps');
  }
  for (const [index, expectedId] of REQUIRED_LOCAL_CI_STEPS.entries()) {
    const step = manifest.steps[index];
    if (step?.id !== expectedId || step.exitCode !== 0) {
      throw new Error(`Local CI step is missing or failed: ${expectedId}`);
    }
    if (!/^[a-f0-9]{64}$/.test(step.logSha256 ?? '')) {
      throw new Error(`Missing log digest for ${expectedId}`);
    }
    const logPath = path.resolve(runDir, step.log ?? '');
    assertInside(runDir, logPath);
    const canonicalLog = realpathSync(logPath);
    assertInside(runDir, canonicalLog);
    if (sha256(readFileSync(canonicalLog)) !== step.logSha256) {
      throw new Error(`Log was changed: ${expectedId}`);
    }
  }
  return manifest;
};

export const resolveReleaseManifestPath = (expectedSha, evidenceRoot = localCiEvidenceRoot()) => {
  assertFullSha(expectedSha);
  const pointer = path.join(evidenceRoot, 'by-sha', `${expectedSha}.json`);
  const record = JSON.parse(readFileSync(pointer, 'utf8'));
  if (record.sha !== expectedSha || !/^[a-z0-9-]+$/.test(record.runId ?? '')) {
    throw new Error('Invalid release evidence pointer');
  }
  return path.join(evidenceRoot, 'runs', record.runId, 'manifest.json');
};
