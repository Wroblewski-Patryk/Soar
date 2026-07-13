# Task

## Header
- ID: LUC-938
- Title: Prove runtime session trades and symbol-stats backend reads
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-938-RUNTIME-SESSION-TRADES-AND-SYMBOL-STATS-BACKEND-READS-2026-07-13

## Context

`docs/status/project-truth-index.md` still routed runtime session backend reads
as open Account access proof gaps. In the current local checkout,
`listBotRuntimeSessionSymbolStats` already had a completed proof-link lane via
`LUC-932`, while `listBotRuntimeSessionTrades` still lacked direct executable
proof linkage for the controller row and a focused no-DB proof for the read
service row.

## Goal

Close the backend-read proof lane for runtime session `trades`, confirm the
already-landed local `symbol-stats` proof state, and refresh generated truth so
both backend read surfaces route as docs-owned `missing_doc_link` rows instead
of test gaps.

## Constraints

- Keep scope to backend proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: backend/API read proof only; remaining docs gaps must be
  handed off explicitly.

## Definition of Done

- [x] `listBotRuntimeSessionTrades` controller row has direct executable test
      linkage.
- [x] `listBotRuntimeSessionTrades` read-service row has direct executable
      focused proof.
- [x] Focused proof commands pass.
- [x] Sequential generator readback no longer classifies scoped `trades` or
      `symbol-stats` backend rows as `missing_test_link`.
- [x] Durable evidence and source-of-truth updates name the next owner.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionTradesRead.list.test.ts --run --reporter=dot`
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Source-control readback:
  - `git diff --check`
- Reality status: verified

## Result Report

- Task summary:
  - added a focused no-DB proof for
    `runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`,
    linked the controller row to the existing runtime monitoring e2e proof, and
    refreshed generated truth so runtime session `trades` and the already-local
    `symbol-stats` backend read lane now route as docs-owned `missing_doc_link`
    rows.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.list.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-938-runtime-session-trades-and-symbol-stats-backend-reads-2026-07-13.md`
  - `history/tasks/luc-938-runtime-session-trades-and-symbol-stats-backend-reads-2026-07-13-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested:
  - focused Vitest proof for the `trades` read-service row, focused targeted
    e2e proof for controller runtime monitoring routes, then sequential
    `architecture-awareness -> app-completion -> project-truth` refresh.
- What is incomplete:
  - direct docs/source-of-truth links are still missing for
    `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`,
    `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`,
    `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`,
    and
    `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#listBotRuntimeSessionSymbolStats`.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining doc-link closure for
    the four scoped runtime read entities.
