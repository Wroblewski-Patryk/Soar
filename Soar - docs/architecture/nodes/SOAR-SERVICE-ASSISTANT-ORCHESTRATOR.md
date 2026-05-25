---
id: SOAR-SERVICE-ASSISTANT-ORCHESTRATOR
name: "Assistant orchestrator service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Assistant orchestrator service

| Field | Value |
| --- | --- |
| Description | Deterministic assistant decision orchestrator with circuit breaker timeout and safety-mode trace semantics. |
| File path | apps/api/src/modules/engine/assistantOrchestrator.service.ts |
| Related files | apps/api/src/modules/engine/assistantOrchestrator.service.test.ts, apps/api/src/modules/engine/assistantOrchestrator.protocol.test.ts |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]], [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Used by | [[SOAR-SERVICE-BOT-ASSISTANT]] |
| UI related |  |
| API related | [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]], [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]], [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]] |
| Agent related |  |
| Notes | Current scope is foundation/dry-run and not runtime hot-path orchestration. |

## Relations

- implements_contract -> [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]] (verified_local)
- calls <- [[SOAR-SERVICE-BOT-ASSISTANT]] (verified_local)
- calls <- [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] (verified_local)
- verifies <- [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
