---
id: SOAR-SERVICE-RUNTIME-CAPITAL-CONTEXT
name: "Runtime capital context service"
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

# Runtime capital context service

| Field | Value |
| --- | --- |
| Description | Runtime capital context service for sizing and available-capital decisions. |
| File path | apps/api/src/modules/engine/runtimeCapitalContext.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]], [[SOAR-SERVICE-PRETRADE-RISK]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Capital context support service. |

## Relations

- calls <- [[SOAR-SERVICE-PRETRADE-RISK]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
