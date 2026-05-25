---
id: SOAR-SERVICE-WEB-REPORTS
name: "Web reports API service"
type: service
status: verified_local
layer: frontend
module: web-reports
feature: reports
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web reports API service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for cross-mode performance reports. |
| File path | apps/web/src/features/reports/services/reports.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Used by | [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| UI related | [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-REPORTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-REPORTS]] |
| Agent related |  |
| Notes | Frontend-to-backend reports contract node. |

## Relations

- calls -> [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] (verified_local)
- calls <- [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
