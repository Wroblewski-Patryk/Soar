# Task

## Header
- ID: LUC-902
- Title: Account access `listBotRuntimeSessions` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-902-ACCOUNT-ACCESS-LISTBOTRUNTIMESESSIONS-PROOF-2026-07-13

## Context

`docs/status/project-truth-index.md` routed Account access
`listBotRuntimeSessions` as a live `missing_test_link` gap for both the
controller surface
`apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessions`
and the read service
`apps/api/src/modules/bots/runtimeSessionRead.service.ts#listBotRuntimeSessions`.

## Goal

Close the missing-test-link proof lane by linking the controller to existing
route proof, adding the smallest focused read-service spec, and refreshing
generated truth in the required serial order.

## Constraints

- Keep scope to proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; docs gaps may remain and must
  be handed off explicitly.

## Definition of Done

- [x] Controller row has direct executable test linkage.
- [x] Read-service row has direct executable focused proof.
- [x] Focused test commands pass.
- [x] Sequential generator readback no longer classifies either scoped row as
      `missing_test_link`.
- [x] Durable evidence and source-of-truth updates name the next owner and the
      source-control blocker.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionRead.list.test.ts --run --reporter=dot`
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Source-control readback:
  - `git status --porcelain=v1 -uall`
  - `git diff --check`
- Reality status: verified

## Result Report

- Task summary:
  - linked the controller row to existing runtime-session ownership e2e proof,
    added a focused no-DB read-service spec for owned-bot gating and query
    forwarding, and advanced generated truth so both scoped rows are now
    docs-owned `missing_doc_link` items instead of test gaps.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionRead.list.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-902-account-access-listbotruntimesessions-proof-2026-07-13.md`
  - `history/tasks/luc-902-account-access-listbotruntimesessions-proof-2026-07-13-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested:
  - focused Vitest unit proof for the service row, focused targeted e2e proof
    for the controller row, then serial architecture-awareness ->
    app-completion -> project-truth refresh.
- What is incomplete:
  - no docs link was added in this lane, so both scoped entities still route as
    `missing_doc_link`;
  - source-control closure is not complete in this heartbeat because the shared
    worktree remains a mixed generated/docs bundle (`21` modified tracked paths
    plus `1` untracked test file).
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining source-truth doc-link
    closure for both scoped `listBotRuntimeSessions` entities;
  - Source Control / Release owner must classify or batch the existing dirty
    bundle before any commit/push claim is made from this checkout.
