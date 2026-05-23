# V1 Runtime Exchange Adapter Boundary - 2026-05-13

## Header
- ID: V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13
- Title: Align runtime market-data warmup with Exchange adapter boundary
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1-NON-GATEIO-RUNTIME-AND-APP-PROOF-00169D7F-2026-05-13
- Priority: P0
- Module Confidence Rows: SOAR-EXCHANGE-ADAPTER-001, SOAR-BOT-RUNTIME-001
- Requirement Rows: REQ-FUNC-003, REQ-FUNC-016
- Risk Rows: RISK-003, RISK-016
- Iteration: 2026-05-13 continuation
- Operation Mode: BUILDER
- Mission ID: V1-EXCHANGE-ADAPTER-RUNTIME-PROOF
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected.
- [x] Operation mode is BUILDER for this continuation.
- [x] Architecture and module docs were reviewed before implementation.
- [x] Affected module confidence, requirement, and risk rows were identified.
- [x] The task improves release confidence instead of only changing code shape.

## Mission Block
- Mission objective: remove the runtime market-data Binance shortcut so Binance and Gate.io runtime candle warmup use the approved Exchange public market-data boundary.
- Release objective advanced: V1 runtime/exchange adapter confidence.
- Included slices: runtime candle store scoping, indicator recovery warmup, strategy evaluation exchange context, lifecycle fallback price, symbol-stats read snapshot, focused adapter tests.
- Explicit exclusions: live order mutation, Gate.io activation, production write/readback.
- Checkpoint cadence: implement, focused tests, state sync.
- Stop conditions: typecheck/test failure, architecture mismatch, or unsafe live mutation requirement.
- Handoff expectation: leave a verified local adapter-boundary slice and keep production proof classification partial.

## Context
The architecture assigns exchange transport details to `modules/exchange`. During runtime review, `runtimeSignalMarketDataGateway` still fetched candle warmup directly through Binance public REST and keyed candle/derivative stores only by market/symbol/interval. That could make Binance appear healthy while hiding whether other exchanges truly flow through the adapter boundary.

## Goal
Route runtime candle warmup and indicator recovery through `fetchExchangePublicRecentCandles`, include exchange in runtime series and derivative keys, and keep Binance-only derivative fallbacks fail-closed for non-Binance exchanges.

## Scope
- `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
- `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- `apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- Focused tests for runtime market data, runtime loop, decision engine, Exchange public market data, market stream polling, runtime fallback, and symbol stats.

## Implementation Plan
1. Add exchange context to runtime candle and derivatives series keys.
2. Replace runtime candle warmup Binance REST calls with Exchange public market-data service calls.
3. Thread exchange context through strategy evaluation, lifecycle price fallback, runtime loop read APIs, and symbol-stats snapshots.
4. Keep Binance-only derivative REST fallback guarded to Binance and empty for other exchanges.
5. Add regression proving Gate.io runtime candle warmup uses the exchange adapter and does not call Binance REST.
6. Run focused validation, typecheck, and guardrails.

## Acceptance Criteria
- Runtime candle warmup does not directly call Binance REST.
- Runtime candle/derivative stores cannot mix Binance and Gate.io data for the same symbol/interval.
- Strategy evaluation uses the bot/exchange context.
- Gate.io warmup can be proven through the exchange public market-data adapter.
- Non-Binance derivative fallbacks fail closed instead of borrowing Binance data.

## Definition of Done
- [x] Existing Exchange public market-data boundary reused.
- [x] No new exchange framework or parallel adapter introduced.
- [x] Focused runtime/exchange tests passed.
- [x] Typecheck passed.
- [x] Guardrails passed.
- [x] State docs updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts --run` => PASS, `55/55`.
  - `pnpm --filter api run test -- src/modules/exchange/exchangePublicMarketData.service.test.ts src/modules/market-stream/exchangePollingStream.service.test.ts src/modules/bots/runtimeMarketDataFallback.service.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts --run` => PASS, `12/12`.
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm --filter api run test -- --run --reporter=dot` => PASS.
  - `pnpm run build` => PASS.
- Manual checks: inspected architecture source of truth, runtime merge contract, API Engine/Exchange module docs, and affected code paths.
- High-risk checks: no live activation, no exchange mutation, no production writes.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Risk register updated: yes.
- Reality status: verified locally; production runtime proof remains partial.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/modules/api-engine.md`, `docs/modules/api-exchange.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, Engine had direct Binance public REST warmup.
- Decision required from user: no, fix reused approved Exchange boundary.
- Follow-up architecture doc updates: none required; existing docs already describe Exchange ownership.

## Deployment / Ops Evidence
- Deploy impact: low/medium backend runtime behavior.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: revert this commit to restore previous Binance-only runtime warmup behavior if adapter regressions appear.
- Observability or alerting impact: none.
- Staged rollout or feature flag: existing warmup flags still apply.

## Autonomous Loop Evidence
### 1. Analyze Current State
- Issue: Engine runtime warmup bypassed Exchange boundary through Binance REST.
- Gap: exchange was missing from runtime candle/derivative storage keys.
- Architecture constraint: Exchange module owns exchange integration primitives.

### 2. Select One Priority Mission Objective
- Selected task: adapter-boundary runtime market-data correction.
- Rationale: it directly answers whether Binance working through the correct adapter gives Gate.io a fair chance.

### 3. Plan Implementation
- Thread exchange through runtime series, strategy evaluation, and read-model consumers.
- Replace warmup fetch implementation with `fetchExchangePublicRecentCandles`.

### 4. Execute Implementation
- Implemented exchange-scoped keys, adapter-based warmup, and Binance-only derivative guards.
- Added a Gate.io regression that fails if Binance REST is called during Gate.io warmup.

### 5. Verify and Test
- Focused runtime/exchange tests, typecheck, and guardrails passed.

### 6. Self-Review
- Reused existing Exchange public market-data service instead of adding a new adapter.
- No workaround or duplicated transport path introduced.
- Production proof remains partial until deployed/proven with real runtime resources.

### 7. Update Documentation and Knowledge
- Docs updated: this task, task board, project state, module confidence, requirement matrix, risk register, next steps/system health.
- Learning journal updated: not applicable.

## Result Report
- Task summary: runtime market-data warmup now honors Exchange adapter boundaries and exchange-scoped series separation.
- Files changed: API runtime/engine/bots code, focused tests, project state docs.
- How tested: see Validation Evidence.
- What is incomplete: production-safe multi-bot/live runtime proof remains a separate lane.
- Next steps: run production-safe runtime/UI proof after the production bot resource shape exists.
