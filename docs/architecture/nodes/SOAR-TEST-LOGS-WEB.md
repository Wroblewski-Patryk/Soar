---
id: SOAR-TEST-LOGS-WEB
name: "Logs Web tests"
type: test
status: verified_local
layer: testing
module: web-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Logs Web tests

| Field | Value |
| --- | --- |
| Description | Logs page and AuditTrailView tests for route shell empty loaded filter and metadata trace rendering. |
| File path | apps/web/src/features/logs/components/AuditTrailView.test.tsx |
| Related files | apps/web/src/app/dashboard/logs/page.test.tsx |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-PAGE-LOGS]], [[SOAR-COMP-AUDIT-TRAIL-VIEW]], [[SOAR-SERVICE-WEB-LOGS]] |
| Used by | [[SOAR-FEATURE-LOGS-AUDIT]] |
| UI related | [[SOAR-PAGE-LOGS]], [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-LOGS]] |
| Agent related |  |
| Notes | Primary frontend logs proof. |

## Relations

- verifies -> [[SOAR-COMP-AUDIT-TRAIL-VIEW]] (verified_local)
- verified_by <- [[SOAR-FEATURE-LOGS-AUDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
