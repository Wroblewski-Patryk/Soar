---
id: SOAR-API-ORDER-CANCEL
name: "POST /dashboard/orders/:id/cancel"
type: api_route
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, api_route, backend, verified]
---

# POST /dashboard/orders/:id/cancel

| Field | Value |
| --- | --- |
| Description | Authenticated cancel command route with risk acknowledgement and exchange-backed fail-closed behavior. |
| File path | apps/api/src/modules/orders/orders.routes.ts |
| Related files | apps/api/src/modules/orders/orders.controller.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-ORDERS]], [[SOAR-SERVICE-ORDERS]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| API related | [[SOAR-CONTROLLER-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ORDER-SERVICE]], [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | LIVE exchange-side cancel remains capability-gated. |

## Relations

- delegates -> [[SOAR-CONTROLLER-ORDERS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
