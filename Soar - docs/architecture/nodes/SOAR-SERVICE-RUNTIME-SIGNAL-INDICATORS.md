---
id: SOAR-SERVICE-RUNTIME-SIGNAL-INDICATORS
name: "Runtime signal indicators service"
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

# Runtime signal indicators service

| Field | Value |
| --- | --- |
| Description | Maps runtime indicator state for strategy signals. |
| File path | apps/api/src/modules/bots/runtimeSignalIndicators.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-INDICATORS]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime indicator display support. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
