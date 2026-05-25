---
id: SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR
name: "AI Assistant orchestrator tests"
type: test
status: verified_local
layer: testing
module: api-engine
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# AI Assistant orchestrator tests

| Field | Value |
| --- | --- |
| Description | Assistant orchestrator unit and parity tests for decision trace safety. |
| File path | apps/api/src/modules/engine/assistantOrchestrator.service.test.ts |
| Related files | apps/api/src/modules/engine/assistantOrchestrator.parity.test.ts |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]] |
| Agent related |  |
| Notes | Primary orchestrator proof. |

## Relations

- verifies -> [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] (verified_local)
- verified_by <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
