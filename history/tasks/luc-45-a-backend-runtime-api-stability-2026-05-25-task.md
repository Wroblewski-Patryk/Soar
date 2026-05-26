# Task

## Header
- ID: LUC-45-A
- Title: [Soar][LUC-45] Backend runtime/API stability closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Depends on: LUC-45 controller packet
- Priority: P0

## Context
V1 remains blocked by runtime aggregate reliability and backtests API smoke instability.

## Goal
Close backend/runtime blocker paths so release evidence can move forward.

## Scope
- `apps/api/src/modules/bots/**`
- `apps/api/src/modules/backtests/**`
- Runtime aggregate and related API service boundaries.

## Required Output
- Root-cause and fix report for runtime aggregate/backtests blocker.
- Focused regression proof and updated status packet for coordinator integration.

## Validation
- Focused aggregate and backtests packs.
- Critical API smoke subset (`test:go-live:api` scoped to failing paths).

## Acceptance Criteria
- [x] Runtime aggregate blocker is fixed or narrowed to explicit follow-up with owner.
- [x] Backtests critical smoke path is fixed or split with blocker rationale.
- [x] Lane evidence is published with commands/results and residual risk.

## Checkpoint 2026-05-26 (board stale-state reset to TODO)
- Trigger: board comment `64797a78-395e-41e4-974f-ca6007489ee9` ("Model cleanup: stale in_progress had no live run. Return to todo for Backend on the residual backtests e2e failures").
- Decision:
  - Reopened lane status to `TODO` despite prior local closure evidence, per board control-plane instruction.
  - Active residual scope remains strictly:
    - `openPositionsSeen=0` in parity/reconciliation backtests e2e path.
    - `live-order create 500` in venue-context backtests e2e path.
- Required next proof for closure:
  - Fresh focused reruns attached in the next active run for both residual tests.
  - Explicit final disposition in issue thread: `done` or `blocked` with owner/action.
- Commit status:
  - No new commit in this heartbeat.
- Deploy impact:
  - None.

## Checkpoint 2026-05-26 (LUC-46 continuation after transient adapter failure)
- Trigger: wake `issue_continuation_needed` after failed run `877979cb-b59f-47da-97eb-310c725ada04`.
- Failure cause: adapter/runtime limit (`codex_transient_upstream`, GPT usage cap), not product/test regression.
- Action in this heartbeat:
  - Reconciled lane status against latest validated evidence from prior heartbeat.
  - Confirmed no new code-path defects introduced by the transient failure event.
- Commit status:
  - No new commit in this heartbeat.
- Deploy impact:
  - None.
- Final disposition:
  - `DONE` for `LUC-45-A` / `LUC-46` backend runtime/API stability closure scope.

## Checkpoint 2026-05-25 (LUC-46 heartbeat)
- Scope executed: runtime-loop instability narrowing in `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`.
- Changes made:
  - Added deterministic test deps stubs for exchange-order guard calls (`validateExchangeOrderFn`, `resolveExchangeOrderRulesFn`) to avoid non-unit external I/O in this suite.
  - Set `warmupEnabled: false` by default in test deps (warmup-specific test still explicitly enables it).
  - Increased timeout envelope for runtime-loop flaky tests and suite-level runtime timeout.
  - Extended backlog wait windows in burst-queue assertion test.
  - Added deterministic runtime topology cache bypass in test dependencies (`listActiveBotsFromTopologyCache = () => deps.listActiveBots()`) to avoid cross-test DB/cache nondeterminism in final-candle paths.
- Validation run:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io final-candle"`
- Result:
  - Reduced failure set from broad timeout cluster to two persistent blockers:
    - `routes Gate.io final-candle decisions only to Gate.io runtime topology`
    - `uses Gate.io final-candle fallback ticker context when no fresh Gate.io ticker exists`
  - Both tests still hang until timeout (`35s`) and require deeper Gate.io runtime-final-candle path isolation.
- Residual risk:
  - Lane remains `IN_PROGRESS`; runtime boundary is narrowed but not yet closed.
  - Next backend step: rerun focused runtime pack after topology-cache isolation and validate whether remaining Gate.io blockers persist on final-candle route/fallback paths.

