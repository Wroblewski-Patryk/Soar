---
id: SOAR-DOC-API-STRATEGIES
name: "API strategies module documentation"
type: documentation
status: verified_local
layer: documentation
module: api-strategies
feature: strategies
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# API strategies module documentation

| Field | Value |
| --- | --- |
| Description | Strategy API deep-dive covering CRUD import export indicators validation and active-bot/reference protection. |
| File path | docs/modules/api-strategies.md |
| Related files | docs/architecture/03_domain-model.md, docs/modules/api-bots.md, docs/modules/api-backtests.md |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-DOC-DATA-MODEL]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]], [[SOAR-TEST-STRATEGY-INDICATORS]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Canonical API strategies module doc. |

## Relations

- documented_by <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
