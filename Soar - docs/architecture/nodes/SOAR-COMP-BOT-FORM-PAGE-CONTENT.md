---
id: SOAR-COMP-BOT-FORM-PAGE-CONTENT
name: "BotFormPageContent"
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

# BotFormPageContent

| Field | Value |
| --- | --- |
| Description | Route-level create/edit bot form wrapper. |
| File path | apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| Used by | [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]] |
| UI related | [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]] |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Shared route wrapper for setup forms. |

## Relations

- contains -> [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] (verified_local)
- contains <- [[SOAR-PAGE-BOT-CREATE]] (verified_local)
- contains <- [[SOAR-PAGE-BOT-EDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
