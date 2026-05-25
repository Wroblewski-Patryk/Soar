---
id: SOAR-SERVICE-RUNTIME-TRADE-LIFECYCLE
name: "Runtime trade lifecycle service"
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

# Runtime trade lifecycle service

| Field | Value |
| --- | --- |
| Description | Maps runtime trade lifecycle state for monitoring and history views. |
| File path | apps/api/src/modules/bots/runtimeTradeLifecycle.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-TRADE]], [[SOAR-DB-ORDER]] |
| Used by | [[SOAR-SERVICE-RUNTIME-TRADES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-TRADES]] |
| Database related | [[SOAR-DB-TRADE]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime trade lifecycle support. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
