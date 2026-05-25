---
id: SOAR-PAGE-BOT-NEW-ALIAS
name: "Bot new alias page"
type: page
status: verified_local
layer: frontend
module: web-bots
feature: bot-setup
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Bot new alias page

| Field | Value |
| --- | --- |
| Description | Bot new alias route for bot creation flow compatibility. |
| File path | apps/web/src/app/dashboard/bots/new/page.tsx |
| Related files | apps/web/src/app/dashboard/bots/new/page.test.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-PAGE-BOT-CREATE]], [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-WALLET-LIST]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Create-route compatibility surface. |

## Relations

- aliases -> [[SOAR-PAGE-BOT-CREATE]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
