---
id: SOAR-WORKFLOW-STRATEGIES-CHAIN
name: "Strategies authoring execution workflow"
type: workflow
status: verified_local
layer: fullstack
module: strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Strategies authoring execution workflow

| Field | Value |
| --- | --- |
| Description | Workflow from strategy list/create/edit UI through Web service API routes controller validation service DB bot/backtest guards tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-STRATEGIES.md |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-STRATEGIES]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-STRATEGIES-LIST]], [[SOAR-PAGE-STRATEGY-CREATE]], [[SOAR-PAGE-STRATEGY-EDIT]], [[SOAR-COMP-STRATEGY-FORM]], [[SOAR-COMP-STRATEGY-PRESET-PICKER]] |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]], [[SOAR-TEST-STRATEGY-INDICATORS]], [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]], [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Strategies slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
