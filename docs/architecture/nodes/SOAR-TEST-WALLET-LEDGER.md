---
id: SOAR-TEST-WALLET-LEDGER
name: "Wallet ledger tests"
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

# Wallet ledger tests

| Field | Value |
| --- | --- |
| Description | Wallet ledger and cashflow classifier tests. |
| File path | apps/api/src/modules/wallets/walletCashflowClassifier.service.test.ts |
| Related files | apps/api/src/modules/wallets/wallets.service.test.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WALLET-LEDGER]], [[SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]], [[SOAR-API-WALLET-EQUITY-TIMELINE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Analytics proof is grouped here until a dedicated ledger test split is needed. |

## Relations

- verified_by <- [[SOAR-FEATURE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
