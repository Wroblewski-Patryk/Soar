# V1 Live Stability Closure Plan (2026-04-06)

Status: closed (OPV closure finalized on 2026-04-19; final gates `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS`).

## Canonical Queue Linkage
- Canonical queue owner for final non-code closure wave: `docs/planning/mvp-next-commits.md` (`OPV-A`, closed).
- Canonical phase owner: `docs/planning/mvp-execution-plan.md` (`OPV-01..OPV-04`).
- Remaining execution scope: none (historical closure evidence reference only).

## Context
- Post-change validation showed one reproducible backtest replay regression:
  - `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
  - failing scenario: `emits trailing-take-profit event when arm and pullback thresholds are hit`
  - symptom: `eventCounts.TTP = 0` in expected TTP scenario.
- Runtime/live positions confidence pack remains green in focused suites.
- Final private-route production verification run resolved previously open worker-gate blockers (`Gate 2`, `Gate 4`).

## Objective
- Finish V1 with production-ready confidence for:
  - backtest parity correctness,
  - bot runtime position handling (paper/live),
  - production exit evidence package and formal sign-off.

## Execution Rules
- Keep tiny-commit mode: one logical step per commit.
- Prioritize `fix/test/chore` before any new feature.
- No scope expansion to V2/agent rollout until this closure plan is complete.

## Tiny-Commit Sequence
- [x] `V1B-01 fix(api-backtest-core): restore deterministic TTP event emission in replay core and align TTP field semantics with runtime parser contract`
- [x] `V1B-02 test(api-parity): add explicit regression asserting identical TTP/TSL config interpretation between replay parser and runtime automation parser`
- [x] `V1B-03 test(api-runtime-live): extend runtime/positions e2e coverage for bot-managed lifecycle actions and manual-managed ignore behavior`
- [x] `V1B-04 test(confidence-pack): run full backtest + runtime positions confidence pack (api+web) and capture fresh evidence`
- [x] `V1B-05 release(v1-exit-gates): refresh RC external-gates/sign-off artifacts and include Binance live-ops verification checklist`

## Verification Pack (Target)
- Backtest/API:
  - `backtestReplayCore.test.ts`
  - `backtestFillModel.test.ts`
  - `backtestParity3Symbols.test.ts`
  - `backtests.e2e.test.ts`
- Runtime/positions/API:
  - `runtimePositionAutomation.service.test.ts`
  - `runtimeCrashRetry.regression.test.ts`
  - `livePositionReconciliation.service.test.ts`
  - `positions.exchangeSnapshot.e2e.test.ts`
  - `positions-live-status.e2e.test.ts`
  - `orders.service.test.ts`
  - `orders-positions.e2e.test.ts`
  - `liveOrderAdapter.service.test.ts`
- Runtime/positions/UI:
  - `HomeLiveWidgets.test.tsx`
  - `BotsManagement.test.tsx`
  - `PositionsBoard.test.tsx`

## Done Criteria
- TTP replay regression fixed and covered with deterministic tests.
- Backtest and runtime/positions confidence packs green.
- V1 external gates updated with fresh production evidence.
- Formal release sign-off artifacts updated and complete.
- Final blocker status: resolved in OPV closure run (`2026-04-19T15:13:58.943Z`) with `Gate 2` and `Gate 4` promoted to `PASS`.
