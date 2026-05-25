---
id: SOAR-DB-BOT-MARKET-GROUP
name: "BotMarketGroup model"
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

# BotMarketGroup model

| Field | Value |
| --- | --- |
| Description | Canonical bot market-group topology model. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-MARKET-GROUPS-LIST]], [[SOAR-API-BOT-MARKET-GROUP-CREATE]] |
| Database related | [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Canonical topology beats legacy direct projections. |

## Relations

- reads_writes <- [[SOAR-SERVICE-BOT-MARKET-GROUPS]] (verified_local)
- guards_against <- [[SOAR-SERVICE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