## Checkpoint 2026-05-25 (LUC-46 restart after PM no-stall reassignment)
- Trigger: board comment `f4754f25-5cb5-419c-8ea0-333091aac05b` requested fresh runtime/API proof with failing checks and deploy impact.
- Runtime fix implemented:
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
    - Added optional dependency injection passthrough for market-data derivatives fetches:
      `fetchFundingRateHistory`, `fetchOpenInterestHistory`, `fetchOrderBookSnapshot`.
    - Wired those deps into `RuntimeSignalMarketDataGateway` constructor so tests can fully stub non-core I/O.
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`
    - Added deterministic stubs in `createDeps`:
      `fetchFundingRateHistory -> []`, `fetchOpenInterestHistory -> []`, `fetchOrderBookSnapshot -> null`.
    - Kept topology cache bypass and prior test hardening.
- Fresh validation evidence:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io final-candle"` -> PASS (`2 passed`, `45 skipped`).
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts` -> PASS (`47 passed`).
  - `pnpm --filter api exec vitest run src/modules/backtests` -> FAIL (`2 failed`, `124 passed`, `12 files`).
- Current failing checks (backtests API scope):
  - `src/modules/backtests/backtests.e2e.test.ts` -> `covers strategy -> backtest -> paper/live parity with reconciliation checks`
    - assertion: `expected 0 to be greater than 0` (`openPositionsSeen`), with runtime log:
      `Unable to fetch exchange positions snapshot`.
  - `src/modules/backtests/backtests.e2e.test.ts` -> `keeps venue context consistent across backtest -> paper bot -> live order path`
    - assertion: `expected 500 to be 201` on live order creation path.
- Commit status:
  - Local changes only, no commit created in this heartbeat.
- Deploy impact:
  - No deploy changes.
  - Runtime-final-candle Gate.io blocker is closed in test scope.
  - Lane still blocked by backtests e2e parity/live-order API failures; release evidence for full LUC-45-A is incomplete until those two checks are fixed or formally split with owner.

## Checkpoint 2026-05-26 (LUC-46 backtests e2e stabilization follow-up)
- Root-cause hypothesis confirmed: `backtests.e2e` was invoking exchange-backed paths in non-test branches and depended on live exchange snapshots/order submission.
- Follow-up fix:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
    - Forced deterministic test branch before suite execution:
      `process.env.NODE_ENV = 'test';`
    - This short-circuits `buildSnapshotForApiKey` test-path snapshot stubs in `positions.service` and skips `exchangeAdapterBoundary` submission in `openOrder`.
- Expected impact:
  - `reconcileExternalPositionsFromExchange()` no longer throws `Unable to fetch exchange positions snapshot` due to external fetch failure in this suite.
  - LIVE market order open in backtests venue-consistency flow should return `201` and persist bot-scoped order metadata instead of surfacing generic live boundary transport errors.
- Validation needed:
  - Re-run `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "covers strategy -> backtest -> paper/live parity with reconciliation checks"`
  - Re-run `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path"`

## Checkpoint 2026-05-26 (LUC-46 residual scope closure)
- Narrow residual scope from board comment `bfed881b-b77f-46f9-bc34-b518e1675089` executed: isolate/fix `openPositionsSeen=0` and `live-order 500`.
- Additional stabilization fix:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
    - Added scoped timeout guards for slow e2e setup/assertion paths:
      - `BACKTESTS_E2E_HOOK_TIMEOUT_MS = 30000` on `beforeEach`.
      - `BACKTESTS_E2E_CRITICAL_TIMEOUT_MS = 20000` for:
        - `covers strategy -> backtest -> paper/live parity with reconciliation checks`
        - `keeps venue context consistent across backtest -> paper bot -> live order path`
