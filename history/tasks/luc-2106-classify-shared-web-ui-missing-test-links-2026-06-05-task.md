# Task

## Header
- ID: LUC-2106
- Title: [Soar][Test Automation][Architecture Graph] Classify shared Web UI missing-test links
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Depends on: [LUC-2104](/LUC/issues/LUC-2104)
- Priority: high
- Module Confidence Rows: `web-shared`; Architecture Evidence Graph
- Requirement Rows: `REQ-DOC-029`, `REQ-DOC-030`
- Risk Rows: `RISK-DOC-005`
- Iteration: 2026-06-05
- Operation Mode: TESTER
- Mission ID: LUC-2106-SHARED-WEB-UI-MISSING-TEST-LINKS-2026-06-05
- Mission Status: VERIFIED

## Context
[LUC-2104](/LUC/issues/LUC-2104) triaged shared Web UI
architecture-awareness gaps as `GMRT-02-SHARED-WEB-TEST-LINKS`. The scoped wake
for [LUC-2106](/LUC/issues/LUC-2106) had no pending comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and was
not repeated.

The current architecture-awareness report was generated at
`2026-06-05T07:12:32.139Z` and listed top actionable missing-test samples for
shared UI primitives, form/layout components, and shared Web utilities.

## Goal
Classify the shared Web UI missing-test samples into evidence-present scanner
relation gaps, direct graph relation gaps, not-applicable rows, or true missing
coverage, then add focused tests only where evidence warrants it.

## Scope
- `apps/web/src/ui/components/SharedUiPrimitives.test.tsx`
- `docs/modules/web-shared.md`
- local evidence/state updates for this issue

Runtime behavior, route behavior, API behavior, database, deploy, protected
production smoke, account mutation, secrets, and LIVE trading were out of
scope.

## Implementation Plan
1. Read the current architecture-awareness report and top actionable
   missing-test samples.
2. Compare sampled shared UI files against existing focused Web tests and graph
   aggregate test nodes.
3. Add focused primitive coverage only for true candidate gaps.
4. Update the shared Web module evidence table and triage boundary.
5. Run focused Web shared UI validation and strict architecture graph drift.

## Acceptance Criteria
- Affected shared UI clusters are classified with current tests and next owner.
- True missing direct primitive coverage is closed or delegated.
- Focused Web validation passes.
- Graph drift remains clean or exact blocker is recorded.
- No runtime/deploy/protected/secret/account/live-trading action occurs.

## Definition of Done
- Shared Web UI missing-test links are classified.
- Any added test coverage has a reproducible command.
- Source-of-truth module doc is updated.
- Paperclip issue is updated to `done` with evidence.

## Classification

