# Task

## Header
- ID: LUC-932
- Title: Account access `listBotRuntimeSessionSymbolStats` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-932-ACCOUNT-ACCESS-LISTBOTRUNTIMESESSIONSYMBOLSTATS-PROOF-2026-07-13

## Context

`docs/status/project-truth-index.md` routed Account access
`listBotRuntimeSessionSymbolStats` as a live `missing_test_link` gap for the
controller surface
`apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`.
The route already had executable ownership-isolation proof in
`apps/api/src/modules/bots/bots.e2e.test.ts`; the canonical truth chain was
missing the direct test linkage.

## Goal

Close the missing-test-link proof lane by linking the controller entity to the
existing e2e proof and refreshing generated truth in the required serial order.

## Constraints

- Keep scope to proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; docs gaps may remain and must
  be handed off explicitly.

## Definition of Done

- [x] Controller row has direct executable test linkage.
- [x] Focused test command passes.
- [x] Sequential generator readback no longer classifies the scoped row as
      `missing_test_link`.
- [x] Durable evidence and source-of-truth updates name the next owner.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Reality status: verified

## Result Report

- Task summary:
  - linked the controller row to existing runtime-session symbol-stats
    ownership e2e proof and advanced generated truth so the scoped row is now
    a docs-owned `missing_doc_link` item instead of a test gap.
- Files changed:
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-932-account-access-listbotruntimesessionsymbolstats-proof-2026-07-13.md`
  - `history/tasks/luc-932-account-access-listbotruntimesessionsymbolstats-proof-2026-07-13-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested:
  - focused targeted e2e proof for the controller row, then serial
    architecture-awareness -> app-completion -> project-truth refresh.
- What is incomplete:
  - no docs link was added in this lane, so the controller row now routes as
    `missing_doc_link`;
  - the separate read-service docs row remains docs-owned and unchanged.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining source-of-truth
    doc-link closure for the controller row and the existing service row.
