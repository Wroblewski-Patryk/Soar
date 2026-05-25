---
id: SOAR-API-WALLET-CREATE
name: "POST /dashboard/wallets"
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

# POST /dashboard/wallets

| Field | Value |
| --- | --- |
| Description | Authenticated wallet create endpoint with mode-aware validation and capability guards. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-TYPES-WALLETS]], [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-LIST]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Wallet creation is prerequisite for bot creation context. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-WALLETS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
