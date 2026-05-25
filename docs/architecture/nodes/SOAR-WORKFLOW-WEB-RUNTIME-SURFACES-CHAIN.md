---
id: SOAR-WORKFLOW-WEB-RUNTIME-SURFACES-CHAIN
name: "Web runtime surfaces workflow"
type: workflow
status: verified_local
layer: frontend
module: web-runtime
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, frontend, verified_local]
---

# Web runtime surfaces workflow

| Field | Value |
| --- | --- |
| Description | Workflow from dashboard and bot monitoring runtime UI sections through Web services runtime APIs tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-WEB-RUNTIME-SURFACES.md |
| Parent | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]], [[SOAR-COMP-BOTS-MONITORING-TAB]], [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Web runtime surface drift slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
