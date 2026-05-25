---
id: SOAR-TEST-ORDER-EXCHANGE-EVENTS
name: "Order exchange event tests"
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

# Order exchange event tests

| Field | Value |
| --- | --- |
| Description | Exchange event fill fee and account update tests. |
| File path | apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts |
| Related files | apps/api/src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts, apps/api/src/modules/orders/orders.exchangeEvents.accountUpdate.service.test.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]], [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Async exchange lifecycle proof family. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
