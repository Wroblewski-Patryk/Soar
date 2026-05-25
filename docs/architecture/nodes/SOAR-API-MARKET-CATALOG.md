---
id: SOAR-API-MARKET-CATALOG
name: "GET /dashboard/markets/catalog"
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

# GET /dashboard/markets/catalog

| Field | Value |
| --- | --- |
| Description | Authenticated market catalog endpoint with exchange marketType and base-currency filtering. |
| File path | apps/api/src/modules/markets/markets.routes.ts |
| Related files | apps/api/src/modules/markets/markets.controller.ts, apps/api/src/modules/markets/markets.service.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-MARKETS]], [[SOAR-TYPES-MARKETS]], [[SOAR-SERVICE-MARKETS]], [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] |
| Used by | [[SOAR-SERVICE-WEB-MARKETS]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKETS-API]], [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Catalog route feeds symbol options. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-MARKETS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
