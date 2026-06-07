# LUC-2597 Web Architecture Missing-Test Link Families

## Header
- ID: LUC-2597
- Title: [Soar][Frontend][LUC-2595] Cover Web architecture missing-test link families
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: LUC-2595
- Priority: P1
- Module Confidence Rows: Web app shell, build-info route, auth login page, runtime display utilities, i18n formatting/provider, Architecture Evidence Graph
- Requirement Rows: REQ-DOC-031
- Mission ID: LUC-2597-WEB-ARCHITECTURE-MISSING-TEST-LINK-FAMILIES-2026-06-07
- Mission Status: VERIFIED

## Context
Parent [LUC-2595](/LUC/issues/LUC-2595) refreshed the architecture-awareness gap register and delegated Web missing-test link families to [LUC-2597](/LUC/issues/LUC-2597). The target rows came from `docs/status/architecture-awareness-report.md` generated `2026-06-06T22:16:06.802Z`.

## Goal
Add or map focused local Web proof for build-info route helpers, app/dashboard/public root layouts, `manifest`, `LoginPage`, runtime display utilities, strategy threshold generated IDs, `I18nProvider`, and `useLocaleFormatting`, then add scanner-readable relations so those families no longer appear in the top actionable missing-test samples.

## Scope
- Added focused tests:
  - `apps/web/src/app/api/build-info/route.test.ts`
  - `apps/web/src/app/appShellRoutes.test.tsx`
- Extended existing tests:
  - `apps/web/src/features/shared/runtimeMonitoringFormatters.test.ts`
  - `apps/web/src/lib/sharedWebUtilities.test.ts`
- Added relation rows:
  - `docs/architecture/relations/priority-test-links.csv`
- Refreshed generated architecture-awareness exports under `docs/graphs/` and `docs/status/`.

## Implementation Plan
1. Add focused local route proof for `/api/build-info` env, metadata, and no-cache behavior.
2. Add focused local shell proof for top-level/public/dashboard layouts, PWA manifest metadata, and login authenticated redirect.
3. Extend existing formatter and strategy utility tests for direct helper coverage.
4. Add `priority-test-links.csv` function-anchor rows for all assigned Web families.
5. Rerun focused Web tests, architecture-awareness refresh, guardrails, and whitespace check.

## Acceptance Criteria
- Focused Web tests for new and mapped surfaces pass.
- `priority-test-links.csv` records direct rows for the assigned Web function families.
- Architecture-awareness refresh no longer lists the assigned Web families in top actionable missing-test samples.
- No deploy, push, restart, rollback, production smoke, account, secret, exchange, database, or live-trading mutation occurs.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/app/api/build-info/route.test.ts src/app/appShellRoutes.test.tsx --run` passed: `2` files / `6` tests.
- `corepack pnpm --filter web exec vitest run src/app/api/build-info/route.test.ts src/app/appShellRoutes.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/bots/utils/trailingStopDisplay.test.ts src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/lib/sharedWebUtilities.test.ts src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/useLocaleFormatting.test.tsx --run` passed: `11` files / `52` tests.
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` passed: `14731` entities / `23469` relations.
- Refreshed `docs/status/architecture-awareness-report.md` generated `2026-06-06T22:56:45.274Z`; actionable missing-test links dropped from `733` to `691`, and the assigned Web build-info/layout/auth/runtime utility/i18n families no longer appear in the top actionable missing-test samples.
- `corepack pnpm run quality:guardrails` passed.
- `git diff --check -- <touched Web/docs paths>` passed with line-ending warnings only.

## Result Report
- Task summary: implemented focused Web route/shell proof, extended direct helper assertions, added scanner-readable test links, and refreshed architecture-awareness outputs.
- Files changed: Web tests, `docs/architecture/relations/priority-test-links.csv`, generated architecture-awareness exports, and this task artifact.
- How tested: focused Web Vitest pack, architecture-awareness refresh, repository guardrails, and whitespace check.
- What is incomplete: unrelated remaining top samples now start at Web shared/lib/UI helper families such as `apps/web/src/lib/api.ts#hardRedirect` and DataTable helpers; those are outside [LUC-2597](/LUC/issues/LUC-2597).
- Deploy impact: none.
- Push status: not pushed.
- Residual risk: local proof only; protected production/browser/release readiness remains governed by existing protected gate issues.
