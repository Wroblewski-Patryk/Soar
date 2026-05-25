---
id: SOAR-CONTROLLER-WALLETS
name: "Wallets controller"
type: controller
status: verified_local
layer: backend
module: api-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Wallets controller

| Field | Value |
| --- | --- |
| Description | Express wallet controller for auth extraction validation error mapping and route responses. |
| File path | apps/api/src/modules/wallets/wallets.controller.ts |
| Related files | apps/api/src/modules/wallets/wallets.errors.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-TYPES-WALLETS]], [[SOAR-SERVICE-WALLETS]] |
| Used by | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Maps wallet domain errors to HTTP responses. |

## Relations

- validates_with -> [[SOAR-TYPES-WALLETS]] (verified_local)
- calls -> [[SOAR-SERVICE-WALLETS]] (verified_local)
- routes_to <- [[SOAR-API-WALLET-LIST]] (verified_local)
- routes_to <- [[SOAR-API-WALLET-CREATE]] (verified_local)
- routes_to <- [[SOAR-API-WALLET-UPDATE]] (verified_local)
- routes_to <- [[SOAR-API-WALLET-RESET-PAPER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
