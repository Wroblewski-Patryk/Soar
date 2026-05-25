---
id: SOAR-WORKFLOW-AI-ASSISTANT-FOUNDATION-CHAIN
name: "AI Assistant foundation workflow"
type: workflow
status: verified_local
layer: fullstack
module: ai-assistant
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# AI Assistant foundation workflow

| Field | Value |
| --- | --- |
| Description | Workflow from assistant UI through Web service API routes bot assistant service orchestrator DB tests docs and red-team protocol. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-AI-ASSISTANT-FOUNDATION.md |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-BOT-ASSISTANT]], [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-API]], [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]], [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]], [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Agent related | [[SOAR-AGENT-AI-RED-TEAM]] |
| Notes | Backfill workflow node for AI Assistant foundation slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
