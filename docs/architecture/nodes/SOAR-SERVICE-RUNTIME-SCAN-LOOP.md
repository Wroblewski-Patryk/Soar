---
id: SOAR-SERVICE-RUNTIME-SCAN-LOOP
name: "Runtime scan loop service"
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

# Runtime scan loop service

| Field | Value |
| --- | --- |
| Description | Runtime scan loop service for periodic bot runtime evaluation. |
| File path | apps/api/src/modules/engine/runtimeScanLoop.service.ts |
| Related files | apps/api/src/modules/engine/runtimeScanLoop.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Runtime scheduler loop. |

## Relations

- calls -> [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)
- has_service <- [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
