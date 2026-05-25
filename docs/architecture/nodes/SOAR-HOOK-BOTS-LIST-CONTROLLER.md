---
id: SOAR-HOOK-BOTS-LIST-CONTROLLER
name: "useBotsListController"
type: hook
status: verified_local
layer: frontend
module: web-bots
feature: bot-setup
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useBotsListController

| Field | Value |
| --- | --- |
| Description | Controller hook for bots list state loading filtering deletion and navigation behavior. |
| File path | apps/web/src/features/bots/hooks/useBotsListController.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-BOTS-LIST-TABLE]] |
| UI related | [[SOAR-PAGE-BOTS-LIST]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-DELETE]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bots list controller hook. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- uses <- [[SOAR-PAGE-BOTS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
