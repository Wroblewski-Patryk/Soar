---
id: SOAR-SERVICE-BOTS
name: "Bots service"
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

# Bots service

| Field | Value |
| --- | --- |
| Description | Bots domain service and runtime route facade. |
| File path | apps/api/src/modules/bots/bots.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Used by | [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Facade for runtime routes and bot ownership. |

## Relations

- uses -> [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]] (verified_local)
- uses -> [[SOAR-SERVICE-BOT-ACTIVATION-POLICY]] (verified_local)
- uses -> [[SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE]] (verified_local)
- reads_writes -> [[SOAR-DB-BOT]] (verified_local)
- calls <- [[SOAR-CONTROLLER-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
