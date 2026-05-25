---
id: SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT
name: "SearchableMultiSelect"
type: component
status: verified_local
layer: frontend
module: web-markets
feature: markets
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# SearchableMultiSelect

| Field | Value |
| --- | --- |
| Description | Searchable multiselect control used for market universe include and exclude symbol lists. |
| File path | apps/web/src/features/markets/components/SearchableMultiSelect.tsx |
| Related files |  |
| Parent | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-UNIVERSE-HELPERS]] |
| Used by | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-API-MARKET-CATALOG]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-MARKETS]] |
| Agent related |  |
| Notes | Include/exclude UI control. |

## Relations

- composes <- [[SOAR-COMP-MARKET-UNIVERSE-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
