---
id: SOAR-API-BOT-RUNTIME-GRAPH
name: "GET /dashboard/bots/:id/runtime-graph"
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

# GET /dashboard/bots/:id/runtime-graph

| Field | Value |
| --- | --- |
| Description | Authenticated bot runtime graph route. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-BOTS]] |
| Used by | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Route-level Bot Runtime node. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
