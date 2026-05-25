---
id: SOAR-SERVICE-BOT-READ-PROJECTION
name: "Bot read projection service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot read projection service

| Field | Value |
| --- | --- |
| Description | Builds bot read projections for dashboard and runtime APIs. |
| File path | apps/api/src/modules/bots/botReadProjection.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BOT-RESPONSE-MAPPER]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-GET]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Projection service for bot reads. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
