---
id: SOAR-SERVICE-MARKET-UNIVERSE-HELPERS
name: "Market universe frontend helpers"
type: utility
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Market universe frontend helpers

| Field | Value |
| --- | --- |
| Description | Frontend helper utilities for market universe symbol normalization and preview composition. |
| File path | apps/web/src/features/markets/utils/marketUniverseHelpers.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-MARKETS]] |
| Used by | [[SOAR-COMP-MARKET-UNIVERSE-FORM]], [[SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-API-MARKET-CATALOG]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Preview helper mirrors canonical composition rules. |

## Relations

- uses <- [[SOAR-COMP-MARKET-UNIVERSE-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
