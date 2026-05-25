---
id: SOAR-FEATURE-AI-ASSISTANT-FOUNDATION
name: "AI Assistant foundation"
type: feature
status: verified_local
layer: fullstack
module: ai-assistant
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# AI Assistant foundation

| Field | Value |
| --- | --- |
| Description | Assistant foundation and dry-run configuration feature for bot-local main assistant and subagent slots. |
| File path | docs/architecture/11_assistant-runtime.md |
| Related files | docs/architecture/reference/assistant-runtime-contract.md, docs/product/ai-integration.md |
| Parent |  |
| Children | [[SOAR-PAGE-BOT-ASSISTANT]], [[SOAR-COMP-BOTS-ASSISTANT-TAB]], [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]], [[SOAR-SERVICE-BOT-ASSISTANT]], [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] |
| Depends on | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-PAGE-BOT-ASSISTANT]], [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT]], [[SOAR-API-BOT-SUBAGENT-UPSERT]], [[SOAR-API-BOT-SUBAGENT-DELETE]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-API]], [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]], [[SOAR-TEST-AI-ASSISTANT-WEB]], [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]], [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]], [[SOAR-DOC-AI-TESTING-PROTOCOL]], [[SOAR-DOC-AI-INTEGRATION]] |
| Agent related | [[SOAR-AGENT-AI-RED-TEAM]] |
| Notes | Foundation/dry-run only; hot-path trading orchestration remains deferred. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-BOT-ASSISTANT]] (verified_local)
- extends -> [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- verified_by -> [[SOAR-TEST-AI-ASSISTANT-API]] (verified_local)
- verified_by -> [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]] (verified_local)
- verified_by -> [[SOAR-TEST-AI-ASSISTANT-WEB]] (verified_local)
- verified_by -> [[SOAR-TEST-AI-PROTOCOL-HARNESS]] (verified_local)
- documented_by -> [[SOAR-DOC-ASSISTANT-RUNTIME]] (verified_local)
- documented_by -> [[SOAR-DOC-AI-INTEGRATION]] (verified_local)
- governed_by -> [[SOAR-AGENT-AI-RED-TEAM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
