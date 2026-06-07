import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  analyzeFileSource,
  buildRouteReachability,
  collectAncestorLayouts,
  collectPatternMatches,
  isAuditExcludedFile,
  isSharedFoundationFile,
  listSourceFiles,
  normalize,
  parseArgs,
  readImports,
  resolveCandidateFile,
  resolveImport,
  run,
  safeRelativeLine,
  toRelative,
} from "./auditRouteReachableI18n.mjs";

test("parseArgs resolves output paths, help, and unknown arguments", () => {
  const rootDir = process.cwd();
  const options = parseArgs(["--out", "history/artifacts/luc-2650-i18n-audit.json", "--help"], {
    rootDir,
  });

  assert.equal(options.help, true);
  assert.equal(
    normalize(path.relative(rootDir, options.outFile)),
    "history/artifacts/luc-2650-i18n-audit.json",
  );
  assert.throws(() => parseArgs(["--out"]), /Missing value for --out/);
  assert.throws(() => parseArgs(["--wat"]), /Unknown argument/);
});

test("source discovery and import resolution skip tests and resolve relative and alias imports", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "route-reachable-i18n-discovery-"));
  const webSrcDir = path.join(fixtureRoot, "apps", "web", "src");
  const pageDir = path.join(webSrcDir, "app", "dashboard");
  const componentsDir = path.join(webSrcDir, "components");

  try {
    await mkdir(pageDir, { recursive: true });
    await mkdir(componentsDir, { recursive: true });
    await writeFile(path.join(pageDir, "page.tsx"), "import Card from '@/components/Card';\nexport default Card;\n");
    await writeFile(path.join(pageDir, "page.test.tsx"), "ignored\n");
    await writeFile(path.join(componentsDir, "Card.tsx"), "export default function Card() { return null; }\n");

    const files = listSourceFiles(webSrcDir).map((filePath) => normalize(path.relative(fixtureRoot, filePath)));
    assert.deepEqual(files, [
      "apps/web/src/app/dashboard/page.tsx",
      "apps/web/src/components/Card.tsx",
    ]);

    const pageFile = path.join(pageDir, "page.tsx");
    const { imports, parseErrors } = readImports(pageFile, await readFile(pageFile, "utf8"));
    assert.deepEqual(imports, ["@/components/Card"]);
    assert.deepEqual(parseErrors, []);
    assert.equal(resolveCandidateFile(path.join(componentsDir, "Card")), path.join(componentsDir, "Card.tsx"));
    assert.equal(resolveImport(pageFile, "@/components/Card", { webSrcDir }), path.join(componentsDir, "Card.tsx"));
    assert.equal(toRelative(path.join(fixtureRoot, "apps", "web"), fixtureRoot), "apps/web");
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("route reachability includes ancestor layouts and follows web source dependencies", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "route-reachable-i18n-graph-"));
  const webSrcDir = path.join(fixtureRoot, "apps", "web", "src");
  const appDir = path.join(webSrcDir, "app");
  const routeDir = path.join(appDir, "dashboard", "bots");
  const sharedFile = path.join(webSrcDir, "ui", "components", "Shared.tsx");
  const pageFile = path.join(routeDir, "page.tsx");
  const segmentLayout = path.join(appDir, "dashboard", "layout.tsx");
  const rootLayout = path.join(appDir, "layout.tsx");

  try {
    await mkdir(routeDir, { recursive: true });
    await mkdir(path.dirname(sharedFile), { recursive: true });
    await writeFile(pageFile, "export default function Page() { return null; }\n");
    await writeFile(segmentLayout, "export default function Layout() { return null; }\n");
    await writeFile(rootLayout, "export default function Root() { return null; }\n");
    await writeFile(sharedFile, "export default function Shared() { return null; }\n");

    assert.deepEqual(collectAncestorLayouts(pageFile, { appDir }), [segmentLayout, rootLayout].sort());

    const reachability = buildRouteReachability(
      [pageFile],
      new Map([
        [pageFile, [sharedFile]],
        [segmentLayout, []],
        [rootLayout, []],
        [sharedFile, []],
      ]),
      { appDir, webSrcDir },
    );

    assert.deepEqual(reachability.get(pageFile), [pageFile, rootLayout, segmentLayout, sharedFile].sort());
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("source analysis identifies local copy, fallback Polish, hardcoded attributes, and toast literals", () => {
  const source = [
    'const pageCopy = ({ en: { title: "Title" }, pl: { title: "Tytul" }, pt: { title: "Titulo" } });',
    'const resolvedLocale = "pl";',
    '<button aria-label="Create bot" title="Create bot" />;',
    'toast.error("Could not save bot");',
  ].join("\n");

  assert.equal(safeRelativeLine(source, source.indexOf("toast.error")), 4);
  assert.equal(collectPatternMatches(source, /toast\.error\("Could not save bot"\)/g)[0].line, 4);

  const analysis = analyzeFileSource(source);
  assert.equal(analysis.hasLocalCopy, true);
  assert.equal(analysis.hasFallbackPl, true);
  assert.equal(analysis.hardcodedCount, 3);
  assert.equal(analysis.score, 14);
});

test("run writes route-reachable i18n findings and excludes i18n implementation files", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "route-reachable-i18n-run-"));
  const webSrcDir = path.join(fixtureRoot, "apps", "web", "src");
  const appDir = path.join(webSrcDir, "app");
  const routeDir = path.join(appDir, "dashboard");
  const featureDir = path.join(webSrcDir, "features", "bots");
  const i18nDir = path.join(webSrcDir, "i18n");
  const pageFile = path.join(routeDir, "page.tsx");
  const featureFile = path.join(featureDir, "BotPanel.tsx");
  const outFile = path.join(fixtureRoot, "history", "artifacts", "route-i18n.json");

  try {
    await mkdir(routeDir, { recursive: true });
    await mkdir(featureDir, { recursive: true });
    await mkdir(i18nDir, { recursive: true });
    await writeFile(pageFile, "import { BotPanel } from '@/features/bots/BotPanel';\nexport default BotPanel;\n");
    await writeFile(featureFile, 'export function BotPanel() { return <button aria-label="Start bot" />; }\n');
    await writeFile(path.join(i18nDir, "translations.ts"), 'export const fallback = "pl";\n');

    assert.equal(isSharedFoundationFile(path.join(webSrcDir, "ui", "components", "Button.tsx")), true);
    assert.equal(isAuditExcludedFile(path.join(i18nDir, "translations.ts")), true);

    const output = run(["--out", outFile], { rootDir: fixtureRoot, webSrcDir, appDir });
    assert.equal(output.summary.filesWithFindings, 1);
    assert.equal(output.summary.filesWithHardcodedUiCandidates, 1);
    assert.deepEqual(output.fileFindings[0].routeReachableBy, ["apps/web/src/app/dashboard/page.tsx"]);
    assert.equal(JSON.parse(await readFile(outFile, "utf8")).summary.filesWithFindings, 1);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
