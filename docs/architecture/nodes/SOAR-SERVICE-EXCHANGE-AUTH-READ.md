---
id: SOAR-SERVICE-EXCHANGE-AUTH-READ
name: "Exchange authenticated read service"
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

# Exchange authenticated read service

| Field | Value |
| --- | --- |
| Description | Authenticated read boundary for positions open orders trade history balance preview and cashflow history. |
| File path | apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-AUTH-READ-CONTRACT]], [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] |
| Used by | [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]], [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-EXCHANGE-AUTH-READ]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Feature modules must not create authenticated clients directly. |

## Relations

- governed_by -> [[SOAR-SERVICE-EXCHANGE-AUTH-READ-CONTRACT]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] (verified_local)
- uses <- [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] (verified_local)
- uses <- [[SOAR-SERVICE-POSITIONS]] (verified_local)
- uses <- [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- uses <- [[SOAR-SERVICE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
