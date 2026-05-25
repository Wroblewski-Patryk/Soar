---
id: SOAR-TEST-WEB-EXCHANGE-CONNECTIONS
name: "Web exchange connections tests"
type: test
status: verified_local
layer: testing
module: web-exchanges
feature: exchange-adapter
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web exchange connections tests

| Field | Value |
| --- | --- |
| Description | Web exchange connection and capability presentation tests. |
| File path | apps/web/src/features/exchanges/components/ExchangeConnectionsView.test.tsx |
| Related files | apps/web/src/features/exchanges/exchangeCapabilities.test.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]], [[SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES]] |
| Used by | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| UI related | [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]] |
| API related | [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-CAPABILITY-CONTRACTS]] |
| Docs related | [[SOAR-DOC-WEB-EXCHANGES]] |
| Agent related |  |
| Notes | Web exchange residual proof. |

## Relations

- verified_by <- [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]] (verified_local)
- verified_by <- [[SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
