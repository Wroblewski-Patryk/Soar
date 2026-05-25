---
id: SOAR-TEST-RUNTIME-EXTERNAL-POSITION-OWNER
name: "Runtime external position owner tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: runtime-support-services
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Runtime external position owner tests

| Field | Value |
| --- | --- |
| Description | Runtime external position owner service tests. |
| File path | apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-EXTERNAL-POSITION-OWNER]] |
| Used by | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-API-KEY]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Imported position ownership proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-RUNTIME-EXTERNAL-POSITION-OWNER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
