# Task

## Header
- ID: LUC-934
- Title: Account access `dedupeRuntimeOpenOrders` stale missing-test-link readback closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-934-ACCOUNT-ACCESS-DEDUPERUNTIMEOPENORDERS-READBACK-2026-07-13

## Context

The wake title for [LUC-934](/LUC/issues/LUC-934) still named
`dedupeRuntimeOpenOrders` as an Account access `missing_test_link` gap.
However, adjacent local proof work in [LUC-933](/LUC/issues/LUC-933) already
linked the shared focused open-orders helper test file to the runtime
open-orders helper family. This heartbeat needed a fresh verification readback
to determine whether `LUC-934` still required new proof work or had become a
docs-owned follow-up.

## Goal

Close `LUC-934` with fresh evidence that accurately classifies the current
state of `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`.

## Constraints

- No runtime implementation, proof-link registry, or docs-link changes unless
  the fresh readback proves they are still required.
- Keep scope to focused helper verification, serial generator readback, and
  durable state closure for this issue.
- Preserve role boundaries: if the row is no longer a test gap, hand off to
  the correct next owner instead of expanding into docs work.

## Definition of Done

- [x] The focused runtime open-orders helper test command is rerun and passes.
- [x] The serial architecture-awareness -> app-completion -> project-truth
      readback is refreshed.
- [x] `dedupeRuntimeOpenOrders` is classified with current evidence-backed
      status and next owner.
- [x] Durable issue evidence and source-of-truth updates are written for
      `LUC-934`.

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
  - verified that `dedupeRuntimeOpenOrders` no longer needs a test-automation
    implementation slice;
  - confirmed the helper remains linked to the focused open-orders helper test
    file through generated architecture awareness;
  - confirmed the current gap is docs-owned `missing_doc_link`, not
    `missing_test_link`.
- Files changed:
  - `history/tasks/luc-934-account-access-deduperuntimeopenorders-readback-2026-07-13-task.md`
  - `history/evidence/luc-934-account-access-deduperuntimeopenorders-readback-2026-07-13.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested:
  - reran the focused helper test file and the serial generator chain.
- What is incomplete:
  - no direct docs link was added for
    `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`;
    that remains outside the Test Automation Engineer lane.
- Next steps:
  - Docs Memory Lead + Project Manager should close the remaining direct
    doc-link gap for `dedupeRuntimeOpenOrders`.
