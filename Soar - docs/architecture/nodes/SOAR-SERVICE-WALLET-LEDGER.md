---
id: SOAR-SERVICE-WALLET-LEDGER
name: "Wallet ledger service"
type: service
status: verified_local
layer: backend
module: api-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Wallet ledger service

| Field | Value |
| --- | --- |
| Description | Wallet ledger analytics service for performance timeline and cashflow read models. |
| File path | apps/api/src/modules/wallets/walletLedger.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]], [[SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER]] |
| Used by | [[SOAR-SERVICE-WALLETS]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]], [[SOAR-API-WALLET-EQUITY-TIMELINE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WALLET-LEDGER]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Ledger read models remain evidence-bound and scoped by wallet ownership. |

## Relations

- uses -> [[SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER]] (verified_local)
- reads -> [[SOAR-DB-POSITION]] (verified_local)
- uses <- [[SOAR-SERVICE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
