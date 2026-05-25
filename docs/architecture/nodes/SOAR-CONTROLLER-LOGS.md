---
id: SOAR-CONTROLLER-LOGS
name: "Logs controller"
type: controller
status: verified_local
layer: backend
module: api-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Logs controller

| Field | Value |
| --- | --- |
| Description | Express controller for authenticated audit log reads. |
| File path | apps/api/src/modules/logs/logs.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-TYPES-LOGS]], [[SOAR-SERVICE-LOGS]] |
| Used by | [[SOAR-API-LOGS-LIST]] |
| UI related |  |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-API]] |
| Docs related | [[SOAR-DOC-API-LOGS]] |
| Agent related |  |
| Notes | Controller validates query and delegates to logs service. |

## Relations

- validates_with -> [[SOAR-TYPES-LOGS]] (verified_local)
- calls -> [[SOAR-SERVICE-LOGS]] (verified_local)
- routes_to <- [[SOAR-API-LOGS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
