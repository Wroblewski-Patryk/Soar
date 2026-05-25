---
id: SOAR-SERVICE-RUNTIME-MARKET-TRUTH-STATE
name: "Runtime market truth state service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime market truth state service

| Field | Value |
| --- | --- |
| Description | Computes runtime market truth state for bot monitoring. |
| File path | apps/api/src/modules/bots/runtimeMarketTruthState.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK]], [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime market truth support. |

## Relations

- calls -> [[SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK]] (verified_local)
- calls <- [[SOAR-SERVICE-BOTS-RUNTIME-READ]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
