---
id: SOAR-COMP-STRATEGY-FORM-SECTIONS
name: "Strategy form sections"
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

# Strategy form sections

| Field | Value |
| --- | --- |
| Description | Strategy form section components for basic open close indicators and additional configuration. |
| File path | apps/web/src/features/strategies/components/StrategyFormSections/Basic.tsx |
| Related files | apps/web/src/features/strategies/components/StrategyFormSections/Open.tsx, apps/web/src/features/strategies/components/StrategyFormSections/Close.tsx, apps/web/src/features/strategies/components/StrategyFormSections/Indicators.tsx, apps/web/src/features/strategies/components/StrategyFormSections/Additional.tsx |
| Parent | [[SOAR-COMP-STRATEGY-FORM]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]] |
| Used by | [[SOAR-COMP-STRATEGY-FORM]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Sections isolate strategy configuration groups. |

## Relations

- reads -> [[SOAR-API-STRATEGY-INDICATORS]] (verified_local)
- composes <- [[SOAR-COMP-STRATEGY-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
