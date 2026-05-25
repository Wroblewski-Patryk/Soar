---
id: SOAR-SERVICE-STRATEGY-PRESETS
name: "Strategy presets"
type: utility
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Strategy presets

| Field | Value |
| --- | --- |
| Description | Frontend strategy preset definitions used by the preset picker and strategy form. |
| File path | apps/web/src/features/strategies/presets/strategyPresets.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-STRATEGIES]] |
| Used by | [[SOAR-COMP-STRATEGY-PRESET-PICKER]], [[SOAR-COMP-STRATEGY-FORM]] |
| UI related | [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| API related |  |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Preset test coverage guards expected defaults. |

## Relations

- uses <- [[SOAR-COMP-STRATEGY-PRESET-PICKER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
