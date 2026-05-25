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

