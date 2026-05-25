---
id: SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER
name: "useBotsAssistantController"
type: hook
status: verified_local
layer: frontend
module: web-bots
feature: ai-assistant-foundation
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useBotsAssistantController

| Field | Value |
| --- | --- |
| Description | Frontend controller hook for assistant config load save subagent slot mutation and dry-run execution. |
| File path | apps/web/src/features/bots/hooks/useBotsAssistantController.ts |
| Related files | apps/web/src/features/bots/services/bots.service.ts |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| UI related | [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT]], [[SOAR-API-BOT-SUBAGENT-UPSERT]], [[SOAR-API-BOT-SUBAGENT-DELETE]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Controller connects assistant UI to the shared Web bots API service. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- uses <- [[SOAR-COMP-BOTS-ASSISTANT-TAB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
