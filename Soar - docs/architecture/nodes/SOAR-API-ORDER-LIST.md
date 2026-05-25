---
id: SOAR-API-ORDER-LIST
name: "GET /dashboard/orders"
type: api_route
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, api_route, backend, verified]
---

# GET /dashboard/orders

| Field | Value |
| --- | --- |
| Description | Authenticated order list route with normalized filters and ownership scope. |
| File path | apps/api/src/modules/orders/orders.routes.ts |
| Related files | apps/api/src/modules/orders/orders.controller.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-ORDERS]], [[SOAR-TYPES-ORDERS]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ORDER-SERVICE]], [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Dedicated list-route node added during manual-order graph backfill. |

## Relations

- delegates -> [[SOAR-CONTROLLER-ORDERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
