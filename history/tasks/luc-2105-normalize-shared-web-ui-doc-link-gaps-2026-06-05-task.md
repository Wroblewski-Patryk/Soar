# Task

## Header
- ID: LUC-2105
- Title: [Soar][Docs][Architecture Graph] Normalize shared Web UI doc-link gaps
- Task Type: docs
- Current Stage: post-release
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: [LUC-2104](/LUC/issues/LUC-2104)
- Priority: high
- Module Confidence Rows: `web-shared`; Architecture Evidence Graph
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2105-NORMALIZE-SHARED-WEB-UI-DOC-LINKS-2026-06-05
- Mission Status: verified

## Context
[LUC-2104](/LUC/issues/LUC-2104) triaged shared Web UI architecture-awareness
doc-link gaps as `GMRT-01-SHARED-WEB-DOC-LINKS`. The top actionable doc-gap
samples were generated component entities under `apps/web/src/ui/**`,
`apps/web/src/i18n/I18nProvider.tsx`, shared layout/PWA primitives, and
`AssetSymbol`.

## Goal
Normalize true shared Web UI documentation coverage so the architecture
awareness report no longer presents already-documented shared UI primitives as
top actionable missing doc-link gaps.

## Constraints
- No runtime/product behavior edits.
- No UI redesign, route behavior change, deploy, secrets, protected production
  smoke, account mutation, or LIVE trading action.
- Do not take over [LUC-2107](/LUC/issues/LUC-2107) Test Automation scope.

## Definition of Done
- [x] Grouped shared UI doc-link gaps inspected.
- [x] True doc coverage mapped through `docs/architecture/relations/documentation-links.csv`.
- [x] `docs/modules/web-shared.md` updated with the normalized doc-link rule.
- [x] `pnpm run architecture:graph:generate` executed.
- [x] Architecture-awareness scanner refreshed generated exports.
- [x] Report readback confirms shared UI components are removed from top actionable missing doc links.
- [x] `pnpm run architecture:graph:drift:strict` passes after [LUC-2107](/LUC/issues/LUC-2107) covers its two new Web test files.

## Forbidden
- Runtime behavior edits.
- Route behavior changes.
- Deploy, restart, rollback, env edit, database action, account action, secret
  disclosure, protected production smoke, or live-trading action.
- Mutating or reverting unrelated [LUC-2107](/LUC/issues/LUC-2107) work.

## Validation Evidence
- `pnpm run architecture:graph:generate` -> PASS: `647` nodes / `842` relations / `27` chains.
- First scanner run with `120000ms` timeout -> BLOCKED_BY_TIMEOUT.
- Re-run scanner with `300000ms` timeout -> PASS: `14204` entities / `21938` relations / `6979` files.
- Report readback from `docs/status/architecture-awareness-report.md` -> PASS:
  - raw missing docs changed from `976` to `940`;
  - actionable missing docs changed from `241` to `205`;
  - shared UI component rows no longer appear in top actionable missing doc-link samples.
- `pnpm run architecture:graph:drift:strict` -> FAIL, out-of-scope blocker:
  - `820/822` covered;
  - missing `apps/web/src/lib/sharedWebUtilities.test.ts`;
  - missing `apps/web/src/ui/components/SharedUiPrimitives.test.tsx`;
  - both files are [LUC-2107](/LUC/issues/LUC-2107) Test Automation scope.
- Resume after [LUC-2107](/LUC/issues/LUC-2107) blocker resolution:
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822` covered,
    `0` missing).

## Architecture Evidence
- Added `docs/architecture/relations/documentation-links.csv`.
- Updated `docs/modules/web-shared.md` section `8A`.
- Refreshed architecture-awareness generated artifacts under `docs/graphs/`
  and `docs/status/`.
- Affected entities:
  - `SOAR-DOC-WEB-SHARED`
  - `SOAR-DOC-WEB-ICONS`
  - shared generated component entities for `apps/web/src/ui/**`
  - `component:i18nprovider-tsx:e2b655d80e`

## Result Report
- Implemented and verified the shared Web UI doc-link normalization.
- [LUC-2107](/LUC/issues/LUC-2107) resolved the out-of-scope graph coverage
  blocker, and strict drift now passes.
- No runtime/product/deploy/protected/secret/account/live-trading action was
  performed.
