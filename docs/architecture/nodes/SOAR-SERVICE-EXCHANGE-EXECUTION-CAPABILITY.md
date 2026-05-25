---
id: SOAR-SERVICE-EXCHANGE-EXECUTION-CAPABILITY
name: "Exchange exact execution capability contract"
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

# Exchange exact execution capability contract

| Field | Value |
| --- | --- |
| Description | Exact exchange marketType operation support matrix for authenticated reads and live submit/cancel operations. |
| File path | apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]], [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-EXCHANGE-CAPABILITY-CONTRACTS]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Prevents inferring support from broad LIVE_EXECUTION flags. |

## Relations

- owns <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- governed_by <- [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
