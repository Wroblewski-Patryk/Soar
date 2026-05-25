---
id: SOAR-WORKFLOW-MARKETS-CHAIN
name: "Markets universe execution workflow"
type: workflow
status: verified_local
layer: fullstack
module: markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Markets universe execution workflow

| Field | Value |
| --- | --- |
| Description | Workflow from market universe list/create/edit UI through Web service API routes controller DTO service catalog/symbol resolution DB guards tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-MARKETS.md |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-MARKETS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-MARKETS-LIST]], [[SOAR-PAGE-MARKET-CREATE]], [[SOAR-PAGE-MARKET-EDIT]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]], [[SOAR-COMP-MARKET-UNIVERSES-TABLE]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]], [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-WEB-MARKETS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Markets slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
