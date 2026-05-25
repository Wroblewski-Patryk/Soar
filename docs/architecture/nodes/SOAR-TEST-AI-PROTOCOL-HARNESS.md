---
id: SOAR-TEST-AI-PROTOCOL-HARNESS
name: "AI protocol harness"
type: test
status: verified_local
layer: testing
module: ai-assistant
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# AI protocol harness

| Field | Value |
| --- | --- |
| Description | Reproducible AI protocol scenario harness for current assistant foundation boundaries. |
| File path | apps/api/src/modules/engine/assistantOrchestrator.protocol.test.ts |
| Related files | history/artifacts/ai-assistant-foundation-protocol-scenarios-2026-05-23.json |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]], [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]] |
| Docs related | [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Agent related | [[SOAR-AGENT-AI-RED-TEAM]] |
| Notes | Current protocol harness covers foundation scenarios only. |

## Relations

- verified_by <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
