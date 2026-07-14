# Task

## Header
- ID: LUC-1016
- Title: Account access `resolveAggregateSessionWindowEnd` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-1011](/LUC/issues/LUC-1011)
- Priority: P1
- Module Confidence Rows: Account access / API bots aggregate runtime session-window helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion missing-test-link routing for Account access aggregate session-window helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1016-ACCOUNT-ACCESS-RESOLVEAGGREGATESESSIONWINDOWEND-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1016` was dispatched directly from the refreshed Account access project
truth after [LUC-1011](/LUC/issues/LUC-1011) advanced the first gap to
`apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd`
as `missing_test_link`.

## Goal

Close the missing-test-link proof lane for
`resolveAggregateSessionWindowEnd` with the smallest focused automated proof
and canonical traceability updates.

## Constraints

- Keep scope to proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; docs gaps may remain and must
  be handed off explicitly.

## Definition of Done

- [x] Direct executable proof covers finishedAt precedence and the two fallback
      branches.
- [x] Focused test command passes.
- [x] Canonical proof metadata links the helper to the new spec.
- [x] Sequential generator readback no longer classifies the helper as
      `missing_test_link`.
- [x] Durable evidence names the next owner for the remaining docs gap.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateFallbacks.service.test.ts --run --reporter=dot`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `pnpm run architecture:graph:drift:strict`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Manual checks:
  - targeted readback of `docs/status/app-completion-index.*`
  - targeted readback of `docs/status/project-truth-index.*`
  - targeted readback of `docs/architecture/relations/priority-test-links.csv`
  - targeted readback of `docs/architecture/scanner-overrides.json`
- Source-control readback:
  - `git diff --check`
- Reality status: verified

## Result Report

- Task summary:
  - added a focused no-DB helper spec, linked it directly through
    `priority-test-links.csv`, marked the helper verified in
    `scanner-overrides.json`, and advanced generated truth so the helper now
    routes as a docs-owned `missing_doc_link` instead of a test gap.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/artifacts/luc-1016-build-architecture-awareness-log.txt`
  - `history/evidence/luc-1016-account-access-resolveaggregatesessionwindowend-proof-2026-07-14.md`
  - `history/tasks/luc-1016-account-access-resolveaggregatesessionwindowend-proof-2026-07-14-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - focused Vitest proof for the new helper spec, then serial
    architecture-awareness -> app-completion -> project-truth refresh plus
    drift and readback checks.
- What is incomplete:
  - the helper still lacks direct source-of-truth documentation and now routes
    as `missing_doc_link`.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining doc-link closure for
    `apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd`;
  - no remaining Test Automation action stays open on this helper row.
