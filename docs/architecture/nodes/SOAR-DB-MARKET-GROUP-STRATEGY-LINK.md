---
id: SOAR-DB-MARKET-GROUP-STRATEGY-LINK
name: "MarketGroupStrategyLink model"
type: database_model
status: verified_local
layer: data
module: bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# MarketGroupStrategyLink model

| Field | Value |
| --- | --- |
| Description | Canonical market-group strategy-link model. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-DB-STRATEGY]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH]] |
| Database related | [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Enabled links define runtime strategy context. |

## Relations

- reads_writes <- [[SOAR-SERVICE-BOT-MARKET-GROUPS]] (verified_local)
- guards_against <- [[SOAR-SERVICE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
