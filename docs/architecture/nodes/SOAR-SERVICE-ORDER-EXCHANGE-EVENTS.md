---
id: SOAR-SERVICE-ORDER-EXCHANGE-EVENTS
name: "Orders exchange events service"
type: service
status: partially_verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 75
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, backend, partially_verified]
---

# Orders exchange events service

| Field | Value |
| --- | --- |
| Description | Exchange event ingestion service for live order fills fees and lifecycle synchronization. |
| File path | apps/api/src/modules/orders/orders.exchangeEvents.service.ts |
| Related files | apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts, apps/api/src/modules/orders/orders.exchangeEventFinalization.service.ts, apps/api/scripts/preflight-order-fill-identity.mjs |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-SERVICE-ORDER-LIFECYCLE]] |
| Used by |  |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-ORDER-EXCHANGE-EVENTS]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Callable fill handler verified locally; no API or worker startup stream wiring. |

## Relations

- feeds -> [[SOAR-SERVICE-ORDER-LIFECYCLE]] (verified_local)
- reads_writes -> [[SOAR-DB-ORDER-FILL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.

The normalized Binance event handler has isolated database proof. No API or worker startup caller was found; it is not evidence of a running user-data stream or post-restart fill reconciliation.
