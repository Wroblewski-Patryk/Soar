---
id: SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES
name: "Web exchange capabilities"
type: utility
status: verified_local
layer: frontend
module: web-exchanges
feature: exchange-adapter
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Web exchange capabilities

| Field | Value |
| --- | --- |
| Description | Frontend exchange capability presentation helpers. |
| File path | apps/web/src/features/exchanges/exchangeCapabilities.ts |
| Related files | apps/web/src/features/exchanges/exchangeCapabilities.test.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Used by | [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]] |
| UI related | [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]] |
| API related | [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-EXCHANGE-CONNECTIONS]] |
| Docs related | [[SOAR-DOC-WEB-EXCHANGES]] |
| Agent related |  |
| Notes | Frontend capability helper. |

## Relations

- mirrors -> [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-EXCHANGE-CONNECTIONS]] (verified_local)
- uses <- [[SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
