---
id: SOAR-DB-ORDER-FILL
name: "OrderFill model"
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

# OrderFill model

| Field | Value |
| --- | --- |
| Description | Order fill persistence model used for partial/full fill lifecycle and fee reconciliation. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-DB-ORDER]] |
| Used by | [[SOAR-SERVICE-ORDER-LIFECYCLE]], [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-ORDER-FILL]] |
| Tests related | [[SOAR-TEST-ORDER-EXCHANGE-EVENTS]], [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Exact fill truth is required before position lifecycle claims. |

## Relations

- reads_writes <- [[SOAR-SERVICE-ORDER-LIFECYCLE]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
