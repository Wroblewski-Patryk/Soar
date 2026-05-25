---
id: SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT
name: "Exchange API-key probe client factory"
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

# Exchange API-key probe client factory

| Field | Value |
| --- | --- |
| Description | Exchange-owned API-key probe client construction used by profile connection tests. |
| File path | apps/api/src/modules/exchange/exchangeApiKeyProbeClient.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] |
| Used by | [[SOAR-DOC-API-AUTH]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-API-KEY-PROBE]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Probe boundary prevents profile module from constructing clients directly. |

## Relations

- uses <- [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
