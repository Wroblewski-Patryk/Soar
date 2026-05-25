---
id: SOAR-TYPES-ORDERS
name: "Orders DTO and contract schemas"
type: model
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, model, backend, verified]
---

# Orders DTO and contract schemas

| Field | Value |
| --- | --- |
| Description | Zod schemas and DTO contracts for order list manual context open cancel and close commands. |
| File path | apps/api/src/modules/orders/orders.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ORDERS]] |
| Used by | [[SOAR-CONTROLLER-ORDERS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-ORDERS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ORDER-SERVICE]], [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Request parsing source for order route chain. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-ORDERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
