---
id: SOAR-SERVICE-PAPER-RUNTIME
name: "Paper runtime service"
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

# Paper runtime service

| Field | Value |
| --- | --- |
| Description | Paper runtime execution service for simulated bot operation. |
| File path | apps/api/src/modules/engine/paperRuntime.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-PAPER-LIFECYCLE]], [[SOAR-SERVICE-RULE-EVALUATOR]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-PAPER-RUNTIME]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Paper runtime support. |

## Relations

- calls -> [[SOAR-SERVICE-PAPER-LIFECYCLE]] (verified_local)
- calls -> [[SOAR-SERVICE-RULE-EVALUATOR]] (verified_local)
- uses <- [[SOAR-SERVICE-SIMULATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
