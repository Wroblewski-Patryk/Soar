---
id: SOAR-WORKFLOW-LOGS-AUDIT-CHAIN
name: "Logs Audit Trail workflow"
type: workflow
status: verified_local
layer: fullstack
module: logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Logs Audit Trail workflow

| Field | Value |
| --- | --- |
| Description | Workflow from logs route through audit trail view Web service API route controller query schema service DB tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-LOGS-AUDIT.md |
| Parent | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-LOGS-AUDIT]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-LOGS]], [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-API]], [[SOAR-TEST-LOGS-WEB]] |
| Docs related | [[SOAR-DOC-API-LOGS]], [[SOAR-DOC-WEB-LOGS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Logs/Audit Trail slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
