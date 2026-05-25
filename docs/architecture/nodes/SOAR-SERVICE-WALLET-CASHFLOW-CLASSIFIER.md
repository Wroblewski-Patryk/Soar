---
id: SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER
name: "Wallet cashflow classifier"
type: service
status: verified_local
layer: backend
module: api-wallets
feature: wallets
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Wallet cashflow classifier

| Field | Value |
| --- | --- |
| Description | Wallet cashflow source classifier used by ledger analytics and exchange cashflow history reads. |
| File path | apps/api/src/modules/wallets/walletCashflowClassifier.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-WALLETS]] |
| Used by | [[SOAR-SERVICE-WALLET-LEDGER]], [[SOAR-SERVICE-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLET-LEDGER]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Classifier keeps cashflow source semantics explicit. |

## Relations

- uses <- [[SOAR-SERVICE-WALLET-LEDGER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
