---
id: SOAR-WORKFLOW-REPORTS-CHAIN
name: "Reports performance evidence workflow"
type: workflow
status: verified_local
layer: fullstack
module: reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Reports performance evidence workflow

| Field | Value |
| --- | --- |
| Description | Workflow from reports route through view Web services cross-mode API controller aggregation data reads tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-REPORTS.md |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-REPORTS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-REPORTS]], [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-REPORTS-API]], [[SOAR-TEST-REPORTS-WEB]] |
| Docs related | [[SOAR-DOC-API-REPORTS]], [[SOAR-DOC-WEB-REPORTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Reports slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
