---
id: SOAR-COMP-BOT-CREATE-EDIT-FORM
name: "BotCreateEditForm"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotCreateEditForm

| Field | Value |
| --- | --- |
| Description | Bot create/edit form that loads wallets strategies market universes and enforces wallet-first LIVE prerequisites. |
| File path | apps/web/src/features/bots/components/BotCreateEditForm.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]], [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]] |
| UI related | [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]] |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]], [[SOAR-API-BOT-RUNTIME-GRAPH]], [[SOAR-API-WALLET-LIST]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Form blocks context mismatch before save. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- uses -> [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)
- selects -> [[SOAR-DB-STRATEGY]] (verified_local)
- selects -> [[SOAR-DB-MARKET-UNIVERSE]] (verified_local)
- contains <- [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
