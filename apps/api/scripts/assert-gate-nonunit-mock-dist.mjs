import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distPath = fileURLToPath(new URL('../dist/', import.meta.url));
const verifierPath = fileURLToPath(new URL(
  '../dist/modules/orders/orders.internalGateNonunitMock.js', import.meta.url,
));
const issuerPath = fileURLToPath(new URL(
  '../dist/test/internalGateNonunitMockAdmission.js', import.meta.url,
));
assert.ok(existsSync(verifierPath), 'Build the API before checking the production artifact');
assert.ok(!existsSync(issuerPath), 'Test-only permit issuer must be absent from dist');

const exported = Object.keys(createRequire(import.meta.url)(verifierPath));
assert.deepEqual(exported, ['matchesInternalGateNonunitMockPermit'],
  'Gate nonunit production verifier may export only the permit check');
const forbidden = /BEGIN PRIVATE KEY|createInternalGateNonunitMockPermit|markInternalGateNonunitMockPretrade|\bissuePermit\b|internalGateNonunitMockAdmission/;
const checkDirectory = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    const location = relative(distPath, path);
    assert.ok(!entry.isSymbolicLink(), `Gate nonunit artifact contains a symlink: ${location}`);
    if (entry.isDirectory()) {
      checkDirectory(path);
      continue;
    }
    assert.ok(entry.isFile(), `Gate nonunit artifact contains an unexpected entry: ${location}`);
    if (forbidden.test(readFileSync(path, 'utf8'))) {
      throw new Error(`Gate nonunit artifact contains a test permit issuer, marker or private key: ${location}`);
    }
  }
};
checkDirectory(distPath);
process.stdout.write('Gate nonunit production artifact: verification only\n');
