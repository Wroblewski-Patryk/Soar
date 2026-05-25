---
id: SOAR-SERVICE-RUNTIME-SESSIONS
name: "Runtime sessions read service"
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

# Runtime sessions read service

| Field | Value |
| --- | --- |
| Description | Runtime sessions list and detail read services. |
| File path | apps/api/src/modules/bots/runtimeSessionsRead.service.ts |
| Related files | apps/api/src/modules/bots/runtimeSessionRead.service.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-RUNTIME-SESSION]] |
| Used by | [[SOAR-API-BOT-RUNTIME-SESSIONS]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-SESSIONS]], [[SOAR-API-BOT-RUNTIME-SESSION-GET]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Session read node. |

## Relations

- uses <- [[SOAR-SERVICE-RUNTIME-AGGREGATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
