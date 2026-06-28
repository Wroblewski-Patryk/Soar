import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { main, matches, normalize, parseCsv, readCsv, splitRefs } from './triageJourneyEvidence.mjs';

test('parseCsv handles quoted commas, escaped quotes, CRLF, and blank rows', () => {
  assert.deepEqual(parseCsv('id,name\r\n1,"alpha, beta"\r\n2,"quote ""ok"""\r\n\r\n'), [
    ['id', 'name'],
    ['1', 'alpha, beta'],
    ['2', 'quote "ok"'],
  ]);
  assert.throws(() => parseCsv('id,name\n1,"unterminated'), /unclosed quoted field/);
});

test('readCsv maps rows to headers from injected fixture files', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'soar-journey-csv-'));
  try {
    const indices = path.join(dir, 'docs', 'architecture', 'indices');
    await mkdir(indices, { recursive: true });
    await writeFile(path.join(indices, 'user-action-index.csv'), 'id,api_routes\nact-1,"api-1; api-2"\n');

    assert.deepEqual(readCsv('user-action-index.csv', { root: dir }), [{ id: 'act-1', api_routes: 'api-1; api-2' }]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('query helpers normalize and match indexed evidence records', () => {
  assert.equal(normalize(' Dashboard '), ' dashboard ');
  assert.deepEqual(splitRefs('api-1; api-2|chain-1'), ['api-1', 'api-2', 'chain-1']);
  assert.equal(matches({ route: '/dashboard', status: 'verified' }, 'dash'), true);
});

test('main prints primary action and related chain/API evidence from injected CSV records', () => {
  const csv = {
    'user-action-index.csv': [
      {
        id: 'action-dashboard',
        source_node_id: 'node-1',
        route_or_entrypoint: '/dashboard',
        action_kind: 'view',
        safety_boundary: 'read-only',
        proof_status: 'missing',
        gap_severity: 'P1',
        gaps: 'needs proof',
        api_routes: 'api-dashboard',
        function_chains: 'chain-dashboard',
        backend_functions: '',
        data_models: '',
        tests: 'scripts/triageJourneyEvidence.test.mjs',
        docs: 'docs/status/example.md',
        evidence: '',
        next_validation: 'run local proof',
      },
    ],
    'web-journey-index.csv': [],
    'function-chain-evidence-index.csv': [{ id: 'chain-dashboard', status: 'implemented', gap_severity: 'P1', gaps: 'needs proof' }],
    'api-surface-evidence-index.csv': [{ id: 'api-dashboard', route: '/api/dashboard', verification_status: 'missing', gap_severity: 'P1', gaps: 'needs proof' }],
  };
  const logs = [];
  const result = main({
    argv: ['--query', 'dashboard'],
    consoleImpl: { log: (message) => logs.push(message) },
    readCsvImpl: (name) => csv[name] ?? [],
  });

  assert.equal(result.status, 0);
  assert.equal(result.relatedChains.length, 1);
  assert.equal(result.relatedApis.length, 1);
  assert.match(logs.join('\n'), /Primary Action/);
  assert.match(logs.join('\n'), /api-dashboard/);
});
