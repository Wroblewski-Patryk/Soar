---
id: SOAR-PAGE-BOT-CREATE
name: "Bot create page"
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

# Bot create page

| Field | Value |
| --- | --- |
| Description | Bot create route with wallet-first setup form. |
| File path | apps/web/src/app/dashboard/bots/create/page.tsx |
| Related files | apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]], [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-WALLET-LIST]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Requires walletId before bot creation. |

## Relations

- contains -> [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- aliases <- [[SOAR-PAGE-BOT-NEW-ALIAS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
