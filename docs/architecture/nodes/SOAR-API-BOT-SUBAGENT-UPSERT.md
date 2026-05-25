---
id: SOAR-API-BOT-SUBAGENT-UPSERT
name: "PUT /dashboard/bots/:id/assistant-config/subagents/:slotIndex"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: ai-assistant-foundation
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PUT /dashboard/bots/:id/assistant-config/subagents/:slotIndex

| Field | Value |
| --- | --- |
| Description | Authenticated bot subagent slot upsert route with slot limits. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts, apps/api/src/modules/bots/botAssistant.service.ts |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-TYPES-BOTS]], [[SOAR-SERVICE-BOT-ASSISTANT]] |
| Used by | [[SOAR-SERVICE-WEB-BOTS-API]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-API]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Agent related |  |
| Notes | Subagent slot mutation route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
