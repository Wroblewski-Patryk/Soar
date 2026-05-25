---
id: SOAR-COMP-MARKET-UNIVERSES-TABLE
name: "MarketUniversesTable"
type: component
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# MarketUniversesTable

| Field | Value |
| --- | --- |
| Description | Market universes table component for list navigation and delete actions. |
| File path | apps/web/src/features/markets/components/MarketUniversesTable.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-MARKETS-LIST]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-MARKETS]] |
| Used by | [[SOAR-PAGE-MARKETS-LIST]] |
| UI related | [[SOAR-PAGE-MARKETS-LIST]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Table actions route through the Web markets service. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-MARKETS]] (verified_local)
- renders <- [[SOAR-PAGE-MARKETS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
