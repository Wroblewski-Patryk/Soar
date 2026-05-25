---
id: SOAR-API-BOT-GET
name: "GET /dashboard/bots/:id"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: bot-setup
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/bots/:id

| Field | Value |
| --- | --- |
| Description | Authenticated bot detail route. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts, apps/api/src/modules/bots/bots.service.ts |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-BOTS]] |
| Used by | [[SOAR-SERVICE-WEB-BOTS-API]] |
| UI related |  |
| API related | [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Detail projection includes wallet strategy and market group context. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
