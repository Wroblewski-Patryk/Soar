---
id: SOAR-API-BOT-RUNTIME-SESSION-GET
name: "GET /dashboard/bots/:id/runtime-sessions/:sessionId"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/bots/:id/runtime-sessions/:sessionId

| Field | Value |
| --- | --- |
| Description | Authenticated runtime session detail route. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-RUNTIME-SESSIONS]] |
| Used by | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Session detail route. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
