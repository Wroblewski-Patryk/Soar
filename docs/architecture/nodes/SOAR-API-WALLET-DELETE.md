---
id: SOAR-API-WALLET-DELETE
name: "DELETE /dashboard/wallets/:id"
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

# DELETE /dashboard/wallets/:id

| Field | Value |
| --- | --- |
| Description | Authenticated wallet delete endpoint with linked-bot protection. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-SERVICE-WALLETS]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-LIST]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Delete protection prevents orphan bot references. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
