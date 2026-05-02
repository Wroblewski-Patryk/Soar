# Task

## Header
- ID: DASHSIGNALS-02
- Title: Recover indicator candle history before emitting unavailable signal values
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHSIGNALS-01
- Priority: P1
- Iteration: 2026-05-02 production dashboard signal display recovery
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`DASHSIGNALS-01` stopped rendering raw `n/a` math in dashboard signal cards,
but operator feedback clarified the deeper expectation: backend read paths
should try to obtain enough indicator data before returning unavailable values.
The runtime read model already had a fallback kline path, but it only ran when
no runtime candles existed. A short in-memory candle series could therefore
still produce `RSI(14)=n/a`.

## Goal
Before runtime/dashboard signal presentation emits unavailable indicator
values, attempt to recover enough candle history from the approved market-data
fallback path.

## Scope
- Dashboard/runtime symbol-stats market snapshot loading.
- Candle merge/deduplication for read-model indicator recovery.
- Focused backend regression tests.
- Canonical context and planning docs.

## Implementation Plan
1. Treat a short runtime candle series as insufficient for indicator
   presentation, not as complete market context.
2. Fetch fallback klines when runtime snapshot candles are below the read-side
   warmup threshold.
3. Merge fallback candles with runtime candles by `openTime`, keeping runtime
   candles authoritative on overlap.
4. Feed the recovered series into the existing shared indicator analysis.

## Acceptance Criteria
- Short runtime candle history is topped up before RSI analysis.
- `RSI(14)` can produce a concrete value after fallback candle recovery.
- Runtime candles win over overlapping fallback candles.
- `n/a` remains possible only when both runtime and fallback data cannot
  produce a valid value.
- No order execution, position automation, or trading mutation behavior changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this scoped
  runtime read-model recovery fix.
- [x] Focused backend recovery tests pass.
- [x] API typecheck, guardrails, and build pass before commit.
- [x] Canonical queue and context docs are synchronized.

## Forbidden
- changing signal execution or order behavior
- substituting fake indicator values
- hiding missing data without attempting recovery
- introducing a second indicator engine

## Validation Evidence
- Tests: PASS
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/engine/strategySignalAnalysis.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm --filter api run build`
- Manual checks: pending until production deploy/readback
- High-risk checks: no trading mutation performed

## Architecture Evidence
- Architecture source reviewed: runtime signal/read-model contracts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert scoped commit if dashboard signal read latency or
  condition values regress
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `loadMarketSnapshot` used fallback klines only when runtime had zero
  candles, so short runtime histories could still emit unavailable indicator
  values.

### 2. Select One Priority Task
- Selected task: DASHSIGNALS-02.
- Priority rationale: operator clarified that `n/a` should be avoided by
  recovery before presentation whenever possible.

### 3. Plan Implementation
- Add read-side candle history recovery before strategy indicator analysis.
- Keep runtime data authoritative and fallback data supplemental.

### 4. Execute Implementation
- Added candle merge/deduplication helper and read-side fallback kline top-up
  when runtime series length is below the warmup threshold.

### 5. Verify and Test
- Validation performed: focused backend regression tests, API typecheck,
  guardrails, and API build.
- Result: PASS

### 6. Self-Review
- Simpler option considered: frontend-only handling. Rejected because the data
  path should try recovery before returning unavailable values.
- Technical debt introduced: no
- Scalability assessment: reuses existing fallback kline service and indicator
  kernel.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `docs/planning/mvp-next-commits.md`
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable

## Result Report
- Task summary: short runtime candle histories are now topped up from fallback
  klines before dashboard/runtime signal analysis emits unavailable indicator
  values.
- Files changed: runtime symbol-stats read service, focused backend test, and
  canonical context/planning docs.
- How tested: focused backend tests, API typecheck, repository guardrails, and
  API build all PASS.
- What is incomplete: production post-deploy readback remains to be collected.
- Next steps: push the fix, wait for production build-info, and verify the
  dashboard read path after deploy.
- Decisions made: preserve `n/a` as a final fail-closed state only after
  recovery cannot produce a valid indicator value.
