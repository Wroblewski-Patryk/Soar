# LUC-18 QA Regression And Smoke Evidence Baseline (2026-05-25)

## Context
- Issue: `LUC-18 [Soar][QA] Regression and smoke evidence baseline`
- Heartbeat trigger: assignment continuation after prior run failed with adapter error:
  `EPERM: operation not permitted, symlink 'C:\Users\wrobl\.codex\auth.json' -> '...\\codex-home\\auth.json'`.
- Role lane: QA regression lead.

## Goal
- Establish the first runnable local QA baseline command set for Soar.
- Capture exact pass/fail evidence and identify immediate regression blockers.
- Propose minimum smoke coverage for the pilot.

## Scope
- Read required QA governance/testing docs and workspace scripts.
- Run safe local checks first, then one web smoke and one API smoke command.
- Record evidence, blockers, and next QA actions.

## Constraints
- No production mutation.
- No secret handling.
- Smallest coherent verification slice only.

## Definition Of Done
- Runnable baseline command list exists with statuses.
- Known broken checks have exact command + failure evidence.
- Critical workflow smoke plan is listed.

## Forbidden
- Marking QA baseline complete without executable evidence.
- Claiming full readiness from local-only checks.

## Commands And Results
- `pnpm run quality:guardrails` -> implemented and verified (PASS)
- `pnpm run lint` -> implemented and verified (PASS)
- `pnpm run typecheck` -> implemented and verified (PASS)
- `pnpm run test:go-live:web` -> implemented and verified (PASS, `3` files / `18` tests)
- `pnpm run test:go-live:api` -> blocked by error (FAIL)
  - failing test 1: `src/modules/backtests/backtests.e2e.test.ts` (`covers strategy -> backtest -> paper/live parity with reconciliation checks`)
  - exact assertion: `AssertionError: expected 0 to be greater than 0` at `src/modules/backtests/backtests.e2e.test.ts:768`
  - failing test 2: `src/modules/backtests/backtests.e2e.test.ts` (`keeps venue context consistent across backtest -> paper bot -> live order path`)
  - exact error: `Error: Test timed out in 5000ms` at `src/modules/backtests/backtests.e2e.test.ts:837`
  - contextual stderr: `[LivePositionReconciliation] ... failed: Unable to fetch exchange positions snapshot.`

## Baseline Command List (Pilot)
1. `pnpm run quality:guardrails`
2. `pnpm run lint`
3. `pnpm run typecheck`
4. `pnpm run test:go-live:web`
5. `pnpm run test:go-live:api`

## Minimum Smoke Suite Proposal
1. Web contract smoke (`test:go-live:web`) on each QA heartbeat touching UI/API contracts.
2. API go-live smoke (`test:go-live:api`) as required release gate for auth/strategy/backtest/pretrade critical path.
3. If API smoke fails in backtest/live reconciliation scope, run focused follow-up:
   `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run`.

## Result Report
- implemented and verified:
  - QA baseline command ladder exists and is executable.
  - Safe local gates are green.
  - Web smoke is green.
- blocked by error:
  - API smoke currently fails on 2 backtests e2e cases (assertion + timeout) with reproducible evidence above.
- residual risk:
  - Backtest -> paper/live reconciliation path is not release-safe until API smoke failures are resolved.
  - Prior adapter symlink EPERM remains an environment-level orchestration risk outside repo code.

## Resume Delta (2026-05-26)
- Reproduced focused backtests smoke via canonical runner:
  - `pnpm run qa:smoke-e2e:repeatable -- --checks backtests --today 2026-05-26`
  - artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-26.json`
  - evidence: `history/evidence/qa-repeatable-smoke-e2e-2026-05-26.md`
- Result: `FAIL` (`10` failed / `5` passed in `src/modules/backtests/backtests.e2e.test.ts`, duration `315534ms`).
- Observed failure families:
  - repeated timeout at `5000ms` in multiple backtests contract specs
  - repeated FK cleanup failures in `beforeEach/cleanup` path (`prisma.user.deleteMany` at line `217`)
  - inconsistent status assertions (`404 vs 200`, `500 vs 201`) indicating state contamination after cleanup failure
- Updated QA conclusion:
  - `test:go-live:api` is currently **red due to deterministic backtests e2e instability**, not a one-off flaky single assertion.
  - Owner lane for fix should be backend (test isolation + cleanup order + timeout budget), with QA rerun gate on `qa:smoke-e2e:repeatable -- --checks backtests,api`.

## Final Disposition
- Status: `DONE` (issue scope completed).
- Completed scope:
  - baseline command set established,
  - reproducible PASS/FAIL evidence captured,
  - deterministic regression taxonomy documented.
- Out-of-scope follow-up:
  - backend repair of `backtests.e2e` cleanup/isolation defects.

## Reopen Audit (2026-05-26T00:17Z)
- Trigger: issue reopened via board comment (`capacity-controlled batch resume`).
- Scope rule applied: narrow-lane only, no sibling-lane spawn/resume.
- Action taken in this heartbeat:
  - verified existing `DONE` evidence in `TASK_BOARD` and this task packet,
  - no new test execution was required to satisfy issue scope.
- Capacity-governor compliance:
  - no parallel/sibling run activation from this lane,
  - no expansion into backend remediation scope.
- Final decision after reopen audit:
  - keep `LUC-18` as `DONE`; unresolved `backtests.e2e` remediation remains external follow-up scope.

## Handoff Closeout (2026-05-26T00:19Z)
- Finish-successful-run handoff reviewed.
- No new comment scope, blocker, or acceptance-criteria delta detected.
- Lane remains closed as `DONE` with no additional execution required in this issue.
