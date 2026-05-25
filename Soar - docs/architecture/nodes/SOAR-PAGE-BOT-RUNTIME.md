---
id: SOAR-PAGE-BOT-RUNTIME
name: "Bot Runtime page"
type: page
status: verified_local
layer: frontend
module: web-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-21
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Bot Runtime page

| Field | Value |
| --- | --- |
| Description | Bot-specific runtime monitoring route and legacy runtime helper route. |
| File path | apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx |
| Related files | apps/web/src/app/dashboard/bots/runtime/page.tsx, apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| Used by | [[SOAR-PAGE-DASHBOARD]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Canonical bot-specific monitoring route. |

## Relations

- contains -> [[SOAR-COMP-BOTS-MANAGEMENT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
