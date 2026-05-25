---
id: SOAR-TYPES-LOGS
name: "Logs query schema"
type: validation
status: verified_local
layer: backend
module: api-logs
feature: logs-audit
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Logs query schema

| Field | Value |
| --- | --- |
| Description | Zod query schema for source actor severity page and limit filters. |
| File path | apps/api/src/modules/logs/logs.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-LOGS]] |
| Used by | [[SOAR-CONTROLLER-LOGS]] |
| UI related |  |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-API]] |
| Docs related | [[SOAR-DOC-API-LOGS]] |
| Agent related |  |
| Notes | DTO/query schema boundary. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-LOGS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
