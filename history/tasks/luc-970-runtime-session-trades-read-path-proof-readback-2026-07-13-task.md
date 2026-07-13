# Task

## Header
- ID: LUC-970
- Title: Add focused automated proof for runtime session trades read path
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: not applicable
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-970-RUNTIME-SESSION-TRADES-READ-PATH-PROOF-READBACK-2026-07-13
- Mission Status: VERIFIED

## Context

The wake for `LUC-970` asked for focused automated proof of the runtime session
trades read path. Local project truth already showed the same proof lane was
closed earlier on 2026-07-13 by [LUC-938](/LUC/issues/LUC-938), so this task
needed stale-gap verification rather than a second implementation pass.

## Goal

Confirm whether the runtime session trades read path still lacks focused
automated proof. If the proof is already present, record the exact evidence,
rerun the focused test, and close the issue as a stale duplicate without adding
new runtime or test logic.

## Constraints

- No new runtime code, deploy, push, restart, rollback, env edits, or protected
  account/session checks.
- Keep the lane inside Test Automation ownership.
- Treat [LUC-938](/LUC/issues/LUC-938) as the canonical earlier proof packet if
  current rerun agrees.

## Definition of Done

- [x] Existing local proof ownership for the runtime session trades read path is
      identified.
- [x] The focused local Vitest proof is rerun successfully on 2026-07-13.
- [x] Durable evidence states whether `LUC-970` required new implementation.

## Forbidden

- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionTradesRead.list.test.ts --run --reporter=dot`
- Manual checks:
  - inspected `apps/api/src/modules/bots/runtimeSessionTradesRead.list.test.ts`
  - inspected `history/evidence/luc-938-runtime-session-trades-and-symbol-stats-backend-reads-2026-07-13.md`
  - inspected `history/tasks/luc-938-runtime-session-trades-and-symbol-stats-backend-reads-2026-07-13-task.md`
- Screenshots/logs: not applicable
- High-risk checks: not applicable
- Module confidence ledger updated: no
- Module confidence rows closed or changed: not applicable
- Requirements matrix updated: no
- Requirement rows closed or changed: not applicable
- Quality scenarios updated: no
- Quality scenario rows closed or changed: not applicable
- Risk register updated: no
- Risk rows closed or changed: not applicable
- Reality status: verified

## Result Report

- Task summary:
  - verified that the focused runtime session trades read-path proof already
    existed from [LUC-938](/LUC/issues/LUC-938) and remains green on a fresh
    rerun;
  - confirmed `LUC-970` did not require a second implementation pass.
- Files changed:
  - `history/tasks/luc-970-runtime-session-trades-read-path-proof-readback-2026-07-13-task.md`
  - `history/evidence/luc-970-runtime-session-trades-read-path-proof-readback-2026-07-13.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested:
  - reran the focused read-path Vitest spec and compared the result with the
    existing July 13 proof packet from [LUC-938](/LUC/issues/LUC-938).
- What is incomplete:
  - no Test Automation work remains for the scoped runtime session trades read
    path;
  - direct source-of-truth doc links for the scoped controller and read-service
    rows remain a separate docs-owned follow-up.
- Next steps:
  - close `LUC-970` as stale-proof duplicate with typed completion evidence that
    references the existing [LUC-938](/LUC/issues/LUC-938) packet and today’s
    rerun.
- Decisions made:
  - no new proof code was added because the requested proof already exists and
    still passes.
