---
id: SOAR-SERVICE-PRETRADE-RISK
name: "Pre-trade risk service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: runtime-support-services
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Pre-trade risk service

| Field | Value |
| --- | --- |
| Description | Pre-trade risk service for execution gating before order submission. |
| File path | apps/api/src/modules/engine/preTradeRisk.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-PRETRADE]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Risk gating support service. |

## Relations

- calls -> [[SOAR-SERVICE-RUNTIME-CAPITAL-CONTEXT]] (verified_local)
- checks <- [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
