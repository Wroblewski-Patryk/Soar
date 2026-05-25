---
id: SOAR-DB-ORDER
name: "Order model"
type: database_model
status: verified
layer: data
module: orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, database_model, data, verified]
---

# Order model

| Field | Value |
| --- | --- |
| Description | Order model for manual runtime and exchange lifecycle state. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Used by | [[SOAR-SERVICE-ORDERS]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Submitted vs closed lifecycle truth is part of current evidence. |

## Relations

- reads_writes <- [[SOAR-SERVICE-ORDERS]] (verified_local)
- guards_with <- [[SOAR-SERVICE-WALLETS]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
