---
id: SOAR-TEST-LOGS-API
name: "Logs API tests"
type: test
status: verified_local
layer: testing
module: api-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Logs API tests

| Field | Value |
| --- | --- |
| Description | Logs API tests for unauthenticated rejection owner scoping filters action-produced audit events and pagination. |
| File path | apps/api/src/modules/logs/logs.e2e.test.ts |
| Related files | apps/api/src/modules/pagination/pagination-query.test.ts |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-API-LOGS-LIST]], [[SOAR-SERVICE-LOGS]], [[SOAR-TYPES-LOGS]] |
| Used by | [[SOAR-FEATURE-LOGS-AUDIT]] |
| UI related |  |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-LOGS]] |
| Agent related |  |
| Notes | Primary backend logs proof. |

## Relations

- verifies -> [[SOAR-SERVICE-LOGS]] (verified_local)
- verified_by <- [[SOAR-FEATURE-LOGS-AUDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
