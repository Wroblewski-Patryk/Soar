---
id: SOAR-AGENT-AI-RED-TEAM
name: "AI Red Team agent"
type: agent
status: verified_local
layer: agent-system
module: agents
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, agent, agent-system, verified_local]
---

# AI Red Team agent

| Field | Value |
| --- | --- |
| Description | Codex AI red-team agent prompt for AI behavior security and abuse-case review. |
| File path | .codex/agents/ai-red-team-agent.md |
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
| Notes | Agent record for AI adversarial review boundary. |

## Relations

- enforces -> [[SOAR-DOC-AI-TESTING-PROTOCOL]] (verified_local)
- drives <- [[SOAR-PROMPT-AI-RED-TEAM]] (verified_local)
- governed_by <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
