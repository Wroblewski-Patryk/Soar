---
id: SOAR-SERVICE-WEB-LOGS
name: "Web logs API service"
type: service
status: verified_local
layer: frontend
module: web-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web logs API service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for audit log list requests. |
| File path | apps/web/src/features/logs/services/logs.service.ts |
| Related files | apps/web/src/features/logs/types/log.type.ts |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-API-LOGS-LIST]] |
| Used by | [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| UI related | [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-LOGS]] |
| Agent related |  |
| Notes | Frontend-to-backend logs contract node. |

## Relations

- calls -> [[SOAR-API-LOGS-LIST]] (verified_local)
- calls <- [[SOAR-COMP-AUDIT-TRAIL-VIEW]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
