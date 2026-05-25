---
id: SOAR-API-WALLET-PREVIEW-BALANCE
name: "POST /dashboard/wallets/preview-balance"
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

# POST /dashboard/wallets/preview-balance

| Field | Value |
| --- | --- |
| Description | Authenticated LIVE wallet balance preview endpoint through owned API key and exchange read boundary. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-API]], [[SOAR-TEST-EXCHANGE-AUTH-READ]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Preview uses authenticated read evidence and does not imply live mutation support. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)
- enables <- [[SOAR-DB-API-KEY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
