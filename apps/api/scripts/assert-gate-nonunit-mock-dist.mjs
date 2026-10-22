import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const verifierPath = fileURLToPath(new URL(
  '../dist/modules/orders/orders.internalGateNonunitMock.js', import.meta.url,
));
const issuerPath = fileURLToPath(new URL(
  '../dist/test/internalGateNonunitMockAdmission.js', import.meta.url,
));
assert.ok(existsSync(verifierPath), 'Build the API before checking the production artifact');
assert.ok(!existsSync(issuerPath), 'Test-only permit issuer must be absent from dist');

const exported = Object.keys(createRequire(import.meta.url)(verifierPath));
assert.deepEqual(exported, ['matchesInternalGateNonunitMockPermit']);
const artifact = readFileSync(verifierPath, 'utf8');
assert.doesNotMatch(artifact, /BEGIN PRIVATE KEY|createInternalGateNonunitMockPermit|markInternalGateNonunitMockPretrade|\bsign\(/);
process.stdout.write('Gate nonunit production artifact: verification only\n');
