# LUC-2624 Web UI Form Layout Missing-Test Links

## Header
- ID: LUC-2624
- Title: [Soar][Frontend][LUC-2621] Cover refreshed Web UI/form/layout missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Priority: P1
- Mission ID: LUC-2624-WEB-UI-FORM-LAYOUT-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
The 2026-06-07 architecture-awareness report listed refreshed Web UI/form/layout anchors as top actionable missing-test links, including `DataTable.tsx#handlePageSizeChange`, form primitives, `useDetailsDropdown`, and dashboard/public layout helpers.

Baseline dirty-state before this lane was broad and pre-existing. This lane did not revert or stage unrelated work. The scoped changes were the `DataTable` page-size proof and `LUC-2624` scanner-readable rows in `docs/architecture/relations/priority-test-links.csv`.

## Goal
Add focused local Web proof and direct scanner-readable test links for the assigned refreshed Web UI/form/layout anchors without changing production runtime behavior.

## Scope
- `apps/web/src/ui/components/DataTable.test.tsx`
- `docs/architecture/relations/priority-test-links.csv`
- validation command outputs from Web Vitest, architecture graph generation, and repository guardrails

## Implementation Plan
1. Inspect current architecture-awareness top missing-test samples.
2. Reuse existing focused Web tests for form primitives, dropdown behavior, and layout surfaces.
3. Add a missing focused assertion for `DataTable.tsx#handlePageSizeChange`.
4. Add direct `LUC-2624` priority-test-link rows for the assigned anchors.
5. Run focused Web tests, graph generation, and guardrails.

## Acceptance Criteria
- `DataTable` page-size changes reset pagination and are covered by a focused Web test.
- The assigned form/layout/dropdown anchors have direct rows in `priority-test-links.csv`.
- Focused Web proof passes.
- Graph generation and guardrails pass.
- No deploy, push, production smoke, account, secret, exchange, database, or live-trading mutation occurs.

## Definition of Done
- Implemented and verified locally.
- Source-of-truth task/state files updated.
- Paperclip issue closure records files, tests, commit/push/deploy status, residual risk, and next owner.

## Validation Evidence
- Tests: `corepack pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/Footer.layout.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Header.test.tsx src/ui/layout/public/Footer.layout.test.tsx` -> PASS (`9` files / `49` tests).
- Architecture graph: `corepack pnpm run architecture:graph:generate` -> PASS (`653` nodes / `842` relations / `27` chains).
- Guardrails: `corepack pnpm run quality:guardrails` -> PASS.
- Architecture-awareness refresh: not run; `scripts/build-architecture-awareness-index.mjs` and `scripts/generateArchitectureAwarenessIndex.mjs` are absent in this checkout.
- Reality status: verified local proof and scanner traceability; refreshed top-sample removal not claimed.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`; `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none beyond direct relation rows.

## Architecture Links
- apps/web/src/ui/components/DataTable.tsx
- apps/web/src/ui/components/FooterPreferencesSwitchers.tsx
- apps/web/src/ui/components/data-table/useDataTableColumnVisibilityState.ts
- apps/web/src/ui/forms/FormGrid.tsx
- apps/web/src/ui/forms/FormMobileActionBar.tsx
- apps/web/src/ui/forms/FormPageShell.tsx
- apps/web/src/ui/forms/FormSectionCard.tsx
- apps/web/src/ui/forms/FormValidationSummary.tsx
- apps/web/src/ui/forms/validationFeedback.ts
- apps/web/src/ui/hooks/useDetailsDropdown.ts
- apps/web/src/ui/layout/dashboard/DashboardRouteProgress.tsx
- apps/web/src/ui/layout/dashboard/Footer.tsx
- apps/web/src/ui/layout/dashboard/Header.tsx
- apps/web/src/ui/layout/dashboard/IsometricModeToggle.tsx
- apps/web/src/ui/layout/dashboard/RiskNoticeFooter.tsx
- apps/web/src/ui/layout/dashboard/SafetyBar.tsx
- apps/web/src/ui/layout/public/Footer.tsx

## UX/UI Evidence
- Design source type: not applicable.
- Existing shared pattern reused: existing Web test harness and shared UI/form/layout primitives.
- Required states: local component behavior only.
- Responsive checks: covered through existing dashboard/public layout tests.
- Accessibility checks: covered through existing PageTitle and semantic form/dropdown tests.
- Parity evidence: no visual target; this is architecture traceability and local regression proof.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the test/relation rows if needed; no runtime code changed.

## Autonomous Loop Evidence
1. Analyze current state: reviewed active mission, next steps, task board, project state, current architecture-awareness top samples, and existing focused Web tests.
2. Select one priority mission objective: `LUC-2624` scoped local Web proof for refreshed UI/form/layout missing-test links.
3. Plan implementation: add one missing behavior assertion and direct relation rows.
4. Execute implementation: extended `DataTable.test.tsx` and `priority-test-links.csv`.
5. Verify and test: focused Web Vitest, architecture graph generation, and guardrails all passed.
6. Self-review: no production code change; reused existing tests; no workaround or duplicate runtime path introduced.
7. Update documentation and knowledge: task packet plus state/context updates record evidence and residual risk.

## Result Report
- Task summary: Added focused local proof for `DataTable.tsx#handlePageSizeChange` and direct scanner-readable `LUC-2624` rows for refreshed Web UI/form/layout anchors.
- Files changed: `apps/web/src/ui/components/DataTable.test.tsx`, `docs/architecture/relations/priority-test-links.csv`, this task packet, and related state/context files.
- How tested: focused Web Vitest (`9` files / `49` tests), architecture graph generation, and repository guardrails.
- What is incomplete: exact architecture-awareness top-sample removal was not proven because the local awareness builder script is absent.
- Next steps: treat this lane complete unless a future refreshed architecture-awareness report reintroduces concrete missing-test rows for the same anchors.
- Decisions made: no commit/push/deploy due to broad pre-existing dirty worktree outside this issue.
