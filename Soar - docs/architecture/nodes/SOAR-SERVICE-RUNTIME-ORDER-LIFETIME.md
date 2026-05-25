---
id: SOAR-SERVICE-RUNTIME-ORDER-LIFETIME
name: "Runtime order lifetime service"
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

# Runtime order lifetime service

| Field | Value |
| --- | --- |
| Description | Runtime order lifetime service for order state age and transition evaluation. |
| File path | apps/api/src/modules/engine/runtimeOrderLifetime.service.ts |
| Related files | apps/api/src/modules/engine/runtimeOrderLifetime.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]], [[SOAR-DB-ORDER]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-ORDER-CANCEL]] |
| Database related | [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Order lifecycle age support. |

## Relations

- uses -> [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
