---
id: SOAR-COMP-STRATEGIES-LIST
name: "StrategiesList"
type: component
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# StrategiesList

| Field | Value |
| --- | --- |
| Description | Strategies list component for strategy table actions import export and delete conflict feedback. |
| File path | apps/web/src/features/strategies/components/StrategiesList.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-STRATEGIES-LIST]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-STRATEGIES]] |
| Used by | [[SOAR-PAGE-STRATEGIES-LIST]] |
| UI related | [[SOAR-PAGE-STRATEGIES-LIST]] |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Table actions route through the Web strategies API client. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-STRATEGIES]] (verified_local)
- renders <- [[SOAR-PAGE-STRATEGIES-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
