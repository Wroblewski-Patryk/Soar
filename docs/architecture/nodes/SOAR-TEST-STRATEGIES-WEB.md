---
id: SOAR-TEST-STRATEGIES-WEB
name: "Strategies Web tests"
type: test
status: verified_local
layer: testing
module: web-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Strategies Web tests

| Field | Value |
| --- | --- |
| Description | Strategies route and component tests for list create edit redirect preset and indicator section behavior. |
| File path | apps/web/src/features/strategies/components/StrategyForm.test.tsx |
| Related files | apps/web/src/features/strategies/components/StrategiesList.test.tsx, apps/web/src/features/strategies/components/StrategyPresetPicker.test.tsx, apps/web/src/features/strategies/components/StrategyFormSections/Indicators.test.tsx, apps/web/src/app/dashboard/strategies/list/page.test.tsx, apps/web/src/app/dashboard/strategies/create/page.test.tsx, apps/web/src/app/dashboard/strategies/[id]/edit/page.test.tsx, apps/web/src/app/dashboard/strategies/[id]/page.test.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-PAGE-STRATEGIES-LIST]], [[SOAR-PAGE-STRATEGY-CREATE]], [[SOAR-PAGE-STRATEGY-EDIT]], [[SOAR-COMP-STRATEGIES-LIST]], [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related | [[SOAR-PAGE-STRATEGIES-LIST]], [[SOAR-PAGE-STRATEGY-CREATE]], [[SOAR-PAGE-STRATEGY-EDIT]] |
| API related | [[SOAR-SERVICE-WEB-STRATEGIES]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Primary Web proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
