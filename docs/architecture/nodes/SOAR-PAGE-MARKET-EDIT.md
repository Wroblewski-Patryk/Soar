---
id: SOAR-PAGE-MARKET-EDIT
name: "Market universe edit page"
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

# Market universe edit page

| Field | Value |
| --- | --- |
| Description | Market universe edit route with existing universe load update and active-bot conflict feedback. |
| File path | apps/web/src/app/dashboard/markets/[id]/edit/page.tsx |
| Related files | apps/web/src/features/markets/components/MarketUniverseForm.tsx |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-MARKET-UNIVERSE-FORM]], [[SOAR-SERVICE-WEB-MARKETS]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Edit flow syncs dependent symbol groups when scope changes. |

## Relations

- renders -> [[SOAR-COMP-MARKET-UNIVERSE-FORM]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
