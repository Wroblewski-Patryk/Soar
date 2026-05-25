---
id: SOAR-API-BOT-UPDATE
name: "PUT /dashboard/bots/:id"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PUT /dashboard/bots/:id

| Field | Value |
| --- | --- |
| Description | Authenticated bot update route with mode switch and canonical topology validation. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts, apps/api/src/modules/bots/bots.service.ts |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-TYPES-BOTS]], [[SOAR-SERVICE-BOTS]], [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]], [[SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE]] |
| Used by | [[SOAR-SERVICE-WEB-BOTS-API]] |
| UI related |  |
| API related | [[SOAR-API-BOT-GET]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | PAPER to LIVE transition is fail-closed without required proof. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
