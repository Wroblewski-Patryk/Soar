---
id: SOAR-PAGE-LOGS
name: "Logs dashboard page"
type: page
status: verified_local
layer: frontend
module: web-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Logs dashboard page

| Field | Value |
| --- | --- |
| Description | Authenticated dashboard logs route shell. |
| File path | apps/web/src/app/dashboard/logs/page.tsx |
| Related files | apps/web/src/features/logs/components/AuditTrailView.tsx |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| Used by | [[SOAR-FEATURE-LOGS-AUDIT]] |
| UI related | [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-LOGS]] |
| Agent related |  |
| Notes | Route shell renders the canonical audit trail view. |

## Relations

- renders -> [[SOAR-COMP-AUDIT-TRAIL-VIEW]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-LOGS-AUDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
