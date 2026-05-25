---
id: SOAR-PAGE-BOT-PREVIEW
name: "Bot preview page"
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

# Bot preview page

| Field | Value |
| --- | --- |
| Description | Bot preview route bridging setup and runtime aggregate visibility. |
| File path | apps/web/src/app/dashboard/bots/[id]/preview/page.tsx |
| Related files | apps/web/src/features/bots/components/BotsManagement.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-WEB]], [[SOAR-TEST-BOT-RUNTIME-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Preview parity is linked to runtime aggregate chain. |

## Relations

- aliases <- [[SOAR-PAGE-BOT-DETAIL-ALIAS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
