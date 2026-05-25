---
id: SOAR-TEST-MARKETS-WEB
name: "Markets Web tests"
type: test
status: verified_local
layer: testing
module: web-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Markets Web tests

| Field | Value |
| --- | --- |
| Description | Markets page and component tests for list create edit form preview and table behavior. |
| File path | apps/web/src/features/markets/components/MarketUniverseForm.test.tsx |
| Related files | apps/web/src/features/markets/components/MarketUniversesTable.test.tsx, apps/web/src/app/dashboard/markets/list/page.test.tsx, apps/web/src/app/dashboard/markets/create/page.test.tsx, apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-PAGE-MARKETS-LIST]], [[SOAR-PAGE-MARKET-CREATE]], [[SOAR-PAGE-MARKET-EDIT]], [[SOAR-COMP-MARKET-UNIVERSES-TABLE]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| Used by | [[SOAR-FEATURE-MARKETS]] |
| UI related | [[SOAR-PAGE-MARKETS-LIST]], [[SOAR-PAGE-MARKET-CREATE]], [[SOAR-PAGE-MARKET-EDIT]] |
| API related | [[SOAR-SERVICE-WEB-MARKETS]], [[SOAR-API-MARKET-CATALOG]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Primary Web proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
