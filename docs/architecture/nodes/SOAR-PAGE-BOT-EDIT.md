---
id: SOAR-PAGE-BOT-EDIT
name: "Bot edit page"
type: page
status: verified_local
layer: frontend
module: web-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Bot edit page

| Field | Value |
| --- | --- |
| Description | Bot edit route with existing bot and runtime graph context loading. |
| File path | apps/web/src/app/dashboard/bots/[id]/edit/page.tsx |
| Related files | apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]], [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-UPDATE]], [[SOAR-API-BOT-RUNTIME-GRAPH]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Edit flow uses runtime graph to preserve canonical topology. |

## Relations

- contains -> [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-BOT-SETUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
