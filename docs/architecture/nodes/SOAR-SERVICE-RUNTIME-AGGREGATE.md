---
id: SOAR-SERVICE-RUNTIME-AGGREGATE
name: "Runtime monitoring aggregate service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime monitoring aggregate service

| Field | Value |
| --- | --- |
| Description | Aggregate runtime monitoring service combining sessions symbol stats positions trades and market truth state. |
| File path | apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-SESSIONS]], [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]], [[SOAR-SERVICE-RUNTIME-SYMBOL-STATS]], [[SOAR-SERVICE-RUNTIME-TRADES]] |
| Used by | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Primary runtime read-model aggregator. |

## Relations

- uses -> [[SOAR-SERVICE-RUNTIME-SESSIONS]] (verified_local)
- uses -> [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]] (verified_local)
- uses -> [[SOAR-SERVICE-RUNTIME-SYMBOL-STATS]] (verified_local)
- uses -> [[SOAR-SERVICE-RUNTIME-TRADES]] (verified_local)
- delegates <- [[SOAR-CONTROLLER-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
