---
id: SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR
name: "SortableThresholdListEditor"
type: component
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# SortableThresholdListEditor

| Field | Value |
| --- | --- |
| Description | Strategy form sortable threshold list editor for threshold ordering and editing. |
| File path | apps/web/src/features/strategies/components/StrategyFormSections/SortableThresholdListEditor.tsx |
| Related files |  |
| Parent | [[SOAR-COMP-STRATEGY-FORM]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]] |
| Used by | [[SOAR-COMP-STRATEGY-FORM]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Strategy threshold editor surface. |

## Relations

- uses -> [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]] (verified_local)
- composes <- [[SOAR-COMP-STRATEGY-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
