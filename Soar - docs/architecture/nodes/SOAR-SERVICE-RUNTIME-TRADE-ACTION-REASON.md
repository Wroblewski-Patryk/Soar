---
id: SOAR-SERVICE-RUNTIME-TRADE-ACTION-REASON
name: "Runtime trade action reason service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime trade action reason service

| Field | Value |
| --- | --- |
| Description | Formats runtime trade action reasons for monitoring and audit readability. |
| File path | apps/api/src/modules/bots/runtimeTradeActionReason.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-TRADE-LIFECYCLE]] |
| Used by | [[SOAR-SERVICE-RUNTIME-TRADES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-TRADES]] |
| Database related | [[SOAR-DB-TRADE]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime trade reason support. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
