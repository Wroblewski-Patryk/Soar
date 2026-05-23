# EXCHANGE2-03 Runtime Market Event Exchange Boundary Task (2026-05-08)

## Header
- ID: `EXCHANGE2-03`
- Title: Generalize runtime market event exchange boundary for Gate.io
- Task Type: architecture-safe runtime foundation
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: `EXCHANGE2-02`
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
Gate.io can now return a public market catalog through the exchange adapter
boundary, but runtime market events still used a `BINANCE`-only type. That
would force later Gate.io paper runtime work either to fake Binance events or
to bypass the runtime router.

## Goal
Allow canonical runtime market events to carry any registered `Exchange`,
including `GATEIO`, while preserving Binance stream normalization and keeping
Gate.io paper/live capabilities disabled until a real Gate.io market-data
source is implemented.

## Scope
- runtime market-stream event type
- runtime ticker store regression coverage
- runtime signal-loop routing regression coverage
- architecture and planning state docs

## Implementation Plan
1. Widen the market event exchange type to the Prisma `Exchange` enum.
2. Keep Binance stream normalization hardcoded to `BINANCE`.
3. Add regression coverage that Gate.io ticker snapshots remain isolated from
   Binance snapshots for the same symbol.
4. Add regression coverage that a Gate.io final-candle event routes only to
   Gate.io runtime topology.
5. Do not enable Gate.io paper/live capabilities in this task.

## Acceptance Criteria
- Runtime event typing accepts `GATEIO` without pretending it is Binance.
- Runtime ticker store remains isolated by `(exchange, marketType, symbol)`.
- Runtime signal-loop routing can consume a Gate.io event when a future
  Gate.io adapter publishes one.
- Gate.io `PAPER_PRICING_FEED`, `LIVE_EXECUTION`, and authenticated reads stay
  disabled.

## Definition of Done
- [x] Architecture boundary reused.
- [x] No new exchange client or stream source introduced.
- [x] No Gate.io runtime capability enabled.
- [x] Regression assertions added.
- [x] Validation evidence recorded.

## Forbidden
- enabling Gate.io paper runtime in this task.
- adding a fake Gate.io stream.
- mapping Gate.io runtime events to Binance.
- adding live order submit, cancel, or authenticated read behavior.

## Validation Evidence
- Tests:
  - `apps/api`: `.\\node_modules\\.bin\\tsc.CMD --noEmit` => PASS.
  - focused API Vitest command did not start because local `node_modules/.pnpm`
    is missing Vitest's `vite` package (`ERR_MODULE_NOT_FOUND`); no test
    assertions executed in this local environment.
  - `node scripts/repoGuardrails.mjs` => PASS.
  - `node scripts/checkDocsParity.mjs` => PASS.
  - `git diff --check` => PASS.
- Manual checks:
  - Binance websocket normalizer still emits `BINANCE`.
  - Gate.io can only appear as an internal event from a future adapter source.
- High-risk checks:
  - Gate.io `PAPER_PRICING_FEED` and `LIVE_EXECUTION` remain disabled.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no; this closes a type-level Binance assumption before
  the Gate.io market-data adapter is added.
- Decision required from user: no for this foundation slice.
- Follow-up architecture doc updates: Gate.io market-data source ownership must
  be documented before enabling paper runtime.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none expected
- Smoke steps updated: no
- Rollback note: revert this commit to restore Binance-only runtime event type.
- Observability or alerting impact: none
- Staged rollout or feature flag: existing capability matrix keeps Gate.io
  runtime entry disabled.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Runtime routing already keys by `exchange|marketType`, but the stream event
  type only allowed `BINANCE`.

### 2. Select One Priority Task
- Selected task: runtime market-event exchange boundary.
- Priority rationale: required before any honest Gate.io paper market-data
  source can publish events into the existing runtime.

### 3. Plan Implementation
- Files or surfaces to modify: market-stream event type, runtime ticker store
  test, runtime signal-loop test, source-of-truth docs.
- Logic: widen type only; keep capabilities disabled.
- Edge cases: same symbol on Binance and Gate.io must not share ticker state.

### 4. Execute Implementation
- Implementation notes: no exchange client, websocket, order path, or
  authenticated read path was added.

### 5. Verify and Test
- Validation performed: API typecheck, repository guardrails, docs parity, diff
  whitespace check, and focused Vitest startup attempt.
- Result: code/static gates passed; focused Vitest was blocked by the local
  dependency/tooling state described above.

### 6. Self-Review
- Simpler option considered: keep `BINANCE` event typing and cast Gate.io later.
- Technical debt introduced: no.
- Scalability assessment: future exchange adapters can publish canonical
  runtime events without changing feature-module routing.
- Refinements made: locked ticker isolation and final-candle routing behavior.

### 7. Update Documentation and Knowledge
- Docs updated: architecture matrix and planning/state docs.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report
- Task summary: canonical runtime market events now accept registered
  exchanges, with regression coverage for Gate.io ticker isolation and
  final-candle routing.
- Files changed: runtime event type, runtime ticker/routing tests, architecture
  and planning state docs.
- How tested: API typecheck, repository guardrails, docs parity, diff
  whitespace check, and focused Vitest startup attempt with environment blocker
  recorded.
- What is incomplete: Gate.io market-data source, paper runtime capability,
  authenticated reads, and live execution are not enabled.
- Next steps: add a Gate.io public market-data adapter source for ticker and
  candle events, then enable `PAPER_PRICING_FEED` only after runtime evidence.
