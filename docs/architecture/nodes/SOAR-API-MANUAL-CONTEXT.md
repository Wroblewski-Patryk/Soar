---
id: SOAR-API-MANUAL-CONTEXT
name: "GET /dashboard/orders/manual-context"
type: api_route
status: verified
layer: backend
module: api-orders
feature: manual-order
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified
tags: [soar-map, api_route, backend, verified]
---

# GET /dashboard/orders/manual-context

| Field | Value |
| --- | --- |
| Description | Authenticated manual-order context endpoint with market rules price reference and execution metadata. |
| File path | apps/api/src/modules/orders/orders.routes.ts |
| Related files | apps/api/src/modules/orders/orders.manualContext.service.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDERS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] |
| UI related |  |
| API related | [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Gate.io contract-size route proof is mapped through this node. |

## Relations

- delegates -> [[SOAR-SERVICE-ORDERS]] (verified)
- delegates -> [[SOAR-CONTROLLER-ORDERS]] (verified)
- calls <- [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] (verified)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
