---
id: SOAR-TEST-BOTS-MONITORING-FUTURE-SIGNALS
name: "Bot monitoring future signals tests"
type: test
status: verified_local
layer: testing
module: web-bots
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot monitoring future signals tests

| Field | Value |
| --- | --- |
| Description | Bot monitoring future signals section tests. |
| File path | apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]] |
| Used by | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bot monitoring future signal proof. |

## Relations

- verified_by <- [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
