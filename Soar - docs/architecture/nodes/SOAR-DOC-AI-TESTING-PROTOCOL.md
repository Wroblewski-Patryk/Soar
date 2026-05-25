---
id: SOAR-DOC-AI-TESTING-PROTOCOL
name: "AI testing protocol"
type: documentation
status: verified_local
layer: documentation
module: ai-assistant
feature: ai-assistant-foundation
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Required before any AI behavior completion claim.
tags: [soar-map, documentation, documentation, verified_local]
---

# AI testing protocol

| Field | Value |
| --- | --- |
| Description | AI testing protocol for prompt injection data leakage unauthorized access and multi-turn AI behavior checks. |
| File path | AI_TESTING_PROTOCOL.md |
| Related files | .codex/agents/ai-red-team-agent.md |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]] |
| Used by | [[SOAR-AGENT-AI-RED-TEAM]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Tests related | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Docs related | [[SOAR-AGENT-AI-RED-TEAM]] |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- enforces <- [[SOAR-AGENT-AI-RED-TEAM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
