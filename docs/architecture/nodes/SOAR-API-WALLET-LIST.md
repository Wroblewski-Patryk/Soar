---
id: SOAR-API-WALLET-LIST
name: "GET /dashboard/wallets"
type: api_route
status: verified_local
layer: backend
module: api-wallets
feature: wallets
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/wallets

| Field | Value |
| --- | --- |
| Description | Authenticated wallet list endpoint with optional mode marketType and exchange filters. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-TYPES-WALLETS]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-GET]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | List payload is the table API-key status source. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-WALLETS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
