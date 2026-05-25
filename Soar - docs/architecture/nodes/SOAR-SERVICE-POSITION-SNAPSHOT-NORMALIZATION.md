---
id: SOAR-SERVICE-POSITION-SNAPSHOT-NORMALIZATION
name: "Position exchange snapshot normalization"
type: service
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Position exchange snapshot normalization

| Field | Value |
| --- | --- |
| Description | Normalization helpers and types for exchange position open-order and trade-history snapshots. |
| File path | apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.ts |
| Related files | apps/api/src/modules/positions/positions.exchangeSnapshot.types.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-SNAPSHOT]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Keeps exchange payload shape normalized before API response or reconciliation. |

## Relations

- uses <- [[SOAR-SERVICE-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
