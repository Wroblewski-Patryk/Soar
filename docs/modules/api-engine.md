# API Deep-Dive: Engine Module

## Metadata
- Module name: `engine`
- Layer: `api`
- Source path: `apps/api/src/modules/engine`
- Owner: backend/trading-runtime
- Last updated: 2026-05-03
- Related planning task: `RUNTIME-AUDIT-15`

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
  - pre-trade bot open-position limits use the same LIVE ownership proof:
    direct `Position.botId` rows plus owned `EXCHANGE_SYNC` / `BOT_MANAGED`
    imports for the same bot/wallet/API key are counted for
    `maxOpenPositionsPerBot`.
  - final-candle external-position guard keys managed `EXCHANGE_SYNC` rows by
    deterministic owner bot, not only by user+symbol; an imported position for
    one bot must not block another bot's signal on the same symbol.
  - runtime execution open-position lookup checks direct scoped positions
    first, then for selected `LIVE` bots may resolve owned imported
    `EXCHANGE_SYNC` / `BOT_MANAGED` rows through wallet-first API-key
    ownership proof; legacy `walletId=null` imported rows can be selected only
    after the proof confirms the same bot and wallet own the symbol.
  - runtime close realized-PnL fee attribution aggregates entry-leg fees by
    `userId + positionId + entry side`, not by projected `botId` / `walletId`,
    because imported or recovered LIVE lifecycle rows may carry different
    identity projections while still belonging to the same owned position.
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
  - `EXIT`/close decisions must see selected-bot owned imported LIVE positions
    consistently with dashboard/runtime reads.
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
  - current approved scope is deterministic config/dry-run foundation:
    planner step -> subagent fan-out (timeouts/errors tracked) ->
    deterministic merge -> policy gate.
  - BACKTEST/PAPER/LIVE hot-path assistant orchestration remains deferred
    until a separate implementation, persisted trace contract, fail-closed
    integration, and AI red-team evidence are approved.

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

