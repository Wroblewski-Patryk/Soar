---
id: SOAR-API-WALLET-PERFORMANCE-SUMMARY
name: "GET /dashboard/wallets/:id/performance-summary"
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

# GET /dashboard/wallets/:id/performance-summary

| Field | Value |
| --- | --- |
| Description | Wallet analytics endpoint for summary including scoped open-PnL read model. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-SERVICE-WALLETS]], [[SOAR-SERVICE-WALLET-LEDGER]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-EQUITY-TIMELINE]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WALLET-LEDGER]], [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Imported LIVE open positions are scoped by selected wallet API-key id. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
