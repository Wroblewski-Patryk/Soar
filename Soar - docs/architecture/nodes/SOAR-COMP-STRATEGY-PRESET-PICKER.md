---
id: SOAR-COMP-STRATEGY-PRESET-PICKER
name: "StrategyPresetPicker"
type: component
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# StrategyPresetPicker

| Field | Value |
| --- | --- |
| Description | Preset picker component that applies predefined strategy profiles to the shared form. |
| File path | apps/web/src/features/strategies/components/StrategyPresetPicker.tsx |
| Related files | apps/web/src/features/strategies/presets/strategyPresets.ts |
| Parent | [[SOAR-COMP-STRATEGY-FORM]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-PRESETS]] |
| Used by | [[SOAR-COMP-STRATEGY-FORM]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]] |
| API related |  |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Presets are authoring accelerators and not runtime proof by themselves. |

## Relations

- uses -> [[SOAR-SERVICE-STRATEGY-PRESETS]] (verified_local)
- composes <- [[SOAR-COMP-STRATEGY-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