| Cluster | Affected files | Current tests / graph state | Classification | Next owner |
| --- | --- | --- | --- | --- |
| Shared table primitives | `DataTable.tsx`; `TableUi.tsx`; `ViewState.tsx`; `StatusBadge.tsx`; `Tabs.tsx`; `ThemeSwitch.tsx` | Focused component tests exist and are represented by `SOAR-TEST-WEB-RESIDUAL-SURFACES` / `SOAR-TEST-WEB-SHELL-UI`; report still lacks direct generated-component test inference. | Already covered; missing graph/scanner relation. | Docs Memory / Architecture Graph for direct relation promotion only. |
| Shared form primitives | `FormAlert.tsx`; `FormField.tsx`; `FormGrid.tsx`; `FormMobileActionBar.tsx`; `FormPageShell.tsx`; `FormSectionCard.tsx`; `FormValidationSummary.tsx`; `FormFields.tsx`; `validationFeedback.ts` | `FormPrimitives.test.tsx`, `FormFields.test.tsx`, and `validationFeedback.test.ts` cover rendering, error state, summary hiding, controls, and validation helpers. | Already covered; missing graph/scanner relation. | Docs Memory / Architecture Graph for direct relation promotion only. |
| Shared layout primitives | dashboard/public `Header.tsx`, `Footer.tsx`, `PageTitle.tsx` | Existing layout tests cover dashboard header responsive behavior, dashboard footer layout, public header, public footer, and page title accessibility. | Already covered; missing graph/scanner relation. | Docs Memory / Architecture Graph for direct relation promotion only. |
| Shared utilities | `strategyThresholdItems.ts`; `themeBootstrap.ts`; `useDetailsDropdown.ts`; `headerControlStyles.ts`; storage/symbol/time/text helpers | `sharedWebUtilities.test.ts` and focused utility tests cover threshold IDs, theme bootstrap, details dropdown, header classes, storage, symbols, time, and clone naming. | Already covered; missing graph/scanner relation. | Docs Memory / Architecture Graph for direct relation promotion only. |
| Primitive gaps from prior triage | `FooterPreferencesSwitchers.tsx`; `ProfileButton.tsx` | Before this issue these were covered only through consumers or mocks; [LUC-2106](/LUC/issues/LUC-2106) added direct checks in `SharedUiPrimitives.test.tsx` for footer preference navigation labels and profile section navigation/hash behavior. | True missing focused coverage closed locally. | Test Automation owns current proof; Docs Memory may promote direct test relations later. |
| Modal/loading/navigation primitives | `ConfirmModal.tsx`; `FormModal.tsx`; `useAsyncConfirm.tsx`; `AppLogoLink.tsx`; `InlinePager.tsx`; `SkipToContentLink.tsx`; skeleton loaders | `SharedUiPrimitives.test.tsx` covers modal open/actions, form modal content/close, async confirm settling, logo link, pager callbacks/disabled state, skip link locale text, and skeleton accessibility/counts. | Covered by direct focused test; missing graph/scanner relation. | Docs Memory / Architecture Graph for direct relation promotion only. |

## Validation Evidence
- Tests:
  - `pnpm --filter web test -- src/ui/components/SharedUiPrimitives.test.tsx`
  - Result: PASS (`1` file / `11` tests).
  - `pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx`
  - Result: PASS (`17` files / `98` tests).
- Architecture graph:
  - `pnpm run architecture:graph:drift:strict`
  - Result: PASS (`822/822` covered, `0` missing).
- Manual checks:
  - `docs/status/architecture-awareness-report.md` inspected.
  - `docs/architecture/registry/tests.csv` inspected for aggregate Web test nodes.
  - `docs/modules/web-shared.md` updated with current shared UI validation command and classification.
- Reality status: verified for local test/graph evidence only.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-health.json`
  - `docs/architecture/registry/tests.csv`
  - `docs/modules/web-shared.md`
- Fits approved architecture: yes.
- Mismatch discovered: no runtime architecture mismatch; remaining signal is scanner/direct-relation incompleteness.
- Decision required from user: no.
- Follow-up architecture doc updates: optional Docs Memory/Architecture Graph work can promote stable per-component shared UI test relations.

## Result Report
- Task summary: classified shared Web UI missing-test links and closed the two true focused primitive coverage gaps found in the top sample set.
- Files changed:
  - `apps/web/src/ui/components/SharedUiPrimitives.test.tsx`
  - `docs/modules/web-shared.md`
  - `history/tasks/luc-2106-classify-shared-web-ui-missing-test-links-2026-06-05-task.md`
- How tested:
  - focused primitive test passed (`11/11`);
  - shared UI validation command passed (`17` files / `98` tests);
  - strict architecture graph drift passed (`822/822`, `0` missing).
- What is incomplete:
  - architecture-awareness still cannot infer every generated shared UI source file to the exact aggregate/direct test relation.
- Next steps:
  - Docs Memory / Architecture Graph can add direct relation promotion if per-component scanner output is required.
- Decisions made:
  - no Frontend child issue is needed; no product behavior gap was found.
  - no graph registry edit was needed in this heartbeat because the test aggregate node already exists and strict drift is clean.
