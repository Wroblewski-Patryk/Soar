# V1BACKTEST-01 - Futures Backtest Kline Recovery

## Header
- ID: V1BACKTEST-01
- Title: fix(api-backtests): recover futures candles when primary kline endpoint is unavailable
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: none
- Priority: P1
- Iteration: 2026-05-02 ad-hoc operator regression
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
An operator reported that a production backtest detail page did not show useful
results after several PAPER/LIVE runtime changes. Production smoke with a fresh
safe account reproduced a mode-specific issue: a `FUTURES` backtest completed
as `FAILED` with `NO_CANDLES_AVAILABLE_FOR_SYMBOL`, while a comparable `SPOT`
backtest completed and produced trades.

## Goal
Keep the existing backtest architecture and recover Binance USD-M futures
candle loading when the primary symbol kline endpoint returns no usable candle
payload.

## Scope
- `apps/api/src/modules/backtests/backtestDataGateway.ts`
- `apps/api/src/modules/backtests/backtestDataGateway.test.ts`
- `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
- `.codex/context/LEARNING_JOURNAL.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Reproduce production behavior with safe backtest-only runs.
2. Review commits from the last three days touching backtest/runtime strategy semantics.
3. Add a futures-only kline fallback to `continuousKlines` when `/fapi/v1/klines`
   is unavailable or returns no candles.
4. Keep SPOT behavior unchanged and avoid using SPOT candles as a hidden
   substitute for FUTURES.
5. Align stale backtest replay TSL regression data to the current negative-start
   plus positive-step contract.
6. Run focused API validation and sync source-of-truth docs.

## Acceptance Criteria
- [x] Production failure mode is identified with concrete evidence.
- [x] `FUTURES` kline fetch has an approved futures-market fallback.
- [x] SPOT kline behavior is unchanged.
- [x] Backtest replay tests reflect current TSL semantics.
- [x] Focused API validation passes.

## Definition of Done
- [x] Existing systems reused; no new subsystem introduced.
- [x] No workaround path or SPOT/FUTURES venue substitution introduced.
- [x] Validation evidence recorded.
- [x] Source-of-truth docs updated.

## Validation Evidence
- Production smoke before fix:
  - `FUTURES` run `d92219d3-ae5a-480f-ae35-1293e87339bf`: `FAILED`,
    `NO_CANDLES_AVAILABLE_FOR_SYMBOL`, `totalTrades=0`.
  - `SPOT` run `553a5c1a-66a9-4c70-be20-6c044cb11010`: `COMPLETED`,
    `totalTrades=2`.
- Commit review:
  - `a7c0a357` touched `backtestReplayCore.ts` for TSL negative-start plus
    step semantics.
  - `fbeae8f0` touched `backtests.e2e.test.ts` for V1 contract alignment.
- Local validation:
  - `pnpm --filter api run test -- src/modules/backtests/backtestDataGateway.test.ts --run` -> PASS (`3/3`)
  - `pnpm --filter api run test -- src/modules/backtests/backtestReplayCore.test.ts --run` -> PASS (`25/25`)
  - `pnpm --filter api run test -- src/modules/backtests/backtests.e2e.test.ts --run` -> PASS (`14/14`)
  - `pnpm --filter api run typecheck` -> PASS
  - `pnpm --filter api run build` -> PASS
  - `pnpm run quality:guardrails` -> PASS

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the gateway fallback commit if production kline behavior
  regresses.
- Observability or alerting impact: failed futures backtests should drop once
  production deploy includes this change.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: production `FUTURES` backtests could fail with no candle input while
  `SPOT` backtests completed.
- Gap: the primary futures kline endpoint failure collapsed into empty candles
  without a futures-specific fallback.
- Inconsistency: one replay-core regression still used old positive TSL test
  data after the repository moved to negative-start TSL semantics.
- Architecture constraints: preserve mode parity and venue truth; do not use
  SPOT candles for FUTURES.

### 2. Select One Priority Task
- Selected task: recover futures backtest candle acquisition.
- Priority rationale: backtest results are needed by the operator and the issue
  blocks backtest confidence.
- Deferred: UI pagination for historical backtest lists remains a possible
  follow-up, but the reproduced failure was data acquisition.

### 3. Plan Implementation
- Files modified: listed in Scope.
- Logic: parse kline payloads through a shared parser and retry FUTURES chunks
  through `/fapi/v1/continuousKlines` when primary symbol klines fail or are
  empty.
- Edge cases: invalid payload rows still filter out; empty fallback still
  returns empty and preserves existing failed-symbol diagnostics.

### 4. Execute Implementation
- Added futures-only continuous-kline fallback.
- Added focused gateway regression coverage.
- Updated stale replay-core TSL fixture to current semantics.

### 5. Verify and Test
- Validation performed: focused gateway/replay/e2e/typecheck/build/guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: surfacing a better error only. Rejected because it
  would not restore usable backtest results.
- Technical debt introduced: no.
- Scalability assessment: existing chunking and DB cache write path are reused.
- Refinements made: kept fallback market-specific and avoided hidden SPOT data.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `mvp-next-commits`, context files.
- Context updated: `PROJECT_STATE`, `TASK_BOARD`.
- Learning journal updated: yes.

## Result Report
- Task summary: recovered futures backtest candle fetches through a futures
  continuous-kline fallback and aligned stale TSL replay evidence.
- Files changed: see Scope.
- How tested: see Validation Evidence.
- What is incomplete: production `FUTURES` backtest should be rerun after
  deploy to confirm the fix on the VPS.
- Next steps: deploy/promote this change, then recreate a small FUTURES
  production backtest and confirm `COMPLETED` with candle coverage and trades.
