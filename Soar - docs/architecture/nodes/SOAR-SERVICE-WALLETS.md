---
id: SOAR-SERVICE-WALLETS
name: "Wallets service"
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

# Wallets service

| Field | Value |
| --- | --- |
| Description | Wallet lifecycle metadata balance preview paper reset and analytics service. |
| File path | apps/api/src/modules/wallets/wallets.service.ts |
| Related files | apps/api/src/modules/wallets/wallets.errors.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]], [[SOAR-SERVICE-EXCHANGE-AUTH-READ]], [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]], [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]], [[SOAR-SERVICE-WALLET-LEDGER]], [[SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER]] |
| Used by | [[SOAR-CONTROLLER-WALLETS]], [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related |  |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-DELETE]], [[SOAR-API-WALLET-RESET-PAPER]], [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]], [[SOAR-API-WALLET-EQUITY-TIMELINE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WALLETS-API]], [[SOAR-TEST-WALLET-LEDGER]] |
| Docs related | [[SOAR-DOC-API-WALLETS]] |
| Agent related |  |
| Notes | Feature service must stay behind exchange adapter/authenticated-read boundaries. |

## Relations

- reads_writes -> [[SOAR-DB-WALLET]] (verified_local)
- guards_with -> [[SOAR-DB-BOT]] (verified_local)
- guards_with -> [[SOAR-DB-POSITION]] (verified_local)
- guards_with -> [[SOAR-DB-ORDER]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] (verified_local)
- uses -> [[SOAR-SERVICE-WALLET-LEDGER]] (verified_local)
- calls <- [[SOAR-CONTROLLER-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
