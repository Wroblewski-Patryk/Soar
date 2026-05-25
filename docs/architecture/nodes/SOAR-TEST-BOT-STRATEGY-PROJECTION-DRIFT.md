---
id: SOAR-TEST-BOT-STRATEGY-PROJECTION-DRIFT
name: "Bot strategy projection drift tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot strategy projection drift tests

| Field | Value |
| --- | --- |
| Description | Bot strategy projection drift service tests. |
| File path | apps/api/src/modules/bots/botStrategyProjectionDrift.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BOT-STRATEGY-PROJECTION-DRIFT]] |
| Used by | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-GET]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Projection drift proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-BOT-STRATEGY-PROJECTION-DRIFT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
