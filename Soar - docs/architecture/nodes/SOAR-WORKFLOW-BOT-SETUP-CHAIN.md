---
id: SOAR-WORKFLOW-BOT-SETUP-CHAIN
name: "Bot setup execution workflow"
type: workflow
status: verified_local
layer: fullstack
module: bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Bot setup execution workflow

| Field | Value |
| --- | --- |
| Description | Workflow from bot setup UI through Web service API lifecycle routes controller DTO service context validation canonical topology DB tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-BOT-SETUP.md |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-BOT-SETUP]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-BOTS-LIST]], [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]], [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]], [[SOAR-API-BOT-DELETE]], [[SOAR-API-BOT-MARKET-GROUPS-LIST]], [[SOAR-API-BOT-MARKET-GROUP-CREATE]], [[SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-API-KEY]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]], [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for P0 Bot Setup slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
