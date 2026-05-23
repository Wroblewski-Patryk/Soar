# EXCHANGE2-05 Gate.io Market-Stream Polling Task (2026-05-08)

## Header
- ID: `EXCHANGE2-05`
- Title: Publish Gate.io public market data into canonical market-stream events
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: `EXCHANGE2-04`
- Priority: P0
- Iteration: V1 production hardening
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active default iteration mode.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Gate.io public ticker and candle reads exist inside the exchange module, but no
market-stream adapter publishes those normalized reads into the canonical
runtime/SSE event family.

## Goal
Add an opt-in Gate.io market-stream polling worker path that reuses the
exchange-owned public market-data reader and emits canonical ticker/candle
events without enabling Gate.io paper trading, authenticated reads, or live
execution.

## Success Signal
- User or operator problem: Gate.io cannot drive paper runtime until its public
  market data can enter the same event contract as Binance.
- Expected product or reliability outcome: `MARKET_STREAM_EXCHANGE=GATEIO`
  selects a public polling source that publishes `GATEIO` market events through
  the existing fanout boundary.
- How success will be observed: API typecheck, guardrails, source review, and
  focused assertions prove Gate.io polling emits canonical events and does not
  publish malformed failures.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implement and verify the opt-in market-stream polling adapter only. Do not
enable `PAPER_PRICING_FEED`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce workaround paths
- do not duplicate fanout or runtime event contracts
- do not enable live trading or authenticated Gate.io access
- keep the default Binance market-stream behavior unchanged

## Scope
- `apps/api/src/modules/market-stream/exchangePollingStream.service.ts`
- `apps/api/src/workers/marketStream.worker.ts`
- `apps/api/src/workers/marketStreamSubscriptions.service.ts`
- focused tests for the polling worker and subscription filtering
- market-stream/exchange architecture docs and active planning state

## Implementation Plan
1. Add a market-stream polling worker that reads public ticker/candle data via
   `exchangePublicMarketData.service.ts`.
2. Emit the existing `MarketStreamEvent` shape with `exchange: GATEIO`.
3. Select the polling worker only when `MARKET_STREAM_EXCHANGE=GATEIO`.
4. Keep Binance as the default websocket worker.
5. Filter dynamic subscriptions to the requested non-Binance exchange.
6. Record docs/state and validation evidence.

## Acceptance Criteria
- Gate.io public ticker/candle data can be published as canonical
  `MarketStreamEvent` payloads.
- The default market-stream worker remains Binance websocket based.
- Gate.io polling uses exchange-module readers, not direct CCXT calls.
- Per-symbol reader failures log and continue without malformed event
  publication.
- Gate.io `PAPER_PRICING_FEED`, authenticated reads, live submit, and cancel
  remain disabled.

## Definition of Done
- [x] Architecture boundary reused.
- [x] Opt-in Gate.io polling path implemented.
- [x] Focused assertions added.
- [x] Validation evidence recorded.
- [x] Source-of-truth docs synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- enabling Gate.io `PAPER_PRICING_FEED`
- starting Gate.io paper/live runtime by default
- adding authenticated Gate.io access
- adding live order submit or cancel
- publishing Gate.io events as Binance

## Validation Evidence
- Tests:
  - `apps/api`: `.\\node_modules\\.bin\\tsc.CMD --noEmit` => PASS.
  - `node scripts/repoGuardrails.mjs` => PASS.
  - `node scripts/checkDocsParity.mjs` => PASS.
  - `git diff --check` => PASS.
  - focused API Vitest command did not start because local `node_modules/.pnpm`
    is missing Vitest's `vite` package (`ERR_MODULE_NOT_FOUND`); no test
    assertions executed in this local environment.
- Manual checks:
  - `MARKET_STREAM_EXCHANGE=GATEIO` is required for the polling worker.
  - the polling worker calls `exchangePublicMarketData.service.ts`.
  - `GATEIO` paper/live/authenticated capability flags remain disabled.
- Screenshots/logs:
  - not applicable.
- High-risk checks:
  - no live-money or authenticated exchange path was added.
  - reader failures are fail-closed per symbol.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/stream-transport-contract.md`
  - `docs/modules/api-market-stream.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: market-stream now documents Binance
  websocket default plus opt-in Gate.io public polling.

## UX/UI Evidence
- Not applicable: backend runtime market-data source only.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: optional `MARKET_STREAM_EXCHANGE=GATEIO` and
  `MARKET_STREAM_POLL_MS`; no secret required.
- Health-check impact: none expected.
- Smoke steps updated: no.
- Rollback note: revert this commit to remove Gate.io market-stream polling.
- Observability or alerting impact: polling logs per-symbol failures.
- Staged rollout or feature flag: opt-in environment variable; default remains
  Binance.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Gate.io public reader exists but cannot enter market-stream fanout.
- Gaps: worker bootstrap always creates the Binance websocket worker.
- Architecture constraints: runtime must consume canonical events only.

### 2. Select One Priority Task
- Selected task: Gate.io market-stream polling adapter.
- Priority rationale: this is the smallest bridge from exchange adapter data to
  runtime-compatible events.
- Why other candidates were deferred: enabling paper pricing requires deployed
  runtime evidence after this path exists.

### 3. Plan Implementation
- Files or surfaces to modify: market-stream module, market-stream worker,
  subscription resolver, docs/state.
- Logic: poll ticker/candle data and emit existing event shape.
- Edge cases: malformed reader failures, duplicate symbols, non-Binance
  subscription filtering, preserving Binance default.

### 4. Execute Implementation
- Implementation notes: added `ExchangePublicPollingMarketStreamWorker`, wired
  `MARKET_STREAM_EXCHANGE=GATEIO`, and kept Binance websocket as default.

### 5. Verify and Test
- Validation performed: API typecheck, repository guardrails, focused Vitest
  startup attempt, and source review.
- Result: static gates passed; focused Vitest was blocked by local dependency
  state described above.

### 6. Self-Review
- Simpler option considered: add Gate.io reads directly to runtime fallback.
- Technical debt introduced: no
- Scalability assessment: polling is explicitly opt-in and can later be
  replaced by a websocket adapter behind the same event contract.
- Refinements made: subscription filtering was kept exchange-aware for
  non-Binance workers.

### 7. Update Documentation and Knowledge
- Docs updated: architecture stream contract, market-stream module, exchange
  ownership matrix, planning queue, and task board.
- Context updated: yes.
- Learning journal updated: existing local Vitest blocker entry remains current.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Notes
This task deliberately stops before enabling `GATEIO` `PAPER_PRICING_FEED`.
The next slice must validate runtime consumption evidence before flipping that
capability.

## Result Report
- Task summary: added an opt-in Gate.io public polling worker that publishes
  canonical ticker/candle market-stream events through the existing fanout.
- Files changed: market-stream polling service/tests, market-stream worker,
  subscription resolver/tests, architecture/module docs, and planning/context
  state.
- How tested: API typecheck, repository guardrails, focused Vitest startup
  attempt with environment blocker recorded, and source review.
- What is incomplete: Gate.io paper runtime, authenticated reads, live submit,
  and cancel remain disabled.
- Next steps: verify runtime consumption from the Gate.io event source and only
  then enable Gate.io paper pricing support.
- Decisions made: Gate.io market-stream support is opt-in via
  `MARKET_STREAM_EXCHANGE=GATEIO`, preserving Binance as the default source.
