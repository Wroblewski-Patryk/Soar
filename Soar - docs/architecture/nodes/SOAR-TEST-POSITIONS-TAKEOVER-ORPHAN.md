---
id: SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN
name: "Positions takeover and orphan repair tests"
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

# Positions takeover and orphan repair tests

| Field | Value |
| --- | --- |
| Description | Takeover status rebind and orphan repair e2e tests. |
| File path | apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts |
| Related files | apps/api/src/modules/positions/positions.orphan-repair.e2e.test.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-API-POSITION-TAKEOVER-STATUS]], [[SOAR-API-POSITION-TAKEOVER-REBIND]], [[SOAR-API-POSITION-ORPHAN-REPAIR]] |
| Used by | [[SOAR-FEATURE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-TAKEOVER-STATUS]], [[SOAR-API-POSITION-ORPHAN-REPAIR]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Covers ownership ambiguity and repair rules. |

## Relations

- verified_by <- [[SOAR-FEATURE-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
