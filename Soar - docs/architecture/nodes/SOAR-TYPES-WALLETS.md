---
id: SOAR-TYPES-WALLETS
name: "Wallet DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Wallet DTO schemas

| Field | Value |
| --- | --- |
| Description | Zod wallet command query preview and analytics schemas. |
| File path | apps/api/src/modules/wallets/wallets.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-WALLETS]] |
| Used by | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-SERVICE-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-API]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Validation encodes LIVE allocation and analytics date/source constraints. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
