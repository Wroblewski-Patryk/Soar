---
id: SOAR-SERVICE-EXCHANGE-PUBLIC-READ
name: "Exchange public read service"
type: service
status: verified_local
layer: backend
module: exchange
feature: exchange-adapter
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Exchange public read service

| Field | Value |
| --- | --- |
| Description | Public exchange market map reader through disposable connector boundary. |
| File path | apps/api/src/modules/exchange/exchangePublicRead.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-SYMBOL-RULES]], [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-SYMBOL-RULES]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-PUBLIC-READ]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Public metadata boundary. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] (verified_local)
- uses <- [[SOAR-SERVICE-EXCHANGE-SYMBOL-RULES]] (verified_local)
- uses <- [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
