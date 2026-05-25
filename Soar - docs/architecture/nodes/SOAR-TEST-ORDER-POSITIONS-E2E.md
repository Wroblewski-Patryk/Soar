---
id: SOAR-TEST-ORDER-POSITIONS-E2E
name: "Orders positions e2e tests"
type: test
status: verified
layer: testing
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, test, testing, verified]
---

# Orders positions e2e tests

| Field | Value |
| --- | --- |
| Description | DB-backed order-position lifecycle route and service proof. |
| File path | apps/api/src/modules/orders/orders-positions.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]], [[SOAR-SERVICE-ORDER-LIFECYCLE]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related |  |
| API related | [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER-FILL]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Primary DB-backed manual order chain proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-MANUAL-ORDER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
