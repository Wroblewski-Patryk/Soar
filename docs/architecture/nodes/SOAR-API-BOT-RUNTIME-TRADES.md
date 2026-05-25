---
id: SOAR-API-BOT-RUNTIME-TRADES
name: "GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades

| Field | Value |
| --- | --- |
| Description | Authenticated runtime trades route. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-RUNTIME-TRADES]] |
| Used by | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Trades read route. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
