import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relativePath) => fs.readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
const titles = [
  'Stop new API and workers.',
  'Verify new consumers stopped.',
  'Resolve in-flight and unknown work.',
  'Confirm rollback compatibility.',
  'Restore old applications.',
];

const rollbackSection = (document) => {
  const start = document.indexOf('### Rollback from stack cutover');
  const end = document.indexOf('\nLocal validation before using the stack manifest:', start);
  return start >= 0 && end > start ? document.slice(start, end) : '';
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
  const fiveConsumers = [
    '`api`', '`workers-market-data`', '`workers-market-stream`',
    '`workers-backtest`', '`workers-execution`',
  ];
  if (fiveConsumers.some((name) => !steps[1].includes(name)) ||
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

test('canonical rollback documents stop and exit readback before old startup', () => {
  const canonical = read('docs/operations/coolify-linux-vps-setup-guide.md');
  const playbook = read('docs/operations/deployment-rollback-playbook.md');
  const smoke = read('docs/operations/post-deploy-smoke-checklist.md');
  const incident = read('docs/operations/deployment-incident-playbook.md');
  const local = read('docs/operations/v1-local-rollback-checklist.md');
  assert.deepEqual(checkOrder(rollbackSection(canonical)), []);
  assert.match(playbook, /coolify-linux-vps-setup-guide\.md#rollback-from-stack-cutover/);
  assert.match(smoke, /coolify-linux-vps-setup-guide\.md#rollback-from-stack-cutover/);
  assert.match(incident, /coolify-linux-vps-setup-guide\.md#rollback-from-stack-cutover/);
  assert.match(local, /coolify-linux-vps-setup-guide\.md#rollback-from-stack-cutover/);
  assert.match(playbook, /do not use this fast path/);
});

test('restoring old API before new process exit fails the static gate', () => {
  const good = rollbackSection(read('docs/operations/coolify-linux-vps-setup-guide.md'));
  const verifyAt = good.indexOf('2. **Verify new consumers stopped.**');
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
  assert.ok(checkOrder(good.replace('`UNKNOWN`', 'unconfirmed')).includes('IN_FLIGHT_DECISION_MISSING'));
});
