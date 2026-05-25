---
id: SOAR-PAGE-STRATEGY-EDIT
name: "Strategy edit page"
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

# Strategy edit page

| Field | Value |
| --- | --- |
| Description | Strategy edit route with existing strategy load update and active-bot conflict handling. |
| File path | apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx |
| Related files | apps/web/src/features/strategies/components/StrategyForm.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-SERVICE-WEB-STRATEGIES]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Edit flow must preserve active-bot protection. |

## Relations

- renders -> [[SOAR-COMP-STRATEGY-FORM]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)
- redirects_to <- [[SOAR-PAGE-STRATEGY-ID-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
