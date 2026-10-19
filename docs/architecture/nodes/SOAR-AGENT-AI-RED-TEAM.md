---
id: SOAR-AGENT-AI-RED-TEAM
name: "AI Red Team agent"
type: agent
status: deprecated
layer: agent-system
module: agents
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 0
last_verified_at: 2026-10-19
verification_status: deprecated
tags: [soar-map, agent, agent-system, deprecated]
---

# AI Red Team agent

| Field | Value |
| --- | --- |
| Description | Historical AI red-team agent; its prompt file is absent from the current checkout. |
| File path | history/tasks/ai-assistant-foundation-protocol-harness-2026-05-23-task.md |
| Related files | AI_TESTING_PROTOCOL.md |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Docs related | [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Former .codex/agents/ai-red-team-agent.md was removed in 0960b0979; this record preserves historical graph links and does not claim an active agent. |

## Relations

- enforces -> [[SOAR-DOC-AI-TESTING-PROTOCOL]] (deprecated)
- drives <- [[SOAR-PROMPT-AI-RED-TEAM]] (deprecated)
- governed_by <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (deprecated)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
