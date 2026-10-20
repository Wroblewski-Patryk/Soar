#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readWorkerSwitchDockerInventory } from './readWorkerSwitchDockerInventory.mjs';
import { readWorkerSwitchSourceBinding } from './readWorkerSwitchSourceBinding.mjs';

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
const PASSIVE_ROLES = ['web', 'postgres', 'redis'];
const SOAR_MARKER = /soar|cryptosparrow/i;
const WORKER_MARKER = /worker|backtest|execution|market.?data|market.?stream/i;

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasOnlyKeys = (value, allowed) =>
  isRecord(value) && Object.keys(value).every((key) => allowed.includes(key));
const fullSha = (value) => typeof value === 'string' && FULL_SHA.test(value);
const imageId = (value) => typeof value === 'string' && IMAGE_ID.test(value);
const normalizedSha = (value) => typeof value === 'string' ? value.toLowerCase() : '';

const resolveResourceId = (container, knownResourceIds) => {
  const labeled = [container.applicationUuid, container.serviceUuid, container.databaseUuid]
    .filter(Boolean);
  if (new Set(labeled).size > 1) return null;
  if (labeled.length) return labeled[0];
  if (!container.legacyApplicationId) return '';
  if (knownResourceIds.has(container.composeProject)) return container.composeProject;
  return [...knownResourceIds].find((id) =>
    container.composeService === id || container.composeService?.startsWith(`${id}-`)) ?? '';
};

const validateLiveInventory = ({ snapshot, liveInventory, oldByResource, passiveByResource, fail }) => {
  if (liveInventory?.status !== 'PASS' || !Array.isArray(liveInventory.containers)) {
    fail(liveInventory?.issues?.[0] ?? 'LIVE_DOCKER_REQUIRED');
    return;
  }
  const knownResourceIds = new Set([...oldByResource.keys(), ...passiveByResource.keys()]);
  const liveOldIds = new Map([...oldByResource.keys()].map((id) => [id, new Set()]));
  const oldImageIds = new Set(liveInventory.containers
    .filter((container) => oldByResource.has(resolveResourceId(container, knownResourceIds)))
    .map((container) => container.imageId));
  const expectedProject = snapshot.coolifyProjectName?.toLowerCase();
  let projectLabelSeen = false;
  for (const container of liveInventory.containers) {
    const owner = resolveResourceId(container, knownResourceIds);
    const sameProject = Boolean(expectedProject && container.projectName?.toLowerCase() === expectedProject);
    if (sameProject && (oldByResource.has(owner) || passiveByResource.has(owner))) {
      projectLabelSeen = true;
    }
    const looksLikeSoar = SOAR_MARKER.test(`${container.name} ${container.imageRef}`) ||
      oldImageIds.has(container.imageId);
    if (owner === null) {
      fail('SOAR_CONTAINER_OWNER_AMBIGUOUS');
      continue;
    }
    if (owner === snapshot.provenance?.coolifyResourceId) {
      fail('CANDIDATE_CONTAINER_ALREADY_PRESENT');
      continue;
    }
    if (oldByResource.has(owner)) {
      const app = oldByResource.get(owner);
      liveOldIds.get(owner).add(container.id);
      if (container.projectName && !sameProject) fail('SOAR_PROJECT_MISMATCH');
      const expected = app.containers.find((item) => item.id === container.id);
      if (!expected) fail('UNLISTED_OLD_CONTAINER');
      else if (expected.running !== container.running || expected.pid !== container.pid) {
        fail('SNAPSHOT_STATE_MISMATCH');
      }
      if (container.running || container.pid !== 0) fail('OLD_WORKER_ACTIVE');
      continue;
    }
    if (passiveByResource.has(owner)) {
      if (container.projectName && !sameProject) fail('SOAR_PROJECT_MISMATCH');
      if (WORKER_MARKER.test(`${container.name} ${container.composeService}`)) {
        fail('PASSIVE_RESOURCE_MAY_CONSUME');
      }
      continue;
    }
    if (container.running) fail('ACTIVE_CONTAINER_UNATTRIBUTED');
    if (sameProject || looksLikeSoar || (owner && !container.projectName)) {
      fail('UNASSIGNED_SOAR_CONTAINER');
    }
  }
  for (const [resourceId, app] of oldByResource) {
    const found = liveOldIds.get(resourceId);
    if (app.containers.some((container) => !found.has(container.id))) {
      fail('OLD_CONTAINER_NOT_FOUND');
    }
  }
  if (!projectLabelSeen) fail('COOLIFY_PROJECT_UNVERIFIED');
};

