---
id: SOAR-TEST-ENGINE-RUNTIME-CORE
name: "Engine runtime core tests"
type: test
status: verified_local
layer: testing
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Engine runtime core tests

| Field | Value |
| --- | --- |
| Description | Aggregate engine runtime tests for execution guard dedupe lifecycle signal loops paper parity pre-trade risk rule evaluation telemetry and runtime flow. |
| File path | apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts |
| Related files | apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts, apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts, apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts, apps/api/src/modules/engine/runtimeOrderLifetime.service.test.ts, apps/api/src/modules/engine/runtimePositionLifetime.service.test.ts, apps/api/src/modules/engine/runtimeScanLoop.service.test.ts, apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts, apps/api/src/modules/engine/runtimeSignalLoop.repository.test.ts, apps/api/src/modules/engine/runtimeTelemetry.service.test.ts, apps/api/src/modules/engine/runtime-flow.e2e.test.ts, apps/api/src/modules/engine/runtime-orchestration-smoke.e2e.test.ts, apps/api/src/modules/engine/runtimeCrashRetry.regression.test.ts, apps/api/src/modules/engine/executionAdapterParity.test.ts, apps/api/src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts, apps/api/src/modules/engine/lifecycleCloseParity.golden.test.ts, apps/api/src/modules/engine/orderTypes.service.test.ts, apps/api/src/modules/engine/paperLifecycle.service.test.ts, apps/api/src/modules/engine/paperLiveDecisionEquivalence.test.ts, apps/api/src/modules/engine/paperRuntime.service.test.ts, apps/api/src/modules/engine/preTrade.e2e.test.ts, apps/api/src/modules/engine/preTrade.service.test.ts, apps/api/src/modules/engine/preTradeRisk.service.test.ts, apps/api/src/modules/engine/ruleEvaluator.service.test.ts, apps/api/src/modules/engine/runtimeBacktestParserParity.test.ts, apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts, apps/api/src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts, apps/api/src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]], [[SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE]], [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]], [[SOAR-SERVICE-RUNTIME-ORDER-LIFETIME]], [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]], [[SOAR-SERVICE-RUNTIME-TELEMETRY]], [[SOAR-SERVICE-PAPER-RUNTIME]], [[SOAR-SERVICE-PRETRADE-RISK]], [[SOAR-SERVICE-RULE-EVALUATOR]] |
| Used by | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-ORDER-OPEN]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Aggregate engine runtime proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-ORDER-LIFETIME]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]] (verified_local)
- verified_by <- [[SOAR-SERVICE-RUNTIME-TELEMETRY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