## 10. Architecture-Awareness Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2174](/LUC/issues/LUC-2174).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/api/src/modules/engine/orderTypes.types.ts` | `docs/modules/api-engine.md` | Engine order-evaluation contract types used by order execution and paper lifecycle parity. | Architecture-awareness `documents` relation from this doc plus focused engine order/lifecycle tests when behavior changes. |
| `apps/api/src/modules/engine/positionManagement.types.ts` | `docs/modules/api-engine.md` | Runtime position-management contract types for execution, protection, and lifecycle semantics. | Direct doc relation plus focused engine/order/position lifecycle tests when behavior changes. |
| `apps/api/src/modules/engine/ruleEvaluator.types.ts` | `docs/modules/api-engine.md` | Strategy-rule evaluator contract types used by runtime signal decision flows. | Direct doc relation plus signal/rule evaluator tests when behavior changes. |
| `apps/api/src/modules/engine/runtimePositionAutomation.types.ts` | `docs/modules/api-engine.md` | Runtime position automation DTO/type boundary for protection and DCA orchestration. | Direct doc relation plus runtime position automation tests when behavior changes. |
| `RuntimePositionStateStore` | `docs/modules/api-engine.md` | In-memory/runtime state store supporting position automation continuity. | Direct doc relation plus state-store/runtime flow tests when behavior changes. |
| `RuntimeSignalDecisionEngine` | `docs/modules/api-engine.md` | Runtime signal decision engine for signal merge, no-trade, and execution decision contracts. | Direct doc relation plus runtime signal decision tests when behavior changes. |
| `apps/api/src/modules/engine/runtimeSignalEvaluationTypes.ts` | `docs/modules/api-engine.md` | Evaluation contract types for runtime signal decisions. | Direct doc relation plus runtime signal evaluation proof when behavior changes. |
| `RuntimeSignalMarketDataGateway` | `docs/modules/api-engine.md` | Market-data gateway boundary used by runtime signal evaluation. | Direct doc relation plus market data/runtime signal gateway tests when behavior changes. |
| `apps/api/src/modules/engine/runtimeSignalSeriesTypes.ts` | `docs/modules/api-engine.md` | Runtime signal series type boundary for indicator and series evaluation. | Direct doc relation plus runtime signal series/evaluator proof when behavior changes. |
| `apps/api/src/modules/engine/simulator.types.ts` | `docs/modules/api-engine.md` | Shared simulator contract types used by runtime/backtest parity paths. | Direct doc relation plus simulator/backtest parity tests when behavior changes. |
| `apps/api/src/modules/engine/fixtures/lifecycleCloseParity.golden.ts` | `docs/modules/api-engine.md` | Golden lifecycle close parity fixture for local PAPER/LIVE-equivalent close behavior. | Direct doc relation plus lifecycle close parity tests when fixtures change. |
| `apps/api/src/modules/engine/positionPnlSemantics.ts` | `docs/modules/api-engine.md` | Runtime position PnL percent/price/margin semantics helper shared by automation and read models. | Direct doc relation plus position-management/runtime read tests when PnL semantics change. |
| `apps/api/src/modules/engine/positionSizing.ts` | `docs/modules/api-engine.md` | Runtime/backtest position sizing helper for fixed and wallet-risk quantity calculations. | Direct doc relation plus backtest/runtime signal loop tests when sizing behavior changes. |
| `apps/api/src/modules/engine/runtimeBotExecutionContext.ts` | `docs/modules/api-engine.md` | Runtime execution context resolver for bot/wallet/strategy topology. | Direct doc relation plus runtime signal/execution tests when context resolution changes. |
| `apps/api/src/modules/engine/runtimeExchangeSyncedPositionPrice.ts` | `docs/modules/api-engine.md` | Engine-side exchange-synced position price helper for imported LIVE position lifecycle truth. | Direct doc relation plus runtime position automation/read tests when price-source behavior changes. |
| `apps/api/src/modules/engine/runtimeExecutionClientOrderId.ts` | `docs/modules/api-engine.md` | Runtime execution client-order-id helper for deterministic order lifecycle identity. | Direct doc relation plus execution orchestrator/order lifecycle tests when id semantics change. |
| `apps/api/src/modules/engine/runtimeImportedPositionOwnership.ts` | `docs/modules/api-engine.md` | Imported LIVE position ownership helper for fail-closed selected-bot continuity and takeover. | Direct doc relation plus imported ownership/runtime automation tests when ownership semantics change. |
| `apps/api/src/modules/engine/runtimePositionAutomationDefaultPositionDeps.ts` | `docs/modules/api-engine.md` | Default dependency assembly for runtime position automation. | Direct doc relation plus runtime position automation tests when dependency wiring changes. |
| `apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.ts` | `docs/modules/api-engine.md` | Telemetry helper for skipped/non-actionable runtime position automation paths. | Direct doc relation plus runtime automation telemetry tests when telemetry changes. |
| `apps/api/src/modules/engine/runtimePositionAutomationStateRebase.ts` | `docs/modules/api-engine.md` | Runtime position automation state-rebase helper for continuity-safe lifecycle updates. | Direct doc relation plus state rebase/runtime automation tests when rebase behavior changes. |
| `apps/api/src/modules/engine/runtimePositionAutomationTelemetry.ts` | `docs/modules/api-engine.md` | Runtime position automation telemetry helper for automation outcomes and diagnostics. | Direct doc relation plus telemetry/runtime automation tests when diagnostics change. |
| `apps/api/src/modules/engine/runtimePositionState.store.ts` | `docs/modules/api-engine.md` | File-level runtime position state store for automation continuity and restart resilience. | Direct doc relation plus state-store/runtime flow tests when store behavior changes. |
| `apps/api/src/modules/engine/runtimeSignalMerge.ts` | `docs/modules/api-engine.md` | Runtime signal merge implementation for deterministic multi-strategy action resolution. | Direct doc relation plus runtime signal merge/evaluator tests when merge behavior changes. |
| `apps/api/src/modules/engine/runtimeTickerStore.ts` | `docs/modules/api-engine.md` | Runtime ticker store helper for latest market context used by signal and lifecycle paths. | Direct doc relation plus runtime market-data/signal tests when ticker semantics change. |
| `apps/api/src/modules/engine/sharedCandlePatternSeries.ts` | `docs/modules/api-engine.md` | Shared candle-pattern series helper used by runtime and backtest parity paths. | Direct doc relation plus candle-pattern series tests when series behavior changes. |
| `apps/api/src/modules/engine/sharedDerivativesSeries.ts` | `docs/modules/api-engine.md` | Shared derivatives series helper for runtime/backtest indicator context. | Direct doc relation plus derivatives series/parity tests when series behavior changes. |
| `apps/api/src/modules/engine/sharedExecutionCore.ts` | `docs/modules/api-engine.md` | Shared execution-core helper for runtime/backtest lifecycle parity. | Direct doc relation plus execution core/parity tests when behavior changes. |
| `apps/api/src/modules/engine/sharedIndicatorSeries.ts` | `docs/modules/api-engine.md` | Shared indicator series helper for runtime/backtest signal context. | Direct doc relation plus indicator series tests when behavior changes. |
| `apps/api/src/modules/engine/strategyIndicatorKernel.ts` | `docs/modules/api-engine.md` | Strategy indicator kernel used by signal evaluation. | Direct doc relation plus strategy indicator tests when kernel behavior changes. |
| `apps/api/src/modules/engine/strategyIndicatorRegistry.ts` | `docs/modules/api-engine.md` | Strategy indicator registry for supported indicator lookup and evaluation wiring. | Direct doc relation plus registry/evaluator tests when registry behavior changes. |
| `apps/api/src/modules/engine/strategyLifetimePolicy.ts` | `docs/modules/api-engine.md` | Strategy lifetime policy helper for open/close/DCA/protection lifecycle decisions. | Direct doc relation plus strategy lifetime policy tests when lifecycle behavior changes. |
| `apps/api/src/modules/engine/strategySignalAnalysis.ts` | `docs/modules/api-engine.md` | Signal analysis helper for runtime strategy evaluation diagnostics. | Direct doc relation plus signal analysis/evaluator tests when behavior changes. |
| `apps/api/src/modules/engine/strategySignalEvaluator.ts` | `docs/modules/api-engine.md` | Strategy signal evaluator implementation for runtime decision inputs. | Direct doc relation plus signal evaluator tests when behavior changes. |