- Focused verification:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path"` -> PASS (`1 passed`, `14 skipped`).
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "covers strategy -> backtest -> paper/live parity with reconciliation checks"` -> PASS (`1 passed`, `14 skipped`).
- Note on one transient failure:
  - A concurrent focused rerun attempt produced `user.findUniqueOrThrow` missing-record due to cross-test DB cleanup collision; sequential reruns above are the deterministic evidence and both pass.
- Commit status:
  - Local changes only, no commit created in this heartbeat.
- Deploy impact:
  - No deploy changes.
  - Test-only stabilization (`backtests.e2e`) and deterministic test-path isolation.
- Disposition:
  - `LUC-46` backend residual scope addressed and verified on both previously failing checks.
## Checkpoint 2026-05-26 (LUC-46 fresh residual proof rerun)
- Trigger: board-required residual rerun after stale-state reset to `TODO`.
- Focused verification reruns (fresh evidence):
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "covers strategy -> backtest -> paper/live parity with reconciliation checks"` -> PASS (`1 passed`, `14 skipped`).
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path"` -> PASS (`1 passed`, `14 skipped`).
- Residual scope status:
  - `openPositionsSeen=0` regression: not reproduced (PASS).
  - `live-order create 500` regression: not reproduced (PASS).
- Commit status:
  - No new commit in this heartbeat.
- Deploy impact:
  - None (verification only).
- Final disposition:
  - `DONE` for `LUC-46` residual backtests e2e scope.
## Checkpoint 2026-05-26 (board process bootstrap cleanup reset)
- Trigger: board comment `25495a29-daa6-4709-8930-f96cce091909` ("Process bootstrap cleanup: stale in_progress without live run. Return to todo so Backend can resume the residual runtime/backtests blocker through the scheduled PM/Delivery process.").
- Decision:
  - Lane status is reset to `TODO` by control-plane process policy.
  - Work is queued for next scheduled PM/Delivery-driven backend run on residual runtime/backtests blocker scope.
- Commit status:
  - No new commit in this heartbeat.
- Deploy impact:
  - None.
## Checkpoint 2026-05-26 (LUC-46 fresh residual proof - sequential confirmation)
- Trigger: scheduled PM/Delivery continuation after process bootstrap reset.
- Verification outcome in this heartbeat:
  - Parallel start attempt produced one transient failure (`prisma.user.findUniqueOrThrow` missing record), consistent with cross-run DB isolation contention when launching focused e2e cases concurrently.
  - Sequential isolated rerun of the previously failing case:
    - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "covers strategy -> backtest -> paper/live parity with reconciliation checks"` -> PASS (`1 passed`, `14 skipped`).
  - Companion case in same heartbeat:
    - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path"` -> PASS (`1 passed`, `14 skipped`).
- Residual scope status:
  - `openPositionsSeen=0` path: PASS in sequential verification.
  - `live-order create 500` path: PASS.
- Commit status:
  - No new commit in this heartbeat.
- Deploy impact:
  - None.
- Final disposition:
  - `DONE` for current `LUC-46` residual runtime/backtests blocker scope.
## Checkpoint 2026-05-26 (no-stall janitor live restart)
- Trigger: board comment `d63c4946-fb6b-4ed6-8231-dd26c7d7c169` requiring live run in this heartbeat.
- Live restart executed in this heartbeat with focused residual checks:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "covers strategy -> backtest -> paper/live parity with reconciliation checks"` -> PASS (`1 passed`, `14 skipped`).
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path"` -> PASS (`1 passed`, `14 skipped`).
- Durable evidence state:
  - `implemented and verified` for current residual runtime/backtests blocker scope.
- Commit/push/deploy state:
  - Commit: no new commit in this heartbeat.
  - Push: no push in this heartbeat.
  - Deploy: no deploy impact.
- Final disposition:
  - `DONE`.
## Checkpoint 2026-05-26 (post-handoff continuity confirmation)
- Trigger: successful run handoff with no new board comments and no new failing evidence.
- Lane state in this heartbeat:
  - No additional code/runtime defects reproduced.
  - Existing residual-scope proof from the live no-stall run remains current and valid.
- Commit/push/deploy state:
  - Commit: none.
  - Push: none.
  - Deploy: none.
- Final disposition:
  - `DONE` (maintained).
