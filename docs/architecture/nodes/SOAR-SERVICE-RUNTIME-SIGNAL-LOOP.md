---
id: SOAR-SERVICE-RUNTIME-SIGNAL-LOOP
name: "Runtime signal loop service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime signal loop service

| Field | Value |
| --- | --- |
| Description | Runtime signal loop service and repository path for signal evaluation. |
| File path | apps/api/src/modules/engine/runtimeSignalLoop.service.ts |
| Related files | apps/api/src/modules/engine/runtimeSignalLoop.repository.ts, apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts, apps/api/src/modules/engine/runtimeSignalLoopSupervisor.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RULE-EVALUATOR]], [[SOAR-SERVICE-RUNTIME-FINAL-CANDLE-DECISION]], [[SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Signal evaluation loop. |

## Relations

- uses -> [[SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE]] (verified_local)
- uses -> [[SOAR-SERVICE-RUNTIME-FINAL-CANDLE-DECISION]] (verified_local)
- uses -> [[SOAR-SERVICE-RULE-EVALUATOR]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)
- uses -> [[SOAR-SERVICE-INDICATOR-ADAPTER]] (verified_local)
- calls <- [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
