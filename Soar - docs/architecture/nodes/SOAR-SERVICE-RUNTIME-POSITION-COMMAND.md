---
id: SOAR-SERVICE-RUNTIME-POSITION-COMMAND
name: "Runtime session position command service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime session position command service

| Field | Value |
| --- | --- |
| Description | Runtime close-position command service with ownership riskAck entitlement and exchange-backed fail-closed behavior. |
| File path | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-POSITION]], [[SOAR-SERVICE-ORDERS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime close action remains fill/exchange authority gated. |

## Relations

- reads_writes -> [[SOAR-DB-POSITION]] (verified_local)
- uses -> [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- delegates <- [[SOAR-CONTROLLER-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
