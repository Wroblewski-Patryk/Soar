---
id: SOAR-API-BOT-CREATE
name: "POST /dashboard/bots"
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

# POST /dashboard/bots

| Field | Value |
| --- | --- |
| Description | Authenticated bot create route with wallet strategy market group consent and entitlement validation. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts, apps/api/src/modules/bots/bots.service.ts |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-TYPES-BOTS]], [[SOAR-SERVICE-BOTS]], [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]], [[SOAR-SERVICE-BOT-ACTIVATION-POLICY]] |
| Used by | [[SOAR-SERVICE-WEB-BOTS-API]] |
| UI related |  |
| API related | [[SOAR-API-BOT-LIST]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-API-KEY]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | LIVE create requires entitlement and consent. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
