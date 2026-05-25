---
id: SOAR-TEST-BOT-RUNTIME-API
name: "Bot Runtime API tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: bot-runtime
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-25
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot Runtime API tests

| Field | Value |
| --- | --- |
| Description | Focused API bot runtime monitoring aggregate sessions positions trades takeover and scope tests. |
| File path | apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts |
| Related files | apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts, apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts, apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts, apps/api/src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | API side of Bot Runtime graph proof; aggregate concurrency guard added after production SLO OOM evidence. |

## Relations

- verified_by <- [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
