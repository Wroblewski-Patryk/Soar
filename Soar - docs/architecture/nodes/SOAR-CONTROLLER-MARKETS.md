---
id: SOAR-CONTROLLER-MARKETS
name: "Markets controller"
type: controller
status: verified_local
layer: backend
module: api-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Markets controller

| Field | Value |
| --- | --- |
| Description | Express markets controller for catalog query parsing universe CRUD auth checks and error mapping. |
| File path | apps/api/src/modules/markets/markets.controller.ts |
| Related files | apps/api/src/modules/markets/markets.errors.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-TYPES-MARKETS]], [[SOAR-SERVICE-MARKETS]] |
| Used by | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Controller maps market domain conflicts to HTTP errors. |

## Relations

- validates_with -> [[SOAR-TYPES-MARKETS]] (verified_local)
- calls -> [[SOAR-SERVICE-MARKETS]] (verified_local)
- routes_to <- [[SOAR-API-MARKET-UNIVERSE-LIST]] (verified_local)
- routes_to <- [[SOAR-API-MARKET-UNIVERSE-GET]] (verified_local)
- routes_to <- [[SOAR-API-MARKET-CATALOG]] (verified_local)
- routes_to <- [[SOAR-API-MARKET-UNIVERSE-CREATE]] (verified_local)
- routes_to <- [[SOAR-API-MARKET-UNIVERSE-UPDATE]] (verified_local)
- routes_to <- [[SOAR-API-MARKET-UNIVERSE-DELETE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
