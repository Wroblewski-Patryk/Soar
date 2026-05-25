---
id: SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH
name: "POST /dashboard/bots/:id/market-groups/:groupId/strategies"
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

# POST /dashboard/bots/:id/market-groups/:groupId/strategies

| Field | Value |
| --- | --- |
| Description | Authenticated strategy-link attach route for bot market groups. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-BOT-MARKET-GROUPS]] |
| Used by | [[SOAR-SERVICE-WEB-BOTS-API]] |
| UI related |  |
| API related | [[SOAR-API-BOT-MARKET-GROUPS-LIST]] |
| Database related | [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Enabled strategy links define runtime topology. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
