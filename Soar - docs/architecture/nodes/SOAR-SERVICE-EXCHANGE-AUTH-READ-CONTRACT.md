---
id: SOAR-SERVICE-EXCHANGE-AUTH-READ-CONTRACT
name: "Exchange authenticated read contract"
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

# Exchange authenticated read contract

| Field | Value |
| --- | --- |
| Description | Authenticated exchange read support contract for balance positions open orders trade history and wallet cashflow reads. |
| File path | apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-AUTH-READ]], [[SOAR-SERVICE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-EXCHANGE-AUTH-READ]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Read support is explicit per exchange marketType operation. |

## Relations

- owns <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- governed_by <- [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
