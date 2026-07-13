# Task

## Header
- ID: LUC-898
- Title: Account access `listBotRuntimeSessionPositions` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-898-ACCOUNT-ACCESS-LISTBOTRUNTIMESESSIONPOSITIONS-PROOF-2026-07-13

## Context

`docs/status/project-truth-index.md` routed Account access
`listBotRuntimeSessionPositions` as a live `missing_test_link` gap for both the
controller surface
`apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionPositions`
and the read-model service
`apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#listBotRuntimeSessionPositions`.

## Goal

Close the missing-test-link proof lane by linking the controller to an existing
route proof, adding the smallest focused read-model spec for the service path,
and refreshing generated truth.

## Constraints

- Keep scope to proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; docs gaps may remain and must
  be handed off explicitly.

## Definition of Done

- [x] Controller row has direct executable test linkage.
- [x] Read-model service row has direct executable focused proof.
- [x] Focused test commands pass.
- [x] Sequential generator readback no longer classifies either scoped row as
      `missing_test_link`.
- [x] Durable evidence and source-of-truth updates name the next owner.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.list.test.ts --run --reporter=dot`
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Reality status: verified

## Result Report

- Task summary:
  - linked the controller row to existing owner/non-owner positions-route proof,
    added a focused no-DB read-model spec for owned-session gating and
    `BOT_MANAGED` scope, and advanced generated truth so both scoped rows are
    now docs-owned `missing_doc_link` items instead of test gaps.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.list.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-898-account-access-listbotruntimesessionpositions-proof-2026-07-13.md`
  - `history/tasks/luc-898-account-access-listbotruntimesessionpositions-proof-2026-07-13-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested:
  - focused Vitest unit proof for the service row, focused targeted e2e proof
    for the controller row, then sequential architecture-awareness ->
    app-completion -> project-truth refresh.
- What is incomplete:
  - no docs link was added in this lane, so both scoped entities still route as
    `missing_doc_link`.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining source-truth doc-link
    closure for both scoped `listBotRuntimeSessionPositions` entities.
