# LUC-2166 Engine/Runtime Model Doc-Test Gap Classification

Date: 2026-06-05
Owner lane: Backend API Engineer
Parent: [LUC-2161](/LUC/issues/LUC-2161)

## Scope

Classify the engine/runtime model rows listed in the latest architecture awareness report:

- `positionManagement.types.ts`
- `ruleEvaluator.types.ts`
- `runtimePositionAutomation.types.ts`
- `RuntimePositionStateStore`
- `RuntimeSignalDecisionEngine`
- `runtimeSignalEvaluationTypes.ts`
- `RuntimeSignalMarketDataGateway`
- `runtimeSignalSeriesTypes.ts`
- `simulator.types.ts`

No runtime behavior, deployment, account, exchange, or production path was changed.

## Contract Sources Reviewed

- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/07_modes-parity-and-data.md`
- `docs/status/architecture-awareness-report.md`
- `docs/status/architecture-map-status.md`
- `docs/graphs/architecture-awareness.csv`
- `docs/graphs/architecture-proof-register.csv`

## Classification Table

| Architecture contract | Affected file/entity | Current proof | Gap type | Severity | Next owner |
| --- | --- | --- | --- | --- | --- |
| Execution lifecycle DCA-first ordering, close authority, mode parity | `apps/api/src/modules/engine/positionManagement.types.ts` / `model:positionmanagement-types-ts:bcf1b4c0ff` | Graph row is `implemented`; related entities include lifecycle parity, paper lifecycle, position management, runtime automation, state store, and runtime read routes. Focused `positionManagement.service.test.ts` passed in this heartbeat. | Missing model-to-doc relation in graph. Tests are already covered through service/parity routes, not missing implementation coverage. | P2 traceability | Docs Memory Lead with Backend review |
| Strategy schema rule trees and evaluator availability | `apps/api/src/modules/engine/ruleEvaluator.types.ts` / `model:ruleevaluator-types-ts:e233144357` | Graph row is `implemented`; related entities include `ruleEvaluator.service.ts` and `ruleEvaluator.service.test.ts`. Focused test passed. | Missing model-to-doc relation in graph. Already-covered test relation exists. | P2 traceability | Docs Memory Lead |
| Runtime lifecycle automation dependencies and position-scoped protection ownership | `apps/api/src/modules/engine/runtimePositionAutomation.types.ts` / `model:runtimepositionautomation-types-ts:a89435b9fa` | Graph row is `implemented`; related entities include runtime position automation service and default deps. Existing focused runtime automation suites were discovered. | Missing model-to-doc relation in graph. No fresh standalone type test needed; behavior is covered through runtime automation service suites. | P2 traceability | Docs Memory Lead with Backend review |
| Durable runtime state for DCA/TTP/SL/TSL and restart continuity | `apps/api/src/modules/engine/runtimePositionState.store.ts#RuntimePositionStateStore` / `model:runtimepositionstatestore:0eb3d546cd` | Graph row is `implemented`; related entity is `runtimePositionState.store.ts`; tests discovered through runtime automation, orders exchange-event, bot dynamic-stop, and runtime read paths. | Missing model-to-doc relation and weak direct model-test relation in graph. Current proof is indirect but meaningful; no behavior defect isolated. | P2 traceability, watch as P1 only if future regression appears | Docs Memory Lead; Backend QA only if graph policy requires direct store-level test |
| Deterministic strategy signal decision evaluation | `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts#RuntimeSignalDecisionEngine` / `model:runtimesignaldecisionengine:d0fd2a236b` | Graph row is `implemented`; direct related test `runtimeSignalDecisionEngine.test.ts`. Focused test passed. | Missing model-to-doc relation only. Already-covered test relation exists. | P2 traceability | Docs Memory Lead |
| Decision envelope, condition line, and shared signal semantics | `apps/api/src/modules/engine/runtimeSignalEvaluationTypes.ts` / `model:runtimesignalevaluationtypes-ts:569069ffc0` | Graph row is `implemented`; related entities include final candle decision, decision engine, runtime signal loop, and strategy signal analysis. Focused decision-engine test passed for a downstream consumer. | Missing model-to-doc relation in graph. Type artifact is covered via downstream service tests, not a direct focused type-test gap. | P2 traceability | Docs Memory Lead with Backend review |
| Venue-scoped OHLCV and derivatives market-data input for runtime decisions | `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts#RuntimeSignalMarketDataGateway` / `model:runtimesignalmarketdatagateway:7720bbb943` | Graph row is `implemented`; route row has related `runtimeSignalMarketDataGateway.test.ts`, runtime loop, symbol stats/read-model, and exchange public market-data tests. Focused gateway test passed. | Missing model-to-doc relation and model-level test relation is under-linked; actual test coverage exists on route/service row. | P2 traceability | Docs Memory Lead |
| Runtime/replay candle payload and derivatives series shape | `apps/api/src/modules/engine/runtimeSignalSeriesTypes.ts` / `model:runtimesignalseriestypes-ts:a9e593d98d` | Graph row is `implemented`; related entity is runtime signal market-data gateway. Gateway test passed for OHLCV/derivatives series consumers. | Missing model-to-doc relation in graph. Type artifact covered through gateway tests. | P2 traceability | Docs Memory Lead |
| Backtest/paper fill simulation as approved mode difference | `apps/api/src/modules/engine/simulator.types.ts` / `model:simulator-types-ts:1cafa4264a` | Graph row is `implemented`; related entities include simulator service, paper lifecycle, and backtest fill model. Focused simulator test passed. | Missing model-to-doc relation in graph. Already-covered service test relation exists downstream. | P2 traceability | Docs Memory Lead |

## Validation

Static discovery:

- `rg` over `docs/status`, `docs/graphs`, and `apps/api/src` for all sampled rows.
- `Import-Csv docs/graphs/architecture-awareness.csv` for the sampled model IDs.
- `Get-Content docs/status/architecture-awareness-report.md` confirmed these rows are in `Top Actionable Missing Doc Links`, not the missing-test bucket.
- `Get-Content docs/status/architecture-map-status.md` confirmed the graph is incremental and not a full repository backfill.

Focused runtime unit proof:

```text
pnpm --filter api exec vitest run src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/ruleEvaluator.service.test.ts src/modules/engine/simulator.service.test.ts src/modules/engine/positionManagement.service.test.ts --reporter=verbose
```

Result:

```text
Test Files 5 passed (5)
Tests 45 passed (45)
```

## Conclusion

No engine/runtime implementation defect was isolated in this lane.

The sampled rows should be classified as architecture graph traceability gaps:

- primary gap: missing model-to-doc relations from engine/runtime model rows to the canonical runtime contracts;
- secondary gap: some model rows have weak direct model-test links, but focused tests exist through route/service consumers and passed for the sampled unit pack;
- release impact: no direct release blocker from this classification alone, but the doc-link backfill should remain in the architecture audit backlog so the graph does not over-report these as unknowns.
