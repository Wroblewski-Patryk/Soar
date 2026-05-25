---
id: SOAR-TEST-ORDER-SERVICE
name: "Orders service tests"
type: test
status: verified
layer: testing
module: api-orders
feature: manual-order
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, test, testing, verified]
---

# Orders service tests

| Field | Value |
| --- | --- |
| Description | Focused orders service unit/regression tests. |
| File path | apps/api/src/modules/orders/orders.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDERS]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Part of manual-order coverage family. |

## Relations

- verified_by <- [[SOAR-FEATURE-MANUAL-ORDER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
