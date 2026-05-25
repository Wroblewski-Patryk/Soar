---
id: SOAR-PAGE-STRATEGY-CREATE
name: "Strategy create page"
type: page
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Strategy create page

| Field | Value |
| --- | --- |
| Description | Strategy create route using the shared strategy form and preset picker. |
| File path | apps/web/src/app/dashboard/strategies/create/page.tsx |
| Related files | apps/web/src/features/strategies/components/StrategyForm.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Create flow maps form state to API payload. |

## Relations

- renders -> [[SOAR-COMP-STRATEGY-FORM]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
