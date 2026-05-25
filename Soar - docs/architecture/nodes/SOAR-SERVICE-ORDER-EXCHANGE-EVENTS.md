---
id: SOAR-SERVICE-ORDER-EXCHANGE-EVENTS
name: "Orders exchange events service"
type: service
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, backend, verified]
---

# Orders exchange events service

| Field | Value |
| --- | --- |
| Description | Exchange event ingestion service for live order fills fees and lifecycle synchronization. |
| File path | apps/api/src/modules/orders/orders.exchangeEvents.service.ts |
| Related files | apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-SERVICE-ORDER-LIFECYCLE]] |
| Used by | [[SOAR-SERVICE-ORDERS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-ORDER-EXCHANGE-EVENTS]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Async exchange fill confirmation path. |

## Relations

- feeds -> [[SOAR-SERVICE-ORDER-LIFECYCLE]] (verified_local)
- reads_writes -> [[SOAR-DB-ORDER-FILL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
