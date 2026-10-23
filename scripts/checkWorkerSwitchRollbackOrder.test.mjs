import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relativePath) => fs.readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
const titles = [
  'Stop all new stack processes.',
  'Verify all new processes stopped.',
  'Resolve in-flight and unknown work.',
  'Confirm rollback compatibility.',
  'Restore old applications.',
];
const processNames = [
  'api', 'web', 'workers-market-data', 'workers-market-stream',
  'workers-backtest', 'workers-execution',
];

const rollbackSection = (document) => {
  const start = document.indexOf('### Rollback from stack cutover');
  const end = document.indexOf('\nLocal validation before using the stack manifest:', start);
  return start >= 0 && end > start ? document.slice(start, end) : '';
};

const cacheRollbackSection = (document) => {
  const start = document.indexOf('## 3) Rollback');
  const end = document.indexOf('## 4) Exit Criteria', start);
  return start >= 0 && end > start ? document.slice(start, end) : '';
};

const checkCacheRollbackPath = (section) => {
  const step2Start = section.indexOf('\n2. ');
  const step3Start = section.indexOf('\n3. ', step2Start);
  if (step2Start < 0 || step3Start < 0) return ['CACHE_API_ROLLBACK_GATE_MISSING'];
  const step2 = section.slice(step2Start, step3Start);
  const required = [
    'deployment-rollback-playbook.md#rollback-modes',
    'coolify-linux-vps-setup-guide.md#rollback-from-stack-cutover',
    'any** new Service Stack process starts', 'before domain',
    'Running=false', 'Pid=0', 'all four new workers',
    'in-flight/`UNKNOWN`', 'schema compatibility',
    'Mode A requires proof', 'STOP/NO-GO',
  ];
  return required.every((item) => step2.includes(item)) &&
    section.includes('does not start an old API or worker')
    ? [] : ['CACHE_API_ROLLBACK_GATE_MISSING'];
};

const checkOrder = (section) => {
  const markers = [...section.matchAll(/^(\d+)\. \*\*([^*]+)\*\*/gm)];
  const issues = [];
  if (markers.length !== titles.length) return ['ROLLBACK_STEPS_INCOMPLETE'];
  const steps = markers.map((marker, index) =>
    section.slice(marker.index, markers[index + 1]?.index ?? section.length));
  for (let index = 0; index < titles.length; index += 1) {
    if (Number(markers[index][1]) !== index + 1 || markers[index][2] !== titles[index]) {
      issues.push('ROLLBACK_ORDER_INVALID');
      break;
    }
  }
  if (processNames.some((name) => !steps[1].includes(`\`${name}\``)) ||
      !steps[1].includes('Running=false') || !steps[1].includes('Pid=0') ||
      !steps[1].includes('STOP/NO-GO')) {
    issues.push('EXIT_READBACK_MISSING');
  }
  if (!steps[2].includes('UNKNOWN') || !steps[2].includes('STOP/NO-GO') ||
      !steps[2].includes('requeue') || !steps[2].includes('order')) {
    issues.push('IN_FLIGHT_DECISION_MISSING');
  }
  if (!steps[3].includes('schema') || !steps[3].includes('SHAs') ||
      !steps[3].includes('unproven')) {
    issues.push('SCHEMA_COMPATIBILITY_MISSING');
  }
  if (!steps[4].includes('Only after steps 2–4 pass') ||
      !steps[4].includes('repeat the') || !steps[4].includes('Running=false') ||
      !steps[4].includes('Pid=0') || !steps[4].includes('starting the old API') ||
      !steps[4].includes('four worker')) {
    issues.push('OLD_START_GUARD_MISSING');
  }
  return issues;
};

// A fixture-level procedural model, never proof of actual Coolify/Docker state.
const assessMode = ({ mode, anyNewStarted, noStartProof, readbacks,
  inventoryComplete, unresolvedInFlight, unknownOutcome, schemaCompatible }) => {
  if (unresolvedInFlight !== false || unknownOutcome !== false ||
      schemaCompatible !== true) return 'NO_GO';
  if (mode === 'A') {
    return anyNewStarted === false && noStartProof === true ? 'PROCEDURAL_ALLOW' : 'NO_GO';
  }
  if (mode !== 'D' || inventoryComplete !== true ||
      processNames.some((name) => readbacks?.[name]?.running !== false ||
        readbacks?.[name]?.pid !== 0)) return 'NO_GO';
  return 'PROCEDURAL_ALLOW';
};

