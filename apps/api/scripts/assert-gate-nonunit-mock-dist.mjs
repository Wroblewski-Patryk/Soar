import assert from 'node:assert/strict';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Strip the trailing separator before lstat: lstat("link/") can follow a link.
const distPath = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const verifierPath = fileURLToPath(new URL(
  '../dist/modules/orders/orders.internalGateNonunitMock.js', import.meta.url,
));
const issuerPath = fileURLToPath(new URL(
  '../dist/test/internalGateNonunitMockAdmission.js', import.meta.url,
));
assert.ok(existsSync(distPath), 'Build the API before checking the production artifact');
for (let path = distPath; ; path = dirname(path)) {
  const entry = lstatSync(path);
  assert.ok(!entry.isSymbolicLink(), `Gate nonunit artifact path contains a symlink or junction: ${path}`);
  assert.ok(entry.isDirectory(), `Gate nonunit artifact path is not a directory: ${path}`);
  if (dirname(path) === path) break;
}
assert.ok(existsSync(verifierPath), 'Build the API before checking the production artifact');
assert.ok(!existsSync(issuerPath), 'Test-only permit issuer must be absent from dist');

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

// Parse the emitted CommonJS module without loading or executing it. Any new
// top-level statement or export requires review before this build can pass.
const source = ts.createSourceFile(verifierPath, readFileSync(verifierPath, 'utf8'),
  ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
assert.equal(source.parseDiagnostics.length, 0, 'Gate nonunit verifier must parse as JavaScript');
const describeStatement = (statement) => {
  if (ts.isExpressionStatement(statement)) {
    const expression = statement.expression;
    if (ts.isStringLiteral(expression) && expression.text === 'use strict') return 'strict';
    if (statement.getText(source) ===
        'Object.defineProperty(exports, "__esModule", { value: true });') return 'es-module';
    if (ts.isBinaryExpression(expression) &&
        expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isPropertyAccessExpression(expression.left) &&
        ts.isIdentifier(expression.left.expression) &&
        expression.left.expression.text === 'exports' &&
        expression.left.name.text === 'matchesInternalGateNonunitMockPermit') {
      if (expression.right.getText(source) === 'void 0') return 'export-init';
      if (ts.isIdentifier(expression.right) &&
          expression.right.text === 'matchesInternalGateNonunitMockPermit') return 'export-final';
    }
  }
  if (ts.isVariableStatement(statement) && statement.declarationList.declarations.length === 1) {
    const declaration = statement.declarationList.declarations[0];
    if (ts.isIdentifier(declaration.name)) {
      const { text: name } = declaration.name;
      if (name === 'node_crypto_1' &&
          declaration.initializer?.getText(source) === 'require("node:crypto")') return 'crypto';
      if (name === 'publicKey' && declaration.initializer &&
          ts.isNoSubstitutionTemplateLiteral(declaration.initializer))
        return 'public-key';
      if ((name === 'localTestDatabase' || name === 'matchesInternalGateNonunitMockPermit') &&
          declaration.initializer && ts.isArrowFunction(declaration.initializer)) return name;
    }
  }
  return 'unexpected';
};
assert.deepEqual(source.statements.map(describeStatement), [
  'strict', 'es-module', 'export-init', 'crypto', 'public-key',
  'localTestDatabase', 'matchesInternalGateNonunitMockPermit', 'export-final',
], 'Gate nonunit verifier has unexpected top-level code or exports');
process.stdout.write('Gate nonunit production artifact: verification only\n');
