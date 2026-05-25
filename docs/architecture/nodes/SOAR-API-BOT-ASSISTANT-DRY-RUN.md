---
id: SOAR-API-BOT-ASSISTANT-DRY-RUN
name: "POST /dashboard/bots/:id/assistant-config/dry-run"
type: api_route
status: verified_local
layer: backend
module: api-bots
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /dashboard/bots/:id/assistant-config/dry-run

| Field | Value |
| --- | --- |
| Description | Authenticated assistant dry-run route returning an explainable decision trace without runtime trading authority. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/bots.controller.ts, apps/api/src/modules/bots/botAssistant.service.ts |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BOTS]], [[SOAR-TYPES-BOTS]], [[SOAR-SERVICE-BOT-ASSISTANT]], [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] |
| Used by | [[SOAR-SERVICE-WEB-BOTS-API]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-BOTS]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-API]], [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]], [[SOAR-TEST-AI-PROTOCOL-HARNESS]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]], [[SOAR-DOC-AI-TESTING-PROTOCOL]] |
| Agent related |  |
| Notes | Dry-run only; no hot-path runtime trading authority. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls -> [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
