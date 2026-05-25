---
id: SOAR-DB-POSITION
name: "Position model"
type: database_model
status: verified
layer: data
module: positions
feature: positions
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, database_model, data, verified]
---

# Position model

| Field | Value |
| --- | --- |
| Description | Position model used by runtime automation dashboard readbacks manual close and reconciliation. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Used by | [[SOAR-FEATURE-RUNTIME-DCA-PNL]], [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-RUNTIME-DCA-PNL]], [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Live mutation proof remains approval-gated. |

## Relations

- reads <- [[SOAR-API-BOT-RUNTIME-POSITIONS]] (partially_verified)
- reads_writes <- [[SOAR-SERVICE-ORDERS]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-RUNTIME-AUTOMATION]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-POSITIONS]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- reads <- [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] (verified_local)
- guards_with <- [[SOAR-SERVICE-WALLETS]] (verified_local)
- reads <- [[SOAR-SERVICE-WALLET-LEDGER]] (verified_local)
- checks <- [[SOAR-SERVICE-RUNTIME-EXTERNAL-POSITION-OWNER]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
