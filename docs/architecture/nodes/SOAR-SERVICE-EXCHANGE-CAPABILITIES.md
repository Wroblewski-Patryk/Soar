---
id: SOAR-SERVICE-EXCHANGE-CAPABILITIES
name: "Exchange broad capabilities contract"
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

# Exchange broad capabilities contract

| Field | Value |
| --- | --- |
| Description | Broad exchange capability matrix and fail-closed assertion helpers. |
| File path | apps/api/src/modules/exchange/exchangeCapabilities.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-REGISTRY]], [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-CAPABILITY-CONTRACTS]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Broad family gate; exact operations still require exact contract. |

## Relations

- owns <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- uses <- [[SOAR-SERVICE-WALLETS]] (verified_local)
- uses <- [[SOAR-SERVICE-PROFILE-API-KEYS]] (verified_local)
- mirrors <- [[SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
