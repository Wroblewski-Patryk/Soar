---
id: SOAR-PAGE-MARKETS-LIST
name: "Markets list page"
type: page
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Markets list page

| Field | Value |
| --- | --- |
| Description | Canonical market universe list route with universe table and delete navigation actions. |
| File path | apps/web/src/app/dashboard/markets/list/page.tsx |
| Related files | apps/web/src/features/markets/components/MarketUniversesTable.tsx |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-MARKET-UNIVERSES-TABLE]], [[SOAR-SERVICE-WEB-MARKETS]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSES-TABLE]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Market universe list surface. |

## Relations

- renders -> [[SOAR-COMP-MARKET-UNIVERSES-TABLE]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
