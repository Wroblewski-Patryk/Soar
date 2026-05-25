---
id: SOAR-SERVICE-EXCHANGE-SYMBOL-RULES
name: "Exchange symbol rules service"
type: service
status: verified_local
layer: backend
module: exchange
feature: exchange-adapter
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Exchange symbol rules service

| Field | Value |
| --- | --- |
| Description | Public symbol trading rules reader for min amount notional precision and market metadata. |
| File path | apps/api/src/modules/exchange/exchangeSymbolRules.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]], [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] |
| Used by | [[SOAR-SERVICE-MANUAL-CONTEXT]], [[SOAR-SERVICE-PRETRADE]], [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] |
| UI related |  |
| API related | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-SYMBOL-RULES]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Gate.io public symbol rules do not imply live execution support. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]] (verified_local)
- uses <- [[SOAR-SERVICE-MANUAL-CONTEXT]] (verified_local)
- uses <- [[SOAR-SERVICE-PRETRADE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
