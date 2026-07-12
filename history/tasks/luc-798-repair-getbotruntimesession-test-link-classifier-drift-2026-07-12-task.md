# LUC-798 Repair getBotRuntimeSession Test-Link Classifier Drift

## Header

- ID: LUC-798
- Title: Repair getBotRuntimeSession test-link classifier drift
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Runtime & Adapter Engineer
- Depends on: [LUC-791](/LUC/issues/LUC-791)
- Priority: P0
- Module Confidence Rows: Account access / API bots runtime session detail source-truth readback
- Requirement Rows: not applicable
- Quality Scenario Rows: status-index readback consistency
- Risk Rows: stale generated source-truth outputs
- Iteration: 2026-07-12
- Operation Mode: TESTER
- Mission ID: `LUC-798-GETBOTRUNTIMESESSION-TEST-LINK-DRIFT-2026-07-12`
- Mission Status: VERIFIED

## Context

`LUC-791` proved an executable test relation for
`apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`, but the
generated app-completion/project-truth outputs still classified that controller
row as `missing_test_link`.

## Goal

Verify whether the drift is a live classifier defect or stale generated state,
refresh the minimal source-of-truth chain, and leave durable evidence naming
the true remaining gaps.

## Scope

- Refreshed generated outputs:
  `docs/status/app-completion-index.json`,
  `docs/status/app-completion-index.md`,
  `docs/status/project-truth-index.json`,
  `docs/status/project-truth-index.md`.
- Added durable evidence:
  `history/evidence/luc-798-repair-getbotruntimesession-test-link-classifier-drift-2026-07-12.md`.
- Added task record:
  `history/tasks/luc-798-repair-getbotruntimesession-test-link-classifier-drift-2026-07-12-task.md`.

## Implementation Plan

1. Read the current architecture-awareness graph for both
   `getBotRuntimeSession` entities.
2. Recompute `app-completion` from the current graph without changing runtime
   code.
3. Recompute `project-truth` and verify whether the controller row still
   appears as `missing_test_link`.
4. Record the resolved stale-state drift and the true remaining follow-up rows.

## Acceptance Criteria

- The controller row no longer appears as `missing_test_link`.
- The durable evidence distinguishes the controller row from the separate
  `runtimeSessionRead.service.ts#getBotRuntimeSession` row.
- No runtime implementation or deploy action is performed.

## Definition of Done

- Current generated readback is refreshed from the existing graph.
- Evidence and task records explain why no runtime-adapter code change was made.
- The next owner/action for the remaining rows is named.

## Forbidden

- Do not add duplicate proof tests just to silence the index.
- Do not modify runtime code when the current graph already proves the relation.
- Do not push, deploy, restart, rollback, or run protected/live actions.

## Validation Evidence

- Readback:
  - `docs/graphs/architecture-awareness.json` shows
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` as
    `status: verified` with a `tests` relation from
    `apps/api/src/modules/bots/bots.e2e.test.ts`.
- Commands:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> PASS, `missingTestLink=976`, controller row now `hasTest=true`,
    `risk=missing_doc_link`.
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
    -> PASS, no `getBotRuntimeSession` controller gap remains as
    `missing_test_link`.
- Reality status: verified.

## Result Report

- Task summary:
  the reported classifier drift was stale generated state, not a reproducible
  bug in the current `build-app-completion-index` logic. Recomputing the
  status outputs from the current graph correctly reclassifies
  `bots.controller.ts#getBotRuntimeSession` to `missing_doc_link`.
- Remaining true gap:
  `apps/api/src/modules/bots/runtimeSessionRead.service.ts#getBotRuntimeSession`
  still remains a separate `missing_test_link` row and was not changed here.
- Next owner/action:
  Docs Memory Lead + Project Manager owns the controller doc-link follow-up;
  Test Automation Engineer + QA Regression Lead owns the separate runtime-read
  service proof row.
- Tracker note:
  no Paperclip control-plane mutation tool was available in this session, so
  the board-side issue status could not be flipped from here.
