---
id: SOAR-CONTROLLER-ORDERS
name: "Orders controller"
type: controller
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, controller, backend, verified]
---

# Orders controller

| Field | Value |
| --- | --- |
| Description | Express controller layer for list get manual context open cancel and close routes with typed error mapping. |
| File path | apps/api/src/modules/orders/orders.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children | [[SOAR-API-ORDER-LIST]], [[SOAR-API-ORDER-GET]], [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Depends on | [[SOAR-TYPES-ORDERS]], [[SOAR-SERVICE-ORDERS]] |
| Used by | [[SOAR-API-ORDER-LIST]], [[SOAR-API-ORDER-GET]], [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| UI related |  |
| API related | [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Controller maps fail-closed order errors to HTTP responses. |

## Relations

- validates_with -> [[SOAR-TYPES-ORDERS]] (verified_local)
- delegates -> [[SOAR-SERVICE-ORDERS]] (verified_local)
- delegates <- [[SOAR-API-ORDER-LIST]] (verified_local)
- delegates <- [[SOAR-API-ORDER-GET]] (verified_local)
- delegates <- [[SOAR-API-MANUAL-CONTEXT]] (verified)
- delegates <- [[SOAR-API-ORDER-OPEN]] (verified_local)
- delegates <- [[SOAR-API-ORDER-CANCEL]] (verified_local)
- delegates <- [[SOAR-API-ORDER-CLOSE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
