---
id: SOAR-TEST-POSITIONS-SERVICE
name: "Positions service tests"
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

# Positions service tests

| Field | Value |
| --- | --- |
| Description | Focused positions service tests for list get manual updates and management behavior. |
| File path | apps/api/src/modules/positions/positions.service.test.ts |
| Related files | apps/api/src/modules/positions/positions.list.e2e.test.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-POSITIONS]] |
| Used by | [[SOAR-FEATURE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-LIST]], [[SOAR-API-POSITION-MANUAL-UPDATE]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Part of positions graph proof family. |

## Relations

- verified_by <- [[SOAR-FEATURE-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
