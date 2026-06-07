import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT_DIR = process.cwd();
const WEB_SRC_DIR = path.join(ROOT_DIR, "apps/web/src");
const APP_DIR = path.join(WEB_SRC_DIR, "app");
const OUT_DEFAULT = path.join(
  ROOT_DIR,
  "history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json"
);

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const ROUTE_FILE_PATTERN = /[\\/]page\.(?:ts|tsx|js|jsx)$/i;
const TEST_FILE_PATTERN = /\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/i;
const SHARED_FOUNDATION_PATTERNS = [
  /[\\/]src[\\/]ui[\\/]/,
  /[\\/]src[\\/]app[\\/]layout\.(?:ts|tsx|js|jsx)$/i,
  /[\\/]src[\\/]app[\\/]\(public\)[\\/]layout\.(?:ts|tsx|js|jsx)$/i,
  /[\\/]src[\\/]app[\\/]admin[\\/]layout\.(?:ts|tsx|js|jsx)$/i,
  /[\\/]src[\\/]ui[\\/]components[\\/]/,
];

const AUDIT_EXCLUDED_PATTERNS = [
  /[\\/]src[\\/]i18n[\\/]/,
];

const LOCAL_COPY_PATTERNS = [
  /const\s+\w*copy\w*\s*=\s*(?:useMemo\s*\(\s*\(\)\s*=>\s*)?\(\s*{[\s\S]*?\b(?:en|pl|pt)\s*:/i,
  /const\s+\w*copy\w*\s*=\s*locale\s*===\s*['"]\w+['"]\s*\?[\s\S]*?:[\s\S]*?$/i,
  /const\s+(?:EN|PL|PT)_COPY\s*=\s*{/m,
];
const FALLBACK_PL_PATTERN = /(?:\?\?|\|\|)\s*['"]pl['"]|(?:locale|resolvedLocale|nextLocale)\s*=\s*['"]pl['"]/;
const HARD_CODED_ATTRIBUTE_PATTERN =
  /\b(?:title|placeholder|aria-label|aria-placeholder)\s*=\s*['"`](?=[^'"`{}]*[A-Za-z])[^'"`{][^'"`]*['"`]/g;
const HARD_CODED_TOAST_PATTERN =
  /toast\.(?:success|error|info|warning)\s*\(\s*(?:'[^']+'|"[^"]+"|`[^$`][^`]*`)/g;

export const normalize = (value) => value.replace(/\\/g, "/");
export const toRelative = (absolutePath, rootDir = ROOT_DIR) => normalize(path.relative(rootDir, absolutePath));

export const parseArgs = (args = process.argv.slice(2), options = {}) => {
  const rootDir = options.rootDir ?? ROOT_DIR;
  let outFile = OUT_DEFAULT;
  let help = false;

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (current === "--out") {
      const next = args[index + 1];
      if (!next) {
        throw new Error("Missing value for --out.");
      }
      outFile = path.resolve(rootDir, next);
      index += 1;
      continue;
    }
    if (current === "--help") {
      help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${current}`);
  }

  return { outFile, help };
};

export const listSourceFiles = (dirPath) => {
  const stack = [dirPath];
  const files = [];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (TEST_FILE_PATTERN.test(entry.name)) continue;
      if (!SOURCE_EXTENSIONS.includes(path.extname(entry.name))) continue;
      files.push(absolutePath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
};

export const resolveScriptKind = (filePath) => {
  const extension = path.extname(filePath);
  if (extension === ".tsx") return ts.ScriptKind.TSX;
  if (extension === ".jsx") return ts.ScriptKind.JSX;
  if (extension === ".js") return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
};

export const readImports = (filePath, sourceText) => {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    resolveScriptKind(filePath)
  );

  if (sourceFile.parseDiagnostics.length > 0) {
    const diagnostics = sourceFile.parseDiagnostics.map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      const lineInfo = diagnostic.start
        ? sourceFile.getLineAndCharacterOfPosition(diagnostic.start)
        : null;
      if (!lineInfo) return message;
      return `L${lineInfo.line + 1}:C${lineInfo.character + 1} ${message}`;
    });

    return {
      imports: [],
      parseErrors: diagnostics,
    };
  }

  const imports = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier.text);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return {
    imports,
    parseErrors: [],
  };
};

export const resolveAliasImport = (specifier, webSrcDir = WEB_SRC_DIR) => {
  if (!specifier.startsWith("@/")) return null;
  return path.join(webSrcDir, specifier.slice(2));
};

export const resolveCandidateFile = (basePath) => {
  if (SOURCE_EXTENSIONS.includes(path.extname(basePath)) && fs.existsSync(basePath)) {
    return basePath;
  }

  for (const extension of SOURCE_EXTENSIONS) {
    const withExtension = `${basePath}${extension}`;
    if (fs.existsSync(withExtension)) return withExtension;
  }

  if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
    for (const extension of SOURCE_EXTENSIONS) {
      const asIndex = path.join(basePath, `index${extension}`);
      if (fs.existsSync(asIndex)) return asIndex;
    }
  }

  return null;
};

export const resolveImport = (fromFile, specifier, options = {}) => {
  const webSrcDir = options.webSrcDir ?? WEB_SRC_DIR;
  if (specifier.startsWith(".")) {
    return resolveCandidateFile(path.resolve(path.dirname(fromFile), specifier));
  }

  if (specifier.startsWith("@/")) {
    return resolveCandidateFile(resolveAliasImport(specifier, webSrcDir));
  }

  return null;
};

export const collectAncestorLayouts = (pageFilePath, options = {}) => {
  const appDir = options.appDir ?? APP_DIR;
  const result = [];
  let currentDir = path.dirname(pageFilePath);

  while (currentDir.startsWith(appDir)) {
    for (const extension of SOURCE_EXTENSIONS) {
      const layoutPath = path.join(currentDir, `layout${extension}`);
      if (fs.existsSync(layoutPath)) {
        result.push(layoutPath);
        break;
      }
    }
    if (currentDir === appDir) break;
    currentDir = path.dirname(currentDir);
  }

  return Array.from(new Set(result)).sort((left, right) => left.localeCompare(right));
};

export const safeRelativeLine = (fileSource, offset) => {
  const lineStarts = [0];
  for (let index = 0; index < fileSource.length; index += 1) {
    if (fileSource[index] === "\n") {
      lineStarts.push(index + 1);
    }
  }
  let line = 0;
  while (line + 1 < lineStarts.length && lineStarts[line + 1] <= offset) {
    line += 1;
  }
  return line + 1;
};

export const collectPatternMatches = (source, pattern) => {
  const matches = [];
  let match = pattern.exec(source);
  while (match) {
    const line = safeRelativeLine(source, match.index);
    matches.push({
      line,
      sample: match[0].slice(0, 160),
    });
    match = pattern.exec(source);
  }
  pattern.lastIndex = 0;
  return matches;
};

export const analyzeFileSource = (source) => {
  const hasLocalCopy = LOCAL_COPY_PATTERNS.some((pattern) => pattern.test(source));
  const hasFallbackPl = FALLBACK_PL_PATTERN.test(source);
  const attributeMatches = collectPatternMatches(source, HARD_CODED_ATTRIBUTE_PATTERN);
  const toastMatches = collectPatternMatches(source, HARD_CODED_TOAST_PATTERN).filter(
    (match) => !match.sample.includes("${")
  );
  const hardcodedMatches = [...attributeMatches, ...toastMatches].sort((left, right) => left.line - right.line);
  const hardcodedCount = hardcodedMatches.length;
  const score = hardcodedCount + (hasLocalCopy ? 6 : 0) + (hasFallbackPl ? 5 : 0);

  return {
    hasLocalCopy,
    hasFallbackPl,
    hardcodedCount,
    score,
    hardcodedSamples: hardcodedMatches.slice(0, 5),
  };
};

export const isSharedFoundationFile = (filePath) => {
  const normalized = normalize(filePath);
  return SHARED_FOUNDATION_PATTERNS.some((pattern) => pattern.test(normalized));
};

export const isAuditExcludedFile = (filePath) => {
  const normalized = normalize(filePath);
  return AUDIT_EXCLUDED_PATTERNS.some((pattern) => pattern.test(normalized));
};

export const buildRouteReachability = (routePages, dependencyGraph, options = {}) => {
  const result = new Map();

  for (const pageFile of routePages) {
    const visited = new Set([pageFile, ...collectAncestorLayouts(pageFile, options)]);
    const queue = [...visited];

    while (queue.length > 0) {
      const current = queue.shift();
      const imports = dependencyGraph.get(current) ?? [];
      for (const target of imports) {
      if (!target.startsWith(options.webSrcDir ?? WEB_SRC_DIR)) continue;
        if (visited.has(target)) continue;
        visited.add(target);
        queue.push(target);
      }
    }

    result.set(pageFile, Array.from(visited).sort((left, right) => left.localeCompare(right)));
  }

  return result;
};

export const run = (args = process.argv.slice(2), options = {}) => {
  const rootDir = options.rootDir ?? ROOT_DIR;
  const webSrcDir = options.webSrcDir ?? WEB_SRC_DIR;
  const appDir = options.appDir ?? APP_DIR;

  if (!fs.existsSync(webSrcDir)) {
    throw new Error(`Missing web source directory: ${webSrcDir}`);
  }

  const { outFile, help } = parseArgs(args, { rootDir });
  if (help) {
    console.log("Usage: node scripts/auditRouteReachableI18n.mjs [--out <file>]");
    return null;
  }

  const sourceFiles = listSourceFiles(webSrcDir);
  const routePages = sourceFiles.filter((filePath) => ROUTE_FILE_PATTERN.test(filePath));
  const sourceByFile = new Map();
  const dependencyGraph = new Map();
  const parserFailures = [];

  for (const filePath of sourceFiles) {
    const source = fs.readFileSync(filePath, "utf8");
    sourceByFile.set(filePath, source);
    const { imports, parseErrors } = readImports(filePath, source);
    if (parseErrors.length > 0) {
      parserFailures.push({
        filePath: toRelative(filePath),
        errors: parseErrors,
      });
      continue;
    }

    const resolvedImports = imports
      .map((specifier) => resolveImport(filePath, specifier, { webSrcDir }))
      .filter((value) => value && value.startsWith(webSrcDir));
    dependencyGraph.set(filePath, Array.from(new Set(resolvedImports)).sort((left, right) => left.localeCompare(right)));
  }

  if (parserFailures.length > 0) {
    const report = parserFailures
      .map(
        (entry) =>
          `${entry.filePath}\n${entry.errors.map((error) => `  - ${error}`).join("\n")}`
      )
      .join("\n");
    console.error("i18n route audit parser failure:");
    console.error(report);
    process.exit(1);
  }

  const routeReachability = buildRouteReachability(routePages, dependencyGraph, { appDir, webSrcDir });
  const reachableFiles = new Set();
  const routesByFile = new Map();

  for (const [routePage, files] of routeReachability.entries()) {
    for (const filePath of files) {
      reachableFiles.add(filePath);
      const current = routesByFile.get(filePath) ?? [];
      current.push(routePage);
      routesByFile.set(filePath, current);
    }
  }

  const fileFindings = Array.from(reachableFiles)
    .map((filePath) => {
      const source = sourceByFile.get(filePath);
      if (!source) {
        return null;
      }
      if (isAuditExcludedFile(filePath)) {
        return null;
      }
      const analysis = analyzeFileSource(source);
      if (analysis.score === 0) return null;

      return {
        filePath: toRelative(filePath, rootDir),
        isSharedFoundation: isSharedFoundationFile(filePath),
        hasLocalCopy: analysis.hasLocalCopy,
        hasFallbackPl: analysis.hasFallbackPl,
        hardcodedCount: analysis.hardcodedCount,
        score: analysis.score,
        hardcodedSamples: analysis.hardcodedSamples,
        routeReachableBy: (routesByFile.get(filePath) ?? [])
          .map((routePath) => toRelative(routePath, rootDir))
          .sort((left, right) => left.localeCompare(right)),
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.filePath.localeCompare(right.filePath);
    });

  const fileFindingByPath = new Map(fileFindings.map((item) => [item.filePath, item]));
  const routeFindings = Array.from(routeReachability.entries())
    .map(([routePage, files]) => {
      const issues = files
        .map((filePath) => fileFindingByPath.get(toRelative(filePath)))
        .filter(Boolean);
      const moduleIssues = issues.filter((item) => !item.isSharedFoundation);
      const sharedIssues = issues.filter((item) => item.isSharedFoundation);
      const moduleScore = moduleIssues.reduce((total, item) => total + item.score, 0);
      const sharedScore = sharedIssues.reduce((total, item) => total + item.score, 0);

      return {
        routePage: toRelative(routePage, rootDir),
        reachableFilesCount: files.length,
        issueFilesCount: issues.length,
        moduleIssueFilesCount: moduleIssues.length,
        sharedIssueFilesCount: sharedIssues.length,
        score: {
          module: moduleScore,
          shared: sharedScore,
        },
        topModuleFiles: moduleIssues
          .sort((left, right) => {
            if (right.score !== left.score) return right.score - left.score;
            return left.filePath.localeCompare(right.filePath);
          })
          .slice(0, 5)
          .map((item) => ({
            filePath: item.filePath,
            score: item.score,
          })),
      };
    })
    .sort((left, right) => left.routePage.localeCompare(right.routePage));

  const output = {
    version: "1.0.0",
    generatedAtUtc: new Date().toISOString(),
    rootDir: toRelative(rootDir, rootDir) || ".",
    scope: {
      scannedSourceFiles: sourceFiles.length,
      routePages: routePages.length,
      routeReachableFiles: reachableFiles.size,
    },
    summary: {
      filesWithFindings: fileFindings.length,
      filesWithLocalCopy: fileFindings.filter((item) => item.hasLocalCopy).length,
      filesWithFallbackPl: fileFindings.filter((item) => item.hasFallbackPl).length,
      filesWithHardcodedUiCandidates: fileFindings.filter((item) => item.hardcodedCount > 0).length,
      moduleFindingFiles: fileFindings.filter((item) => !item.isSharedFoundation).length,
      sharedFoundationFindingFiles: fileFindings.filter((item) => item.isSharedFoundation).length,
    },
    routeFindings,
    fileFindings,
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Route-reachable i18n audit written to ${toRelative(outFile, rootDir)}.`);
  console.log(
    `Summary: findings=${output.summary.filesWithFindings}, localCopy=${output.summary.filesWithLocalCopy}, fallbackPl=${output.summary.filesWithFallbackPl}, hardcoded=${output.summary.filesWithHardcodedUiCandidates}.`
  );
  return output;
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    run();
  } catch (error) {
    console.error("[i18n-audit] failed:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
