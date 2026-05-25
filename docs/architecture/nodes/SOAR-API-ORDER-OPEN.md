---
id: SOAR-API-ORDER-OPEN
name: "POST /dashboard/orders/open"
type: api_route
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, api_route, backend, verified]
---

# POST /dashboard/orders/open

| Field | Value |
| --- | --- |
| Description | Authenticated manual order placement endpoint with risk and entitlement guards. |
| File path | apps/api/src/modules/orders/orders.routes.ts |
| Related files | apps/api/src/modules/orders/orders.service.ts, apps/api/src/modules/engine/preTrade.service.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDERS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Production LIVE use still requires explicit operator approval. |

## Relations

- delegates -> [[SOAR-SERVICE-ORDERS]] (verified)
- delegates -> [[SOAR-CONTROLLER-ORDERS]] (verified_local)
- calls <- [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] (verified)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
