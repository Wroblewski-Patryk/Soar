---
id: SOAR-SERVICE-RULE-EVALUATOR
name: "Rule evaluator service"
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

# Rule evaluator service

| Field | Value |
| --- | --- |
| Description | Runtime rule evaluator service for strategy signal conditions. |
| File path | apps/api/src/modules/engine/ruleEvaluator.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-STRATEGIES]] |
| Used by | [[SOAR-SERVICE-PAPER-RUNTIME]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-RUNTIME-STRATEGY-CONTEXT]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Strategy rule evaluation support. |

## Relations

- calls <- [[SOAR-SERVICE-PAPER-RUNTIME]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
