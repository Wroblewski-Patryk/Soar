# Task

## Header
- ID: LUC-37-A
- Title: [Soar][Delivery] Close backend runtime & trading boundary defects for release readiness
- Task Type: fix
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Backend Builder / Trading Runtime Engineer
- Depends on: LUC-37 planning packet
- Priority: P1
- Module Confidence Rows: `SOAR-FEATURE-BOT-RUNTIME`, `SOAR-FEATURE-MANUAL-ORDER`, `SOAR-FEATURE-POSITIONS`
- Requirement Rows: API runtime stability requirement rows in `docs/modules/system-modules.md`
- Risk Rows: `RISK-035` and runtime-money-flow fail-open risk
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: PLANNED

## Context
The `LUC-18` API smoke baseline still blocks on backtests and runtime aggregate stability. `LUC-37` requires this lane to own money-path/service-level defects and any runtime-contract drift in trading-relevant APIs before release gates can progress.

## Goal
Own all backend/API and trading runtime corrective work and evidence for:
- backtests reconciliation regressions,
- bot runtime aggregate resilience,
- API service-level behavior required by protected production readback tasks.

## Scope
- API runtime services for bots/positions/orders/backtests/runtime aggregation.
- Exchange adapter and connector call boundaries used by runtime trading.
- Data persistence paths touched by these service fixes.

## Success Signal
- API `go-live` smoke and focused backtests/runtime aggregate suites pass on the active issue branch.
- Verified evidence that service behavior is fail-closed on degraded exchange/event states.

## Lane Plan
1. Reproduce and isolate current `LUC-18` and runtime regressions from local evidence.
2. Repair backend/API runtime behavior without changing UI contracts.
3. Validate with focused API suites before any handoff to QA/ops.
4. Produce a lane report with exact test/smoke evidence and residual risk.

## Dependencies
- Must receive fresh environment reachability and package baseline from `LUC-37-B` where deployment candidate is available.
- Should coordinate with `LUC-37-D` on security-related fast-fail behavior for auth/session exchange reads.

## Required Output
- Implementation diff and/or verified-notes for:
  - `src/modules/backtests`
  - `src/modules/bots`
  - `src/modules/orders`
  - `src/modules/positions`
  - exchange adapter boundary handling used by runtime/positions/order services.
- Lane report artifact linked back to `LUC-37`.

## Validation
- Focused API test proof: backtests + runtime aggregate suites.
- `test:go-live:api` (or equivalent focused subset) evidence at least for previously failing paths.
- No-live-mutating behavior introduced by test-only safety fixes.

## Acceptance Criteria
- [ ] Failing `LUC-18` API path(s) are either fixed or explicitly split into follow-up with owning requirements.
- [ ] Runtime aggregate endpoint behavior degrades without process-wide failure in partial-service error states.
- [ ] Exchange/trading data writes are guarded by explicit ownership checks and not silent-fail.
- [ ] Lane report posted and module impact rows updated or queued.

