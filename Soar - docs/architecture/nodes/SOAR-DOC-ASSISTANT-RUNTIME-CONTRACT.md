---
id: SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT
name: "Assistant runtime contract"
type: documentation
status: verified_local
layer: documentation
module: architecture
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# Assistant runtime contract

| Field | Value |
| --- | --- |
| Description | Reference contract for assistant runtime authority boundaries. |
| File path | docs/architecture/reference/assistant-runtime-contract.md |
| Related files | docs/architecture/11_assistant-runtime.md |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Agent related | [[SOAR-AGENT-AI-RED-TEAM]] |
| Notes | Current contract separates dry-run from runtime trading authority. |

## Relations

- implements_contract <- [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
