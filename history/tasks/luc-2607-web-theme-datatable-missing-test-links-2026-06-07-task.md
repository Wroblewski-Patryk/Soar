# LUC-2607 Web Theme And DataTable Missing-Test Links

## Header
- ID: LUC-2607-WEB-THEME-DATATABLE-MISSING-TEST-LINKS-2026-06-07
- Title: Cover Web theme and DataTable missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: [LUC-2604](/LUC/issues/LUC-2604)
- Priority: P1
- Mission ID: LUC-2607-WEB-THEME-DATATABLE-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2607](/LUC/issues/LUC-2607) was assigned by Paperclip wake payload as a
Frontend Web local proof and architecture relation repair child for
[LUC-2604](/LUC/issues/LUC-2604). The wake had no pending comments,
`fallbackFetchNeeded=false`, and checkout was already claimed by the harness.

## Goal
Add focused Web test coverage and scanner-readable architecture test-link rows
for the current theme/bootstrap and DataTable missing-test anchors without
changing runtime behavior.

## Scope
- `apps/web/src/ui/components/ThemeSwitch.test.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `docs/architecture/relations/priority-test-links.csv`

## Implementation Plan
1. Extend existing ThemeSwitcher tests for hidden theme options, persisted theme
   selection, system color-scheme changes, bootstrap normalization, and locale
   bootstrapping.
2. Extend existing DataTable tests for sortable comparison behavior, local
   filter query updates, trimmed search submit, and manual page input clamping.
3. Add direct `LUC-2607` rows to `priority-test-links.csv` for the covered
   theme bootstrap, ThemeSwitch, and DataTable function anchors.
4. Run focused Web tests plus architecture graph and guardrail checks.

## Acceptance Criteria
- Focused Web tests pass for ThemeSwitch and DataTable.
- Architecture graph generation accepts the updated relation CSV.
- Repository guardrails pass.
- No deploy, push, restart, rollback, protected smoke, account, secret,
  exchange, database, or live-trading mutation occurs.

## Definition Of Done
- [x] Existing Web component behavior covered by focused tests.
- [x] Scanner-readable `priority-test-links.csv` rows added for assigned
      anchors.
- [x] Focused tests and repository traceability checks passed.
- [x] Evidence recorded in repository state and Paperclip issue disposition.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/ui/components/ThemeSwitch.test.tsx src/ui/components/DataTable.test.tsx --run`
  - PASS: `2` files / `17` tests.
- `corepack pnpm run architecture:graph:generate`
  - PASS: `653` nodes / `842` relations / `27` chains.
- `corepack pnpm run quality:guardrails`
  - PASS, including architecture graph drift `OK (0 missing representative paths)`.

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md` and
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct relation rows added to
  `priority-test-links.csv`.

## Architecture Links
- apps/web/src/ui/components/ThemeSwitch.tsx
- apps/web/src/ui/components/DataTable.tsx
- apps/web/src/security/themeBootstrap.ts

## UX/UI Evidence
- Design source type: not applicable; test/traceability-only frontend proof.
- Existing shared pattern reused: existing ThemeSwitcher and DataTable tests.
- Required states covered: theme selected/system/bootstrap, table sorted,
  filtered, paginated, and column dropdown controls.
- Accessibility checks: existing accessible labels are used in assertions for
  theme selector, theme options, columns control, and page input.
- Responsive checks: not applicable; no layout implementation changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the two test-file changes and the `LUC-2607`
  CSV relation rows if needed.

## Security / Privacy Evidence
- Data classification: local test and documentation metadata only.
- Trust boundaries: no auth, account, credential, exchange, or production
  boundary touched.
- Secret handling: no secrets read or written.
- Fail-closed behavior: no runtime behavior changed.

## Result Report
- Task summary: added focused local Web coverage for ThemeSwitcher/theme
  bootstrap behavior and DataTable search/sort/page/dropdown behavior; added
  direct scanner-readable relation rows for the assigned anchors.
- Files changed:
  - `apps/web/src/ui/components/ThemeSwitch.test.tsx`
  - `apps/web/src/ui/components/DataTable.test.tsx`
  - `docs/architecture/relations/priority-test-links.csv`
- How tested:
  - focused Web Vitest PASS (`2` files / `17` tests)
  - architecture graph generation PASS
  - repository guardrails PASS
- What is incomplete:
  - Architecture-awareness refresh was not run because
    `scripts/build-architecture-awareness-index.mjs` is absent in this
    checkout; exact top-sample removal is not claimed.
- Next steps:
  - Treat [LUC-2607](/LUC/issues/LUC-2607) as complete for this local proof
    lane. Do not reopen the same anchors unless a future refreshed report
    reintroduces a concrete missing-test row or the focused tests fail.
- Decisions made:
  - Kept the slice test/traceability-only; no runtime component code changed.
