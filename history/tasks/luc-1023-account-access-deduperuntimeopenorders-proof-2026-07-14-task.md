# Task

## Header
- ID: LUC-1023
- Title: Account access `dedupeRuntimeOpenOrders` implemented-needs-proof closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-1019](/LUC/issues/LUC-1019)
- Priority: P1
- Module Confidence Rows: Account access / API bots runtime open-orders dedupe helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion implemented-needs-proof routing for Account access runtime open-orders dedupe helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1023-ACCOUNT-ACCESS-DEDUPERUNTIMEOPENORDERS-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1023` was assigned after [LUC-1019](/LUC/issues/LUC-1019) advanced
`apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`
from `missing_doc_link` to `implemented_needs_proof` in the Account access
project-truth queue.

## Goal

Close the remaining proof lane for `dedupeRuntimeOpenOrders` with the smallest
focused automated verification and canonical traceability refresh.

## Constraints

- Keep scope to proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; adjacent docs gaps may remain
  and must be handed off explicitly.

## Definition of Done

- [x] Focused executable proof covers exchange-id trimming, exchange-synced
      preference, same-origin latest-update winner selection, newest-first
      ordering, and limit-preserving selection.
- [x] Focused test command passes.
- [x] Canonical proof metadata links the helper to the spec and marks it
      verified.
- [x] Sequential generator readback no longer classifies the helper as
      `implemented_needs_proof`.
- [x] Durable evidence names the next owner for the remaining first gap.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts --run --reporter=dot`
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
- Additional check:
  - `corepack pnpm --filter api run typecheck` -> FAIL in unrelated existing
    files `auth.loginUser.test.ts`, `auth.registerUser.test.ts`, and
    `runtimeSessionTradesRead.list.test.ts`
- Reality status: verified

## Result Report

- Task summary:
  - added focused no-DB helper proof in
    `runtimeSessionOpenOrdersReadModel.service.test.ts`, linked the helper in
    `priority-test-links.csv`, marked it verified in
    `scanner-overrides.json`, and refreshed generated truth so
    `dedupeRuntimeOpenOrders` is removed from Account access
    `implemented_needs_proof`.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-1023-account-access-deduperuntimeopenorders-proof-2026-07-14.md`
  - `history/tasks/luc-1023-account-access-deduperuntimeopenorders-proof-2026-07-14-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - focused Vitest proof for the helper plus serial
    architecture-awareness -> app-completion -> project-truth refresh and
    readback checks; API typecheck was also attempted and failed in unrelated
    existing files outside this scope.
- What is incomplete:
  - `resolveRuntimeTakeoverStatus` is now the first Account access docs-owned
    gap; this task does not claim its documentation closure.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining first gap for
    `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`;
  - no remaining QVE action stays open on this helper row.
