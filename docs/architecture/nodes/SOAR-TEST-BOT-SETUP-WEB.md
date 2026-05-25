---
id: SOAR-TEST-BOT-SETUP-WEB
name: "Bot setup Web tests"
type: test
status: verified_local
layer: testing
module: web-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot setup Web tests

| Field | Value |
| --- | --- |
| Description | Bot list create edit preview route and form tests. |
| File path | apps/web/src/features/bots/components/BotCreateEditForm.test.tsx |
| Related files | apps/web/src/features/bots/components/BotsListTable.test.tsx, apps/web/src/app/dashboard/bots/create/page.test.tsx, apps/web/src/app/dashboard/bots/[id]/edit/page.test.tsx, apps/web/src/app/dashboard/bots/[id]/preview/page.test.tsx, apps/web/src/app/dashboard/bots/page.test.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOT-CREATE-EDIT-FORM]], [[SOAR-COMP-BOTS-LIST-TABLE]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-PAGE-BOTS-LIST]], [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]] |
| API related | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Primary setup frontend proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-BOT-SETUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
