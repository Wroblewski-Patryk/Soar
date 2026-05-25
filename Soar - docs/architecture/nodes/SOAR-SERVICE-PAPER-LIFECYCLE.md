---
id: SOAR-SERVICE-PAPER-LIFECYCLE
name: "Paper lifecycle service"
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

# Paper lifecycle service

| Field | Value |
| --- | --- |
| Description | Paper execution lifecycle support for simulated runtime actions. |
| File path | apps/api/src/modules/engine/paperLifecycle.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-PAPER-RUNTIME]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-PAPER-RUNTIME]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Paper lifecycle support. |

## Relations

- calls <- [[SOAR-SERVICE-PAPER-RUNTIME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
