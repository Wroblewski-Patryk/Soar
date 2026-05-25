---
id: SOAR-API-BOT-RUNTIME-CLOSE-POSITION
name: "POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close

| Field | Value |
| --- | --- |
| Description | Authenticated runtime close-position command route with fail-closed ownership and risk guards. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] |
| Used by | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]], [[SOAR-TEST-BOT-RUNTIME-WEB]] |
| Docs related | [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | LIVE mutation remains separately approval-gated. |

## Relations

- delegates -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- calls <- [[SOAR-HOOK-CLOSE-RUNTIME-POSITION-ACTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
