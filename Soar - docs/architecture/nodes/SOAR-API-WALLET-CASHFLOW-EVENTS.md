---
id: SOAR-API-WALLET-CASHFLOW-EVENTS
name: "GET /dashboard/wallets/:id/cashflow-events"
type: api_route
status: verified_local
layer: backend
module: api-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/wallets/:id/cashflow-events

| Field | Value |
| --- | --- |
| Description | Wallet analytics endpoint for cashflow events filtered by canonical source and date range. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-SERVICE-WALLETS]], [[SOAR-SERVICE-WALLET-LEDGER]], [[SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLET-LEDGER]], [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Date-range validation rejects inverted from/to boundaries. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
