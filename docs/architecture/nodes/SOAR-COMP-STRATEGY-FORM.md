---
id: SOAR-COMP-STRATEGY-FORM
name: "StrategyForm"
type: component
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# StrategyForm

| Field | Value |
| --- | --- |
| Description | Shared create/edit strategy form for basic open close indicator and additional settings. |
| File path | apps/web/src/features/strategies/components/StrategyForm.tsx |
| Related files | apps/web/src/features/strategies/hooks/useStrategyForm.ts, apps/web/src/features/strategies/types/StrategyForm.type.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children | [[SOAR-COMP-STRATEGY-FORM-SECTIONS]], [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| Depends on | [[SOAR-SERVICE-WEB-STRATEGIES]], [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]], [[SOAR-SERVICE-STRATEGY-PRESETS]] |
| Used by | [[SOAR-PAGE-STRATEGY-CREATE]], [[SOAR-PAGE-STRATEGY-EDIT]] |
| UI related | [[SOAR-PAGE-STRATEGY-CREATE]], [[SOAR-PAGE-STRATEGY-EDIT]] |
| API related | [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Form is the main strategy authoring UI. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-STRATEGIES]] (verified_local)
- composes -> [[SOAR-COMP-STRATEGY-FORM-SECTIONS]] (verified_local)
- composes -> [[SOAR-COMP-STRATEGY-PRESET-PICKER]] (verified_local)
- uses -> [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]] (verified_local)
- composes -> [[SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR]] (verified_local)
- renders <- [[SOAR-PAGE-STRATEGY-CREATE]] (verified_local)
- renders <- [[SOAR-PAGE-STRATEGY-EDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
