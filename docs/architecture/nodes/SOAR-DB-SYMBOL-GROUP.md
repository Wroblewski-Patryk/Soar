---
id: SOAR-DB-SYMBOL-GROUP
name: "SymbolGroup model"
type: database_model
status: verified_local
layer: data
module: markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# SymbolGroup model

| Field | Value |
| --- | --- |
| Description | SymbolGroup model synchronized from market universe symbol composition and used by bot market groups. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-DB-MARKET-UNIVERSE]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSE-FORM]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-BOT-MARKET-GROUP-CREATE]] |
| Database related | [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]], [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Market universe update syncs dependent symbol groups. |

## Relations

- reads_writes <- [[SOAR-SERVICE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
