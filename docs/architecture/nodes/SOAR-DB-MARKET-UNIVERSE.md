---
id: SOAR-DB-MARKET-UNIVERSE
name: "MarketUniverse model"
type: database_model
status: verified_local
layer: data
module: markets
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# MarketUniverse model

| Field | Value |
| --- | --- |
| Description | Market universe model selected by bot market-group topology. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-MARKET-GROUP-CREATE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Dedicated Markets chain still pending. |

## Relations

- selects <- [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] (verified_local)
- reads <- [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
