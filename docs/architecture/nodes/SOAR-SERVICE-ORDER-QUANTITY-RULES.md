---
id: SOAR-SERVICE-ORDER-QUANTITY-RULES
name: "Order quantity rules"
type: service
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified
tags: [soar-map, service, backend, verified]
---

# Order quantity rules

| Field | Value |
| --- | --- |
| Description | Quantity notional precision and min-executable rule helpers including derivative contract-size math. |
| File path | apps/api/src/modules/orders/orders.quantityRules.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-MANUAL-CONTEXT]], [[SOAR-SERVICE-PRETRADE]] |
| UI related |  |
| API related | [[SOAR-SERVICE-MANUAL-CONTEXT]], [[SOAR-SERVICE-PRETRADE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ORDER-QUANTITY-RULES]], [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Protects Gate.io contract-size notional truth. |

## Relations

- uses <- [[SOAR-SERVICE-MANUAL-CONTEXT]] (verified)
- uses <- [[SOAR-SERVICE-PRETRADE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
