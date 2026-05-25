---
id: SOAR-DB-BOT
name: "Bot model"
type: database_model
status: verified
layer: data
module: bots
feature: dashboard-runtime
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, database_model, data, verified]
---

# Bot model

| Field | Value |
| --- | --- |
| Description | Bot configuration and ownership model used by runtime dashboard orders and strategies. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-WALLET]] |
| Used by | [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-API-MANUAL-CONTEXT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Backfill should split bot strategy and market-group child records. |

## Relations

- guards_with <- [[SOAR-SERVICE-WALLETS]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-BOTS]] (verified_local)
- guards_against <- [[SOAR-SERVICE-STRATEGIES]] (verified_local)
- guards_against <- [[SOAR-SERVICE-MARKETS]] (verified_local)
- reads <- [[SOAR-SERVICE-REPORTS]] (verified_local)
- reads <- [[SOAR-SERVICE-BOT-ASSISTANT]] (verified_local)
- checks <- [[SOAR-SERVICE-BOT-OWNERSHIP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
