---
id: SOAR-SERVICE-BOT-RESPONSE-MAPPER
name: "Bot response mapper service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot response mapper service

| Field | Value |
| --- | --- |
| Description | Maps bot domain records to API response payloads. |
| File path | apps/api/src/modules/bots/botResponseMapper.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-BOT-READ-PROJECTION]], [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-GET]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Response mapping support service. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
