---
id: SOAR-FEATURE-STRATEGIES
name: "Strategy authoring and indicators"
type: feature
status: verified_local
layer: fullstack
module: strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Strategy authoring and indicators

| Field | Value |
| --- | --- |
| Description | Strategy CRUD import export indicator catalog config validation presets and bot/backtest reference protection. |
| File path | docs/modules/api-strategies.md |
| Related files | docs/modules/web-strategies.md |
| Parent |  |
| Children | [[SOAR-PAGE-STRATEGIES-LIST]], [[SOAR-PAGE-STRATEGY-CREATE]], [[SOAR-PAGE-STRATEGY-EDIT]], [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Depends on | [[SOAR-DB-STRATEGY]], [[SOAR-FEATURE-BOT-SETUP]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-STRATEGIES-LIST]], [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]], [[SOAR-TEST-STRATEGY-INDICATORS]], [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]], [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled strategy authoring separately from bot setup topology. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-STRATEGIES-LIST]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-STRATEGY-CREATE]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-STRATEGY-EDIT]] (verified_local)
- feeds -> [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- feeds -> [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- verified_by -> [[SOAR-TEST-STRATEGIES-API]] (verified_local)
- verified_by -> [[SOAR-TEST-STRATEGY-INDICATORS]] (verified_local)
- verified_by -> [[SOAR-TEST-STRATEGIES-WEB]] (verified_local)
- verified_by -> [[SOAR-TEST-STRATEGY-FORM-UTILS]] (verified_local)
- documented_by -> [[SOAR-DOC-API-STRATEGIES]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-STRATEGIES]] (verified_local)
- depends_on <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
