---
id: SOAR-PAGE-BOT-DETAIL-ALIAS
name: "Bot detail alias page"
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

# Bot detail alias page

| Field | Value |
| --- | --- |
| Description | Bot detail alias route bridging bot setup preview and runtime entrypoints. |
| File path | apps/web/src/app/dashboard/bots/[id]/page.tsx |
| Related files | apps/web/src/app/dashboard/bots/[id]/page.test.tsx |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-PAGE-BOT-PREVIEW]], [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Selected-bot compatibility surface. |

## Relations

- aliases -> [[SOAR-PAGE-BOT-PREVIEW]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
