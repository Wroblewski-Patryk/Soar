import assert from 'node:assert/strict';
import { cpSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { assertArtifact, compileExpectedArtifact } from './assert-gate-nonunit-mock-dist.mjs';

const apiPath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const productionDist = join(apiPath, 'dist');
const tempParent = join(apiPath, 'tmp');
const botsName = join('modules', 'bots', 'bots.service.js');
const verifierName = join('modules', 'orders', 'orders.internalGateNonunitMock.js');
const bindingLine = 'Object.defineProperty(o, k2, desc);';

test('gate nonunit artifact matches a fresh compiler emit without loading the artifact', (t) => {
  const expected = compileExpectedArtifact();
  mkdirSync(tempParent, { recursive: true });
  const tempPath = mkdtempSync(join(tempParent, 'gate-nonunit-fixture-'));
  try {
    const candidateDist = join(tempPath, 'dist');
    cpSync(productionDist, candidateDist, { recursive: true });
    const botsPath = join(candidateDist, botsName);
    const verifierPath = join(candidateDist, verifierName);
    const injection = join(candidateDist, 'injection.js');
    const botsContent = readFileSync(botsPath, 'utf8');
    const verifierContent = readFileSync(verifierPath, 'utf8');
    assert.ok(botsContent.includes(bindingLine), 'Fixture needs emitted __createBinding');
    assert.ok(botsContent.includes('var __exportStar ='), 'Fixture needs emitted __exportStar');

    const cases = [
      { name: 'clean artifact', expected: 'pass' },
      {
        name: 'unexpected computed export file',
        injection: 'exports["markInternalGateNonunitMock" + "Pretrade"] = () => true;',
        expected: 'file count differs',
      },
      {
        name: 'computed re-export',
        bots: `${botsContent}\n__exportStar({ ["markInternalGateNonunitMock" + "Pretrade"]: () => true }, exports);`,
        expected: 'differs from the compiler output',
      },
      {
        name: 'mutated __createBinding',
        bots: botsContent.replace(bindingLine,
          'Object.defineProperty(o, "markInternalGateNonunitMock" + "Pretrade", { value: true });'),
        expected: 'differs from the compiler output',
      },
      {
        name: 'reassigned __exportStar',
        bots: `${botsContent}\n__exportStar = (m, o) => Object.defineProperty(o, "markInternalGateNonunitMock" + "Pretrade", { value: true });`,
        expected: 'differs from the compiler output',
      },
      {
        name: 'injected this.__createBinding before canonical helper',
        bots: botsContent.replace('var __createBinding =',
          'this["__createBinding"] = (o,m,k) => { o["markInternalGateNonunitMock" + "Pretrade"] = m[k]; };\nvar __createBinding ='),
        expected: 'differs from the compiler output',
      },
      {
        name: 'changed unrelated emitted content',
        bots: `${botsContent}\n// unexpected content`,
        expected: 'differs from the compiler output',
      },
      { name: 'missing emitted file', missingBots: true, expected: 'file count differs' },
      {
        name: 'private key',
        injection: '-----BEGIN PRIVATE KEY-----\nQA_PRIVATE_SENTINEL',
        expected: 'test permit issuer, marker or private key',
      },
      {
        name: 'pretrade marker',
        injection: 'markInternalGateNonunitMockPretrade',
        expected: 'test permit issuer, marker or private key',
      },
      {
        name: 'verifier is never executed',
        verifier: `${verifierContent}\nconsole.log("QA_PRIVATE_SENTINEL");\n`,
        expected: 'differs from the compiler output',
      },
    ];
    for (const fixture of cases) {
      writeFileSync(botsPath, fixture.bots ?? botsContent);
      writeFileSync(verifierPath, fixture.verifier ?? verifierContent);
      if (fixture.missingBots) rmSync(botsPath);
      if (fixture.injection) writeFileSync(injection, fixture.injection);
      else rmSync(injection, { force: true });
      if (fixture.expected === 'pass') {
        assert.doesNotThrow(() => assertArtifact(candidateDist, expected), fixture.name);
      } else {
        assert.throws(() => assertArtifact(candidateDist, expected), (error) => {
          assert.ok(error.message.includes(fixture.expected), fixture.name);
          assert.ok(!error.message.includes('QA_PRIVATE_SENTINEL'),
            `${fixture.name}: secret sentinel must not be printed`);
          return true;
        }, fixture.name);
      }
      t.diagnostic(`${fixture.name}: ${fixture.expected === 'pass' ? 'accepted' : 'rejected'}`);
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
