---
id: SOAR-API-LOGS-LIST
name: "GET /dashboard/logs"
type: api_route
status: verified_local
layer: backend
module: api-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/logs

| Field | Value |
| --- | --- |
| Description | Authenticated audit log list endpoint with filters and pagination bounds. |
| File path | apps/api/src/modules/logs/logs.routes.ts |
| Related files | apps/api/src/modules/logs/logs.controller.ts, apps/api/src/modules/logs/logs.service.ts |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-LOGS]], [[SOAR-TYPES-LOGS]], [[SOAR-SERVICE-LOGS]] |
| Used by | [[SOAR-SERVICE-WEB-LOGS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-LOGS]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-API]] |
| Docs related | [[SOAR-DOC-API-LOGS]] |
| Agent related |  |
| Notes | Route is mounted under /dashboard/logs. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-LOGS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-LOGS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
