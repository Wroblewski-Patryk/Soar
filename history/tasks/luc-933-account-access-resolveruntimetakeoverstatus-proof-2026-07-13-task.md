# Task

## Header
- ID: LUC-933
- Title: Account access `resolveRuntimeTakeoverStatus` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-933-ACCOUNT-ACCESS-RESOLVERUNTIMETAKEOVERSTATUS-PROOF-2026-07-13

## Context

`docs/status/project-truth-index.md` routed Account access
`resolveRuntimeTakeoverStatus` as a live `missing_test_link` gap for
`apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`.
The helper is a narrow runtime takeover classifier, so the smallest valid
closure is direct focused helper proof plus generator readback.

## Goal

Close the missing-test-link proof lane for `resolveRuntimeTakeoverStatus`
without expanding scope into runtime implementation or docs closure.

## Constraints

- Keep scope to focused automated proof, scanner linkage, and generated
  truth refresh.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; docs gaps may remain and must
  be handed off explicitly.

## Definition of Done

- [x] `resolveRuntimeTakeoverStatus` has direct executable test linkage.
- [x] Focused test command passes.
- [x] Sequential generator readback no longer classifies the scoped row as
      `missing_test_link`.
- [x] Durable evidence and source-of-truth updates name the next owner.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts --run --reporter=dot`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Reality status: verified

## Result Report

- Task summary:
  - added focused helper proof for runtime takeover status classification,
    linked it through canonical test metadata, and advanced generated truth so
    the scoped row is now a docs-owned `missing_doc_link` item instead of a
    test gap.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-933-account-access-resolveruntimetakeoverstatus-proof-2026-07-13.md`
  - `history/tasks/luc-933-account-access-resolveruntimetakeoverstatus-proof-2026-07-13-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested:
  - focused helper proof, then serial architecture-awareness ->
    app-completion -> project-truth refresh.
- What is incomplete:
  - no docs link was added in this lane, so the helper now routes as
    `missing_doc_link`;
  - neighboring helpers `dedupeRuntimeOpenOrders` and
    `selectRuntimeOpenOrders` remain separate docs-owned follow-ups after the
    same focused test file gave them executable proof.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining source-of-truth
    doc-link closure for `resolveRuntimeTakeoverStatus`,
    `dedupeRuntimeOpenOrders`, and `selectRuntimeOpenOrders`.
