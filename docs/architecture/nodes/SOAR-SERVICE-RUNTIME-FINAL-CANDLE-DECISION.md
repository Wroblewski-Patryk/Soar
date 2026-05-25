---
id: SOAR-SERVICE-RUNTIME-FINAL-CANDLE-DECISION
name: "Runtime final candle decision service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime final candle decision service

| Field | Value |
| --- | --- |
| Description | Runtime final candle decision service for signal timing decisions. |
| File path | apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts |
| Related files | apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-MARKET-TRUTH-STATE]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Signal timing decision helper. |

## Relations

- uses <- [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
