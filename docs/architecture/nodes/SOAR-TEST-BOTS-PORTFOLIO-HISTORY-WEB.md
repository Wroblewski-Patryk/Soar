---
id: SOAR-TEST-BOTS-PORTFOLIO-HISTORY-WEB
name: "Bot portfolio history Web tests"
type: test
status: verified_local
layer: testing
module: web-bots
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot portfolio history Web tests

| Field | Value |
| --- | --- |
| Description | Bot portfolio history Web tests. |
| File path | apps/web/src/features/bots/components/BotsManagement.portfolio-history.test.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION]] |
| Used by | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bot portfolio history Web proof. |

## Relations

- verified_by <- [[SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
