# Task

## Header
- ID: LUC-2021
- Title: [Soar][Frontend Audit] Triage shared UI inferred test/doc link gaps
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Frontend Engineer
- Priority: P2
- Module Confidence Rows: `web-shared`; architecture evidence graph shared UI component rows
- Requirement Rows: `REQ-DOC-029`, `REQ-DOC-030`
- Risk Rows: `RISK-DOC-005`
- Operation Mode: BUILDER
- Mission ID: `LUC-2021-SHARED-UI-INFERRED-LINK-GAP-TRIAGE-2026-06-04`
- Mission Status: VERIFIED

## Context
The 2026-06-03 architecture-awareness report still lists `200` implementation
entities without inferred test links and `200` without inferred doc links. The
Frontend audit lane was scoped to the shared UI portion of those inferred gaps,
especially `apps/web/src/ui/**` primitives that already have nearby tests or
module documentation but are not directly linked by the generated graph.

Wake payload was consumed first:

- Reason: `issue_assigned`
- Issue: `LUC-2021`
- Status at wake: `in_progress`
- Work mode: `standard`
- Priority: `medium`
- Pending comments: `0/0`
- `fallbackFetchNeeded=false`
- Checkout: already claimed by the harness; checkout was not repeated.

## Goal
Classify shared UI inferred test/doc link gaps into evidence-present scanner
relation gaps versus real follow-up candidates, update the durable shared UI
source of truth, and leave a repeatable validation command for future frontend
agents.

## Scope
- `docs/modules/web-shared.md`
- `history/tasks/luc-2021-shared-ui-inferred-test-doc-link-gap-triage-2026-06-04-task.md`
- state/context append-only updates for this issue

Runtime code, API behavior, backend logic, database, production, deployment,
secrets, accounts, and live-trading behavior were explicitly out of scope.

## Implementation Plan
1. Inspect architecture-awareness inferred gap output.
2. Isolate Web shared UI components under `apps/web/src/ui/**` and
   `apps/web/src/features/shared/**`.
3. Compare generated component rows to existing focused tests and module docs.
4. Update `docs/modules/web-shared.md` with a shared UI primitive evidence
   matrix and triage status.
5. Run the smallest validation that proves the triaged shared UI tests still
   pass.
6. Update state/context and close the issue with evidence.

## Acceptance Criteria
- Shared UI inferred gaps are classified without runtime code mutation.
- Existing focused shared UI tests are named explicitly.
- Real follow-up candidates are listed separately from scanner relation gaps.
- Verification command/result is recorded.
- No production, secret, account, deploy, or live-trading action occurs.

## Definition of Done
- `docs/modules/web-shared.md` identifies shared UI tests/docs and the
  inferred-link triage boundary.
- Focused shared UI validation passes or exact blocker is recorded.
- Source-of-truth state includes the `LUC-2021` checkpoint.
- Paperclip issue is updated to `done` with closure evidence.

## Validation Evidence
- Tests:
  - `pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx`
  - Result: PASS (`16` files / `87` tests).
- Manual checks:
  - `docs/status/architecture-awareness-report.md` inspected.
  - `docs/graphs/architecture-awareness.json` inspected for `apps/web/src/ui/**` component relation shape.
  - `docs/modules/web-shared.md`, `SOAR-DOC-WEB-SHARED`, `SOAR-TEST-WEB-RESIDUAL-SURFACES`, and `SOAR-TEST-WEB-SHELL-UI` inspected.
- Reality status: verified for docs/evidence triage only.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-awareness.json`
  - `docs/architecture/nodes/SOAR-DOC-WEB-SHARED.md`
  - `docs/architecture/nodes/SOAR-TEST-WEB-RESIDUAL-SURFACES.md`
  - `docs/architecture/registry/nodes.csv`
- Fits approved architecture: yes
- Mismatch discovered: no runtime architecture mismatch; only scanner relation incompleteness.
- Decision required from user: no
- Follow-up architecture doc updates: future Docs Memory lane can add stable per-component shared UI graph nodes or scanner relation rules if required.

## Result Report
- Task summary: Classified shared UI inferred test/doc link gaps and updated the shared UI module doc with exact test surfaces, triage status, and follow-up candidates.
- Files changed:
  - `docs/modules/web-shared.md`
  - `history/tasks/luc-2021-shared-ui-inferred-test-doc-link-gap-triage-2026-06-04-task.md`
  - state/context files for mission closure
- How tested:
  - Focused Web shared UI test command passed (`16` files / `87` tests).
- What is incomplete:
  - Scanner still does not directly promote every generated shared UI component to its exact tests/docs. This is now classified as a Docs Memory/graph relation improvement, not a frontend runtime defect.
- Next steps:
  - Add focused primitive tests for `ConfirmModal`, `FormModal`, `useAsyncConfirm`, `AppLogoLink`, `FooterPreferencesSwitchers`, `InlinePager`, `ProfileButton`, `SkipToContentLink`, or skeleton loaders when those primitives change or when per-component graph nodes are promoted.
- Decisions made:
  - No runtime code change was warranted for this audit lane.
