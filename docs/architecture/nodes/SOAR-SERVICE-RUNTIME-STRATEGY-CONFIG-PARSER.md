---
id: SOAR-SERVICE-RUNTIME-STRATEGY-CONFIG-PARSER
name: "Runtime strategy config parser service"
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

# Runtime strategy config parser service

| Field | Value |
| --- | --- |
| Description | Parses runtime strategy configuration for monitoring and execution context. |
| File path | apps/api/src/modules/bots/runtimeStrategyConfigParser.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-STRATEGY]], [[SOAR-FEATURE-STRATEGIES]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-RUNTIME-STRATEGY-CONTEXT]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime strategy config parsing support. |

## Relations

- calls <- [[SOAR-SERVICE-RUNTIME-STRATEGY-DISPLAY-BY-SYMBOL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
