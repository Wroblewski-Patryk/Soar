---
id: SOAR-SERVICE-BOT-OWNERSHIP
name: "Bot ownership service"
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

# Bot ownership service

| Field | Value |
| --- | --- |
| Description | Bot ownership service for user-scoped bot access checks. |
| File path | apps/api/src/modules/bots/botOwnership.service.ts |
| Related files | apps/api/src/modules/bots/botOwnership.service.test.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-USER]] |
| Used by | [[SOAR-SERVICE-BOTS]], [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-BOT-OWNERSHIP]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Ownership checks are a cross-route safety boundary. |

## Relations

- checks -> [[SOAR-DB-BOT]] (verified_local)
- verified_by -> [[SOAR-TEST-BOT-OWNERSHIP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
