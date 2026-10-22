import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const apiPath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempParent = join(apiPath, 'tmp');
const checkerSource = join(apiPath, 'scripts', 'assert-gate-nonunit-mock-dist.mjs');
const verifierSource = join(apiPath, 'dist', 'modules', 'orders', 'orders.internalGateNonunitMock.js');
const reexportSource = readFileSync(join(apiPath, 'dist', 'modules', 'bots', 'bots.service.js'), 'utf8');
const bindingLine = 'Object.defineProperty(o, k2, desc);';
assert.ok(reexportSource.includes(bindingLine), 'Fixture needs the emitted __createBinding helper');
assert.ok(reexportSource.includes('var __exportStar ='), 'Fixture needs the emitted __exportStar helper');

test('gate nonunit artifact rejects export helper mutations without loading the artifact', () => {
  mkdirSync(tempParent, { recursive: true });
  const tempPath = mkdtempSync(join(tempParent, 'gate-nonunit-fixture-'));
  try {
    const scriptsPath = join(tempPath, 'scripts');
    const ordersPath = join(tempPath, 'dist', 'modules', 'orders');
    const unrelatedPath = join(tempPath, 'dist', 'unrelated');
    for (const directory of [scriptsPath, ordersPath, unrelatedPath])
      mkdirSync(directory, { recursive: true });
    const checker = join(scriptsPath, basename(checkerSource));
    const verifier = join(ordersPath, basename(verifierSource));
    const injection = join(unrelatedPath, 'injection.js');
    copyFileSync(checkerSource, checker);
    copyFileSync(verifierSource, verifier);
    const verifierContent = readFileSync(verifierSource, 'utf8');
    const cases = [
      { name: 'clean artifact', code: '', expected: 0 },
      {
        name: 'computed export',
        code: 'exports["markInternalGateNonunitMock" + "Pretrade"] = () => true;',
        expected: 1,
      },
      {
        name: 'computed re-export',
        code: `${reexportSource}\n__exportStar({ ["markInternalGateNonunitMock" + "Pretrade"]: () => true }, exports);`,
        expected: 1,
      },
      {
        name: 'mutated __createBinding',
        code: reexportSource.replace(bindingLine,
          'Object.defineProperty(o, "markInternalGateNonunitMock" + "Pretrade", { value: true });'),
        expected: 1,
      },
      {
        name: 'reassigned __exportStar',
        code: `${reexportSource}\n__exportStar = (m, o) => Object.defineProperty(o, "markInternalGateNonunitMock" + "Pretrade", { value: true });`,
        expected: 1,
      },
      { name: 'private key', code: '-----BEGIN PRIVATE KEY-----\nQA_PRIVATE_SENTINEL', expected: 1 },
      { name: 'pretrade marker', code: 'markInternalGateNonunitMockPretrade', expected: 1 },
      {
        name: 'verifier is never executed',
        code: '',
        verifierSuffix: '\nconsole.log("QA_PRIVATE_SENTINEL");\n',
        expected: 1,
      },
    ];
    for (const fixture of cases) {
      writeFileSync(injection, fixture.code);
      writeFileSync(verifier, verifierContent + (fixture.verifierSuffix ?? ''));
      const result = spawnSync(process.execPath, [checker], { encoding: 'utf8', timeout: 10_000 });
      assert.ifError(result.error);
      assert.equal(result.status, fixture.expected, fixture.name);
      assert.ok(!(result.stdout + result.stderr).includes('QA_PRIVATE_SENTINEL'),
        `${fixture.name}: secret sentinel must not be printed`);
    }
  } finally {
    const entry = lstatSync(tempPath);
    const parentEntry = lstatSync(tempParent);
    const relativePath = relative(realpathSync(apiPath), realpathSync(tempPath));
    assert.ok(entry.isDirectory() && !entry.isSymbolicLink() &&
      parentEntry.isDirectory() && !parentEntry.isSymbolicLink() &&
      relativePath.startsWith(`tmp${sep}gate-nonunit-fixture-`) &&
      relativePath === join('tmp', basename(tempPath)),
    'Fixture cleanup must stay inside API tmp');
    rmSync(tempPath, { recursive: true, force: true });
  }
});
