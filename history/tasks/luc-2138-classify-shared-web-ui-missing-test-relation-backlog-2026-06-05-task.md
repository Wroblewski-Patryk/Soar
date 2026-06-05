# Task

## Header
- ID: LUC-2138
- Title: [Soar][Architecture Repair][QA] Classify shared Web UI missing-test relation backlog
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2135 parent architecture backlog conversion
- Priority: P1
- Module Confidence Rows: `web-shared`; Architecture Evidence Graph
- Mission ID: LUC-2138-SHARED-WEB-UI-MISSING-TEST-RELATION-BACKLOG-2026-06-05
- Mission Status: VERIFIED

## Context
The 2026-06-05 architecture-awareness report generated at
`2026-06-05T09:10:34.335Z` still lists shared Web UI, forms, layout, lib,
theme/bootstrap, dropdown/header helpers, and setup/type surfaces in top
actionable missing-test samples. Recent adjacent work in LUC-2106 and LUC-2131
already added or documented focused local coverage for these families.

## Goal
Classify whether the current shared Web missing-test rows represent true
coverage gaps or scanner direct-relation incompleteness, and add focused tests
only where real uncovered behavior is found.

## Constraints
- No production browser proof.
- No deploy, restart, rollback, env, database, account, secret, exchange, or
  live-trading action.
- No UI redesign or unrelated Web refactor.
- Do not add redundant tests when focused or aggregate proof already exists.

## Definition of Done
- [x] Top shared Web UI/lib missing-test samples are classified.
- [x] Focused shared Web validation command passes.
- [x] Strict architecture graph drift passes because graph outputs are already
      part of the current architecture repair packet.
- [x] Classification and evidence are recorded in project source-of-truth files.

## Classification

| Sample group | Current evidence | Classification | Owner / next action |
| --- | --- | --- | --- |
| `DataTable.tsx` | `DataTable.test.tsx`, table primitive tests, runtime presenter tests | Covered; scanner direct-test relation incomplete | Architecture Graph / Docs Memory should improve direct relation generation. |
| `FooterPreferencesSwitchers.tsx`, `ProfileButton.tsx` | `SharedUiPrimitives.test.tsx` added direct primitive coverage in LUC-2106 | Covered; direct focused gap already closed | Keep in shared validation command. |
| `FormAlert`, `FormField`, `FormGrid`, `FormMobileActionBar`, `FormPageShell`, `FormSectionCard`, `FormValidationSummary` | `FormFields.test.tsx`, `FormPrimitives.test.tsx`, `validationFeedback.test.ts` | Covered; scanner direct-test relation incomplete | Keep form tests; no new QA task needed. |
| Dashboard/public `Footer`, `Header`, `PageTitle` | Dashboard/public layout tests cover header, footer, and title behavior | Covered; scanner relation incomplete | Keep layout proof separate from protected route browser proof. |
| `strategyThresholdItems`, `apps/web/src/lib/*`, `themeBootstrap`, `useDetailsDropdown`, `headerControlStyles` | Colocated lib tests plus `sharedWebUtilities.test.ts` cover helper semantics | Covered by focused/aggregate utility proof | Add focused tests only if helper behavior changes. |
| `apps/web/vitest.setup.ts` | Exercised by every focused Web Vitest run through setup loading and global mocks | Test harness support surface, not independently user-facing behavior | Keep classified as test support relation noise unless setup behavior changes. |
| `libs/shared/index.d.ts` | Type declaration surface, covered through package type consumers and typecheck gates, not a runtime unit-test target | Type-surface relation backlog, not a missing Web UI unit test | Typecheck remains the right proof owner when declaration behavior changes. |

## Validation Evidence
- Tests:
  - `pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/components/ThemeSwitch.test.tsx src/ui/components/data-table/useDataTableColumnVisibilityState.test.ts src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Footer.layout.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Footer.layout.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx src/lib/api.test.ts src/lib/async.test.ts src/lib/errorResolver.test.ts src/lib/navigation.test.ts src/lib/numericInput.test.ts src/lib/publicApiBaseUrl.test.ts src/lib/sharedWebUtilities.test.ts`
  - Result: PASS (`28` files / `145` tests).
- Architecture checks:
  - `pnpm run architecture:graph:drift:strict`
  - Result: PASS (`822/822` covered, `0` missing).
- Manual checks:
  - Inspected `docs/status/architecture-awareness-report.md`,
    `docs/modules/web-shared.md`, `apps/web/src/lib/sharedWebUtilities.test.ts`,
    `apps/web/src/ui/components/SharedUiPrimitives.test.tsx`,
    `apps/web/vitest.setup.ts`, and `libs/shared/index.d.ts`.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/modules/web-shared.md`, `docs/architecture/relations/documentation-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/web-shared.md` now records
  this LUC-2138 classification.

## Result Report
- Task summary: classified the shared Web UI/forms/layout/lib missing-test
  relation backlog and found no new true focused coverage gap.
- Files changed:
  - `docs/modules/web-shared.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-2138-classify-shared-web-ui-missing-test-relation-backlog-2026-06-05-task.md`
- How tested:
  - focused shared Web test pack passed (`28` files / `145` tests);
  - strict architecture graph drift passed (`822/822`, `0` missing).
- What is incomplete:
  - scanner still reports direct missing-test links for these rows because it
    does not infer every per-file relation from focused or aggregate tests.
- Next steps:
  - Architecture Graph / Docs Memory can improve direct test relation
    generation or registry mapping later; no current Test Automation blocker
    remains for this issue.
- Decisions made:
  - No redundant tests were added because current coverage is already present
    and passing.
