---
id: SOAR-WEB-POSITIONS-SERVICE
name: "Web positions service"
type: service
status: verified_local
layer: frontend
module: web-positions
feature: positions
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-12
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web positions service

| Field | Value |
| --- | --- |
| Description | Web API helper for manual position parameter updates from runtime surfaces. |
| File path | apps/web/src/features/positions/services/positions.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-API-POSITION-MANUAL-UPDATE]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| API related | [[SOAR-API-POSITION-MANUAL-UPDATE]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-POSITIONS]] |
| Docs related | [[SOAR-DOC-WEB-POSITIONS]] |
| Agent related |  |
| Notes | Narrow web package boundary for position manual updates. |

## Relations

- calls -> [[SOAR-API-POSITION-MANUAL-UPDATE]] (verified_local)
- uses <- [[SOAR-COMP-RUNTIME-DATA-SECTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