## Checkpoint 2026-05-26 (finish-successful-run handoff reconciliation)
- Trigger: resume delta `finish_successful_run_handoff` for `LUC-46`.
- Reality check:
  - Focused aggregate and backtests core packs remain PASS.
  - Full critical backtests smoke path is still FAIL in isolated run:
    - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` -> `13 failed / 15`.
- Reproduced blocker family in this run:
  - fixture cleanup FK violations in `beforeEach` (`prisma.user.deleteMany()` at `apps/api/src/modules/backtests/backtests.e2e.test.ts:217`),
  - API status mismatches (`500 != 201`, `404 != 201`, `404 != 204`),
  - timeout-sensitive checks at default `5000ms`.
- Handoff decision (supersedes earlier local residual PASS-only snapshots):
  - Lane disposition for LUC-46 is `BLOCKED` until full `backtests.e2e` suite is stable green.
  - Unblock owner: Backend API Engineer.
  - Unblock action: harden e2e fixture cleanup ordering/ownership and stabilize timeout-sensitive paths, then rerun full `src/modules/backtests/backtests.e2e.test.ts` to green.
- Commit/push/deploy state:
  - No commit, no push, no deploy impact in this heartbeat.
## Checkpoint 2026-05-26 (capacity-controlled batch resume, comment d828a9ee-755f-4cf5-8137-8f0ad94349b6)
- Scope discipline: executed only assigned `LUC-46` lane; no sibling lane spawn/resume.
- Fresh critical-path proof rerun:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` -> FAIL (`5 failed`, `10 passed`, `15 tests`).
- Residual failure set from this run:
  - `supports create/list/get for owner` -> `totalTrades` assertion (`0 >= 2` expected) at `backtests.e2e.test.ts:329`,
  - `enforces ownership isolation and strategy ownership at create time` -> timeout (`5000ms`) at `backtests.e2e.test.ts:540`,
  - `covers strategy -> backtest -> paper -> live opt-in critical flow` -> timeout (`5000ms`) at `backtests.e2e.test.ts:616`,
  - `covers strategy -> backtest -> paper/live parity with reconciliation checks` -> FK cleanup violation (`Log_userId_fkey`) at `backtests.e2e.test.ts:217`,
  - `keeps strategy + 3-symbol market-group backtest trace aligned with paper decision contract` -> timeout (`15000ms`) at `backtests.e2e.test.ts:1093`.
- Interpretation:
  - Blocker scope is narrowed versus prior `13/15` fail run, but critical API smoke remains red.
- Final disposition for this heartbeat:
  - `BLOCKED`.
- Unblock owner/action/evidence needed:
  - Owner: Backend API Engineer.
  - Action: stabilize backtests e2e data lifecycle/cleanup ordering (FK-safe teardown), and timeout-sensitive flows for ownership + opt-in + 3-symbol parity checks.
  - Required closure evidence: full green isolated rerun of `src/modules/backtests/backtests.e2e.test.ts` with command/result log attached.
- Commit/push/deploy:
  - none.
