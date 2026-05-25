---
id: SOAR-TEST-POSITIONS-SNAPSHOT
name: "Positions exchange snapshot tests"
type: test
status: verified_local
layer: testing
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Positions exchange snapshot tests

| Field | Value |
| --- | --- |
| Description | Exchange snapshot normalization and route tests. |
| File path | apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts |
| Related files | apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.test.ts, apps/api/src/modules/positions/positions.authenticatedSnapshots.service.test.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]], [[SOAR-SERVICE-POSITION-SNAPSHOT-NORMALIZATION]] |
| Used by | [[SOAR-FEATURE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Locks authenticated read snapshot behavior. |

## Relations

- verified_by <- [[SOAR-FEATURE-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
