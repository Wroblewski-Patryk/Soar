#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FULL_SHA = /^[0-9a-f]{40}$/i;
const IMAGE_ID = /^sha256:[0-9a-f]{64}$/i;
const CONTAINER_ID = /^[0-9a-f]{64}$/i;
const UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const MAX_SNAPSHOT_AGE_MS = 5 * 60_000;
const MAX_FUTURE_SKEW_MS = 30_000;

const ROLES = [
  'api',
  'workers-market-data',
  'workers-market-stream',
  'workers-backtest',
  'workers-execution',
];
const WORKER_ROLES = ROLES.filter((role) => role !== 'api');
const OWNERSHIP_FAMILIES = ['marketData', 'marketStream', 'backtest', 'execution'];

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasOnlyKeys = (value, allowed) =>
  isRecord(value) && Object.keys(value).every((key) => allowed.includes(key));
const fullSha = (value) => typeof value === 'string' && FULL_SHA.test(value);
const imageId = (value) => typeof value === 'string' && IMAGE_ID.test(value);
const normalizedSha = (value) => typeof value === 'string' ? value.toLowerCase() : '';

export const evaluateWorkerSwitchPreflight = ({ snapshot, expectedSha, nowMs = Date.now() }) => {
  const issues = [];
  const fail = (code) => issues.push(code);

  if (!fullSha(expectedSha)) fail('EXPECTED_SHA_INVALID');
  if (!hasOnlyKeys(snapshot, [
    'schemaVersion', 'capturedAt', 'inventoryComplete', 'inventorySource',
    'provenance', 'oldApplications',
  ])) {
    fail('SNAPSHOT_SCHEMA_INVALID');
    return { status: 'FAIL', issues };
  }
  if (snapshot.schemaVersion !== 1) fail('SNAPSHOT_VERSION_INVALID');
  if (snapshot.inventoryComplete !== true || snapshot.inventorySource !== 'coolify-and-docker-readback') {
    fail('OLD_INVENTORY_UNCONFIRMED');
  }
  const capturedMs = Date.parse(snapshot.capturedAt);
  if (typeof snapshot.capturedAt !== 'string' || !UTC_ISO.test(snapshot.capturedAt) ||
      !Number.isFinite(capturedMs) ||
      nowMs - capturedMs > MAX_SNAPSHOT_AGE_MS ||
      capturedMs - nowMs > MAX_FUTURE_SKEW_MS) {
    fail('SNAPSHOT_NOT_FRESH');
  }

  const provenance = snapshot.provenance;
  if (!hasOnlyKeys(provenance, [
    'coolifyResourceId', 'coolifyDeploymentId', 'coolifyResolvedSha',
    'apiImageId', 'apiImageRevision', 'plannedImageIds',
  ])) {
    fail('CANDIDATE_PROVENANCE_MISSING');
  } else {
    if (typeof provenance.coolifyResourceId !== 'string' || !provenance.coolifyResourceId.trim() ||
        typeof provenance.coolifyDeploymentId !== 'string' || !provenance.coolifyDeploymentId.trim() ||
        !fullSha(provenance.coolifyResolvedSha) || !fullSha(provenance.apiImageRevision) ||
        !imageId(provenance.apiImageId)) {
      fail('CANDIDATE_PROVENANCE_MISSING');
    }
    if (fullSha(expectedSha) &&
        (normalizedSha(provenance.coolifyResolvedSha) !== normalizedSha(expectedSha) ||
         normalizedSha(provenance.apiImageRevision) !== normalizedSha(expectedSha))) {
      fail('CANDIDATE_SHA_MISMATCH');
    }
    if (!hasOnlyKeys(provenance.plannedImageIds, ROLES) ||
        ROLES.some((role) => !imageId(provenance.plannedImageIds[role]) ||
          provenance.plannedImageIds[role] !== provenance.apiImageId)) {
      fail('CANDIDATE_IMAGE_MISMATCH');
    }
  }

  if (!Array.isArray(snapshot.oldApplications)) {
    fail('OLD_INVENTORY_INCOMPLETE');
  } else {
    const roles = snapshot.oldApplications.map((item) => item?.role);
    if (roles.length !== ROLES.length ||
        ROLES.some((role) => roles.filter((found) => found === role).length !== 1)) {
      fail('OLD_INVENTORY_INCOMPLETE');
    }
    const resourceIds = new Set();
    const containerIds = new Set();
    for (const app of snapshot.oldApplications) {
      if (!hasOnlyKeys(app, ['role', 'resourceId', 'containers', 'workerMode', 'ownership']) ||
          !ROLES.includes(app.role) || typeof app.resourceId !== 'string' ||
          !app.resourceId.trim() || !Array.isArray(app.containers) || app.containers.length === 0) {
        fail('OLD_INVENTORY_INCOMPLETE');
        continue;
      }
      if (resourceIds.has(app.resourceId)) fail('OLD_INVENTORY_DUPLICATE');
      resourceIds.add(app.resourceId);
      for (const container of app.containers) {
        if (!hasOnlyKeys(container, ['id', 'running', 'pid']) ||
            typeof container.id !== 'string' || !CONTAINER_ID.test(container.id) ||
            typeof container.running !== 'boolean' ||
            !Number.isInteger(container.pid) || container.pid < 0) {
          fail('OLD_CONTAINER_STATE_UNKNOWN');
          continue;
        }
        if (containerIds.has(container.id)) fail('OLD_INVENTORY_DUPLICATE');
        containerIds.add(container.id);
        if (WORKER_ROLES.includes(app.role) && (container.running || container.pid !== 0)) {
          fail('OLD_WORKER_ACTIVE');
        }
      }
      if (app.role === 'api') {
        const apiRunning = app.containers.some((container) => container?.running || container?.pid > 0);
        if (apiRunning && (app.workerMode !== 'split' ||
            !hasOnlyKeys(app.ownership, OWNERSHIP_FAMILIES) ||
            OWNERSHIP_FAMILIES.some((family) => app.ownership[family] !== 'worker'))) {
          fail('OLD_API_MAY_CONSUME_INLINE');
        }
      }
    }
  }

  return { status: issues.length === 0 ? 'PASS' : 'FAIL', issues: [...new Set(issues)] };
};

export const formatWorkerSwitchPreflight = (result) =>
  `[ops:worker-switch:preflight] ${result.status}${result.issues.length ? ` ${result.issues.join(',')}` : ''}`;

const runCli = () => {
  const args = process.argv.slice(2);
  const readValue = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 && args[index + 1] && !args[index + 1].startsWith('--')
      ? args[index + 1]
      : '';
  };
  const snapshotPath = readValue('--snapshot');
  const expectedSha = readValue('--expected-sha');
  if (!snapshotPath || !expectedSha || args.length !== 4) {
    process.stderr.write('[ops:worker-switch:preflight] FAIL USAGE: --snapshot <json> --expected-sha <full-sha>\n');
    process.exitCode = 1;
    return;
  }
  let snapshot;
  try {
    snapshot = JSON.parse(fs.readFileSync(path.resolve(snapshotPath), 'utf8'));
  } catch {
    process.stderr.write('[ops:worker-switch:preflight] FAIL SNAPSHOT_UNREADABLE\n');
    process.exitCode = 1;
    return;
  }
  const result = evaluateWorkerSwitchPreflight({ snapshot, expectedSha });
  process.stdout.write(`${formatWorkerSwitchPreflight(result)}\n`);
  if (result.status !== 'PASS') process.exitCode = 1;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
