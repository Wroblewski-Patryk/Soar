---
id: SOAR-SERVICE-RUNTIME-POSITIONS-READ
name: "Runtime session positions read service"
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

# Runtime session positions read service

| Field | Value |
| --- | --- |
| Description | Runtime positions read model for selected bot session and aggregate surfaces. |
| File path | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts |
| Related files | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts, apps/api/src/modules/bots/runtimePositionSerialization.service.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-POSITION]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| Used by | [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]], [[SOAR-TEST-POSITIONS-RECONCILIATION]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Bridges runtime display to position truth. |

## Relations

- reads -> [[SOAR-DB-POSITION]] (verified_local)
- uses -> [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- delegates <- [[SOAR-CONTROLLER-BOTS]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-AGGREGATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
