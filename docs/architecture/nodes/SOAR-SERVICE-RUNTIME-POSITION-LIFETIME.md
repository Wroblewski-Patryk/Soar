---
id: SOAR-SERVICE-RUNTIME-POSITION-LIFETIME
name: "Runtime position lifetime service"
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

# Runtime position lifetime service

| Field | Value |
| --- | --- |
| Description | Runtime position lifetime service for position lifecycle state transitions. |
| File path | apps/api/src/modules/engine/runtimePositionLifetime.service.ts |
| Related files | apps/api/src/modules/engine/runtimePositionLifetime.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]], [[SOAR-DB-POSITION]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-POSITION-PNL-LIFECYCLE]], [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Position lifecycle support. |

## Relations

- uses -> [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]] (verified_local)
- calls -> [[SOAR-SERVICE-RUNTIME-AUTOMATION]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
