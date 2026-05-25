---
id: SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE
name: "Runtime execution dedupe service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime execution dedupe service

| Field | Value |
| --- | --- |
| Description | Runtime execution dedupe service for idempotent runtime order actions. |
| File path | apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts |
| Related files | apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-DB-ORDER]], [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]], [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Idempotency proof boundary. |

## Relations

- reads_writes -> [[SOAR-DB-ORDER]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
