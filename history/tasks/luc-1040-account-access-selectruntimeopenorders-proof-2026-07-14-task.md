# Task

## Header
- ID: LUC-1040
- Title: Account access `selectRuntimeOpenOrders` implemented-needs-proof closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-1039](/LUC/issues/LUC-1039)
- Priority: P1
- Module Confidence Rows: Account access / API bots runtime open-orders selection helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion implemented-needs-proof routing for Account access runtime open-orders selection helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1040-ACCOUNT-ACCESS-SELECTRUNTIMEOPENORDERS-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1040` was assigned after [LUC-1039](/LUC/issues/LUC-1039) advanced
`apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders`
from `missing_doc_link` to `implemented_needs_proof` in the Account access
project-truth queue.

## Goal

Close the remaining proof lane for `selectRuntimeOpenOrders` with the smallest
focused automated verification and canonical traceability refresh.

## Constraints

- Keep scope to proof linkage and focused automated verification.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Preserve role scope: proof/test coverage only; adjacent docs gaps may remain
  and must be handed off explicitly.

## Definition of Done

- [x] Focused executable proof covers deduped count readback, newest-first
      ordering after exchange-aware dedupe, and limit-preserving selection.
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
- Reality status: verified

## Heartbeat Continuation Evidence

- `2026-07-14` liveness-continuation reran the same bounded verification slice
  to leave fresh actionable proof in this issue heartbeat.
- `2026-07-14` liveness continuation attempt `2/2` repeated the focused
  helper proof in this run and reconfirmed `PASS` (`1` file / `7` tests)
  before keeping the issue at local `DONE`.
- Repeated results:
  - focused Vitest PASS (`1` file / `7` tests)
  - architecture-awareness rebuild PASS (`10955` entities / `36279`
    relations)
  - drift strict PASS (`863/863`, `0` missing)
  - app-completion rebuild PASS
  - project-truth rebuild PASS with first Account access gap still
    `resolveClosedResult` as `missing_doc_link`
- `2026-07-14` follow-up liveness heartbeat reran the full scoped chain
  again: focused Vitest PASS (`1` file / `7` tests), architecture-awareness
  PASS (`10958` entities / `36290` relations), drift strict PASS
  (`863/863`, `0` missing), and sequential
  `build-project-truth-indexes.mjs --apply` PASS.
- The standalone `build-app-completion-index.mjs` step hit a transient
  Windows file-open error on `docs/status/app-completion-index.json`, but the
  sequential project-truth apply rebuilt the generated indexes successfully
  and produced the authoritative readback used for closure.
- Current generated truth now routes the next Account access gap to
  `resolveClosedResult` as `implemented_needs_proof`.
- `2026-07-14` final liveness heartbeat reran the minimum authoritative
  closure slice once more: focused Vitest PASS (`1` file / `7` tests) and
  sequential `build-project-truth-indexes.mjs --apply` PASS.
- That final rerun kept the generated truth stable: `selectRuntimeOpenOrders`
  stays closed for this issue, while `resolveClosedResult` remains the next
  Account access `implemented_needs_proof` gap.
- `2026-07-14` subsequent liveness heartbeat repeated the same minimum
  authoritative closure slice and reconfirmed the same result:
  focused Vitest PASS (`1` file / `7` tests), sequential
  `build-project-truth-indexes.mjs --apply` PASS, and unchanged generated
  readback for both `selectRuntimeOpenOrders` and `resolveClosedResult`.
- `2026-07-14` current heartbeat reran the smallest authoritative closure
  chain again and reconfirmed closure with updated readback:
  focused Vitest PASS (`1` file / `7` tests),
  `build-architecture-awareness-index.mjs` PASS (`10965` entities / `36323`
  relations), drift strict PASS (`863/863`, `0` missing), and sequential
  `build-project-truth-indexes.mjs --apply` PASS.
- Current generated truth now advances the first Account access gap past
  `resolveClosedResult` to
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`
  as `missing_doc_link`.
- Closure decision remains unchanged: `selectRuntimeOpenOrders` stays closed
  locally as verified proof with no remaining helper-owned action.

## Result Report

- Task summary:
  - linked the existing focused no-DB helper proof to
    `selectRuntimeOpenOrders` in `priority-test-links.csv`, marked the helper
    verified in `scanner-overrides.json`, and refreshed generated truth so
    `selectRuntimeOpenOrders` is removed from Account access
    `implemented_needs_proof`.
- Files changed:
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-1040-account-access-selectruntimeopenorders-proof-2026-07-14.md`
  - `history/tasks/luc-1040-account-access-selectruntimeopenorders-proof-2026-07-14-task.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - focused Vitest proof for the helper plus serial
    architecture-awareness -> app-completion -> project-truth refresh and
    readback checks.
- What is incomplete:
  - this task does not claim the new first Account access docs-owned gap for
    `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining first gap for
    `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`;
  - no remaining proof action stays open on this helper row.