export const evaluateWorkerSwitchPreflight = ({
  snapshot, expectedSha, liveInventory, sourceBinding, nowMs = Date.now(),
}) => {
  const issues = [];
  const fail = (code) => issues.push(code);

  if (!fullSha(expectedSha)) fail('EXPECTED_SHA_INVALID');
  if (sourceBinding?.status !== 'PASS') {
    fail(sourceBinding?.issues?.[0] ?? 'LOCAL_SOURCE_BINDING_REQUIRED');
  } else {
    if (normalizedSha(sourceBinding.headSha) !== normalizedSha(expectedSha) ||
        normalizedSha(sourceBinding.sourceCommit) !== normalizedSha(expectedSha)) {
      fail('SOURCE_COMMIT_HEAD_MISMATCH');
    }
  }
  if (!hasOnlyKeys(snapshot, [
    'schemaVersion', 'capturedAt', 'inventoryComplete', 'inventorySource',
    'coolifyProjectName', 'passiveResources', 'provenance', 'oldApplications',
  ])) {
    fail('SNAPSHOT_SCHEMA_INVALID');
    return { status: 'FAIL', issues };
  }
  if (snapshot.schemaVersion !== 1) fail('SNAPSHOT_VERSION_INVALID');
  if (snapshot.inventoryComplete !== true || snapshot.inventorySource !== 'coolify-and-docker-readback') {
    fail('OLD_INVENTORY_UNCONFIRMED');
  }
  if (typeof snapshot.coolifyProjectName !== 'string' || !snapshot.coolifyProjectName.trim()) {
    fail('COOLIFY_PROJECT_UNKNOWN');
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
    'apiImageRef', 'apiImageId', 'apiImageRevision', 'plannedImageIds',
  ])) {
    fail('CANDIDATE_PROVENANCE_MISSING');
  } else {
    if (typeof provenance.coolifyResourceId !== 'string' || !provenance.coolifyResourceId.trim() ||
        typeof provenance.coolifyDeploymentId !== 'string' || !provenance.coolifyDeploymentId.trim() ||
        !fullSha(provenance.coolifyResolvedSha) || !fullSha(provenance.apiImageRevision) ||
        typeof provenance.apiImageRef !== 'string' || !provenance.apiImageRef.trim() ||
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
    if (sourceBinding?.status === 'PASS') {
      if (sourceBinding.pinnedImageRef !== provenance.apiImageRef ||
          normalizedSha(sourceBinding.imageId) !== normalizedSha(provenance.apiImageId)) {
        fail('CANDIDATE_IMAGE_MISMATCH');
      }
      if (normalizedSha(sourceBinding.revisionLabel) !== normalizedSha(provenance.apiImageRevision)) {
        fail('CANDIDATE_SHA_MISMATCH');
      }
    }
  }

  const passiveByResource = new Map();
  if (!Array.isArray(snapshot.passiveResources) ||
      snapshot.passiveResources.filter((resource) => resource?.role === 'web').length !== 1) {
    fail('COOLIFY_RESOURCES_INCOMPLETE');
  } else {
    for (const resource of snapshot.passiveResources) {
      if (!hasOnlyKeys(resource, ['role', 'resourceId']) ||
          !PASSIVE_ROLES.includes(resource.role) ||
          typeof resource.resourceId !== 'string' || !resource.resourceId.trim() ||
          passiveByResource.has(resource.resourceId)) {
        fail('COOLIFY_RESOURCES_INCOMPLETE');
        continue;
      }
      passiveByResource.set(resource.resourceId, resource);
    }
  }

  const oldByResource = new Map();
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
      if (!hasOnlyKeys(app, ['role', 'resourceId', 'containers']) ||
          !ROLES.includes(app.role) || typeof app.resourceId !== 'string' ||
          !app.resourceId.trim() || !Array.isArray(app.containers) || app.containers.length === 0) {
        fail('OLD_INVENTORY_INCOMPLETE');
        continue;
      }
      if (resourceIds.has(app.resourceId)) fail('OLD_INVENTORY_DUPLICATE');
      resourceIds.add(app.resourceId);
      if (passiveByResource.has(app.resourceId)) fail('OLD_INVENTORY_DUPLICATE');
      oldByResource.set(app.resourceId, app);
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
        if (container.running || container.pid !== 0) {
          fail('OLD_WORKER_ACTIVE');
        }
      }
    }
  }

  validateLiveInventory({ snapshot, liveInventory, oldByResource, passiveByResource, fail });

  return { status: issues.length === 0 ? 'PASS' : 'FAIL', issues: [...new Set(issues)] };
};

export const formatWorkerSwitchPreflight = (result) =>
  `[ops:worker-switch:preflight] ${result.status === 'PASS' ? 'PASS_LOCAL_PROCEDURAL_ONLY' : 'FAIL'}${result.issues.length ? ` ${result.issues.join(',')}` : ''}`;

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
  const sourceBinding = readWorkerSwitchSourceBinding();
  const liveInventory = readWorkerSwitchDockerInventory();
  const result = evaluateWorkerSwitchPreflight({ snapshot, expectedSha, liveInventory, sourceBinding });
  process.stdout.write(`${formatWorkerSwitchPreflight(result)}\n`);
  if (result.status !== 'PASS') process.exitCode = 1;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
