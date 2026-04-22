import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = process.cwd();
const EXPECTED_LOCKFILE = "pnpm-lock.yaml";
const FORBIDDEN_LOCKFILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  "npm-shrinkwrap.json",
]);

const SOURCE_FILE_RE = /^apps\/(?:web|api)\/src\/.+\.(?:ts|tsx|js|jsx)$/;
const WEB_SOURCE_FILE_RE = /^apps\/web\/src\/.+\.(?:ts|tsx|js|jsx)$/;
const WEB_PRODUCTION_SOURCE_FILE_RE = /^apps\/web\/src\/.+\.(?:ts|tsx|js|jsx)$/;
const WEB_FEATURE_SOURCE_FILE_RE = /^apps\/web\/src\/features\/([^/]+)\/.+\.(?:ts|tsx|js|jsx)$/;
const WEB_FEATURE_FIELD_CONTROLS_RE =
  /^apps\/web\/src\/features\/([^/]+)\/components\/FieldControls\.(?:ts|tsx|js|jsx)$/;
const TEST_SOURCE_FILE_RE = /(?:^|\/)[^/]+\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/;
const WEB_GUARDRAIL_EXCLUDED_PATH_RE = /(?:^|\/)__fixtures__(?:\/|$)/;
const DEFAULT_MAX_FILE_BYTES = 90_000;
const SOURCE_FILE_BUDGET_RULES = [
  { match: /^apps\/api\/src\//, budget: 88_000 },
  { match: /^apps\/web\/src\//, budget: 95_000 },
];
const DEFAULT_MAX_FILE_LINES = 2_200;
const SOURCE_FILE_LINE_BUDGET_RULES = [
  { match: /^apps\/api\/src\//, budget: 1_700 },
  { match: /^apps\/web\/src\//, budget: 2_200 },
];
const PRODUCTION_MONOLITH_LINE_BUDGET = 1_000;
const STAGED_DECOMPOSITION_ALLOWLIST = new Set([
  "apps/web/src/features/backtest/components/BacktestRunDetails.tsx",
  "apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx",
]);
const LOCAL_COPY_ALLOWLIST = new Set([
]);
const HARD_CODED_UI_ALLOWLIST = new Set([
  "apps/web/src/features/backtest/components/BacktestCreateForm.tsx",
]);
const DUPLICATE_HELPER_SNAPSHOT_PATH =
  "docs/modules/_artifacts-cqlt-duplicate-helper-snapshot-2026-04-21.json";
const CODE_QUALITY_GUARDRAILS_DOC_PATH = "docs/governance/code-quality-guardrails.md";
const LOCAL_COPY_PATTERNS = [
  /copyByLocale/,
  /const\s+\w*copy\w*\s*=\s*locale\s*===/i,
  /const\s+\w*copy\w*\s*=\s*useMemo\(\s*\(\)\s*=>\s*locale\s*===/i,
  /const\s+\w*copy\w*\s*=\s*{[\s\S]*?\ben\s*:[\s\S]*?\bpl\s*:/i,
];
const HARDCODED_UI_PATTERNS = [
  /toast\.(?:success|error|info|warning)\s*\(\s*['"][^'"{][^'"]*['"]/g,
  /window\.confirm\(\s*['"][^'"{][^'"]*['"]/g,
  /\b(?:title|placeholder|aria-label|aria-placeholder)\s*=\s*['"][^'"{][^'"]*['"]/g,
  /\b(?:\w*(?:Label|Title|Description|Placeholder|Hint|Text)|emptyText)\s*=\s*['"][^'"{][^'"]*['"]/g,
  /\.(?:origin|source|status|reason)\s*\?\?\s*['"][^'"{][^'"]*['"]/g,
];

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
]);

const normalize = (value) => value.replace(/\\/g, "/");

const resolveSourceFileBudget = (filePath) => {
  for (const rule of SOURCE_FILE_BUDGET_RULES) {
    if (rule.match.test(filePath)) return rule.budget;
  }
  return DEFAULT_MAX_FILE_BYTES;
};

const resolveSourceFileLineBudget = (filePath) => {
  for (const rule of SOURCE_FILE_LINE_BUDGET_RULES) {
    if (rule.match.test(filePath)) return rule.budget;
  }
  return DEFAULT_MAX_FILE_LINES;
};

const isProductionSourceFile = (filePath) =>
  SOURCE_FILE_RE.test(filePath) && !TEST_SOURCE_FILE_RE.test(filePath);

const readTrackedFiles = () => {
  const output = execSync("git ls-files", { encoding: "utf8" });
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(normalize);
};

const collectForbiddenLockfilesOnDisk = (dirPath, acc = []) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      collectForbiddenLockfilesOnDisk(path.join(dirPath, entry.name), acc);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!FORBIDDEN_LOCKFILES.has(entry.name)) continue;
    const absolute = path.join(dirPath, entry.name);
    const relative = normalize(path.relative(ROOT_DIR, absolute));
    acc.push(relative);
  }
  return acc;
};

const validateLockfilePolicy = (trackedFiles) => {
  const errors = [];
  if (!trackedFiles.includes(EXPECTED_LOCKFILE)) {
    errors.push(`Missing required lockfile: ${EXPECTED_LOCKFILE}`);
  }

  const forbiddenTracked = trackedFiles.filter((filePath) => {
    const base = path.basename(filePath);
    return FORBIDDEN_LOCKFILES.has(base);
  });
  if (forbiddenTracked.length > 0) {
    errors.push(
      `Forbidden lockfiles tracked in git:\n${forbiddenTracked
        .map((filePath) => `  - ${filePath}`)
        .join("\n")}`
    );
  }

  const forbiddenOnDisk = collectForbiddenLockfilesOnDisk(ROOT_DIR);
  if (forbiddenOnDisk.length > 0) {
    errors.push(
      `Forbidden lockfiles present on disk:\n${forbiddenOnDisk
        .map((filePath) => `  - ${filePath}`)
        .join("\n")}`
    );
  }

  return errors;
};

const validateSourceFileBudgets = (trackedFiles) => {
  const oversize = [];
  for (const filePath of trackedFiles) {
    if (!SOURCE_FILE_RE.test(filePath)) continue;
    const absolute = path.join(ROOT_DIR, filePath);
    let stats;
    try {
      stats = fs.statSync(absolute);
    } catch {
      continue;
    }
    const budget = resolveSourceFileBudget(filePath);
    if (stats.size > budget) {
      oversize.push({
        filePath,
        size: stats.size,
        budget,
      });
    }
  }

  if (oversize.length === 0) return [];
  return [
    `Source file size budget exceeded:\n${oversize
      .map(
        ({ filePath, size, budget }) =>
          `  - ${filePath}: ${size} bytes (budget ${budget} bytes)`
      )
      .join("\n")}`,
  ];
};

const validateSourceFileLineBudgets = (trackedFiles) => {
  const oversize = [];
  for (const filePath of trackedFiles) {
    if (!isProductionSourceFile(filePath)) continue;
    const absolute = path.join(ROOT_DIR, filePath);
    let content;
    try {
      content = fs.readFileSync(absolute, "utf8");
    } catch {
      continue;
    }
    const lineCount = content.split(/\r?\n/).length;
    const budget = resolveSourceFileLineBudget(filePath);
    if (lineCount > budget) {
      oversize.push({
        filePath,
        lineCount,
        budget,
      });
    }
  }

  if (oversize.length === 0) return [];
  return [
    `Source file line budget exceeded:\n${oversize
      .map(
        ({ filePath, lineCount, budget }) =>
          `  - ${filePath}: ${lineCount} lines (budget ${budget} lines)`
      )
      .join("\n")}`,
  ];
};

const validateProductionMonolithLineBudget = (trackedFiles) => {
  const offenders = [];

  for (const filePath of trackedFiles) {
    if (!isProductionSourceFile(filePath)) continue;
    if (STAGED_DECOMPOSITION_ALLOWLIST.has(filePath)) continue;

    const absolute = path.join(ROOT_DIR, filePath);
    let content;
    try {
      content = fs.readFileSync(absolute, "utf8");
    } catch {
      continue;
    }

    const lineCount = content.split(/\r?\n/).length;
    if (lineCount > PRODUCTION_MONOLITH_LINE_BUDGET) {
      offenders.push({ filePath, lineCount });
    }
  }

  if (offenders.length === 0) return [];
  return [
    `Production monolith line budget exceeded (allowlist required before staged decomposition):\n${offenders
      .map(
        ({ filePath, lineCount }) =>
          `  - ${filePath}: ${lineCount} lines (budget ${PRODUCTION_MONOLITH_LINE_BUDGET} lines)`
      )
      .join("\n")}`,
  ];
};

const resolveCandidateFile = (baseAbsolutePath) => {
  const candidates = [
    baseAbsolutePath,
    `${baseAbsolutePath}.ts`,
    `${baseAbsolutePath}.tsx`,
    `${baseAbsolutePath}.js`,
    `${baseAbsolutePath}.jsx`,
    path.join(baseAbsolutePath, "index.ts"),
    path.join(baseAbsolutePath, "index.tsx"),
    path.join(baseAbsolutePath, "index.js"),
    path.join(baseAbsolutePath, "index.jsx"),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const stats = fs.statSync(candidate);
    if (!stats.isFile()) continue;
    return normalize(path.relative(ROOT_DIR, candidate));
  }

  return null;
};

const extractImportSpecifiers = (sourceText) => {
  const specifiers = [];

  const staticImportRegex = /(?:import|export)\s+[^'"`]*?\sfrom\s+['"`]([^'"`]+)['"`]/g;
  for (const match of sourceText.matchAll(staticImportRegex)) {
    specifiers.push(match[1]);
  }

  const dynamicImportRegex = /import\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  for (const match of sourceText.matchAll(dynamicImportRegex)) {
    specifiers.push(match[1]);
  }

  return specifiers;
};

const resolveWebImportSpecifier = (fromFilePath, specifier) => {
  let absoluteBasePath = null;

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    absoluteBasePath = path.resolve(path.dirname(path.join(ROOT_DIR, fromFilePath)), specifier);
  } else if (specifier.startsWith("@/")) {
    absoluteBasePath = path.resolve(ROOT_DIR, "apps", "web", "src", specifier.slice(2));
  } else {
    return null;
  }

  return resolveCandidateFile(absoluteBasePath);
};

const validateWebFormImportBoundaries = (trackedFiles) => {
  const violations = [];
  const webSourceFiles = trackedFiles.filter(
    (filePath) => WEB_SOURCE_FILE_RE.test(filePath) && !TEST_SOURCE_FILE_RE.test(filePath)
  );

  for (const sourceFilePath of webSourceFiles) {
    const sourceMatch = WEB_FEATURE_SOURCE_FILE_RE.exec(sourceFilePath);
    const sourceFeature = sourceMatch ? sourceMatch[1] : null;

    const absolutePath = path.join(ROOT_DIR, sourceFilePath);
    if (!fs.existsSync(absolutePath)) continue;
    const sourceText = fs.readFileSync(absolutePath, "utf8");
    const specifiers = extractImportSpecifiers(sourceText);

    for (const specifier of specifiers) {
      if (!specifier.includes("FieldControls")) continue;
      const resolvedImport = resolveWebImportSpecifier(sourceFilePath, specifier);
      if (!resolvedImport) continue;

      const targetMatch = WEB_FEATURE_FIELD_CONTROLS_RE.exec(resolvedImport);
      if (!targetMatch) continue;

      const targetFeature = targetMatch[1];
      if (sourceFeature && targetFeature === sourceFeature) continue;

      violations.push({
        sourceFilePath,
        sourceFeature,
        targetFeature,
        specifier,
        resolvedImport,
      });
    }
  }

  if (violations.length === 0) return [];

  return [
    `Web form import boundary violated (cross-feature generic FieldControls import detected):\n${violations
      .map(
        ({ sourceFilePath, sourceFeature, targetFeature, specifier, resolvedImport }) =>
          `  - ${sourceFilePath} (${sourceFeature ?? "non-feature"}) imports ${specifier} -> ${resolvedImport} (${targetFeature})`
      )
      .join("\n")}\nUse shared controls from apps/web/src/ui/forms/* instead.`,
  ];
};

const collectPatternMatches = (sourceText, patterns) => {
  const matches = [];

  for (const pattern of patterns) {
    if (pattern.global) {
      for (const match of sourceText.matchAll(pattern)) {
        matches.push(match[0]);
      }
      continue;
    }
    if (pattern.test(sourceText)) {
      matches.push(pattern.toString());
    }
  }

  return Array.from(new Set(matches));
};

const validateWebLocalCopyDictionaries = (trackedFiles) => {
  const offenders = [];

  for (const filePath of trackedFiles) {
    if (!WEB_PRODUCTION_SOURCE_FILE_RE.test(filePath)) continue;
    if (TEST_SOURCE_FILE_RE.test(filePath)) continue;
    if (WEB_GUARDRAIL_EXCLUDED_PATH_RE.test(filePath)) continue;
    if (LOCAL_COPY_ALLOWLIST.has(filePath)) continue;

    const absolute = path.join(ROOT_DIR, filePath);
    if (!fs.existsSync(absolute)) continue;
    const sourceText = fs.readFileSync(absolute, "utf8");
    const matches = collectPatternMatches(sourceText, LOCAL_COPY_PATTERNS);
    if (matches.length === 0) continue;

    offenders.push(`${filePath}\n    matches: ${matches.join(" | ")}`);
  }

  if (offenders.length === 0) return [];
  return [
    `Local copy dictionary guardrail violated in production web files:\n${offenders.join("\n")}\nMove user-facing strings to canonical i18n namespaces or a shared i18n-aware helper.`,
  ];
};

const validateWebHardcodedUiLiterals = (trackedFiles) => {
  const offenders = [];

  for (const filePath of trackedFiles) {
    if (!WEB_PRODUCTION_SOURCE_FILE_RE.test(filePath)) continue;
    if (TEST_SOURCE_FILE_RE.test(filePath)) continue;
    if (WEB_GUARDRAIL_EXCLUDED_PATH_RE.test(filePath)) continue;
    if (HARD_CODED_UI_ALLOWLIST.has(filePath)) continue;

    const absolute = path.join(ROOT_DIR, filePath);
    if (!fs.existsSync(absolute)) continue;
    const sourceText = fs.readFileSync(absolute, "utf8");
    const matches = collectPatternMatches(sourceText, HARDCODED_UI_PATTERNS);
    if (matches.length === 0) continue;

    offenders.push(`${filePath}\n    matches: ${matches.join(" | ")}`);
  }

  if (offenders.length === 0) return [];
  return [
    `Hardcoded UI literal guardrail violated in production web files:\n${offenders.join("\n")}\nUse canonical i18n keys or a shared exception helper documented in docs/governance/code-quality-guardrails.md.`,
  ];
};

const validateDuplicateHelperSnapshot = () => {
  const snapshotAbsolute = path.join(ROOT_DIR, DUPLICATE_HELPER_SNAPSHOT_PATH);
  if (!fs.existsSync(snapshotAbsolute)) {
    return [`Missing duplicate-helper snapshot: ${DUPLICATE_HELPER_SNAPSHOT_PATH}`];
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(snapshotAbsolute, "utf8"));
  } catch (error) {
    return [`Invalid duplicate-helper snapshot JSON at ${DUPLICATE_HELPER_SNAPSHOT_PATH}: ${String(error)}`];
  }

  const seams = Array.isArray(parsed?.seams) ? parsed.seams : null;
  if (!seams || seams.length === 0) {
    return [`Duplicate-helper snapshot must contain a non-empty "seams" array: ${DUPLICATE_HELPER_SNAPSHOT_PATH}`];
  }

  const ids = new Set();
  const errors = [];

  for (const seam of seams) {
    const seamId = typeof seam?.id === "string" ? seam.id : null;
    if (!seamId) {
      errors.push(`  - seam without string id`);
      continue;
    }
    if (ids.has(seamId)) {
      errors.push(`  - duplicate seam id: ${seamId}`);
    }
    ids.add(seamId);

    const filePaths = Array.isArray(seam?.files) ? seam.files : [];
    if (filePaths.length === 0) {
      errors.push(`  - ${seamId}: missing files`);
      continue;
    }

    for (const filePath of filePaths) {
      if (typeof filePath !== "string") {
        errors.push(`  - ${seamId}: non-string file entry`);
        continue;
      }
      const absolute = path.join(ROOT_DIR, normalize(filePath));
      if (!fs.existsSync(absolute)) {
        errors.push(`  - ${seamId}: missing file ${filePath}`);
      }
    }
  }

  if (errors.length === 0) return [];
  return [
    `Duplicate-helper snapshot validation failed for ${DUPLICATE_HELPER_SNAPSHOT_PATH}:\n${errors.join("\n")}`,
  ];
};

const validateCodeQualityGuardrailsDoc = () => {
  const absolute = path.join(ROOT_DIR, CODE_QUALITY_GUARDRAILS_DOC_PATH);
  return fs.existsSync(absolute)
    ? []
    : [`Missing code-quality guardrails doc: ${CODE_QUALITY_GUARDRAILS_DOC_PATH}`];
};

const run = () => {
  const trackedFiles = readTrackedFiles();
  const errors = [
    ...validateLockfilePolicy(trackedFiles),
    ...validateSourceFileBudgets(trackedFiles),
    ...validateSourceFileLineBudgets(trackedFiles),
    ...validateProductionMonolithLineBudget(trackedFiles),
    ...validateWebFormImportBoundaries(trackedFiles),
    ...validateWebLocalCopyDictionaries(trackedFiles),
    ...validateWebHardcodedUiLiterals(trackedFiles),
    ...validateDuplicateHelperSnapshot(),
    ...validateCodeQualityGuardrailsDoc(),
  ];

  if (errors.length > 0) {
    console.error("Repository guardrails check failed:");
    for (const error of errors) {
      console.error(`\n${error}`);
    }
    process.exit(1);
  }

  console.log("Repository guardrails check passed.");
  console.log(`- Lockfile policy: OK (${EXPECTED_LOCKFILE} only)`);
  console.log(
    `- Source file budget: OK (api ${SOURCE_FILE_BUDGET_RULES[0].budget} bytes, web ${SOURCE_FILE_BUDGET_RULES[1].budget} bytes)`
  );
  console.log(
    `- Source file line budget: OK (api ${SOURCE_FILE_LINE_BUDGET_RULES[0].budget} lines, web ${SOURCE_FILE_LINE_BUDGET_RULES[1].budget} lines)`
  );
  console.log(
    `- Production monolith budget: OK (${PRODUCTION_MONOLITH_LINE_BUDGET} lines with staged-decomposition allowlist)`
  );
  console.log(
    `- CQLT web copy guardrails: OK (local copy + hardcoded UI literals blocked outside documented allowlists)`
  );
};

run();
