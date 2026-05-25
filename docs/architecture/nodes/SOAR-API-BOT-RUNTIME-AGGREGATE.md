---
id: SOAR-API-BOT-RUNTIME-AGGREGATE
name: "GET /dashboard/bots/:id/runtime-monitoring/aggregate"
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

# GET /dashboard/bots/:id/runtime-monitoring/aggregate

| Field | Value |
| --- | --- |
| Description | Authenticated aggregate runtime monitoring route for session positions orders trades and symbol stats. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| Used by | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]], [[SOAR-TEST-BOT-RUNTIME-WEB]] |
| Docs related | [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Primary aggregate read route for runtime surfaces. |

## Relations

- delegates -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- calls <- [[SOAR-SERVICE-BOTS-MONITORING-AGGREGATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
