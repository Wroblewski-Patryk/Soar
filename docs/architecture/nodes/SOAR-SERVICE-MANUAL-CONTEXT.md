---
id: SOAR-SERVICE-MANUAL-CONTEXT
name: "Manual order context service"
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

# Manual order context service

| Field | Value |
| --- | --- |
| Description | Read-only selected bot symbol and venue context service for manual order constraints. |
| File path | apps/api/src/modules/orders/orders.manualContext.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] |
| Used by | [[SOAR-API-MANUAL-CONTEXT]] |
| UI related |  |
| API related | [[SOAR-API-MANUAL-CONTEXT]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Read-only context does not mutate orders. |

## Relations

- uses -> [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] (verified)
- uses -> [[SOAR-SERVICE-EXCHANGE-SYMBOL-RULES]] (verified_local)
- uses <- [[SOAR-SERVICE-ORDERS]] (verified)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
