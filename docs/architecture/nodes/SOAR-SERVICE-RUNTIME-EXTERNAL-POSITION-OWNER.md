---
id: SOAR-SERVICE-RUNTIME-EXTERNAL-POSITION-OWNER
name: "Runtime external position owner service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime external position owner service

| Field | Value |
| --- | --- |
| Description | Determines ownership context for imported/external runtime positions. |
| File path | apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts |
| Related files | apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-POSITION]], [[SOAR-DB-API-KEY]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]], [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-API-KEY]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-EXTERNAL-POSITION-OWNER]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Imported position ownership boundary. |

## Relations

- checks -> [[SOAR-DB-POSITION]] (verified_local)
- verified_by -> [[SOAR-TEST-RUNTIME-EXTERNAL-POSITION-OWNER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
