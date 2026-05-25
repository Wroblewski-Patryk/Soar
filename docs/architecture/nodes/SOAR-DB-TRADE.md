---
id: SOAR-DB-TRADE
name: "Trade model"
type: database_model
status: verified
layer: data
module: reports
feature: manual-order
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-21
verification_status: verified
tags: [soar-map, database_model, data, verified]
---

# Trade model

| Field | Value |
| --- | --- |
| Description | Trade model for realized trading history and reports. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-DB-ORDER]] |
| Used by | [[SOAR-SERVICE-ORDERS]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | ExecutionMode snapshot is tracked in requirement matrix. |

## Relations

- writes <- [[SOAR-SERVICE-ORDERS]] (verified_local)
- reads <- [[SOAR-SERVICE-REPORTS]] (verified_local)
- aggregates <- [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
