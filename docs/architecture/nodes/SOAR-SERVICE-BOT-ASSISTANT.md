---
id: SOAR-SERVICE-BOT-ASSISTANT
name: "Bot assistant service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot assistant service

| Field | Value |
| --- | --- |
| Description | Bot assistant configuration service and dry-run facade. |
| File path | apps/api/src/modules/bots/botAssistant.service.ts |
| Related files | apps/api/src/modules/bots/botsCommand.service.ts |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]], [[SOAR-DB-BOT]], [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Used by | [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-API]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Agent related |  |
| Notes | Owns config persistence and calls the deterministic assistant orchestrator for dry-runs. |

## Relations

- reads_writes -> [[SOAR-DB-BOT-ASSISTANT-CONFIG]] (verified_local)
- reads_writes -> [[SOAR-DB-BOT-SUBAGENT-CONFIG]] (verified_local)
- reads -> [[SOAR-DB-BOT]] (verified_local)
- calls -> [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]] (verified_local)
- calls <- [[SOAR-CONTROLLER-BOTS]] (verified_local)
- verifies <- [[SOAR-TEST-AI-ASSISTANT-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
