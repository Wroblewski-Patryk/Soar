---
id: SOAR-TEST-ORDER-QUANTITY-RULES
name: "Order quantity rules tests"
type: test
status: verified
layer: testing
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified
tags: [soar-map, test, testing, verified]
---

# Order quantity rules tests

| Field | Value |
| --- | --- |
| Description | Quantity rule regression tests for precision minimums and notional math. |
| File path | apps/api/src/modules/orders/orders.quantityRules.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] |
| Used by | [[SOAR-SERVICE-MANUAL-CONTEXT]], [[SOAR-SERVICE-PRETRADE]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] |
| Database related |  |
| Tests related | [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Supports Gate.io derivative notional proof. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
