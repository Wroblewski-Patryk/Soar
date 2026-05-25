---
id: SOAR-PAGE-MARKET-CREATE
name: "Market universe create page"
type: page
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Market universe create page

| Field | Value |
| --- | --- |
| Description | Market universe create route using the shared form and catalog-backed symbol options. |
| File path | apps/web/src/app/dashboard/markets/create/page.tsx |
| Related files | apps/web/src/features/markets/components/MarketUniverseForm.tsx |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Create flow builds market scope for bots/backtests. |

## Relations

- renders -> [[SOAR-COMP-MARKET-UNIVERSE-FORM]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
