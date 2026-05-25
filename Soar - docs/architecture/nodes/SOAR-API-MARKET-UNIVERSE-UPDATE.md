---
id: SOAR-API-MARKET-UNIVERSE-UPDATE
name: "PUT /dashboard/markets/universes/:id"
type: api_route
status: verified_local
layer: backend
module: api-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PUT /dashboard/markets/universes/:id

| Field | Value |
| --- | --- |
| Description | Authenticated market universe update endpoint blocked when used by active bot and syncing dependent symbol groups. |
| File path | apps/api/src/modules/markets/markets.routes.ts |
| Related files | apps/api/src/modules/markets/markets.controller.ts, apps/api/src/modules/markets/markets.service.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-MARKETS]], [[SOAR-TYPES-MARKETS]], [[SOAR-SERVICE-MARKETS]], [[SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER]] |
| Used by | [[SOAR-SERVICE-WEB-MARKETS]], [[SOAR-FEATURE-BOT-SETUP]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-UNIVERSE-GET]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Update route keeps active-bot mutation guard explicit. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-MARKETS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
