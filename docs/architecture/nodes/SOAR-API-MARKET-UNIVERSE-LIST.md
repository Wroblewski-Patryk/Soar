---
id: SOAR-API-MARKET-UNIVERSE-LIST
name: "GET /dashboard/markets/universes"
type: api_route
status: verified_local
layer: backend
module: api-markets
feature: markets
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/markets/universes

| Field | Value |
| --- | --- |
| Description | Authenticated market universe list endpoint scoped to the current user. |
| File path | apps/api/src/modules/markets/markets.routes.ts |
| Related files | apps/api/src/modules/markets/markets.controller.ts, apps/api/src/modules/markets/markets.service.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-MARKETS]], [[SOAR-SERVICE-MARKETS]] |
| Used by | [[SOAR-SERVICE-WEB-MARKETS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-UNIVERSE-GET]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Market universe list route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-MARKETS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
