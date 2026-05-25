---
id: SOAR-SERVICE-BOT-STRATEGY-PROJECTION-DRIFT
name: "Bot strategy projection drift service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot strategy projection drift service

| Field | Value |
| --- | --- |
| Description | Detects drift between bot strategy projections and current persisted strategy context. |
| File path | apps/api/src/modules/bots/botStrategyProjectionDrift.service.ts |
| Related files | apps/api/src/modules/bots/botStrategyProjectionDrift.service.test.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Used by | [[SOAR-SERVICE-BOTS]], [[SOAR-FEATURE-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-BOT-STRATEGY-PROJECTION-DRIFT]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Projection drift proof is important for strategy changes. |

## Relations

- verified_by -> [[SOAR-TEST-BOT-STRATEGY-PROJECTION-DRIFT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
