---
id: SOAR-TYPES-BOTS
name: "Bots runtime DTO schemas"
type: model
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, model, backend, verified_local]
---

# Bots runtime DTO schemas

| Field | Value |
| --- | --- |
| Description | DTO schemas for bot runtime aggregate sessions symbol stats positions trades and close commands. |
| File path | apps/api/src/modules/bots/bots.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-BOTS]] |
| Used by | [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime request parsing boundary. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-BOTS]] (verified_local)
- validates_with <- [[SOAR-CONTROLLER-BOTS]] (verified_local)
- validates_with <- [[SOAR-CONTROLLER-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
