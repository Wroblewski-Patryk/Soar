---
id: SOAR-FEATURE-EXCHANGE-ADAPTER
name: "Exchange adapter boundary"
type: feature
status: verified
layer: backend
module: exchange
feature: exchange-adapter
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, feature, backend, verified]
---

# Exchange adapter boundary

| Field | Value |
| --- | --- |
| Description | Exchange-owned public authenticated and live-adapter capability boundary for Binance and Gate.io scope. |
| File path | docs/architecture/reference/exchange-access-ownership-matrix.md |
| Related files | docs/modules/api-exchange.md |
| Parent |  |
| Children | [[SOAR-SERVICE-EXCHANGE-REGISTRY]] |
| Depends on | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]], [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-REGISTRY]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-ADAPTER]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Exact operation support remains evidence-bound by exchange market type and operation. |

## Relations

- owns -> [[SOAR-SERVICE-EXCHANGE-REGISTRY]] (verified_local)
- owns -> [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] (verified_local)
- owns -> [[SOAR-SERVICE-EXCHANGE-EXECUTION-CAPABILITY]] (verified_local)
- owns -> [[SOAR-SERVICE-EXCHANGE-AUTH-READ-CONTRACT]] (verified_local)
- verified_by -> [[SOAR-TEST-EXCHANGE-CAPABILITY-CONTRACTS]] (verified_local)
- verified_by -> [[SOAR-TEST-EXCHANGE-AUTH-READ]] (verified_local)
- verified_by -> [[SOAR-TEST-LIVE-ORDER-ADAPTER]] (verified_local)
- governed_by -> [[SOAR-DOC-VENUE-CONTEXT]] (verified_local)
- documented_by -> [[SOAR-DOC-EXCHANGE-OWNERSHIP]] (verified_local)
- has_ui -> [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-EXCHANGES]] (verified_local)
- uses <- [[SOAR-SERVICE-ORDERS]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-AUTOMATION]] (verified_local)
- uses <- [[SOAR-SERVICE-POSITIONS]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] (verified_local)
- checks <- [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]] (verified_local)
- implements_adapter <- [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
