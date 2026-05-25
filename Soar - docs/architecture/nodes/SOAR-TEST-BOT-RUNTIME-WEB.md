---
id: SOAR-TEST-BOT-RUNTIME-WEB
name: "Bot Runtime Web tests"
type: test
status: verified_local
layer: testing
module: web-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot Runtime Web tests

| Field | Value |
| --- | --- |
| Description | Focused Web bot runtime route monitoring component and runtime derivation tests. |
| File path | apps/web/src/features/bots/components/BotsManagement.test.tsx |
| Related files | apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx, apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.test.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-PAGE-BOT-RUNTIME]], [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Web side of Bot Runtime graph proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
