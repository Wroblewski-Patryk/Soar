---
id: SOAR-TEST-STRATEGY-FORM-UTILS
name: "Strategy form utility tests"
type: test
status: verified_local
layer: testing
module: web-strategies
feature: strategies
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Strategy form utility tests

| Field | Value |
| --- | --- |
| Description | Strategy form mapper numeric input preset taxonomy and close validation utility tests. |
| File path | apps/web/src/features/strategies/utils/StrategyForm.map.test.ts |
| Related files | apps/web/src/features/strategies/utils/strategyNumericInput.test.ts, apps/web/src/features/strategies/utils/strategyCloseValidation.test.ts, apps/web/src/features/strategies/utils/indicatorPresentation.test.ts, apps/web/src/features/strategies/utils/indicatorTaxonomy.test.ts, apps/web/src/features/strategies/presets/strategyPresets.test.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]], [[SOAR-SERVICE-STRATEGY-PRESETS]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| API related | [[SOAR-SERVICE-WEB-STRATEGIES]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Utility proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
