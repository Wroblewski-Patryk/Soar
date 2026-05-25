---
id: SOAR-COMP-BOTS-LIST-TABLE
name: "BotsListTable"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: bot-setup
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotsListTable

| Field | Value |
| --- | --- |
| Description | Bots list table for lifecycle navigation delete and runtime/preview actions. |
| File path | apps/web/src/features/bots/components/BotsListTable.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-BOTS-LIST]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-PAGE-BOTS-LIST]] |
| UI related | [[SOAR-PAGE-BOTS-LIST]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-DELETE]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Shared table-system behavior remains global. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- contains <- [[SOAR-PAGE-BOTS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
