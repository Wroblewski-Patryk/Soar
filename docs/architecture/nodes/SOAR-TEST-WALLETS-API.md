---
id: SOAR-TEST-WALLETS-API
name: "Wallets API tests"
type: test
status: verified_local
layer: testing
module: api-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Wallets API tests

| Field | Value |
| --- | --- |
| Description | Wallet API lifecycle e2e and service tests for CRUD preview guards paper reset and analytics contracts. |
| File path | apps/api/src/modules/wallets/wallets.e2e.test.ts |
| Related files | apps/api/src/modules/wallets/wallets.crud.e2e.test.ts, apps/api/src/modules/wallets/wallets.service.test.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-WALLETS]], [[SOAR-SERVICE-WALLETS]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-DELETE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Primary API proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
