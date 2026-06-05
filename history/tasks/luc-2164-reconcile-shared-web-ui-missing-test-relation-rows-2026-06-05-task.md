# Task

## Header
- ID: LUC-2164
- Title: [Soar][Architecture Repair][QA] Reconcile shared Web UI missing-test relation rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2161 parent architecture repair backlog; LUC-2138 prior shared Web QA classification
- Priority: P1
- Module Confidence Rows: `web-shared`; Architecture Evidence Graph
- Mission ID: LUC-2164-SHARED-WEB-UI-MISSING-TEST-RELATION-RECONCILIATION-2026-06-05
- Mission Status: VERIFIED
- Operation Mode: TESTER

## Context
The 2026-06-05 architecture-awareness report generated at
`2026-06-05T10:06:31.635Z` still listed the top shared Web UI, form, layout,
library, theme, dropdown, and header helper rows as actionable missing-test
links despite LUC-2138 proving focused or aggregate local Web tests already
exist for those surfaces.

## Goal
Reconcile the top shared Web UI missing-test relation rows by determining
whether they are real focused coverage gaps, missing test registry linkage, or
scanner direct-relation metadata gaps.

## Scope
- Added `docs/architecture/relations/priority-test-links.csv`.
- Reused existing focused tests under `apps/web/src/ui/**`,
  `apps/web/src/lib/**`, `apps/web/src/security/**`, and
  `apps/web/src/features/strategies/utils/**`.
- Refreshed generated architecture-awareness outputs.
- Updated source-of-truth state/context files for this QA checkpoint.
- Excluded production browser proof, runtime behavior changes, deploy, restart,
  rollback, env, database, account, secret, exchange, and live-trading action.

## Implementation Plan
1. Read the current architecture-awareness report and prior LUC-2138 task.
2. Classify the requested sample rows against existing focused tests.
3. Add curated priority test links only where an existing real test already
   covers the implementation surface.
4. Run the focused shared Web test pack.
5. Regenerate architecture-awareness output and verify readback.
6. Run architecture graph generation and strict drift.
7. Record task evidence and update project source of truth.

## Acceptance Criteria
- The requested shared Web UI/form/layout/lib/theme/dropdown/header rows have
  direct test relation readback.
- No redundant tests are added when focused proof already exists.
- The focused shared Web test pack passes.
- `pnpm run architecture:graph:drift:strict` passes.
- Remaining support/type rows are classified without claiming user-facing UI
  coverage.

## Definition of Done
- [x] Relation rows classified.
- [x] Existing focused proof linked through the scanner-supported
      `priority-test-links.csv` relation file.
- [x] Focused Web test pack passed.
- [x] Architecture-awareness readback shows zero remaining LUC-2164 priority
      paths in actionable missing-test samples.
- [x] Strict graph drift passed.
- [x] No production, protected, secret, account, exchange, or live-trading
      action occurred.

## Classification

| Sample group | Existing proof or gap | Action taken | Next owner |
| --- | --- | --- | --- |
| `DataTable.tsx` | `DataTable.test.tsx` exists and passes | Added direct priority test link | None for QA |
| `FooterPreferencesSwitchers.tsx`, `ProfileButton.tsx`, `useDetailsDropdown.ts` | `SharedUiPrimitives.test.tsx` exists and passes | Added direct priority test links | None for QA |
| Shared form primitives | `FormFields.test.tsx`, `FormPrimitives.test.tsx`, and `validationFeedback.test.ts` exist and pass | Added direct priority test links | None for QA |
| Dashboard/public footer/header/title layout | Focused layout/header/a11y tests exist and pass | Added direct priority test links | None for QA |
| `strategyThresholdItems.ts`, shared `apps/web/src/lib/*`, `themeBootstrap.ts`, `headerControlStyles.ts` | Existing focused/aggregate lib tests exist and pass | Added direct priority test links for current samples | None for QA |
| `apps/web/vitest.setup.ts` | Test harness support surface exercised by Web Vitest runs, not user-facing UI behavior | Classified only; no direct component test added | Architecture Graph / Docs Memory if scanner needs a support-surface override |
| `libs/shared/index.d.ts` | Type declaration surface; proper proof is typecheck/consumer coverage, not a Web UI unit test | Classified only; no UI test added | Shared Contracts / Architecture Graph if type-surface relation rules are needed |

## Validation Evidence
- Tests:
  - `pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/components/ThemeSwitch.test.tsx src/ui/components/data-table/useDataTableColumnVisibilityState.test.ts src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Footer.layout.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Footer.layout.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx src/lib/api.test.ts src/lib/async.test.ts src/lib/errorResolver.test.ts src/lib/navigation.test.ts src/lib/numericInput.test.ts src/lib/publicApiBaseUrl.test.ts src/lib/sharedWebUtilities.test.ts`
  - Result: PASS (`28` files / `145` tests).
- Architecture-awareness refresh:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - Result: PASS (`14267` entities / `22197` relations), generated
    `2026-06-05T10:28:04.175Z`.
- Current architecture-awareness readback after adjacent Docs Memory refresh:
  - generated `2026-06-05T10:29:09.030Z` (`14272` entities / `22205`
    relations).
- Relation readback:
  - `actionable_implementation_without_tests.count` improved from `920` to
    `896`.
  - Targeted LUC-2164 priority paths remaining in actionable missing-test
    samples: `0`.
- Architecture graph:
  - `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842`
    relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822`, `0`
    missing).
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-health.json`
  - `docs/modules/web-shared.md`
  - `docs/architecture/registry/tests.csv`
  - `history/tasks/luc-2138-classify-shared-web-ui-missing-test-relation-backlog-2026-06-05-task.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates:
  - `docs/architecture/relations/priority-test-links.csv` now records the
    direct file-level test relation rows.

## Result Report
- Task summary: reconciled the requested shared Web UI missing-test relation
  rows by adding scanner-supported priority test links to existing focused
  tests; no new runtime coverage gap was found.
- Files changed:
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness outputs under `docs/graphs/` and
    `docs/status/`
  - source-of-truth state/context files
  - `history/tasks/luc-2164-reconcile-shared-web-ui-missing-test-relation-rows-2026-06-05-task.md`
- How tested:
  - focused shared Web pack PASS (`28` files / `145` tests);
  - scanner refresh PASS (`14267` entities / `22197` relations);
  - readback PASS (`0` remaining targeted priority paths);
  - graph generate PASS;
  - strict graph drift PASS.
- What is incomplete:
  - `apps/web/vitest.setup.ts` and `libs/shared/index.d.ts` remain top
    missing-test samples because they are support/type surfaces, not UI
    behavior gaps. They need scanner classification rules only if the
    architecture graph owners want them removed from the generic support/type
    backlog.
- Next steps:
  - Script/tooling rows now lead the missing-test list and belong to the
    residual script/tooling relation backlog, not this shared Web UI QA issue.
- Decisions made:
  - No redundant tests were added because existing focused coverage was present
    and passing.
