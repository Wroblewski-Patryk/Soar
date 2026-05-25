---
id: SOAR-COMP-BOTS-ASSISTANT-TAB
name: "BotsAssistantTab"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: ai-assistant-foundation
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotsAssistantTab

| Field | Value |
| --- | --- |
| Description | Assistant tab UI for main assistant settings subagent slots and dry-run trace rendering. |
| File path | apps/web/src/features/bots/components/BotsAssistantTab.tsx |
| Related files | apps/web/src/features/bots/hooks/useBotsAssistantController.ts |
| Parent | [[SOAR-PAGE-BOT-ASSISTANT]] |
| Children |  |
| Depends on | [[SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER]] |
| Used by | [[SOAR-PAGE-BOT-ASSISTANT]], [[SOAR-COMP-BOTS-MANAGEMENT]] |
| UI related | [[SOAR-PAGE-BOT-ASSISTANT]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | UI tab is embedded in BotsManagement assistant mode. |

## Relations

- uses -> [[SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER]] (verified_local)
- renders <- [[SOAR-COMP-BOTS-MANAGEMENT]] (verified_local)
- verifies <- [[SOAR-TEST-AI-ASSISTANT-WEB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
