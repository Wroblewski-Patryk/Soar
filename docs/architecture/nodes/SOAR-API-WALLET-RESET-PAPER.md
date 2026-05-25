---
id: SOAR-API-WALLET-RESET-PAPER
name: "POST /dashboard/wallets/:id/reset-paper"
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

# POST /dashboard/wallets/:id/reset-paper

| Field | Value |
| --- | --- |
| Description | Dedicated paper wallet reset endpoint with mode ownership open-position and open-order guards. |
| File path | apps/api/src/modules/wallets/wallets.routes.ts |
| Related files | apps/api/src/modules/wallets/wallets.controller.ts, apps/api/src/modules/wallets/wallets.service.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-SERVICE-WALLETS]] |
| Used by | [[SOAR-SERVICE-WEB-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-GET]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WALLETS-API]], [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-API-WALLETS]], [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Reset updates checkpoint without deleting history rows. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-WALLETS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
