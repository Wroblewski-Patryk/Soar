---
id: SOAR-COMP-MARKET-UNIVERSE-FORM
name: "MarketUniverseForm"
type: component
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# MarketUniverseForm

| Field | Value |
| --- | --- |
| Description | Market universe create/edit form with catalog-backed symbol selection and final preview composition. |
| File path | apps/web/src/features/markets/components/MarketUniverseForm.tsx |
| Related files | apps/web/src/features/markets/utils/marketUniverseHelpers.ts, apps/web/src/features/markets/types/marketUniverse.type.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children | [[SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT]] |
| Depends on | [[SOAR-SERVICE-WEB-MARKETS]], [[SOAR-SERVICE-MARKET-UNIVERSE-HELPERS]] |
| Used by | [[SOAR-PAGE-MARKET-CREATE]], [[SOAR-PAGE-MARKET-EDIT]] |
| UI related | [[SOAR-PAGE-MARKET-CREATE]], [[SOAR-PAGE-MARKET-EDIT]] |
| API related | [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Form previews final symbol composition before save. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-MARKETS]] (verified_local)
- composes -> [[SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT]] (verified_local)
- uses -> [[SOAR-SERVICE-MARKET-UNIVERSE-HELPERS]] (verified_local)
- renders <- [[SOAR-PAGE-MARKET-CREATE]] (verified_local)
- renders <- [[SOAR-PAGE-MARKET-EDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
