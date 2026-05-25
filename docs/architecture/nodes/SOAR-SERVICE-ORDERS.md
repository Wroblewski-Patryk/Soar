---
id: SOAR-SERVICE-ORDERS
name: "Orders service"
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

# Orders service

| Field | Value |
| --- | --- |
| Description | Order command and read service for manual context open cancel close and lifecycle behavior. |
| File path | apps/api/src/modules/orders/orders.service.ts |
| Related files | apps/api/src/modules/orders/orders.manualContext.service.ts, apps/api/src/modules/orders/orders.lifecycle.service.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-ORDER]] |
| Used by | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| UI related |  |
| API related | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | Includes submitted-close dedupe truth repair evidence. |

## Relations

- uses -> [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- reads_writes -> [[SOAR-DB-ORDER]] (verified_local)
- reads_writes -> [[SOAR-DB-POSITION]] (verified_local)
- writes -> [[SOAR-DB-TRADE]] (verified_local)
- uses -> [[SOAR-SERVICE-MANUAL-CONTEXT]] (verified)
- uses -> [[SOAR-SERVICE-PRETRADE]] (verified_local)
- uses -> [[SOAR-SERVICE-EXECUTION-ORCHESTRATOR]] (verified_local)
- uses -> [[SOAR-SERVICE-ORDER-LIFECYCLE]] (verified_local)
- uses -> [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] (verified_local)
- delegates <- [[SOAR-API-MANUAL-CONTEXT]] (verified)
- delegates <- [[SOAR-API-ORDER-OPEN]] (verified)
- delegates <- [[SOAR-CONTROLLER-ORDERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
