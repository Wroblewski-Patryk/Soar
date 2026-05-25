---
id: SOAR-SERVICE-RUNTIME-TRADES
name: "Runtime trades read service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime trades read service

| Field | Value |
| --- | --- |
| Description | Runtime trades read service and repository. |
| File path | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts |
| Related files | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-TRADE]] |
| Used by | [[SOAR-API-BOT-RUNTIME-TRADES]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-TRADES]] |
| Database related | [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime trades node. |

## Relations

- uses <- [[SOAR-SERVICE-RUNTIME-AGGREGATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
