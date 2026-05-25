---
id: SOAR-PAGE-BOTS-LIST
name: "Bots list page"
type: page
status: verified_local
layer: frontend
module: web-bots
feature: bot-setup
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Bots list page

| Field | Value |
| --- | --- |
| Description | Canonical bots route for bot list management and navigation to create edit preview runtime assistant. |
| File path | apps/web/src/app/dashboard/bots/page.tsx |
| Related files | apps/web/src/features/bots/components/BotsListTable.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOTS-LIST-TABLE]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-BOTS-LIST-TABLE]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-DELETE]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | List/delete surface for bot setup. |

## Relations

- contains -> [[SOAR-COMP-BOTS-LIST-TABLE]] (verified_local)
- uses -> [[SOAR-HOOK-BOTS-LIST-CONTROLLER]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-BOT-SETUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
