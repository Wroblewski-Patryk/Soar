---
id: SOAR-SERVICE-ORDER-LIFECYCLE
name: "Orders lifecycle service"
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

# Orders lifecycle service

| Field | Value |
| --- | --- |
| Description | Order lifecycle transition service for fill position and terminal state progression. |
| File path | apps/api/src/modules/orders/orders.lifecycle.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Used by | [[SOAR-SERVICE-ORDERS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Fill authority remains downstream of order submission. |

## Relations

- reads_writes -> [[SOAR-DB-ORDER-FILL]] (verified_local)
- uses <- [[SOAR-SERVICE-ORDERS]] (verified_local)
- feeds <- [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
