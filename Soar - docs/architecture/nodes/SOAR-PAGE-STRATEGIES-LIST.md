---
id: SOAR-PAGE-STRATEGIES-LIST
name: "Strategies list page"
type: page
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Strategies list page

| Field | Value |
| --- | --- |
| Description | Canonical strategies list route for strategy browsing deletion import and export navigation. |
| File path | apps/web/src/app/dashboard/strategies/list/page.tsx |
| Related files | apps/web/src/features/strategies/components/StrategiesList.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-COMP-STRATEGIES-LIST]], [[SOAR-SERVICE-WEB-STRATEGIES]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-STRATEGIES-LIST]] |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | List/delete surface for strategy authoring. |

## Relations

- renders -> [[SOAR-COMP-STRATEGIES-LIST]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
