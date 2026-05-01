import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const resolveWebSrc = () => {
  const monorepoPath = resolve(process.cwd(), "apps/web/src");
  if (existsSync(monorepoPath)) return monorepoPath;
  return resolve(process.cwd(), "src");
};

const MONITORED_ROUTE_FILES = [
  "app/dashboard/backtests/create/page.tsx",
  "app/dashboard/backtests/list/page.tsx",
  "app/dashboard/backtests/[id]/page.tsx",
  "app/dashboard/bots/page.tsx",
  "ui/layout/dashboard/LanguageSwitcher.tsx",
  "features/auth/components/LoginForm.tsx",
  "features/auth/components/RegisterForm.tsx",
  "features/auth/components/PasswordVisibilityToggle.tsx",
  "features/auth/hooks/useLoginForm.ts",
  "features/auth/hooks/useRegisterForm.ts",
  "features/auth/pages/LoginPage.tsx",
  "features/auth/pages/RegisterPage.tsx",
  "features/admin/users/pages/AdminUsersPage.tsx",
  "features/admin/subscriptions/pages/AdminSubscriptionsPage.tsx",
  "app/admin/layout.tsx",
  "features/admin/layout/AdminLayoutShell.tsx",
];

const UXR_I_WRAPPER_FILES = [
  "app/dashboard/wallets/create/page.tsx",
  "app/dashboard/wallets/[id]/edit/page.tsx",
  "app/dashboard/wallets/_components/WalletFormPageContent.tsx",
  "app/dashboard/markets/create/page.tsx",
  "app/dashboard/markets/[id]/edit/page.tsx",
  "app/dashboard/strategies/create/page.tsx",
  "app/dashboard/strategies/[id]/edit/page.tsx",
  "app/dashboard/backtests/create/page.tsx",
  "app/dashboard/bots/create/page.tsx",
  "app/dashboard/bots/[id]/edit/page.tsx",
  "app/dashboard/bots/_components/BotFormPageContent.tsx",
];

const CQLT_C_MIGRATED_ROUTE_FILES = [
  "app/dashboard/profile/page.tsx",
  "features/profile/components/ApiKeyForm.tsx",
  "features/profile/components/ApiKeysList.tsx",
  "features/profile/components/Security.tsx",
  "features/profile/components/Subscription.tsx",
  "features/profile/hooks/useUser.ts",
  "features/profile/pages/ProfilePage.tsx",
  "app/dashboard/strategies/list/page.tsx",
  "features/strategies/components/StrategiesList.tsx",
  "app/dashboard/wallets/create/page.tsx",
  "app/dashboard/wallets/[id]/edit/page.tsx",
  "features/wallets/components/WalletCreateEditForm.tsx",
];

const TRUTH_A_MONITORED_FILES = [
  "features/dashboard-home/components/HomeLiveWidgets.tsx",
  "features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx",
  "features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx",
];

const LOCAL_COPY_PATTERN = /const\s+\w+\s*=\s*{[\s\S]*?\b(?:en|pl|pt|deCH|de-CH)\s*:/i;
const FALLBACK_PL_PATTERN = /(?:\?\?|\|\|)\s*['"]pl['"]/;
const HARD_CODED_ATTRIBUTE_PATTERN =
  /\b(?:title|placeholder|aria-label|aria-placeholder)\s*=\s*['"][^'"{][^'"]*['"]/g;
const HARD_CODED_PROP_LITERAL_PATTERN =
  /\b(?:\w*(?:Label|Title|Description|Placeholder|Hint|Text)|emptyText)\s*=\s*['"][^'"{][^'"]*['"]/g;
const HARD_CODED_FALLBACK_LITERAL_PATTERN =
  /\.(?:origin|source|status|reason)\s*\?\?\s*['"][^'"{][^'"]*['"]/g;
const HARD_CODED_TOAST_PATTERN =
  /toast\.(?:success|error|info|warning)\s*\(\s*['"][^'"]+['"]/g;

type GuardrailScanResult = {
  localCopy: boolean;
  fallbackPl: boolean;
  hardcodedUiMatches: string[];
};

const collectMatches = (source: string, pattern: RegExp) => {
  const matches = source.match(pattern);
  return matches ? Array.from(new Set(matches)) : [];
};

const scanSource = (source: string): GuardrailScanResult => ({
  localCopy: LOCAL_COPY_PATTERN.test(source),
  fallbackPl: FALLBACK_PL_PATTERN.test(source),
  hardcodedUiMatches: [
    ...collectMatches(source, HARD_CODED_ATTRIBUTE_PATTERN),
    ...collectMatches(source, HARD_CODED_PROP_LITERAL_PATTERN),
    ...collectMatches(source, HARD_CODED_FALLBACK_LITERAL_PATTERN),
    ...collectMatches(source, HARD_CODED_TOAST_PATTERN),
  ],
});

const scanFiles = (relativePaths: string[]) => {
  const root = resolveWebSrc();
  return Array.from(new Set(relativePaths)).map((relativePath) => {
    const absolutePath = join(root, relativePath);
    const source = readFileSync(absolutePath, "utf8");
    return {
      relativePath,
      ...scanSource(source),
    };
  });
};

describe("i18n guardrails", () => {
  const monitoredFiles = [...MONITORED_ROUTE_FILES, ...UXR_I_WRAPPER_FILES, ...TRUTH_A_MONITORED_FILES];
  const cqltMigratedFiles = [...CQLT_C_MIGRATED_ROUTE_FILES];

  it("blocks route-reachable local copy dictionary regressions", () => {
    const offenders = scanFiles(monitoredFiles)
      .filter((entry) => entry.localCopy)
      .map((entry) => entry.relativePath);

    expect(offenders, `Local copy dictionary found in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("blocks route-reachable locale fallback drift to pl", () => {
    const offenders = scanFiles(monitoredFiles)
      .filter((entry) => entry.fallbackPl)
      .map((entry) => entry.relativePath);

    expect(offenders, `Locale fallback to 'pl' found in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("blocks hardcoded UI literals in monitored attribute/toast contexts", () => {
    const offenders = scanFiles(monitoredFiles)
      .filter((entry) => entry.hardcodedUiMatches.length > 0)
      .map((entry) => `${entry.relativePath}\n  - ${entry.hardcodedUiMatches.join("\n  - ")}`);

    expect(offenders, `Hardcoded UI string matches found in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("detects seeded regression fixture for all hard-fail categories", () => {
    const root = resolveWebSrc();
    const fixturePath = join(root, "i18n/__fixtures__/guardrails.seed-regression.tsx");
    const fixtureSource = readFileSync(fixturePath, "utf8");
    const result = scanSource(fixtureSource);

    expect(result.localCopy).toBe(true);
    expect(result.fallbackPl).toBe(true);
    expect(result.hardcodedUiMatches.length).toBeGreaterThan(0);
  });

  it("keeps CQLT-C migrated route files free from local copy/fallback drift", () => {
    const offenders = scanFiles(cqltMigratedFiles).flatMap((entry) => {
      const findings: string[] = [];
      if (entry.localCopy) findings.push(`${entry.relativePath}: localCopy`);
      if (entry.fallbackPl) findings.push(`${entry.relativePath}: fallbackPl`);
      if (entry.hardcodedUiMatches.length > 0) {
        findings.push(`${entry.relativePath}: hardcodedUi=${entry.hardcodedUiMatches.join(" | ")}`);
      }
      return findings;
    });

    expect(offenders, `CQLT-C migrated route drift found in:\n${offenders.join("\n")}`).toEqual([]);
  });
});
