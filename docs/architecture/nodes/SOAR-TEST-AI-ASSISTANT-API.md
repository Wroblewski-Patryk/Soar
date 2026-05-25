---
id: SOAR-TEST-AI-ASSISTANT-API
name: "AI Assistant API tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: ai-assistant-foundation
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# AI Assistant API tests

| Field | Value |
| --- | --- |
| Description | Bot assistant config CRUD subagent limit and dry-run API tests. |
| File path | apps/api/src/modules/bots/bots.orchestration.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT]], [[SOAR-API-BOT-SUBAGENT-UPSERT]], [[SOAR-API-BOT-SUBAGENT-DELETE]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Agent related |  |
| Notes | Primary assistant API proof. |

## Relations

- verifies -> [[SOAR-SERVICE-BOT-ASSISTANT]] (verified_local)
- verified_by <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