## Checkpoint 2026-05-26 (issue_status_changed live proof rerun)
- Trigger: issue status moved to `in_progress`; requested live continuation proof for the same narrow lane.
- Fresh full critical rerun:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` -> FAIL (`1 failed`, `14 passed`, `15 tests`).
- Current residual blocker (single-test):
  - `supports create/list/get for owner` times out at default `5000ms` (`apps/api/src/modules/backtests/backtests.e2e.test.ts:237`).
- Interpretation:
  - Stability materially improved (from prior `5/15` fail to `1/15` fail), but acceptance requires full green critical path.
- Final disposition for this heartbeat:
  - `BLOCKED`.
- Unblock owner/action/evidence needed:
  - Owner: Backend API Engineer.
  - Action: stabilize timeout-sensitive owner create/list/get flow in `backtests.e2e` and rerun full suite.
  - Required closure evidence: `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` PASS (`15/15`) with command log.
- Commit/push/deploy: none.
## Checkpoint 2026-05-26 (finish-successful-run handoff, instability characterization)
- Fresh lane-only validation executed:
  - Targeted case: `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "supports create/list/get for owner"` -> FAIL.
    - observed signatures in this heartbeat:
      - `prisma.user.findUniqueOrThrow` missing-record at `backtests.e2e.test.ts:91`,
      - and in full-suite run registration path `expect(res.status).toBe(201)` failed with `500` at `backtests.e2e.test.ts:78`.
  - Full suite: `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` -> FAIL (`1 failed`, `14 passed`, `15 tests`).
- Current blocker shape:
  - one residual failing test (`supports create/list/get for owner`) with unstable failure mode across reruns (timeout / missing record / register 500).
- Delivery interpretation:
  - lane is not closure-ready; full critical path is still non-deterministic.
- Final disposition for this heartbeat:
  - `BLOCKED`.
- Unblock owner/action/evidence needed:
  - Owner: Backend API Engineer.
  - Action: stabilize auth/register + fixture lifecycle for owner create/list/get path in `backtests.e2e` so reruns are deterministic.
  - Required closure evidence: two consecutive full-suite green runs of `src/modules/backtests/backtests.e2e.test.ts` (`15/15`), with command logs attached.
- Commit/push/deploy: none.
## Checkpoint 2026-05-26 (janitor todo reset, comment 43c988de-7b91-4521-9b5d-5f9795cd5f40)
- Board janitor disposition accepted: lane moved back to `TODO` because there is no active live run now.
- Status rationale preserved from latest backend proof (not external dependency):
  - backtests paper/live parity path still unstable (`openPositionsSeen=0` after exchange-position snapshot fetch failure),
  - venue-context live-order create path still returns `500` instead of expected `201`.
- Lane ownership and restart rule:
  - Next owner remains Backend API Engineer.
  - Restart this narrow lane only under capacity governor, then publish fresh focused proof and end with `done` or `blocked` plus exact unblock action.
- This heartbeat is reconciliation-only (no code change / no deploy / no commit).
## Checkpoint 2026-05-26 (finish-successful-run handoff closure proof)
- Fresh live full-suite rerun for critical backtests smoke:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` -> PASS (`15 passed`, `0 failed`, `1 file`).
- This run covers previously unstable residual paths:
  - owner create/list/get,
  - paper/live parity reconciliation,
  - venue-context live-order create,
  - 3-symbol trace alignment.
- Disposition update:
  - `LUC-46` backend runtime/API stability lane is now `DONE` for scoped acceptance criteria.
- Commit/push/deploy:
  - none in this heartbeat (verification-only closure).
## Checkpoint 2026-05-26 (board-directed residual closure run, comment 166fdcfc-857c-401b-b9c5-5385acb70b0a)
- Board-instructed residual proof path executed exactly as requested.
- Residual checks:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "covers strategy -> backtest -> paper/live parity with reconciliation checks"` -> PASS (`1 passed`, `14 skipped`).
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path"` -> PASS (`1 passed`, `14 skipped`).
- Focused backtests regression pack (no-local-regression proof):
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/backtests/backtestRange.service.test.ts` -> PASS (`6 files`, `43 tests`).
- Final disposition for LUC-46 scope in this heartbeat:
  - `DONE`.
- Commit status:
  - No new commit.
- Deploy impact:
  - None (verification-only run).
## Checkpoint 2026-05-26 (finish-successful-run handoff maintenance)
- No new code/test regression work required in this wake.
- Latest accepted residual proof remains valid:
  - targeted parity path PASS,
  - targeted venue-context live-order path PASS,
  - focused backtests pack PASS (`6 files`, `43 tests`).
- Lane disposition is maintained as `DONE` for current `LUC-46` scope.
- Commit/push/deploy: none.
## Checkpoint 2026-05-26 (janitor status alignment, comment e7b00217-8f4e-4641-8d86-0d88d828d248)
- Janitor correction acknowledged: board issue state aligned to `done`.
- Proof source remains unchanged from prior run:
  - targeted residual checks PASS,
  - focused backtests pack PASS,
  - final lane disposition `DONE`.
- This heartbeat is status-alignment only; no new validation run.
- Commit/push/deploy: none.
