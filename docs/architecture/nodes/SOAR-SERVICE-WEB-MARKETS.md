---
id: SOAR-SERVICE-WEB-MARKETS
name: "Web markets API service"
type: service
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web markets API service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for market universe CRUD and market catalog calls. |
| File path | apps/web/src/features/markets/services/markets.service.ts |
| Related files | apps/web/src/features/markets/types/marketUniverse.type.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Used by | [[SOAR-COMP-MARKET-UNIVERSES-TABLE]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSES-TABLE]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Frontend-to-backend market contract node. |

## Relations

- calls -> [[SOAR-API-MARKET-UNIVERSE-LIST]] (verified_local)
- calls -> [[SOAR-API-MARKET-UNIVERSE-GET]] (verified_local)
- calls -> [[SOAR-API-MARKET-CATALOG]] (verified_local)
- calls -> [[SOAR-API-MARKET-UNIVERSE-CREATE]] (verified_local)
- calls -> [[SOAR-API-MARKET-UNIVERSE-UPDATE]] (verified_local)
- calls -> [[SOAR-API-MARKET-UNIVERSE-DELETE]] (verified_local)
- calls <- [[SOAR-COMP-MARKET-UNIVERSES-TABLE]] (verified_local)
- calls <- [[SOAR-COMP-MARKET-UNIVERSE-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
