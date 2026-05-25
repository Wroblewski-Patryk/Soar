---
id: SOAR-COMP-AUDIT-TRAIL-VIEW
name: "AuditTrailView"
type: component
status: verified_local
layer: frontend
module: web-logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# AuditTrailView

| Field | Value |
| --- | --- |
| Description | Audit trail UI for filters table metadata trace expansion loading empty error and loaded states. |
| File path | apps/web/src/features/logs/components/AuditTrailView.tsx |
| Related files | apps/web/src/features/logs/components/AuditTrailView.test.tsx |
| Parent | [[SOAR-PAGE-LOGS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-LOGS]] |
| Used by | [[SOAR-PAGE-LOGS]] |
| UI related | [[SOAR-PAGE-LOGS]] |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-LOGS]] |
| Agent related |  |
| Notes | Component evidence includes empty loaded severity filter and metadata trace rendering. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-LOGS]] (verified_local)
- renders <- [[SOAR-PAGE-LOGS]] (verified_local)
- verifies <- [[SOAR-TEST-LOGS-WEB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
