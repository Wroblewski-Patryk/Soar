---
id: SOAR-SERVICE-LOGS
name: "Logs service"
type: service
status: verified_local
layer: backend
module: api-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Logs service

| Field | Value |
| --- | --- |
| Description | Owner-scoped audit log query service with optional source actor and severity filters. |
| File path | apps/api/src/modules/logs/logs.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-DB-LOG]] |
| Used by | [[SOAR-CONTROLLER-LOGS]] |
| UI related |  |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-API]] |
| Docs related | [[SOAR-DOC-API-LOGS]] |
| Agent related |  |
| Notes | Service owns audit log read scoping and pagination. |

## Relations

- reads -> [[SOAR-DB-LOG]] (verified_local)
- calls <- [[SOAR-CONTROLLER-LOGS]] (verified_local)
- verifies <- [[SOAR-TEST-LOGS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
