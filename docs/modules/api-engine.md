# API Deep-Dive: Engine Module

## Metadata
- Module name: `engine`
- Layer: `api`
- Source path: `apps/api/src/modules/engine`
- Owner: backend/trading-runtime
- Last updated: 2026-05-03
- Related planning task: `RUNTIME-AUDIT-09`

## Canonical Architecture Linkage
Canonical behavior and invariants live in `docs/architecture/`, especially:
- `05_strategy-signal-and-decision-flow.md`
- `06_execution-lifecycle.md`
- `07_modes-parity-and-data.md`
- `11_assistant-runtime.md`

## 1. Purpose and Scope
- Implements runtime trading decision and execution core for `PAPER` and `LIVE`.
- Owns signal loop orchestration, pre-trade risk checks, execution routing, position automation, and assistant orchestration contracts.
- Provides shared evaluator/simulator primitives reused by runtime and backtests parity paths.

Out of scope:
- HTTP route ownership (engine is consumed by dashboard modules, not mounted directly).
- Exchange connector transport implementation details (exchange module).

## 2. Boundaries and Dependencies
- No direct router mount; invoked from bots/backtests/orders/positions workflows and worker/bootstrap flows.
- Depends on:
  - `market-stream` events (`subscribeMarketStreamEvents`).
  - `market-data`/ticker state for indicator and price context.
  - `orders` service for order lifecycle operations.
  - `prisma` through repository/service boundaries.
  - metrics/observability store.

## 3. Data and Contract Surface
- Key internal contracts:
  - `RuntimeSignalInput`, execution statuses (`executionOrchestrator.service.ts`).
  - `RuntimeSignalLoopDeps` and session telemetry contracts (`runtimeSignalLoop.service.ts`).
  - assistant orchestration contracts (`assistantOrchestrator.service.ts`).
- Decision contracts:
  - weighted multi-strategy merge, no-trade on tie/weak consensus.
  - no-flip and dedupe rules in execution path.
  - pre-trade one-position-per-symbol checks are user-global only for no-bot
    checks; runtime decisions with `botId` are scoped to direct positions for
    that bot plus deterministically owned LIVE exchange-synced imports for the
    same bot/wallet.
- Runtime mode contracts:
  - explicit `PAPER`/`LIVE` path branching with parity checks.

## 4. Runtime Flows
- Runtime signal loop:
  1. Subscribe to market-stream ticker/candle events.
  2. Build candle + derivative context per symbol.
  3. Evaluate strategy signals and pre-trade constraints.
  4. Route allowed signals to execution orchestrator.
  5. Persist telemetry/session/runtime stats.
- Runtime topology source-of-truth:
  - active canonical `BotMarketGroup` and enabled
    `MarketGroupStrategyLink` rows are authoritative when present,
  - direct legacy `Bot.strategyId` / `Bot.symbolGroupId` fallback is allowed
    only when canonical topology is absent,
  - an active canonical market group with no enabled strategy links produces a
    non-actionable runtime context instead of falling back to stale legacy
    strategy projection.
- Execution orchestration:
  - resolves open/close/ignore action.
  - writes order/position/trade side effects through gateways.
  - emits runtime execution events and updates dedupe state.
- Runtime position automation:
  - resolves owned position configured symbol scope through the shared
    catalog-aware resolver before strategy loading, DCA checks, DCA execution,
    lifecycle price evaluation, or protection close orchestration,
  - stale directly owned positions outside active configured bot market scope
    fail closed and emit LIVE `PRETRADE_BLOCKED` telemetry with
    `position_symbol_outside_configured_scope`,
  - imported ownership hydration must load symbol-group metadata required by
    the same scope resolver.
- Assistant orchestration:
  - planner step -> subagent fan-out (timeouts/errors tracked) -> deterministic merge -> policy gate.

## 5. API and UI Integration
- No direct API endpoints.
- Indirect consumers:
  - `/dashboard/bots/*` runtime/session/signal surfaces.
  - backtest replay/parity surfaces.
  - runtime telemetry and dashboard home widgets.

## 6. Security and Risk Guardrails
- Pre-trade gate enforces risk ack/eligibility before LIVE side effects.
- Dedupe gate reduces duplicate command execution risk.
- Assistant policy gate can degrade forbidden outputs to `NO_TRADE`.
- Circuit-breaker in assistant orchestration degrades to `strategy_only` mode when unstable.

## 7. Observability and Operations
- Emits runtime metrics via `metricsStore` (latency, retries, execution outcomes).
- Session watchdog/stall detection + auto-restart controls via environment toggles.
- Runtime telemetry service tracks sessions/events/symbol stats.

## 8. Test Coverage and Evidence
- Representative tests:
  - `runtimeSignalLoop.service.test.ts`
  - `executionOrchestrator.service.test.ts`
  - `runtime-flow.e2e.test.ts`
  - `assistantOrchestrator.service.test.ts`
  - `paperLiveDecisionEquivalence.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtime-flow.e2e.test.ts src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts
```

## 9. Open Issues and Follow-Ups
- Continue migration from message-string errors to typed domain errors.
- Complete normalization helper unification where legacy uppercase patterns remain.
