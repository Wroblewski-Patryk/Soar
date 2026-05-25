---
id: SOAR-TEST-LIVE-ORDER-ADAPTER
name: "Live order adapter tests"
type: test
status: verified_local
layer: testing
module: exchange
feature: exchange-adapter
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Live order adapter tests

| Field | Value |
| --- | --- |
| Description | LIVE order adapter unit tests for submit retry fill and fee behavior. |
| File path | apps/api/src/modules/exchange/liveOrderAdapter.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] |
| Used by | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Local adapter proof only. |

## Relations

- verified_by <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
