---
id: SOAR-TEST-API-RESIDUAL-EVIDENCE
name: "API residual evidence tests"
type: test
status: verified_local
layer: testing
module: api
feature: architecture-map
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API residual evidence tests

| Field | Value |
| --- | --- |
| Description | Aggregate API residual proof for bot runtime edge cases engine signal helpers orders queue router and data isolation tests. |
| File path | apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts |
| Related files | apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts, apps/api/src/modules/bots/runtimeMarketDataFallback.service.test.ts, apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts, apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts, apps/api/src/modules/bots/runtimeStrategyConfigParser.service.test.ts, apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts, apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts, apps/api/src/modules/engine/runtimeSignalDecisionEngine.test.ts, apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts, apps/api/src/modules/engine/runtimeSignalLoopSupervisor.test.ts, apps/api/src/modules/engine/runtimeSignalMarketDataGateway.test.ts, apps/api/src/modules/engine/runtimeSignalMerge.test.ts, apps/api/src/modules/engine/runtimeTickerStore.test.ts, apps/api/src/modules/engine/sharedCandlePatternSeries.test.ts, apps/api/src/modules/engine/sharedExecutionCore.test.ts, apps/api/src/modules/engine/simulator.service.test.ts, apps/api/src/modules/engine/strategyIndicatorRegistryParity.test.ts, apps/api/src/modules/engine/strategyLifetimePolicy.test.ts, apps/api/src/modules/engine/strategySignalAnalysis.test.ts, apps/api/src/modules/engine/strategySignalEvaluator.test.ts, apps/api/src/modules/isolation/data-isolation.e2e.test.ts, apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts, apps/api/src/modules/orders/orders.liveCancelBoundary.service.test.ts, apps/api/src/modules/orders/orders.liveFillResolution.test.ts, apps/api/src/modules/orders/orders.manual-paper-market.e2e.test.ts, apps/api/src/modules/orders/orders.positionScope.test.ts, apps/api/src/queue/queueTuning.test.ts, apps/api/src/router/alerts.test.ts, apps/api/src/router/cacheHeaders.test.ts |
| Parent | [[SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]], [[SOAR-FEATURE-MANUAL-ORDER]], [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Used by | [[SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-ORDER-OPEN]], [[SOAR-ROUTER-API-ROOT]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]], [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]], [[SOAR-TEST-ORDER-EXCHANGE-EVENTS]] |
| Docs related | [[SOAR-DOC-TESTING]] |
| Agent related |  |
| Notes | Residual API test proof from graph drift audit. |

## Relations

- verified_by <- [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] (verified_local)
- verified_by <- [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- verified_by <- [[SOAR-FEATURE-MANUAL-ORDER]] (verified_local)
- verified_by <- [[SOAR-FEATURE-API-PLATFORM-SAFETY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
