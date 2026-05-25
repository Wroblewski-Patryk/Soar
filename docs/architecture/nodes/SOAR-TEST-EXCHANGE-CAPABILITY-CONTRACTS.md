---
id: SOAR-TEST-EXCHANGE-CAPABILITY-CONTRACTS
name: "Exchange capability contract tests"
type: test
status: verified_local
layer: testing
module: exchange
feature: exchange-adapter
risk_level: 95
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Operation support stays explicit.
tags: [soar-map, test, testing, verified_local]
---

# Exchange capability contract tests

| Field | Value |
| --- | --- |
| Description | Tests for broad and exact exchange capability contracts. |
| File path | apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts |
| Related files | apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts, apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-EXECUTION-CAPABILITY]], [[SOAR-SERVICE-EXCHANGE-AUTH-READ-CONTRACT]] |
| Used by | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] |
| Database related |  |
| Tests related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- verified_by <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
