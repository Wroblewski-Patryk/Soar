import assert from 'node:assert/strict';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const apiPath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDistPath = join(apiPath, 'dist');
const configPath = join(apiPath, 'tsconfig.build.json');
const forbidden = /BEGIN PRIVATE KEY|createInternalGateNonunitMockPermit|markInternalGateNonunitMockPretrade|\bissuePermit\b|internalGateNonunitMockAdmission/;

const artifactName = (root, path) => {
  const name = relative(root, path);
  assert.ok(name && !name.startsWith('..') && !isAbsolute(name),
    'Compiler emitted outside the API dist directory');
  return name.replaceAll('\\', '/');
};

// Compile the same project into memory. This does not load or execute emitted JS.
// Comparing every emitted byte also rejects unrecognized export-helper tricks in dist.
export const compileExpectedArtifact = () => {
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  assert.equal(config.error, undefined, 'Cannot read API build configuration');
  const parsed = ts.parseJsonConfigFileContent(
    config.config, ts.sys, apiPath, undefined, configPath,
  );
  assert.equal(parsed.errors.length, 0, 'API build configuration is invalid');
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  assert.equal(ts.getPreEmitDiagnostics(program).length, 0,
    'API source has compiler diagnostics');
  const expected = new Map();
  const emitted = program.emit(undefined, (path, content, writeByteOrderMark) => {
    const name = artifactName(buildDistPath, resolve(path));
    assert.ok(!expected.has(name), `Compiler emitted a duplicate path: ${name}`);
    expected.set(name, Buffer.from(`${writeByteOrderMark ? '\uFEFF' : ''}${content}`, 'utf8'));
  });
  assert.ok(!emitted.emitSkipped && emitted.diagnostics.length === 0 && expected.size > 0,
    'API compiler did not produce a clean artifact');
  return expected;
};

export const assertArtifact = (candidateDistPath, expected) => {
  // Strip the trailing separator before lstat: lstat("link/") can follow a link.
  const distPath = resolve(candidateDistPath);
  assert.ok(existsSync(distPath), 'Build the API before checking the production artifact');
  for (let path = distPath; ; path = dirname(path)) {
    const entry = lstatSync(path);
    assert.ok(!entry.isSymbolicLink(), `Gate nonunit artifact path contains a symlink or junction: ${path}`);
    assert.ok(entry.isDirectory(), `Gate nonunit artifact path is not a directory: ${path}`);
    if (dirname(path) === path) break;
  }
  const verifierPath = join(distPath, 'modules', 'orders', 'orders.internalGateNonunitMock.js');
  const issuerPath = join(distPath, 'test', 'internalGateNonunitMockAdmission.js');
  assert.ok(existsSync(verifierPath), 'Build the API before checking the production artifact');
  assert.ok(!existsSync(issuerPath), 'Test-only permit issuer must be absent from dist');

  const actual = new Map();
  const checkDirectory = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      const name = artifactName(distPath, path);
      assert.ok(!entry.isSymbolicLink(), `Gate nonunit artifact contains a symlink: ${name}`);
      if (entry.isDirectory()) {
        checkDirectory(path);
        continue;
      }
      assert.ok(entry.isFile(), `Gate nonunit artifact contains an unexpected entry: ${name}`);
      const content = readFileSync(path);
      if (forbidden.test(content.toString('utf8'))) {
        throw new Error(`Gate nonunit artifact contains a test permit issuer, marker or private key: ${name}`);
      }
      actual.set(name, content);
    }
  };
  checkDirectory(distPath);
  assert.equal(actual.size, expected.size,
    'Gate nonunit artifact file count differs from the compiler output');
  for (const [name, content] of expected) {
    if (!actual.has(name) || !actual.get(name).equals(content)) {
      throw new Error(`Gate nonunit artifact differs from the compiler output: ${name}`);
    }
  }

  // Keep a narrow independent check of the security-critical verifier shape.
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
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length, 2, 'Gate nonunit artifact checker accepts no CLI overrides');
  const expected = compileExpectedArtifact();
  assertArtifact(buildDistPath, expected);
  process.stdout.write(`Gate nonunit production artifact: ${expected.size} compiler-identical files, verification only\n`);
}