test('canonical rollback documents stop and exit readback before old startup', () => {
  const canonical = read('docs/operations/coolify-linux-vps-setup-guide.md');
  const playbook = read('docs/operations/deployment-rollback-playbook.md');
  const smoke = read('docs/operations/post-deploy-smoke-checklist.md');
  const incident = read('docs/operations/deployment-incident-playbook.md');
  const local = read('docs/operations/v1-local-rollback-checklist.md');
  const trigger = read('docs/operations/coolify-trigger-wiring.md');
  const promotion = read('docs/operations/dev-stage-prod-promotion-contract.md');
  const v1Ops = read('docs/operations/v1-ops-runbook.md');
  const operator = read('docs/operations/operator-handbook.md');
  const fallback = read('docs/operations/vps-docker-compose-fallback-guide.md');
  const readiness = read('docs/operations/deployment-readiness-gates.md');
  const migration = read('docs/operations/deployment-migration-strategy.md');
  const agent = read('docs/operations/agent-deployment-skill-template.md');
  const runtime = read('docs/operations/runtime-incident-triage-matrix.md');
  const release = read('docs/operations/v1-release-gate-runbook.md');
  assert.deepEqual(checkOrder(rollbackSection(canonical)), []);
  assert.match(rollbackSection(canonical), /first start of \*\*any\*\* new stack process/);
  assert.match(rollbackSection(canonical), /before domain\s+cutover/);
  for (const document of [playbook, smoke, incident, local, trigger, promotion, v1Ops, fallback]) {
    assert.match(document, /coolify-linux-vps-setup-guide\.md#rollback-from-stack-cutover/);
  }
  assert.match(operator, /deployment-rollback-playbook\.md#rollback-modes/);
  for (const document of [readiness, migration, agent]) {
    assert.match(document, /deployment-rollback-playbook\.md#rollback-modes/);
  }
  for (const document of [runtime, release]) {
    assert.match(document, /deployment-rollback-playbook\.md/);
  }
  assert.match(playbook, /no new stack process ever started/);
  assert.match(playbook, /before or after domain cutover/);
  assert.match(trigger, /A one-click restore is not an\s+exception/);
  assert.match(read('docs/operations/operations-documentation.md'),
    /stale-cache-incident-playbook\.md/);
});

test('stale-cache API rollback selects A/D and blocks an unguarded old API start', () => {
  const good = cacheRollbackSection(read('docs/operations/stale-cache-incident-playbook.md'));
  assert.deepEqual(checkCacheRollbackPath(good), []);
  const unsafe = good.replace(/\n2\. [\s\S]*?(?=\n3\. )/,
    '\n2. Roll back API to the previous release.');
  assert.ok(checkCacheRollbackPath(unsafe).includes('CACHE_API_ROLLBACK_GATE_MISSING'));
});

test('restoring old API before new process exit fails the static gate', () => {
  const good = rollbackSection(read('docs/operations/coolify-linux-vps-setup-guide.md'));
  const verifyAt = good.indexOf('2. **Verify all new processes stopped.**');
  const reconcileAt = good.indexOf('3. **Resolve in-flight and unknown work.**');
  const restoreAt = good.indexOf('5. **Restore old applications.**');
  const afterStepsAt = good.indexOf('\nRun `pnpm run', restoreAt);
  const verify = good.slice(verifyAt, reconcileAt).replace(/^2\./, '5.');
  const restore = good.slice(restoreAt, afterStepsAt).replace(/^5\./, '2.');
  const bad = good.slice(0, verifyAt) + restore + good.slice(reconcileAt, restoreAt) +
    verify + good.slice(afterStepsAt);
  assert.ok(checkOrder(bad).includes('ROLLBACK_ORDER_INVALID'));
});

test('missing exit readback or UNKNOWN decision fails the static gate', () => {
  const good = rollbackSection(read('docs/operations/coolify-linux-vps-setup-guide.md'));
  assert.ok(checkOrder(good.replace('Running=false', 'stopped')).includes('EXIT_READBACK_MISSING'));
  const missingUnknown = good.replace(/(3\. \*\*Resolve[\s\S]*?)`UNKNOWN`/, '$1unconfirmed');
  assert.ok(checkOrder(missingUnknown).includes('IN_FLIGHT_DECISION_MISSING'));
});

test('mode A refuses a partial stack start; mode D allows a fully verified plan', () => {
  const safe = {
    anyNewStarted: true,
    noStartProof: false,
    readbacks: Object.fromEntries(processNames.map((name) =>
      [name, { running: false, pid: 0 }])),
    inventoryComplete: true,
    unresolvedInFlight: false,
    unknownOutcome: false,
    schemaCompatible: true,
  };
  for (const mode of ['A', 'B', 'C']) {
    assert.equal(assessMode({ ...safe, mode }), 'NO_GO');
  }
  assert.equal(assessMode({ ...safe, mode: 'D' }), 'PROCEDURAL_ALLOW');
  assert.equal(assessMode({ ...safe, mode: 'D', readbacks: {
    ...safe.readbacks, api: { running: true, pid: 777 },
  } }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'D', unknownOutcome: true }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'D', unresolvedInFlight: true }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'D', schemaCompatible: false }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'D', inventoryComplete: false }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'D', unresolvedInFlight: null }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'D', unknownOutcome: null }), 'NO_GO');
  assert.equal(assessMode({ ...safe, mode: 'A', anyNewStarted: false, noStartProof: true }),
    'PROCEDURAL_ALLOW');
  assert.equal(assessMode({ ...safe, mode: 'A', anyNewStarted: null }), 'NO_GO');
});
